# Handoff — Still Here

Documento de continuidade, escrito para uma sessão **sem histórico de conversa** retomar o trabalho
com segurança. Atualizado em 2026-09-26 (revisão pós-deploy de segurança).

Leia inteiro antes de mexer em qualquer coisa.

---

## 1. Identidade do projeto

| Item | Valor |
|---|---|
| Repositório | `https://github.com/pedroplm/still-here` |
| Branch principal | `main` (deploy automático em todo push) |
| Domínio | `stillhere.com.br` |
| Registrador | registro.br, DNS nos servidores próprios (`a/b.auto.dns.br`) — **DNSSEC é automático e obrigatório lá** |
| Deploy | GitHub Pages via `.github/workflows/deploy.yml` |
| Backend | nenhum. Firebase Auth + Firestore + Cloudinary, tudo client-side |
| Firebase project | `still-here-9572a` |

### Contas

| Papel | E-mail | UID | Estado |
|---|---|---|---|
| Curador (admin) | `pedropalomo.ti@gmail.com` | `kimc5Hp2OpT4TsFyX15O8DQ5kBl2` | e-mail verificado |
| Dono da ONG demo | `teste@teste.com` | `dcJk9OXJAbUWKiDyL88OxWTrqOa2` | e-mail verificado |

A senha do admin foi gerada por script e está em
`%TEMP%\opencode\adminpw.txt` (fora do repo). **Rotacionar.** A senha de
`teste@teste.com` foi sobrescrita por valores aleatórios durante os testes de
regras — se precisar, resetar pelo Firebase Console.

### Comandos

```bash
npm run dev       # Vite em http://localhost:5173
npm run build     # tsc -b && vite build
npm run lint      # oxlint (deve sair com 0 warning)

firebase login
firebase deploy --only firestore:rules,firestore:indexes --project still-here-9572a
```

---

## 2. Estado atual

### Deploy e domínio

- `public/CNAME` contém `stillhere.com.br`.
- `vite.config.ts` lê esse arquivo: se existir, `base` vira `/`; senão vira `/still-here/`.
  Isso mantém o `github.io/still-here` funcionando caso o domínio seja removido.
- Efeito colateral importante: **com o CNAME presente, `pedroplm.github.io/still-here` responde
  301 para `stillhere.com.br`**. Verificado. Ou seja, não dá para ter os dois no ar ao mesmo tempo.
- `public/404.html` redireciona o fallback da SPA para `/` (estava fixo em `/still-here/`).

### SEO

- `public/og-default.png` — 1200×630, gerado a partir do `og-default.svg` existente.
  Feito com `sharp` instalado temporariamente e removido; `package-lock.json` ficou intacto.
- `src/hooks/usePageMeta.ts` — `SITE_URL` fixo `https://stillhere.com.br`, canonical e `og:url`
  montados de `SITE_URL + pathname`.
- `index.html` — tags OG/canonical estáticas para crawler que não executa JS.
- `public/robots.txt` — bloqueia `/dashboard`, `/login`, `/registrar`, aponta pro sitemap.
- `public/sitemap.xml` — 7 rotas públicas.

### Aprovação de ONGs (feature `e1717d2` + revisão de segurança)

Fluxo: cadastro → org nasce `pending` → tela "Cadastro em análise" no lugar do
dashboard → curador aprova/rejeita em `/admin/ongs`.

Arquivos da feature:

| Arquivo | Papel |
|---|---|
| `src/services/admin.ts` | `isAdminUid()` compara com `VITE_ADMIN_UID` |
| `src/services/rate-limit.ts` | 3 tentativas / 5 min em `localStorage` |
| `src/services/cnpj.ts` | máscara + consulta CNPJ no BrasilAPI |
| `src/components/OrgStatusNotice.tsx` | telas de pending / rejected / sem ONG |
| `src/hooks/useOrganization.ts` | carrega a org do usuário logado |
| `src/pages/AdminOrganizations.tsx` | painel de curadoria |

Detalhes que importam:

- **`getOrganizations()` filtra por query agora** (`where('status','==','approved')`), não no
  cliente. A ONG que já existia sem `status` foi corrigida: recebeu `status: 'approved'` por
  script. Não existe mais documento sem `status`.
- **Limite de tentativas é client-side.** Um bot apaga a chave do `localStorage` e ignora. Não é
  proteção real — ver item 5.4 do handoff antigo, hoje App Check.
- **CNPJ é obrigatório** e é consultado no BrasilAPI
  (`https://brasilapi.com.br/api/cnpj/v1/{cnpj}`). Se a API responde "não existe" ou situação
  ≠ `ATIVA`, barra o cadastro. Se a API está fora do ar, **não bloqueia**.

---

## 3. Segurança — o que já foi fechado

O objetivo era que ONG falsa não consiga operar na plataforma. As regras foram
reescritas, publicadas e **validadas com 49 casos contra o Firestore real**
(anônimo, dono, ONG em análise, curador) — 49/49 passaram.

### 3.1 Regras de `organizations`

- List pública só é provável com `status == 'approved'`. Sem filtro, a query é negada
  (403) — é o comportamento correto, não bug.
- `get` de pending/rejected é negado ao público; o dono e o admin continuam lendo.
- `create` exige `userId` próprio, `organizationId == docId`, `status == 'pending'` e
  `hasAll(['userId','name','cnpj','city','state'])`.
- `update`: `userId`, `cnpj` e `organizationId` são imutáveis para qualquer um. O dono só
  mexe na lista `orgProfileFields()` (`status` e `reviewedAt` ficam de fora — se entrassem,
  a ONG se aprovaria sozinha). O admin é livre dentro dessas três imutabilidades.
- `delete`: **só admin**. A trava de CNPJ é create-only, então apagar a ONG pelo dono
  deixaria o CNPJ reservado para sempre.

### 3.2 Regras de `animals`

- `create` exige `isEmailVerified()` + dono da ONG + **ONG aprovada** + `ownerUid` próprio.
- `update` exige o mesmo (admin passa direto). Sem isso, ONG rejeitada continuava
  republicando animais na home só de manter a sessão aberta.
- `organizationId` e `ownerUid` imutáveis no update.
- `ownerUid` é denormalizado: é o que permite ao painel listar "meus animais" com uma
  query que a regra consegue provar. Em `list`, a query falha inteira se a regra não for
  provável pelas constraints — por isso toda query pública filtra por
  `status`/`available`/`ownerUid`.

### 3.3 CNPJ único

`createOrganization` grava, num único `writeBatch`, a org + a trava
`cnpj/{14 dígitos}` com `{ organizationId, createdAt }`. A trava é create-only e
`allow read: if false` — CNPJ de terceiro não é enumerável. Duplicar dá 409.

### 3.4 E-mail verificado

- `register()` dispara `sendEmailVerification`.
- `ProtectedRoute` barra tudo que não for e-mail verificado, com reenvio e logout.
- `resendVerification(user)` e `requestPasswordReset(email)` em `auth.service.ts`.
- **Decisão:** a verificação **não** é exigida no `create` de `organizations`. Se fosse, o
  cadastro em duas etapas deixaria org órfã (criada antes do clique no e-mail). A barreira
  fica no `ProtectedRoute` e no `create` de `animals`. Efeito colateral aceito: usuário não
  verificado ainda consegue reservar CNPJ — o App Check é o que fecha isso.

### 3.5 Curadoria

`AdminOrganizations` aprova e rejeita com motivo. Rejeitar também chama
`hideOrganizationAnimals(organizationId)`, que põe `available: false` nos animais da ONG
(batch de 400). Sem isso, os animais já publicados continuariam na home depois da
rejeição. **Rejeitar sempre pelo painel**, não por script — a regra impede o dono de
republicar, mas não despublica o que já está no ar.

### 3.6 App Check (código pronto, falta ativar)

`src/services/firebase.config.ts` inicializa reCAPTCHA v3 **só** se
`VITE_RECAPTCHA_SITE_KEY` estiver preenchida. Vazio, não inicializa — dá para testar
antes de obrigar.

### 3.7 Armadilhas do Firestore já mordidas

Nenhuma dessas é óbvia; todas custaram tempo:

- **`undefined` rejeita o documento inteiro.** `updateDoc` com `{ foo: undefined }` falha.
  Todo write passa por `compact()`.
- **`DocProfile`/formulário não podem mandar `id` nem `status`.** A regra é estrita
  (`hasOnly`/`hasAll`); mandar campo a mais derruba a escrita. `OrgProfile` monta o
  payload na mão.
- **Query não provável = query negada.** Não dá para usar `get()` de outro documento em
  regra de `list`; tem que repetir a constraint.
- **`updateMask.fieldPaths` no REST é repetido**, não lista separada por vírgula:
  `?updateMask.fieldPaths=a&updateMask.fieldPaths=b`.
- **Token OAuth do Firebase CLI ignora as rules.** Ao testar por REST, um DELETE com o
  token do CLI passa mesmo com `allow delete: if false`. Para testar negação, use o
  **idToken** do usuário.

O harness usado para a validação ficou em `%TEMP%\opencode\verify-rules.ps1`
(fora do repo) e monta org fake, aprova/rejeita e mede 49 casos.

---

## 4. Pendências bloqueantes (precisa do Pedri)

### 4.1 DNS — o domínio ainda NÃO está no ar

Na última verificação, os servidores autoritativos devolviam zona vazia para o apex e NXDOMAIN
para `www`. Motivo provável: a transição de 2h do registro.br (remoção da chave DNSSEC antiga) não
tinha terminado. **Reconferir depois que a contagem zerar.**

Já cadastrado (pendente de publicação): 4 registros `A` do apex.

Falta adicionar: **CNAME de `www`**. A tela do registro.br que o Pedri encontrou só tinha os campos
"Nome" e "Endereço IPv4", ou seja, não achou o seletor de tipo de registro para CNAME. Sem isso
`www.stillhere.com.br` dá erro, embora o domínio sem `www` funcione.

Depois que o DNS resolver, no GitHub: **Settings → Pages → Custom domain = `stillhere.com.br` → Save**.
O GitHub retenta sozinho e vira verde. Aí ligar **Enforce HTTPS**.

Confirmação:

```powershell
nslookup stillhere.com.br          # esperado: 185.199.108/109/110/111.153
nslookup www.stillhere.com.br      # esperado: pedroplm.github.io
```

### 4.2 Secret `VITE_ADMIN_UID` no GitHub

Settings → Secrets and variables → Actions → `VITE_ADMIN_UID` = `kimc5Hp2OpT4TsFyX15O8DQ5kBl2`.
O `gh` CLI não está instalado nesta máquina, então não dá para criar por script.
O UID **já** está no `.env` local e em `firestore.rules` — só o secret falta. Sem ele o build
passa, mas o link "Admin" nunca aparece.

### 4.3 App Check

1. Firebase Console → App Check → registrar chave reCAPTCHA v3.
2. `VITE_RECAPTCHA_SITE_KEY` no `.env` e no secret do GitHub.
3. Testar em produção/staging **antes** de registrar o app.
4. Registrar o app e aplicar enforcement.

---

## 5. Secrets do GitHub Actions

Todos em `.github/workflows/deploy.yml`, block `env:` do passo de build.

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET
VITE_ADMIN_UID
VITE_RECAPTCHA_SITE_KEY
```

Config do Firebase é pública por design; o que **nunca** entra no repo é service account / private key.

Os domínios `stillhere.com.br` e `www.stillhere.com.br` já estão em Authentication → Settings →
**Authorized domains**, junto de `localhost`, `*.firebaseapp.com` e `*.web.app`.

---

## 6. Riscos e pendências conhecidos

- **Rejeitar por script deixa animal no ar.** As regras impedem republicar, mas não escondem o
  que já foi publicado. Sempre rejeitar pelo painel.
- **Cadastro de ONG não exige e-mail verificado** (ver 3.4). Sem App Check ativo, um bot
  consegue criar org e reservar CNPJ. Dano baixo porque a aprovação é manual.
- **Limite de tentativas é contornável** (`localStorage`). App Check resolve.
- **`pedroplm.github.io/still-here` está fora do ar** (301 para o domínio). Intencional.
- **Nenhuma verificação de CNPJ foi feita contra um CNPJ real de ONG** — o fluxo foi implementado
  e buildado, mas não testado com a API da Receita respondendo. Testar com um CNPJ válido e um
  inválido antes de considerar fechado.
- **Divergência de npm:** o `package-lock.json` foi gerado por um npm mais novo que o da máquina
  atual. Rodar `npm i` aqui remove campos `libc` e adiciona `@emnapi/runtime`. Se rodar
  `npm uninstall sharp` por engano, **reverter o lockfile** com `git checkout -- package-lock.json`
  em vez de commitar a diferença.
- **Limite de Cloud Function por IP** (5.5 do handoff antigo) só se ver abuso real. Custo Blaze.

---

## 7. Checklist da próxima sessão

1. `nslookup stillhere.com.br` e `nslookup www.stillhere.com.br`. O domínio já subiu?
2. Se sim: salvar o custom domain no GitHub Pages, conferir HTTPS, adicionar o CNAME de `www` se faltar.
3. Criar o secret `VITE_ADMIN_UID` no GitHub.
4. Ativar App Check: chave reCAPTCHA v3 → `.env` + secret → testar → enforcement.
5. Testar cadastro com CNPJ real válido e com um inválido.
6. Testar o fluxo de aprovação ponta a ponta no navegador (registrar → ver "em análise" → aprovar em `/admin/ongs`).
7. Rotacionar a senha do admin.
