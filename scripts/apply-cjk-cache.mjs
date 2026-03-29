/** Apply scripts/cjk-translation-cache.json to source files (longest keys first). */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CACHE_PATH = path.join(__dirname, 'cjk-translation-cache.json');

const HAS_CJK = /[\u3040-\u30ff\u3400-\u9fff\u3000-\u303f\uff01-\uff60\uffe0-\uffee]/;
const SKIP = new Set(['node_modules', 'build', '.git']);
const EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.md', '.html']);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (EXT.has(path.extname(ent.name))) out.push(p);
  }
  return out;
}

function collectFiles() {
  const files = walk(path.join(ROOT, 'src'))
    .concat(walk(path.join(ROOT, 'public')))
    .concat(walk(path.join(ROOT, 'scripts')));
  for (const name of ['USER_GUIDE.md', 'README.md', 'DEPLOYMENT.md', 'PROJECT_STATUS.md', 'cost_analysis.md', 'README.old.md']) {
    const f = path.join(ROOT, name);
    if (fs.existsSync(f)) files.push(f);
  }
  return files;
}

const cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
const keys = Object.keys(cache).sort((a, b) => b.length - a.length);
let updated = 0;
for (const f of collectFiles()) {
  let text = fs.readFileSync(f, 'utf8');
  if (!HAS_CJK.test(text)) continue;
  const orig = text;
  for (const jp of keys) {
    const en = cache[jp];
    if (!en || jp === en) continue;
    const esc = jp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    text = text.replace(new RegExp(esc, 'g'), en);
  }
  if (text !== orig) {
    fs.writeFileSync(f, text, 'utf8');
    console.log(path.relative(ROOT, f));
    updated++;
  }
}
console.log('Files updated:', updated);
