# ADR 0013 — Jornada sem fio, e a forma do bloco federado

**Data**: 2026-08-13 · **Status**: aceita · **Decisor**: parecer de especialista em especificação de protocolos, com a recomendação adotada integralmente · **Complementa**: [ADR 0008](0008-jornadas-do-protocolo.md), regras 1 e 4 e seção 6

## Contexto

O Bloco 4 do índice tem quatro jornadas sobre a junta federada, e a primeira delas — a admissão — não é uma conversa. O Anexo B é explícito: o contrato de admissão chega **por configuração, nunca por mensagem**. Escrever uma jornada de protocolo sobre algo que não troca mensagens levanta a pergunta de forma que este registro resolve, e ela vale para as quatro.

## Decisão

### 1. A jornada da admissão **não tem diagrama de sequência**

Não há mensagem `ghd.*` na admissão. A única perna que se poderia desenhar seria uma requisição HTTP **que não é normativa**: nenhuma rota de admissão — manifesto, emissão do grant, introspecção — está fixada pelo anexo. O que a suíte de conformidade usa é convenção do laboratório.

Desenhar isso violaria a regra 1 do ADR 0008 e criaria wire por acidente, que é exatamente o modo como um livro inventa protocolo.

O gênero da J16 é, então: **tabela normativa** (parâmetro → para quê → ausência) mais **tabela de verificações** (verificação → decisor → recusa), e no máximo um fluxograma da **decisão de quem admite** — que não desenha partes trocando mensagem.

Fica registrado o precedente: **jornada sem fio é jornada sem diagrama de sequência**, e isso não a desqualifica como jornada. O que ela mostra é uma sequência de decisões, e o gênero certo para decisão é tabela.

### 2. O canal tem quatro mensagens, e uma delas não tinha casa

O vocabulário do canal é um conjunto fechado de quatro: sinal de vida da aplicação, handshake do hospedeiro, aviso de recurso alterado, e palpite de resultado de ação.

O aviso de recurso alterado não estava atribuído a nenhuma das quatro jornadas. Ele passa para a **J18**, que é o seu par natural: os dois são as únicas mensagens que atravessam depois do embarque, e a cláusula que obriga o escopo do recarregamento a vir do contexto admitido — nunca do payload — só faz sentido ao lado da regra de confiança assimétrica.

Os três tipos que o hospedeiro tem reservados no roadmap são **inválidos para emitir** enquanto o anexo não os admitir. Eles aparecem em prosa e na tabela de lacunas, **nunca como seta**.

### 3. As três recusas são **um documento, três momentos**

Pela letra da seção 6 do ADR 0008, elas se separam nos três critérios: o fio é diferente (nenhum, canal do navegador, HTTP), o decisor é diferente (quem monta, quem recebe, o endpoint) e o terminal é diferente (indisponível, descarte silencioso, resposta inativa).

Pelo **propósito** da régua, que é decidir se um caminho de erro sai de dentro do caminho feliz, os três já estão fora dele — e a tese é uma só: **a recusa não entrega oráculo**. Separá-los em três documentos produziria três textos de um parágrafo com a mesma conclusão, que é a alternativa "uma jornada por requisito" já recusada no ADR 0008.

Fica um documento com três momentos, cada um com a sua tabela. O momento da recusa de montagem **não tem diagrama**, pelo motivo da seção 1: ali não há mensagem nenhuma, e não há a quem responder.

### 4. O que o bloco não pode desenhar

Três coisas, e todas seriam seta sem lastro:

- **A autoridade efetiva atenuada.** O hospedeiro calcula o escopo do grant sem intersectar com as capacidades do usuário, por decisão explícita e documentada. Desenhar as capacidades do handshake como já atenuadas afirmaria o contrário do que existe.
- **A requisição de introspecção.** Só a **resposta** tem forma normativa; a rota, o método e como o chamador se autentica não estão no anexo. A perna de ida entra em prosa, com a lacuna nomeada.
- **Qualquer mensagem de "a aplicação manda executar".** Ela não existe de propósito, e é o assunto da J18.

### 5. A linha de maturidade do bloco carrega uma frase obrigatória

O próprio anexo registra que, hoje, **a junta não fecharia**: os dois primeiros implementadores escreveram envelopes incompatíveis, o lado da aplicação endereça as mensagens a qualquer origem e não verifica a origem de quem fala. Isso não é hipótese de risco — é o estado medido.

Nenhuma jornada do bloco pode ser lida como descrição de algo que funciona ponta a ponta, e a linha de maturidade de cada uma diz isso antes do primeiro diagrama.

## Alternativas avaliadas

- **Dar diagrama de sequência à admissão, desenhando as rotas HTTP.** Recusada: as rotas não são normativas, e publicá-las num diagrama as promoveria a contrato sem passar pelo versionamento do anexo.
- **Três documentos para as três recusas.** Recusada pela seção 3.
- **Deixar o aviso de recurso alterado sem jornada.** Recusada: seria a única mensagem do vocabulário sem cobertura, e a prova de cobertura do índice deixaria de fechar.
- **Desenhar a autoridade efetiva como a norma a descreve.** Recusada: é o desenho, e não o que existe. Entra como lacuna e como "o que promoveria".

## Consequências

- A série passa a ter uma jornada **sem diagrama de sequência**, e o índice precisa dizer isso onde alguém iria procurar por um.
- A J18 recebe uma mensagem a mais do que o índice previa, e a prova de cobertura do vocabulário fecha.
- O bloco inteiro nasce com aviso de estado, e nenhuma de suas jornadas afirma funcionamento ponta a ponta.
- Uma constatação some da categoria "lacuna" e vira **fato registrado**: quase tudo o que o bloco pede do lado da aplicação é autodeclarado, porque o canal exige navegador e não há verificação executável desse lado.
