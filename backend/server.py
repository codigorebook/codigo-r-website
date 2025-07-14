from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
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
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'codigo-r-super-secret-key-2024')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Security
security = HTTPBearer()

app = FastAPI(title="Codigo R - Trading Setup API")
api_router = APIRouter(prefix="/api")

# Enhanced Models
class SectionToggle(BaseModel):
    # Main Sections
    header: bool = True
    hero: bool = True
    vsl: bool = True
    features: bool = True
    proofs_of_gains: bool = True
    testimonials: bool = True
    pricing: bool = True
    faq: bool = True
    footer: bool = True
    
    # Granular Controls
    hero_subtitle: bool = True
    hero_cta_buttons: bool = True
    features_icons: bool = True
    features_descriptions: bool = True
    pricing_original_price: bool = True
    pricing_guarantee: bool = True
    testimonials_ratings: bool = True
    testimonials_photos: bool = True
    footer_social_links: bool = True
    footer_contact_info: bool = True
    vsl_description: bool = True
    vsl_thumbnail: bool = True

class VSLConfig(BaseModel):
    enabled: bool = True
    title: str = "Assista ao Video e Descubra Como Ganhar Consistentemente"
    subtitle: str = "Veja como eu transformei apenas R$ 1.000 em mais de R$ 100.000"
    video_url: str = ""
    video_thumbnail: str = ""
    call_to_action: str = "Assista Agora"
    description: str = "Este vídeo contém informações confidenciais do meu método"

class GeoPlatformMapping(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    country_code: str  # BR, US, CA, etc.
    country_name: str  # Brasil, United States, etc.
    primary_platform: str  # hotmart, clickbank, monetizze
    backup_platforms: List[str] = []  # plataformas alternativas
    enabled: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PlatformConfig(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    platform_name: str  # hotmart, clickbank, monetizze, eduzz, kiwify
    display_name: str   # Nome para exibição
    base_url: str      # URL da plataforma
    commission_rate: Optional[float] = None  # Taxa de comissão
    supported_countries: List[str] = []  # Países suportados
    payment_methods: List[str] = []  # Métodos de pagamento
    enabled: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProofOfGains(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    amount: Optional[str] = None  # Agora opcional
    date: str
    image_base64: Optional[str] = None  # Imagem em base64
    image_alt: Optional[str] = None     # Texto alternativo para acessibilidade
    show_amount: bool = True            # Nova opção para mostrar/ocultar valor
    enabled: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FunnelStep(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    enabled: bool = True
    order: int = 1

class FunnelConfig(BaseModel):
    enabled: bool = True
    title: str = "Funil de Vendas Otimizado"
    steps: List[FunnelStep] = []

class EbookContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: str
    description: str
    price: float
    original_price: Optional[float] = None
    features: List[str] = []
    bonuses: List[str] = []
    testimonials: List[dict] = []
    buy_buttons: List[dict] = []
    enabled: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SiteContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    # Hero Section
    hero_title: str = "DOMINE O MERCADO CRIPTO"
    hero_subtitle: str = "O Setup Completo que Transformou Minha Vida no Trading"
    hero_description: str = "Descubra o método que uso para gerar lucros consistentes"
    hero_cta_primary: str = "Ver Vídeo Agora"
    hero_cta_secondary: str = "Comprar Agora"
    
    # Features Section
    features_title: str = "O Que Você Vai Aprender"
    features_subtitle: str = "Tudo o que você precisa para se tornar um trader profissional"
    features_list: List[dict] = []
    
    # Testimonials Section
    testimonials_title: str = "Depoimentos de Quem Já Lucra"
    testimonials_subtitle: str = "Veja os resultados reais de pessoas que aplicaram o método"
    
    # Proofs of Gains Section
    proofs_title: str = "Provas de Ganhos Reais"
    proofs_subtitle: str = "Resultados comprovados do método Codigo R"
    proofs_of_gains: List[ProofOfGains] = []
    
    # Geo-targeting and Platform Configuration
    geo_targeting_enabled: bool = True
    geo_platform_mappings: List[GeoPlatformMapping] = []
    platform_configs: List[PlatformConfig] = []
    default_platform: str = "hotmart"  # Fallback se não detectar país
    
    # Pricing Section
    pricing_title: str = "Investimento Único"
    pricing_subtitle: str = "Acesso completo ao método que mudou minha vida"
    pricing_guarantee: str = "GARANTIA DE 7 DIAS - 100% do seu dinheiro de volta"
    
    # Footer
    footer_description: str = "Transformando traders iniciantes em profissionais lucrativos"
    footer_contact_email: str = "contato@codigor.com"
    footer_contact_phone: str = "(11) 99999-9999"
    footer_social_links: List[dict] = []
    
    # Toggle Controls
    sections: SectionToggle = SectionToggle()
    vsl_config: VSLConfig = VSLConfig()
    funnel_config: FunnelConfig = FunnelConfig()
    
    updated_at: datetime = Field(default_factory=datetime.utcnow)

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
@api_router.get("/config")
async def get_config():
    """Endpoint de configuração geral do site - compatibilidade com frontend"""
    content = await db.site_content.find_one()
    if not content:
        return {}
    
    # Retorna apenas os campos que o frontend espera
    return {
        "hero_title": content.get("hero_title", ""),
        "hero_subtitle": content.get("hero_subtitle", ""),
        "hero_description": content.get("hero_description", ""),
        "testimonials": content.get("testimonials", []),
        "proofs_title": content.get("proofs_title", "Provas de Ganhos Reais"),
        "proofs_subtitle": content.get("proofs_subtitle", "Resultados comprovados"),
        "vsl_config": content.get("vsl_config", {}),
        "geo_targeting_enabled": content.get("geo_targeting_enabled", False)
    }

# Enhanced Site Content Management
@api_router.get("/site-content", response_model=SiteContent)
async def get_site_content():
    content = await db.site_content.find_one()
    if not content:
        # Create default content with enhanced features
        default_features = [
            {
                "icon": "📈",
                "title": "Setup Completo",
                "description": "Configuração passo a passo de todas as ferramentas necessárias",
                "enabled": True
            },
            {
                "icon": "💰",
                "title": "Estratégias Rentáveis",
                "description": "Métodos testados e aprovados para gerar lucros consistentes",
                "enabled": True
            },
            {
                "icon": "🎯",
                "title": "Gestão de Risco",
                "description": "Aprenda a proteger seu capital e nunca mais perder dinheiro",
                "enabled": True
            },
            {
                "icon": "📊",
                "title": "Análise Técnica",
                "description": "Domine os indicadores mais importantes para decisões certeiras",
                "enabled": True
            },
            {
                "icon": "🤖",
                "title": "Automação",
                "description": "Configure bots e alertas para nunca perder oportunidades",
                "enabled": True
            },
            {
                "icon": "🏆",
                "title": "Mindset Vencedor",
                "description": "Desenvolva a mentalidade necessária para ser um trader profissional",
                "enabled": True
            }
        ]
        
        default_content = SiteContent(features_list=default_features)
        await db.site_content.insert_one(default_content.dict())
        return default_content
    return SiteContent(**content)

@api_router.put("/site-content", response_model=SiteContent)
async def update_site_content(content: SiteContent, admin_user: User = Depends(get_admin_user)):
    content.updated_at = datetime.utcnow()
    await db.site_content.replace_one({"id": content.id}, content.dict(), upsert=True)
    return content

# Ebook Content Management
@api_router.get("/ebooks", response_model=List[EbookContent])
async def get_ebooks():
    ebooks = await db.ebooks.find({"enabled": True}).to_list(100)
    return [EbookContent(**ebook) for ebook in ebooks]

@api_router.get("/ebooks/{ebook_id}", response_model=EbookContent)
async def get_ebook(ebook_id: str):
    ebook = await db.ebooks.find_one({"id": ebook_id})
    if not ebook:
        raise HTTPException(status_code=404, detail="Ebook not found")
    return EbookContent(**ebook)

@api_router.post("/ebooks", response_model=EbookContent)
async def create_ebook(ebook: EbookContent, admin_user: User = Depends(get_admin_user)):
    await db.ebooks.insert_one(ebook.dict())
    return ebook

@api_router.put("/ebooks/{ebook_id}", response_model=EbookContent)
async def update_ebook(ebook_id: str, ebook: EbookContent, admin_user: User = Depends(get_admin_user)):
    existing_ebook = await db.ebooks.find_one({"id": ebook_id})
    if not existing_ebook:
        raise HTTPException(status_code=404, detail="Ebook not found")
    
    ebook.id = ebook_id
    await db.ebooks.replace_one({"id": ebook_id}, ebook.dict())
    return ebook

@api_router.delete("/ebooks/{ebook_id}")
async def delete_ebook(ebook_id: str, admin_user: User = Depends(get_admin_user)):
    result = await db.ebooks.delete_one({"id": ebook_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ebook not found")
    return {"message": "Ebook deleted successfully"}

# VSL Management
@api_router.get("/vsl-config", response_model=VSLConfig)
async def get_vsl_config():
    content = await db.site_content.find_one()
    if not content:
        return VSLConfig()
    return VSLConfig(**content.get("vsl_config", {}))

@api_router.put("/vsl-config", response_model=VSLConfig)
async def update_vsl_config(vsl_config: VSLConfig, admin_user: User = Depends(get_admin_user)):
    content = await db.site_content.find_one()
    if content:
        content["vsl_config"] = vsl_config.dict()
        content["updated_at"] = datetime.utcnow()
        await db.site_content.replace_one({"id": content["id"]}, content)
    return vsl_config

# Funnel Management
@api_router.get("/funnel-config", response_model=FunnelConfig)
async def get_funnel_config():
    content = await db.site_content.find_one()
    if not content:
        return FunnelConfig()
    return FunnelConfig(**content.get("funnel_config", {}))

@api_router.put("/funnel-config", response_model=FunnelConfig)
async def update_funnel_config(funnel_config: FunnelConfig, admin_user: User = Depends(get_admin_user)):
    content = await db.site_content.find_one()
    if content:
        content["funnel_config"] = funnel_config.dict()
        content["updated_at"] = datetime.utcnow()
        await db.site_content.replace_one({"id": content["id"]}, content)
    return funnel_config

# Proofs of Gains Management
@api_router.get("/proofs-of-gains", response_model=List[ProofOfGains])
async def get_proofs_of_gains():
    content = await db.site_content.find_one()
    if not content:
        return []
    return [ProofOfGains(**proof) for proof in content.get("proofs_of_gains", [])]

@api_router.post("/proofs-of-gains", response_model=ProofOfGains)
async def create_proof_of_gains(proof: ProofOfGains, admin_user: User = Depends(get_admin_user)):
    content = await db.site_content.find_one()
    if not content:
        content = SiteContent().dict()
    
    if "proofs_of_gains" not in content:
        content["proofs_of_gains"] = []
    
    # Garantir que o ID seja único
    if proof.id == 'new' or not proof.id:
        proof.id = str(uuid.uuid4())
    
    # Verificar se já existe um proof com esse ID
    existing_ids = [p.get("id") for p in content["proofs_of_gains"] if p and isinstance(p, dict)]
    while proof.id in existing_ids:
        proof.id = str(uuid.uuid4())
    
    # Validar dados da prova antes de salvar
    proof_dict = proof.dict()
    
    # Validações adicionais
    if not proof_dict.get("title") or not proof_dict.get("description"):
        raise HTTPException(status_code=400, detail="Título e descrição são obrigatórios")
    
    # Validar base64 se presente
    if proof_dict.get("image_base64"):
        image_data = proof_dict["image_base64"]
        if not isinstance(image_data, str) or len(image_data) < 100:
            raise HTTPException(status_code=400, detail="Dados da imagem inválidos")
    
    # Garantir campos obrigatórios
    proof_dict.setdefault("enabled", True)
    proof_dict.setdefault("show_amount", True)
    proof_dict.setdefault("date", datetime.utcnow().strftime("%d/%m/%Y"))
    
    content["proofs_of_gains"].append(proof_dict)
    content["updated_at"] = datetime.utcnow()
    
    try:
        await db.site_content.replace_one({"id": content["id"]}, content, upsert=True)
        return ProofOfGains(**proof_dict)
    except Exception as e:
        print(f"Erro ao salvar prova: {e}")
        raise HTTPException(status_code=500, detail="Erro interno ao salvar prova")

@api_router.put("/proofs-of-gains/{proof_id}", response_model=ProofOfGains)
async def update_proof_of_gains(proof_id: str, updated_proof: ProofOfGains, admin_user: User = Depends(get_admin_user)):
    content = await db.site_content.find_one()
    if not content:
        raise HTTPException(status_code=404, detail="Site content not found")
    
    proofs = content.get("proofs_of_gains", [])
    for i, proof in enumerate(proofs):
        if proof.get("id") == proof_id:
            proofs[i] = updated_proof.dict()
            content["proofs_of_gains"] = proofs
            content["updated_at"] = datetime.utcnow()
            await db.site_content.replace_one({"id": content["id"]}, content)
            return updated_proof
    
    raise HTTPException(status_code=404, detail="Proof of gains not found")

@api_router.delete("/proofs-of-gains/{proof_id}")
async def delete_proof_of_gains(proof_id: str, admin_user: User = Depends(get_admin_user)):
    content = await db.site_content.find_one()
    if not content:
        raise HTTPException(status_code=404, detail="Site content not found")
    
    proofs = content.get("proofs_of_gains", [])
    initial_length = len(proofs)
    
    # Debug log
    print(f"Tentando deletar proof com ID: {proof_id}")
    print(f"IDs existentes: {[p.get('id') for p in proofs]}")
    
    # Filtrar removendo apenas o proof com o ID específico
    filtered_proofs = []
    for proof in proofs:
        if proof.get("id") != proof_id:
            filtered_proofs.append(proof)
    
    if len(filtered_proofs) == initial_length:
        raise HTTPException(status_code=404, detail=f"Proof of gains with ID {proof_id} not found")
    
    content["proofs_of_gains"] = filtered_proofs
    content["updated_at"] = datetime.utcnow()
    await db.site_content.replace_one({"id": content["id"]}, content)
    
    print(f"Proof deletado. Restam {len(filtered_proofs)} proofs")
    return {"message": "Proof of gains deleted successfully"}

# Geo-targeting and Platform Management
@api_router.get("/geo-config")
async def get_geo_config():
    content = await db.site_content.find_one()
    if not content:
        return {
            "geo_targeting_enabled": True,
            "geo_platform_mappings": [],
            "platform_configs": [],
            "default_platform": "hotmart"
        }
    
    return {
        "geo_targeting_enabled": content.get("geo_targeting_enabled", True),
        "geo_platform_mappings": content.get("geo_platform_mappings", []),
        "platform_configs": content.get("platform_configs", []),
        "default_platform": content.get("default_platform", "hotmart")
    }

@api_router.put("/geo-config")
async def update_geo_config(config_data: dict, admin_user: User = Depends(get_admin_user)):
    content = await db.site_content.find_one()
    if not content:
        content = SiteContent().dict()
    
    content.update({
        "geo_targeting_enabled": config_data.get("geo_targeting_enabled", True),
        "geo_platform_mappings": config_data.get("geo_platform_mappings", []),
        "platform_configs": config_data.get("platform_configs", []),
        "default_platform": config_data.get("default_platform", "hotmart"),
        "updated_at": datetime.utcnow()
    })
    
    await db.site_content.replace_one({"id": content["id"]}, content, upsert=True)
    return {"message": "Geo configuration updated successfully"}

@api_router.get("/detect-country")
async def detect_country(request: Request):
    """Detecta o país do usuário baseado no IP"""
    try:
        # Pegar IP real do usuário
        client_ip = request.client.host
        forwarded_for = request.headers.get("X-Forwarded-For")
        real_ip = request.headers.get("X-Real-IP")
        
        # Priorizar headers de proxy
        if forwarded_for:
            client_ip = forwarded_for.split(',')[0].strip()
        elif real_ip:
            client_ip = real_ip
            
        # Para desenvolvimento local, usar IP público
        if client_ip in ['127.0.0.1', 'localhost', '::1']:
            client_ip = '8.8.8.8'  # IP público para teste
            
        # Usar API gratuita de geolocalização
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.get(f"http://ip-api.com/json/{client_ip}")
            data = response.json()
            
            if data.get("status") == "success":
                return {
                    "country_code": data.get("countryCode"),
                    "country_name": data.get("country"),
                    "region": data.get("regionName"),
                    "city": data.get("city"),
                    "ip": client_ip
                }
            else:
                return {
                    "country_code": "BR",  # Fallback para Brasil
                    "country_name": "Brazil",
                    "region": "Unknown",
                    "city": "Unknown",
                    "ip": client_ip
                }
                
    except Exception as e:
        print(f"Error detecting country: {e}")
        return {
            "country_code": "BR",  # Fallback para Brasil
            "country_name": "Brazil", 
            "region": "Unknown",
            "city": "Unknown",
            "ip": "unknown"
        }

@api_router.get("/recommended-platform/{country_code}")
async def get_recommended_platform(country_code: str):
    """Retorna a plataforma recomendada para um país específico"""
    content = await db.site_content.find_one()
    if not content or not content.get("geo_targeting_enabled", True):
        return {"platform": content.get("default_platform", "hotmart")}
    
    # Buscar mapeamento para o país
    mappings = content.get("geo_platform_mappings", [])
    for mapping in mappings:
        if mapping.get("country_code") == country_code and mapping.get("enabled", True):
            return {
                "platform": mapping.get("primary_platform"),
                "backup_platforms": mapping.get("backup_platforms", []),
                "country": mapping.get("country_name")
            }
    
    # Fallback para plataforma padrão
    return {"platform": content.get("default_platform", "hotmart")}

# Section Toggle Management
@api_router.get("/sections", response_model=SectionToggle)
async def get_sections():
    content = await db.site_content.find_one()
    if not content:
        return SectionToggle()
    return SectionToggle(**content.get("sections", {}))

@api_router.put("/sections", response_model=SectionToggle)
async def update_sections(sections: SectionToggle, admin_user: User = Depends(get_admin_user)):
    content = await db.site_content.find_one()
    if content:
        content["sections"] = sections.dict()
        content["updated_at"] = datetime.utcnow()
        await db.site_content.replace_one({"id": content["id"]}, content)
    return sections

# Products (Legacy - keeping for compatibility)
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
    existing_user = await db.users.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
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