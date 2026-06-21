const fs = require('fs');
const path = require('path');

function verifyStructure() {
  const requiredDirs = ['src', 'src/components', 'public'];
  const missing = requiredDirs.filter(dir => !fs.existsSync(path.join(__dirname, dir)));
  
  if (missing.length === 0) {
    console.log('✅ Frontend structure is valid');
    return true;
  } else {
    console.log('❌ Missing directories:', missing);
    return false;
  }
}

verifyStructure();
