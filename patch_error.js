const fs = require('fs');
let content = fs.readFileSync('public/index.html', 'utf8');

content = content.replace(
  /errorMsg\.textContent = "エラーが発生しました: " \+ err\.message;/g,
  'errorMsg.textContent = "エラーが発生しました(" + err.code + "): " + err.message;'
);

content = content.replace(
  /errorMsg\.textContent = "ログインに失敗しました。\(" \+ error\.message \+ "\)";/g,
  'errorMsg.textContent = "ログインに失敗しました(" + error.code + "): " + error.message;'
);

// Add a clear indexedDB function just in case indexedDB blocks after logout
const clearIndexedDbBtn = `\n    <button id="clear-cache-btn" style="margin-top: 15px; background: none; border: 1px solid #ccc; padding: 6px 12px; border-radius: 4px; color: #666; font-size: 0.8em; cursor: pointer;">再ログインできない場合はこちらをタップ</button>`;

if (!content.includes('clear-cache-btn')) {
    content = content.replace('</p>', '</p>' + clearIndexedDbBtn);
    
    const clickHandler = `
    document.getElementById('clear-cache-btn').addEventListener('click', async () => {
      try {
        errorMsg.textContent = "キャッシュをクリア中...";
        await auth.signOut();
        const dbs = await window.indexedDB.databases();
        for (const db of dbs) {
          if (db.name.includes('firebase')) {
            window.indexedDB.deleteDatabase(db.name);
          }
        }
        localStorage.clear();
        errorMsg.textContent = "クリアしました。再度ログインボタンを押してください。";
      } catch(e) {
        errorMsg.textContent = "クリア失敗: " + e.message;
      }
    });
    `;
    
    content = content.replace("loginBtn.addEventListener('click'", clickHandler + "\n    loginBtn.addEventListener('click'");
}

fs.writeFileSync('public/index.html', content);
console.log('Patched error messages and added clear cache button');
