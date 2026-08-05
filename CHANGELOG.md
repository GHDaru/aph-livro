# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) · Versionamento: [SemVer](https://semver.org/lang/pt-BR/). Toda entrega adiciona entrada em `[Unreleased]` (forcing function — Constituição, Princípio VII).

## [Unreleased]

### Added

- Fundação do repositório: constituição v1.0.0, CLAUDE.md, README, estrutura de diretórios, ADRs 0001–0003 (spec 001).
- Pesquisa profunda registrada em `estudos/`: fonte-base em código (ghdaru × nexxussai, com paths), panorama da indústria (AG-UI, MCP/MCP Apps, ACP, Vercel AI SDK, OpenAI, Anthropic, OWASP) e candidatos a bibliografia ⏳ (spec 002).
- Estrutura do livro: sumário oficial com 12 capítulos e fronteiras explícitas, guia normativo de capítulo (esqueleto v3 adaptado), HISTORICO com registro de expiração, glossário e bibliografia (spec 003).
- Estruturas dos capítulos 00–04 e 06–11 no esqueleto v3, cada um com sua spec (specs 004–008 e 010–015, ADR 0002); **capítulo 05 — Ações governadas — completo, como piloto do formato** (spec 009). Edição 0.01 no `livro/HISTORICO.md`.
- Bibliografia validada: 7 papers ✓ com dupla evidência e ⭐ nos âncoras (spec 016).
- Handoff para o time do ghdaru: spec de correção "Integridade da confirmação de propostas" (`handoffs/ghdaru-spec-integridade-confirmacao.md`) — idempotência, `context_hash` canônico server-side, estados `stale`/`expired` e alinhamento de nomenclatura, com critérios testáveis; decisão registrada: nexxussai não será alterado (raia leve — o documento é o artefato).
- **Fase 2 — texto completo dos 12 capítulos** (specs 004–015): prosa integral no esqueleto v3, em três ondas com commit por capítulo; caps. 00/05/07/08 com ciência ✓ no corpo. Edição 0.02 no `livro/HISTORICO.md`.

- **Revisão extraordinária MCP 2026-07-28** (spec 017): repesquisa com verificação primária em `estudos/atualizacao-mcp-2026-07-28.md`; caps. 02/05/06/09/11 com notas datadas e cap. 10 recapturado (matriz, seção MCP, contrato de frescor renovado). Edição 0.03 no `livro/HISTORICO.md`.

- **Padrão APH v0.1** (spec 018): proposta normativa do livro em `livro/padrao-aph.md` — níveis Observador/Operador/Federado, requisitos com maturidade declarada, compatibilidade com a indústria e checklist; revisada em contexto fresco (5 achados corrigidos). Edição 0.04 no `livro/HISTORICO.md`.

- **Glossário didático + regra anti-jargão** (spec 019): siglas e termos técnicos explicados em português simples em `livro/glossario.md` (3 camadas); ponteiro no Padrão APH; regra permanente no GUIA (entrada no glossário no mesmo commit). Edição 0.05 no `livro/HISTORICO.md`.

- **Publicação no GitHub Pages** (spec 020): motor estático próprio (`publicar/build.mjs` — 88 páginas, links verificados no build, tema claro/escuro, navegação) + workflow `publicar.yml` (push na `main` = publicar). Etapa manual única: habilitar Pages (Settings → Pages → Source: GitHub Actions).

- **Padrão APH v0.2 — Anexo A wire format** (spec 021): 5 JSON Schemas validáveis + exemplos/contraexemplos verificados por gate de CI (ajv, 32 casos), superfície HTTP de referência, códigos de erro e mapeamento APH↔laboratórios; revisado em contexto fresco (4 achados corrigidos). Edição 0.06 no `livro/HISTORICO.md`.

- **Publicação no Vercel** (spec 022): `vercel.json` com os gates no buildCommand (wire + links), CI próprio para os gates em todo push (`ci.yml`), e workflow do Pages rebaixado a alternativa manual. Motivo registrado: Pages inativo (token sem permissão de criar o site + repositório privado no plano gratuito); no Vercel, repo privado + site público funciona no plano Hobby.

- **Roteiro de conformidade APH Nível 2 para o ghdaru** (spec 023): auditoria dos 30+ requisitos dos Níveis 1–2 com evidência por path (conferida linha a linha por revisão independente contra o código real — 3 achados de evidência corrigidos, incl. o "filtro aiActions" que era declaração e não mecanismo), placar honesto (nenhum DEVE do Nível 2 ausente; bloqueio nos DEVEs do Nível 1) e roteiro em 4 etapas com dependências e esforço (`handoffs/ghdaru-roteiro-conformidade-aph-nivel2.md`).

- **Estudo de caso: Traycer × APH** (spec 024): primeiro caso de autor externo avaliado contra o padrão (`estudos/caso-traycer.md`) — afinidade por família com paths (41 eventos tipados, gate humano em dupla fila, capacidades declaradas, porta de 18 harnesses), divergências justificadas (WebSocket pela cláusula do APH-1.1; entrega confiável via CRDT) e 8 candidatos de aprendizado para o padrão (emendas APH-1.3/2.2, DEVERIAs de gate, evidência para E1, contraexemplo A2A).

- **Padrão APH v0.3 — incorporação do caso Traycer** (spec 025): os 8 candidatos do estudo incorporados pela porta prevista — emenda APH-1.3 (entrega confiável por snapshot + deltas com fonte durável/CRDT como mecanismo equivalente), nota APH-2.2 (versionamento negociado por método como segundo regime de evolução), APH-5.6/5.7 novos (🧪 DEVERIA: gates pendentes sobrevivem à reconexão; fila de aprovação por classe de ação), evidência externa em APH-6.4, notas datadas nos caps. 03/05/07/10/11 (incl. linha Traycer na matriz e o contraexemplo A2A da cautela não-herdada), evidência em E1 (🔵 mantido) e entradas CRDT/replace-latest/deadlock/fail-closed no glossário. O fio não muda: Anexo A permanece v0.2. Revisão independente em contexto fresco: 2 achados críticos e 1 importante corrigidos antes do registro. Edição 0.07 no `livro/HISTORICO.md`.

- **Suíte de conformidade executável — Nível 1** (spec 026): primeira feature de código do repositório (`conformidade/`) — 11 checks caixa-preta contra a superfície de referência do Anexo A com os schemas reais (transporte SSE, `seq`, replay íntegro e pós-reconexão, cancelamento cooperativo, envelope de erro, vocabulário, snapshot na borda), relatório que separa VERIFICADO de DECLARADO (7 itens não observáveis de fora, listados com o porquê), servidor de referência do Nível 1 (exemplo executável, sem LLM) e autoteste por 6 sabotagens como **Gate 3 do CI** (cada defeito plantado deve ser detectado pelo check certo). Padrão segue v0.3 (§0/§7/§8 atualizados); fio segue v0.2. Edição 0.08 no `livro/HISTORICO.md`.

### Fixed

- Correções da revisão independente da edição 0.01: citação "o que não está declarado, a IA não faz" reatribuída à fonte real (`docs/integration/` do ghdaru) em 5 capítulos; path da porta LLM corrigido no cap. 11; fonte do alvo de 32 KB corrigida no cap. 04; path completo do adapter MCP no cap. 09; contrato de frescor adicionado à Leitura executiva do cap. 05; banner de fase no cap. 08; origem de E1 corrigida no HISTORICO; GUIA ajustado para até uma pergunta de verificação por objetivo.
- Correções das revisões independentes da fase 2 (ondas 1–3, Princípio I): status ✓/⏳ consistente entre capítulos e bibliografia; "verificação de `idempotency_key`/`context_hash` na confirmação" corrigida para "desenhado, não verificado" (refutada pelo código, caps. 04/05/11); atribuição da taxonomia de classes de risco à pesquisa de origem; τ-bench atribuído também ao cap. 05; aspas só para citação verbatim; siglas expandidas; endpoint de cancelamento com path e parâmetro corretos.
