FROM python:3.11-slim

WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

EXPOSE 8001

CMD ["python", "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]