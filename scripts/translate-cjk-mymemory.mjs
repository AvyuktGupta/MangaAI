/**
 * Collect unique CJK runs from repo, translate ja→en via MyMemory (free),
 * replace in place. Resumes from scripts/cjk-translation-cache.json.
 * Usage: node scripts/translate-cjk-mymemory.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CACHE_PATH = path.join(__dirname, 'cjk-translation-cache.json');

const CJK_RE = /[\u3040-\u30ff\u3400-\u9fff\u3000-\u303f\uff01-\uff60\uffe0-\uffee]+/g;
const HAS_CJK = /[\u3040-\u30ff\u3400-\u9fff\u3000-\u303f\uff01-\uff60\uffe0-\uffee]/;

const SKIP_DIRS = new Set(['node_modules', 'build', '.git']);
const EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.md', '.html']);

const DELAY_MS = 350;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (EXT.has(path.extname(ent.name))) out.push(p);
  }
  return out;
}

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0), 'utf8');
}

async function translatePhrase(text, cache) {
  const key = text;
  if (cache.hasOwnProperty(key) && !HAS_CJK.test(cache[key])) return cache[key];
  await sleep(DELAY_MS);
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|en`;
  let out = key;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      out = data.responseData.translatedText.trim();
    }
  } catch (e) {
    console.error('fetch', key.slice(0, 40), e.message);
  }
  if (HAS_CJK.test(out)) {
    out = out.replace(CJK_RE, '').replace(/\s+/g, ' ').trim() || key;
  }
  cache[key] = out;
  if (Object.keys(cache).length % 25 === 0) saveCache(cache);
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

function collectUniquePhrases(files) {
  const u = new Set();
  for (const f of files) {
    const s = fs.readFileSync(f, 'utf8');
    let m;
    CJK_RE.lastIndex = 0;
    while ((m = CJK_RE.exec(s))) u.add(m[0]);
  }
  return [...u].sort((a, b) => b.length - a.length);
}

async function main() {
  const cacheObj = loadCache();
  const files = collectFiles();
  const phrases = collectUniquePhrases(files);
  console.log('Files:', files.length, 'Unique phrases:', phrases.length, 'Cached:', Object.keys(cacheObj).length);

  let done = 0;
  for (const phrase of phrases) {
    if (!cacheObj[phrase] || HAS_CJK.test(cacheObj[phrase])) {
      cacheObj[phrase] = await translatePhrase(phrase, cacheObj);
      done++;
      if (done % 10 === 0) process.stdout.write(`\rTranslated ${done}/${phrases.length}   `);
    }
  }
  saveCache(cacheObj);
  console.log('\nApplying replacements...');

  for (const f of files) {
    let text = fs.readFileSync(f, 'utf8');
    if (!HAS_CJK.test(text)) continue;
    const sorted = Object.keys(cacheObj).sort((a, b) => b.length - a.length);
    for (const jp of sorted) {
      const en = cacheObj[jp];
      if (!en || jp === en) continue;
      const esc = jp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      text = text.replace(new RegExp(esc, 'g'), en);
    }
    fs.writeFileSync(f, text, 'utf8');
    console.log('Wrote', path.relative(ROOT, f));
  }

  saveCache(cacheObj);
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
