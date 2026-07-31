# Plan 017 — Revisão extraordinária: MCP 2026-07-28

## Abordagem

1. **Repesquisa com verificação própria** (agente curador): o radar do livro-mãe é ponto de partida, não fonte — cada fato reverificado em fonte primária (blog oficial/changelog/releases), com o mapa de impacto calculado contra o *nosso* livro (que cita elicitation como padrão de gate humano — nuance: a mecânica muda para MRTR, o padrão sobrevive).
2. **Edições cirúrgicas e datadas** nos capítulos afetados, pelo orquestrador (não fan-out — o diff é pequeno e transversal): a história não é sobrescrita; a mecânica antiga fica datada ("até a spec 2025-06-18", janela de depreciação de 12 meses), a nova entra com data do evento.
3. **Registro**: contrato de frescor do cap. 10 renovado, HISTORICO edição 0.03, CHANGELOG, e então merge na `main` (autorizado pelo humano em 2026-07-31).

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Fatos reverificados em fonte primária com URL; radar citado como detecção, não como evidência. |
| II. Fonte-base é o código | ✅ Laboratórios intocados; impacto neles (nenhum usa MCP em produção) registrado como estava. |
| III. Esqueleto v3 | ✅ Edições preservam as seções; nenhum capítulo muda de estrutura. |
| IV. Livro vivo | ✅ É o princípio em ação: gatilho extraordinário do contrato de frescor, atualização datada, edição 0.03, nova rodada sem sobrescrever. |
| V. Segurança | ✅ Sem segredos. |
| VI. Neutralidade | ✅ Avaliação por spec publicada e política de depreciação, não por marketing. |
| VII. Spec-driven | ✅ Esta spec; CHANGELOG; gate humano de merge já concedido explicitamente. |
