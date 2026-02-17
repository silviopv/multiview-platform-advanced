#!/bin/bash
set -e

# ============================================
# MultiView Platform - Deploy Script
# Para VPS Hostinger com Docker
# ============================================

echo "🚀 MultiView Platform - Deploy Script"
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker não encontrado. Instalando...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}Docker instalado com sucesso!${NC}"
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo -e "${YELLOW}Docker Compose não encontrado. Instalando...${NC}"
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
    echo -e "${GREEN}Docker Compose instalado com sucesso!${NC}"
fi

# Check .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}Arquivo .env não encontrado. Criando a partir do exemplo...${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️  IMPORTANTE: Edite o arquivo .env com suas configurações antes de continuar!${NC}"
    echo -e "${RED}   Execute: nano .env${NC}"
    exit 1
fi

# Create SSL directory
mkdir -p docker/nginx/ssl

# Build and start
echo -e "${GREEN}Construindo e iniciando os containers...${NC}"
docker compose build --no-cache
docker compose up -d

# Wait for PostgreSQL
echo -e "${YELLOW}Aguardando PostgreSQL iniciar...${NC}"
sleep 10

# Run migrations
echo -e "${GREEN}Executando migrações do banco de dados...${NC}"
docker compose exec backend npx prisma migrate deploy 2>/dev/null || true

# Run seed (optional)
echo -e "${GREEN}Executando seed do banco de dados...${NC}"
docker compose exec backend npx prisma db seed 2>/dev/null || true

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "🌐 Frontend:    http://localhost"
echo -e "🔌 API:         http://localhost/api/health"
echo -e "📊 Grafana:     http://localhost:3000"
echo -e "📈 Prometheus:  http://localhost:9090"
echo ""
echo -e "👤 Admin:  admin@multiview.com / admin123"
echo -e "👤 Demo:   demo@multiview.com / demo123"
echo ""
echo -e "${YELLOW}Para ver os logs: docker compose logs -f${NC}"
echo -e "${YELLOW}Para parar: docker compose down${NC}"
