# Candidatos à bibliografia científica — Protocolo de Comunicação Aplicação ↔ Harness

**Estado da arte capturado em 2026-07.** Data da pesquisa: **2026-07-30**.

**Escopo:** papers candidatos (arXiv/venues) nos eixos do livro: tool use / function
calling em LLMs, prompt injection, human-in-the-loop / confirmação de ações de
agentes, agentes em UI (GUI agents) e avaliação de agentes. **Validação dupla
concluída em 2026-07-30** (spec 016): para cada item, ID↔título↔autores conferidos na
página de abstract do arXiv (fonte primária) + ≥1 menção independente com URL.
Todos os 7 itens numerados foram promovidos a **✓** em `livro/bibliografia.md`;
divergências corrigidas estão anotadas em cada ficha.

---

## Eixo: prompt injection e segurança da fronteira app↔LLM

### 1. Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection — ✓ (validado 2026-07-30)

- **Autores:** Kai Greshake, Sahar Abdelnabi, Shailesh Mishra, Christoph Endres, Thorsten Holz, Mario Fritz — confirmados na fonte primária.
- **arXiv:** [2302.12173](https://arxiv.org/abs/2302.12173) — 2023 (submetido 2023-02-23; versão final 2023-05-05); venue **confirmado**: AISec@CCS 2023 (DOI [10.1145/3605764.3623985](https://doi.org/10.1145/3605764.3623985)), via [Semantic Scholar](https://api.semanticscholar.org/graph/v1/paper/arXiv:2302.12173?fields=title,authors,year,venue,externalIds).
- **Validação (2026-07-30):** fonte primária [arXiv:2302.12173](https://arxiv.org/abs/2302.12173) (título/autores/datas batem); menção independente: registro Semantic Scholar acima (título, autores, venue AISec@CCS, DBLP `conf/ccs/AbdelnabiGMEHF23`).
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

### 2. AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents — ✓ (validado 2026-07-30)

- **Autores:** Edoardo Debenedetti, Jie Zhang, Mislav Balunović, Luca Beurer-Kellner, Marc Fischer, Florian Tramèr — confirmados na fonte primária.
- **arXiv:** [2406.13352](https://arxiv.org/abs/2406.13352) — 2024 (v1 2024-06-19; v3 2024-11-24); venue **confirmado**: NeurIPS 2024 Datasets & Benchmarks Track (BibTeX do repositório oficial).
- **Validação (2026-07-30):** fonte primária [arXiv:2406.13352](https://arxiv.org/abs/2406.13352) (título/autores/datas batem); menção independente: [repositório oficial ethz-spylab/agentdojo](https://github.com/ethz-spylab/agentdojo) (link para o arXiv + BibTeX NeurIPS 2024 D&B).
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

### 3. Toolformer: Language Models Can Teach Themselves to Use Tools — ✓ (validado 2026-07-30)

- **Autores (arXiv v1):** Timo Schick, Jane Dwivedi-Yu, Roberto Dessì, Roberta Raileanu, Maria Lomeli, Luke Zettlemoyer, Nicola Cancedda, Thomas Scialom — confirmados na fonte primária.
  **Divergência anotada:** a versão de conferência ([NeurIPS 2023, oral](https://neurips.cc/virtual/2023/oral/73843)) lista adicionalmente **Eric Hambro** (9 autores); a v1 do arXiv, aqui citada, tem 8.
- **arXiv:** [2302.04761](https://arxiv.org/abs/2302.04761) — 2023 (submetido 2023-02-09); venue **confirmado**: NeurIPS 2023 (apresentação oral).
- **Validação (2026-07-30):** fonte primária [arXiv:2302.04761](https://arxiv.org/abs/2302.04761) (título/autores/data batem); menção independente: [página do venue NeurIPS 2023](https://neurips.cc/virtual/2023/oral/73843).
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

### 4. Identifying the Risks of LM Agents with an LM-Emulated Sandbox (ToolEmu) — ✓ (validado 2026-07-30)

- **Autores:** Yangjun Ruan, Honghua Dong, Andrew Wang, Silviu Pitis, Yongchao Zhou, Jimmy Ba, Yann Dubois, Chris J. Maddison, Tatsunori Hashimoto — **lista completa confirmada na página do arXiv** (a ficha anterior registrava só os dois primeiros).
- **arXiv:** [2309.15817](https://arxiv.org/abs/2309.15817) — 2023 (v1 2023-09-25; v2 2024-05-17); venue **confirmado**: ICLR 2024 (Spotlight), via repositório oficial.
- **Validação (2026-07-30):** fonte primária [arXiv:2309.15817](https://arxiv.org/abs/2309.15817) (título/autores/datas batem); menção independente: [repositório oficial ryoungj/ToolEmu](https://github.com/ryoungj/ToolEmu) (mesmos autores, ICLR 2024 Spotlight, link para o arXiv).
- O que mostra:
  - **ToolEmu**: um LM emula a execução de tools para testar agentes contra 36 tools
    de alto risco e 144 casos, sem instanciar os sistemas reais; inclui avaliador
    automático de segurança.
  - 68,8% das falhas identificadas seriam falhas reais segundo avaliação humana; até
    o agente mais seguro falha 23,9% das vezes segundo o avaliador.
- **Por que interessa ao livro:** quantifica o risco residual de agentes executando
  ações mesmo em cenários "bem comportados" — o argumento empírico para propostas de
  ação com confirmação humana e para políticas de autorização por severidade.

### 5. τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains — ✓ (validado 2026-07-30)

- **Autores:** Shunyu Yao, Noah Shinn, Pedram Razavi, Karthik Narasimhan — confirmados na fonte primária.
- **arXiv:** [2406.12045](https://arxiv.org/abs/2406.12045) — 2024 (submetido 2024-06-17).
- **Validação (2026-07-30):** fonte primária [arXiv:2406.12045](https://arxiv.org/abs/2406.12045) (título/autores/data batem); menção independente: [repositório oficial sierra-research/tau-bench](https://github.com/sierra-research/tau-bench) (BibTeX com título/autores/ID idênticos). O repo sinaliza que as tarefas originais estão desatualizadas e aponta o sucessor `tau2-bench`.
- O que mostra:
  - Benchmark de conversas dinâmicas entre **usuário simulado**, agente com tools de
    domínio e **regras de política** a seguir; avaliação compara o estado final do
    banco de dados com o estado-objetivo anotado.
  - Agentes de function calling de ponta resolvem <50% das tarefas; a métrica
    `pass^k` mostra inconsistência severa (pass^8 <25% no varejo).
  - Sequência relevante: [τ²-bench (arXiv:2506.07982)](https://arxiv.org/pdf/2506.07982)
    avalia o cenário *dual-control*, em que usuário e agente **ambos** podem agir — ⏳
    (não validado nesta rodada; não é candidato numerado).
- **Por que interessa ao livro:** é o benchmark mais próximo do objeto do livro
  (tool + agente + usuário + política de domínio); fundamenta o desenho de protocolos
  que assumem inconsistência do agente e distribuem controle entre app e humano.

---

## Eixo: agentes em UI (GUI agents)

### 6. GUI Agents: A Survey — ✓ (validado 2026-07-30)

- **Autores:** Dang Nguyen, Jian Chen, Yu Wang, Gang Wu, Namyong Park, Zhengmian Hu, Hanjia Lyu, Junda Wu, Ryan Aponte, Yu Xia, Xintong Li, Jing Shi, Hongjie Chen, Viet Dac Lai, Zhouhang Xie, Sungchul Kim, Ruiyi Zhang, Tong Yu, Mehrab Tanjim, Nesreen K. Ahmed, Puneet Mathur, Seunghyun Yoon, Lina Yao, Branislav Kveton, Jihyung Kil, Thien Huu Nguyen, Trung Bui, Tianyi Zhou, Ryan A. Rossi, Franck Dernoncourt (30 autores) — **confirmados na página do arXiv** (a ficha anterior estava sem autores).
- **arXiv:** [2412.13501](https://arxiv.org/abs/2412.13501) — 2024 (v1 2024-12-18; v3 2025-09-26); venue **confirmado**: Findings of ACL 2025.
- **Validação (2026-07-30):** fonte primária [arXiv:2412.13501](https://arxiv.org/abs/2412.13501) (título/autores/datas batem; comments: "Accepted to Findings of ACL 2025"); menção independente: [ACL Anthology 2025.findings-acl.1158](https://aclanthology.org/2025.findings-acl.1158/) (Findings of ACL 2025, pp. 22522–22538, Viena).
- O que mostra:
  - Survey de agentes que operam interfaces gráficas emulando ações humanas (clicar,
    digitar, navegar) em múltiplas plataformas.
  - Propõe framework unificado de capacidades — percepção, raciocínio, planejamento
    e ação — e categoriza benchmarks, métricas e arquiteturas.
- **Por que interessa ao livro:** mapeia sistematicamente o paradigma "pixels +
  cliques" que o livro contrasta com ações declarativas tipadas; fonte para o
  capítulo que trata computer use como anti-padrão na fronteira app↔IA.

### 7. Large Language Model-Brained GUI Agents: A Survey — ✓ (validado 2026-07-30) (alternativa/complemento ao item 6)

- **Autores:** Chaoyun Zhang, Shilin He, Jiaxu Qian, Bowen Li, Liqun Li, Si Qin, Yu Kang, Minghua Ma, Guyue Liu, Qingwei Lin, Saravan Rajmohan, Dongmei Zhang, Qi Zhang (13 autores) — **confirmados na página do arXiv** (a ficha anterior estava sem autores).
- **arXiv:** [2411.18279](https://arxiv.org/abs/2411.18279) — 2024/2025 (v1 2024-11-27; v12 2025-05-06; em revisão no OpenReview: [xChvYjvXTp](https://openreview.net/forum?id=xChvYjvXTp) — página não verificável por bloqueio anti-bot em 2026-07-30).
- **Validação (2026-07-30):** fonte primária [arXiv:2411.18279](https://arxiv.org/abs/2411.18279) (título/autores/datas batem); menção independente: [repositório oficial vyokky/LLM-Brained-GUI-Agents-Survey](https://github.com/vyokky/LLM-Brained-GUI-Agents-Survey) (BibTeX com título/autores/ID idênticos; coleção viva em aka.ms/gui-agent).
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
- **Validação dupla concluída em 2026-07-30 (spec 016):** os 7 itens numerados foram
  promovidos a ✓ em `livro/bibliografia.md`, cada um com fonte primária (arXiv) +
  menção independente (venue, Semantic Scholar ou repositório oficial). A leitura
  crítica de conteúdo (abstract + seções-chave) continua sendo dever da spec do
  capítulo que primeiro citar cada paper. τ²-bench (2506.07982) permanece ⏳.
