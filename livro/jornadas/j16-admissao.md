# Jornada J16 — Admissão de uma aplicação federada: a jornada que não tem fio

> **Fio capturado em 2026-08** · última revisão 2026-08-13 · [histórico e registro de expiração](../HISTORICO.md)

> ⚠️ **Bloco experimental.** O Nível 3 é declarado experimental pela norma, e nenhuma implementação o exercitou de ponta a ponta. Mais que isso: o próprio anexo registra que, hoje, **a junta não fecharia** — os dois primeiros implementadores escreveram envelopes incompatíveis. Nenhuma jornada deste bloco descreve algo que funcione ponta a ponta.

> 📐 **Esta jornada não tem diagrama de sequência**, e a ausência é a decisão. Ver a seção 1 e o [ADR 0013](../../adr/0013-jornada-sem-fio-e-o-bloco-federado.md).

**Capítulos**: [09 — Federação e composição](../capitulos/09-federacao-composicao.md)
**Norma**: APH-9.1🧪 · [Anexo B §B.4, §B.5, §B.10](https://github.com/GHDaru/protocolos/blob/main/padrao/anexo-b-federacao.md)
**Laboratórios**: manifesto e schema existem do lado do hospedeiro; o contrato de admissão é **autodeclarado**; os prefixos reservados **ninguém publica**
**Maturidade**: ✅ o manifesto e o seu schema, com gate. Autodeclarado o contrato de admissão. 🧪 a lista de prefixos reservados
**Pressupõe**: [J07](j07-catalogo.md) · **Forma**: [ADR 0013](../../adr/0013-jornada-sem-fio-e-o-bloco-federado.md) · **Índice**: [jornadas](README.md)

## Em uma frase

Antes de a primeira mensagem existir, alguém decidiu admitir aquela aplicação. Esta jornada mostra o que precisa estar acordado antes do primeiro embarque — e por que nada disso é uma conversa.

## O que você vai conseguir explicar

- Por que o contrato de admissão chega por configuração, e nunca por mensagem.
- O que o schema do manifesto verifica, e as três coisas que ele **não consegue** verificar.
- Por que uma aplicação a que falta um parâmetro deve se recusar a subir.

## 1. Por que não há fio aqui

O Anexo B é explícito: o que o hospedeiro entrega à aplicação antes do primeiro embarque chega **por configuração — variável de ambiente ou equivalente —, nunca por mensagem**.

Isso não é detalhe de implantação. Se os parâmetros chegassem por mensagem, a aplicação precisaria confiar numa mensagem para saber **de quem** aceitar mensagens, o que é circular. A origem admitida vem de configuração justamente para que a verificação de origem tenha um lado fixo, que o atacante não escolhe.

E há uma segunda razão, mais prosaica: nenhuma rota de admissão é normativa. Onde se busca o manifesto, onde se pede o grant, onde se faz a introspecção — nada disso está fixado pelo anexo. O que a suíte de conformidade usa é **convenção do laboratório**.

Por isso esta jornada não desenha. Um diagrama de sequência aqui teria de inventar mensagens que não existem ou promover a contrato rotas que a norma não fixou — e diagrama publicado vira wire de fato.

O gênero certo para o que acontece na admissão é tabela: uma sequência de **decisões**, e não de trocas.

## 2. Os cinco parâmetros, e o que a ausência de cada um significa

| Parâmetro | Para quê | Se faltar |
|---|---|---|
| Origem do hospedeiro | conferida em **toda** mensagem recebida, e usada como endereço de toda mensagem enviada | a aplicação **recusa subir** |
| Endereço base do hospedeiro | introspecção, perfil, auditoria | recusa subir |
| Identificador da aplicação | identidade no manifesto e prefixo das ações | recusa subir |
| Endereço de embarque | o ponto de montagem declarado no manifesto | recusa subir |
| Ambiente de teste | exercitar a junta sem produção | não impede subir, e **deve** ser oferecido |

A obrigação que sustenta a coluna da direita é curta e vale citar pelo que ela proíbe: a aplicação **deve recusar-se a subir** quando faltar parâmetro obrigatório, com erro categorizado que diga **qual** faltou. E o anexo nomeia as três alternativas como não-conformidades: subir pela metade, funcionar até alguém clicar, e perguntar ao usuário o que o operador deveria ter configurado.

A terceira é a mais tentadora e a pior. Ela transforma um erro de implantação — que tem dono, e é resolvido uma vez — num problema recorrente de cada pessoa que abre a tela.

Mudar qualquer um desses valores é **mudança de admissão**: a aplicação precisa ser reconfigurada, e não descobrir em tempo de execução.

Um detalhe sobre o tema: os tokens que o hospedeiro manda são **parciais por desenho**, e a aplicação precisa ter tema padrão para o que não vier. O nome de exibição do inquilino não é token de tema — viaja em campo próprio.

## 3. O manifesto: o que o schema verifica, e as três coisas que ele não

O manifesto é a declaração prévia do que a aplicação é, que telas oferece e que ações declara. Ele tem schema normativo, com exemplos e contraexemplos no gate — e a tese do capítulo aparece aqui literal: cada ação declarada é o **mesmo objeto** do catálogo interno, com identificador, título, classe de risco e schema de entrada. Não há um segundo protocolo a inventar.

O schema cobra a forma: identificador estável e único, identificadores de ação e de tela **namespaced** por um prefixo estável, classe de risco como string aberta com o mínimo comprovado, e tela marcada como sensível não entrando no snapshot.

E então vem a parte que mais importa para quem admite, porque é onde o gate verde **não** é conformidade. Três obrigações não são expressáveis em schema nenhum:

1. que o endereço de embarque **pertença** à origem declarada;
2. que a origem seja de **site distinto** do hospedeiro — não basta origem diferente;
3. que o prefixo dos identificadores seja de fato exclusivo daquela aplicação no hospedeiro.

As três são verificáveis em código, e são o que a suíte de federação leva. Enquanto isso, **quem admite deve verificá-las fora do schema** — e a segunda delas, na suíte, só é avaliável quando se informa a origem do hospedeiro; sem isso o check sai como indeterminado, porque afirmar que passou seria evidência falsa.

A razão de a segunda ser tão dura está na [J17](j17-embarque-handshake.md): um subdomínio irmão passa em qualquer verificação de origem e ainda assim lê e escreve os cookies de domínio do hospedeiro.

## 4. A rota, e a colisão que se recusa na admissão

Rotas são comparadas na forma canônica — sem barra final, em caixa baixa, nos dois lados e com a mesma função. Rota federada que colida com rota nativa do hospedeiro **deve ser recusada na admissão**, e não resolvida em tempo de execução: sombreamento silencioso de rota é sequestro de navegação.

Aqui há uma assimetria honesta e registrada: o hospedeiro **deve publicar** o conjunto de prefixos reservados no contrato de admissão, para que a aplicação não os declare. Nenhum laboratório publica a lista. O hospedeiro recusa a colisão na admissão sem dizer de antemão contra o quê — ou seja, quem escreve o manifesto descobre o conflito depois de escrevê-lo.

## As verificações da admissão

| Verificação | Decisor | O que acontece se falhar |
|---|---|---|
| Manifesto casa o schema normativo | gate, e quem admite | recusa; há contraexemplos no gate |
| Endereço de embarque pertence à origem declarada | quem admite, **fora do schema** | recusa |
| Origem é de site distinto | quem admite, **fora do schema** | recusa. É a [J19](j19-embarque-recusado.md) |
| Prefixo dos identificadores é exclusivo | quem admite, **fora do schema** | recusa; senão a fusão de catálogos colide |
| Rota não colide com rota nativa | hospedeiro | recusa **na admissão** |
| Os cinco parâmetros chegaram | a aplicação, ao subir | **recusa subir**, dizendo qual faltou |

## Como reconhecer no seu sistema

- Procure de onde vem a origem admitida pela sua aplicação. Se vier de uma mensagem, a verificação de origem é circular.
- Apague um parâmetro obrigatório e suba. Se subir, você tem uma aplicação que vai falhar quando alguém clicar.
- Passe o manifesto no schema e pare. Depois pergunte quem verificou as três coisas que o schema não verifica. Se ninguém, o verde é decorativo.
- Peça ao hospedeiro a lista de prefixos reservados. Se não existir, o seu manifesto vai ser recusado por um motivo que ninguém publicou.

## Lacunas e derivas (2026-08-13)

| Lacuna | Onde | Estado | Gatilho |
|---|---|---|---|
| **Nenhum laboratório publica a lista de prefixos reservados**, e o hospedeiro recusa a colisão sem dizer de antemão contra o quê | §B.10.2 | **aberta**, já no índice | primeira publicação |
| **Nenhuma rota da admissão é normativa** — manifesto, emissão do grant, introspecção. O que existe é convenção do laboratório, inclusive na suíte | §B.4, §B.5, §B.6 | **aberta**, candidata a spec na norma | fixar as rotas, ou declarar que são livres |
| A tabela dos cinco parâmetros é **prosa sem número de cláusula**: a matriz de obrigações só tem as três subcláusulas seguintes, então "o hospedeiro deve entregar antes do primeiro embarque" não tem dono atribuído | §B.4 | **deriva**, reportada à norma | numerar a cláusula |
| As três obrigações que o schema não expressa dependem de quem admite; a suíte cobre duas, e a de site distinto **só com a origem informada** | §B.5.4, §B.1.2 | conhecida e declarada | — |
| O contrato de admissão inteiro é **autodeclarado**: a suíte não o alcança | §B.4 | conhecida | é limitação de método |

**O que promoveria esta jornada**: um hospedeiro que publique os prefixos reservados, e rotas de admissão fixadas na norma — sem elas, a aplicação federada precisa descobrir por convenção o que deveria ler no contrato.

## Verificação

1. Por que a origem admitida chega por configuração e não por mensagem? Construa o argumento circular que justificaria o contrário e mostre onde ele quebra.
2. Uma aplicação sobe sem o endereço base do hospedeiro e pergunta ao usuário qual é. Diga por que isso é não-conformidade, e o que ela transforma um problema de implantação em quê.
3. O manifesto passou no schema. Cite as três coisas que continuam por verificar, e diga qual delas um subdomínio irmão do hospedeiro atravessaria sem esforço.

---

## Apêndice — evidência por fonte

### Do lado do hospedeiro

| Momento | Onde |
|---|---|
| Schema normativo do manifesto, com exemplos e contraexemplos | `padrao/schemas/federacao-manifesto.schema.json` e `padrao/schemas/exemplos-anexo-b.json`, verificados pelo gate de wire |
| Recusa de colisão de rota na admissão | roteador do chat do laboratório A |
| Publicação dos prefixos reservados | **não existe** |

### Da suíte de federação

| Check | O que derruba |
|---|---|
| `manifesto-schema` | manifesto que não casa o schema normativo |
| `manifesto-fronteiras` | embarque em claro; endereço fora da origem declarada; aplicação no mesmo site do hospedeiro; identificador fora do prefixo declarado |

O check de fronteiras sai como **indeterminado** quando a origem do hospedeiro não é informada, porque a cláusula de site distinto deixa de ser avaliável — e afirmar que passou seria evidência falsa.

### O que a suíte não alcança

O contrato de admissão inteiro, e as verificações de navegador. Das obrigações do anexo, mais da metade é autodeclarada, e oito são exclusivamente da aplicação — que **não tem verificação executável nenhuma**, porque o canal exige navegador.

### Onde isto está na norma

| Momento | Cláusula |
|---|---|
| 1. Por configuração, nunca por mensagem | §B.4 |
| 2. Os cinco parâmetros e a recusa de subir | §B.4, §B.4.1, §B.4.2, §B.4.3 |
| 3. Manifesto, e o que o schema não verifica | §B.5, §B.5.1–§B.5.4; APH-9.1 🧪 |
| 4. Rota canônica e prefixos reservados | §B.10.1, §B.10.2 🧪 |
