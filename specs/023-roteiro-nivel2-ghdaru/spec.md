# Spec 023 — Roteiro de conformidade APH Nível 2 para o ghdaru

**Status**: Em implementação · **Data**: 2026-07-31 · **Raia**: plena (auditoria + handoff; nenhum código alterado)

## O quê

Handoff para o time do ghdaru (`handoffs/ghdaru-roteiro-conformidade-aph-nivel2.md`): a auditoria do ghdaru contra **todos** os requisitos dos Níveis 1 e 2 do Padrão APH v0.2 — status por requisito com evidência por path (✅ conforme / 🟡 parcial / ❌ ausente) — e o **roteiro em etapas ordenadas por dependência** para a autodeclaração de Nível 2 (Operador), reusando o handoff anterior (integridade da confirmação) onde ele já cobre a lacuna.

## Por quê

Pedido do Accountable (2026-07-31, "roteiro nível 2"). O padrão existe (v0.2 com wire format); o valor agora é medi-lo contra o laboratório principal — o que também é o primeiro teste de usabilidade do próprio checklist do padrão.

## Critérios de aceite

- [ ] **CA-1**: todo requisito de Nível 1 e Nível 2 do padrão aparece na auditoria com status e evidência (path do ghdaru ou declaração de ausência com fonte — capítulo/estudo que a registra); nenhum status "de memória".
- [ ] **CA-2**: as lacunas viram roteiro em etapas com dependências explícitas e critério de pronto por etapa; o que o handoff "integridade da confirmação" já cobre é referenciado, não duplicado.
- [ ] **CA-3**: o roteiro distingue o que fecha DEVEs (bloqueia a autodeclaração) do que é DEVERIA/🧪 (recomendado); estimativa de esforço relativa (P/M/G) por etapa.
- [ ] **CA-4**: revisão independente confere a tabela de status contra o código real do ghdaru; CHANGELOG registrado; publicado no site (merge na `main`).

## Fora de escopo

Alterar código dos laboratórios; suíte de conformidade executável; roteiro equivalente para o nexxussai (decisão vigente: não mexer).
