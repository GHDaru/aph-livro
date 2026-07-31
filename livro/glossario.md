# Glossário

Este glossário tem três camadas: os **sete objetos do protocolo** (§1, o vocabulário próprio do livro), as **siglas** (§2) e os **termos técnicos** (§3) — estes dois últimos explicados em português simples, sem pressupor que o leitor venha da engenharia de software. Regra editorial (GUIA-CAPITULO): toda sigla é expandida na 1ª ocorrência de cada capítulo, e todo termo novo ganha entrada aqui no mesmo commit que o introduz.

## 1. Os sete objetos do protocolo

| Termo do livro | Definição | ghdaru | nexxussai-monorepo | Indústria |
|---|---|---|---|---|
| **Snapshot de contexto** | Descrição estruturada e sanitizada do estado da aplicação enviada à IA a cada mensagem; a IA nunca infere a UI. | Snapshot de Contexto (3 níveis: domínio/interface/conversa) | `ScreenContextSnapshot` (com `context_hash`) | state/context (AG-UI); resources (MCP) |
| **Catálogo de ações** | Inventário declarado do que a IA pode fazer; única superfície executável. | Catálogo de Ações (`ActionSpec`, com `input_schema`) | `ScreenRegistry` + `ActionKind` | tools (MCP / function calling) |
| **Evento tipado** | Unidade do fluxo IA→app: `kind` de um vocabulário fechado e versionado + payload. | `EventKind` com envelope `{seq, kind, payload}` | vocabulário SSE canônico (`text_delta`, `artifact_*`, …) | data stream parts (Vercel AI SDK); events (AG-UI); session/update (ACP) |
| **Proposta de ação** | Intenção de ação da IA que aguarda decisão (humana ou de política) antes de executar; tem máquina de estados própria. | Proposta de Ação (FSM com `awaiting_approval`) | `ActionProposal` (FSM + `idempotency_key`) | elicitation (MCP); permission request (ACP); human-in-the-loop |
| **Comando de UI** | Instrução declarativa da IA para a interface (`navigate`, `form.patch`…); nunca clique simulado ou DOM. | Comando de UI (`ui.navigate`, `session.logout`) | ações `navigate/fill_fields/focus_field` | frontend tools / generative UI |
| **Classe de risco** | Gravidade declarada de uma ação, que determina o gate (executa direto / confirma / bloqueia). | Classe de Risco (taxonomia ampliada; `read|confirm` implementadas) | `RiskLevel` + `requires_confirmation` | — (não padronizado) |
| **Traço de execução** | Registro auditável e visível de toda ação executada; sem traço, a ação é não-governada. | Traço de Execução (`action_result` obrigatório) | `ExecutionTrace` / tool-results | — (não padronizado) |

Objetos de apoio: **sanitização de contexto** (remoção, no servidor, de segredos e campos sensíveis do snapshot antes de chegar ao modelo), **porta do modelo** (a interface única que esconde qual provedor de IA está por trás), **manifesto de aplicação** (o documento com que uma aplicação de terceiro se apresenta à plataforma) e **harness** (ver §3).

## 2. Siglas — por extenso e em palavras simples

| Sigla | Por extenso | Em palavras simples |
|---|---|---|
| **IA / AI** | Inteligência Artificial / Artificial Intelligence | aqui, quase sempre o *modelo de linguagem* que conversa no chat. |
| **LLM** | Large Language Model | o "cérebro" do chat: um modelo estatístico gigante que gera texto (e decisões em formato de texto). GPT, Claude e Gemini são LLMs. |
| **UI** | User Interface | a interface: as telas, botões e formulários que o usuário vê e toca. |
| **APH** | Aplicação ↔ Harness | o nome do padrão proposto neste livro (documento `padrao-aph.md`). |
| **API** | Application Programming Interface | a "porta de serviço" de um sistema: o conjunto de endereços que outros programas usam para pedir dados ou executar operações. |
| **HTTP** | Hypertext Transfer Protocol | o idioma básico da web: como navegador e servidor conversam. **POST/GET/DELETE** são os "verbos" desse idioma: enviar algo novo, buscar algo, apagar algo. |
| **SSE** | Server-Sent Events | técnica em que o servidor mantém a conexão aberta e vai *empurrando* mensagens de texto uma a uma — é o que faz a resposta do chat aparecer aos poucos, palavra por palavra, em vez de chegar tudo no final. |
| **JSON** | JavaScript Object Notation | o formato de texto mais comum para dados estruturados: `{"nome": "Ana", "idade": 30}`. Legível por humanos e por máquinas. |
| **JSON Schema** | — | um "molde" escrito em JSON que descreve como um JSON válido deve ser (quais campos existem, de que tipo, quais são obrigatórios). É como o catálogo declara os argumentos de cada ação. |
| **JSON-RPC** | JSON Remote Procedure Call | um jeito padronizado de um programa chamar funções de outro trocando mensagens JSON ("execute o método X com estes argumentos"). É a base do MCP e do ACP. |
| **FSM** | Finite State Machine (máquina de estados finitos) | um mapa fechado de situações e passagens permitidas: uma proposta de ação só pode ir de "proposta" para "aguardando aprovação", nunca pular direto para "executada". Tudo fora do mapa é erro. |
| **DOM** | Document Object Model | a estrutura interna da página web (a "árvore" de elementos que o navegador monta). "Não mexer no DOM" = a IA não enxerga nem clica na página por dentro; ela pede, e a aplicação faz. |
| **MCP** | Model Context Protocol | protocolo aberto (criado pela Anthropic, hoje padrão de mercado) para conectar modelos de IA a ferramentas e dados externos. Versão vigente: 2026-07-28. |
| **MRTR** | Multi Round-Trip Requests | mecânica introduzida no MCP 2026-07-28: quando uma operação precisa de mais informação (ex.: falta um dado do usuário), ela **não** fica pendurada — responde "preciso de input" (`input_required`) e o cliente refaz a chamada trazendo as respostas. |
| **AG-UI** | Agent–User Interaction Protocol | protocolo aberto (comunidade CopilotKit) que padroniza os *eventos* trocados entre um agente de IA e a interface do usuário. |
| **ACP** | Agent Client Protocol | protocolo da Zed que padroniza a conversa entre um *editor de código* e um agente de IA. Aparece no livro como espelho da nossa fronteira em outro domínio. |
| **A2A** | Agent2Agent | protocolo (Google → Linux Foundation) para *agentes conversarem entre si*, entre organizações. Fronteira vizinha, não a deste livro. |
| **RAG** | Retrieval-Augmented Generation | técnica em que, antes de responder, o sistema busca trechos relevantes numa base de conhecimento e os entrega ao modelo — é o que permite respostas "com fonte" (as citações). |
| **SDK** | Software Development Kit | caixa de ferramentas pronta que um fornecedor dá aos desenvolvedores para usar seu produto (ex.: Vercel AI SDK, OpenAI Apps SDK). |
| **RSC** | React Server Components | tecnologia do React para gerar pedaços de interface no servidor. Citada no livro pelo seu *recuo*: gerar UI serializada pelo modelo foi tentado e pausado pela indústria. |
| **OWASP** | Open Worldwide Application Security Project | organização de referência em segurança de software; seu "Top 10 para LLMs" lista os maiores riscos de aplicações com IA (LLM01 = prompt injection; LLM06 = agência excessiva). |
| **URL / URI** | Uniform Resource Locator / Identifier | o "endereço" de algo na web (URL) ou, mais geral, um identificador padronizado de recurso (URI — ex.: o esquema `ui://` do MCP Apps). |
| **JWT / CSRF** | JSON Web Token / Cross-Site Request Forgery | dois nomes que aparecem nas listas de sanitização: um formato de credencial (JWT) e um tipo de ataque (CSRF). O ponto do livro: nada disso pode vazar para o modelo. |
| **TTL** | Time To Live | prazo de validade de uma informação em cache ou de uma proposta pendente ("expira em 10 minutos"). |
| **UUID** | Universally Unique Identifier | um código aleatório praticamente impossível de repetir, usado como identificador (ex.: a chave de idempotência). |
| **SHA-256** | Secure Hash Algorithm, 256 bits | algoritmo padrão para gerar um *hash* (ver §3) — a "impressão digital" de um dado. |
| **RFC / SEP / BCP** | Request for Comments / Spec Enhancement Proposal / Best Current Practice | formatos de documento com que a internet (RFC/BCP) e o MCP (SEP) publicam seus padrões e propostas. "BCP 14" é a norma que define o significado de DEVE/PODE em specs. |
| **FR / SC / CA** | Functional Requirement / Success Criterion / Critério de Aceite | jargão das nossas specs: o que o sistema deve fazer, como se mede o sucesso, o que fecha a entrega. |

## 3. Termos técnicos em português claro

- **Harness** — o "arnês": todo o andaime de software que envolve o modelo de IA e o torna útil e seguro — o loop de conversa, as ferramentas, o contexto, as permissões. O modelo é o motor; o harness é o carro. (Tema do livro-mãe *Engenharia de Harness*.)
- **Streaming / stream** — transmissão contínua, aos pedaços, em vez de tudo de uma vez. O "stream" é o fluxo; um **chunk** é cada pedaço que chega.
- **Endpoint** — um endereço específico da API (ex.: `POST /chat/sessions`): a "porta" onde se bate para pedir uma operação.
- **Payload** — o conteúdo útil de uma mensagem (os dados dentro do envelope).
- **Frontend / backend / host** — respectivamente: a parte que roda no navegador do usuário; a parte que roda no servidor; e "host" é quem *hospeda e manda* — no nosso caso, a aplicação, que é sempre quem executa (a IA nunca executa nada diretamente).
- **Parser** — o trecho de código que lê um formato bruto (ex.: o texto do SSE) e o transforma em estrutura utilizável.
- **Replay** — repetir a entrega: depois de uma queda de conexão, o cliente pede "tudo depois do evento nº N" e recebe o que perdeu, sem duplicar.
- **Stateless / stateful** — sem memória entre chamadas / com memória. Um servidor stateless trata cada pedido como novo (fácil de escalar); um stateful mantém a sessão viva (necessário quando a *conversa* é o produto).
- **Idempotência** — propriedade de uma operação que pode ser repetida sem efeito adicional: confirmar duas vezes (por retry de rede ou clique duplo) executa **uma** vez. A `idempotency_key` é o código único que permite reconhecer a repetição.
- **Hash** — a "impressão digital" de um dado: um resumo curto e fixo que muda completamente se o dado mudar. O `context_hash` é a impressão digital da tela — se a tela mudou entre a proposta e a confirmação, o hash denuncia.
- **Denylist** — lista do proibido (ex.: campos com `senha`, `token`, `jwt` nunca viajam ao modelo). O oposto de allowlist (lista do permitido).
- **Sanitização** — a limpeza do snapshot no servidor: remover segredos e campos sensíveis **antes** de qualquer coisa chegar ao modelo.
- **Prompt / prompt injection** — o prompt é o texto de instrução dado ao modelo; prompt injection é o ataque em que conteúdo malicioso (numa página, num documento, num campo de tela) se disfarça de instrução. Defesa central do livro: tudo que vem da tela é *dado*, nunca ordem.
- **Token (dois sentidos!)** — (1) em segurança: a credencial que prova quem você é (ex.: token de login — nunca pode vazar ao modelo); (2) em LLMs: o pedacinho de texto que o modelo lê/gera e pelo qual se paga (o "custo em tokens" do snapshot). O contexto da frase diz qual é.
- **Introspecção de token** — perguntar ao servidor de identidade "este token é válido e de quem é?", em vez de confiar no que ele diz de si mesmo.
- **Tool / tool calling / function calling** — "ferramenta": uma função que o modelo pode pedir para executar, descrita por nome + argumentos (JSON Schema). Tool calling (ou function calling) é o mecanismo nativo dos modelos para isso — a ponte natural para o nosso catálogo de ações.
- **Elicitation** — primitiva do MCP: no meio de uma operação, pedir um dado ao *humano* com um formulário estruturado. É o "slot filling" da indústria.
- **Sampling** — primitiva do MCP em que o servidor pedia ao cliente que consultasse o LLM por ele. **Depreciada** na spec 2026-07-28.
- **Slot filling** — "preencher as lacunas": quando falta um dado para agir (ex.: a data da reunião), a IA pede exatamente aquele campo, com formulário estruturado, em vez de adivinhar ou perguntar em prosa solta.
- **Generative UI** — interface gerada pelo modelo. O livro registra o recuo da indústria: em produção, o modelo manda *dados*; quem desenha componentes é a aplicação.
- **Computer use** — paradigma em que a IA opera o computador "como humano": olhando pixels e clicando. Anti-padrão para aplicações próprias — lento, frágil e cego para o contrato que a aplicação já tem.
- **Iframe (sandboxado)** — uma "janela dentro da janela": página de terceiro embutida na sua, com **sandbox** = de mãos amarradas (sem acesso ao resto da página). **postMessage** é o interfone controlado por onde as duas conversam.
- **WebSocket** — canal bidirecional permanente entre navegador e servidor. Alternativa ao SSE quando os *dois* lados precisam falar o tempo todo — o que, no chat, normalmente não é o caso.
- **stdio** — standard input/output: comunicação entre programas na mesma máquina por entrada/saída de texto (transporte usado pelo ACP e por servidores MCP locais).
- **Cache** — guardar uma resposta para não recalculá-la; `ttlMs` diz por quantos milissegundos ela vale.
- **Load balancer / sticky session** — o distribuidor de tráfego entre servidores / e a exigência de que um mesmo usuário caia sempre no mesmo servidor (o que o MCP stateless eliminou por design).
- **Multi-tenant / tenant** — um mesmo sistema servindo várias organizações isoladas; cada organização é um tenant, e o catálogo de ações é montado por tenant.
- **Capability** — permissão nomeada e granular (`kb:read`, `chat:use`) derivada do papel do usuário — verificada pela aplicação, nunca decidida pelo modelo.
- **Spec / spec-driven** — especificação: o documento que diz *o quê* e *por quê* antes do código; spec-driven é o método (Maestro) em que nada nasce sem ela.
