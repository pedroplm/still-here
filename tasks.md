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

## Idiomas pt/en (2026-09-26)

Feito:

- [x] `i18next` + `react-i18next` instalados; `resolveJsonModule` ligado
- [x] `src/i18n/` com `index.ts`, `i18next.d.ts`, `pt.json`, `en.json` (289 chaves cada)
- [x] `en.json` tipado contra `pt.json` — chave faltando quebra `npm run build`
- [x] `LanguageSwitcher` no `Navbar` e no `Footer`; escolha persistida em `stillhere:lang`
- [x] Todas as telas e componentes traduzidos (públicas, auth, dashboard, admin, `EmptyAnimals`, `App.tsx`)
- [x] `usePageMeta` por idioma + `og:locale` alternando `pt_BR`/`en_US`; `documentElement.lang` sincronizado
- [x] Serviços devolvem chave, não frase — `cnpj.ts` (`reasonKey`), `storage.service.ts` (`ImageValidationError`), `createOrganization` (`code: 'invalid-cnpj-digits'`)
- [x] `data/categories.ts` separado em `value` (contrato Firestore) + `labelKey`
- [x] Auditoria por grep — nenhum acento português remanescendo em `src/**/*.tsx`
- [x] `npm run build` e `npm run lint` limpos, zero warning

Falta:

- [ ] Testar troca de idioma e persistência no navegador (build validado, não a UX)
- [ ] Publicar — commit + push com autorização do Pedri
- [ ] Se passar a exigir versão en indexada: `/en/...` com `hreflang`, ou campo bilíngue nos documentos
- [ ] `data/educational-content.ts` e `data/demo-animals.ts` sem tradução — não são consumidos por nenhuma tela, só re-exportados

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
- [x] Teste do batch atômico do cadastro (org + trava CNPJ) — 409 em CNPJ duplicado, sem doc órfão
- [x] Secret `VITE_ADMIN_UID` no GitHub e DNS do domínio no ar com HTTPS

Corrigido 2026-09-26:

- [ ] **`VITE_ADMIN_UID` não chega no bundle** — painel `/admin/ongs` está no ar mas
  mostra "Acesso restrito" para todos, `isAdminUid()` sempre `false`. Provável causa:
  valor cadastrado na aba Variables e não Secrets; o workflow lê `secrets.VITE_ADMIN_UID`.
  Ver `HANDOFF.md` 4.2, que tem o comando de verificação. **Não confiar no log do CI**,
  tem que achar o UID dentro do bundle servido.

Adiado:

- [ ] App Check — desativado por decisão. O console do Firebase não oferece mais reCAPTCHA v3 classic, só Enterprise (Fraud Defense), que exige `ReCaptchaEnterpriseProvider` no código e chave no formato `projects/../locations/global/keys/..`. Detalhes em `HANDOFF.md` 3.6

Falta (precisa de ação no console, não dá pra fazer por código):

- [ ] Testar cadastro com CNPJ real válido e com um inválido (BrasilAPI nunca foi exercitada de verdade)
- [ ] Testar o fluxo de aprovação ponta a ponta no navegador

