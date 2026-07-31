# Spec 018 — Padrão APH v0.1 (Aplicação ↔ Harness, perfil chat)

**Status**: Em implementação · **Data**: 2026-07-31 · **Raia**: plena

## O quê

Escrever a **proposta normativa** do livro: o padrão que uma aplicação deve adotar para conversar *integralmente* com o harness/IA tendo um chat como UI — `livro/padrao-aph.md`, com palavras-chave normativas (DEVE/DEVERIA/PODE), níveis de conformidade, requisitos por área, maturidade declarada por requisito, mapeamento de compatibilidade com a indústria e checklist.

## Por quê

Pedido do Accountable (2026-07-31): "sugerir, baseado no que temos, o padrão que deve ser adotado por aplicações que conversam integralmente com o harness/IA supondo uma UI sendo um chat — primeiro como estamos, depois, se já tivermos bagagem suficiente, propomos". O diagnóstico de bagagem (registrado nesta spec) concluiu: suficiente para v0.1, com maturidade declarada por requisito. O livro até aqui é *descritivo* (caps. 00–11); o padrão é o passo *prescritivo* que o cap. 11 anuncia sem dar.

## Diagnóstico de bagagem (a "parte 1" do pedido)

- **Comprovado nos 2 laboratórios + confirmado pela indústria** → vira DEVE: eventos tipados com vocabulário fechado; SSE sobre POST com entrega confiável e cancelamento; contexto declarado (registry + snapshot sanitizado); catálogo como única superfície executável com risco declarado; FSM de proposta com confirmação proporcional; autorização fora do LLM; traço.
- **Desenhado, não verificado** → vira DEVERIA/experimental: idempotência com dedup real, `context_hash` server-side, slot filling, ponte catálogo→tools, projeção MCP (spec 2026-07-28).
- **Aberto (sem convergência)** → fica fora do normativo, listado como trabalho futuro: taxonomia de risco padrão da indústria, traço interoperável.
- **Limitações declaradas**: n=2 laboratórios do mesmo autor; sem suíte de conformidade; v0.1 é proposta para crítica, não norma estabelecida.

## Critérios de aceite

- [ ] **CA-1**: `livro/padrao-aph.md` existe com: convenções normativas, escopo, níveis de conformidade (APH-1 Observador / APH-2 Operador / APH-3 Federado), requisitos por área com identificador estável (APH-x.y), **maturidade declarada por requisito** (comprovado/desenhado), checklist de conformidade e regra de versionamento/frescor do padrão.
- [ ] **CA-2**: todo requisito DEVE tem evidência dupla (implementação nos laboratórios com path *ou* convergência da indústria com URL — via referência aos capítulos que a carregam); nenhum requisito "aberto" aparece como DEVE.
- [ ] **CA-3**: tabela de compatibilidade APH ↔ AG-UI / MCP (2026-07-28) / Vercel AI SDK / ACP.
- [ ] **CA-4**: o padrão não contradiz nenhum capítulo (verificado por revisão independente); sumário do livro atualizado com a nova parte; HISTORICO (edição 0.04) e CHANGELOG registrados.

## Fora de escopo

Suíte de conformidade executável (feature futura); adoção do padrão pelos laboratórios (handoffs próprios); RFC/registro público externo.
