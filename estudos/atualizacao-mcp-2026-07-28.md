# Atualização do MCP — spec 2026-07-28 (FINAL)

> **Evento datado: 2026-07-28 · pesquisa: 2026-07-31 · spec 017**
>
> Repesquisa da publicação da versão **2026-07-28** da spec do Model Context Protocol como
> **estável** (release "2026-07-28" no GitHub, 28 de julho; RC pré-release listado em 29 de maio).
> Ponto de partida: radar do livro-mãe (`harness_engineering/radar/diario/2026-07-31.md`);
> **todas as afirmações abaixo foram re-verificadas em fonte primária por esta rodada**
> (o `modelcontextprotocol.io` respondeu sem 403 no fetch direto em 2026-07-31 — changelog,
> página de elicitation e extensions overview lidos na íntegra).
>
> Fontes primárias verificadas nesta rodada:
> - Anúncio oficial: <https://blog.modelcontextprotocol.io/posts/2026-07-28/>
> - Changelog oficial (vs. **2025-11-25** — nota adiante): <https://modelcontextprotocol.io/specification/2026-07-28/changelog>
> - Releases GitHub (2026-07-28 estável, autor `localden`): <https://github.com/modelcontextprotocol/modelcontextprotocol/releases>
> - Elicitation na spec nova: <https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation>
> - Framework de extensões: <https://modelcontextprotocol.io/docs/extensions/overview>

**Nota de baseline** — o changelog oficial compara com a revisão **2025-11-25**, uma versão
intermediária que este livro nunca registrou (o livro cita 2025-06-18 como vigente). O que a
2025-11-25 introduziu e é relevante aqui: **URL mode elicitation** (e o `elicitationId` +
`notifications/elicitation/complete`, já removidos em 2026-07-28). Lacuna de captura nossa,
não do radar.

---

## 1. O que mudou

### 1.1 Núcleo stateless — fim do handshake e da sessão de protocolo

- Removidos o handshake `initialize`/`notifications/initialized` **e** o header `Mcp-Session-Id`
  do Streamable HTTP (SEP-2567, SEP-2575). Cada requisição carrega versão de protocolo e
  capacidades do cliente em `_meta` (`io.modelcontextprotocol/protocolVersion`,
  `io.modelcontextprotocol/clientCapabilities`); cliente se identifica por request
  (`io.modelcontextprotocol/clientInfo`) e servidor em cada resultado
  (`io.modelcontextprotocol/serverInfo`). Mismatch → `UnsupportedProtocolVersionError`.
- `server/discover`: RPC que servidores **MUST** implementar para anunciar versões,
  capacidades e identidade; cliente **MAY** chamar antes de tudo (ou usar como probe de
  retrocompatibilidade em stdio).
- Estado entre chamadas, quando necessário, vira **handles explícitos cunhados pelo servidor,
  passados como argumentos comuns de tool** (SEP-2567) — não sessão de protocolo.
- Motivação declarada no anúncio: "MCP is transforming from a bidirectional stateful protocol
  into a request/response stateless protocol" — escalar com load balancer sem sticky sessions.
- **Consequência que o radar não destacou e importa para nós (cap. 02):** a spec **removeu a
  resumabilidade de stream SSE e a reentrega de mensagens** (`Last-Event-ID` e SSE event IDs)
  do Streamable HTTP — "A broken response stream loses the in-flight request; clients **MUST**
  re-issue it as a new request with a new request ID" (SEP-2575). O MCP resolveu a queda de
  conexão por **re-emissão idempotente**, não por replay.
- Também: `resources/subscribe`/`unsubscribe` e o endpoint HTTP GET substituídos por
  `subscriptions/listen` (um único stream POST-response de notificações opt-in) — **mudança do
  core**, não da extensão Tasks; `ping`, `logging/setLevel` e `notifications/roots/list_changed`
  removidos; log level por request via `_meta` (`io.modelcontextprotocol/logLevel`).

Fonte: [changelog 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/changelog) · [anúncio](https://blog.modelcontextprotocol.io/posts/2026-07-28/)

### 1.2 MRTR (Multi Round-Trip Requests) — a nova mecânica do "pergunte ao humano"

- Padrão MRTR (SEP-2322) **substitui as requisições iniciadas pelo servidor**
  (`roots/list`, `sampling/createMessage`, `elicitation/create` como request reverso).
  O servidor devolve um **`InputRequiredResult`** (`resultType: "input_required"`) cujo campo
  **`inputRequests`** carrega os pedidos de informação; o cliente **retenta a requisição
  original** com **`inputResponses`** preenchido.
- **Todo resultado agora carrega `resultType` obrigatório**: `"complete"` para resultados
  comuns, `"input_required"` para interinos de MRTR. Resultados de servidores de protocolo
  anterior sem o campo **MUST** ser tratados como `"complete"` (retrocompatibilidade).
- Correlação entre tentativas: o servidor codifica seu identificador em **`requestState`**
  (por isso `elicitationId` e `notifications/elicitation/complete`, da 2025-11-25, foram
  removidos — "the client learns the outcome of an out-of-band interaction by retrying the
  original request").
- **Elicitation NÃO foi depreciada** — segue como feature de cliente, com a mecânica nova:
  o request `elicitation/create` agora viaja *dentro* de `InputRequiredResult.inputRequests`
  de um `tools/call`/`prompts/get`/`resources/read`, e a resposta volta em `inputResponses`
  no retry. Modos: **form** (JSON Schema restrito a objetos flat de tipos primitivos —
  string/number/boolean/enum, com `format` `email|uri|date|date-time`) e **URL**
  (out-of-band, obrigatório para dados sensíveis; introduzido em 2025-11-25). O modelo de
  três ações do usuário permanece: `accept` / `decline` / `cancel`.

Fonte: [changelog §Major 7–8](https://modelcontextprotocol.io/specification/2026-07-28/changelog) · [elicitation 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation)

### 1.3 Headers de roteamento

- Headers padrão **`Mcp-Method`** e **`Mcp-Name`** obrigatórios nos POSTs do Streamable HTTP
  (SEP-2243) — gateways e rate limiters roteiam **sem parsear o corpo JSON**; suporte a
  headers custom vindos de parâmetros de tool via `x-mcp-header`. Novo erro
  `HeaderMismatchError` no schema (código `-32020` após a repartição da faixa de erros).

Fonte: [changelog §Minor 4 e §Minor 12](https://modelcontextprotocol.io/specification/2026-07-28/changelog)

### 1.4 Cache declarado no contrato

- `ttlMs` (hint de frescor em ms) e `cacheScope` (`"public" | "private"`) **obrigatórios**
  nos resultados de `tools/list`, `prompts/list`, `resources/list`, `resources/read` **e**
  `resources/templates/list`, via interface `CacheableResult` (SEP-2549) — complementam
  `listChanged`. Servidores **SHOULD** devolver tools em ordem determinística (melhora
  prompt cache hit do LLM).

Fonte: [changelog §Minor 3 e 5](https://modelcontextprotocol.io/specification/2026-07-28/changelog)

### 1.5 Framework formal de extensões

- Campo **`extensions`** em `ClientCapabilities`/`ServerCapabilities`; identificadores
  `{vendor-prefix}/{extension-name}`; extensões oficiais em repositórios `ext-*` da org
  GitHub do MCP, criadas via SEP (Extensions Track, SEP-2133), sempre **opt-in**.
- **Tasks** sai do core e vira extensão oficial **`io.modelcontextprotocol/tasks`**
  (SEP-2663): polling via `tasks/get` (substitui o bloqueante `tasks/result`) + novo
  `tasks/update` para input cliente→servidor; `tasks/list` removido.
  *(Correção ao radar do livro-mãe: `subscriptions/listen` é mudança do **core** — SEP-2575 —
  e não parte da extensão Tasks.)*
- **MCP Apps** é extensão oficial (repo `modelcontextprotocol/ext-apps`) — "Allows MCP
  Servers to display interactive UI elements (charts, forms, video players) inline within
  conversations"; nos exemplos de negociação da doc aparece o identificador
  `io.modelcontextprotocol/ui` com settings `{"mimeTypes": ["text/html;profile=mcp-app"]}`.
- **Enterprise-Managed Authorization** e **OAuth Client Credentials** são extensões oficiais
  de autorização (repo `modelcontextprotocol/ext-auth`).

Fonte: [extensions overview](https://modelcontextprotocol.io/docs/extensions/overview) · [changelog §Major 6, §Minor 1](https://modelcontextprotocol.io/specification/2026-07-28/changelog)

### 1.6 Autorização endurecida

- **RFC 9207**: authorization servers **SHOULD** incluir `iss` na resposta de autorização e
  clientes **MUST** validá-lo contra o issuer registrado antes de trocar o code (SEP-2468).
- `application_type` apropriado obrigatório no registro dinâmico (evita conflito de
  redirect URI no OpenID Connect; SEP-837).
- Credenciais de cliente **vinculadas ao issuer**: persistir chaveado por issuer, nunca
  reusar com outro authorization server, re-registrar quando o AS muda (SEP-2352).
- **DCR (RFC 7591) depreciado** como mecanismo de registro em favor de **Client ID Metadata
  Documents (CIMD)** (PR #2858); DCR permanece por retrocompatibilidade.

Fonte: [changelog §Minor 7–9 e §Deprecated 4](https://modelcontextprotocol.io/specification/2026-07-28/changelog)

### 1.7 Depreciações e a primeira política formal de ciclo de vida

- **Depreciados** (permanecem funcionais na janela; novas implementações não devem adotar):
  1. **Roots, Sampling e Logging** (SEP-2577). Migrações sugeridas pelo próprio changelog:
     diretórios/arquivos via parâmetros de tool, resource URIs ou configuração (Roots);
     **"integrate directly with LLM provider APIs instead of Sampling"**; `stderr` ou
     OpenTelemetry em vez de Logging.
  2. Transporte **HTTP+SSE legado** (deprecado desde 2025-03-26, agora formalmente
     "Deprecated" sob a política; SEP-2596) → migrar para Streamable HTTP.
  3. Valores `includeContext` `"thisServer"`/`"allServers"` (removidos no mais tardar junto
     com Sampling).
  4. **DCR** → CIMD (item 1.6).
- **Política formal**: estados Active / Deprecated / Removed, **janela mínima de 12 meses**
  de depreciação e registry público de features depreciadas (SEP-2596) — a primeira política
  de ciclo de vida do protocolo.

Fonte: [changelog §Deprecated e §Governance](https://modelcontextprotocol.io/specification/2026-07-28/changelog) · [anúncio](https://blog.modelcontextprotocol.io/posts/2026-07-28/)

### 1.8 Miudezas relevantes para este livro

- `inputSchema`/`outputSchema` de tools **liberados para qualquer keyword de JSON Schema
  2020-12** (SEP-2106) — o dialeto exato do `manifest.schema.json` do laboratório A.
- Convenções de propagação de trace OpenTelemetry em `_meta` (`traceparent`, `tracestate`,
  `baggage`) — primeiro aceno do MCP a *traço* como preocupação de protocolo (ainda é
  trace de telemetria, não o Traço de Execução auditável do nosso cap. 05).
- Política de alocação de códigos de erro: `-32020..-32099` reservado para a spec MCP.

### 1.9 Não confirmado nesta rodada (⏳)

- ⏳ Data exata de publicação do RC: a página de releases do GitHub lista o pré-release
  "2026-07-28 RC" em **29 de maio**, enquanto o cap. 10 do livro (e o radar) tratavam o RC
  como "de 2026-07-28" — 2026-07-28 é o **nome da versão**, não a data do RC. A datação
  precisa do RC não foi verificada além da listagem de releases.
- ⏳ Status formal das **versões antigas** do protocolo (ex.: 2025-06-18): a janela de 12
  meses é política de **features**, não de versões. A convivência de versões se dá por
  negociação (`server/discover` como probe; `resultType` ausente tratado como `"complete"`).
  Não localizei declaração oficial de "fim de suporte" para revisões anteriores da spec.
- ⏳ SDKs Tier 1 atualizados (TypeScript, Python, Go, C#; Rust em beta) — afirmado no
  anúncio oficial; não conferi os repositórios de SDK individualmente.

---

## 2. O que NÃO mudou

- **Tools, resources e prompts seguem as primitivas do servidor** — o changelog só as toca
  em cache (`ttlMs`/`cacheScope`), ordem determinística e afrouxamento de schema; nenhuma
  mudança de natureza. ([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog))
- **Elicitation sobrevive como feature** — capacidade `elicitation` declarada (agora em
  `_meta.io.modelcontextprotocol/clientCapabilities`), modos form (JSON Schema) e URL,
  três ações `accept|decline|cancel`, exigência de dizer *o quê* e *por quê* ao usuário e
  de o cliente permitir revisar/recusar. **O que mudou é a entrega** (item 1.2): de request
  reverso servidor→cliente para resultado interino + retry.
  ([elicitation 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation))
- **Features depreciadas permanecem funcionais** durante a janela mínima de 12 meses —
  "These features remain fully functional during the deprecation window"; servidores/clientes
  2025-06-18 seguem operáveis via negociação de versão (com a ressalva ⏳ do item 1.9).
- **MCP Apps: mecânica iframe + postMessage sem indício de mudança** — nada no changelog do
  core nem na doc de extensões indica abandono de `ui://`, iframe sandboxado ou JSON-RPC via
  `postMessage`; extensões "evolve independently of the core protocol". A mudança é de
  **status e negociação** (extensão oficial, opt-in via campo `extensions`), não de mecânica.
  ([extensions overview](https://modelcontextprotocol.io/docs/extensions/overview))
- **Streamable HTTP continua sendo POST com response que pode carregar stream** — as
  notificações de escopo de requisição (`notifications/progress`, `notifications/message`)
  continuam fluindo "on the response stream of the request they relate to". A leitura
  "SSE sobre POST venceu na fronteira em rede" (caps. 02 e 10) segue de pé; o que caiu foi o
  transporte **HTTP+SSE legado** (endpoint SSE separado) e a resumabilidade do stream.
- **A aprovação humana no cliente continua normativa** — a spec de elicitation mantém os
  MUSTs de consentimento, revisão e recusa; o gate humano não foi enfraquecido, foi
  re-encanado.

---

## 3. Impacto no livro Protocolo App↔Harness

Escala: **A** = invalida trecho (revisão extraordinária) · **B** = nota/atualização pontual ·
**C** = nada a fazer.

| Cap. | Impacto | O que exatamente é atingido | O que ajustar |
|---|---|---|---|
| **02 — Transporte e sessão** | **B** | Nenhum trecho invalidado (o capítulo não cita MCP em suas fontes; contrato de frescor não disparado — SSE segue o transporte da fronteira app↔agente). Mas a guinada stateless **conversa diretamente** com a tese do capítulo: o MCP chegou à mesma premissa ("nada de valioso pode morar só na conexão") e escolheu a **resolução oposta** — em vez de sessão durável com `seq`/replay (ghdaru), **removeu** `Last-Event-ID`/redelivery e mandou o cliente re-emitir a requisição inteira (SEP-2575). | Nota de contraste na seção "Sessão e reconexão": dois modelos de robustez sem sticky session — **replay** (a conversa é o produto; eventos têm valor próprio e não podem se perder — nosso caso) × **re-issue stateless** (RPC re-computável; o resultado é recomputado — o caso do MCP host↔servidor). Reforça a tese, não a ameaça. |
| **05 — Ações governadas** | **B** | A ficha "MCP — Elicitation (spec 2025-06-18)" e a tabela de convergência descrevem a mecânica antiga ("servidor pausa a operação e pede input estruturado"). A afirmação segue verdadeira **como datada** (o livro data suas capturas), mas está desatualizada como estado da arte. | Atualizar ficha e linha da tabela: a primitiva "a ação para e pergunta ao humano com schema" **sobreviveu à maior reescrita do protocolo** — mudou de request reverso para `resultType: "input_required"` + retry com `inputResponses`. **O argumento do capítulo fica mais forte**: o gate virou *estado do resultado da própria ação* — exatamente a "proposta com estado" dos laboratórios ("a Proposta de Ação é a mesma ideia com estado persistente" ganha confirmação literal: o `requestState` do MRTR é o estado da proposta). Contrato de frescor não disparado (MRTR não padroniza risco/idempotência/`context_hash`). |
| **06 — Comandos de UI e slot filling** | **B** | "A elicitation do MCP é o gabarito de `user.input.required`" continua — **e melhorou**: o fluxo MRTR (tool call devolve `input_required`; app coleta; chamada é retentada com os dados) é estruturalmente idêntico ao desenho do livro de que "a coleta por schema é uma tool call à qual faltam argumentos" (cap. 11, passo 2). A descrição da mecânica ("o servidor envia um request…") e a tabela de vocabulário citam a spec 2025-06-18. | Atualizar a mecânica do gabarito (interim result + retry; `requestedSchema` flat de primitivos; ações `accept/decline/cancel`); registrar o **URL mode** (2025-11-25) como novidade relevante: dado sensível **não passa pelo cliente/LLM** — toca também a sanitização do cap. 04 e a segurança do cap. 07. |
| **09 — Federação e composição** | **B** | O capítulo cita MCP Apps (SEP-1865, spec 2026-01-26) e a projeção catálogo→tools MCP. Contrato de frescor **não** disparado: a mecânica iframe+postMessage **não mudou** (item 2). O que mudou: MCP Apps agora é **extensão formal negociada** via `extensions` em capabilities (`io.modelcontextprotocol/ui`), e o alvo da projeção ficou **mais barato** — servidor stateless, sem handshake `initialize`, `tools/list` cacheável com `ttlMs`, `inputSchema` liberado para JSON Schema 2020-12 (o dialeto do `manifest.schema.json`). | Nota na seção de projeção MCP (servidor mais simples de implementar; declarar `ttlMs`/`cacheScope` ao projetar o catálogo) e na tabela de simetria (status de extensão formal + negociação opt-in). |
| **10 — Estado da arte externo** | **A** | **Contrato de frescor explicitamente disparado** ("o RC de 2026-07-28 virando final… invalida esta leitura e dispara revisão extraordinária"). Trechos invalidados: (i) linha da matriz "MCP + elicitation/sampling" — sampling está **depreciado** e o transporte "HTTP/SSE" citado é o legado formalmente Deprecated; (ii) prosa do H3 "MCP e seus derivados" — "o dual é o sampling…" e "a spec segue viva: o RC saiu em 2026-07-28" descrevem um estado superado; (iii) "custo de frescor" em "O problema" cita o RC como futuro. Lacuna adicional de captura: o livro nunca registrou a revisão **2025-11-25** (URL mode elicitation). | Recaptura da linha MCP na matriz (JSON-RPC stateless sobre Streamable HTTP/stdio; elicitation via MRTR; sampling/roots/logging depreciados com janela de 12 meses; extensões formais; política de depreciação como **sinal de governança** — a coluna que o Princípio VI manda pesar); atualizar datas e o contrato de frescor com novo gatilho. |
| **11 — Convergências** | **B** | N3 ("proposta com gate humano como estado de primeira classe") **sai reforçado**: o padrão sobreviveu a uma reescrita completa da mecânica — e a forma nova (estado interino do resultado + retry) é *mais* parecida com a FSM dos laboratórios do que a antiga. N4 idem: a migração oficial de sampling é "integre direto com o provider" — a porta do modelo fica no app/harness, como o livro afirma. Roadmap: passo 2 (slot filling) ganha gabarito atualizado; passo 3 (MCP como projeção) fica mais barato. Apostas E1/E2 não pontuadas por este evento (nenhum protocolo dominante único emergiu; nada mudou nos laboratórios). | Nota na tabela do núcleo (N3/N4: confirmação atualizada para a mecânica MRTR, com a observação "o padrão sobreviveu à reescrita — evidência de que é primitiva, não acidente de spec") e nos passos 2–3 do roadmap. |
| *(bônus)* 03/04/07/08 | **C→B leve** | Sem trecho atingido. Candidatos a nota de rodapé: `ttlMs`/`cacheScope` (contrato de frescor de listas — conversa com staleness do cap. 04); política formal de depreciação (conversa com a "regra de evolução" do vocabulário, cap. 03); URL mode para segredo fora do canal (cap. 07); `inputSchema` 2020-12 pleno e a depreciação de sampling (cap. 08). | Avaliar na spec 017 se cabem notas; nada obrigatório. |

**Síntese da nuance central** (a que o cap. 10 do livro-mãe classificou como "A" para o
capítulo dele): a elicitation-como-padrão-de-confirmação-humana que citamos **não morre** —
muda de mecânica (server-initiated → MRTR). Para o *nosso* livro o efeito é o inverso do
alarme: os capítulos 05/06/11 usavam a elicitation como evidência de que "o gate humano é
primitiva de protocolo"; a primitiva acaba de sobreviver à maior revisão da história do MCP,
re-implementada sobre um núcleo completamente novo. Padrão que sobrevive à reescrita da
própria spec que o carrega é a definição operacional de convergência que o livro usa.

---

## 4. Tradução para decisão (para quem desenha protocolo app↔harness)

1. **Modele o gate humano como estado retornável, não como canal reverso.** A indústria
   abandonou o request servidor→cliente e adotou "resultado interino (`input_required`) +
   retry com as respostas + `requestState` de correlação" — que é, ponto a ponto, a Proposta
   de Ação com FSM dos laboratórios. Quem já modela "a ação para e espera" como **estado
   persistente com identidade** está do lado para onde a spec dominante acabou de se mover;
   quem construiu sobre callbacks reversos vai reescrever.
2. **Decida explicitamente onde mora a durabilidade — e saiba qual fronteira é a sua.** O MCP
   ficou stateless e *removeu* replay porque na fronteira host↔servidor o resultado é
   recomputável: stream caiu, re-emita a requisição. Na fronteira app↔harness a conversa é o
   produto — eventos têm valor próprio e não podem se perder: sessão durável com
   `seq`/replay (cap. 02) continua a resposta certa. Copiar o stateless do MCP aqui seria
   copiar a solução de outro problema; a premissa comum ("nada de valioso mora na conexão")
   é o que se importa.
3. **Dê ao seu contrato uma política de ciclo de vida antes de precisar dela.** A primeira
   política formal de depreciação do MCP (Active/Deprecated/Removed, 12 meses mínimos,
   registry público) é o sinal de protocolo entrando em fase de infraestrutura. Um vocabulário
   de eventos app↔harness versionado (cap. 03) deveria nascer com o equivalente — depreciar
   `kind`s com janela e registro, não por silêncio.
4. **Não construa nada sobre sampling; a porta do modelo é sua.** A migração oficial é
   "integrate directly with LLM provider APIs" — confirmação externa do N4 do livro: o modelo
   é acessado pela aplicação/harness (cap. 08), nunca uma capacidade que o servidor terceiro
   pede emprestada ao cliente.
5. **Declare frescor e roteabilidade no contrato, não na implementação.** `ttlMs`/`cacheScope`
   obrigatórios em listas e `Mcp-Method`/`Mcp-Name` para rotear sem parsear corpo são duas
   decisões exportáveis: um catálogo projetado como tools MCP (cap. 09) deve declarar TTL; e
   metadados de roteamento fora do payload merecem avaliação no nosso transporte (hoje o
   `kind` só existe dentro do frame SSE).
