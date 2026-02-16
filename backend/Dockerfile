FROM node:22-alpine AS builder

WORKDIR /app

# Copiar apenas os arquivos necessários para a instalação
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas as dependências (incluindo dev para o build)
RUN npm install

# Copiar o restante do código
COPY . .

# Gerar Prisma Client e fazer o build
RUN npx prisma generate
RUN npm run build

# --- Estágio de Execução ---
FROM node:22-alpine AS runner

# Instalar FFmpeg para gravações
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copiar artefatos do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Criar diretório para gravações
RUN mkdir -p /app/recordings

ENV NODE_ENV=production
EXPOSE 3001

# Executar migrações e iniciar o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
