from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
import uuid
import jwt
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-here')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Security
security = HTTPBearer()

app = FastAPI(title="Codigo R - Trading Setup API")
api_router = APIRouter(prefix="/api")

# Models
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    video_url: Optional[str] = None
    buy_buttons: List[dict] = []
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    video_url: Optional[str] = None
    buy_buttons: List[dict] = []

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Analytics(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    page_views: int = 0
    video_views: int = 0
    button_clicks: int = 0
    conversions: int = 0
    date: datetime = Field(default_factory=datetime.utcnow)

class SiteConfig(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    site_title: str = "Codigo R - Trading Setup"
    hero_title: str = "DOMINE O MERCADO CRIPTO"
    hero_subtitle: str = "O Setup Completo que Transformou Minha Vida no Trading"
    vsl_title: str = "Assista ao Video e Descubra Como Ganhar Consistentemente"
    testimonials: List[dict] = []
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Utility functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"username": username})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user)

async def get_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# Routes
@api_router.get("/")
async def root():
    return {"message": "Codigo R Trading Setup API"}

# Site Configuration
@api_router.get("/config", response_model=SiteConfig)
async def get_site_config():
    config = await db.site_config.find_one()
    if not config:
        # Create default config
        default_config = SiteConfig()
        await db.site_config.insert_one(default_config.dict())
        return default_config
    return SiteConfig(**config)

@api_router.put("/config", response_model=SiteConfig)
async def update_site_config(config: SiteConfig, admin_user: User = Depends(get_admin_user)):
    config.updated_at = datetime.utcnow()
    await db.site_config.replace_one({"id": config.id}, config.dict(), upsert=True)
    return config

# Products
@api_router.get("/products", response_model=List[Product])
async def get_products():
    products = await db.products.find({"is_active": True}).to_list(100)
    return [Product(**product) for product in products]

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id, "is_active": True})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate, admin_user: User = Depends(get_admin_user)):
    product_dict = product.dict()
    product_obj = Product(**product_dict)
    await db.products.insert_one(product_obj.dict())
    return product_obj

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductCreate, admin_user: User = Depends(get_admin_user)):
    product_dict = product.dict()
    existing_product = await db.products.find_one({"id": product_id})
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = Product(id=product_id, **product_dict)
    await db.products.replace_one({"id": product_id}, updated_product.dict())
    return updated_product

# User Management
@api_router.post("/register")
async def register(user: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Create user
    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)
    user_obj = User(**user_dict)
    await db.users.insert_one(user_obj.dict())
    
    return {"message": "User created successfully"}

@api_router.post("/login")
async def login(user: UserLogin):
    db_user = await db.users.find_one({"username": user.username})
    if not db_user or db_user["password"] != hash_password(user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "is_admin": db_user.get("is_admin", False)}

# Analytics
@api_router.post("/analytics/page-view")
async def track_page_view():
    today = datetime.utcnow().date()
    analytics = await db.analytics.find_one({"date": {"$gte": datetime.combine(today, datetime.min.time())}})
    
    if analytics:
        await db.analytics.update_one(
            {"id": analytics["id"]},
            {"$inc": {"page_views": 1}}
        )
    else:
        new_analytics = Analytics(page_views=1)
        await db.analytics.insert_one(new_analytics.dict())
    
    return {"message": "Page view tracked"}

@api_router.post("/analytics/video-view")
async def track_video_view():
    today = datetime.utcnow().date()
    analytics = await db.analytics.find_one({"date": {"$gte": datetime.combine(today, datetime.min.time())}})
    
    if analytics:
        await db.analytics.update_one(
            {"id": analytics["id"]},
            {"$inc": {"video_views": 1}}
        )
    else:
        new_analytics = Analytics(video_views=1)
        await db.analytics.insert_one(new_analytics.dict())
    
    return {"message": "Video view tracked"}

@api_router.post("/analytics/button-click")
async def track_button_click():
    today = datetime.utcnow().date()
    analytics = await db.analytics.find_one({"date": {"$gte": datetime.combine(today, datetime.min.time())}})
    
    if analytics:
        await db.analytics.update_one(
            {"id": analytics["id"]},
            {"$inc": {"button_clicks": 1}}
        )
    else:
        new_analytics = Analytics(button_clicks=1)
        await db.analytics.insert_one(new_analytics.dict())
    
    return {"message": "Button click tracked"}

@api_router.get("/analytics", response_model=List[Analytics])
async def get_analytics(admin_user: User = Depends(get_admin_user)):
    analytics = await db.analytics.find().sort("date", -1).limit(30).to_list(30)
    return [Analytics(**analytic) for analytic in analytics]

# Initialize admin user
@api_router.post("/init-admin")
async def init_admin():
    admin_exists = await db.users.find_one({"is_admin": True})
    if admin_exists:
        return {"message": "Admin already exists"}
    
    admin_user = User(
        username="admin",
        email="admin@codigor.com",
        is_admin=True
    )
    
    admin_dict = admin_user.dict()
    admin_dict["password"] = hash_password("admin123")
    await db.users.insert_one(admin_dict)
    
    return {"message": "Admin user created", "username": "admin", "password": "admin123"}

# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()