# ADR 0008 — Jornadas do protocolo: diagrama de sequência, tabela normativa e o que não se desenha

**Data**: 2026-08-13 · **Status**: aceita · **Decisores**: consolidação de três pareceres de especialistas (completude de protocolo, forma e didática, renderização), com a recomendação adotada integralmente onde houve consenso e com a divergência resolvida abaixo

## Contexto

O livro descreve o Padrão APH (Aplicação ↔ Harness) em doze capítulos, e nenhum deles mostra **a conversa acontecendo**. Quem lê o capítulo 05 entende o que é uma proposta de ação; quem vai implementar precisa saber quem fala com quem, em que ordem, e o que atravessa o fio.

A metodologia Maestro resolve isso para produto com as *journeys*: um documento por jornada do usuário, com fluxograma, capturas do build real e avaliação heurística. A pergunta desta decisão é como trazer esse gênero para um livro de protocolo, onde a jornada não é do usuário, e sim **da aplicação**.

Três especialistas foram consultados em paralelo, cada um com uma pergunta fechada: o inventário, a forma, e a renderização.

## Decisão

### 1. Dezenove jornadas, em quatro blocos, nesta ordem

`J01` a `J06` fecham o fio do chat (Nível 1); `J07` a `J13`, a ação governada (Nível 2); `J14` e `J15`, as recusas; `J16` a `J19`, a junta federada (Nível 3, tudo experimental). O índice em [`livro/jornadas/README.md`](../livro/jornadas/README.md) mantém a lista, o estado de cada uma e a prova de cobertura.

A ordem não é estética. J01 é a única escrita do zero, e todas as outras a citam; transporte precede semântica, porque "o gate sobreviveu à queda" só é legível depois que o leitor sabe o que é replay; catálogo precede ação, porque toda ação é uma leitura do catálogo em movimento; e recusa vem depois do caminho feliz, porque recusa sem caminho feliz é ruído.

### 2. Diagrama de sequência **e** tabela de trocas, sempre os dois

Cada momento traz um bloco ```` ```mermaid ```` com `sequenceDiagram` e uma **tabela de trocas** (`# · De → Para · Troca · Carga`). A tabela é declarada como a **fonte normativa** da sequência; o diagrama é a mesma informação em forma visual.

Isso não é redundância, e o parecer de renderização mostrou por quê com medição:

- O motor do livro não tem mermaid, e o diagrama sai como bloco de código no site publicado. No GitHub, que é metade da audiência de um repositório assim, ele **desenha**.
- Medido na árvore de acessibilidade real de um navegador: o conteúdo de um diagrama de sequência chega ao leitor de tela como **sopa geométrica**. Direção da seta, quem chama quem, o que é resposta: nada disso é texto, é posição. A mesma sequência em tabela expõe cabeçalhos e células navegáveis.
- A tabela é o que faz a degradação virar não-evento: sem ela, quem lê no terminal ou sem JavaScript fica com código-fonte de diagrama como única fonte.

Todo bloco carrega `accTitle:` e `accDescr:`, e vem precedido de uma frase de legenda em prosa.

### 3. Nenhuma dependência nova no motor, por ora

Fica a opção sem render (fence puro), com zero mudança em `publicar/build.mjs`. O parecer mediu as alternativas: pré-renderizar exigiria **420 MB de dependências mais 651 MB de Chromium** num motor que hoje inteiro tem 6,3 MB; renderizar no cliente exigiria vendorar 3,5 MB de JavaScript de terceiro em git, ou depender de uma rede externa em runtime, sem política de segurança de conteúdo na casca.

O caminho de upgrade está medido e pronto (diff de 23 linhas, sem dependência npm, script só na página que tem diagrama), e será puxado quando alguém reclamar de ver código no site. Não antes: nenhum capítulo do livro tem diagrama hoje, então a demanda ainda não existe.

**Ressalva registrada, e é uma dívida real**: o motor **não copia assets**, então imagem commitada vira 404 silencioso no site, sem gate. Enquanto for assim, jornada nenhuma usa imagem.

### 4. O esqueleto: jornada não é capítulo

Nove seções, na ordem: *Em uma frase* · *O que você vai conseguir explicar* · *Quem fala com quem* · *O fio* · *Quando o fio quebra* · *Como reconhecer no seu sistema* · *Lacunas e derivas* (datadas) · *Verificação* · *Apêndice de evidência*.

A jornada herda do esqueleto v3 o cabeçalho datado, os verbos de Bloom, a verificação e o apêndice com paths. Não repete ciência nem indústria: isso vive no capítulo, e a jornada aponta para lá. Duas traduções do formato Maestro: a **captura de tela vira transcrição do fio** (mesmo papel de ancorar o texto em algo verificável) e a **avaliação heurística vira tabela de lacunas**, com o eixo trocado de severidade de usabilidade para maturidade e cobertura.

Some o que é vocabulário de produto e não do livro: contexto DDD, objeto semântico, severidade de usabilidade, "pontos fortes confirmados".

### 5. A regra que protege o Princípio I: nenhuma seta sem lastro

O risco central desta série foi nomeado assim pelo parecer de forma:

> num diagrama de sequência, todas as setas têm a mesma espessura. A seta que só existe na norma parece tão implementada quanto a que tem teste verde no laboratório.

Como o diagrama é a parte que o leitor mais lembra, a jornada tem poder de convencimento desproporcional à sua evidência. É o modo mais provável de este livro violar o Princípio I sem ninguém perceber: não por afirmação falsa em prosa, mas por seta desenhada. Daí cinco regras, todas verificáveis em revisão:

1. **Nenhuma jornada desenha mensagem que não exista nos schemas.** Diagrama publicado vira wire de fato, e é assim que um livro cria protocolo por acidente, fora do versionamento do §A.9. Onde o fio falta, a jornada **abre uma lacuna nomeada** ("a norma não especifica; o mais próximo é X"), que vira candidata a spec no repositório da norma.
2. **A seta marca o grau**: traço cheio para o comprovado, tracejado para o desenhado, e o requisito parcial desenha as duas metades separadas, porque é isso que parcial significa.
3. **Linha de maturidade no cabeçalho**, antes do primeiro diagrama.
4. **Jornada majoritariamente experimental abre com aviso** e fecha dizendo **o que a promoveria**: qual metade falta, em qual laboratório, qual check da suíte a provaria. Isso a transforma em pedido de evidência em vez de ficção.
5. **Apêndice momento a momento, com path.** Momento sem path é a denúncia automática de que ele é aspiracional.

### 6. Caminho de erro só vira documento próprio com três critérios

Fio distinto, decisor distinto e estado terminal distinto. Faltando um, é ramo dentro da jornada do caminho feliz. Por essa régua, contexto desatualizado e recusa de embarque viram documento; lote parcialmente executado **não** vira, porque o campo `outcomes` existe justamente para esse caso e separá-lo romperia o par "contagem antes da decisão → desfecho por alvo".

## Alternativas avaliadas

- **Pré-renderizar os diagramas para imagem no build.** Recusada por medição: cerca de 1 GB por build contra 6,3 MB hoje, para desenhar setas.
- **Imagem gerada fora e commitada.** Recusada duas vezes: hoje quebra em silêncio (o motor não copia assets) e binário em git mata a revisão em pull request, porque a imagem não é diffável.
- **Renderizar no cliente por rede externa.** Recusada: o livro passaria a depender de terceiro em runtime, sem política de segurança de conteúdo na casca.
- **Só o diagrama, sem tabela.** Recusada pelo achado de acessibilidade: seria conteúdo normativo inacessível a leitor de tela e ilegível no terminal.
- **Só a tabela, sem diagrama.** Recusada porque perde o pedido original e a leitura rápida; e o GitHub desenha de graça.
- **Uma jornada por requisito.** Recusada: produziria dezenas de documentos de um parágrafo e nenhuma narrativa.

## Consequências

- O livro ganha uma pasta `livro/jornadas/` com índice próprio. **O motor não a inclui na navegação lateral** (o menu só varre `livro/capitulos/`), então o índice precisa ser alcançável a partir do sumário, e o build falha se o link quebrar.
- Nove requisitos e cláusulas ficam **sem jornada, por decisão**: registro de telas, catálogo derivado de permissões, proibição de interface serializada, metade da porta do modelo, escopo de auditoria, projeção MCP, mapeamento de nomes, modo embarcado e as cláusulas de meta-conformidade. O motivo é o mesmo em todos: não há fio para desenhar, e forçar um seria inventar protocolo.
- **A série vai encontrar buracos na norma, e é para encontrar.** O inventário já apontou oito, e o mais gritante é o slot filling: o vocabulário fechado tem oito tipos de evento e **nenhum** para pedido estruturado de dados; a resposta do usuário ao formulário não tem forma no fio. Cada buraco desses vira lacuna nomeada aqui e candidata a spec lá.
- Pelo Princípio VIII, mudança na norma obriga a verificar este livro. As jornadas ampliam essa superfície: passam a existir dezenove documentos que descrevem o fio, e o fio versiona.
