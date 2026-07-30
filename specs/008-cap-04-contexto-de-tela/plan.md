# Plan 008 — Capítulo 04: A voz da aplicação — contexto de tela

## Abordagem

Estrutura derivada dos estudos da spec 002, sem pesquisa nova:

1. **Espinha do capítulo** = a decisão negativa comum ("nunca inferir a interface": DOM scraping e prompt hardcoded rejeitados formalmente — nexxussai `specs/014-chat-lateral-contexto/research.md`; ghdaru Constituição P.IV via `estudos/fonte-base-codigo.md`) seguida dos três mecanismos positivos que a substituem: **snapshot** (a fotografia por mensagem), **registro de telas** (a fonte de verdade compartilhada front/back) e **sanitização server-side** (a propriedade de segurança do snapshot).
2. **Ordem dos H3** segue o fluxo do dado: decisão fundadora → snapshot → níveis de contexto → registro → camada semântica → sanitização → espaço aberto na indústria → Leitura executiva. Uma ideia nova por vez (Princípio III).
3. **Evidência**: todos os paths saem de `estudos/fonte-base-codigo.md` (§2.2, §2.3, §3.1–§3.3); as fichas de indústria saem de `estudos/panorama-industria.md` (AG-UI `StateSnapshot`/`StateDelta`, MCP resources, computer use como anti-padrão) — com a constatação-chave da lacuna: nenhum protocolo pesquisado padroniza contexto de tela.
4. **Ciência**: nenhuma entrada validada (✓) ainda; a seção declara isso e lista as candidatas ⏳ pertinentes (surveys de GUI agents — o problema de *grounding* que o contexto declarado elimina; indirect prompt injection — desenvolvida no cap. 07).
5. **Fronteiras** (livro/README.md, "04 × 07" e "09"): sanitização aqui é propriedade do snapshot; ameaça e defesas em profundidade → cap. 07; manifesto/handshake → cap. 09.

Entrega desta rodada: **fase 1 (Estrutura)** com gate antes da prosa integral (fase 2).

## Constitution Check

| Princípio | Conformidade |
|---|---|
| I. Evidência | ✅ Todo mecanismo citado com path em backticks + repositório; indústria com URL; ciência não validada marcada ⏳ e declarada como tal (não sustenta afirmação do corpo). |
| II. Fonte-base é o código | ✅ Capítulo nasce da convergência das duas bases; repositórios-fonte intocados (somente leitura); paths no Apêndice, síntese no corpo. |
| III. Esqueleto v3 | ✅ Todas as seções na ordem normativa do GUIA-CAPITULO; fatos enumeráveis em tabela no Apêndice/estado da arte; siglas por extenso na 1ª ocorrência. |
| IV. Livro vivo | ✅ Cabeçalho datado (captura 2026-07); Leitura executiva como contrato de frescor; HISTORICO atualizado no fechamento do lote (fora desta entrega, ver spec). |
| V. Segurança | ✅ Exemplos fictícios evidentes; nenhum segredo; os *markers* de sanitização citados são identificadores de campo, não valores. |
| VI. Neutralidade | ✅ Protocolos externos avaliados por spec/docs oficiais e adoção medida (panorama); vendor-agnóstico; termos técnicos sem tradução forçada. |
| VII. Spec-driven (Maestro) | ✅ Spec própria (008) com CAs testáveis; raia plena; gate humano entre estrutura e texto completo; CHANGELOG/HISTORICO no lote. |

## Riscos e mitigação

- **Vazamento de escopo para o cap. 07** (segurança): mitigado por CA-5 — a sanitização entra como *o que* o snapshot garante, não *contra quem*.
- **Assimetria dos laboratórios** (ghdaru tem o desenho em 3 níveis mas envia pouco; nexxussai tem o snapshot rico implementado): tratada como conteúdo, não como problema — é "a lacuna que confirma a categoria" (GUIA-CAPITULO §7) e ganha registro explícito no Apêndice.
