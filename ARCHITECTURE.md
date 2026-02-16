# Multiview Platform - Architecture

## Stack
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT (access + refresh tokens)
- **Real-time**: WebSocket (Socket.IO)
- **Recording**: FFmpeg
- **Monitoring**: Prometheus + Grafana
- **Infrastructure**: Docker Compose

## Services
1. **nginx** - Reverse proxy + SSL termination
2. **frontend** - React SPA (Vite build)
3. **backend** - Express API + WebSocket
4. **postgres** - Database
5. **prometheus** - Metrics collection
6. **grafana** - Dashboards
