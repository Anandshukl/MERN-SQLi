const fs = require('fs');
const path = require('path');

console.log('Setting up backend server structure...');

const backendPath = path.join(__dirname, '.');
const dirs = ['models', 'routes', 'middleware', 'controllers', 'utils', 'scripts'];

dirs.forEach(dir => {
  const fullPath = path.join(backendPath, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  }
});

console.log('✅ Backend setup complete');
