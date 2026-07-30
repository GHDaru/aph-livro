# Spec 008 — Capítulo 04: A voz da aplicação — contexto de tela

**Status**: Implementada (estrutura) · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Entregar a **fase 1 (Estrutura)** do capítulo 04 (`livro/capitulos/04-contexto-de-tela.md`), conforme `livro/GUIA-CAPITULO.md` §"Estrutura antes do conteúdo": cabeçalho datado, objetivos de aprendizagem, "O problema" redigido, esqueleto de H3 do estado da arte com 1–2 frases por seção, fontes candidatas listadas, perguntas de verificação e Apêndice com a evidência por path já mapeada.

Tese do capítulo (do sumário, spec 003): **a aplicação se descreve ao agente — a IA nunca infere a interface** (decisão formal nas duas bases: nunca DOM scraping) — por três mecanismos complementares:

1. o **snapshot** enviado a cada mensagem (ghdaru: Snapshot de Contexto em 3 níveis; nexxussai: `ScreenContextSnapshot` imutável com `context_hash`);
2. o **registro de telas** como fonte de verdade compartilhada front/back (nexxussai: `screen_registry_seed.py` + `screenRegistry.ts`; ghdaru: Camada Semântica de Interface);
3. a **sanitização server-side** como propriedade do snapshot (ghdaru: `sanitize.py`; nexxussai: `screen_context_sanitizer.py`).

Ponto forte (do panorama): **nenhum protocolo externo padroniza contexto de tela** — é o espaço aberto que os laboratórios preenchem.

## Por quê

O capítulo 04 é a metade "app→IA" do protocolo (o 03 é a metade "IA→app"). Sem ele, os capítulos 05–06 (ações e comandos de UI) ficam sem chão: toda proposta de ação pressupõe que o agente sabe — porque foi *informado*, não porque *adivinhou* — em que tela o usuário está e o que ela contém. A convergência independente das duas bases neste ponto (contexto declarado + sanitização + registro compartilhado) é uma das evidências empíricas mais fortes do livro, e o panorama mostra que é justamente aqui que a indústria ainda não padronizou nada.

## Critérios de aceite

- [x] **CA-1**: `livro/capitulos/04-contexto-de-tela.md` existe com todas as seções do esqueleto v3 na ordem normativa (cabeçalho datado → objetivos → problema → fundamentos científicos → fontes da indústria → estado da arte com Leitura executiva → verificação → apêndice por laboratório).
- [x] **CA-2**: a seção "O problema" está redigida (não esqueleto) e fecha com as quatro tensões: riqueza de contexto × privacidade × custo de tokens × sincronia.
- [x] **CA-3**: o esqueleto do estado da arte cobre os três mecanismos (snapshot em níveis, registro de telas, sanitização) mais a decisão fundadora (nunca inferir) e o espaço aberto na indústria — cada H3 com 1–2 frases de intenção.
- [x] **CA-4**: o Apêndice traz a evidência por path dos dois laboratórios (incluindo as lacunas declaradas: ghdaru envia hoje só `screen.id`/`route`; alternativas rejeitadas do nexxussai) e um H3 de divergências.
- [x] **CA-5**: fronteiras respeitadas (`livro/README.md`): a sanitização aparece como propriedade do snapshot — o modelo de ameaça completo (prompt injection, separação de camadas) fica para o cap. 07; manifesto/federação fica para o cap. 09.
- [x] **CA-6**: toda afirmação com path/URL/⏳; siglas por extenso na 1ª ocorrência; nenhuma fonte científica citada como validada sem ✓ na bibliografia (a seção declara o status ⏳ explicitamente); exemplos fictícios.

## Fora de escopo

- **Fase 2** (prosa integral do estado da arte) — continuação desta spec, após gate da estrutura.
- Modelo de ameaça completo e defesas contra prompt injection (cap. 07, spec 011); manifesto de aplicação e federação (cap. 09, spec 013).
- Validação das fontes científicas candidatas (rodada própria da bibliografia).
- Edição de `CHANGELOG.md`, `HISTORICO.md`, `livro/glossario.md`, `livro/bibliografia.md` e `livro/README.md` — feita no fechamento do lote pelo orquestrador.
