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

### Fixed

- Correções da revisão independente da edição 0.01: citação "o que não está declarado, a IA não faz" reatribuída à fonte real (`docs/integration/` do ghdaru) em 5 capítulos; path da porta LLM corrigido no cap. 11; fonte do alvo de 32 KB corrigida no cap. 04; path completo do adapter MCP no cap. 09; contrato de frescor adicionado à Leitura executiva do cap. 05; banner de fase no cap. 08; origem de E1 corrigida no HISTORICO; GUIA ajustado para até uma pergunta de verificação por objetivo.
- Correções das revisões independentes da fase 2 (ondas 1–3, Princípio I): status ✓/⏳ consistente entre capítulos e bibliografia; "verificação de `idempotency_key`/`context_hash` na confirmação" corrigida para "desenhado, não verificado" (refutada pelo código, caps. 04/05/11); atribuição da taxonomia de classes de risco à pesquisa de origem; τ-bench atribuído também ao cap. 05; aspas só para citação verbatim; siglas expandidas; endpoint de cancelamento com path e parâmetro corretos.
