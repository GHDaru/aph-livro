# Spec 031 — Padrão APH v0.5: nível experimental e obrigação condicional

**Status**: Implementada · **Data**: 2026-08-10 · **Raia**: plena (edição normativa; sem mudança de fio)

## O quê

Fechar a dívida que a revisão da spec 029 apontou: o §4.9 usa **DEVE** em requisitos **🧪**, violando a régua do próprio §0 ("requisito 🧪 nunca é DEVE") desde a v0.1. A varredura confirmou que a violação é exatamente essa — `APH-9.1` e `APH-9.2`; nos outros nove requisitos 🧪 do padrão a palavra é DEVERIA.

A correção **não** é rebaixar as duas para DEVERIA: `APH-9.3` já é DEVERIA, então o Nível 3 ficaria com **zero obrigações** — um nível de conformidade que não distingue quem cumpre de quem declara. A solução, registrada no [ADR 0006](../../adr/0006-nivel-experimental-e-obrigacao-condicional.md), separa duas coisas que a régua misturava:

1. **O Nível 3 passa a ser declarado experimental** (🧪) no §3 e no checklist — nenhuma implementação conhecida o exercitou.
2. **Dentro de um nível experimental, requisito 🧪 PODE usar DEVE**, porque a obrigação é **condicional**: não obriga a federar, obriga quem federar. `APH-9.1` e `APH-9.2` mantêm o DEVE — inclusive porque o que se perderia ao afrouxar são as duas travas de segurança (verificar `origin` nos dois lados, validar token por introspecção).

Padrão sobe a **v0.5**. O fio não muda (Anexo A permanece v0.3).

## Por quê

Pedido do Accountable (2026-08-10, "faça a 1a"), sobre a dívida que eu havia deixado registrada como decisão dele. É dívida de coerência interna: um documento normativo que viola a própria régua ensina que a régua é decorativa.

## Critérios de aceite

- [x] **CA-1**: varredura completa dos requisitos 🧪 do padrão, não só do §4.9 — para saber se a dívida é pontual ou sistêmica (é pontual: 2 de 11).
- [x] **CA-2**: a correção não esvazia o Nível 3 — depois dela, o nível continua tendo obrigações verificáveis.
- [x] **CA-3**: a régua do §0 fica dita com a precisão que faltava, e a exceção tem nome, escopo e racional linkado — não é caso especial silencioso.
- [x] **CA-4**: nada de fio; nenhum schema tocado; gates verdes.
- [x] **CA-5**: ADR com as alternativas realmente avaliadas (incluindo as duas que eu recusei e por quê); CHANGELOG + HISTORICO (edição 0.12).

## Fora de escopo

Reescrever o §4.9 (o conteúdo dos requisitos de federação não muda); criar suíte para o Nível 3; qualquer mudança nos Níveis 1 e 2.
