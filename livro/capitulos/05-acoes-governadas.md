# 05 — Ações governadas

> **Estado da arte capturado em 2026-07** · última revisão 2026-07-30 · [histórico e registro de expiração](../HISTORICO.md)

## Objetivos de aprendizagem

Ao final deste capítulo, você deve ser capaz de:

1. **Explicar** por que o catálogo declarado é a única superfície executável do agente — e por que "o que não está declarado, a IA não faz" é uma decisão de arquitetura, não de prompt;
2. **Distinguir** os quatro momentos de uma ação governada — proposta, confirmação, execução, resultado — e descrever a máquina de estados que os conecta;
3. **Analisar** como risco, confirmação, idempotência e detecção de contexto desatualizado (`context_hash`) se combinam para tornar uma ação segura sem torná-la burocrática;
4. **Avaliar** a governança de ações de um protocolo app↔IA existente, identificando qual dos quatro momentos está ausente ou enfraquecido;
5. **Decidir**, para uma ação nova do seu produto, sua classe de risco e o gate correspondente (executa direto, exige confirmação, ou fica fora do alcance do agente).

## O problema

Um chat que apenas responde é inofensivo. Um chat que **age sobre a aplicação** — navega, preenche formulários, dispara operações — cruzou uma linha: cada mensagem do modelo é, potencialmente, uma mutação no sistema. E modelos erram, alucinam parâmetros e podem ser manipulados por conteúdo injetado (o modelo de ameaça completo é o assunto do capítulo 07). A pergunta central deste capítulo é: **como deixar a IA agir sem entregar a ela o teclado?**

A resposta ingênua — confiar no modelo e pedir cautela no prompt — falha por construção: prompt é sugestão, não contrato. A resposta paranoica — confirmar tudo com o usuário — mata o valor do agente afogando o usuário em diálogos de permissão. Entre os dois extremos existe um desenho que as duas bases-laboratório deste livro encontraram de forma independente, e que a indústria está convergindo para padronizar: **toda ação nasce de um inventário declarado, vira uma proposta com estado, atravessa um gate proporcional ao risco e deixa um traço auditável**.

As restrições em tensão:

- **autonomia × segurança** — quanto mais o agente faz sozinho, maior o valor e maior o dano potencial;
- **fricção × governança** — cada confirmação protege o usuário e custa atenção do usuário;
- **flexibilidade × previsibilidade** — um agente que improvisa ações novas é impressionante em demo e ingovernável em produção;
- **velocidade × auditabilidade** — registrar tudo custa; não registrar custa mais, depois.

## Fundamentos científicos

> **Validação pendente.** Os papers abaixo são candidatos (⏳) registrados em [`estudos/candidatos-bibliografia.md`](../../estudos/candidatos-bibliografia.md); nenhuma afirmação do corpo deste capítulo depende deles. A rodada de fundamentação científica os validará (✓) ou substituirá em [`bibliografia.md`](../bibliografia.md).

- ⏳ *ToolEmu* ([arXiv 2309.15817](https://arxiv.org/abs/2309.15817)) — emulação de tools para expor riscos de agentes de linguagem antes da execução real; interessa como base empírica da tese "a execução direta é o momento errado de descobrir que a ação era perigosa" — exatamente o que a etapa de *proposta* resolve.
- ⏳ *AgentDojo* ([arXiv 2406.13352](https://arxiv.org/abs/2406.13352)) — benchmark de ataques de prompt injection contra agentes com tools; interessa como evidência de que a superfície executável precisa ser fechada *fora* do modelo.
- ⏳ *τ-bench* ([arXiv 2406.12045](https://arxiv.org/abs/2406.12045)) — avaliação de agentes que devem seguir regras de domínio ao executar ações; interessa à discussão de políticas de risco declarativas.

(Bibliografia completa e status de validação: [`livro/bibliografia.md`](../bibliografia.md).)

## Fontes da indústria

- **[MCP — Elicitation (spec 2025-06-18)](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation)** (Model Context Protocol, oficial): o servidor pode pausar uma operação e **pedir input estruturado ao usuário** via cliente, com schema. Tradução para decisão: o padrão "a ação para e pergunta" virou primitiva de protocolo — a Proposta de Ação dos laboratórios é a mesma ideia com estado persistente.
- **[Tool approvals — Vercel AI SDK](https://ai-sdk.dev/docs/agents/tool-approvals)** e **[Human-in-the-loop cookbook](https://ai-sdk.dev/cookbook/next/human-in-the-loop)** (Vercel, oficial): tools podem declarar `needsApproval`; a execução fica suspensa até `addToolApprovalResponse`. Tradução para decisão: a confirmação humana é atributo **da tool no catálogo**, não lógica espalhada na UI — igual ao `risk` do `ActionSpec` e ao `requires_confirmation` do laboratório B.
- **[Agent Client Protocol — `session/request_permission`](https://agentclientprotocol.github.io/python-sdk/)** (Zed/ACP, SDK oficial): o agente solicita permissão ao cliente antes de operações sensíveis, como primitiva JSON-RPC do protocolo. Tradução para decisão: mesmo em protocolos agente↔editor, o gate de permissão é mensagem tipada de primeira classe — não um "você tem certeza?" renderizado ad hoc.
- **[OWASP Top 10 for LLM Applications 2025 — LLM06: Excessive Agency](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf)** (OWASP, oficial): mitigação recomendada para agência excessiva: *least privilege* nas tools e **aprovação humana para ações de alto risco**. Tradução para decisão: a taxonomia de risco com gate proporcional não é preferência de design — é a recomendação normativa de segurança.
- **[AG-UI — eventos `ToolCallStart/Args/End/Result`](https://docs.ag-ui.com/concepts/events)** (AG-UI, docs oficiais): o protocolo dedicado agente↔UI carrega o ciclo de tool call como eventos tipados no stream. Tradução para decisão: até quem padroniza só a *camada de eventos* precisou dar ao ciclo de ação um vocabulário próprio — ação não é texto.

## O estado da arte

### O catálogo como única superfície executável

O primeiro movimento da governança acontece antes de qualquer mensagem: a aplicação **declara** o que o agente pode fazer. No laboratório A (ghdaru), isso é o **Catálogo de Ações** — cada ação é um `ActionSpec` com identificador, título, palavras-chave de intenção, classe de risco, `input_schema` (JSON Schema) e rota de UI associada. A regra é literal: *"a IA só invoca ações do catálogo — o que não está declarado, ela não faz"*. No laboratório B (nexxussai-monorepo), o equivalente é o **ScreenRegistry** com a taxonomia `ActionKind` (`navigate`, `fill_fields`, `focus_field`, `submit`, `open_resource`, `clarify`): o registro de telas, compartilhado entre frontend e backend, delimita quais telas, campos e ações existem — o modelo não pode propor o que o registro não conhece.

Dois refinamentos merecem atenção:

1. **O catálogo é derivado, não estático.** No ghdaru, o `enum` de rotas do `ui.navigate` é construído a partir dos **módulos habilitados do tenant** — uma rota desabilitada nunca sequer entra no catálogo que o modelo vê. A governança começa na *composição* do inventário, não na checagem posterior.
2. **O catálogo é um contrato tipado.** O `input_schema` em JSON Schema faz dupla função: valida os argumentos da ação e — na evolução prevista pelos dois laboratórios — vira a definição de *tool* entregue ao modelo (a ponte catálogo→tool calling é o assunto do capítulo 08).

Exemplo de entrada de catálogo (valores fictícios):

```json
{
  "action_id": "ui.navigate",
  "title": "Navegar para uma tela",
  "risk": "read",
  "input_schema": {
    "type": "object",
    "properties": { "route": { "enum": ["/inicio", "/projetos", "/arquivos"] } },
    "required": ["route"]
  }
}
```

### A máquina de estados: proposta → confirmação → execução → resultado

O segundo movimento: **nenhuma ação executa no momento em que o modelo a menciona**. Ela nasce como *proposta* — um objeto de domínio com identidade, estado e transições validadas em código. Os dois laboratórios implementaram máquinas de estados (Finite State Machine, FSM) independentes e quase isomorfas:

| | ghdaru | nexxussai-monorepo |
|---|---|---|
| Estados | `proposed → awaiting_approval → confirmed → executing → executed \| failed \| cancelled` | `proposed → confirmed → executed`; `proposed → cancelled \| denied \| expired`; `confirmed → failed \| denied` |
| Validação | tabela `_TRANSITIONS`; transição inválida levanta `InvalidTransition` | transições inválidas levantam erro de domínio |
| Evento IA→app | `action_proposal` / `action_result` | `action_proposal` (com `rationale`, `risk_level`, `requires_confirmation`) |
| Estado extra | `awaiting_approval` explícito para o gate | `expired` (proposta envelhece) e `denied` (política nega) |

A diferença de vocabulário e a igualdade de topologia são o padrão que se repete no livro inteiro: dois times, sem se ver, desenharam o mesmo grafo. E cada um trouxe um estado que falta ao outro — `awaiting_approval` torna o gate observável; `expired`/`denied` reconhecem que propostas envelhecem e que a política (não só o usuário) pode negar. Uma FSM completa da fronteira combina os dois.

O ciclo fecha com o **resultado**: no ghdaru, ações de leitura executam imediatamente e emitem `ui_command`; ações que exigem confirmação param em `awaiting_approval` até o `POST .../proposals/{id}` do usuário. No nexxussai, a proposta é renderizada como `ActionCard` (com justificativa e cor por risco) e os endpoints `confirm`/`cancel` fecham o ciclo, com o resultado registrado via `POST /api/chat/tool-results`.

### Risco e confirmação proporcionais

Confirmar tudo é tão errado quanto não confirmar nada. O terceiro movimento é a **classe de risco declarada**, que determina o gate:

- No ghdaru, a Constituição do produto define uma taxonomia de **8 classes** (de leitura até "bloqueada para o agente"); a implementação atual usa o subconjunto `read | confirm` — `read` executa direto, `confirm` para no gate. A classe vive **no catálogo**, não na cabeça do modelo.
- No nexxussai, uma política de domínio (`ActionProposalPolicyService`) **infere** o `RiskLevel` a partir do `ActionKind` e decide `requires_confirmation` — com duas regras duras: `submit` e `open_resource` sempre confirmam, e risco `high`/`critical` sempre confirma, independentemente do tipo.

Os dois desenhos ensinam a mesma lição com ênfases diferentes: o risco pode ser *declarado por ação* (ghdaru) ou *derivado por política* (nexxussai), mas em ambos ele é decidido **fora do modelo e antes da conversa**. O modelo escolhe *qual* ação propor; nunca escolhe *quanto* de governança ela recebe. É a versão em código da recomendação do OWASP para *excessive agency* (LLM06): privilégio mínimo mais aprovação humana para o que é grave.

### Idempotência e a tela que mudou

O laboratório B contribui com dois refinamentos que o laboratório A ainda não tem — e que resolvem os dois acidentes clássicos do gate humano:

1. **O clique duplo**: entre a confirmação e a execução existe rede, retry e usuário ansioso. A **`idempotency_key`** — obrigatória antes de executar ações persistentes — garante que uma proposta confirmada execute **uma única vez**, não importa quantas vezes a confirmação chegue.
2. **A tela que mudou**: o usuário confirma uma proposta feita sobre um estado de tela que já não existe (navegou, editou, outra aba). O **`context_hash`** — hash do snapshot de contexto que originou a proposta — permite detectar, no momento da confirmação, que o chão se moveu, e recusar ou repropor em vez de executar às cegas.

Ambos são protocolo, não UI: viajam nos contratos (`confirmActionProposal(..., idempotency_key)`; snapshot com `context_hash` de no mínimo 16 caracteres no JSON Schema) e são verificados no servidor. Nenhum dos cinco ecossistemas externos mapeados no capítulo 10 padroniza qualquer um dos dois — é uma das lacunas abertas da indústria.

### O traço de execução

O quarto movimento fecha o ciclo de confiança: **toda ação executada deixa um registro visível e auditável**. No ghdaru, a regra é de aceite do produto: 100% das ações devolvem `action_result` renderizado na conversa e auditável no servidor — *"sem traço, a ação é considerada não-governada e é rejeitada"*. No nexxussai, o `ExecutionTrace` e os tool-results persistidos cumprem o mesmo papel, com escopo por usuário, cliente e perfil ativo — o que também previne dupla execução e sustenta a auditoria multi-tenant.

O traço tem uma propriedade subestimada: ele é o que permite **relaxar** os gates com o tempo. Uma ação hoje classificada como `confirm` pode, com histórico de execuções corretas, ser rebaixada a execução direta — decisão impossível de tomar com segurança sem o registro do que o agente fez e acertou. Governança sem traço é chute; com traço, é política ajustável por evidência.

### A indústria converge para o mesmo padrão

A validação externa do desenho dos laboratórios é a convergência de quatro ecossistemas independentes no mesmo padrão — **a proposta de ação como estado de primeira classe do protocolo**:

| Ecossistema | Primitiva | Mecânica |
|---|---|---|
| Model Context Protocol (MCP) | *elicitation* | servidor pausa a operação e pede input estruturado (com schema) ao usuário via cliente |
| Vercel AI SDK | `needsApproval` / `addToolApprovalResponse` | tool declara que precisa de aprovação; execução suspensa até resposta |
| Agent Client Protocol (ACP) | `session/request_permission` | agente pede permissão ao cliente como mensagem JSON-RPC tipada |
| AG-UI | ciclo `ToolCall*` + frontend tools | ação como eventos tipados; execução no frontend sob controle do host |

Nenhum deles, porém, carrega o pacote completo dos laboratórios: classe de risco declarada no inventário, FSM com estados observáveis, idempotência e `context_hash` seguem específicos das duas bases. A indústria padronizou o *gate*; ainda não padronizou a *governança em volta dele*.

### Leitura executiva

Ações governadas são o coração do protocolo app↔harness: o catálogo declarado fecha a superfície executável fora do modelo; a máquina de estados proposta→confirmação→execução→resultado transforma "a IA fez algo" em um objeto com identidade, gate e história; a classe de risco calibra a fricção; idempotência e `context_hash` blindam o gate contra o clique duplo e a tela que mudou; e o traço auditável é o que permite afrouxar a governança com evidência, em vez de fé. A indústria (MCP elicitation, Vercel `needsApproval`, ACP `request_permission`, AG-UI) convergiu para o gate humano como primitiva de protocolo — mas o pacote completo ainda é diferencial de quem constrói. **O que roubar**: derive o catálogo das permissões reais (tenant/módulo), nunca o deixe estático; modele a proposta como entidade com FSM validada em código (roube `awaiting_approval` de um laboratório e `expired`/`denied` do outro); declare o risco no inventário; exija `idempotency_key` e `context_hash` antes de executar qualquer coisa persistente; e rejeite por princípio ação sem traço.

## Verificação

1. Seu colega propõe deixar o modelo "livre para chamar qualquer endpoint da API interna, com um prompt bem escrito pedindo cuidado". Usando o argumento do catálogo como única superfície executável, explique por que isso falha por construção — e o que o `enum` de rotas derivado do tenant no ghdaru ensina sobre *onde* a governança começa. (Objetivo 1; releia "O catálogo como única superfície executável".)
2. Desenhe a máquina de estados combinada dos dois laboratórios (estados e transições) e aponte: qual estado torna o gate observável, e quais estados reconhecem que uma proposta pode morrer sem execução? (Objetivo 2; releia a tabela da FSM.)
3. Um usuário confirma uma proposta de `submit` 40 segundos depois de tê-la recebido, já em outra tela — e a rede reenvia a confirmação duas vezes. Descreva, mecanismo a mecanismo, o que impede o desastre. (Objetivo 3; releia "Idempotência e a tela que mudou".)
4. Avalie um protocolo que você conhece (ou um dos quatro da tabela de convergência): qual dos quatro momentos — inventário declarado, proposta com estado, gate proporcional ao risco, traço auditável — ele cobre, e qual falta? (Objetivos 4 e 5; releia "A indústria converge".)

---

## Apêndice — evidência por laboratório

> Evidência por path — material de complementação, expandido a cada rodada de captura.

### ghdaru

- `apps/api/src/ghdaru_api/conversation/domain/models.py` — `ActionSpec`, `RiskClass (read|confirm)`, `ProposalStatus` + tabela `_TRANSITIONS` (FSM completa com `awaiting_approval` e `executing`), `InvalidTransition`, `ActionProposal.transition()`.
- `apps/api/src/ghdaru_api/conversation/domain/catalog.py` — catálogo v1: `ui.navigate` (risk=read, `enum` de rotas derivado dos módulos habilitados do tenant), `session.logout` (risk=confirm).
- `apps/api/src/ghdaru_api/conversation/application/handle_message.py` — pipeline `mensagem → sanitize → catálogo → intenção → risco → eventos`; `read` executa e emite `ui_command`; `confirm` para em `awaiting_approval`; `confirm_action()` fecha o ciclo.
- `apps/api/src/ghdaru_api/http/chat_router.py` — `POST /chat/sessions/{id}/proposals/{proposal_id}` (confirmação).
- `apps/api/tests/conversation/test_conversation.py` — testes que fixam a FSM e as transições inválidas.
- Regra de aceite do traço: spec `specs/001-fundacao-shell-chat/spec.md` (FR-010 FSM + traço; SC-004: 100% das ações com `action_result` auditável).
- Taxonomia de 8 classes de risco: `.specify/memory/constitution.md`, Princípio IV (implementadas: `read|confirm` — a lacuna que confirma a categoria).
- Frontend: `apps/web/src/features/conversation/ui/ChatPanel.tsx` (renderização de proposta e confirmação), objeto semântico `conversation.proposal-card` em `apps/web/src/shared/semantic/registry.ts`.

### nexxussai-monorepo

- `apps/api/app/ai_chat/domain/entities/action_proposal.py` — entidade com FSM `proposed → confirmed → executed`, `proposed → cancelled|denied|expired`, `confirmed → failed|denied`; transições inválidas levantam erro de domínio.
- `apps/api/app/ai_chat/domain/value_objects/action_kind.py` — taxonomia `navigate, fill_fields, focus_field, submit, open_resource, clarify`.
- `apps/api/app/ai_chat/domain/services/action_proposal_policy_service.py` — infere `RiskLevel` por `ActionKind`; `submit`/`open_resource` e risco high/critical sempre exigem confirmação.
- `apps/api/app/ai_chat/domain/value_objects/stream_event.py` — `ActionProposalEvent` (`proposal_id, action_kind, rationale, risk_level, requires_confirmation, target_screen_id, field_values`).
- `apps/api/app/ai_chat/infrastructure/http/lateral_chat_router.py` — endpoints `confirm`/`cancel`/`tool-results`; persistência em `action_proposal_orm_model.py` (tabela `ai_chat_action_proposals`).
- `apps/web/src/features/conversation/api/lateralChatService.ts` — `confirmActionProposal(..., idempotency_key)`; `apps/web/src/features/conversation/model/useLateralChat.ts` — idempotency key por proposta (`crypto.randomUUID`) e rollback otimista.
- `specs/014-chat-lateral-contexto/contracts/screen-context.schema.json` — `context_hash` (mínimo 16 caracteres) no snapshot; `specs/014-chat-lateral-contexto/data-model.md` — máquina de estados documentada.
- `specs/014-chat-lateral-contexto/research.md` — decisão formal: executar tool calls automaticamente foi **rejeitado**.
- Lacunas (a ausência que confirma a categoria): o backend ainda não emite `ActionProposalEvent` (falta o use case `ProposeAction`); o frontend não executa ações propostas (sem `ActionExecutionAdapter`); testes T061–T065 abertos em `specs/014-chat-lateral-contexto/tasks.md`; `_DefaultPermissionPolicy` sempre-True (a autorização real é o assunto do capítulo 07).

### Divergências

- **Gate observável × proposta que envelhece**: ghdaru tem `awaiting_approval`/`executing` explícitos; nexxussai tem `expired`/`denied`. Nenhum tem os dois — a FSM combinada do capítulo é a soma.
- **Risco declarado × risco derivado**: ghdaru declara `risk` por ação no catálogo; nexxussai deriva por política a partir do tipo. Convergem no essencial: decidido fora do modelo.
- **Idempotência/`context_hash`**: só no nexxussai. **Catálogo derivado do tenant**: só no ghdaru.
