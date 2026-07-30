# Plan 014 — Capítulo 10: O estado da arte externo

## Abordagem

1. **Estrutura primeiro** (GUIA-CAPITULO, fase 1): o capítulo nasce como esqueleto navegável — "O problema" completo, H3 do estado da arte com resumos de 1–2 frases, fontes candidatas listadas com URL, perguntas de verificação e Apêndice já populado.
2. **Espinha do estado da arte, organizada por fronteira** (não por vendor): (a) o mapa das fronteiras — o que é app↔agente (este capítulo) × o que é harness↔harness (cap. 17 do livro-mãe), com A2A como contraste; (b) protocolos dedicados agente↔UI (AG-UI; ACP da Zed); (c) MCP e seus derivados de UI (elicitation/sampling da spec 2025-06-18; MCP Apps/SEP-1865; MCP-UI comunitário); (d) frameworks de aplicação (Vercel AI SDK UI Message Stream; assistant-ui/LangGraph; LlamaIndex chat-ui como evidência de consolidação); (e) plataformas dos vendors (OpenAI Apps SDK/ChatKit com `window.openai`; Anthropic Messages API como "nível 0", computer use como anti-padrão); (f) a **matriz comparativa** — protocolo × transporte × vocabulário × direções × governança de ações × adoção — adaptada da tabela final do panorama; (g) o balanço: o que consolidou × o que segue aberto; (h) Leitura executiva.
3. **A régua é a Constituição P. VI**: adoção medida e governança, não marketing — por isso as ressalvas de curadoria do panorama (snapshots de adoção, divergência README×docs do AG-UI, site do ACP não acessado) entram como notas visíveis no capítulo, não somem na síntese.
4. **Fronteiras vigiadas na escrita**: MCP como projeção do catálogo próprio → cap. 09; síntese normativa do que adotar → cap. 11; protocolos entre harnesses → cap. 17 do livro-mãe. O texto remete explicitamente.
5. **Evidência antes da prosa**: todas as afirmações de indústria vêm de `estudos/panorama-industria.md` (URLs capturadas em 2026-07-30); afirmações não verificadas em fonte primária mantêm a marca ⏳ do panorama. O Apêndice inverte o uso habitual: em vez de evidenciar a tese com os laboratórios, posiciona cada laboratório **na matriz externa**, com paths de `estudos/fonte-base-codigo.md` conferidos.

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Toda afirmação de indústria com URL verificável em formato "tradução para decisão"; afirmações de implementação com path e repositório identificado; incertezas herdadas do panorama mantêm ⏳. |
| II. Fonte-base é o código | ✅ Este capítulo é o contraponto externo previsto: a indústria contextualiza, não substitui — o Apêndice reancora a comparação nos dois laboratórios por path. Repositórios-fonte intocados. |
| III. Esqueleto v3 | ✅ Todas as seções na ordem do GUIA-CAPITULO; fatos enumeráveis (matriz comparativa, vocabulários) em tabela; explicação na prosa; siglas por extenso na 1ª ocorrência. |
| IV. Livro vivo | ✅ Cabeçalho com data de captura 2026-07; números de adoção explicitamente datados como snapshot; Leitura executiva como contrato de frescor (spec RC do MCP de 2026-07-28 citada como gatilho provável de revisão). HISTORICO no fechamento do lote (fora desta entrega). |
| V. Segurança | ✅ Nenhum segredo; capítulo sem payloads reais — exemplos, quando entrarem na fase 2, serão fictícios evidentes. |
| VI. Neutralidade | ✅ É o capítulo que operacionaliza o princípio: comparação por adoção medida e governança, ressalvas de curadoria visíveis, nenhum ranking por marketing; termos técnicos (*streaming*, *tool calling*, *human-in-the-loop*) sem tradução forçada. |
| VII. Spec-driven (Maestro) | ✅ Spec própria (014 ↔ cap. 10, offset da spec 003); CAs testáveis; CHANGELOG/HISTORICO delegados ao orquestrador do lote (registrado no Fora de escopo). |

## Riscos e decisões locais

- **Perecibilidade acima da média**: este é o capítulo mais sensível ao tempo do livro (specs externas mudam por trimestre; o RC da próxima spec do MCP saiu em [2026-07-28](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)). Mitigação: datação agressiva (toda contagem de adoção carrega "capturado em 2026-07-30") e Leitura executiva formulada como contrato de frescor.
- **Divergência README×docs do AG-UI** ("~16 event types" × enumeração maior das docs): tratada como nota de curadoria com as docs ([docs.ag-ui.com/concepts/events](https://docs.ag-ui.com/concepts/events)) como fonte canônica — herdada do panorama, não resolvida aqui.
- **Risco de invasão de fronteira com os caps. 09 e 11**: mitigado pela regra do sumário repetida no texto — federação/projeção MCP no 09, síntese normativa no 11; aqui só a comparação.
- **A2A é tentação de escopo** (protocolo famoso, mas de outra fronteira): entra apenas no H3 de mapa de fronteiras, fora da matriz comparativa.
