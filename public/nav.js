export function initGlobalNav(activePageName) {
  // If we are on a page, save it as the last opened page
  if (activePageName && activePageName !== 'index') {
    localStorage.setItem('lastOpenedPage', activePageName === 'kaimono' ? 'list.html' : activePageName + '.html');
  }

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
        <span class="icon">💰</span>
        <span>家計簿</span>
      </a>
      <a href="sokone.html" class="nav-item ${activePageName === 'sokone' ? 'active' : ''}">
        <span class="icon">🏷️</span>
        <span>底値帳</span>
      </a>
      <a href="list.html" class="nav-item ${activePageName === 'list' || activePageName === 'kaimono' ? 'active' : ''}">
        <span class="icon">📋</span>
        <span>リスト</span>
      </a>
      <div id="nav-logout-btn" class="nav-item" style="cursor:pointer;">
        <span class="icon" style="color:#d32f2f;">🚪</span>
        <span>ログアウト</span>
      </div>
    </div>
    <button class="back-to-top-btn" id="back-to-top-btn" title="トップへ戻る">↑</button>
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
