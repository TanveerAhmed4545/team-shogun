const fs = require('fs');
const path = require('path');

const OLD_NAME = '/logo.png';
const NEW_NAME = '/shogun-logo.png';

// Rename the file
const oldPath = path.join(__dirname, 'public', 'logo.png');
const newPath = path.join(__dirname, 'public', 'shogun-logo.png');

if (fs.existsSync(oldPath)) {
  fs.renameSync(oldPath, newPath);
  console.log('Renamed public/logo.png to public/shogun-logo.png');
}

// Update all references in the code
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        walk(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(OLD_NAME)) {
        content = content.replace(new RegExp(OLD_NAME, 'g'), NEW_NAME);
        fs.writeFileSync(fullPath, content);
        console.log('Updated:', fullPath);
      }
    }
  }
}

walk(path.join(__dirname, 'app'));
walk(path.join(__dirname, 'components'));

console.log('Done cache busting the logo!');
