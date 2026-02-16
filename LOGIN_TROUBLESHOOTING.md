# 🔐 Guia de Troubleshooting - Sistema de Login

## Problema: Login não funciona

### Passo 1: Verificar se o banco de dados foi inicializado

Execute os seguintes comandos para verificar e inicializar o banco de dados:

```bash
# Verificar conexão com banco de dados
docker compose exec backend npm run db:check

# Executar migrações
docker compose exec backend npx prisma migrate deploy

# Fazer seed com usuários de teste
docker compose exec backend npm run db:seed
```

Você deve ver uma saída como:

```
✅ Conexão com banco de dados estabelecida
✅ Tabela Users: 2 usuários
✅ Tabela Streams: 4 streams
✅ Tabela Recordings: 0 gravações
✅ Usuário admin encontrado

✨ Banco de dados está OK!
```

### Passo 2: Verificar logs do backend

```bash
docker compose logs backend -f
```

Procure por erros como:

- `Error: connect ECONNREFUSED` - PostgreSQL não está respondendo
- `Error: P1002` - Prisma não consegue conectar ao banco
- `JWT_SECRET not defined` - Variável de ambiente não configurada

### Passo 3: Verificar variáveis de ambiente

Verifique se o arquivo `.env` foi criado corretamente:

```bash
cat .env | grep -E "DATABASE_URL|JWT_SECRET|CORS_ORIGIN"
```

Deve retornar algo como:

```
DATABASE_URL=postgresql://multiview:multiview_secret@postgres:5432/multiview_db?schema=public
JWT_SECRET=sua-chave-secreta-aqui
CORS_ORIGIN=http://103.199.185.49:7000
```

### Passo 4: Testar login via API

Use `curl` para testar o endpoint de login diretamente:

```bash
curl -X POST http://103.199.185.49:7000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@multiview.com",
    "password": "demo123"
  }'
```

Você deve receber uma resposta como:

```json
{
  "user": {
    "id": "uuid-aqui",
    "email": "demo@multiview.com",
    "name": "Usuário Demo",
    "role": "USER",
    "language": "pt-BR"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Se receber um erro, verifique:

- **401 Unauthorized**: Email ou senha incorretos. Verifique se o seed foi executado.
- **500 Internal Server Error**: Problema no servidor. Verifique os logs.
- **Connection refused**: Backend não está respondendo. Verifique se está rodando.

### Passo 5: Verificar CORS

Se o frontend consegue acessar a página mas não consegue fazer login, pode ser um problema de CORS.

Verifique se a variável `CORS_ORIGIN` está correta:

```bash
docker compose exec backend env | grep CORS_ORIGIN
```

Deve retornar:

```
CORS_ORIGIN=http://103.199.185.49:7000
```

Se estiver errado, edite o `.env` e reinicie:

```bash
docker compose restart backend
```

### Passo 6: Limpar cache do navegador

Às vezes o navegador armazena em cache dados antigos. Limpe:

1. Abra as DevTools (F12)
2. Vá para Application > Local Storage
3. Delete todos os itens de `http://103.199.185.49:7000`
4. Recarregue a página

## Credenciais de Teste

Após executar o seed, você terá acesso a:

| Email | Senha | Tipo |
|-------|-------|------|
| admin@multiview.com | admin123 | Admin |
| demo@multiview.com | demo123 | Usuário |

## Verificar se o Prisma Client foi gerado

```bash
docker compose exec backend ls -la node_modules/@prisma/client/index.d.ts
```

Se o arquivo não existir, regenere:

```bash
docker compose exec backend npx prisma generate
```

## Reiniciar tudo do zero

Se nada funcionar, você pode reiniciar completamente:

```bash
# Parar todos os containers
docker compose down

# Remover volumes (CUIDADO: apaga dados!)
docker volume rm multiview-platform_postgres-data

# Reconstruir e iniciar
docker compose up -d

# Executar migrações e seed
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run db:seed
```

## Verificar conectividade entre containers

```bash
# Testar conexão do backend com PostgreSQL
docker compose exec backend ping postgres

# Testar conexão do frontend com backend
docker compose exec frontend curl http://backend:3001/api/health
```

## Logs Úteis

```bash
# Ver todos os logs
docker compose logs

# Ver apenas logs do backend
docker compose logs backend

# Ver apenas logs do PostgreSQL
docker compose logs postgres

# Ver logs em tempo real
docker compose logs -f

# Ver últimas 100 linhas
docker compose logs --tail=100
```

---

**Se o problema persistir**, abra uma issue no GitHub com:

1. Saída de `docker compose ps`
2. Saída de `docker compose logs backend --tail=50`
3. Resultado de `curl -X POST http://103.199.185.49:7000/api/auth/login ...`
4. Seu arquivo `.env` (sem valores sensíveis)
