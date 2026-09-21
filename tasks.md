# Tasks — O que falta do plano

## Críticas (MVP incompleto)

- [x] Criar `src/data/` — dados estáticos no repo: conteúdo educativo, cartilha, categorias, demo-animals *( educational-content.ts, categories.ts, demo-animals.ts, index.ts )*
- [x] Menu mobile — hamburger menu na navbar (atualmente esconde links com `hidden md:flex` sem toggle)
- [x] URLs SEO-friendly — implementar `/adocao/cachorro-rex-abc123` em vez de `/animais/{firestoreId}`
- [ ] Criar `sitemap.xml` e `robots.txt` em `public/` *(delayed — URL base de deploy ainda não definida)*

## Importantes

- [x] Completar SEO — adicionar `og:image`, `og:url`, `canonical`, `twitter:card`/`twitter:title`/`twitter:description` no `usePageMeta` e no `index.html`
- [ ] Criar `src/types/` — extrair interfaces (`Organization`, `Animal`, etc.) de `database.service.ts` pra desacoplar camada de dados
- [x] Remover dependências mortas — `@cloudinary/react` e `@cloudinary/url-gen` instaladas mas não usadas
- [ ] Validação de upload — limite de tamanho, compressão client-side, progress indicator

## Menores

- [x] UI páginas ONG — redesign estilo Instagram (avatar redondo, @insta com link, sem borda de card) *( Register.tsx, Ongs.tsx, OngDetail.tsx )*
- [ ] Paginação — listagens de animais e ONGs carregam tudo de uma vez
- [ ] Componentes reutilizáveis — card layouts duplicados entre páginas, extrair `AnimalCard`/`OrgCard`
- [ ] Sidebar dashboard — adicionar item "Doações" conforme menu previsto no plano
