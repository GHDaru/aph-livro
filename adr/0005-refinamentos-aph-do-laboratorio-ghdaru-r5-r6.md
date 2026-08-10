# ADR 0005 — Refinamentos do padrão APH validados no laboratório `ghdaru` (spec 030, rounds R5/R6)

**Data**: 2026-08-10 · **Status**: Proposto (candidato a **v0.4** do padrão; base v0.3) · **Decisor**: gate humano (GHDaru)

> Registro de decisão + evidência. **Não** altera as implementações-laboratório (somente leitura, Constituição
> §2). Propõe edições ao `livro/padrao-aph.md` (v0.3) e capítulos 03/05/06/07, a executar por spec própria
> (Maestro) com gate humano. Cada item cita path verificável no `ghdaru` (Constituição §1 — evidência).
> Distingue-se da ADR 0004 (divisão em dois repositórios): esta trata **conteúdo normativo**, e pertence à
> metade "especificação do Padrão APH".

## Contexto

O laboratório `ghdaru` executou dois rounds do épico Chat-OS (`ghdaru/specs/030-chat-os/`, ADR 0016) com
**comitê de especialistas em contexto fresco + revisão independente + security review dedicada**:

- **R5 — anexo efêmero de sessão** (`ghdaru/docs/adr/0017-anexo-no-chat-corte-reversivel.md`): corte reversível
  (guardar+referenciar) × irreversível (processar+egressar); introduziu proveniência de citação.
- **R6 — `ui.submit` governado** (`ghdaru/docs/adr/0018-ui-submit-governado-pela-fsm.md`): o verbo mutador
  atravessa a FSM (não o executor direto); valores do snapshot sanitizado, não do LLM; `STALE_CONTEXT`
  implementado e verificado.

Disso saíram quatro refinamentos de nível protocolo, **compatíveis e aditivos** ao contrato existente
(nenhum novo `kind`; o Anexo A/fio permanece v0.2 — só a família *citação* ganha campo opcional).

## Decisão (4 refinamentos propostos)

### P1 — Proveniência na família *citação* (novo **APH-2.6**, 🧪 → verificado em laboratório)

*A citação, quando emitida, **DEVERIA** carregar um discriminador de **proveniência** de vocabulário fechado
(ex.: `tenant_document`, `session_attachment`, `web`, `tool`), para o consumidor distinguir fonte **curada** de
fonte **não-confiável/efêmera**. Ausência ⇒ origem legada/desconhecida. Campo aditivo (APH-2.2).*

- **Racional:** sem proveniência, o render trata o anexo do usuário (não-confiável) e o documento curado com a
  **mesma autoridade** — liga-se a APH-7.1/7.3.
- **Evidência (ghdaru):** `conversation/domain/wire.py` → `CitationPayload.provenance`; golden
  `apps/api/contracts/aph/citation.schema.json`; teste
  `tests/conversation/test_wire_contract.py::test_citation_provenance_is_optional_and_closed`; ADR 0017.
- **Encaixe:** amplia APH-2.1 (família citação); **toca o fio** → Anexo A ganha `provenance` opcional no schema
  de citação (evolução aditiva por A.9).

### P2 — Invariante *read × mutação* com **guarda fail-closed** no executor direto (novo **APH-6.6**; fortalece 6.1–6.3, amarra a 5.1)

**Achado (contraexemplo de laboratório):** tensão latente no padrão — APH-6.1 lista `submit` no vocabulário de
comandos de UI, enquanto APH-5.1 exige que **toda ação nasça proposta**. No `ghdaru`, um verbo mutador
(`session.logout`, classe de risco `confirm`) era despachado **direto** pelo executor de `ui_command`
(`runUiCommand`), **cego à classe de risco** → mutação de estado **sem gate humano**.

*APH-6.6 (novo): O executor direto de comandos de UI (`applyUiCommand`) **NÃO DEVE** despachar comando cuja
classe de risco no catálogo seja mutadora (`confirm`/persistente); **DEVE** consultar a classe de risco e
**recusar fail-closed** — o verbo mutador nasce como `action_proposal` (APH-5.1). No vocabulário de APH-6.1,
`submit` designa a **proposta** de submissão, não execução direta. A linha executa-direto × propõe-e-confirma
(APH-6.3) **DEVE** ser verificada em runtime pelo executor, não apenas declarada.*

- **Evidência (ghdaru):** ADR 0018 (`ui.submit` é ação governada `permission="ask"`, não ganha `case` em
  `runUiCommand`; teste anti-regressão); fail-closed em `conversation/application/agent_turn.py`; bug do
  executor cego a risco em `ghdaru/specs/030-chat-os/backlog-comite-r5.md` (nº6).
- **Maturidade:** ✅ em laboratório (padrão aplicado no R6; contraexemplo `session.logout` documentado).

### P3 — `context_hash` é **frescor, não autorização**; valores **server-authoritative** para mutação (refina APH-3.4/5.4)

**Atualização de maturidade:** **APH-5.4** (comparar `context_hash` proposta×confirm → `stale`) estava 🧪; foi
**implementado e verificado no laboratório** `ghdaru` (`STALE_CONTEXT` em `confirm_governed_action`) → sobe
para ✅-em-laboratório.

*Refino: o `context_hash` **DEVE** ser entendido como **frescor** — protege o usuário honesto cuja tela mudou
entre propor e confirmar —, **não** como controle de autorização (o snapshot do confirm vem do cliente e pode
ser reenviado antigo; APH-3.4 já declara "hash do cliente é hint"; a autz fica fora do LLM, APH-7.2). Para
ações **mutadoras** cujos **valores de campo são o efeito**, esses valores **DEVERIAM** ser
**server-authoritative**: o servidor guarda/revalida os valores `ai_visible` do momento da proposta e os usa na
execução, em vez de confiar nos reenviados.*

- **Evidência (ghdaru):** R6 — no confirm os valores do submit vêm do **snapshot sanitizado**
  (`_submit_overrides` + `arg_overrides`), **nunca do LLM**; a **security review** flagrou como **bloqueante** o
  caminho *fail-open* (cair nos args do LLM quando o override é vazio) → corrigido para **fail-closed**
  (`test_submit_from_wrong_screen_is_failclosed_not_executed`); ADR 0018.

### P4 — Camada **não-confiável explícita** para anexo/conteúdo do usuário (reforça APH-7.1)

**Achado:** APH-7.1 já exige separação de camadas de confiança, mas o laboratório constatou que o montador de
prompt (`ghdaru/apps/api/src/ghdaru_api/harness/domain/context.py::build_system_prompt`) **concatena camadas
com autoridade igual, sem delimitador** — vetor de prompt-injection quando o **conteúdo do anexo** entrar no
contexto (fatia de processamento do R5, PENDENTE).

*Reforço operacional de APH-7.1: conteúdo fornecido pelo usuário (anexo, upload, texto colado) e resultados de
ferramentas **DEVEM** entrar como camada **explicitamente demarcada como não-confiável** (delimitador/rótulo
verificável), nunca concatenados à camada de sistema — o modelo os trata como **dados**, jamais instruções. A
demarcação **DEVE** existir no **contrato de contexto** (o seam), mesmo antes de qualquer conteúdo
não-confiável ser injetado.*

- **Evidência (ghdaru):** parecer do comitê R5 (assento Conteúdo não-confiável) sobre `build_system_prompt`;
  ADR 0017 pré-condição nº4 (*isolamento de conteúdo não-confiável, fora do `build_system_prompt`*).
- **Maturidade:** APH-7.1 é ✅; a demarcação explícita do seam é 🧪 (desenhada, ainda não injetada).

## Alternativas avaliadas

- **Não propor (só implementar no ghdaru).** Rejeitada: os achados são de fronteira; deixá-los no laboratório
  desperdiça a generalização, propósito do livro (Constituição §1/§6).
- **Editar `padrao-aph.md` direto nesta ADR.** Rejeitada: alterar o normativo é mudança maior — segue por spec
  própria (uma spec por capítulo) com Constitution Check e gate humano. Esta ADR é a decisão + evidência.
- **Tratar como conformidade (bug do padrão).** Rejeitada: nada contradiz o normativo atual; são refinamentos
  aditivos (P1/P3/P4) e o fortalecimento de uma invariante já implícita (P2).

## Consequências

- **Próxima entrega:** spec no `specs/` que aplica P1–P4 ao `livro/padrao-aph.md` (§4.2 citação, §4.3 contexto,
  §4.5 ações governadas, §4.6 comandos de UI, §4.7 segurança), atualiza a tabela de maturidade (§5) e — para P1
  — o **Anexo A** (`provenance` opcional no schema de citação, versionamento por A.9). Candidato **v0.4**.
- **Suíte de conformidade** (specs 026/027): P2 (guarda fail-closed no executor) e P3 (frescor server-side de
  campo) são **candidatos a novos checks** executáveis; o `STALE_CONTEXT` do R6 dá ao laboratório ghdaru um
  path para o check de APH-5.4.
- **Compatibilidade:** todos aditivos; nenhum novo `kind`; o fio muda só por P1 (campo opcional na citação —
  Anexo A sobe de v0.2 para v0.2.1/aditivo por A.9, sem quebrar consumidores).
- **Convergência:** a segunda base (`nexxussai-monorepo`) permanece a comparar — proveniência de citação e
  `submit` governado ali são candidatos a registrar antes de subir de "lab" para "convergente".
- **Livro vivo:** edição 0.10 no `livro/HISTORICO.md` (captura 2026-08-10).

## Fontes

- Constituição do livro (§1 evidência, §2 fonte-base somente-leitura, §6 vendor-agnóstico, §7 Maestro).
- `ghdaru`: `docs/adr/0017-*`, `docs/adr/0018-*`, `specs/030-chat-os/{spec.md,backlog-comite-r5.md}`,
  `apps/api/src/ghdaru_api/conversation/domain/{wire.py,screen_registry.py}`,
  `.../conversation/application/agent_turn.py`, `.../harness/domain/context.py`.
- `livro/padrao-aph.md` v0.3 (APH-2.1, 3.4, 5.1, 5.4, 6.1–6.3, 7.1–7.3) e `livro/padrao/anexo-a-wire-format.md`.
