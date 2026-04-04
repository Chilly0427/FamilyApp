export function initGlobalNav(activePageName) {
  // If we are on a page, save it as the last opened page
  if (activePageName && activePageName !== 'index') {
    localStorage.setItem('lastOpenedPage', activePageName === 'kaimono' ? 'list.html' : activePageName + '.html');
  }

  // ===== ダークモード初期化 =====
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('familyapp-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#1e1e1e' : '#1976d2');
    const icon = document.getElementById('dark-mode-icon');
    if (icon) icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
  }

  const savedTheme = localStorage.getItem('familyapp-theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('familyapp-theme')) applyTheme(e.matches ? 'dark' : 'light');
  });

  const darkCss = `
    /* ===== ダークモード ===== */
    [data-theme="dark"] body { background: #121212 !important; color: #e0e0e0 !important; }
    [data-theme="dark"] header { background: #1e1e1e !important; border-bottom-color: #333 !important; box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important; }
    [data-theme="dark"] header h1 { color: #e0e0e0 !important; }
    [data-theme="dark"] main { color: #e0e0e0; }

    /* カード・セクション */
    [data-theme="dark"] .card { background: #1e1e1e !important; color: #e0e0e0 !important; box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important; }
    [data-theme="dark"] .card .desc { color: #999 !important; }
    [data-theme="dark"] .input-section { background: #1e1e1e !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important; }
    [data-theme="dark"] .input-group label { color: #aaa !important; }

    /* 行・コンテナ */
    [data-theme="dark"] .row { background: #1e1e1e !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important; border-color: #333 !important; }
    [data-theme="dark"] .item-row { background: #1e1e1e !important; border-bottom-color: #333 !important; }
    [data-theme="dark"] .item-row:active { background: #2a2a2a !important; }
    [data-theme="dark"] .item-list { background: #1e1e1e !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important; }
    [data-theme="dark"] .category-title { color: #64b5f6 !important; border-bottom-color: #1a237e !important; }

    /* グループ（sokone） */
    [data-theme="dark"] .group-container { background: #1e1e1e !important; border-color: #333 !important; box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important; }
    [data-theme="dark"] .group-header { background: #263238 !important; }
    [data-theme="dark"] .group-header:active { background: #2e3b41 !important; }
    [data-theme="dark"] .group-content { background: #1a1a1a !important; border-top-color: #333 !important; }
    [data-theme="dark"] .best-price-row { color: #e0e0e0 !important; }
    [data-theme="dark"] .expand-icon { color: #81c784 !important; }

    /* 入力 */
    [data-theme="dark"] input[type=number],
    [data-theme="dark"] input[type=text],
    [data-theme="dark"] input[type=date],
    [data-theme="dark"] .input-group input[type="text"],
    [data-theme="dark"] .input-group select,
    [data-theme="dark"] .emoji-search,
    [data-theme="dark"] select { background: #2a2a2a !important; color: #e0e0e0 !important; border-color: #444 !important; }
    [data-theme="dark"] input::placeholder { color: #777 !important; }
    [data-theme="dark"] input:focus, [data-theme="dark"] select:focus { background-color: #1a2a3a !important; border-color: #42a5f5 !important; }
    [data-theme="dark"] .blocked-input { background-color: #2a2a2a !important; }

    /* ボタン */
    [data-theme="dark"] button { background: #333 !important; color: #e0e0e0 !important; }
    [data-theme="dark"] button:hover { background: #444 !important; }
    [data-theme="dark"] .btn-add, [data-theme="dark"] .btn-add-list { background: #388e3c !important; color: #fff !important; }
    [data-theme="dark"] .btn-add:active, [data-theme="dark"] .btn-add-list:active { background: #2e7d32 !important; }
    [data-theme="dark"] .btn-primary { background: #1565c0 !important; color: #fff !important; }
    [data-theme="dark"] .btn-outline { background: #1e1e1e !important; color: #64b5f6 !important; border-color: #42a5f5 !important; }
    [data-theme="dark"] .btn-danger { background: #c62828 !important; color: #fff !important; }
    [data-theme="dark"] .btn-add-small { background: #263238 !important; border-color: #4caf50 !important; color: #81c784 !important; }
    [data-theme="dark"] .del-btn { color: #ef5350 !important; }
    [data-theme="dark"] .cat-action-btn { color: #aaa !important; }
    [data-theme="dark"] .cat-action-btn:active { background: #333 !important; }
    [data-theme="dark"] .cat-action-btn.danger { color: #ef5350 !important; }
    [data-theme="dark"] .cat-action-btn.warn { color: #ff9800 !important; }

    /* チップ・タブ */
    [data-theme="dark"] .chip { background: #333 !important; color: #ccc !important; }
    [data-theme="dark"] .chip.active { background: #1565c0 !important; color: #fff !important; }
    [data-theme="dark"] .tabs-bar { background: #1e1e1e !important; border-bottom-color: #333 !important; }
    [data-theme="dark"] .tab-item { color: #999 !important; }
    [data-theme="dark"] .tab-item.active { color: #64b5f6 !important; border-bottom-color: #64b5f6 !important; }
    [data-theme="dark"] .tabs-bar.tabs-sorting .tab-item { background: #1a237e !important; border-color: #42a5f5 !important; }
    [data-theme="dark"] .tab-add-btn { color: #64b5f6 !important; }

    /* トグル・チェックボックス */
    [data-theme="dark"] .toggle-btn { background: #2a2a2a !important; color: #999 !important; border-color: #444 !important; }
    [data-theme="dark"] .toggle-btn.active { background: #1565c0 !important; color: #fff !important; border-color: #1565c0 !important; }
    [data-theme="dark"] .checkbox-label { background: #2a2a2a !important; color: #999 !important; border-color: #444 !important; }
    [data-theme="dark"] .checkbox-label.is-discount { background: #3e2723 !important; border-color: #e65100 !important; color: #ffb74d !important; }
    [data-theme="dark"] .checkbox-icon { border-color: #666 !important; }

    /* 合計・結果 */
    [data-theme="dark"] .big { background: #1b3a1b !important; color: #66bb6a !important; }
    [data-theme="dark"] .result { color: #aaa !important; }
    [data-theme="dark"] .legend { background: #2a2a2a !important; color: #aaa !important; }
    [data-theme="dark"] .unit-price { background: #3e2723 !important; border-color: #e65100 !important; }

    /* モーダル */
    [data-theme="dark"] .modal-overlay { background: rgba(0,0,0,0.7) !important; }
    [data-theme="dark"] .modal-box { background: #1e1e1e !important; box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important; }
    [data-theme="dark"] .modal-title { color: #e0e0e0 !important; }
    [data-theme="dark"] .modal-close-btn { color: #aaa !important; }

    /* スナックバー */
    [data-theme="dark"] .undo-snackbar { background: #424242 !important; }

    /* ナビゲーション */
    [data-theme="dark"] .bottom-nav-container { background: #1e1e1e !important; border-top-color: #333 !important; box-shadow: 0 -2px 10px rgba(0,0,0,0.3) !important; }
    [data-theme="dark"] .nav-item { color: #999 !important; }
    [data-theme="dark"] .nav-item.active { color: #64b5f6 !important; }
    [data-theme="dark"] .back-to-top-btn { background: #1565c0 !important; }

    /* ヘルプテキスト */
    [data-theme="dark"] .help-text { background: #1e1e1e !important; color: #999 !important; border-color: #333 !important; }

    /* 完了済み行 */
    [data-theme="dark"] .item-row.done .item-name { color: #666 !important; }
    [data-theme="dark"] .item-row.done .checkbox-icon { background: #1565c0 !important; border-color: #1565c0 !important; }

    /* ドラッグハンドル・サブテキスト */
    [data-theme="dark"] .drag-handle { color: #555 !important; }
    [data-theme="dark"] .clear-btn { background: #444 !important; color: #aaa !important; }
    [data-theme="dark"] .clear-btn:hover { background: #555 !important; }
    [data-theme="dark"] .history-del-btn { color: #666 !important; }
    [data-theme="dark"] .history-row { background: #1a1a1a !important; }

    /* catソート、リスト管理系 */
    [data-theme="dark"] .cat-sort-select { background: #2a2a2a !important; color: #81c784 !important; border-color: #444 !important; }
    [data-theme="dark"] .cat-row { background: #1e1e1e !important; border-bottom-color: #333 !important; }
    [data-theme="dark"] .cat-row .cat-name { color: #e0e0e0 !important; }
    [data-theme="dark"] .list-meta-row { border-bottom-color: #333 !important; }
    [data-theme="dark"] .list-shared-badge { background: #1a237e !important; color: #64b5f6 !important; }
    [data-theme="dark"] .list-shared-badge.private { background: #4a1a2e !important; color: #f48fb1 !important; }
    [data-theme="dark"] .shared-toggle-btn { background: #2a2a2a !important; color: #999 !important; }
    [data-theme="dark"] .shared-toggle-btn.active-shared { background: #1a237e !important; color: #64b5f6 !important; border-color: #42a5f5 !important; }
    [data-theme="dark"] .shared-toggle-btn.active-private { background: #4a1a2e !important; color: #f48fb1 !important; border-color: #c2185b !important; }
    [data-theme="dark"] .icon-opt.selected { border-color: #42a5f5 !important; background: #1a237e !important; }
    [data-theme="dark"] .icon-opt:active { background: #0d47a1 !important; }

    /* ローディング */
    [data-theme="dark"] #loading-overlay { background: #121212 !important; }
    [data-theme="dark"] #loading-overlay div { color: #888 !important; }

    /* ダークモード切替ボタン（ナビ内） */
    .dark-mode-toggle { background: none !important; border: none !important; cursor: pointer; color: #757575; display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; height: 100%; font-size: 0.75em; -webkit-tap-highlight-color: transparent; user-select: none; text-decoration: none; }
    .dark-mode-toggle .icon { font-size: 24px; margin-bottom: 4px; transition: transform 0.2s; line-height: 1; }
    [data-theme="dark"] .dark-mode-toggle { color: #999 !important; }

    /* sokone inline style overrides */
    [data-theme="dark"] .row-calc { color: #ffb74d !important; }
    [data-theme="dark"] .row-top { border-bottom-color: #444 !important; }

    /* focus-within in dark mode */
    [data-theme="dark"] .row:focus-within { background: #263238 !important; border-color: #4caf50 !important; }

    /* インラインstyleの上書き（color/bg） */
    [data-theme="dark"] [style*="color:#aaa"], [data-theme="dark"] [style*="color: #aaa"] { color: #888 !important; }
    [data-theme="dark"] [style*="color:#bbb"], [data-theme="dark"] [style*="color: #bbb"] { color: #777 !important; }
    [data-theme="dark"] [style*="color:#666"], [data-theme="dark"] [style*="color: #666"] { color: #aaa !important; }
    [data-theme="dark"] [style*="color:#888"], [data-theme="dark"] [style*="color: #888"] { color: #999 !important; }
    [data-theme="dark"] [style*="color:#2c3e50"], [data-theme="dark"] [style*="color: #2c3e50"] { color: #e0e0e0 !important; }
    [data-theme="dark"] [style*="background:#e8f5e9"], [data-theme="dark"] [style*="background: #e8f5e9"] { background: #1b3a1b !important; }
    [data-theme="dark"] [style*="color:#2e7d32"], [data-theme="dark"] [style*="color: #2e7d32"] { color: #81c784 !important; }
    [data-theme="dark"] [style*="background:#eee"], [data-theme="dark"] [style*="background: #eee"] { background: #333 !important; }
    [data-theme="dark"] [style*="background:#fff"], [data-theme="dark"] [style*="background: #fff"],
    [data-theme="dark"] [style*="background:white"], [data-theme="dark"] [style*="background: white"] { background: #1e1e1e !important; }
    [data-theme="dark"] [style*="border:1px solid #ccc"], [data-theme="dark"] [style*="border: 1px solid #ccc"] { border-color: #444 !important; }
    [data-theme="dark"] [style*="background:#fafafa"], [data-theme="dark"] [style*="background: #fafafa"] { background: #1a1a1a !important; }
    [data-theme="dark"] [style*="background:#f5f6f8"], [data-theme="dark"] [style*="background: #f5f6f8"] { background: #121212 !important; }
    [data-theme="dark"] [style*="border:1px solid #a5d6a7"] { border-color: #4caf50 !important; }
    [data-theme="dark"] [style*="color:#555"], [data-theme="dark"] [style*="color: #555"] { color: #aaa !important; }
    [data-theme="dark"] [style*="color:#333"], [data-theme="dark"] [style*="color: #333"] { color: #e0e0e0 !important; }
    [data-theme="dark"] [style*="border-bottom:1px solid #eee"] { border-bottom-color: #333 !important; }
    [data-theme="dark"] [style*="border:1px solid #e0e0e0"] { border-color: #333 !important; }
    [data-theme="dark"] [style*="color: red"] { color: #ff5252 !important; }
  `;

  const css = `
    body {
      padding-bottom: 70px !important;
    }
    .bottom-nav-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 65px;
      background: #ffffff;
      border-top: 1px solid #e0e0e0;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 9999;
      padding-bottom: env(safe-area-inset-bottom);
      transition: transform 0.3s ease;
    }
    .bottom-nav-container.nav-hidden {
      transform: translateY(100%);
    }
    .nav-item {
      text-decoration: none;
      color: #757575;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      height: 100%;
      font-size: 0.75em;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }
    .nav-item .icon {
      font-size: 24px;
      margin-bottom: 4px;
      transition: transform 0.2s;
      line-height: 1;
    }
    .nav-item .icon.material-icons {
      font-size: 26px;
    }
    .nav-item.active {
      color: #1976d2;
      font-weight: bold;
    }
    .nav-item.active .icon {
      transform: scale(1.1);
    }
    /* トップ戻るボタン */
    .back-to-top-btn {
      position: fixed;
      bottom: 80px;
      right: 16px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #1976d2;
      color: #fff;
      border: none;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      z-index: 9998;
      display: none;
      align-items: center;
      justify-content: center;
      transition: opacity 0.3s;
    }
    .back-to-top-btn.visible {
      display: flex;
    }
    ${darkCss}
  `;

  if (!document.getElementById('global-nav-style')) {
    const style = document.createElement('style');
    style.id = 'global-nav-style';
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  const navHtml = `
    <div class="bottom-nav-container">
      <a href="kakei.html" class="nav-item ${activePageName === 'kakei' ? 'active' : ''}">
        <span class="icon material-icons">account_balance_wallet</span>
        <span>家計精算</span>
      </a>
      <a href="sokone.html" class="nav-item ${activePageName === 'sokone' ? 'active' : ''}">
        <span class="icon material-icons">local_offer</span>
        <span>底値帳</span>
      </a>
      <a href="list.html" class="nav-item ${activePageName === 'list' || activePageName === 'kaimono' ? 'active' : ''}">
        <span class="icon material-icons">checklist</span>
        <span>リスト</span>
      </a>
      <div id="dark-mode-btn" class="dark-mode-toggle">
        <span id="dark-mode-icon" class="icon material-icons">${document.documentElement.getAttribute('data-theme') === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        <span>表示</span>
      </div>
      <div id="nav-logout-btn" class="nav-item" style="cursor:pointer;">
        <span class="icon material-icons" style="color:#d32f2f;">logout</span>
        <span>ログアウト</span>
      </div>
    </div>
    <button class="back-to-top-btn" id="back-to-top-btn" title="トップへ戻る"><span class="material-icons" style="font-size:20px;">arrow_upward</span></button>
  `;

  // Place it directly into body, ignoring global-nav-placeholder which was in <header>
  if (!document.getElementById('bottom-nav-rendered')) {
    const wrapper = document.createElement('div');
    wrapper.id = 'bottom-nav-rendered';
    wrapper.innerHTML = navHtml;
    document.body.appendChild(wrapper);
  }

  // Remove old hamburger visual if present
  const oldPlaceholder = document.getElementById('global-nav-placeholder');
  if (oldPlaceholder) {
    oldPlaceholder.style.display = 'none';
  }

  // スクロール時ナビ隠し + トップ戻るボタン
  let lastScrollY = window.scrollY;
  let scrollTicking = false;
  const nav = document.querySelector('.bottom-nav-container');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (nav) {
          if (currentScrollY > lastScrollY && currentScrollY > 60) {
            nav.classList.add('nav-hidden');
          } else {
            nav.classList.remove('nav-hidden');
          }
        }
        if (backToTopBtn) {
          if (currentScrollY > 200) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
        }
        lastScrollY = currentScrollY;
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ダークモードトグル
  const darkBtn = document.getElementById('dark-mode-btn');
  if (darkBtn) {
    darkBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Logic for logout
  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const { getAuth, signOut } = await import("https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js");
        const auth = getAuth();
        if (auth) {
          localStorage.removeItem('lastOpenedPage');
          await signOut(auth);
          window.location.href = "index.html";
        }
      } catch(e) {
        console.error("Logout error", e);
      }
    });
  }

  // iOS PWA support
  if (!window.__iosPwaLinkSetup) {
    window.__iosPwaLinkSetup = true;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      document.addEventListener('click', (event) => {
        const a = event.target.closest('a');
        if (a && a.href && !a.hash && a.target !== '_blank') {
          event.preventDefault();
          window.location.href = a.href;
        }
      }, false);
    }
  }
}
