# Guia de capítulo — esqueleto v3 adaptado

Formato normativo de todo capítulo deste livro (Constituição, Princípio III). Herdado do esqueleto v3 do livro [Engenharia de Harness](https://github.com/GHDaru/harness_engineering), com uma adaptação: a evidência empírica vem dos **dois laboratórios** (`ghdaru` e `nexxussai-monorepo`), não de harnesses de mercado.

## Cabeçalho (obrigatório)

```markdown
# NN — Título do capítulo

> **Estado da arte capturado em AAAA-MM** · última revisão AAAA-MM-DD · [histórico e registro de expiração](../HISTORICO.md)
```

## Seções, nesta ordem

1. **`## Objetivos de aprendizagem`** — 3–5 itens numerados, verbos de Bloom em negrito (**Explicar**, **Distinguir**, **Analisar**, **Implementar**, **Avaliar**, **Decidir**), abertos por "Ao final deste capítulo, você deve ser capaz de:".
2. **`## O problema`** — por que esta parte do protocolo existe; quando possível, fechar com as restrições em tensão (ex.: riqueza de contexto × privacidade × custo de tokens).
3. **`## Fundamentos científicos`** — 2–4 papers **traduzidos para decisões** ("X mostrou Y, e é a base empírica da prática Z"). Só entra paper com status ✓ em [`bibliografia.md`](bibliografia.md); fechar com o ponteiro para ela. Se o capítulo ainda não tem ciência validada, a seção declara isso explicitamente (nunca omitir a seção).
4. **`## Fontes da indústria`** — fichas `**[Título — Fonte](url)**: tradução para decisão`. URL verificável obrigatória.
5. **`## O estado da arte`** — o corpo, em H3; fatos enumeráveis em tabela, explicação na prosa. Os laboratórios aparecem como exemplos nominais; o detalhe por path fica no Apêndice. Fecha com **`### Leitura executiva`** — parágrafo final com "o que roubar" (ideias exportáveis). *A Leitura executiva é o contrato de frescor: um evento que a invalide dispara revisão extraordinária.*
6. **`## Verificação`** — 2–5 perguntas (no máximo uma por objetivo) que testam exatamente os objetivos do item 1, cada uma com dica entre parênteses.
7. **`---`** + **`## Apêndice — evidência por laboratório`** — dois H3 fixos: `### ghdaru` e `### nexxussai-monorepo`, corpo com paths em backticks + fatos concretos (nomes de tipos, transições, endpoints). Ausências entram também ("a lacuna que confirma a categoria"). Quando útil, um terceiro H3 `### Divergências` compara os dois.

## Regras de evidência (Constituição, Princípio I)

- Afirmação sobre implementação → **path** em backticks + repositório identificado.
- Afirmação científica → citação inline `([arXiv NNNN.NNNNN](https://arxiv.org/abs/NNNN.NNNNN))` com status ✓ na bibliografia.
- Afirmação de indústria → URL verificável, formato "tradução para decisão".
- Exemplo de payload → valores fictícios evidentes (`"token": "exemplo-ficticio"` jamais um valor plausível real).
- Sigla → por extenso na 1ª ocorrência do capítulo. Termos técnicos consagrados sem tradução.
- Evitar absolutos atemporais; o capítulo inteiro está sob a data de captura do cabeçalho.

## Estrutura antes do conteúdo

Cada capítulo nasce em duas fases, cada uma com gate na sua spec:

1. **Estrutura** (entrega mínima da spec do capítulo): o arquivo do capítulo com cabeçalho, objetivos, "O problema" redigido, esqueleto de H3 do estado da arte com 1–2 frases por seção, fontes candidatas listadas, perguntas de verificação e o Apêndice com a evidência por path já mapeada.
2. **Texto completo** (mesma spec ou continuação): prosa integral respeitando a estrutura aprovada.

## Definition of Done do capítulo (Maestro)

- [ ] Critérios de aceite da spec do capítulo conferidos um a um
- [ ] Toda afirmação com evidência (path/URL/✓); payloads fictícios
- [ ] Links internos e externos válidos (conferência por amostragem no mínimo)
- [ ] Objetivos ↔ Verificação alinhados (cada pergunta testa um objetivo)
- [ ] Entrada no `CHANGELOG.md` e, se fecha lote, edição no `HISTORICO.md`
- [ ] Revisão independente em contexto fresco antes do "pronto"
