const fs = require('fs');

let sw = fs.readFileSync('public/sw.js', 'utf8');
sw = sw.replace(/event\.request\.url\.includes\('securetoken\.googleapis\.com'\)\s*\|\|\s*event\.request\.url\.includes\('\/__\/'\)\s*\{/, "event.request.url.includes('securetoken.googleapis.com') || event.request.url.includes('/__/')) {");
fs.writeFileSync('public/sw.js', sw);
console.log('Fixed sw.js syntax again');