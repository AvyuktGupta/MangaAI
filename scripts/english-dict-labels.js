/**
 * Converts public/dict/default_sfw.js to English display strings.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/dict/default_sfw.js');
let s = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

function labelFromTag(tag) {
  if (tag === undefined || tag === null) return 'Unknown';
  const t = String(tag).trim();
  if (t === '') return 'None';
  return t
    .split(/_+/)
    .flatMap((part) => part.split(/\s+/).filter(Boolean))
    .map((word) =>
      word
        .split('-')
        .map((w) => {
          if (!w) return '';
          if (w.length === 1) return w.toUpperCase();
          if (w === '3D') return '3D';
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        })
        .join('-')
    )
    .filter(Boolean)
    .join(' ');
}

function decodeQuoted(escaped) {
  return escaped.replace(/\\(.)/g, (_, c) => c);
}

const WS = /\s*/.source;

// { "tag", "cat", "label" }
s = s.replace(
  new RegExp(`\\{${WS}"tag"${WS}:${WS}"((?:\\\\.|[^"\\\\])*)"${WS},${WS}"cat"${WS}:${WS}"((?:\\\\.|[^"\\\\])*)"${WS},${WS}"label"${WS}:${WS}"((?:\\\\.|[^"\\\\])*)"${WS}\\}`, 'g'),
  (m, tag, cat) => {
    const nl = labelFromTag(decodeQuoted(tag));
    return `{ "tag": "${tag}", "cat": "${cat}", "label": "${nl}" }`;
  }
);

// { "tag", "label", "cat" }  (clothing rows)
s = s.replace(
  new RegExp(`\\{${WS}"tag"${WS}:${WS}"((?:\\\\.|[^"\\\\])*)"${WS},${WS}"label"${WS}:${WS}"((?:\\\\.|[^"\\\\])*)"${WS},${WS}"cat"${WS}:${WS}"((?:\\\\.|[^"\\\\])*)"${WS}\\}`, 'g'),
  (m, tag, _l, cat) => {
    const nl = labelFromTag(decodeQuoted(tag));
    return `{ "tag": "${tag}", "label": "${nl}", "cat": "${cat}" }`;
  }
);

// { "tag", "label" (, "category")? }
s = s.replace(
  new RegExp(
    `\\{${WS}"tag"${WS}:${WS}"((?:\\\\.|[^"\\\\])*)"${WS},${WS}"label"${WS}:${WS}"((?:\\\\.|[^"\\\\])*)"(?:${WS},${WS}"category"${WS}:${WS}"((?:\\\\.|[^"\\\\])*)")?${WS}\\}`,
    'g'
  ),
  (m, tag, _l, cat) => {
    const nl = labelFromTag(decodeQuoted(tag));
    return cat
      ? `{ "tag": "${tag}", "label": "${nl}", "category": "${cat}" }`
      : `{ "tag": "${tag}", "label": "${nl}" }`;
  }
);

const negCat = {
  essential: { label: 'Essential (recommended)', description: 'Basic quality and anatomy' },
  quality: { label: 'Quality boost', description: 'Image clarity and appearance' },
  unwanted: { label: 'Remove clutter', description: 'Remove text, logos, and watermarks' },
  face: { label: 'Face and expression', description: 'Prevent face rendering issues' },
  body: { label: 'Body and anatomy', description: 'Prevent structural body issues' },
  style: { label: 'Keep art style', description: 'Keep anime / manga look' },
  composition: { label: 'Composition', description: 'Prevent framing issues' },
  clothing: { label: 'Clothing', description: 'Prevent clothing artifacts' },
  image_quality: { label: 'Image quality', description: 'Image quality tags' },
};

s = s.replace(
  /\{ "id": "((?:\\.|[^"\\])*)", "label": "((?:\\.|[^"\\])*)", "description": "((?:\\.|[^"\\])*)"\s*\}/g,
  (m, id) => {
    const key = decodeQuoted(id);
    const v = negCat[key];
    if (!v) return m;
    return `{ "id": "${id}", "label": "${v.label}", "description": "${v.description}" }`;
  }
);

// negative_quick_presets: literal replacements (array contains ] in tag lists)
s = s.replace(/"name": ""/g, '"name": "Light set"');
s = s.replace(/"description": ""/g, '"description": "Minimal basics"');
s = s.replace(/"name": ""/g, '"name": "Standard set"');
s = s.replace(/"description": ""/g, '"description": "Balanced default set"');
s = s.replace(/"name": ""/g, '"name": "High quality set"');
s = s.replace(/"description": ""/g, '"description": "Comprehensive quality-focused set"');
s = s.replace(/"name": ""/g, '"name": "Manga-focused set"');
s = s.replace(/"description": "A set specializing in manga and anime tones"/g, '"description": "Optimized for manga / anime style"');

// Strip inline // comments that contain CJK
s = s.replace(/\s*\/\/[^\n]*[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF][^\n]*/g, '');
s = s.replace(/^\s*\/\/[^\n]*[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF][^\n]*\n/gm, '');

// Category comments at section headers
s = s.replace(
  /\/\/ =====  =====/g,
  '// ===== Physical state category ====='
);
s = s.replace(
  /\/\/ =====  =====/g,
  '// ===== Season & weather category ====='
);
s = s.replace(
  /\/\/ SFW/g,
  '// Added inside existing SFW object'
);
s = s.replace(/\/\/ Used in conjunction with facial expressions and perceptions\n/g, '');
s = s.replace(/\/\/ \n/g, '');

const cjk = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/;
const bad = [];
for (const line of s.split('\n')) {
  if (cjk.test(line)) bad.push(line);
}
if (bad.length) {
  console.error('Lines still containing CJK (first 20):');
  bad.slice(0, 20).forEach((l) => console.error(l.substring(0, 120)));
  console.error('Total:', bad.length);
  process.exit(1);
}

fs.writeFileSync(filePath, s);
console.log('OK', filePath, 'lines with CJK: 0');
