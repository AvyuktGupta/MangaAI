/**
 * Remove any remaining CJK / fullwidth punctuation characters (zero-CJK policy).
 * Run after apply-cjk-cache + translation. Safe for ASCII code & Latin identifiers.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Hiragana, Katakana, CJK, CJK punctuation, fullwidth forms, Hangul (if present)
const CJK_BLOCK =
  /[\u3040-\u30ff\u3400-\u9fff\u3000-\u303f\uff01-\uff60\uffe0-\uffee\uac00-\ud7af\u1100-\u11ff]/g;

const SKIP = new Set(['node_modules', 'build', '.git', 'cjk-translation-cache.json']);
const EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.md', '.html', '.json']);

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
  for (const name of ['USER_GUIDE.md', 'README.md', 'DEPLOYMENT.md', 'PROJECT_STATUS.md', 'cost_analysis.md', 'README.old.md', 'package.json']) {
    const f = path.join(ROOT, name);
    if (fs.existsSync(f)) files.push(f);
  }
  return files;
}

let updated = 0;
for (const f of collectFiles()) {
  let text = fs.readFileSync(f, 'utf8');
  const orig = text;
  text = text.replace(CJK_BLOCK, '');
  text = text.replace(/[ \t]+\n/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  if (text !== orig) {
    fs.writeFileSync(f, text, 'utf8');
    console.log(path.relative(ROOT, f));
    updated++;
  }
}
console.log('Stripped files:', updated);
