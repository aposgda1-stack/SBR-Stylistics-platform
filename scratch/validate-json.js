const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');
console.log('Checking directory:', dataDir);
const files = fs.readdirSync(dataDir);

files.forEach(file => {
  if (file.endsWith('.json')) {
    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    try {
      JSON.parse(content);
      console.log(`✅ ${file} is valid`);
    } catch (err) {
      console.error(`❌ ${file} is INVALID: ${err.message}`);
    }
  }
});
