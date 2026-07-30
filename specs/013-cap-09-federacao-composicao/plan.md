# Plan 013 — Capítulo 09: Federação e composição (estrutura)

## Abordagem

Ler os insumos na ordem: constituição → `livro/GUIA-CAPITULO.md` (formato normativo da fase 1) → `livro/README.md` (tese do cap. 09 e fronteiras 09×05, 09×07, 09×10) → `estudos/fonte-base-codigo.md` (§2.4 federação do ghdaru, §2.5/§3.4 lacunas, síntese nº 7) → `estudos/panorama-industria.md` (§2: MCP Apps, MCP-UI; §4: OpenAI Apps SDK; §1: A2A Agent Card como paralelo do manifesto) → `estudos/candidatos-bibliografia.md` (confirmar a lacuna de ciência para federação/generative UI). Redigir então a estrutura em um único arquivo: "O problema" em prosa completa ancorado na decisão negativa do `docs/adr/0003-modelos-integracao-aplicacoes.md` (ghdaru); estado da arte como esqueleto de H3 anotado (2–4 frases dizendo o que a prosa da fase 2 demonstrará), na progressão níveis → manifesto → handshake → decisão "um contrato, não dois" → MCP como projeção → movimento inverso da indústria → conformidade; Apêndice populado com os paths de federação das duas bases, **tratando as lacunas como evidência** (federação especificada sem código no ghdaru; MCP embrionário sem federação no nexxussai). MCP e MCP Apps entram apenas como extensão da federação — a comparação de protocolos é do cap. 10.

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Toda afirmação da estrutura tem path (`ghdaru`/`nexxussai-monorepo`), URL de indústria ou marca ⏳; o estado "especificado, sem código" é declarado explicitamente — READMEs prometem, e aqui a promessa é o próprio objeto de estudo, nomeada como lacuna. |
| II. Fonte-base é o código | ✅ Apêndice populado a partir de `estudos/fonte-base-codigo.md` (§2.4, §2.5, §3.4); ausências entram como "a lacuna que confirma a categoria"; repos-laboratório permanecem somente leitura. |
| III. Esqueleto v3 | ✅ Todas as seções na ordem normativa do `GUIA-CAPITULO.md`, no grau de completude da fase 1 "Estrutura"; siglas por extenso na 1ª ocorrência (MCP, ADR, SEP, JSON-RPC). |
| IV. Livro vivo | ✅ Cabeçalho com captura 2026-07, revisão 2026-07-30 e link para `../HISTORICO.md`; a Leitura executiva rascunhada nomeia o contrato de frescor (a spec MCP Apps é recente e evolui). CHANGELOG/HISTORICO pelo orquestrador (fora do escopo, registrado na spec). |
| V. Segurança | ✅ Nenhum segredo; o exemplo de token do handshake usa valor fictício evidente (`"token": "exemplo-ficticio"`). |
| VI. Neutralidade | ✅ MCP Apps/MCP-UI/OpenAI Apps SDK/A2A apresentados por spec publicada, governança e adoção documentada, vendor-agnóstico; português com termos técnicos sem tradução. |
| VII. Spec-driven | ✅ Esta spec (013) cobre o capítulo com CAs testáveis, plan com Constitution Check e tasks; fase 2 em continuação; commit/CHANGELOG pelo orquestrador. |

## Riscos

- Vazamento de escopo para o cap. 10 (comparar AG-UI/ACP/Vercel aqui) → mitigação: CA-5; MCP/MCP Apps entram só como extensão da federação deste desenho.
- Tratar especificação como implementação (a federação do ghdaru não tem código) → mitigação: CA-4 exige as lacunas nomeadas no Apêndice; o corpo usa "especifica/prevê", nunca "implementa".
- Duplicar a segurança do cap. 07 → mitigação: aqui só as verificações próprias do handshake (`event.origin`, introspecção de token); o modelo de ameaça completo é remetido.
