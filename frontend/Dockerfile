FROM node:22-alpine AS builder

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências usando pnpm
RUN pnpm install --frozen-lockfile

# Copiar o restante do código e fazer o build
COPY . .
RUN pnpm build

# --- Estágio de Execução com Nginx ---
FROM nginx:alpine AS runner

# Copiar build do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
