# Spec 029 — Padrão APH v0.4: refinamentos validados no laboratório (ADR 0005)

**Status**: Implementada · **Data**: 2026-08-10 · **Raia**: plena (edição normativa + wire)

## O quê

Subir ao normativo os quatro refinamentos do [ADR 0005](../../adr/0005-refinamentos-aph-do-laboratorio-ghdaru-r5-r6.md), vindos dos rounds R5/R6 do épico Chat-OS do `ghdaru` — **com a maturidade corrigida pela verificação de evidência** (ver §"O que a verificação mudou"). O padrão sobe a **v0.4**; o fio sobe a **v0.3** (Anexo A), porque a citação ganha campo opcional.

1. **APH-2.6 (novo, 🧪)** — proveniência na família *citação*: discriminador de vocabulário fechado que separa fonte curada de fonte não-confiável/efêmera. Toca o fio (campo opcional no schema do evento).
2. **APH-6.6 (novo)** — invariante read×mutação com guarda **fail-closed** no executor direto: comando de UI de classe mutadora não é despachado direto; nasce proposta. Metade ✅ (o verbo governado), metade 🧪 (a guarda em runtime).
3. **APH-3.4 refinado + APH-5.4 promovido a ✅ + APH-5.8 (novo, 🧪)** — `context_hash` é **frescor, não autorização**; para ações mutadoras, os **valores de campo** usados na execução DEVERIAM ser server-authoritative.
4. **APH-7.1 reforçado** — conteúdo do usuário e resultados de ferramenta entram como camada **explicitamente demarcada como não-confiável**; a demarcação DEVE existir no contrato de contexto antes de qualquer conteúdo não-confiável ser injetado.

## Por quê

Pedido do Accountable (2026-08-10, "vamos atualizar o protocolo"), sobre a proposta redigida em sessão paralela (ADR 0005, commit `c6633d3`). É a primeira vez que o padrão é refinado por **evidência de laboratório vinda de rounds com comitê e security review** — o oposto do caminho da v0.3, que veio de um caso externo.

## O que a verificação de evidência mudou (Princípio I)

O ADR 0005 foi conferido path a path contra o tip atual do laboratório (`ghdaru` em `a02cb12` — o clone desta sessão estava em `5084575`, anterior aos rounds). Todos os paths existem e três afirmações precisaram de correção antes de virar norma:

| Afirmação do ADR | O que o código mostra | Efeito na norma |
|---|---|---|
| P1: proveniência é "discriminador de **vocabulário fechado**" | `wire.py:77` — `provenance: str \| None = None`, **string aberta**; o golden schema não tem `enum`; o próprio comentário diz "pronto para quando o anexo virar citável (**PENDENTE**)" | APH-2.6 entra **🧪** (campo declarado, não emitido; vocabulário fechado é recomendação de desenho, não fato de laboratório) |
| P2: "maturidade ✅ em laboratório" | metade sim (`ui.submit` governado, com teste anti-regressão), metade **não**: a guarda no executor não existe — `ui-commands.ts:67` ainda despacha `session.logout` (risco `confirm`) direto, e o ADR 0018 **do laboratório** registra o bug como aberto | APH-6.6 declara as duas metades com maturidade separada |
| P3: divergência → "estado `stale`" | o laboratório transiciona a proposta para **`cancelled`** e levanta `STALE_CONTEXT` (409) — não há estado `stale` na FSM (`agent_turn.py:355-362`; `models.py:21`) | APH-5.4 sobe a ✅ pela **substância** (comparar e recusar); o estado `stale` canônico segue 🧪, e o nome do laboratório entra no mapeamento §A.8 |
| ADR: "o fio permanece v0.2 / sobe para v0.2.1" | o §A.9 do próprio anexo só define MINOR e MAJOR, e a versão do anexo é `0.MINOR` | fio vai a **v0.3** — campo opcional novo é MINOR, não PATCH (não existe PATCH nesta régua) |

### E o que a revisão independente corrigiu depois

A verificação acima não bastou: a revisão em contexto fresco encontrou que **eu mesmo herdei uma quarta afirmação sem conferir** — a cláusula "teste anti-regressão que impede o executor de ganhar um caso de submissão" veio da prosa do ADR 0018 do laboratório e **não existe no código** (`git grep ui.submit -- apps/web` → zero ocorrências). Corrigido para o que existe (`ui_submit` é ação de catálogo com `permission="ask"` → FSM, testada em `test_ui_submit.py`, atrás de flag desligado por padrão). O achado é a prova de que a régua vale também para quem a aplica: *toda* afirmação herdada precisa de path conferido, inclusive a que confirma o que você já quer acreditar.

## Critérios de aceite

- [x] **CA-1**: cada refinamento entra com a maturidade que a evidência sustenta; nenhum 🧪 vira DEVE (régua do §0/§5 preservada). *Reprovou na revisão independente* — APH-5.8, APH-6.6 e o reforço do APH-7.1 estavam com DEVE, e o item do APH-6.6 caíra no bloco obrigatório do Nível 2, o que faria o próprio laboratório reprovar por um requisito que ninguém implementou. Corrigido antes do registro; a dívida pré-existente do §4.9 (🧪 com DEVE desde a v0.1) fica anotada no plano.
- [x] **CA-2**: toda afirmação nova sobre o laboratório tem path **conferido nesta spec** contra o tip `a02cb12`, não herdado do ADR. *Reprovou na revisão independente* numa afirmação (o "teste anti-regressão"); corrigida, e o commit-âncora passou a constar no cabeçalho do padrão.
- [x] **CA-3**: o fio sobe a v0.3 pela regra do §A.9 (campo opcional novo = MINOR): schema do evento aceita `provenance` na citação, exemplos cobrem presença e ausência, e o gate de wire continua verde.
- [x] **CA-4**: divergência de nome registrada (`PROPOSAL_CONTEXT_STALE` canônico ↔ `STALE_CONTEXT` do laboratório) no mapeamento do Anexo A.
- [x] **CA-5**: revisão independente em contexto fresco, que **refez a verificação contra o código do laboratório** e reprovou o lote na primeira passada — 2 críticos, 5 importantes e 8 menores, todos corrigidos ou registrados como decisão antes deste registro; CHANGELOG + HISTORICO (edição 0.11); publicado.

## Fora de escopo

Alterar o laboratório (somente leitura); novos checks na suíte de conformidade para APH-6.6/5.8 (candidatos registrados — são de Nível 2, e a suíte cobre o Nível 1); comparar com o `nexxussai-monorepo` para promover de "lab" a "convergente".
