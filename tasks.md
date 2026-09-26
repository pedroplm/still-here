# Tasks — O que falta do plano

## Críticas (MVP incompleto)

- [x] Criar `src/data/` — dados estáticos no repo: conteúdo educativo, cartilha, categorias, demo-animals *( educational-content.ts, categories.ts, demo-animals.ts, index.ts )*
- [x] Menu mobile — hamburger menu na navbar (atualmente esconde links com `hidden md:flex` sem toggle)
- [x] URLs SEO-friendly — implementar `/adocao/cachorro-rex-abc123` em vez de `/animais/{firestoreId}`
- [x] Criar `sitemap.xml` e `robots.txt` em `public/`

## Importantes

- [x] Completar SEO — adicionar `og:image`, `og:url`, `canonical`, `twitter:card`/`twitter:title`/`twitter:description` no `usePageMeta` e no `index.html`
- [x] Criar `src/types/` — extrair interfaces (`Organization`, `Animal`, etc.) de `database.service.ts` pra desacoplar camada de dados
- [x] Remover dependências mortas — `@cloudinary/react` e `@cloudinary/url-gen` instaladas mas não usadas
- [ ] Validação de upload — limite de tamanho, compressão client-side, progress indicator

## Menores

- [x] UI páginas ONG — redesign estilo Instagram (avatar redondo, @insta com link, sem borda de card) *( Register.tsx, Ongs.tsx, OngDetail.tsx )*
- [ ] Paginação — listagens de animais e ONGs carregam tudo de uma vez
- [ ] Componentes reutilizáveis — card layouts duplicados entre páginas, extrair `AnimalCard`/`OrgCard`
- [x] Sidebar dashboard — adicionar item "Doações" conforme menu previsto no plano

## Segurança / aprovação de ONG (alpha)

Feito:

- [x] Regras de `organizations` reescritas — `pending`/`rejected` invisíveis ao público, `status` imutável para a ONG, delete só admin
- [x] Regras de `animals` — criar/editar exige dono + ONG aprovada + e-mail verificado; `ownerUid` denormalizado para query provável
- [x] Trava de CNPJ `cnpj/{14 dígitos}` — create-only, sem leitura, escrita no mesmo batch do cadastro
- [x] E-mail verificado no registro + barreira no `ProtectedRoute` (reenvio e logout)
- [x] Painel do curador `/admin/ongs` — aprova, rejeita com motivo, esconde os animais da ONG rejeitada
- [x] Rejeitar ONG tira os animais do ar (`hideOrganizationAnimals`)
- [x] `OrgProfile` monta payload explícito (sem `id`/`status`) para não brigar com as regras
- [x] `compact()` em todo write — Firestore rejeita o documento inteiro se houver `undefined`
- [x] Índice composto `organizationId + ownerUid + createdAt` publicado
- [x] Matriz de 49 casos contra as regras publicadas (anônimo, dono, ONG falsa, admin) — 49/49

Falta (precisa de ação no console, não dá pra fazer por código):

- [ ] Registrar chave reCAPTCHA v3 no App Check e colocar `VITE_RECAPTCHA_SITE_KEY` no `.env` e no secret do GitHub
- [ ] Registrar o app no App Check e **aplicar enforcement** (só depois de testar com a chave)
- [ ] Criar o secret `VITE_ADMIN_UID` no repositório GitHub
- [ ] Apontar o DNS do domínio no GitHub Pages (`A` do apex + `CNAME` de `www`) e ativar HTTPS

