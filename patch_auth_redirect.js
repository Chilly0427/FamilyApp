const fs = require('fs');

let sw = fs.readFileSync('public/sw.js', 'utf8');
if (!sw.includes('/__/')) {
  sw = sw.replace(/('securetoken\.googleapis\.com'\)\)) \{/, "$1 || event.request.url.includes('/__/')) {");
  sw = sw.replace(/familyapp-cache-v\d+/g, 'familyapp-cache-v21');
  fs.writeFileSync('public/sw.js', sw);
  console.log('Patched sw.js');
}

let idx = fs.readFileSync('public/index.html', 'utf8');

// The try/catch popup strategy caused issues with PWAs. Replace with simple redirect.
const clickStart = "loginBtn.addEventListener('click'";
const searchArea = idx.substring(idx.indexOf(clickStart));
const clickEnd = searchArea.indexOf('});') + 3;
const fullOldClick = searchArea.substring(0, clickEnd);

const newSignIn = `loginBtn.addEventListener('click', () => {
      errorMsg.textContent = "認証ページへ移動します...";
      // モバイル環境やPWAでの不具合を避けるため、PopupではなくRedirectを強制使用する
      signInWithRedirect(auth, provider).catch((err) => {
        console.error("Redirect error:", err);
        errorMsg.textContent = "エラーが発生しました(" + err.code + "): " + err.message;
      });
    });`;

if (idx.includes(fullOldClick)) {
  idx = idx.replace(fullOldClick, newSignIn);
  fs.writeFileSync('public/index.html', idx);
  console.log('Patched index.html for redirect');
} else {
  console.log('Could not find sign-in block in index.html');
}