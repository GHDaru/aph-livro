# Plan 018 — Padrão APH v0.1

## Abordagem

Documento normativo escrito pelo orquestrador (síntese de maior risco do projeto — não delegada), derivado por composição: cada requisito nasce de um capítulo (citado por número) e herda dele a evidência; a maturidade por requisito reusa a régua do diagnóstico de bagagem (comprovado→DEVE, desenhado→DEVERIA/experimental, aberto→futuro). FSM unificada = soma das máquinas dos dois laboratórios + estados do handoff (`stale`). Vocabulário mínimo de eventos = interseção semântica dos dois vocabulários. Revisão independente antes do registro.

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Requisito DEVE só com base comprovada (caps. com paths/URLs); maturidade declarada impede prescrição sem evidência. |
| II. Fonte-base é o código | ✅ O padrão generaliza o que as duas bases provaram; o que elas não provaram é rebaixado de grau. |
| III. Esqueleto v3 | N/A no corpo (documento normativo tem forma própria, declarada); cabeçalho datado mantido. |
| IV. Livro vivo | ✅ Padrão versionado (v0.1) com contrato de frescor próprio e regra de evolução. |
| V. Segurança | ✅ Requisitos de segurança são seção normativa; payloads fictícios. |
| VI. Neutralidade | ✅ Compatibilidade mapeada para 4 ecossistemas; nenhum vendor obrigatório. |
| VII. Spec-driven | ✅ Esta spec; revisão independente; HISTORICO/CHANGELOG; merge é gate humano. |
