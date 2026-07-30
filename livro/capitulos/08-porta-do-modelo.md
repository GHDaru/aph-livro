# 08 — A porta do modelo e o tool calling

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

> **Fase editorial**: estrutura (fase 1 do [GUIA-CAPITULO](../GUIA-CAPITULO.md), spec 012). "O problema" está completo; o estado da arte está em esqueleto de H3 com resumos; o Apêndice já mapeia a evidência por path.

## Objetivos de aprendizagem

Ao final deste capítulo, você deve ser capaz de:

1. **Explicar** por que existe uma segunda fronteira, interna, entre o protocolo aplicação↔harness e os provedores de LLM (Large Language Model) — a porta do modelo — e o que ela normaliza: chunks tipados, erros traduzidos em categorias de domínio e usage como fato contábil.
2. **Distinguir** três vocabulários que se tocam nessa fronteira: o dialeto de streaming de cada provedor, o vocabulário interno de chunks da porta e o vocabulário público de eventos do protocolo (este último é assunto do cap. 03).
3. **Analisar** a lacuna espelhada das duas bases-laboratório: catálogo de ações pronto para tool calling (`input_schema` em JSON Schema — JSON, JavaScript Object Notation) sem que nenhuma delas entregue o catálogo ao modelo como tools — a intenção ainda nasce de roteamento determinístico.
4. **Avaliar** o caminho de migração do roteador determinístico para o tool calling real, à luz do que a indústria já padronizou (function calling, streaming de argumentos, aprovação como estado de protocolo) e do que muda — e do que não muda — no restante do protocolo.

## O problema

Os capítulos anteriores trataram da fronteira **externa**: a aplicação conversando com o harness por snapshot, catálogo e eventos tipados. Mas o harness tem uma segunda fronteira, **interna**, da qual o restante do protocolo depende sem enxergar: em algum ponto ele precisa falar com um provedor de LLM. E cada provedor fala um dialeto próprio de streaming — a Messages API (Application Programming Interface) da Anthropic emite um envelope `message_start` / `content_block_delta` / `message_stop` ([docs de streaming](https://platform.claude.com/docs/en/build-with-claude/streaming)); endpoints OpenAI-compatíveis emitem deltas com extensões como `delta.reasoning_content`, que o adapter do ghdaru precisa mapear explicitamente (`apps/api/src/ghdaru_api/ai_gateway/adapters/nemotron.py`, repositório `ghdaru`).

Sem disciplina, esse dialeto vaza: o caso de uso passa a conhecer o formato do provedor, trocar de modelo vira reescrita, e um erro de rede do vendor aparece cru na conversa do usuário. As duas bases-laboratório responderam da mesma forma, de modo independente: **uma porta única**. No ghdaru, `LlmProviderPort` (`apps/api/src/ghdaru_api/ai_gateway/ports/llm_provider.py`) devolve um stream de `LlmChunk` com apenas três kinds — `reasoning`, `content`, `finish` — com erros traduzidos em categorias de domínio e `TokenUsage` viajando no chunk `finish` (`apps/api/src/ghdaru_api/ai_gateway/domain/models.py`). No nexxussai, `LLMPort` (`apps/api/app/ai_orchestration/domain/ports/llm_port.py`, repositório `nexxussai-monorepo`) é servida por quatro adapters (Anthropic, OpenAI, Gemini, DeepSeek) selecionados por `llm_factory.py`, e um normalizador dedicado converte qualquer formato de chunk ao vocabulário canônico antes que o domínio o veja (`apps/api/app/ai_chat/infrastructure/llm/provider_stream_normalizer.py`).

A porta, porém, é hoje uma boca sem mãos: ela só gera texto (e raciocínio, e usage). A **intenção** — "o usuário quer navegar", "o usuário quer preencher este formulário" — não nasce do modelo em nenhuma das duas bases. No ghdaru, quem decide é um roteador determinístico por keywords, o `RuleBasedIntentRouter` atrás da porta `IntentRouterPort` (`apps/api/src/ghdaru_api/conversation/ports/ports.py` e `adapters/rule_intent.py`), com o "adaptador LLM" registrado como evolução prevista. No nexxussai, a porta de LLM sequer aceita um parâmetro `tools` — `LLMPort` expõe apenas `complete`/`stream` de strings (`apps/api/app/ai_orchestration/domain/ports/llm_port.py`).

É aqui que aparece a lacuna mais reveladora das duas bases — e ela é a **mesma** nas duas. O catálogo de ações de ambas já carrega `input_schema` em JSON Schema, exatamente o formato que o function calling dos provedores espera (`apps/api/src/ghdaru_api/conversation/domain/catalog.py` no ghdaru; `docs/integration/manifest.schema.json` formaliza `actions[]` com `input_schema`); mas nenhuma delas entrega esse catálogo ao modelo como tools. O nexxussai chegou a especificar a porta completa — `ILLMCompletion`, com `CompletionRequest.tools` e `supports_tools()` — mas ela existe **só como documento** (`docs/backend-ai-chat-interface.md`), e o roadmap declara tool calling real como fase 4 (`docs/proposta-chat-lateral.md`). O nexxussai tem até uma pré-história instrutiva: `AGENT_TOOLS` com function calling manual e um loop agêntico com `max_iterations` no legado `flows/` (`apps/api/app/flows/tools.py`, `apps/api/app/flows/execution_runner.py`) — o padrão foi tentado, abandonado e agora espera renascer dentro do protocolo governado.

A tensão que este capítulo mapeia é, portanto, tripla: o roteamento determinístico é barato, previsível e auditável, mas quebra diante da linguagem natural real; o tool calling entrega ao modelo a decisão de *quando*, *qual* e *com que argumentos* agir, mas custa tokens, introduz não-determinismo e exige que a governança do cap. 05 esteja pronta para recebê-lo; e a porta única precisa evoluir sem deixar o dialeto de nenhum provedor vazar para o domínio. A aposta registrada no [registro de expiração](../HISTORICO.md) como **E2** nasce deste capítulo: as duas bases implementarão tool calling real antes de adotarem qualquer protocolo externo de UI (User Interface).

## Fundamentos científicos

*Nesta fase (estrutura), os papers abaixo são **candidatos com status ⏳** em [`estudos/candidatos-bibliografia.md`](../../estudos/candidatos-bibliografia.md); nenhum sustenta afirmação do corpo até a validação dupla (⏳ → ✓ em [`bibliografia.md`](../bibliografia.md)), que é trabalho da fase 2.*

- **Toolformer** ([arXiv 2302.04761](https://arxiv.org/abs/2302.04761)) — ⏳. LLMs aprendem *quando* chamar uma API, *qual* chamar e *com que argumentos* — o ancestral científico do function calling que a ponte roteador→tools pressupõe.
- **τ-bench** ([arXiv 2406.12045](https://arxiv.org/abs/2406.12045)) — ⏳. Agentes de function calling de ponta resolvem menos de metade das tarefas com política de domínio, com inconsistência severa entre execuções — o argumento empírico para não entregar a intenção ao modelo *sem* a governança do cap. 05.

## Fontes da indústria

- **[Function calling — OpenAI](https://platform.openai.com/docs/guides/function-calling)**: tools declaradas com nome, descrição e parâmetros em JSON Schema; o modelo devolve uma chamada estruturada e a aplicação executa. Tradução para decisão: o `input_schema` que as duas bases já guardam no catálogo é o payload de declaração de tools quase pronto — a ponte é entrega, não redesenho.
- **[Fine-grained tool streaming — Anthropic](https://platform.claude.com/docs/en/agents-and-tools/tool-use/fine-grained-tool-streaming)**: argumentos de tool chegam em streaming (`input_json_delta`), com modo de baixa latência sem buffering de JSON. Tradução para decisão: a porta do modelo precisará de um quarto kind de chunk (tool call parcial) — o vocabulário `reasoning|content|finish` de hoje não o comporta.
- **[Tool Approvals — Vercel AI SDK](https://ai-sdk.dev/docs/agents/tool-approvals)**: tools com `needsApproval: true` param no estado `approval-requested` e o frontend decide. Tradução para decisão: a indústria confirma o que as duas bases já desenharam — a intenção nascida por tool calling deságua numa proposta com confirmação humana (cap. 05), como estado do protocolo, não como prompt.

## O estado da arte

*Esqueleto da fase 1 — cada H3 indica o que a prosa da fase 2 demonstrará.*

### Duas fronteiras, dois contratos

A fase 2 demonstrará que o desenho tem duas fronteiras com contratos distintos: a externa (app↔harness, caps. 02–06) e a interna (harness↔provedor), e que a saúde da externa depende da estanqueidade da interna. Evidência: `ai_gateway` como módulo isolado no ghdaru; `ai_orchestration` como BC próprio no nexxussai.

### A porta única e os chunks tipados

O contrato mínimo da porta: stream de chunks com kinds fechados (`reasoning|content|finish` em `apps/api/src/ghdaru_api/ai_gateway/domain/models.py`, `ghdaru`), erros traduzidos em categorias de domínio e nenhum tipo do vendor atravessando. A seção comparará com o `LLMPort` de strings do nexxussai (`apps/api/app/ai_orchestration/domain/ports/llm_port.py`).

### O adapter como tradutor de dialetos

Como um adapter mapeia o dialeto do provedor para o vocabulário interno: `nemotron.py` traduzindo `delta.reasoning_content` → chunk `reasoning` (`ghdaru`); a factory de quatro provedores (`llm_factory.py`) e o normalizador que aceita `str|dict|CompletionChunk|StreamEvent` (`provider_stream_normalizer.py`, `nexxussai-monorepo`). Fronteira com o cap. 03: o chunk interno **não** é o evento público — a re-emissão semântica é do vocabulário do protocolo.

### Usage como fato contábil: o chunk finish

Por que `TokenUsage` viaja no chunk `finish` e alimenta o metering no ghdaru (`apps/api/src/ghdaru_api/ai_gateway/domain/models.py`; contrato fixado em `apps/api/tests/adapters/test_usage_flow.py`). A seção argumentará que custo é responsabilidade da porta, não do caso de uso.

### Como a intenção nasce hoje: roteamento determinístico

O `RuleBasedIntentRouter` por keywords atrás de `IntentRouterPort` (`apps/api/src/ghdaru_api/conversation/ports/ports.py`, `adapters/rule_intent.py`, `ghdaru`) — barato e auditável, mas rígido; a decisão registrada de que o adaptador LLM é evolução. No nexxussai, a intenção do chat lateral ainda nem nasce: `ActionProposalEvent` está definido (`apps/api/app/ai_chat/domain/value_objects/stream_event.py`) mas nunca é emitido pelo backend.

### A lacuna espelhada: catálogo pronto para tools, tools ausentes

O mesmo vazio nas duas bases: `input_schema` em JSON Schema no catálogo (`catalog.py`, `ghdaru`; `manifest.schema.json`) sem caminho de código que o entregue como tools; `ILLMCompletion` com `CompletionRequest.tools` só como especificação (`docs/backend-ai-chat-interface.md`, `nexxussai-monorepo`); roadmap fase 4 (`docs/proposta-chat-lateral.md`). A convergência da lacuna é tão informativa quanto a convergência do desenho.

### A pré-história instrutiva: function calling manual e o loop agêntico

O legado `flows/` do nexxussai (`apps/api/app/flows/tools.py` com `AGENT_TOOLS`; `execution_runner.py` com loop de `max_iterations`) como fóssil do padrão: function calling feito à mão, fora do protocolo governado — e o que ele ensina sobre por que a segunda tentativa deve nascer dentro dele.

### A ponte: do roteador ao tool calling

O caminho de migração em que a intenção passa a nascer do modelo (function calling com o catálogo como tools; streaming de argumentos por `input_json_delta`) mas o **destino** da intenção não muda: continua caindo na FSM (Finite State Machine, máquina de estados finitos) de proposta→confirmação do cap. 05, com aprovação como estado do protocolo ([Tool Approvals, Vercel AI SDK](https://ai-sdk.dev/docs/agents/tool-approvals)). É a seção que sustenta a aposta E2 do [registro de expiração](../HISTORICO.md).

### Leitura executiva

*Rascunho (fase 1).* O que roubar deste capítulo: (1) **uma porta, três kinds** — normalize todo provedor num vocabulário interno mínimo de chunks (`reasoning|content|finish`) com erros em categorias de domínio e usage no `finish`, e nunca deixe o dialeto do vendor passar da camada de adapter; (2) **o catálogo é a declaração de tools** — se as ações já têm `input_schema` em JSON Schema, o tool calling é entrega de um artefato existente, não um novo desenho; (3) **mude o nascimento, não o destino** — migrar de roteador determinístico para tool calling troca *quem decide a intenção*, mas a proposta com confirmação humana (cap. 05) permanece o funil único. Contrato de frescor: se qualquer das duas bases entregar tool calling real (ou adotar um protocolo externo de UI antes disso), a aposta E2 do [registro de expiração](../HISTORICO.md) é pontuada e este capítulo entra em revisão extraordinária.

## Verificação

1. Por que as duas bases isolam o provedor de LLM atrás de uma porta única, em vez de deixar o caso de uso falar direto com a API do vendor? (dica: pense no que aconteceria com o domínio ao adicionar um segundo provedor com dialeto de streaming diferente — veja o normalizador do nexxussai no Apêndice)
2. Um `LlmChunk` de kind `reasoning` é a mesma coisa que o evento de raciocínio que chega ao frontend? (dica: fronteira 08×03 — um pertence ao vocabulário *interno* da porta; o outro, ao vocabulário *público* do protocolo)
3. Qual artefato já está pronto para tool calling nas duas bases, e qual peça falta em cada uma? (dica: `input_schema` em JSON Schema no catálogo × parâmetro `tools` ausente na porta de uma base e porta com `tools` só em documento na outra)
4. Ao migrar do roteador por keywords para tool calling, o que muda no *nascimento* da intenção — e o que não muda no seu *destino*? (dica: a FSM de proposta→confirmação do cap. 05 continua sendo o funil único; a aprovação vira estado do protocolo, como no `needsApproval` do Vercel AI SDK)

---

## Apêndice — evidência por laboratório

### ghdaru

- `apps/api/src/ghdaru_api/ai_gateway/ports/llm_provider.py` — `LlmProviderPort`: a porta única de LLM do harness; todo provedor entra por aqui.
- `apps/api/src/ghdaru_api/ai_gateway/domain/models.py` — `LlmChunk(kind: reasoning|content|finish, usage)`; erros do provedor traduzidos em categorias de domínio; `TokenUsage` no chunk `finish` é a base do metering (spec 004 do ghdaru; contrato fixado em `apps/api/tests/adapters/test_usage_flow.py`).
- `apps/api/src/ghdaru_api/ai_gateway/adapters/nemotron.py` — adapter OpenAI-compatível; mapeia `delta.reasoning_content` → chunk `reasoning`; **não passa tools/function calling** ao provedor.
- `apps/api/src/ghdaru_api/conversation/ports/ports.py` + `adapters/rule_intent.py` — `IntentRouterPort` e `RuleBasedIntentRouter`: a intenção nasce de roteamento determinístico por keywords; o adaptador LLM é evolução prevista, registrada.
- `apps/api/src/ghdaru_api/conversation/domain/catalog.py` — o Catálogo de Ações com `ActionSpec` e `input_schema` (ex.: `enum` de rotas derivado dos módulos do tenant): o artefato pronto-para-tools.
- Lacuna que confirma a categoria: nenhum caminho de código entrega o catálogo ao modelo como tools — o `input_schema` existe, a ponte não (lacunas declaradas em `estudos/fonte-base-codigo.md` §2.5).

### nexxussai-monorepo

- `apps/api/app/ai_orchestration/domain/ports/llm_port.py` — `LLMPort` atual: apenas `complete`/`stream` de strings, **sem parâmetro `tools`**.
- `apps/api/app/ai_orchestration/infrastructure/llm/llm_factory.py` + `anthropic_adapter.py`, `openai_adapter.py`, `gemini_adapter.py`, `deepseek_adapter.py` — quatro provedores atrás da mesma porta, selecionados por `LLM_PROVIDER`.
- `apps/api/app/ai_chat/infrastructure/llm/provider_stream_normalizer.py` — normalização provider-agnóstica: aceita `str|dict|CompletionChunk|StreamEvent` de qualquer adapter e converte ao vocabulário canônico; o domínio nunca vê formato raw.
- `docs/backend-ai-chat-interface.md` — a porta `ILLMCompletion` com `CompletionRequest.tools` e `supports_tools()`: especificada por completo, **não implementada**.
- `docs/proposta-chat-lateral.md` — roadmap de maturidade: fase 4 = tool calling real.
- `apps/api/app/flows/tools.py` (`AGENT_TOOLS`, function calling manual) + `apps/api/app/flows/execution_runner.py` (loop agêntico com `max_iterations`) — a pré-história do padrão no produto, fora do protocolo governado.
- Lacuna que confirma a categoria: `ActionProposalEvent` definido (`apps/api/app/ai_chat/domain/value_objects/stream_event.py`) mas nunca emitido pelo backend — sem tool calling, a intenção do chat lateral ainda não nasce (lacunas declaradas em `estudos/fonte-base-codigo.md` §3.4).

### Divergências

- **Um adapter × quatro + factory**: o ghdaru tem um único adapter (OpenAI-compatível, `nemotron.py`); o nexxussai tem quatro provedores atrás de `llm_factory.py` — e por isso precisou de uma camada de normalização dedicada (`provider_stream_normalizer.py`), enquanto no ghdaru a normalização vive no próprio adapter.
- **Usage first-class × ausente da porta**: o ghdaru carrega `TokenUsage` no chunk `finish` e o liga ao metering; a porta atual do nexxussai (strings) não transporta usage tipado — o custo não é fato contábil da porta.
- **Onde a ponte está mais perto**: o nexxussai já escreveu a porta com tools por inteiro (`ILLMCompletion`, só documento) e tem a pré-história agêntica em `flows/`; o ghdaru não especificou a porta com tools, mas tem o *nascimento* da intenção já isolado atrás de uma porta própria (`IntentRouterPort`) — trocar o roteador por um adaptador LLM é substituição de adapter, não cirurgia no domínio.
- **Intenção em produção × intenção ausente**: no ghdaru a intenção nasce hoje (determinística, por keywords); no nexxussai ela ainda não nasce no chat lateral (`ActionProposalEvent` nunca emitido) — a mesma lacuna, em estágios diferentes.
