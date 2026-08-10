# Spec 030 — Skills de avaliação de código contra o Padrão APH

**Status**: Implementada · **Data**: 2026-08-10 · **Raia**: plena (ferramenta de adoção)

## O quê

Duas skills que fazem, por leitura de código, o que a suíte de conformidade não alcança de fora:

1. **`aph-avaliar`** — audita uma base de código contra o padrão e devolve status por requisito **com evidência por path**, separando o que é DEVE do que é DEVERIA e o que é mecanismo do que é só declaração. É a automação do que a spec 023 fez à mão para o ghdaru.
2. **`aph-sugerir`** — pega os desvios de uma avaliação e produz a **proposta de mudança**: o que alterar, onde, em que ordem de dependência, com critério de pronto amarrado a teste ou ao check da suíte.

As duas carregam as lições caras que este repositório pagou para aprender — e que um agente sem elas repete: crédito parcial vira conformidade presumida; declaração não é mecanismo; leitura estima, execução calibra.

## Por quê

Ideia do Accountable (2026-08-10): *"poderíamos ter skills de avaliação de código, de sugestão de alteração. De repente não é má ideia."* É a peça que faltava no par: a suíte (specs 026–027) mede comportamento de fora e lista **10 itens** que só a leitura do código alcança (sanitização server-side, separação de camadas, registry, normalizador, metades-cliente). Essas skills atacam exatamente esses 10 — e, ao contrário da suíte, funcionam sem subir a aplicação.

## Critérios de aceite

- [x] **CA-1**: as skills leem o padrão **do repositório**, nunca de uma cópia embutida — o requisito muda, a skill acompanha sem edição.
- [x] **CA-2**: `aph-avaliar` proíbe status "de memória": cada linha do relatório exige `path:linha` ou a declaração explícita de ausência; o formato de saída é o do roteiro da spec 023, que já passou por revisão independente.
- [x] **CA-3**: as três armadilhas conhecidas estão escritas nas skills, com o caso real que as originou: (a) crédito parcial — o APH-1.5 que a leitura deu 🟡 e a execução deu ❌; (b) declaração × mecanismo — o "filtro `aiActions`" que era intenção declarada, não filtro; (c) maturidade — DEVERIA não bloqueia, e sub-afirmar é erro tanto quanto sobre-afirmar.
- [x] **CA-4**: `aph-avaliar` distingue o que ela pode concluir sozinha do que **exige a suíte executável**, e recomenda rodá-la — as duas ferramentas não se substituem.
- [x] **CA-5**: `aph-sugerir` nunca altera laboratório nem código de terceiro por conta própria: a saída é proposta com critério de pronto; alterar é decisão de quem é dono do código.
- [x] **CA-6**: gates verdes; página publicada descrevendo as skills; CHANGELOG + HISTORICO.

## Fora de escopo

Skill que *aplica* as mudanças (a fronteira é proposta, não execução); skills para os Níveis 2–3 além do que o padrão já normatiza; publicar as skills como pacote instalável.
