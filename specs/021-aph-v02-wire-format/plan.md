# Plan 021 — APH v0.2: Anexo A (wire format)

## Abordagem

Schemas escritos pelo orquestrador como **síntese canônica** dos contratos dos dois laboratórios (nomes APH; mapeamento em §A.8), com a régua de maturidade da v0.1 aplicada ao fio: campos 🧪 existem no schema mas nunca são `required`. Enforcement duplo: exemplos válidos E contraexemplos inválidos em `exemplos.json`, verificados por `publicar/valida-wire.mjs` (ajv, draft 2020-12) — que entra como **gate de CI** no workflow de publicação (Maestro: converter julgamento em check). Revisão independente antes do registro.

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Cada schema deriva de contrato comprovado (mapeado em §A.8); campos sem base comprovada são opcionais e marcados 🧪. |
| II. Fonte-base é o código | ✅ O fio generaliza os contratos reais; laboratórios intocados. |
| III. Esqueleto v3 | N/A (anexo normativo, forma própria). |
| IV. Livro vivo | ✅ Fio versiona com o padrão (§A.9); edição 0.06 no HISTORICO. |
| V. Segurança | ✅ Exemplos fictícios; o contraexemplo `senha_vazada` prova a rejeição de campo desconhecido no snapshot. |
| VI. Neutralidade | ✅ Paths de referência ≠ norma; nomes locais permitidos com mapeamento. |
| VII. Spec-driven | ✅ Esta spec; gate de CI; revisão independente; CHANGELOG/HISTORICO; merge = gate humano. |
