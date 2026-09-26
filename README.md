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

VITE_ADMIN_UID=
VITE_RECAPTCHA_SITE_KEY=
```

`VITE_ADMIN_UID` é o UID do usuário curador no Firebase Auth — é ele que as
Security Rules reconhecem como admin. `VITE_RECAPTCHA_SITE_KEY` só é usada se o
App Check estiver registrado (ver *App Check* abaixo); vazio, o App Check não
inicializa.

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

Rode as regras e os índices com o Firebase CLI:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

As regras (`firestore.rules`) são **a camada de segurança** — todo controle de autorização mora nelas, com isolamento multi-tenant por `organizationId`. Nunca dependa do frontend para autorização.

### Modelo de aprovação de ONG

Toda ONG nasce com `status: 'pending'`. O painel do curador (`/admin/ongs`, só
para o UID em `VITE_ADMIN_UID`) move para `approved` ou `rejected`.

O que isso garante:

- **ONG em análise não existe publicamente.** A listagem pública só é provável
  para `status == 'approved'`, e a leitura individual de pending/rejected é
  negada. A ONG dona continua enxergando o próprio cadastro.
- **Ninguém se aprova sozinho.** `status` e `reviewedAt` estão fora da lista de
  campos que a ONG pode editar no próprio perfil.
- **ONG em análise não publica animal.** Criar animal exige e-mail verificado,
  ser dono da ONG e ONG aprovada.
- **ONG rejeitada não publica nem edita animal.** Rejeitar pelo painel também
  tira os animais da ONG do ar (`available: false`).
- **Um CNPJ = uma ONG.** O cadastro grava a trava `cnpj/{14 dígitos}` no mesmo
  batch do documento da ONG; a trava é create-only e não é legível, então CNPJ
  de terceiro não pode ser enumerado. Por isso o CNPJ é imutável depois do
  cadastro e só o admin apaga ONG.
- **Animal tem `ownerUid` denormalizado.** É o que permite ao painel listar
  "meus animais" com uma query que a regra consegue provar. Em `list`, a query
  falha inteira se a regra não for provável pelas constraints — por isso as
  queries sempre filtram por `status`/`available`/`ownerUid`.

## App Check

A proteção contra bots está em *App Check → reCAPTCHA v3*:

1. Registre uma chave reCAPTCHA v3 em *App Check*.
2. Preencha `VITE_RECAPTCHA_SITE_KEY` no `.env` e nos secrets do deploy.
3. Só depois registre o app e **aplique a enforcement**. Com a chave vazia o
   código não inicializa o App Check, então dá para testar antes de obrigar.

## Cloudinary — setup

1. Crie uma conta no [Cloudinary](https://cloudinary.com) (free tier).
2. Crie um **unsigned upload preset** em *Settings → Upload*.
3. Preencha `VITE_CLOUDINARY_CLOUD_NAME` e `VITE_CLOUDINARY_UPLOAD_PRESET` no `.env`.

## Deploy (GitHub Pages)

O workflow `.github/workflows/deploy.yml` faz build e publish em
`gh-pages` a cada push na `main`. Secrets obrigatórios no repositório:

- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
  `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
- `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`
- `VITE_ADMIN_UID` — UID do curador que as regras reconhecem como admin
- `VITE_RECAPTCHA_SITE_KEY` — só se o App Check estiver registrado

Sem `VITE_ADMIN_UID` no secret, o build continua funcionando, mas ninguém
consegue aprovar ONG: as regras rejeitam a escrita de `status`. O UID vem do
usuário criado no console do Firebase, não de e-mail.

## Rotas

Públicas: `/`, `/animais`, `/animais/:id`, `/ongs`, `/ongs/:id`, `/adocao-responsavel`, `/como-adotar`, `/sobre`.

Área da ONG (login + e-mail verificado): `/dashboard`, `/dashboard/animais`, `/dashboard/animais/novo`, `/dashboard/animais/editar/:id`, `/dashboard/perfil`.

Curadoria (login + UID admin): `/admin/ongs`.

## Arquitetura

- **Multi-tenant**: todo recurso pertence a uma ONG via `organizationId`. Uma ONG nunca lê/edita/exclui dados de outra (garantido pelas Security Rules).
- **Camada de serviços**: `src/services/auth/*` e `src/services/database/*` abstraem o Firebase — componentes não chamam Firebase diretamente.
- **Dados estáticos** ficam no repo (`src/data/`), não no banco. Firestore só para dados que a ONG altera.
- **Zero `undefined` em write**: o Firestore rejeita o documento inteiro se algum campo for `undefined`. `compact()` remove os campos vazios antes de qualquer `setDoc`/`updateDoc`.

## Roadmap

Feito no MVP: home, lista de animais com filtros, página do animal, página da ONG, doações via PIX, cadastro/login, dashboard, CRUD de animais, perfil da ONG, SEO, deploy config.

Funcionalidades futuras (§31 do plano): solicitação de adoção, dashboard com métricas, múltiplos usuários por ONG, moderação, notificações, PWA, mobile nativo.

> Este é um projeto social de custo zero. Antes de adicionar qualquer serviço externo, avalie se é realmente necessário.
