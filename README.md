# Still Here · Adoção Responsável

Plataforma web gratuita para auxiliar ONGs de proteção animal a divulgar animais para adoção e receber doações. Projeto universitário/social — custo operacional de R$ 0.

## Stack

- React + TypeScript + Vite + Tailwind CSS + React Router
- Firebase Authentication (email + senha)
- Firestore (dados dinâmicos)
- Cloudinary (free tier) para imagens
- Deploy estático (Netlify/Vercel/GitHub Pages)

Sem backend próprio. Segurança via Firebase Auth + Firestore Security Rules.

## Pré-requisitos

- Node.js (LTS) + npm
- Conta Firebase (plano Spark, grátis)
- Conta Cloudinary (free tier)

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

3. Preencha as variáveis (config público do Firebase) e o Cloudinary:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

> Config pública do Firebase não é segredo. Nunca inclua no repo: service account, private key ou credenciais Admin SDK.

4. Rode localmente:

```bash
npm run dev      # servidor Vite (http://localhost:5173)
npm run build    # typecheck + build de produção
npm run preview  # preview do build
```

5. (Opcional) Lint:

```bash
npm run lint
```

## Firebase — setup

### Authentication

Habilite o provedor **Email/Senha** em *Authentication → Sign-in method*.

### Firestore

Crie o banco em modo de testes para começar e depois publique as regras reais.

Rode as regras de segurança com o Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

As regras (`firestore.rules`) são **a camada de segurança** — todo controle de autorização mora nelas, com isolamento multi-tenant por `organizationId`. Nunca dependa do frontend para autorização.

## Cloudinary — setup

1. Crie uma conta no [Cloudinary](https://cloudinary.com) (free tier).
2. Crie um **unsigned upload preset** em *Settings → Upload*.
3. Preencha `VITE_CLOUDINARY_CLOUD_NAME` e `VITE_CLOUDINARY_UPLOAD_PRESET` no `.env`.

## Deploy (Netlify)

O arquivo `netlify.toml` já configura build e SPA redirect. Passos:

1. Conecte o repositório no [Netlify](https://netlify.com) (ou Vercel).
2. As env vars `VITE_FIREBASE_*` e `VITE_CLOUDINARY_*` devem ser configuradas no painel do host (não no repo).
3. Build automático: `npm run build`, publish `dist`.

## Rotas

Públicas: `/`, `/animais`, `/animais/:id`, `/ongs`, `/ongs/:id`, `/adocao-responsavel`, `/como-adotar`, `/sobre`.

Área da ONG (login): `/dashboard`, `/dashboard/animais`, `/dashboard/animais/novo`, `/dashboard/animais/editar/:id`, `/dashboard/perfil`.

## Arquitetura

- **Multi-tenant**: todo recurso pertence a uma ONG via `organizationId`. Uma ONG nunca lê/edita/exclui dados de outra (garantido pelas Security Rules).
- **Camada de serviços**: `src/services/auth/*` e `src/services/database/*` abstraem o Firebase — componentes não chamam Firebase diretamente.
- **Dados estáticos** ficam no repo (`src/data/`), não no banco. Firestore só para dados que a ONG altera.

## Roadmap

Feito no MVP: home, lista de animais com filtros, página do animal, página da ONG, doações via PIX, cadastro/login, dashboard, CRUD de animais, perfil da ONG, SEO, deploy config.

Funcionalidades futuras (§31 do plano): solicitação de adoção, dashboard com métricas, múltiplos usuários por ONG, moderação, notificações, PWA, mobile nativo.

> Este é um projeto social de custo zero. Antes de adicionar qualquer serviço externo, avalie se é realmente necessário.
