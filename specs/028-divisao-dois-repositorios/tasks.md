# Tasks — Spec 028

## Fase 1 (entregue)
- [x] T1 — ADR 0004 com tabela de alocação, alternativas e consequências.
- [x] T2 — `migracao/extrair-livro.sh`, `reescrever-links.mjs`, `limpar-especificacao.sh`, README do roteiro.
- [x] T3 — Ensaio de ponta a ponta dos dois lados, com gates verdes.

## Fase 2 (em curso)
- [x] T4 — Extração executada de verdade (2026-08-10): 55 commits preservados, 114 páginas, zero links quebrados, normativo corretamente ausente. O gate reprovou a 1ª tentativa (a ferramenta não conhecia o `skills.md` da spec 030) — regra acrescentada.
- [ ] T5 — **Criar `aph-livro` no GitHub e fazer o push.** Bloqueado por credencial: `create_repository` devolveu `403 Resource not accessible by integration`; o escopo de escrita da sessão cobre só os repositórios já autorizados. Passo do Accountable.
- [ ] T6 — **Reapontar o projeto do Vercel** para `aph-livro`, preservando a URL (os handoffs entregues ao time do ghdaru linkam para ela). Passo do Accountable — o agente não tem acesso ao Vercel.
- [ ] T7 — Limpar a especificação (`./migracao/limpar-especificacao.sh --sim`) **somente após T6 confirmado**; inverter a ordem tira o livro do ar.
