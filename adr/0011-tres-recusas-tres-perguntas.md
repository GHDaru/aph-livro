# ADR 0011 — Três recusas, três perguntas: a divisão entre J10, J14 e J15

**Data**: 2026-08-13 · **Status**: aceita · **Decisor**: parecer de especialista em segurança de protocolos, com a recomendação adotada integralmente · **Complementa**: [ADR 0008](0008-jornadas-do-protocolo.md), seção 6

## Contexto

Três jornadas da série tratam de recusa: a [J10](../livro/jornadas/README.md) (a tela mudou entre propor e confirmar), a [J14](../livro/jornadas/README.md) (recusa por autoridade) e a [J15](../livro/jornadas/README.md) (injeção barrada). As três acontecem no mesmo lugar do fio, no mesmo endereço, e terminam do mesmo jeito: sem execução.

O risco era escrever o mesmo argumento três vezes com nomes diferentes — e, pior, escrever nas três a frase "o hash não autoriza", que é verdadeira e pertence a uma só.

## Decisão

### 1. Cada jornada responde a uma pergunta, e só a ela

> **A J10 responde "este contexto ainda é o mesmo?".**
> **A J14 responde "esta pessoa pode?".**
> **A J15 responde "este conteúdo é confiável?".**

As três recusam, e por motivos diferentes. Quando uma delas precisar de uma das outras, cita em uma frase e aponta — nunca reexplica.

O corte concreto:

- **J10** fica com a mecânica do frescor: o que entra no hash, quem o calcula, por que o cliente não pode ser a fonte, e o limite declarado do controle. Fica também com a recusa terminal e o que ela não registra.
- **J14** fica com a autoridade: a política decide fora do modelo e **depois** do humano. A J10 a cita como a resposta à pergunta "então o que autoriza?", em uma linha, sem reexplicar capacidades.
- **J15** fica com a procedência: por que os argumentos do modelo são suspeitos por origem, e o que sustenta a exigência de valores reconstruídos no servidor. A J10 empresta essa premissa em uma frase.

### 2. A frase-tese da J10, e onde ela não se repete

O `context_hash` é controle de **frescor**, não de **autorização**. Ele protege o usuário honesto cuja tela mudou; não prova que a confirmação é legítima, porque o snapshot da confirmação vem do cliente, e um cliente malicioso pode reenviar um antigo.

O que efetivamente barra esse ataque é outra coisa: a autorização fora do modelo, o catálogo como única superfície executável derivada das permissões reais, e os valores reconstruídos no servidor com falha fechada. **O hash não aparece nessa lista**, e é essa a tese da J10.

A J14 e a J15 herdam a conclusão sem reconstruir o argumento.

### 3. A J10 registra o que a norma subestima

O APH-5.4 diz hoje que "comprovada está a substância, que é comparar e recusar; o estado dedicado e o nome canônico, não". A J10 pode dizer, sem contradizer a promoção do requisito, que isso **subestima o custo**: o que se perde ao encerrar a recusa por contexto obsoleto no mesmo terminal da recusa humana não é cosmético de nomenclatura, é a auditabilidade da recusa.

A formulação da lacuna é dupla de propósito, porque as duas metades têm remédios diferentes: a metade do **estado** se resolve implementando o estado dedicado; a metade do **traço** se resolve dizendo na norma por qual mensagem a recusa por guarda atravessa o fio.

## Alternativas avaliadas

- **Uma jornada só de recusas.** Recusada pelos três critérios da seção 6 do ADR 0008: os decisores são diferentes (o servidor por frescor, a política por autoridade, o sanitizador por procedência), e juntar as três produziria um documento sem tese.
- **Repetir a tese "frescor não é autorização" nas três.** Recusada: é o modo mais comum de um livro ficar longo sem ficar mais completo, e a repetição enfraquece justamente a jornada que tem o argumento inteiro.
- **Deixar o ataque do snapshot reenviado para a J15.** Recusada: o ataque existe *por causa* do hash, e explicá-lo longe do mecanismo que ele contorna deixa a J10 com uma garantia sem limite declarado — que é como se ensina alguém a confiar demais num controle.

## Consequências

- A J10 fica sendo a única jornada da série que explica o que um controle **não** faz antes de explicar o que ele faz. É deliberado.
- A J14 e a J15 nascem com uma dependência de leitura: sem a J10, a frase "confirmação humana não é autorização" fica sem o contraste que a torna concreta.
- Uma candidata a spec sai para `GHDaru/protocolos`: a recusa por contexto obsoleto não é auditável — sem estado dedicado e sem evento, ela é indistinguível da recusa humana.
