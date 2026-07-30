# Spec 014 — Capítulo 10: O estado da arte externo

**Status**: Implementada (texto completo) · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Criar o capítulo 10 do livro (`livro/capitulos/10-estado-da-arte-externo.md`) na fase 1 do GUIA-CAPITULO ("Estrutura antes do conteúdo"): cabeçalho datado, objetivos de aprendizagem, "O problema" redigido por completo, esqueleto de H3 do estado da arte com 1–2 frases por seção, fontes candidatas listadas, perguntas de verificação e Apêndice de evidência por laboratório — que, neste capítulo, mapeia **como cada laboratório se posicionaria na matriz comparativa externa**, com paths.

Tese do capítulo: pelo menos cinco ecossistemas atacam a fronteira app↔agente — AG-UI (protocolo dedicado de eventos agente↔UI), MCP com MCP Apps/MCP-UI (elicitation, sampling, UI embutida via iframe+postMessage), ACP da Zed (agente↔editor sobre JSON-RPC, `session/update` + `session/request_permission`), Vercel AI SDK (UI Message Stream, `needsApproval`; RSC/`streamUI` pausado) e OpenAI Apps SDK/ChatKit (`window.openai`) — e a comparação por **adoção medida e governança** (Constituição, P. VI) mostra o que já consolidou (streaming de eventos tipados com padrão start/delta/end; proposta de ação com confirmação humana como estado de primeira classe — convergência de quatro ecossistemas) e o que segue aberto (nenhum padroniza contexto de tela; classes de risco e traço de execução não padronizados). Fonte principal: `estudos/panorama-industria.md`.

## Por quê

O capítulo 10 é o contraponto externo da espinha empírica interna (caps. 01–09): sem ele, a síntese normativa do cap. 11 não teria como separar o que as duas bases descobriram de forma independente do que a indústria já consolidou — nem como nomear o espaço aberto (contexto de tela) que nenhum protocolo externo ocupa (`estudos/panorama-industria.md`, "Lacunas e incertezas registradas"). Ele também fixa a fronteira com o cap. 17 do livro-mãe [Engenharia de Harness](https://github.com/GHDaru/harness_engineering): lá, protocolos *entre harnesses*; aqui, só a fronteira app↔agente (`livro/README.md`, "Fronteiras entre capítulos").

## Critérios de aceite

- [x] **CA-1**: o arquivo `livro/capitulos/10-estado-da-arte-externo.md` existe com todas as seções do esqueleto v3 na ordem do GUIA-CAPITULO (cabeçalho datado, Objetivos, O problema, Fundamentos científicos, Fontes da indústria, O estado da arte com Leitura executiva, Verificação, Apêndice por laboratório).
- [x] **CA-2**: "O problema" está redigido por completo (não esqueleto) e fecha com as restrições em tensão.
- [x] **CA-3**: os H3 do estado da arte estão organizados **por fronteira** (protocolos dedicados agente↔UI; MCP e derivados; frameworks de aplicação; plataformas dos vendors), cada um com 1–2 frases, e a seção termina com a **matriz comparativa** (protocolo × transporte × vocabulário × direções × governança de ações × adoção), adaptada da tabela final de `estudos/panorama-industria.md`, antes da Leitura executiva.
- [x] **CA-4**: o capítulo se posiciona explicitamente contra o cap. 17 do livro-mãe [Engenharia de Harness](https://github.com/GHDaru/harness_engineering) (protocolos entre harnesses lá; fronteira app↔agente aqui), com A2A citado apenas como contraste de fronteira.
- [x] **CA-5**: as ressalvas de curadoria do panorama viram **notas no capítulo**: números de adoção são snapshots de 2026-07-30 (revalidar antes do texto completo); divergência README×docs do AG-UI ("~16 event types" × enumeração das docs) com as docs como fonte canônica; site oficial do ACP não acessado diretamente nesta rodada.
- [x] **CA-6**: o Apêndice mapeia como cada laboratório se posicionaria na matriz externa, com paths — ghdaru (`apps/api/src/ghdaru_api/http/chat_router.py`, `apps/api/src/ghdaru_api/conversation/domain/models.py`, `apps/api/src/ghdaru_api/conversation/domain/catalog.py`) e nexxussai-monorepo (`apps/api/app/ai_chat/domain/value_objects/stream_event.py`, `apps/api/app/ai_chat/domain/entities/action_proposal.py`, `apps/api/app/ai_chat/infrastructure/stream/active_streams.py`) — incluindo o que os laboratórios têm e nenhum ecossistema externo padroniza (contexto de tela, classes de risco, traço).
- [x] **CA-7**: as fronteiras do sumário são respeitadas — MCP como projeção do catálogo próprio é remetido ao cap. 09; a síntese normativa do que adotar é remetida ao cap. 11; aqui só a comparação.
- [x] **CA-8**: nenhuma afirmação sem path/URL/⏳; siglas por extenso na 1ª ocorrência; exemplos (quando houver) com valores fictícios evidentes.

## Fora de escopo

- **Texto completo do capítulo** (prosa integral das seções) — fase 2 desta mesma spec, após gate da estrutura.
- MCP como projeção do catálogo próprio das duas bases (manifesto, handshake, federação) — cap. 09, spec 013.
- Síntese normativa ("o que adotar, o que estender, o que nomear") — cap. 11, spec 015.
- Protocolos entre harnesses (MCP genérico, A2A, orquestração multi-agente) — cap. 17 do livro-mãe; aqui A2A aparece só para posicionar a fronteira.
- Revalidação dos números de adoção (stars, contagens de parceiros) — registrada como pendência para a fase 2.
- Edições em `livro/README.md`, `livro/glossario.md`, `livro/bibliografia.md`, `CHANGELOG.md` e `HISTORICO.md` (feitas pelo orquestrador no fechamento do lote).
