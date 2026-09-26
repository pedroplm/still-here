# Handoff — Still Here

Documento de continuidade. Escrevi para uma sessão **sem histórico de conversa** conseguir retomar o
trabalho com segurança. Atualizado em 2026-09-26.

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
| Ambiente com `.env` | **máquina do Pedri** — a máquina atual não tem `.env`, então não dá para buildar/testar Firebase local aqui |

### Comandos

```bash
npm run dev       # Vite em http://localhost:5173
npm run build     # tsc -b && vite build
npm run lint      # oxlint (deve sair com 0 warning)

npm i -g firebase-tools   # só na máquina do Pedri, se não tiver
firebase login
firebase deploy --only firestore:rules
```

---

## 2. Estado atual: o que está pronto

### Deploy e domínio

- `public/CNAME` contém `stillhere.com.br`.
- `vite.config.ts` lê esse arquivo: se existir, `base` vira `/`; senão vira `/still-here/`.
  Isso mantém o `github.io/still-here` funcionando caso o domínio seja removido.
- Efeito colateral importante: **com o CNAME presente, `pedroplm.github.io/still-here` responde
  301 para `stillhere.com.br`**. Verificado. Ou seja, não dá para ter os dois no ar ao mesmo tempo.
- `public/404.html` redireciona o fallback da SPA para `/` (estava fixo em `/still-here/`).
- Deploy precisa de `VITE_ADMIN_UID` nos secrets do GitHub (ver seção 4).

### SEO

- `public/og-default.png` — 1200×630, gerado a partir do `og-default.svg` existente.
  Foi feito com `sharp` instalado temporariamente e removido; `package-lock.json` ficou intacto.
  **O SVG continua no repo** e o PNG é o que o código referencia.
- `src/hooks/usePageMeta.ts` — `SITE_URL` fixo `https://stillhere.com.br`, canonical e `og:url`
  montados de `SITE_URL + pathname` (ignoram query string e nunca apontam pro `github.io`).
  Helper `absoluteUrl()` para imagem relativa virar absoluta.
- `index.html` — tags OG/canonical estáticas para crawler que não executa JS.
- `public/robots.txt` — bloqueia `/dashboard`, `/login`, `/registrar`, aponta pro sitemap.
- `public/sitemap.xml` — 7 rotas públicas. Rotas dinâmicas (`/adocao/:slug`, `/ongs/:id`) ficaram
  de fora de propósito: vêm do Firestore e mudam com o tempo.

### Aprovação de ONGs (feature nova, commit `e1717d2`)

Fluxo: alguém se cadastra → org nasce com `status: 'pending'` → vê tela "Cadastro em análise" no
lugar do dashboard → o admin aprova/rejeita em `/admin/ongs`.

Arquivos novos:

| Arquivo | Papel |
|---|---|
| `src/services/admin.ts` | `isAdminUid()` compara com `VITE_ADMIN_UID` |
| `src/services/rate-limit.ts` | 3 tentativas / 5 min em `localStorage` |
| `src/services/cnpj.ts` | máscara + consulta CNPJ no BrasilAPI |
| `src/components/OrgStatusNotice.tsx` | telas de pending / rejected / sem ONG |
| `src/hooks/useOrganization.ts` | carrega a org do usuário logado |
| `src/pages/AdminOrganizations.tsx` | painel de curadoria |

Modificados: `src/types/index.ts` (`OrgStatus`), `src/services/database.service.ts`
(`isPublicOrg`, `getOrganizationsByStatus`, `setOrganizationStatus`, `status` no create),
`src/hooks/useOrgId.ts`, `src/pages/dashboard/DashboardLayout.tsx`, `src/App.tsx` (rota
`/admin/ongs`), `src/components/Navbar.tsx` (link "Admin"), `src/pages/Register.tsx`,
`src/data/demo-orgs.ts`, `.env.example`, `deploy.yml`, `firestore.rules`.

Detalhes que importam:

- **`getOrganizations()` filtra no cliente, não por query.** Filtra `status !== 'pending' && !==
  'rejected'`. Fiz assim de propósito: `where('status','==','approved')` excluiria documento sem o
  campo, e a ONG já cadastrada (que ainda não tem `status`) sumiria do site. Assim ela continua
  visível sem migração.
- **A ONG existente não tem `status`.** Continua funcionando. Se for aprovada no painel, ganha o campo.
- **Limite de tentativas é client-side.** Segura erro de clique e re-tentativa apressada. Um bot
  apaga a chave do `localStorage` e ignora. Não é proteção real — ver item 5.4.
- **CNPJ became obrigatório** e é consultado no BrasilAPI (`https://brasilapi.com.br/api/cnpj/v1/{cnpj}`).
  Se a API responde "não existe" ou situação ≠ `ATIVA`, barra o cadastro. Se a API está fora do ar,
  **não bloqueia** — não queremos prender o cadastro a terceiro. No painel admin aparece a razão
  social da Receita, para comparar com o nome digitado.

### Commits de 2026-09-26

```
64dfe43  feat: serve stillhere.com.br at root
39e0612  feat: add SEO metadata, og image and sitemap
e1717d2  feat: gate NGO registration behind admin approval
```

---

## 3. Pendências bloqueantes (precisa do Pedri)

### 3.1 DNS — o dominio ainda NÃO está no ar

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

### 3.2 Preencher o UID do admin em 2 lugares

1. `firestore.rules:11` — trocar o placeholder:
   ```
   return isAuth() && request.auth.uid == 'COLE_AQUI_O_UID_DO_ADMIN';
   ```
2. Secret `VITE_ADMIN_UID` no GitHub (Settings → Secrets and variables → Actions), mesmo valor.
   Sem isso o build sai sem admin e o link "Admin" nunca aparece.

UID em Firebase Console → Authentication → clicar no e-mail do admin.

### 3.3 Deploy das regras — nunca foi feito

`firestore.rules` no repo **nunca foi publicado**. O pipeline de deploy só faz build e sobe o Pages;
as regras são deployadas à parte. Enquanto não rodar `firebase deploy --only firestore:rules`, o botão
"Aprovar" vai falhar com erro de permissão — é o comportamento esperado, não um bug.

### 3.4 Liberação no Firebase Auth

`stillhere.com.br` e `www.stillhere.com.br` em Authentication → Settings → **Authorized domains**.
Sem isso o login quebra em produção no domínio novo.

---

## 4. Secrets do GitHub Actions

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
VITE_ADMIN_UID          # novo
```

Config do Firebase é pública por design; o que **nunca** entra no repo é service account / private key.

---

## 5. Segurança — o que falta, em ordem de prioridade

Contexto: o objetivo é que ONG falsa não consiga operar na plataforma. O commit `e1717d2` resolve a
experiência de UI, mas **não** fecha o buraco no servidor. Nada aqui foi implementado ainda.

### 5.1 Fechar as regras — FAZER PRIMEIRO

Hoje `organizations` tem `allow read: if true` e `animals` libera leitura com `available == true`.
Efeito: ONG rejeitada some do site, mas **continua legível pela API e ainda cria animais, que
aparecem na home**. A aprovação hoje só é de fachada.

Proposta (substitui as functions helpers de `firestore.rules`):

```javascript
function isAdmin() {
  return isAuth() && request.auth.uid == 'COLE_AQUI_O_UID_DO_ADMIN';
}

function orgData(orgId) {
  return get(/databases/$(database)/documents/organizations/$(orgId)).data;
}

function isOrgOwner(orgId) {
  return isAuth() && orgData(orgId).userId == request.auth.uid;
}

function isOrgPublic(orgId) {
  return !('status' in orgData(orgId)) || orgData(orgId).status == 'approved';
}

function canReadOrg(orgId) {
  return isOrgOwner(orgId) || isAdmin() || isOrgPublic(orgId);
}

function isEmailVerified() {
  return request.auth.token.email_verified == true;
}
```

Coleções:

```javascript
match /organizations/{orgId} {
  allow read: if canReadOrg(orgId);
  allow create: if isAuth()
    && isEmailVerified()
    && request.resource.data.userId == request.auth.uid
    && request.resource.data.status == 'pending'
    && request.resource.data.keys().hasAll(['userId', 'name', 'cnpj', 'city', 'state']);
  allow update: if (isOrgOwner(orgId) || isAdmin())
    && request.resource.data.userId == resource.data.userId;
  allow delete: if isOrgOwner(orgId);
}

match /animals/{animalId} {
  allow read: if isOrgPublic(resource.data.organizationId)
    || (isAuth() && isOrgOwner(resource.data.organizationId));
  allow create: if isCreateAnimalOrgOwner()
    && request.resource.data.keys().hasAll(['organizationId', 'name', 'species', 'available']);
  allow update: if isAnimalOrgOwner();
  allow delete: if isAnimalOrgOwner();
}
```

`isOrgPublic` tolera documento sem `status` de propósito — é o que mantém a ONG já cadastrada
visível. Depois que ela for aprovada no painel, dá para simplificar para `orgData(orgId).status ==
'approved'`.

`cnpj` entrou no `hasAll` porque agora é obrigatório no formulário. Se isso atrapalhar o teste local,
remover.

### 5.2 Verificação de e-mail — 3 linhas, maior retorno

Hoje qualquer um cria conta com e-mail descartável e ela fica para sempre.

- `src/services/auth.service.ts` → `register()`: adicionar `await sendEmailVerification(credential.user)`
  logo depois de `createUserWithEmailAndPassword`.
- `src/pages/Login.tsx`: se `!user.emailVerified`, mostrar "verifique seu e-mail" e não seguir para
  o dashboard.
- `firestore.rules`: `isEmailVerified()` no `create` de `organizations`.

### 5.3 CNPJ único — fecha o buraco da própria verificação

Hoje a checagem do CNPJ não impede nada: o mesmo CNPJ pode ser cadastrado N vezes. Alguém pega o CNPJ
de uma ONG real, cadastra 30 vezes e espera uma aprovação. Como o CNPJ virou o alicerce da confiança,
ele precisa ser único.

Implementação:

- coleção nova `cnpj/{só dígitos}` com `{ organizationId, createdAt }`
- `createOrganization` em `database.service.ts` passa a `writeBatch` (org + cnpj) para ser atômico
- regras:
  ```javascript
  match /cnpj/{cnpjId} {
    allow read: if false;
    allow create: if isAuth()
      && isEmailVerified()
      && !exists(/databases/$(database)/documents/cnpj/$(cnpjId));
    allow update: if false;
    allow delete: if false;
  }
  ```
- o erro "CNPJ já cadastrado" precisa virar mensagem amigável no `Register.tsx` (código
  `already-exists`)

Risco residual, aceito: quem cadastrar primeiro "reserva" o CNPJ de outra pessoa. Dano baixo,
porque a aprovação é manual e o admin vê a razão social da Receita.

Dado sensível: `cnpj` guarda CNPJ de terceiros com leitura bloqueada. Mesmo nível de exposição da
coleção de ONGs, ou seja, alto.

### 5.4 App Check com reCAPTCHA v3 — recomendo

Faz o Firebase recusar qualquer requisição que não venha de um navegador real rodando o app. Mata
`curl`, script e bot de preenchimento no projeto inteiro, não só no cadastro. Mais forte que limite
por IP, porque não depende de contar tentativas.

Setup: Firebase Console → App Check → registrar app Web → provedor reCAPTCHA v3 → copiar a site key
→ passar como `VITE_RECAPTCHA_SITE_KEY` e inicializar `initializeAppCheck` em `firebase.config.ts`.
Leva uns 30 min de console.

### 5.5 Cloud Function para limite por IP — só se ver abuso real

É a resposta correta para "3 tentativas por IP", e a reason de eu ter entregado o `localStorage`: SPA
não conhece o IP de ninguém, o Firebase client SDK também não expõe. Precisa de backend que veja a
requisição. Custo: plano Blaze + função para manter. **Deixar para depois** — o App Check já elimina
o cenário que motiva isso.

---

## 6. Riscos e pendências conhecidos

- **Aprovação é cosmética até as rules do 5.1.** Até lá, é só filtro de UI.
- **`pedroplm.github.io/still-here` está fora do ar** (301 para o domínio). Intencional.
- **Limite de tentativas é contornável.** Ver 5.5.
- **A ONG existente não tem `status`.** Funcional, mas inconsistente com o schema novo.
- **`README.md` está desatualizado**: fala em Netlify/Vercel como deploy e tem uma lista de rotas
  antiga. O deploy real é GitHub Pages e a rota `/adocao/:slug` substituiu `/animais/:id`.
- **`tasks.md`** — item de `sitemap.xml`/`robots.txt` ainda marcado como pendente; já foi feito
  (commit `39e0612`).
- **Divergência de npm:** o `package-lock.json` foi gerado por um npm mais novo que o da máquina
  atual. Rodar `npm i` aqui remove campos `libc` e adiciona `@emnapi/runtime`. Se rodar
  `npm uninstall sharp` por engano, **reverter o lockfile** com `git checkout -- package-lock.json`
  em vez de commitar a diferença.
- **Nenhuma verificação de CNPJ foi feita contra um CNPJ real de ONG** — o fluxo foi implementado
  e buildado, mas não testado com a API da Receita respondendo. Testar com um CNPJ válido e com um
  inválido antes de considerar fechado.

---

## 7. Checklist da próxima sessão

1. Rodar `nslookup stillhere.com.br` e `nslookup www.stillhere.com.br`. O domínio já subiu?
2. Se sim: salvar o custom domain no GitHub Pages, conferir HTTPS, adicionar o CNAME de `www` se faltar.
3. Preencher `isAdmin()` em `firestore.rules` e criar o secret `VITE_ADMIN_UID`.
4. `firebase deploy --only firestore:rules` e testar aprovar uma ONG de teste.
5. Implementar 5.1 → 5.2 → 5.3, na ordem. Um deploy de rules no fim.
6. Testar o CNPJ com um número válido e um inválido.
7. Avaliar 5.4 (App Check).
8. Atualizar `README.md` para GitHub Pages e corrigir `tasks.md`.
