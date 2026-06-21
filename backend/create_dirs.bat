const fs = require('fs');
const path = require('path');

function setupServer() {
  const dirs = ['models', 'routes', 'middleware', 'controllers', 'utils'];
  const basePath = __dirname;
  
  dirs.forEach(dir => {
    const fullPath = path.join(basePath, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created: ${dir}`);
    }
  });
  
  console.log('Server setup complete');
}

setupServer();
