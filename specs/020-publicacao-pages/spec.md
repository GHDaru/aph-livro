# Spec 020 — Publicação do livro no GitHub Pages

**Status**: Implementada · **Data**: 2026-07-31 · **Raia**: infra (sempre plena; reversível — desligar o workflow despublica)

## O quê

Publicar o livro como site navegável no GitHub Pages: motor estático próprio e enxuto (`publicar/build.mjs`, markdown → HTML com navegação, tema claro/escuro e links internos reescritos) + workflow que constrói e publica a cada push na `main` — o merge na `main` passa a ser o ato de publicação, como no livro-mãe.

## Por quê

Pedido do Accountable (2026-07-31): "vamos publicar no Pages". O livro está completo (12 capítulos + padrão APH + glossário) e o público-alvo (times construindo chat-in-app) não navega repositório cru. Modelo herdado do `harness_engineering` (workflow `publicar.yml`), sem as partes que não precisamos ainda (PDF, companion, grafo) — YAGNI.

## Critérios de aceite

- [x] **CA-1**: `node publicar/build.mjs` gera `docs/` com **todas** as páginas markdown do repositório (livro, padrão, glossário, estudos, handoffs, ADRs, specs, CHANGELOG) espelhando a estrutura de pastas — nenhum link interno quebrado (verificação mecânica no build: link `.md` relativo vira `.html` e o alvo existe, senão o build falha).
- [x] **CA-2**: navegação lateral com o essencial (sumário do livro, capítulos 00–11, Padrão APH, glossário, histórico) + tema responsivo com modo claro/escuro automático.
- [x] **CA-3**: `.github/workflows/publicar.yml` constrói e publica no push da `main` (paths do livro/motor); `docs/` e `node_modules/` gitignored (o site é gerado no CI, não versionado).
- [x] **CA-4**: build verde local com evidência (contagem de páginas geradas + zero links quebrados); etapa manual única documentada (habilitar Pages: Settings → Pages → Source: GitHub Actions), herdada do livro-mãe — o token do Actions não cria o site sozinho.

## Fora de escopo

PDF, chat-companion, grafo de conhecimento, analytics (features do livro-mãe; adotar se/quando houver demanda); domínio próprio.
