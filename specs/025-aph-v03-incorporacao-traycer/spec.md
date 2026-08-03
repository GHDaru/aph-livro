# Spec 025 — Padrão APH v0.3: incorporação dos aprendizados do caso Traycer

**Status**: Implementada · **Data**: 2026-08-03 · **Raia**: plena (edição normativa do padrão + notas datadas)

## O quê

Incorporar ao livro os 8 candidatos registrados no [estudo de caso Traycer](../../estudos/caso-traycer.md) (§4, spec 024), pela porta prevista (spec própria + contrato de frescor do padrão):

1. **Emenda APH-1.3**: admitir mecanismo equivalente de entrega confiável — snapshot completo + deltas com fonte durável (CRDT/persistência) — quando entregar a mesma garantia ("não perder a conversa").
2. **Nota APH-2.2**: reconhecer o regime de evolução alternativo — versionamento negociado por método, fail-closed — para transportes bidirecionais/desktop.
3. **APH-5.6 e APH-5.7 (novos, 🧪 DEVERIA)**: gates pendentes sobrevivem à reconexão; fila de aprovação separada por classe de ação (ex.: edições de arquivo com `paths[]`).
4. **Evidência externa em APH-6.4**: terceira implementação independente de slot filling estruturado (interview do Traycer) — requisito segue 🧪.
5. **Tensão A2A registrada**: cautela não-herdada (`full_access` por instrução) como contraexemplo do trade-off autonomia×segurança — notas datadas nos caps. 07 e 11.
6. **Linha Traycer na matriz do cap. 10**, com nota datada explicando a natureza da linha (aplicação, não spec de ecossistema).
7. **Evidência para E1** no registro de expiração (🔵 mantido — pontuação só em janela).
8. **"O que roubar"** nos caps. 03 e 05: `retryable` no erro, progresso *replace-latest*, sumário/detalhe de tool pré-computados, sentinelas de capacidade.

O padrão sobe a **v0.3**; o **fio não muda** — Anexo A permanece v0.2 (nenhum schema alterado; os itens novos são 🧪/DEVERIA sem campo novo obrigatório).

## Por quê

Pedido do Accountable (2026-08-03, "proximo"), executando o encaminhamento registrado no fechamento da spec 024: "a incorporação dos candidatos ao padrão (v0.3) fica para spec própria". O estudo propôs; esta spec decide e incorpora — mantendo a régua da constituição (evidência por path; caso externo não promove requisito a ✅: a régua do §5 do padrão exige laboratório ou convergência ≥3).

## Critérios de aceite

- [x] **CA-1**: os 8 candidatos do estudo têm destino explícito nesta spec (incorporado onde/como, ou recusado com motivo); nenhum é silenciosamente ignorado.
- [x] **CA-2**: nenhum requisito muda de maturidade por evidência exclusivamente externa: APH-5.6/5.7 nascem 🧪 e APH-6.4 segue 🧪 (régua do §5 preservada); nenhum 🧪 vira DEVE.
- [x] **CA-3**: o wire não muda — `valida-wire.mjs` continua verde sem alteração de schema; o §9 do padrão declara explicitamente "Anexo A permanece v0.2".
- [x] **CA-4**: toda nota nova em capítulo é datada (2026-08-03) e aponta para o estudo; termos novos ganham entrada no glossário no mesmo commit (regra anti-jargão).
- [x] **CA-5**: revisão independente em contexto fresco conferiu as edições contra o estudo, o padrão e o clone (amostragem de paths) — 2 achados críticos (regra anti-jargão; checkboxes prematuros) e 1 importante (frase "nenhuma linha" do cap. 10) corrigidos antes do registro; CHANGELOG + HISTORICO (edição 0.07); publicado no site (merge na `main`).

## Fora de escopo

Alterar schemas do Anexo A; reescrever prosa dos capítulos além das notas datadas; suíte de conformidade executável; pontuar E1/E2 (rito de janela).
