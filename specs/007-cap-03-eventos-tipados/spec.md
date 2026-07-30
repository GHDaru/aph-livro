# Spec 007 — Capítulo 03: A voz da IA — eventos tipados

**Status**: Implementada (texto completo) · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Criar o capítulo 03 do livro (`livro/capitulos/03-eventos-tipados.md`) na fase 1 do GUIA-CAPITULO ("Estrutura antes do conteúdo"): cabeçalho datado, objetivos de aprendizagem, "O problema" redigido por completo, esqueleto de H3 do estado da arte com 1–2 frases por seção, fontes candidatas listadas, perguntas de verificação e Apêndice de evidência por laboratório com paths mapeados.

Tese do capítulo: a IA fala com a aplicação por um **vocabulário fechado e versionado** de eventos tipados — conteúdo, raciocínio, artefatos, citações, resultados de execução, erros e terminadores — e duas práticas protegem esse vocabulário: a **regra de evolução** (o frontend ignora tipos desconhecidos, mas adições devem ser documentadas antes do uso — nexxussai, `specs/005-backend-ai-chat/contracts/stream-events.md`) e a **normalização multi-provider** (nexxussai, `apps/api/app/ai_chat/infrastructure/llm/provider_stream_normalizer.py`).

## Por quê

O capítulo 03 é a primeira metade da direção IA→app: sem o vocabulário de eventos nomeado e delimitado, os capítulos de ações (05), comandos de UI (06) e porta do modelo (08) não têm sobre o que construir. As duas bases-laboratório convergiram para vocabulários tipados equivalentes com nomes distintos (`estudos/fonte-base-codigo.md` §1) e a indústria consolidou o padrão triplo start/delta/end (`estudos/panorama-industria.md`) — é o momento de fixar a síntese.

## Critérios de aceite

- [x] **CA-1**: o arquivo `livro/capitulos/03-eventos-tipados.md` existe com todas as seções do esqueleto v3 na ordem do GUIA-CAPITULO (cabeçalho datado, Objetivos, O problema, Fundamentos científicos, Fontes da indústria, O estado da arte com Leitura executiva, Verificação, Apêndice por laboratório).
- [x] **CA-2**: "O problema" está redigido por completo (não esqueleto) e fecha com as restrições em tensão.
- [x] **CA-3**: cada H3 do estado da arte tem 1–2 frases de resumo; o vocabulário canônico das duas bases aparece em tabela comparável com a indústria (AG-UI, Vercel AI SDK, Anthropic, ACP).
- [x] **CA-4**: o Apêndice mapeia a evidência por path nos dois laboratórios — ghdaru (`apps/api/src/ghdaru_api/conversation/domain/models.py`, `apps/web/src/features/conversation/domain/events.ts`, `apps/web/src/features/conversation/domain/transcript.ts`) e nexxussai (`apps/api/app/ai_chat/domain/value_objects/stream_event.py`, `apps/api/app/ai_chat/infrastructure/llm/provider_stream_normalizer.py`, `specs/005-backend-ai-chat/contracts/stream-events.md`) — incluindo um H3 `### Divergências` (nomenclatura Constituição×código do ghdaru; granularidade dos vocabulários).
- [x] **CA-5**: as fronteiras do sumário são respeitadas no texto — a entrega dos eventos (`seq`, replay, SSE) é remetida ao cap. 02; `action_proposal`/`ui_command` aparecem apenas como membros do vocabulário, com semântica remetida aos caps. 05–06.
- [x] **CA-6**: nenhuma afirmação sem path/URL/⏳; siglas por extenso na 1ª ocorrência; payloads de exemplo com valores fictícios evidentes.

## Fora de escopo

- **Texto completo do capítulo** (prosa integral das seções de estado da arte, fundamentos e fontes) — fase 2 desta mesma spec, após gate da estrutura.
- Transporte, sessão, `seq` e replay como mecanismo de entrega (cap. 02, spec 006).
- Semântica de agir: máquina de estados de proposta, risco, confirmação (`action_proposal`, cap. 05) e comandos de UI (`ui_command`, cap. 06).
- Normalização na borda do provedor como arquitetura completa da porta do modelo (cap. 08) — aqui entra só o efeito protetor sobre o vocabulário.
- Edições em `livro/README.md`, `livro/glossario.md`, `livro/bibliografia.md`, `CHANGELOG.md` e `HISTORICO.md` (feitas pelo orquestrador no fechamento do lote).
