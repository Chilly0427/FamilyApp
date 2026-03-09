const fs = require('fs');

let idx = fs.readFileSync('public/index.html', 'utf8');

// The argument-error is because initializeAuth might conflict with the default imports, or popupRedirectResolver was passed incorrectly.
// Let's revert back to standard getAuth but apply setPersistence with indexedDB manually without overwriting initializeApp defaults, which avoids argument errors on specific platforms.

idx = idx.replace(
  /import \{ initializeAuth[^;]*firebase-auth\.js";/,
  `import { getAuth, setPersistence, indexedDBLocalPersistence, browserLocalPersistence, signInWithRedirect, getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";`
);

idx = idx.replace(
  /const auth = initializeAuth\(app, \{[\s\S]*?\}\);/,
  `const auth = getAuth(app);\n    setPersistence(auth, indexedDBLocalPersistence).catch(() => setPersistence(auth, browserLocalPersistence));`
);

// We need to make sure we also fix `kakei.html`, `sokone.html`, `kaimono.html` which use initializeAuth
const files = ['public/kakei.html', 'public/kaimono.html', 'public/sokone.html'];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /import \{ initializeAuth[^;]*firebase-auth\.js";/,
    `import { getAuth, setPersistence, indexedDBLocalPersistence, browserLocalPersistence, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";`
  );
  content = content.replace(
    /const auth = initializeAuth\(app, \{[\s\S]*?\}\);/,
    `const auth = getAuth(app);\n  setPersistence(auth, indexedDBLocalPersistence).catch(() => setPersistence(auth, browserLocalPersistence));`
  );
  fs.writeFileSync(file, content);
}

fs.writeFileSync('public/index.html', idx);
console.log('Fixed auth logic to getAuth with explicit setPersistence');