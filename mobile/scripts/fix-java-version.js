/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');

// Paths to files that need Java version fix
const filesToFix = [
  'node_modules/@capacitor/android/capacitor/build.gradle',
  'android/app/capacitor.build.gradle'
];

const rootDir = path.join(__dirname, '..');

filesToFix.forEach(filePath => {
  const fullPath = path.join(rootDir, filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace VERSION_21 with VERSION_17
    const updated = content.replaceAll(/JavaVersion\.VERSION_21/g, 'JavaVersion.VERSION_17');
    
    if (content !== updated) {
      fs.writeFileSync(fullPath, updated, 'utf8');
      console.log(`✓ Fixed Java version in ${filePath}`);
    } else {
      console.log(`✓ Java version already correct in ${filePath}`);
    }
  } else {
    console.log(`⚠ File not found: ${filePath}`);
  }
});

console.log('\n✓ Java version fix completed');
