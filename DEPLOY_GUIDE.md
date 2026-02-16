# 🚀 Guia de Deploy - MultiView Platform

## Configuração para VPS Hostinger (IP: 103.199.185.49)

### Pré-requisitos
- Docker e Docker Compose instalados
- Porta 7000 disponível (frontend)
- Porta 7443 disponível (SSL - opcional)

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/silviopv/multiview-platform-advanced.git
cd multiview-platform-advanced
```

### Passo 2: Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```bash
nano .env
```

**Valores recomendados para sua VPS:**

```env
DOMAIN=103.199.185.49:7000
DB_PASSWORD=sua-senha-forte-aqui
JWT_SECRET=gere-com-openssl-rand-hex-64
JWT_REFRESH_SECRET=gere-com-openssl-rand-hex-64
GRAFANA_USER=admin
GRAFANA_PASSWORD=sua-senha-grafana
```

**Para gerar secrets seguros:**

```bash
openssl rand -hex 64
```

### Passo 3: Executar o Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

O script irá:
1. Verificar se Docker está instalado
2. Construir os containers (frontend, backend, PostgreSQL, Prometheus, Grafana)
3. Iniciar todos os serviços
4. Executar migrações do banco de dados
5. Fazer seed com usuários de teste

### Passo 4: Acessar a Plataforma

Após o deploy, acesse:

- **Frontend**: http://103.199.185.49:7000
- **API Health**: http://103.199.185.49:7000/api/health
- **Grafana**: http://103.199.185.49:7000/grafana (ou http://localhost:3000)
- **Prometheus**: http://103.199.185.49:7000/prometheus (ou http://localhost:9090)

### Credenciais Padrão

| Usuário | Email | Senha |
|---------|-------|-------|
| Admin | admin@multiview.com | admin123 |
| Demo | demo@multiview.com | demo123 |

## 🔧 Troubleshooting

### Problema: Login não funciona

**Solução 1: Verificar se o banco de dados foi inicializado**

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma db seed
```

**Solução 2: Verificar logs do backend**

```bash
docker compose logs backend -f
```

**Solução 3: Verificar conectividade com PostgreSQL**

```bash
docker compose exec backend npm run db:check
```

### Problema: Porta 7000 já está em uso

Se a porta 7000 estiver ocupada, altere no `docker-compose.yml`:

```yaml
nginx:
  ports:
    - "7001:80"  # Altere para outra porta disponível
    - "7444:443"
```

Depois reinicie:

```bash
docker compose down
docker compose up -d
```

### Problema: Frontend não consegue conectar com backend

Verifique se a variável `CORS_ORIGIN` no `.env` está correta:

```env
CORS_ORIGIN=http://103.199.185.49:7000
```

Reinicie o backend:

```bash
docker compose restart backend
```

### Problema: Gravações FFmpeg não funcionam

Verifique se FFmpeg está instalado no container:

```bash
docker compose exec backend ffmpeg -version
```

Se não estiver, instale:

```bash
docker compose exec backend apt-get update && apt-get install -y ffmpeg
```

## 📊 Monitoramento

### Acessar Grafana

1. Acesse http://103.199.185.49:7000/grafana
2. Login: admin / (sua senha do .env)
3. Dashboards pré-configurados estão disponíveis

### Métricas Disponíveis

- Taxa de requisições HTTP
- Latência de resposta
- Uso de CPU e Memória
- Clientes WebSocket conectados
- Status das gravações
- Erros de stream

## 🔐 Segurança

### Configurar SSL/TLS

1. Gere certificados (usando Let's Encrypt):

```bash
sudo certbot certonly --standalone -d seu-dominio.com
```

2. Copie os certificados para `docker/nginx/ssl/`:

```bash
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem docker/nginx/ssl/
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem docker/nginx/ssl/
```

3. Descomente a configuração HTTPS no `docker/nginx/nginx.conf`

4. Reinicie o Nginx:

```bash
docker compose restart nginx
```

### Alterar Senhas Padrão

Após o primeiro acesso, altere as senhas dos usuários admin e demo na página de Configurações.

## 📝 Comandos Úteis

```bash
# Ver logs em tempo real
docker compose logs -f

# Parar todos os serviços
docker compose down

# Reiniciar um serviço específico
docker compose restart backend

# Executar comando no container
docker compose exec backend npm run db:check

# Limpar volumes (CUIDADO: apaga dados!)
docker compose down -v

# Backup do banco de dados
docker compose exec postgres pg_dump -U multiview multiview_db > backup.sql

# Restaurar banco de dados
docker compose exec -T postgres psql -U multiview multiview_db < backup.sql
```

## 📞 Suporte

Para problemas ou dúvidas, verifique:

1. Os logs: `docker compose logs -f`
2. O status dos containers: `docker compose ps`
3. A conectividade de rede: `docker network ls`

---

**Última atualização**: Fevereiro 2026
