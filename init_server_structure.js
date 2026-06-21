const fs = require('fs');
const path = require('path');

function initializeDirectories() {
  const baseDir = __dirname;
  const dirs = [
    'backend/models',
    'backend/routes',
    'backend/middleware',
    'frontend/src/components',
    'frontend/public',
    'data'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(baseDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created: ${dir}`);
    }
  });
  
  console.log('Initialization complete');
}

initializeDirectories();
