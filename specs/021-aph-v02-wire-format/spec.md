# Spec 021 — Padrão APH v0.2: Anexo A (wire format)

**Status**: Em implementação · **Data**: 2026-07-31 · **Raia**: plena (mudança de contrato do padrão)

## O quê

Elevar o Padrão APH a **v0.2** adicionando o **Anexo A — wire format**: os formatos exatos de mensagem, validáveis por máquina — JSON Schemas do envelope de evento (com payload por tipo), do snapshot de contexto, da entrada de catálogo, da proposta/confirmação e do envelope de erro (com registro mínimo de códigos) — mais a superfície HTTP de referência, exemplos fictícios validados contra os schemas, e a tabela de mapeamento nome-APH ↔ ghdaru ↔ nexxussai.

## Por quê

Decisão do Accountable (2026-07-31) após o diagnóstico da v0.1: o padrão cobria requisitos ("o quê"), não o fio ("exatamente estes bytes") — insuficiente para alguém implementar do zero sem acesso aos laboratórios. O wire format consolida o que hoje está espalhado nos contratos dos laboratórios, com os nomes canônicos do APH.

## Critérios de aceite

- [ ] **CA-1**: `livro/padrao/schemas/*.schema.json` existem (evento, snapshot, acao-catalogo, confirmacao, erro), em JSON Schema draft 2020-12, **sintaticamente válidos e carregáveis por um validador real**.
- [ ] **CA-2**: cada schema tem ≥1 exemplo fictício no Anexo A **validado mecanicamente** contra o schema (evidência: saída do validador no fechamento da spec); um contraexemplo (payload inválido) é rejeitado pelo validador do envelope de evento.
- [ ] **CA-3**: `livro/padrao/anexo-a-wire-format.md` cobre: enquadramento SSE (`data: {json}\n\n`), superfície HTTP de referência, os schemas com explicação por campo, registro mínimo de códigos de erro, mapeamento APH↔laboratórios, e maturidade por elemento (✅/🧪 herdada da v0.1 — `context_hash` e `idempotency_key` seguem 🧪 e opcionais no fio).
- [ ] **CA-4**: `livro/padrao-aph.md` vira v0.2 (título, referência ao Anexo A no §0 e no versionamento §9); sumário e navegação do site incluem o anexo; termo "wire format" ganha entrada no glossário (regra anti-jargão, mesmo commit).
- [ ] **CA-5**: revisão independente confirma que os schemas não contradizem os contratos dos laboratórios nem a v0.1 (nomes 🧪 opcionais; nada de campo obrigatório sem base comprovada); HISTORICO (edição 0.06) e CHANGELOG registrados.

## Fora de escopo

Suíte de conformidade executável (testes contra uma implementação viva — feature futura); geração de SDK/clientes a partir dos schemas; OpenAPI completo da superfície HTTP (a superfície aqui é referência, não norma de paths).
