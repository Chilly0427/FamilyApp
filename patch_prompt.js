const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

// Add provider custom parameters for select_account
const authInitStr = `const provider = new GoogleAuthProvider();`;
const authInitReplace = `const provider = new GoogleAuthProvider();\n    provider.setCustomParameters({ prompt: 'select_account' });`;

if (content.includes(authInitStr) && !content.includes(`prompt: 'select_account'`)) {
  content = content.replace(authInitStr, authInitReplace);
  fs.writeFileSync('public/index.html', content);
  console.log('Patched index.html with prompt: select_account');
} else {
  console.log('Already patched or not found');
}