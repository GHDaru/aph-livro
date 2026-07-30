# Candidatos à bibliografia científica — Protocolo de Comunicação Aplicação ↔ Harness

**Estado da arte capturado em 2026-07.** Data da pesquisa: **2026-07-30**.

**Escopo:** papers candidatos (arXiv/venues) nos eixos do livro: tool use / function
calling em LLMs, prompt injection, human-in-the-loop / confirmação de ações de
agentes, agentes em UI (GUI agents) e avaliação de agentes. Todos os itens estão com
status **⏳ (a validar)** — a validação dupla (existência + leitura crítica do
conteúdo) será feita em rodada posterior, conforme o processo do livro. IDs de arXiv
conferidos contra a página de abstract em 2026-07-30; listas de autores marcadas ⏳
quando não confirmadas na fonte primária.

---

## Eixo: prompt injection e segurança da fronteira app↔LLM

### 1. Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection — ⏳

- **Autores:** Kai Greshake, Sahar Abdelnabi, Shailesh Mishra, Christoph Endres, Thorsten Holz, Mario Fritz
- **arXiv:** [2302.12173](https://arxiv.org/abs/2302.12173) — 2023 (submetido 2023-02-23; versão final 2023-05-05); publicado no AISec/CCS workshop ⏳ (venue a confirmar)
- O que mostra:
  - Introduz o vetor de **indirect prompt injection**: o atacante injeta instruções
    em dados que a aplicação recupera (páginas, e-mails, documentos), explorando o
    LLM remotamente, sem interface direta com o modelo.
  - Argumenta que aplicações LLM-integradas **apagam a fronteira entre dados e
    instruções**, e deriva uma taxonomia de impactos (roubo de dados, worming,
    contaminação do ecossistema de informação).
- **Por que interessa ao livro:** é o paper fundacional do argumento central do
  capítulo de segurança: todo conteúdo que a aplicação envia ao agente (contexto de
  tela incluso) é canal de ataque; logo, autorização e execução de ações precisam
  viver fora do LLM.

### 2. AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents — ⏳

- **Autores:** Edoardo Debenedetti, Jie Zhang, Mislav Balunović, Luca Beurer-Kellner, Marc Fischer, Florian Tramèr
- **arXiv:** [2406.13352](https://arxiv.org/abs/2406.13352) — 2024; NeurIPS 2024 Datasets & Benchmarks ⏳ (venue a confirmar)
- O que mostra:
  - Framework de avaliação para agentes que executam tools sobre **dados não
    confiáveis**: 97 tarefas realistas (cliente de e-mail, e-banking, viagens) e 629
    casos de teste de segurança.
  - É um ambiente extensível (não uma suíte estática), para compor novas tarefas,
    ataques adaptativos e defesas; mede o trade-off utilidade × robustez.
- **Por que interessa ao livro:** fornece a métrica e o cenário exatos do problema
  que o protocolo quer mitigar por desenho (catálogo de ações + confirmação): agente
  com tools + conteúdo injetado. Útil para fundamentar "por que confirmação humana"
  com números.

---

## Eixo: tool use / function calling

### 3. Toolformer: Language Models Can Teach Themselves to Use Tools — ⏳

- **Autores:** Timo Schick, Jane Dwivedi-Yu, Roberto Dessì, Roberta Raileanu, Maria Lomeli, Luke Zettlemoyer, Nicola Cancedda, Thomas Scialom
- **arXiv:** [2302.04761](https://arxiv.org/abs/2302.04761) — 2023 (submetido 2023-02-09); NeurIPS 2023 ⏳ (venue a confirmar)
- O que mostra:
  - LLMs aprendem, de forma auto-supervisionada com poucas demonstrações, **quando**
    chamar uma API, **qual** chamar, **com que argumentos** e como incorporar o
    resultado à geração.
  - Demonstra com calculadora, Q&A, buscadores, tradução e calendário; melhora
    zero-shot substancialmente.
- **Por que interessa ao livro:** ancestral científico do function calling que todo o
  protocolo app↔IA pressupõe; dá base para explicar por que o "catálogo de ações" é a
  interface natural entre modelo e aplicação (o modelo decide *quando/qual/como*, a
  aplicação executa).

---

## Eixo: human-in-the-loop / risco de ações de agentes

### 4. Identifying the Risks of LM Agents with an LM-Emulated Sandbox (ToolEmu) — ⏳

- **Autores:** Yangjun Ruan, Honghua Dong e outros ⏳ (lista completa a confirmar na página do arXiv)
- **arXiv:** [2309.15817](https://arxiv.org/abs/2309.15817) — 2023; apresentado no ICLR 2024
- O que mostra:
  - **ToolEmu**: um LM emula a execução de tools para testar agentes contra 36 tools
    de alto risco e 144 casos, sem instanciar os sistemas reais; inclui avaliador
    automático de segurança.
  - 68,8% das falhas identificadas seriam falhas reais segundo avaliação humana; até
    o agente mais seguro falha 23,9% das vezes segundo o avaliador.
- **Por que interessa ao livro:** quantifica o risco residual de agentes executando
  ações mesmo em cenários "bem comportados" — o argumento empírico para propostas de
  ação com confirmação humana e para políticas de autorização por severidade.

### 5. τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains — ⏳

- **Autores:** Shunyu Yao, Noah Shinn, Pedram Razavi, Karthik Narasimhan
- **arXiv:** [2406.12045](https://arxiv.org/abs/2406.12045) — 2024
- O que mostra:
  - Benchmark de conversas dinâmicas entre **usuário simulado**, agente com tools de
    domínio e **regras de política** a seguir; avaliação compara o estado final do
    banco de dados com o estado-objetivo anotado.
  - Agentes de function calling de ponta resolvem <50% das tarefas; a métrica
    `pass^k` mostra inconsistência severa (pass^8 <25% no varejo).
  - Sequência relevante: [τ²-bench (arXiv:2506.07982)](https://arxiv.org/pdf/2506.07982)
    avalia o cenário *dual-control*, em que usuário e agente **ambos** podem agir — ⏳.
- **Por que interessa ao livro:** é o benchmark mais próximo do objeto do livro
  (tool + agente + usuário + política de domínio); fundamenta o desenho de protocolos
  que assumem inconsistência do agente e distribuem controle entre app e humano.

---

## Eixo: agentes em UI (GUI agents)

### 6. GUI Agents: A Survey — ⏳

- **Autores:** ⏳ (a confirmar na página do arXiv)
- **arXiv:** [2412.13501](https://arxiv.org/abs/2412.13501) — 2024
- O que mostra:
  - Survey de agentes que operam interfaces gráficas emulando ações humanas (clicar,
    digitar, navegar) em múltiplas plataformas.
  - Propõe framework unificado de capacidades — percepção, raciocínio, planejamento
    e ação — e categoriza benchmarks, métricas e arquiteturas.
- **Por que interessa ao livro:** mapeia sistematicamente o paradigma "pixels +
  cliques" que o livro contrasta com ações declarativas tipadas; fonte para o
  capítulo que trata computer use como anti-padrão na fronteira app↔IA.

### 7. Large Language Model-Brained GUI Agents: A Survey — ⏳ (alternativa/complemento ao item 6)

- **Autores:** ⏳ (a confirmar na página do arXiv)
- **arXiv:** [2411.18279](https://arxiv.org/abs/2411.18279) — 2024/2025 (em revisão no OpenReview: [xChvYjvXTp](https://openreview.net/forum?id=xChvYjvXTp))
- O que mostra:
  - Survey extenso e complementar focado em agentes de GUI "com cérebro LLM":
    componentes (percepção de tela, grounding de elementos, execução de ação), dados
    de treino e frameworks.
- **Por que interessa ao livro:** cobre o detalhe técnico do *grounding* de elementos
  de tela — exatamente o problema que um protocolo de contexto de tela estruturado
  (enviado pela aplicação) elimina por construção. Escolher entre este e o item 6
  após leitura; provavelmente basta um no corpo e o outro em nota.

---

## Observações de curadoria

- Cobertura por eixo: prompt injection (2), tool use (1), HITL/risco (2), GUI agents
  (2, com possível fusão em 1), avaliação de agentes coberta transversalmente por
  AgentDojo, ToolEmu e τ-bench. Total efetivo: 6–7 entradas, dentro da faixa pedida
  (4–8).
- Lacuna consciente: não há aqui paper específico sobre **generative UI** ou
  **protocolos de eventos** — a literatura científica nessas frentes ainda é
  incipiente em 2026-07 e a evidência forte é da indústria (ver
  `estudos/panorama-industria.md`). Se necessário, buscar em rodada futura trabalhos
  de HCI (CHI/UIST) sobre mixed-initiative interfaces — ⏳.
- Próximo passo (fora do escopo desta ficha): validação dupla de cada entrada —
  conferir autores/venue na página do arXiv e ler abstract + seções-chave antes de
  promover ao `livro/bibliografia` com status ✓.
