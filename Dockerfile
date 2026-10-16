# ==========================================
# Estágio 1: Build do Frontend (Vite + React)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

ARG VITE_ADMIN_EMAIL
ENV VITE_ADMIN_EMAIL=$VITE_ADMIN_EMAIL

ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

COPY frontend/ ./
RUN npm run build

# ==========================================
# Estágio 2: Backend Python + Frontend estático
# ==========================================
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instala dependências de compilação mínimas para psycopg2 e healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copia código da aplicação backend
COPY backend/ ./

# Copia o build estático gerado no estágio 1 para a pasta static do FastAPI
COPY --from=frontend-builder /app/frontend/dist /app/static

EXPOSE 8000

# Inicia o servidor Uvicorn na porta 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
