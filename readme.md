# Brazil Election Data Platform

Plataforma de dados eleitorais brasileiros utilizando dados oficiais do TSE.

## Estrutura

```
apps/
  collector/   — Ingestão de dados do TSE
  processor/   — Processamento e agregação
  api/         — API REST + WebSocket
  dashboard/   — Dashboard web (Next.js)
packages/
  shared/      — Utilidades compartilhadas
  types/       — Tipos e contratos
infra/
  docker/      — Docker Compose e Dockerfiles
  kubernetes/  — Manifests K8s
docs/          — Documentação
```

## Requisitos

- Node.js >= 20
- Docker & Docker Compose

## Setup

```bash
cp .env.example .env
npm install
```
