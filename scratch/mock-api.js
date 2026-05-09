const fs = require('fs');
const path = require('path');

const id = 'lecture-02';
try {
  const filePath = path.join(process.cwd(), 'data', `${id}.json`);
  console.log('Path:', filePath);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContent);
  data.chapterId = id;
  console.log('Data:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
} catch (err) {
  console.error('Error:', err.message);
}
