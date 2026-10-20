const fs = require('fs');
const file = 'src/app/place/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/fontWeight:\s*900/g, 'fontWeight: 700');
content = content.replace(/fontWeight:\s*800/g, 'fontWeight: 600');
content = content.replace(/border:\s*1\.5px/g, 'border: 1px');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully normalized weights and borders in', file);
