# Spec 019 — Glossário didático e regra anti-jargão

**Status**: Implementada · **Data**: 2026-07-31 · **Raia**: plena (editorial transversal + regra permanente)

## O quê

Tornar o livro legível para quem não vem da engenharia de software: (a) glossário expandido em três camadas — objetos do protocolo, **siglas por extenso e em palavras simples**, **termos técnicos em português claro** (~30 siglas + ~30 termos, com analogias); (b) ponteiro didático no topo do Padrão APH; (c) **regra editorial permanente** no GUIA-CAPITULO: todo termo/sigla usado no livro DEVE ter entrada no glossário, criada no mesmo commit — jargão órfão é defeito de revisão.

## Por quê

Pedido do Accountable (2026-07-31): "já vá traduzindo e explicando melhor esta mistureira de siglas e termos técnicos". O inventário mecânico confirmou a densidade (UI ×175, MCP ×171, SSE ×93, FSM ×44, MRTR ×15 nos capítulos + padrão). A regra do GUIA cobria só a expansão da sigla na 1ª ocorrência — expandir não é explicar. Ciclo Maestro retro → regra versionada: a dor vira regra permanente, não correção pontual.

## Critérios de aceite

- [x] **CA-1**: `livro/glossario.md` cobre todas as siglas do inventário com ocorrência relevante (≥3 usos) e os termos técnicos centrais do padrão/capítulos, cada um com explicação autossuficiente em 1–3 linhas, sem pressupor formação técnica.
- [x] **CA-2**: a ambiguidade *token* (credencial × unidade de texto do LLM) está explicitada; harness, idempotência, hash, stateless, prompt injection, elicitation/MRTR e computer use têm explicação com analogia.
- [x] **CA-3**: o Padrão APH aponta para o glossário antes dos requisitos.
- [x] **CA-4**: o GUIA-CAPITULO ganhou a regra permanente (entrada no glossário no mesmo commit; jargão órfão = defeito de revisão).

## Fora de escopo

Reescrever a prosa dos 12 capítulos para reduzir densidade (os capítulos seguem a regra de expansão na 1ª ocorrência; o glossário passa a ser a camada de apoio); tradução de termos consagrados (Constituição, Princípio VI — *harness*, *tool*, *prompt* seguem sem tradução forçada, agora explicados).
