# 03 — A voz da IA: eventos tipados

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

> **Fase editorial**: estrutura (fase 1 do [GUIA-CAPITULO](../GUIA-CAPITULO.md), spec 007). "O problema" está completo; o estado da arte está em esqueleto de H3 com resumos; o Apêndice já mapeia a evidência por path.

## Objetivos de aprendizagem

Ao final deste capítulo, você deve ser capaz de:

1. **Explicar** por que a IA (inteligência artificial) fala com a aplicação por um vocabulário *fechado e versionado* de eventos tipados, e não por texto livre interpretado pelo frontend.
2. **Distinguir** as famílias semânticas do vocabulário — conteúdo, raciocínio, artefatos, citações, resultados de execução, propostas de ação e comandos de UI (User Interface, *apenas nomeados aqui*), erros e terminadores — e o envelope que as transporta.
3. **Analisar** o padrão triplo start/delta/end como forma dominante na indústria e compará-lo com os vocabulários das duas bases-laboratório.
4. **Implementar** as duas práticas que protegem o vocabulário: a regra de evolução (ignorar tipos desconhecidos + documentar antes de usar) e a normalização multi-provider (o domínio nunca vê formato raw).
5. **Avaliar** onde termina o vocabulário e começam as camadas vizinhas: a entrega dos eventos é do [capítulo 02](02-transporte-sessao.md); a semântica de agir é dos [capítulos 05](05-acoes-governadas.md)–[06](06-comandos-de-ui.md).

## O problema

Quando um modelo de linguagem (LLM, Large Language Model) responde, o que sai do provedor é um fluxo bruto de fragmentos — *chunks* de texto, às vezes intercalados com raciocínio, chamadas de ferramenta ou metadados, cada provedor no seu formato. Se a aplicação repassar esse fluxo cru ao frontend, três coisas quebram ao mesmo tempo.

Primeiro, quebra a **interpretação**: o frontend precisaria adivinhar, por heurística sobre texto, o que é resposta ao usuário, o que é raciocínio interno, o que é um pedido de ação. Toda mudança de provedor — ou de humor do modelo — quebraria a heurística. As duas bases-laboratório rejeitaram esse caminho e tiparam o fluxo: no `ghdaru`, todo evento da conversa é um `EventKind` fechado num envelope `{seq, kind, payload}` (`apps/api/src/ghdaru_api/conversation/domain/models.py`); no `nexxussai-monorepo`, o stream é uma hierarquia de eventos com fonte da verdade em `apps/api/app/ai_chat/domain/value_objects/stream_event.py` e contrato documentado em `specs/005-backend-ai-chat/contracts/stream-events.md`.

Segundo, quebra a **evolução**: um vocabulário implícito não tem regra para crescer. Um backend que inventa um tipo novo derruba frontends antigos; um frontend que aceita qualquer coisa vira um interpretador de formato indefinido. O contrato do nexxussai enuncia a regra que resolve os dois lados: *o frontend ignora tipos desconhecidos, mas adições devem ser documentadas antes do uso* (tradução nossa; original em inglês em `specs/005-backend-ai-chat/contracts/stream-events.md`, repositório `nexxussai-monorepo`). O vocabulário é fechado *para quem consome* e versionado *para quem produz*.

Terceiro, quebra o **isolamento do provedor**: se o tipo de evento espelhar o formato de um vendor, trocar de provedor é reescrever o protocolo. O nexxussai interpõe um normalizador (`apps/api/app/ai_chat/infrastructure/llm/provider_stream_normalizer.py`) que aceita `str | dict | CompletionChunk | StreamEvent` de qualquer adapter e converte tudo ao vocabulário canônico — o domínio nunca vê o formato raw. O próprio evento de raciocínio carrega a origem sem vazá-la: `thinking_delta` tem um campo `provider` com valores enumerados `anthropic | openai | gemini | text-tags` (`specs/005-backend-ai-chat/contracts/stream-events.md`).

A tensão de desenho, portanto, é tripla: **expressividade** (o vocabulário precisa cobrir conteúdo, raciocínio, artefatos, citações, execução, ações, erros e fim de turno) × **estabilidade** (frontends não podem quebrar quando o vocabulário cresce ou o provedor muda) × **fronteira** (o vocabulário não pode absorver responsabilidades vizinhas — a entrega confiável dos eventos pertence ao transporte, e o significado de "agir" pertence à governança de ações). Este capítulo trata do vocabulário; o envelope `{seq, kind, payload}` é definido aqui, mas a entrega e reentrega dele (`seq`, replay, SSE — Server-Sent Events) são do [capítulo 02](02-transporte-sessao.md), e `action_proposal`/`ui_command` aparecem aqui apenas como membros do vocabulário, com semântica nos [capítulos 05](05-acoes-governadas.md)–[06](06-comandos-de-ui.md).

## Fundamentos científicos

*Este capítulo ainda não tem ciência validada (status ✓) que sustente afirmações do corpo — a seção declara isso explicitamente, conforme o [GUIA-CAPITULO](../GUIA-CAPITULO.md).* A curadoria registrada em [`estudos/candidatos-bibliografia.md`](../../estudos/candidatos-bibliografia.md) aponta uma lacuna consciente: em 2026-07, a literatura científica sobre *protocolos de eventos* e generative UI é incipiente, e a evidência forte é da indústria. Candidatos periféricos, todos ⏳ (a validar): Toolformer ([arXiv 2302.04761](https://arxiv.org/abs/2302.04761) ⏳ — por que o modelo emite *intenções estruturadas* que a aplicação executa) e os surveys de GUI agents ([arXiv 2412.13501](https://arxiv.org/abs/2412.13501) ⏳ — o contraponto "pixels + cliques" ao fluxo tipado). Fontes validadas: [`bibliografia.md`](../bibliografia.md).

## Fontes da indústria

Fichas candidatas (URLs capturadas em 2026-07-30 via [`estudos/panorama-industria.md`](../../estudos/panorama-industria.md); a fase 2 redige a tradução para decisão completa de cada uma):

- **[AG-UI — eventos do protocolo (docs.ag-ui.com/concepts/events)](https://docs.ag-ui.com/concepts/events)**: o AG-UI (Agent-User Interaction Protocol) enumera o vocabulário mais próximo do deste livro — `TextMessageStart/Content/End`, `ToolCallStart/Args/End/Result`, `StateSnapshot`/`StateDelta` (JSON Patch, RFC 6902), eventos de Reasoning e as válvulas `Raw`/`Custom` — confirmando trincas por bloco e vocabulário fechado com extensão controlada.
- **[Vercel AI SDK — UI Message Stream Protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)**: partes tipadas com id e padrão start/delta/end (texto, reasoning, source, tool, *data parts* customizadas) sobre SSE — o formato de eventos tipados mais adotado no ecossistema web, com *data parts* como mecanismo oficial de extensão.
- **[Anthropic — streaming da Messages API](https://platform.claude.com/docs/en/build-with-claude/streaming)**: o envelope `message_start`, `content_block_start/delta/stop`, `message_delta`, `message_stop`, `ping`, `error` é o "nível 0" do provedor — o vocabulário da aplicação é uma re-emissão semântica desses deltas.
- **[ACP — Agent Client Protocol (Zed)](https://kiro.dev/docs/cli/acp/)**: o ACP (Agent Client Protocol) concentra o fluxo agente→cliente em notificações `session/update` tipadas (mensagens, tool calls, progresso) sobre JSON-RPC — mesma ideia de vocabulário fechado, transporte diferente.

## O estado da arte

*(Esqueleto da fase 1 — cada H3 abaixo recebe prosa integral na fase 2.)*

### O envelope: todo evento tem a mesma casca

O `ghdaru` fixa o envelope `{seq, kind, payload}` — `EventKind` como `Literal` fechado no backend (`apps/api/src/ghdaru_api/conversation/domain/models.py`) e espelho TypeScript `ChatEvent {seq, kind, payload}` no frontend (`apps/web/src/features/conversation/domain/events.ts`). O envelope pertence a este capítulo; a entrega e reentrega dele (`seq` monotônico, replay) pertencem ao [capítulo 02](02-transporte-sessao.md). Exemplo fictício: `{"seq": 42, "kind": "content", "payload": {"text": "exemplo-ficticio"}}`.

### As famílias do vocabulário

As duas bases cobrem as mesmas famílias semânticas com nomes distintos — evidência de convergência independente ([`estudos/fonte-base-codigo.md`](../../estudos/fonte-base-codigo.md) §1):

| Família | ghdaru (`models.py`) | nexxussai (`stream_event.py`) |
|---|---|---|
| Conteúdo ao usuário | `content` | `text_delta` |
| Raciocínio | `thought` | `thinking_delta` (campo `provider`) |
| Artefatos | — (lacuna declarada) | `artifact_start/delta/end` |
| Citações | `citation` | — (fonte real é lacuna no ghdaru; ausente no vocabulário nexxussai) |
| Execução de código | — | `execution_start/output/done` |
| Ação (só nomeada aqui) | `action_proposal`, `action_result`, `ui_command` → caps. [05](05-acoes-governadas.md)–[06](06-comandos-de-ui.md) | `tool_call`, `tool_result`, `action_proposal` → caps. 05–06 |
| Erro | `error` | `error` |
| Terminador | `finished` | `done` |

### O padrão triplo start/delta/end na indústria

A forma dominante nos protocolos externos é a trinca por bloco: `TextMessageStart/Content/End` no [AG-UI](https://docs.ag-ui.com/concepts/events), partes start/delta/end no [Vercel AI SDK](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol), `content_block_start/delta/stop` na [Anthropic](https://platform.claude.com/docs/en/build-with-claude/streaming). O nexxussai adota a trinca onde o bloco tem ciclo de vida (`artifact_*`, `execution_*`); o ghdaru usa eventos atômicos por delta — a comparação das duas escolhas é o miolo da prosa desta seção.

### A regra de evolução: fechado para consumir, versionado para produzir

A regra do nexxussai — o frontend ignora tipos desconhecidos, adições documentadas antes do uso (`specs/005-backend-ai-chat/contracts/stream-events.md`) — reaparece na indústria como `Raw`/`Custom` do AG-UI e *data parts* do Vercel AI SDK: extensão existe, mas por um canal previsto no contrato, nunca por tipo improvisado.

### A normalização multi-provider como guarda do vocabulário

O normalizador do nexxussai (`apps/api/app/ai_chat/infrastructure/llm/provider_stream_normalizer.py`, funções `normalize_chunk`/`normalize_stream`) converte `str | dict | CompletionChunk | StreamEvent` ao vocabulário canônico — o domínio nunca vê formato raw; o `provider` do `thinking_delta` (`anthropic | openai | gemini | text-tags`) registra a origem sem contaminar o tipo. No ghdaru, o mesmo papel é da porta de LLM (`LlmChunk kind: reasoning|content|finish`, `apps/api/src/ghdaru_api/ai_gateway/domain/models.py`), cuja arquitetura completa é do [capítulo 08](08-porta-do-modelo.md).

### Protocolo estável, render livre

O ghdaru agrupa deltas consecutivos numa mensagem única *no render*, por função pura de domínio no cliente (`apps/web/src/features/conversation/domain/transcript.ts`), sem tocar o protocolo — a invariante da spec de streaming do próprio ghdaru: a reconexão (replay por `seq`) continua funcionando porque "agrupar é no render" (`specs/007-chat-render-streaming/spec.md`, repositório `ghdaru`). Apresentação evolui sem quebra de contrato.

### Leitura executiva

*(1–2 frases na fase 1; parágrafo completo na fase 2.)* O que roubar: vocabulário fechado com envelope único e espelho tipado nos dois lados; trinca start/delta/end para blocos com ciclo de vida; regra de evolução explícita (ignorar desconhecidos + documentar antes de usar); normalização na borda para que o domínio nunca veja formato de provedor; agrupamento e apresentação sempre no render, nunca no protocolo. *Contrato de frescor: a padronização do vocabulário app↔agente por um protocolo dominante (ex.: adoção massiva do AG-UI ou do UI Message Stream como padrão de fato único) invalida esta leitura e dispara revisão extraordinária.*

## Verificação

1. Por que repassar o stream cru do provedor ao frontend quebra interpretação, evolução e isolamento — e qual artefato de cada base-laboratório responde a cada quebra? (Dica: `EventKind`/envelope, regra de evolução do contrato, normalizador — objetivo 1.)
2. Classifique nas famílias do vocabulário: `thinking_delta`, `artifact_end`, `citation`, `finished`, `tool_result`. Quais desses têm a *semântica* explicada em outro capítulo, e qual? (Dica: a linha "Ação" da tabela remete aos caps. 05–06 — objetivos 2 e 5: classificar exige saber onde termina o vocabulário e começa a camada vizinha.)
3. Em que situação a trinca start/delta/end compensa sobre eventos atômicos por delta, e que protocolos da indústria a adotam? (Dica: blocos com ciclo de vida — artefatos, tool calls — objetivo 3.)
4. Um backend precisa emitir um tipo de evento novo amanhã. Descreva o caminho que não quebra nenhum frontend, citando a regra de evolução e onde ela está documentada. (Dica: ignorar desconhecidos ≠ dispensa de documentação — objetivo 4.)

---

## Apêndice — evidência por laboratório

### ghdaru

- `apps/api/src/ghdaru_api/conversation/domain/models.py` — `EventKind` como `Literal` fechado: `thought, content, action_proposal, action_result, citation, ui_command, finished, error`; `ChatEvent` com `kind: EventKind`; `ChatSession.record(kind, payload)` é o único produtor de eventos (o vocabulário é imposto pelo tipo).
- `apps/web/src/features/conversation/domain/events.ts` — espelho TypeScript do contrato: `ChatEvent { seq: number; kind: ChatEventKind; payload: Record<string, unknown> }`.
- `apps/web/src/features/conversation/domain/transcript.ts` (+ `transcript.test.ts`) — coalescência de deltas em mensagens no render, como função pura de domínio no cliente; o protocolo não muda.
- `specs/007-chat-render-streaming/spec.md` — a invariante escrita: "Reconexão (replay por `seq`) continua funcionando — agrupar é no render".
- Lacunas que confirmam categorias: evento de artefato e `citation` com fonte real declarados como lacuna ([`estudos/fonte-base-codigo.md`](../../estudos/fonte-base-codigo.md) §2.5) — a categoria existe no desenho antes de existir emissor.

### nexxussai-monorepo

- `apps/api/app/ai_chat/domain/value_objects/stream_event.py` — fonte da verdade do vocabulário: `TextDeltaEvent`, `ThinkingDeltaEvent` (com `provider: str`), `ArtifactStart/Delta/EndEvent`, `ExecutionStart/Output/DoneEvent`, `ToolCallEvent`, `ToolResultEvent`, `DoneEvent`, `ErrorEvent`, `ActionProposalEvent` — todos subclasses de `StreamEvent`.
- `specs/005-backend-ai-chat/contracts/stream-events.md` — o contrato canônico: enumeração dos tipos, valores permitidos de `provider` (`anthropic`, `openai`, `gemini`, `text-tags`) e a regra de evolução ("o frontend ignora tipos desconhecidos, mas adições devem ser documentadas antes do uso").
- `apps/api/app/ai_chat/infrastructure/llm/provider_stream_normalizer.py` — `normalize_chunk(chunk: Any) -> StreamEvent` e `normalize_stream(...)`: aceitam `str | dict | CompletionChunk | StreamEvent` e convertem ao vocabulário canônico; o domínio nunca vê formato raw.
- `apps/web/src/store/conversation/useChatStore.ts` — consumidor com switch completo sobre o vocabulário (o lado que "ignora desconhecidos").
- Lacuna que confirma a categoria: `ActionProposalEvent` existe como value object mas nunca é emitido pelo backend ([`estudos/fonte-base-codigo.md`](../../estudos/fonte-base-codigo.md) §3.4) — o vocabulário antecipa a família de ação antes do emissor existir.

### Divergências

- **Nomenclatura Constituição × código (ghdaru)**: a Constituição do ghdaru fala em `ToolCallRequest/Confirmation/Response`; o código emite `action_proposal`/`action_result` — divergência registrada como lacuna declarada ([`estudos/fonte-base-codigo.md`](../../estudos/fonte-base-codigo.md) §2.5). Lição para a fase 2: vocabulário versionado exige um único nome canônico por conceito.
- **Granularidade**: o ghdaru usa eventos atômicos por delta (`content`, `thought`) sem trinca; o nexxussai usa a trinca start/delta/end onde o bloco tem ciclo de vida (`artifact_*`, `execution_*`) — as duas escolhas convivem porque o *envelope* é estável nos dois casos.
- **Terminadores e erro**: `finished` (ghdaru) × `done` (nexxussai); `error` nos dois — mesma topologia, léxicos independentes (a espinha empírica do livro).
