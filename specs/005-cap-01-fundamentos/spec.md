# Spec 005 — Capítulo 01: Fundamentos e vocabulário (fase 1: estrutura)

**Status**: Implementada (estrutura) · **Data**: 2026-07-30 · **Raia**: plena

## O quê

Criar a **estrutura** (fase 1 do `livro/GUIA-CAPITULO.md`, §"Estrutura antes do conteúdo") do capítulo `livro/capitulos/01-fundamentos.md`: cabeçalho datado, objetivos de aprendizagem, "O problema" redigido, fundamentos científicos candidatos (⏳), fontes da indústria com URL, esqueleto de H3 do estado da arte (incluindo o diagrama textual do fluxo completo e a tabela dos sete conceitos), rascunho da Leitura executiva, perguntas de verificação e Apêndice de evidência por laboratório com paths mapeados.

Tese do capítulo (conforme sumário `livro/README.md`, linha do cap. 01): o protocolo tem **duas direções assimétricas** — app→IA é *descrição* (snapshot de contexto + catálogo de ações declarado) e IA→app é *ação mediada* (eventos tipados em streaming carregando conteúdo e intenções) — e **sete conceitos** compõem todo o resto: snapshot de contexto, catálogo de ações, evento tipado, proposta de ação, comando de UI, classe de risco, traço de execução.

## Por quê

O capítulo 01 é a linguagem ubíqua do livro: os capítulos 02–11 pressupõem esses sete conceitos e o mapa das duas direções. Sem o vocabulário fixado (com a equivalência ghdaru × nexxussai × indústria, semente em `livro/glossario.md`), cada capítulo renegociaria termos — exatamente o problema que o próprio protocolo resolve nas aplicações (contratos primeiro). A fase de estrutura existe para aprovar o mapa antes de investir na prosa integral (gate da fase 2).

## Critérios de aceite

- [x] **CA-1 — Formato do GUIA completo**: `livro/capitulos/01-fundamentos.md` contém todas as seções do esqueleto v3 na ordem normativa (cabeçalho datado → Objetivos → O problema → Fundamentos científicos → Fontes da indústria → O estado da arte com `### Leitura executiva` → Verificação → `---` + Apêndice), com "O problema" redigido em 4–6 parágrafos e os H3 do estado da arte com 2–4 frases cada.
- [x] **CA-2 — Evidência por path**: toda afirmação sobre implementação no capítulo tem caminho de arquivo em backticks com o repositório identificado (`ghdaru` ou `nexxussai-monorepo`); os H3 `### ghdaru` e `### nexxussai-monorepo` do Apêndice estão populados com paths pertinentes ao vocabulário, incluindo lacunas ("a lacuna que confirma a categoria").
- [x] **CA-3 — Fontes com URL e ciência honesta**: toda ficha de indústria tem URL verificável no formato "tradução para decisão"; a seção de fundamentos científicos lista apenas candidatos ⏳ (de `estudos/candidatos-bibliografia.md`) e declara explicitamente que nenhum sustenta afirmação do corpo até a validação ✓ (fase 2).
- [x] **CA-4 — Objetivos ↔ Verificação alinhados**: cada pergunta de Verificação testa exatamente um objetivo de aprendizagem (mapeamento 1:1), com dica entre parênteses.
- [x] **CA-5 — Fronteiras respeitadas**: o capítulo não detalha transporte/sessão (cap. 02), semântica de eventos (cap. 03) nem FSM de ações (cap. 05) — apresenta apenas o mapa conceitual, o fluxo de ponta a ponta e o vocabulário, com ponteiros explícitos para os capítulos vizinhos.
- [x] **CA-6 — Consistência terminológica**: a tabela dos sete conceitos usa as mesmas definições/nomes de `livro/glossario.md` (que não é editado por esta spec) e cobre, para cada conceito, o nome nos dois laboratórios e o equivalente na indústria.

## Fora de escopo

- **Texto completo do capítulo** (prosa integral dos H3 do estado da arte) — fase 2, nesta mesma spec ou continuação, após aprovação da estrutura.
- Validação ✓ de papers e promoção a `livro/bibliografia.md` (feita pela fase 2, primeira a citar no corpo).
- Edição de `CHANGELOG.md`, `livro/HISTORICO.md`, `livro/README.md`, `livro/glossario.md`, `livro/bibliografia.md` e arquivos de outros capítulos/specs (registro do lote é do orquestrador).
