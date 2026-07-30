# Plan 011 — Capítulo 07: Segurança do protocolo (estrutura)

## Abordagem

Ler os insumos na ordem: constituição → `livro/GUIA-CAPITULO.md` (formato normativo da fase 1) → `livro/README.md` (tese e fronteiras do cap. 07: 04×07, 05, 09) → `estudos/fonte-base-codigo.md` (evidência por path de segurança nas duas bases) → `estudos/panorama-industria.md` (OWASP e a convergência human-in-the-loop) → `estudos/candidatos-bibliografia.md` (eixo prompt injection + risco de agentes, tudo ⏳). **Verificar cada path de evidência diretamente nos repositórios-laboratório (somente leitura)** antes de citá-lo — em especial os que a pesquisa não detalhou: `require("kb:read", ...)` (`knowledge/domain/authz.py`), a derivação de capabilities (`identity/domain/capabilities.py`), a política pura ReBAC (`knowledge/domain/access.py`), o rótulo "Contexto de tela (sanitizado)" (`handle_message.py`) e o escopo user/client/profile dos use cases do chat lateral (`record_tool_result.py`, `create_lateral_session.py`).

Em seguida, redigir a estrutura em um único arquivo: "O problema" em prosa completa carregando o **modelo de ameaça** (quatro canais de entrada não confiáveis → um único contexto; por que instrução em prompt não é controle de segurança), sustentado por fonte de indústria com URL (OWASP) e paths — nunca por paper ⏳; estado da arte como esqueleto de H3 organizado nas **quatro camadas de defesa** (2–4 frases por seção dizendo o que a prosa da fase 2 demonstrará, com a fronteira para os caps. 04/05/09 anotada onde couber); fontes candidatas transcritas dos estudos com URL/⏳; Apêndice populado com a evidência verificada, incluindo as **lacunas instrutivas** (permissão sempre-True no nexxussai) como "a lacuna que confirma a categoria".

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Toda afirmação da estrutura tem path (`ghdaru`/`nexxussai-monorepo`) verificado nesta rodada, URL de indústria ou marca ⏳; papers ⏳ não sustentam o corpo — a seção de fundamentos declara isso explicitamente. |
| II. Fonte-base é o código | ✅ O Apêndice nasce da leitura direta dos repositórios-laboratório (somente leitura, nada escrito neles); ciência e indústria contextualizam o modelo de ameaça, não o substituem. |
| III. Esqueleto v3 | ✅ Todas as seções na ordem normativa do `livro/GUIA-CAPITULO.md`, no grau de completude da fase 1 "Estrutura"; siglas por extenso na 1ª ocorrência; tabela para as quatro camadas (fato enumerável). |
| IV. Livro vivo | ✅ Cabeçalho com captura 2026-07, revisão 2026-07-30 e link para `../HISTORICO.md`; CHANGELOG/HISTORICO atualizados pelo orquestrador no fechamento do lote (fora do escopo, registrado na spec). |
| V. Segurança | ✅ Nenhum segredo; os marcadores de sanitização citados (`password`, `token`…) são nomes de campo do código-fonte, não credenciais; payloads (se houver) fictícios evidentes. |
| VI. Neutralidade | ✅ OWASP e os quatro ecossistemas (Vercel AI SDK, ACP, MCP, OpenAI Agents SDK) apresentados por documentação verificável, vendor-agnóstico; português com termos técnicos (*prompt injection*, *tool*, *human-in-the-loop*) sem tradução forçada. |
| VII. Spec-driven | ✅ Esta spec (011) cobre o capítulo, com CAs testáveis, plan com Constitution Check e tasks; fase 2 em spec de continuação; sem decisão nova que exija ADR. |

## Riscos

- Vazamento de escopo (reproduzir a mecânica da sanitização do cap. 04, a FSM do cap. 05 ou o handshake do cap. 09) → mitigação: CA-5 + anotação explícita da fronteira dentro de cada H3 afetado.
- Citação científica prematura sustentando o modelo de ameaça → mitigação: "O problema" apoia-se em OWASP (URL) e nos paths; papers só como candidatos ⏳ com validação declarada para a fase 2.
- Path citado sem conferência (a pesquisa da spec 002 não detalhou capabilities/traço) → mitigação: verificação direta por grep/leitura nos dois repositórios antes da escrita (feita nesta rodada).
