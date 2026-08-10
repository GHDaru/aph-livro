# ADR 0006 — Nível experimental e obrigação condicional: resolvendo a dívida do §4.9

**Data**: 2026-08-10 · **Status**: Aceito · **Decisor**: GHDaru (Accountable) · **Spec**: 031

## Contexto

O §0 do padrão declara: **"Requisito 🧪 nunca é DEVE."** A revisão independente da spec 029 apontou que o §4.9 (Federação, Nível 3) viola essa regra desde a v0.1 — `APH-9.1` e `APH-9.2` são 🧪 e usam DEVE. A varredura da spec 031 confirmou que a violação é **exatamente essa**: nos demais 9 requisitos 🧪 do padrão, a palavra normativa é DEVERIA.

A correção óbvia — rebaixar 9.1 e 9.2 para DEVERIA — tem uma consequência que só aparece quando se olha o §3: `APH-9.3` **já é** DEVERIA. Ou seja, o Nível 3 passaria a ter **zero requisitos obrigatórios**. Um nível de conformidade sem obrigação nenhuma não distingue quem o cumpre de quem o declara — e o padrão inteiro existe para trocar declaração por prova.

O problema real não é a palavra normativa dos requisitos. É que **a régua do §0 foi escrita presumindo que todo requisito vive num nível já provado**, e o Nível 3 é inteiramente experimental: nenhum laboratório federou nada.

## Decisão

Separar as duas coisas que a régua misturava: **a maturidade do requisito** e **a maturidade do nível que o exige**.

1. **O Nível 3 (Federado) passa a ser declarado 🧪 — um nível experimental**, no §3 e no checklist. Nenhuma implementação o exercitou; quem o adota está construindo à frente da evidência, e o padrão diz isso na cara.
2. **Dentro de um nível experimental, requisito 🧪 PODE usar DEVE** — porque a obrigação é **condicional**: ela não obriga ninguém a federar; obriga *quem escolher federar* a fazê-lo assim. "Se você declara Nível 3, então o manifesto DEVE ser validável" é coerente mesmo sem implementação, e é justamente o tipo de obrigação que evita que o primeiro implementador invente um segundo protocolo.
3. **A regra do §0 ganha essa precisão**: 🧪 nunca é DEVE **em nível comprovado** (1 e 2); em nível declarado experimental, o DEVE vale como obrigação condicional, e o aviso de maturidade fica no nível.

`APH-9.1` e `APH-9.2` **mantêm** o DEVE. O que muda é o Nível 3, que passa a carregar a marca de experimental.

## Alternativas avaliadas

- **Rebaixar 9.1/9.2 para DEVERIA.** Recusada: esvazia o Nível 3 (fica sem obrigação alguma) e transforma um nível de conformidade em rótulo. Pior: as duas obrigações que perderíamos são as de segurança (`origin` verificado nos dois lados, token por introspecção) — exatamente onde afrouxar é mais caro.
- **Promover 9.1/9.2 a ✅.** Recusada por falsidade: nenhum laboratório federou; o padrão não inventa evidência para consertar uma inconsistência de redação.
- **Remover o Nível 3 até haver implementação.** Recusada: a projeção MCP do catálogo é a direção que os dois laboratórios declararam em roadmap, e apagar o desenho perderia a orientação para quem chegar lá primeiro. Um nível marcado experimental cumpre o papel sem fingir maturidade.
- **Trocar a régua do §0 por "🧪 nunca é obrigatório para autodeclaração".** Recusada: é a mesma coisa dita pior — a obrigação condicional já resolve, e mexer na régua geral por causa de um nível é remendo com alcance maior que o problema.

## Consequências

- O padrão sobe para **v0.5** — a palavra normativa não mudou, mas o significado de "Nível 3" mudou: quem o declara agora declara também que está em terreno experimental.
- Os Níveis 1 e 2 seguem intocados; a régua "🧪 nunca é DEVE" continua valendo onde sempre valeu, agora dita com a precisão que faltava.
- Abre precedente útil: se um dia nascer um Nível 4 (ou um perfil para UI não-chat), ele nasce experimental e amadurece por evidência, sem forçar a escolha entre "obrigação vazia" e "maturidade fingida".
- O fio não muda (Anexo A permanece v0.3).
