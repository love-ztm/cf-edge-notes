import { blogHomeHtml } from './_homeHtml_check.mjs';
import fs from 'fs';
const m = blogHomeHtml.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('NO SCRIPT'); process.exit(1); }
fs.writeFileSync('_check.js', m[1]);
console.log('len', m[1].length);
