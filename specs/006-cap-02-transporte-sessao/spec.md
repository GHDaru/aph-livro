# Spec 006 — Capítulo 02: Transporte e sessão

**Status**: Implementada (estrutura) · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Criar a **estrutura** (fase 1 do `livro/GUIA-CAPITULO.md`) do capítulo `livro/capitulos/02-transporte-sessao.md`. Tese do capítulo: Server-Sent Events (SSE) sobre POST venceu WebSocket nas duas bases-laboratório — decisão registrada no ghdaru (`specs/001-fundacao-shell-chat/plan.md`, `docs/research/resultado-pesquisa-infra-avaliacao.md`) e no nexxussai-monorepo (`specs/014-chat-lateral-contexto/research.md`, que rejeitou REST sem streaming) — e uma sessão robusta precisa de **duas metades complementares** que cada laboratório implementou pela metade: **entrega confiável** (ghdaru: `seq` monotônico + replay `GET .../events?after=N`) e **cancelamento cooperativo** (nexxussai: `ActiveStreams` + `DELETE /api/chat/stream/{stream_id}` + `AbortSignal`).

## Por quê

O canal é a camada mais básica do protocolo: sem entrega confiável e cancelamento, todo o vocabulário dos capítulos seguintes (eventos tipados, propostas de ação, comandos de UI) trafega sobre areia. As duas bases tomaram a mesma decisão de transporte de forma independente e implementaram mecanismos de sessão complementares — a composição dos dois é a contribuição própria deste capítulo (síntese nº 2 de `estudos/fonte-base-codigo.md`).

## Critérios de aceite

- [x] **CA-1**: `livro/capitulos/02-transporte-sessao.md` existe com cabeçalho datado (captura 2026-07, revisão 2026-07-30) e todas as seções do esqueleto v3 na ordem normativa do `GUIA-CAPITULO.md` (objetivos → problema → fundamentos → indústria → estado da arte → verificação → apêndice).
- [x] **CA-2**: a seção "O problema" está **redigida** (não esqueleto) e articula as quatro restrições em tensão: tempo-real × simplicidade × resiliência de rede × infraestrutura HTTP existente.
- [x] **CA-3**: o estado da arte tem H3 planejados (2–4 frases cada) cobrindo no mínimo: SSE × WebSocket × polling (com o que a indústria usa), entrega confiável (`seq`+replay), cancelamento cooperativo, envelope de erro como parte do protocolo, sessão e reconexão; a Leitura executiva está rascunhada.
- [x] **CA-4**: "Fundamentos científicos" declara explicitamente a ausência de ciência validada (nenhuma entrada ✓ sustenta afirmação); "Fontes da indústria" traz fichas com URL verificável no formato "tradução para decisão".
- [x] **CA-5**: o Apêndice tem `### ghdaru` e `### nexxussai-monorepo` populados com paths verificados nos repositórios-fonte (incl. `chat_router.py`, `test_chat_routes.py`, `http-chat.ts`; `active_streams.py`, `sse_emitter.py`, `lateralChatService.ts`) e um `### Divergências` comparando as duas metades.
- [x] **CA-6**: fronteiras respeitadas — o *vocabulário* dos eventos e o envelope (`seq`, `kind`, `payload`) são remetidos ao cap. 03 (aqui só a entrega/reentrega); cancelamento de *ação* é remetido ao cap. 05 (aqui só cancelamento de *stream*).

## Fora de escopo

O **texto completo** do capítulo (prosa integral das seções do estado da arte) é a fase 2 desta spec, em entrega posterior sobre a estrutura aprovada. Também fora: semântica dos tipos de evento (cap. 03), FSM de propostas e cancelamento de ação (cap. 05), comparativo externo completo (cap. 10), edição de `livro/README.md`, `glossario.md`, `bibliografia.md`, `CHANGELOG.md` e `HISTORICO.md` (feitos pelo orquestrador no fechamento do lote).
