export function initGlobalNav(activePageName) {
  const css = `
    .global-nav-container {
      position: relative;
    }
    .hamburger-btn {
      background: none;
      border: none;
      font-size: 1.8em;
      cursor: pointer;
      color: #333;
      padding: 0;
      line-height: 1;
    }
    .nav-menu {
      display: none;
      position: absolute;
      right: 0;
      top: 40px;
      background: #fff;
      border: 1px solid #e0e0e0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-radius: 8px;
      z-index: 9999;
      width: 180px;
      text-align: left;
      overflow: hidden;
      font-weight: normal;
    }
    .nav-menu a, .nav-menu button.menu-item {
      display: block !important;
      width: 100%;
      text-align: left;
      padding: 12px 16px !important;
      text-decoration: none !important;
      color: #333 !important;
      border: none;
      border-bottom: 1px solid #eee;
      font-size: 1em !important;
      font-weight: normal !important;
      background: transparent !important;
      border-radius: 0 !important;
      margin: 0 !important;
      cursor: pointer;
      box-sizing: border-box;
      font-family: inherit;
    }
    .nav-menu *:last-child {
      border-bottom: none;
    }
    .nav-menu .active {
      background: #f0f8ff !important;
      font-weight: bold !important;
    }
    .nav-menu a:hover, .nav-menu button.menu-item:hover {
      background: #f5f5f5 !important;
    }
    .nav-menu-right-aligned {
      right: 0 !important;
    }
  `;

  // Inject CSS
  if (!document.getElementById('global-nav-style')) {
    const style = document.createElement('style');
    style.id = 'global-nav-style';
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  // Create menu HTML
  const navHtml = `
    <div class="global-nav-container">
      <button id="hamburger-btn" class="hamburger-btn">☰</button>
      <div id="nav-menu" class="nav-menu">
        <a href="index.html" class="${activePageName === 'index' ? 'active' : ''}">🏠 トップ ${activePageName === 'index' ? '📌' : ''}</a>
        <a href="kakei.html" class="${activePageName === 'kakei' ? 'active' : ''}">💰 家計精算 ${activePageName === 'kakei' ? '📌' : ''}</a>
        <a href="sokone.html" class="${activePageName === 'sokone' ? 'active' : ''}">🛒 底値帳 ${activePageName === 'sokone' ? '📌' : ''}</a>
        <button id="nav-logout-btn" class="menu-item" style="color:#d32f2f !important;">🚪 ログアウト</button>
      </div>
    </div>
  `;

  // Identify placeholder
  const placeholder = document.getElementById('global-nav-placeholder');
  if (placeholder) {
    placeholder.innerHTML = navHtml;
  }

  // Logic
  const menu = document.getElementById('nav-menu');
  const btn = document.getElementById('hamburger-btn');
  const logoutBtn = document.getElementById('nav-logout-btn');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
    });

    document.addEventListener('click', (e) => {
      if (menu.style.display === 'block' && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = 'none';
      }
    });
  }

  // Attempt to load auth and trigger logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const { getAuth, signOut } = await import("https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js");
        const auth = getAuth();
        if (auth) {
          await signOut(auth);
          window.location.href = "index.html";
        }
      } catch(e) {
        console.error("Logout error", e);
      }
    });
  }

  // iOS PWAでのリンク遷移不具合（無反応やSafariへの強制遷移）を防止
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
