# ADR 0003 — Branch única da sessão em vez de dev/NNN-nome

**Data**: 2026-07-30 · **Status**: Aceito · **Decisor**: agente, registrando adaptação operacional (reversível)

## Contexto

O Maestro trabalha em `dev` com promoção para `main`; o harness_engineering usa uma branch por spec (`NNN-nome`) mergeada na `main`. Esta sessão de trabalho remoto, porém, tem branch designada obrigatória (`claude/protocolo-comunicacao-harness-rgvzqo`) e o repo `protocolos` nasce vazio, sem branch default.

## Decisão

Todo o trabalho desta sessão acontece na branch designada `claude/protocolo-comunicacao-harness-rgvzqo`, com **commits atômicos por spec** (a rastreabilidade spec↔commit substitui a rastreabilidade spec↔branch). O merge para a branch principal é gate humano.

## Alternativas avaliadas

- **Criar `dev` + branch por spec localmente** — rejeitada nesta sessão: a regra da sessão proíbe push em outra branch; branches locais não publicadas não adicionam rastreabilidade real.

## Justificativa

Reversível e de baixo impacto: o histórico de commits preserva a granularidade por spec; a estrutura de branches do Maestro pode ser adotada quando o repositório tiver colaboração contínua fora de sessões remotas.

## Consequências

- Mensagens de commit citam a spec (ex.: `spec 004`), mantendo o elo spec ↔ commit ↔ CHANGELOG.
- Um ADR futuro pode instaurar `dev`/`main` quando o fluxo de colaboração mudar.
