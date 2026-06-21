const fs = require('fs');
const path = require('path');

function setupFrontend() {
  const baseDir = __dirname;
  const dirs = ['src', 'src/components', 'src/pages', 'public'];
  
  dirs.forEach(dir => {
    const fullPath = path.join(baseDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created: ${dir}`);
    }
  });
  
  console.log('Frontend setup complete');
}

setupFrontend();
