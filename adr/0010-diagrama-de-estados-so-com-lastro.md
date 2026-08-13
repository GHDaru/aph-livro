# ADR 0010 — Diagrama de estados nas jornadas: um por laboratório, e só com lastro

**Data**: 2026-08-13 · **Status**: aceita · **Decisor**: parecer de especialista em forma e acessibilidade, com a recomendação adotada integralmente · **Complementa**: [ADR 0008](0008-jornadas-do-protocolo.md), regras 1 e 2

## Contexto

A [J09](../livro/jornadas/README.md) é a jornada que o índice chama de "o eixo do Bloco 2: a máquina de estados inteira". Um diagrama de sequência mostra a ordem das mensagens no fio; ele não mostra **quais arestas existem**, quais estados são terminais, nem o que acontece com uma transição inválida. A pergunta era se a série deve admitir um segundo gênero de diagrama — o `stateDiagram-v2` do mermaid — e, se sim, sob que regra.

O ADR 0008 fixou duas coisas que apertam essa decisão: a tabela é a **fonte normativa** da sequência, por acessibilidade medida; e "a seta marca o grau", traço cheio para o comprovado e tracejado para o desenhado.

## Decisão

### 1. Entram os três gêneros, com divisão de trabalho explícita

A J09 leva `sequenceDiagram` para o fio, uma **tabela de transições** como fonte normativa da máquina, e um `stateDiagram-v2` **por laboratório**. Nunca um diagrama da união dos dois.

O custo no motor é zero: o `build.mjs` não tem plugin de mermaid nem script na casca, então qualquer bloco `mermaid` sai como bloco de código no site publicado e desenha no GitHub. O `stateDiagram-v2` não acrescenta dependência nenhuma — o custo é rigorosamente o mesmo do `sequenceDiagram`, que já é zero. A seção 3 do ADR 0008 não é obstáculo aqui.

### 2. Nunca um diagrama da união dos laboratórios

Este é o ponto que decidiu a forma. As duas máquinas implementadas têm sete estados cada e **cinco em comum**; a união dá nove. Mas elas não são recortes de um mesmo grafo:

- o laboratório B não tem `awaiting_approval`: o `proposed` dele faz esse trabalho. Um grafo único com os dois estados penduraria as arestas de B no lugar errado e mentiria sobre os dois sistemas;
- o laboratório B tem `confirmed → denied` — recusa **depois** de o humano ter confirmado —, uma aresta que a cadeia da norma não sugere.

Desenhar a união produziria um grafo que nenhum sistema implementa. É a regra 1 do ADR 0008 aplicada a um grafo em vez de a um fio.

### 3. A regra nova: diagrama de estados só com tudo comprovado

> **Só se desenha diagrama de estados quando cada estado e cada aresta dele têm path.** O que não tem lastro fica fora do desenho e vive na tabela, com coluna de grau.

A razão é técnica antes de ser editorial: **o gênero não comporta a regra 2 do ADR 0008**. No `stateDiagram-v2` a única sintaxe de transição é a seta cheia; não há traço tracejado nem estilo de aresta. Estilizar por cor falharia no leitor de tela, sumiria no site — onde não há renderização — e dependeria do tema do GitHub.

Como a regra 2 é o que protege o Princípio I, e o gênero não a comporta, a saída não é inventar notação: é tornar a limitação uma regra. Assim a seta tracejada nunca é necessária, e a ausência da sintaxe deixa de ser um problema.

O caso concreto é o estado `stale`: ele não tem implementação em laboratório nenhum, e sai de todo desenho. Aparece em três lugares textuais — linha na tabela de transições com grau 🧪, `note` dentro do próprio bloco (que é texto, sobrevive ao bloco não renderizado e não inventa semântica) e linha em "Lacunas e derivas".

### 4. A acessibilidade piora, e é por isso que a tabela vem antes

Medido no gênero: `accTitle` e `accDescr` funcionam nos dois tipos de diagrama, então o teto é o mesmo. Abaixo dele, o diagrama de estados é **pior** que o de sequência, e pior justamente no que interessa. No de sequência a ordem do documento acompanha grosso modo a ordem das mensagens, então a sopa geométrica ao menos sai em sequência. No de estados o layout é em camadas: chegam uma lista de nomes de estado e uma lista solta de rótulos, sem origem nem destino. *Qual aresta existe* — a única coisa que a figura foi posta ali para dizer — é inteiramente geometria.

Daí a ordem obrigatória: **a tabela vem antes do diagrama de estados**, e é ela que responde à pergunta para quem lê no terminal ou com leitor de tela. Aqui a tabela não é redundância: é a única via acessível.

O formato da tabela é `Estado | Alcançáveis | Gatilho | Decisor | Terminal? | Grau | Onde (laboratório · path)`.

### 5. Lacuna nomeada: a norma exige uma tabela que ela não publica

O APH-5.1 diz que "transições fora da tabela DEVEM falhar" — e **a tabela não está escrita em lugar nenhum da norma**. O que existe é uma cadeia feliz e um conjunto de estados terminais.

A consequência é concreta, e não teórica: as arestas `proposed → executing` (que a [J08](../livro/jornadas/j08-acao-de-leitura.md) já publicou), `proposed → denied`, `proposed → expired` e `confirmed → denied` existem em código e em nenhum lugar da norma. Um requisito que manda respeitar uma tabela inexistente não é verificável.

Vira candidata a spec em `GHDaru/protocolos`, e este livro não a preenche por conta própria.

## Alternativas avaliadas

- **Só a tabela, sem diagrama de estados.** Recusada: o gênero certo para grafo é grafo, e a J09 tem uma pergunta que a prosa não responde barato. Com a regra 3, o risco que motivava a recusa desaparece.
- **Um diagrama de estados da máquina de referência inteira.** Recusada: inventaria arestas, porque a norma não as publica. É o modo mais direto de este livro criar protocolo por acidente.
- **Um diagrama da união dos dois laboratórios.** Recusada pela seção 2.
- **Tracejar as arestas sem lastro.** Recusada: o gênero não tem a sintaxe, e estilizar por cor quebra nos três canais que importam.
- **Terceira figura para o laboratório B.** Recusada por peso: ele não é variação de forma do fio, como foi o caso na J08, e sim um conjunto de terminais diferente — a tabela expressa isso sem custo.

## Consequências

- A série passa a ter dois gêneros de diagrama, com regras diferentes. A diferença precisa ser dita onde ela aparece, e não presumida.
- Toda jornada que desenhe estados fica obrigada a ter a tabela **antes** da figura.
- Uma candidata a spec sai para `GHDaru/protocolos`: publicar a tabela de transições que o APH-5.1 exige.
- O `stale` fica sem figura em toda a série. Onde ele importa de verdade — a tela que mudou entre propor e confirmar — a [J10](../livro/jornadas/README.md) trata do mapeamento de nomes do §A.8, em que o laboratório encerra como `cancelled` e chama o erro pelo nome local.
