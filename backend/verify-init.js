const fs = require('fs');
const path = require('path');

function verifyInit() {
  console.log('Verifying backend initialization...');
  
  const requiredFiles = ['server.js', 'package.json', '.env'];
  const requiredDirs = ['models', 'routes', 'middleware'];
  
  let isValid = true;
  
  requiredDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${dir}/`);
    } else {
      console.log(`❌ ${dir}/ - MISSING`);
      isValid = false;
    }
  });
  
  requiredFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - MISSING`);
      isValid = false;
    }
  });
  
  if (isValid) {
    console.log('\n✅ Backend initialization verified');
  } else {
    console.log('\n❌ Some required files are missing');
  }
}

verifyInit();
