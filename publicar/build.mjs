// Motor do livro "Protocolo de Comunicação Aplicação ↔ Harness".
// Markdown (repo inteiro) -> site HTML navegável (docs/), no espírito do motor
// do livro-mãe (harness_engineering/publicar/build.mjs), enxuto por YAGNI.
// Uso: node build.mjs  (de qualquer diretório)
//
// Regras: todo .md fora de pastas ocultas vira .html no mesmo caminho relativo;
// link interno .md -> .html (build FALHA se o alvo não existir — Princípio I).

import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, resolve, join, relative, posix } from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..");
const SAIDA = resolve(RAIZ, "docs");
const GITHUB = "https://github.com/GHDaru/protocolos/blob/main/";
const IGNORAR = new Set([".git", ".specify", ".github", "node_modules", "docs", "publicar"]);

const md = new MarkdownIt({ html: true, linkify: true, typographer: false }).use(anchor, { level: [2, 3] });

// ---- coleta ----------------------------------------------------------------
function coletar(dir, base = RAIZ, acc = []) {
  for (const nome of readdirSync(dir)) {
    if (nome.startsWith(".") && dir === RAIZ) continue;
    if (IGNORAR.has(nome)) continue;
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) coletar(p, base, acc);
    else if (nome.endsWith(".md")) acc.push(posix.join(...relative(base, p).split(/[\\/]/)));
  }
  return acc;
}
const paginas = coletar(RAIZ).sort();
// A constituição vive em pasta oculta (.specify/), mas é página do site.
if (existsSync(join(RAIZ, ".specify/memory/constitution.md"))) paginas.push(".specify/memory/constitution.md");
const publicadas = new Set(paginas);

// ---- navegação (o essencial; o resto é alcançável pelos links do conteúdo) --
const NAV = [
  { rot: "Início", arq: "README.md" },
  { rot: "O livro (sumário)", arq: "livro/README.md" },
  ...paginas.filter((p) => p.startsWith("livro/capitulos/")).map((p) => ({
    rot: p.replace("livro/capitulos/", "").replace(".md", "").replace(/^(\d+)-/, "$1 · ").replaceAll("-", " "),
    arq: p, sub: true,
  })),
  { rot: "★ Padrão APH v0.4", arq: "livro/padrao-aph.md" },
  { rot: "Anexo A · wire format", arq: "livro/padrao/anexo-a-wire-format.md", sub: true },
  { rot: "Suíte de conformidade · Nível 1", arq: "conformidade/README.md", sub: true },
  { rot: "Skills de adoção", arq: "skills.md", sub: true },
  { rot: "Glossário", arq: "livro/glossario.md" },
  { rot: "Bibliografia", arq: "livro/bibliografia.md" },
  { rot: "Histórico (livro vivo)", arq: "livro/HISTORICO.md" },
  { rot: "Changelog", arq: "CHANGELOG.md" },
];

// ---- links .md -> .html com verificação ------------------------------------
let quebrados = [];
function reescreverLinks(html, arquivo) {
  return html.replace(/href="([^"]+)"/g, (m, href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return m;
    const [alvo, ancora] = href.split("#");
    if (!alvo.endsWith(".md")) return m;
    const abs = posix.normalize(posix.join(posix.dirname(arquivo), alvo));
    if (!publicadas.has(abs)) { quebrados.push(`${arquivo} -> ${href}`); return m; }
    return `href="${alvo.replace(/\.md$/, ".html")}${ancora ? "#" + ancora : ""}"`;
  });
}

// ---- casca -----------------------------------------------------------------
const CSS = `
:root{--bg:#fdfdfc;--fg:#1e2229;--muted:#5b6472;--acc:#0b6bcb;--borda:#e3e5e8;--cod:#f4f5f7;--nav:#f8f8f7}
@media(prefers-color-scheme:dark){:root{--bg:#14161a;--fg:#e6e8eb;--muted:#9aa3af;--acc:#6cb0f2;--borda:#2a2e35;--cod:#1d2026;--nav:#181b20}}
*{box-sizing:border-box}body{margin:0;font:16px/1.65 system-ui,-apple-system,"Segoe UI",sans-serif;background:var(--bg);color:var(--fg)}
a{color:var(--acc);text-decoration:none}a:hover{text-decoration:underline}
.wrap{display:flex;min-height:100vh}
nav{width:280px;flex-shrink:0;border-right:1px solid var(--borda);background:var(--nav);padding:1.2rem 1rem;position:sticky;top:0;height:100vh;overflow-y:auto}
nav .titulo{font-weight:700;font-size:.95rem;margin-bottom:1rem;line-height:1.3}
nav a{display:block;padding:.22rem .5rem;border-radius:6px;color:var(--fg);font-size:.88rem}
nav a.sub{padding-left:1.4rem;color:var(--muted);font-size:.84rem}
nav a.ativo,nav a:hover{background:var(--borda);text-decoration:none}
main{flex:1;min-width:0;padding:2.2rem clamp(1rem,5vw,4rem);max-width:900px}
h1{font-size:1.7rem;line-height:1.25}h2{margin-top:2.2rem;border-bottom:1px solid var(--borda);padding-bottom:.3rem}
blockquote{margin:1rem 0;padding:.6rem 1rem;border-left:4px solid var(--acc);background:var(--cod);border-radius:0 8px 8px 0;color:var(--muted)}
code{background:var(--cod);padding:.12em .35em;border-radius:4px;font-size:.88em}
pre{background:var(--cod);padding:1rem;border-radius:8px;overflow-x:auto}pre code{background:none;padding:0}
table{border-collapse:collapse;width:100%;display:block;overflow-x:auto;font-size:.9rem}
th,td{border:1px solid var(--borda);padding:.45rem .6rem;text-align:left;vertical-align:top}th{background:var(--cod)}
footer{margin-top:3rem;padding-top:1rem;border-top:1px solid var(--borda);color:var(--muted);font-size:.82rem}
.menu-btn{display:none}
@media(max-width:900px){nav{position:fixed;left:-290px;transition:left .2s;z-index:10}nav.aberta{left:0}
.menu-btn{display:block;position:fixed;top:.7rem;right:.7rem;z-index:11;background:var(--nav);border:1px solid var(--borda);border-radius:8px;padding:.4rem .7rem;color:var(--fg)}}`;

function titulo(corpo) {
  const m = corpo.match(/^#\s+(.+)$/m);
  return m ? m[1].replace(/[*_`]/g, "") : "Protocolo App ↔ Harness";
}

function casca(arquivo, corpoHtml, tit) {
  const prof = arquivo.split("/").length - 1;
  const rel = prof ? "../".repeat(prof) : "./";
  const navHtml = NAV.map((i) => {
    const href = rel + i.arq.replace(/\.md$/, ".html");
    const ativo = i.arq === arquivo ? " ativo" : "";
    return `<a class="${i.sub ? "sub" : ""}${ativo}" href="${href}">${i.rot}</a>`;
  }).join("\n");
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${tit} — Protocolo App ↔ Harness</title><style>${CSS}</style></head><body>
<button class="menu-btn" onclick="document.querySelector('nav').classList.toggle('aberta')">☰ menu</button>
<div class="wrap"><nav><div class="titulo">Protocolo de Comunicação<br>Aplicação ↔ Harness</div>${navHtml}
<div style="margin-top:1rem"><a href="https://github.com/GHDaru/protocolos">Repositório ↗</a></div></nav>
<main>${corpoHtml}
<footer>Livro vivo · <a href="${GITHUB}${arquivo}">fonte desta página ↗</a> · co-escrito com agente de IA sob curadoria humana · governança: metodologia Maestro</footer>
</main></div></body></html>`;
}

// ---- build -----------------------------------------------------------------
rmSync(SAIDA, { recursive: true, force: true });
for (const arq of paginas) {
  const bruto = readFileSync(join(RAIZ, arq), "utf8");
  const corpo = reescreverLinks(md.render(bruto), arq);
  const destino = join(SAIDA, arq.replace(/\.md$/, ".html"));
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, casca(arq, corpo, titulo(bruto)));
}
// raiz: README vira index
writeFileSync(join(SAIDA, "index.html"), readFileSync(join(SAIDA, "README.html")));
writeFileSync(join(SAIDA, ".nojekyll"), "");

if (quebrados.length) {
  console.error(`LINKS QUEBRADOS (${quebrados.length}):\n` + quebrados.join("\n"));
  process.exit(1);
}
console.log(`ok: ${paginas.length} páginas geradas em docs/ (+ index.html), zero links quebrados`);
