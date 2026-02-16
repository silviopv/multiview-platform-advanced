#!/bin/bash

# Cores para saída
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔄 Iniciando Reset e Deploy da Plataforma MultiView...${NC}"

# 1. Parar e remover tudo
echo "🛑 Parando containers antigos..."
docker compose down -v

# 2. Limpar cache do Docker (opcional, mas ajuda em erros de build)
# echo "🧹 Limpando cache do Docker..."
# docker builder prune -f

# 3. Verificar arquivo .env
if [ ! -f .env ]; then
    echo -e "${RED}⚠️ Arquivo .env não encontrado! Criando a partir do exemplo...${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️ Por favor, edite o arquivo .env com suas senhas e rode este script novamente.${NC}"
    exit 1
fi

# 4. Construir e subir
echo "🏗️ Construindo e iniciando containers..."
docker compose up -d --build

# 5. Aguardar banco de dados
echo "⏳ Aguardando banco de dados (15s)..."
sleep 15

# 6. Inicializar Banco de Dados
echo "🗄️ Inicializando banco de dados e usuários..."
docker compose exec -T backend npx prisma migrate deploy
docker compose exec -T backend npm run db:seed

# 7. Verificar Status
echo -e "${GREEN}✅ Status dos Containers:${NC}"
docker compose ps

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}🚀 Plataforma pronta em http://103.199.185.49:7000${NC}"
echo -e "${GREEN}👤 Login: admin@multiview.com / admin123${NC}"
echo -e "${GREEN}============================================${NC}"
