# Plan 007 — Capítulo 03: A voz da IA — eventos tipados

## Abordagem

1. **Estrutura primeiro** (GUIA-CAPITULO, fase 1): o capítulo nasce como esqueleto navegável — "O problema" completo, H3 do estado da arte com resumos de 1–2 frases, fontes candidatas e Apêndice com paths já verificados nos dois laboratórios.
2. **Espinha do estado da arte**: (a) o envelope e o vocabulário fechado (`{seq, kind, payload}` do ghdaru; hierarquia `StreamEvent` do nexxussai); (b) as famílias semânticas do vocabulário (conteúdo, raciocínio, artefatos, citações, execução, ação/UI *apenas nomeados*, erro, terminador); (c) o padrão triplo start/delta/end como forma dominante na indústria (AG-UI, Vercel AI SDK, Anthropic `content_block_*`); (d) a regra de evolução (ignorar desconhecidos + documentar antes de usar); (e) a normalização multi-provider como guarda do vocabulário (o domínio nunca vê formato raw); (f) a separação protocolo×render (agrupar no cliente sem mudar o contrato).
3. **Fronteiras vigiadas na escrita**: entrega/reentrega → cap. 02; semântica de agir → caps. 05–06; arquitetura da porta do modelo → cap. 08. O texto remete explicitamente.
4. **Evidência antes da prosa**: todos os paths do Apêndice conferidos por leitura direta nos repositórios-fonte (somente leitura) em 2026-07-30; fontes de indústria vêm de `estudos/panorama-industria.md` (URLs já capturadas); ciência ainda sem entrada ✓ — a seção declara isso e lista candidatos ⏳.

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Toda afirmação da estrutura tem path (ghdaru/nexxussai identificados), URL do panorama ou marca ⏳; payloads de exemplo fictícios. |
| II. Fonte-base é o código | ✅ Apêndice por laboratório com paths verificados por leitura direta; indústria contextualiza (tabela comparativa), não substitui. Repositórios-fonte intocados. |
| III. Esqueleto v3 | ✅ Todas as seções, na ordem do GUIA-CAPITULO; fatos enumeráveis (vocabulários, comparativo) em tabela; siglas por extenso na 1ª ocorrência. |
| IV. Livro vivo | ✅ Cabeçalho com data de captura 2026-07; Leitura executiva como contrato de frescor. HISTORICO é atualizado no fechamento do lote (fora desta entrega). |
| V. Segurança | ✅ Nenhum segredo; exemplos com valores evidentemente fictícios. |
| VI. Neutralidade | ✅ Indústria avaliada por adoção/governança (dados do panorama); termos técnicos (*streaming*, *chunk*, *tool calling*) sem tradução forçada. |
| VII. Spec-driven (Maestro) | ✅ Spec própria (007 ↔ cap. 03, offset da spec 003); CAs testáveis; CHANGELOG/HISTORICO delegados ao orquestrador do lote (registrado no Fora de escopo). |

## Riscos e decisões locais

- **Divergência de nomenclatura no ghdaru** (Constituição `ToolCallRequest/Confirmation/Response` × código `action_proposal`/`action_result`): tratada como *fato documentado* no H3 de Divergências, não resolvida aqui — resolver seria mudança de escopo no repositório-fonte (que é somente leitura).
- **Risco de invasão de fronteira com o cap. 02** (o envelope contém `seq`): mitigado pela regra do sumário — o envelope pertence ao 03, a entrega/reentrega ao 02 — repetida no texto.
