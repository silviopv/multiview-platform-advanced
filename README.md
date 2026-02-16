# 📺 MultiView Platform

Uma plataforma web avançada para monitoramento simultâneo de múltiplas streams de vídeo, com suporte a diversos protocolos, gravação, autenticação SaaS e monitoramento.

## 🚀 Funcionalidades

### Frontend
- **Grid Responsivo**: Visualize de 1 a 16 players simultaneamente.
- **Protocolos Suportados**: SRT, RTMP, RTMPS, RTSP, HLS.
- **Controle de Áudio**: Seleção individual de áudio com **VU Meter** visual.
- **Modo Fullscreen**: Alternância rápida para tela cheia por tile.
- **Presets de Layout**: Atalhos para layouts 2x2, 3x3, 4x4, etc.
- **Snapshots**: Capture imagens das streams para debug ou registro.
- **Métricas em Tempo Real**: Indicadores de bitrate, resolução e status de conexão.
- **Reconexão Agressiva**: Sistema inteligente de recuperação de sinal.

### Backend & SaaS
- **Autenticação JWT**: Sistema completo de login, registro e refresh tokens.
- **Gerenciamento de Streams**: CRUD completo de links e metadados.
- **Sistema de Gravação**: Gravação via FFmpeg (MP4/MKV) com agendamento.
- **Notificações**: Histórico de eventos online/offline e status de gravação.
- **Multi-idioma**: Suporte a Português, Inglês e Espanhol.
- **WebSocket**: Atualizações de status em tempo real via Socket.io.

### Infraestrutura & Monitoramento
- **Docker Compose**: Setup completo com um único comando.
- **Monitoramento**: Prometheus e Grafana integrados com dashboards pré-configurados.
- **Reverse Proxy**: Nginx configurado para roteamento e SSL.
- **Banco de Dados**: PostgreSQL 16 para persistência robusta.

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Zustand, Lucide React, HLS.js.
- **Backend**: Node.js, Express, Prisma ORM, FFmpeg, Socket.io, Prometheus Client.
- **Banco de Dados**: PostgreSQL.
- **Infraestrutura**: Docker, Nginx, Prometheus, Grafana.

## 📦 Como Instalar (VPS Hostinger / Local)

### Pré-requisitos
- Docker e Docker Compose instalados.
- Porta 80 (e 443 opcional) liberada.

### Passo a Passo

1. **Clone o repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd multiview-platform
   ```

2. **Configure o ambiente**:
   ```bash
   cp .env.example .env
   # Edite o .env com suas chaves e senhas
   nano .env
   ```

3. **Execute o script de deploy**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## ⌨️ Atalhos de Teclado (Multiview)

- `1`: Layout 1x1
- `2`: Layout 2x2
- `3`: Layout 3x3
- `4`: Layout 4x4
- `ESC`: Sair do modo Fullscreen
- `M`: Mutar/Desmutar áudio selecionado
- `5-9`: Selecionar áudio da stream por índice

## 📊 Monitoramento

Acesse o painel do Grafana em `http://seu-ip/grafana` (ou porta 3000) para visualizar métricas de:
- Taxa de requisições HTTP.
- Uso de CPU e Memória.
- Clientes WebSocket conectados.
- Status das gravações e erros de stream.

## 📄 Licença

Este projeto é de uso exclusivo para fins de monitoramento profissional.
