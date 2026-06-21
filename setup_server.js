#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create server directories
const serverPath = path.join(__dirname, 'server');
const dirs = ['models', 'routes', 'controllers', 'middleware', 'utils', 'python'];

dirs.forEach(dir => {
  const dirPath = path.join(serverPath, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created: ${dirPath}`);
  }
});

console.log('✅ Server initialization complete');
