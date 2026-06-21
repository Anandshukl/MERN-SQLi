const fs = require('fs');
const path = require('path');

const dirs = ['src/components', 'src/pages', 'public'];
dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created: ${dir}`);
  }
});
console.log('Frontend structure verified');
