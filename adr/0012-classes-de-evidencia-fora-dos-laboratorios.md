# ADR 0012 — Classes de evidência fora dos laboratórios: onde entra a aplicação federada

**Data**: 2026-08-13 · **Status**: aceita · **Decisor**: parecer de especialista em governança de evidência, com a recomendação adotada integralmente · **Complementa**: Princípios I e II da constituição; [ADR 0008](0008-jornadas-do-protocolo.md), regras 4 e 5

## Contexto

A [J11](../livro/jornadas/README.md) é a primeira jornada da série cujas duas seções de laboratório vêm **vazias**: a norma diz, com todas as letras, que nenhum laboratório implementa proposta em lote. E é a primeira que precisa citar uma fonte que a constituição não prevê.

A constituição admite exatamente três classes de evidência: path num dos dois laboratórios nominais, citação científica validada, e fonte de indústria com endereço verificável. A **primeira aplicação federada** não cabe em nenhuma das três — e, no entanto, é ela que originou o requisito, com um argumento medido em uso real.

Pior: o livro está atrás da própria norma nesse ponto. A norma já cita a decisão dessa aplicação como procedência do requisito, na mesma frase em que afirma que nenhum laboratório o implementa. Um livro que a cite com peso diferente do que a norma lhe dá é exatamente a deriva que o Princípio VIII manda registrar.

A decisão não é sobre uma jornada. A J12 e a J13 também são 🧪 e também têm uma fonte externa como única evidência; o bloco federado inteiro depende dessa aplicação. Sem regra, cada jornada improvisa a sua.

## Decisão

### 1. Existe uma quarta classe, e ela se chama procedência de desenho

> **Procedência de desenho**: uma fonte verificável por path, com argumento medido em uso real, que **não** é laboratório e **não** promove maturidade.

Ela fica entre a fonte de indústria — verificável e externa, mas nem produção nem terceira parte — e nada. É onde a primeira aplicação federada entra.

### 2. A aplicação federada não é um terceiro laboratório, por três razões independentes

Qualquer uma bastaria; as três juntas fecham a questão.

- **A norma já a trata assim.** Ela cita a decisão da aplicação e, na mesma frase, afirma que nenhum laboratório implementa o requisito.
- **Mesmo autor.** Ela não responde à limitação que o caso de indústria externo existe para responder, que é a de dois laboratórios de um autor só.
- **Código descartável por decisão própria.** O repositório declara o protótipo fora do regime de produção, e não tem aplicação servida.

### 3. Como ela aparece: seção própria, rótulo explícito, nunca a mesma tabela

Fontes de classes diferentes **nunca dividem tabela**. O apêndice de uma jornada nessa situação tem esta ordem, por peso decrescente, e cada cabeçalho declara a classe:

1. os dois laboratórios, **inclusive quando vazios** — a ausência é o achado, e por isso a seção fica;
2. uma seção "fora dos laboratórios", aberta por uma frase dizendo que nada ali promove maturidade;
3. dentro dela, uma subseção por fonte, rotulada com o que ela é e o que ela **não** prova;
4. onde a norma está;
5. **o que não tem lastro nenhum**.

A quinta seção existe porque a regra 5 do ADR 0008 — "momento sem path é a denúncia automática de que ele é aspiracional" — não escala aqui. Ela funciona quando há um ou dois silêncios; numa jornada em que a maioria dos momentos não tem path, quinze silêncios não denunciam nada. Uma seção que diz o que não tem lastro converte quinze omissões numa afirmação.

### 4. A coluna que impede a fusão indevida

Na tabela de cada fonte fora dos laboratórios entra uma coluna dizendo **qual obrigação do requisito aquela linha toca**.

Sem ela, o leitor vê "duas fontes independentes" — que é a formulação da própria norma — e generaliza para o requisito inteiro. O estado real do APH-5.9, medido fonte a fonte, é outro: das quatro obrigações que ele acrescenta, uma tem duas fontes, duas têm **zero**, e a quarta a norma já declara desenho. A coluna é o que mantém essa diferença visível.

Pela mesma razão, "o que promoveria a ✅" numa jornada assim vem **em uma linha por obrigação**, e não na frase única que as jornadas anteriores usam.

### 5. Nada disso muda o grau

O protótipo da aplicação federada exercita **uma** das quatro obrigações — a contagem de alvos antes da decisão —, com interface executável, teste de navegador e captura do build real. O ganho é honesto e sub-promocional: essa obrigação sai de "desenhada" para "desenhada e vista funcionando", e isso vai para a **prosa**, não para o grau.

Não se cria glifo novo. O símbolo de fonte externa não observável já tem significado tomado, e reusá-lo aqui confundiria as classes.

### 6. Transcrição de fio que nunca existiu é reconstituição, e diz isso

O caso concreto que origina o requisito — oito recusas com causa única, uma confirmação — vem de uso real, e **nunca atravessou fio nenhum**. Nas jornadas anteriores havia código atrás de cada passo; aqui não há.

Toda transcrição nessa condição é rotulada como **reconstituição a partir do caso**, nunca como captura. E toda linha da tabela de trocas ganha marca de lastro: onde não há, a linha diz "não existe no fio" em vez de ser omitida — omitir é o que torna um fio incompleto indistinguível de um fio completo.

## Alternativas avaliadas

- **Promover a aplicação federada a terceiro laboratório.** Recusada pelas três razões da seção 2, e porque contradiria a norma, que este livro não sobrepõe.
- **Não citá-la.** Recusada: a norma a cita como procedência do requisito, e omiti-la no livro produz a deriva que o Princípio VIII existe para impedir — além de deixar a J11 sem explicar de onde veio a forma.
- **Citá-la na mesma tabela dos laboratórios, com uma nota de rodapé.** Recusada: nota de rodapé não sobrevive à leitura rápida, e a tabela é a parte que o leitor usa como inventário.
- **Criar um glifo de maturidade para procedência de desenho.** Recusada: maturidade é sobre verificação, não sobre origem, e um quarto glifo diluiria a régua que sustenta o Princípio I.

## Consequências

- A J11, a J12, a J13 e o bloco federado inteiro passam a ter uma forma comum para citar o que está fora dos laboratórios, em vez de improvisar cada uma a sua.
- A constituição fica **atrás desta decisão**: ela lista três classes de evidência e agora há quatro. Isso é dívida nomeada, e o remédio é uma emenda ao Princípio I, que não se faz aqui.
- Uma candidata a spec sai para `GHDaru/protocolos`: a ação de catálogo não tem campo para declarar atomicidade de lote, então a obrigação (a) do APH-5.9 não é expressável no schema que a norma publica.
- Jornadas com laboratórios vazios deixam de parecer incompletas: a seção vazia rotulada é uma afirmação, e passa a ser lida como uma.
