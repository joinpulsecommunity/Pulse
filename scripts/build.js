// Copies the public site into dist/ so only site files are deployed.
const fs = require('fs');
const path = require('path');

const out = 'dist';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);

for (const item of ['index.html', 'css', 'js', 'assets', 'content', 'admin']) {
  if (fs.existsSync(item)) fs.cpSync(item, path.join(out, item), { recursive: true });
}
console.log('Site copied to dist/');
