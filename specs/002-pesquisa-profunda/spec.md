# Spec 002 — Pesquisa profunda (fonte-base + estado da arte)

**Status**: Implementada · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Registrar em `estudos/` a pesquisa que sustenta o livro: (a) a **fonte-base interna** — evidência em código das duas implementações-laboratório, com paths verificáveis; (b) o **panorama da indústria** — estado da arte externo da fronteira app↔IA com URLs verificáveis; (c) **candidatos a bibliografia científica** com IDs arXiv, a validar.

## Por quê

A Constituição (Princípios I e II) proíbe afirmação sem evidência e exige que o livro nasça do código. Sem esta pesquisa registrada, as specs de capítulo não têm insumo citável e cada capítulo repetiria a coleta.

## Critérios de aceite

- [x] **CA-1**: `estudos/fonte-base-codigo.md` existe, com paths reais dos dois repositórios, a matriz de convergência, lacunas declaradas e tabela terminológica.
- [x] **CA-2**: `estudos/panorama-industria.md` cobre no mínimo: AG-UI, MCP (incl. elicitation/apps), ACP (Zed), Vercel AI SDK (stream protocol/generative UI), OpenAI (Apps SDK/function calling), Anthropic (streaming/tool use), um framework de chat-in-app, A2A (posicionamento) e OWASP LLM01 — cada ficha com URL e "tradução para decisão", mais tabela comparativa final.
- [x] **CA-3**: `estudos/candidatos-bibliografia.md` lista 4–8 papers com ID arXiv e justificativa, marcados ⏳ até validação.
- [x] **CA-4**: nenhuma afirmação sem path (interno) ou URL (externo); o que não se confirmou está marcado ⏳.

## Fora de escopo

Validação dupla da bibliografia (acontece na spec do capítulo que a citar) · escrita de capítulos.
