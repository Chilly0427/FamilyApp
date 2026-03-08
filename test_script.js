  import { initGlobalNav } from './nav.js?v=000309';
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
  import { getFirestore, collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, addDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
  import { firebaseConfig, ALLOWED_EMAILS } from "./firebase-config.js";

  initGlobalNav('zaiko');

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  onAuthStateChanged(auth, (user) => {
    if (user && ALLOWED_EMAILS.includes(user.email)) {
      document.body.style.display = 'block';
      initApp();
    } else {
      window.location.href = "index.html";
    }
  });

  // State
  let categories = [];
  let items = [];

  // DOM Elements
  const tabTriggers = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const listContainer = document.getElementById('list-container');
  const inventoryContainer = document.getElementById('inventory-container');
  const btnClearDone = document.getElementById('btn-clear-done');
  const shopCheckboxes = document.getElementById('shop-checkboxes');
  const shopListContainer = document.getElementById('shop-list-container');
  
  const newItemNameInput = document.getElementById('new-item-name');
  const btnAddItem = document.getElementById('btn-add-item');
  const newShopNameInput = document.getElementById('new-shop-name');
  const btnAddShop = document.getElementById('btn-add-shop');

  // Status mapping
  // 0: たっぷり(🟢), 1: あと少し(🟡), 2: なし(🔴)
  const STATUS_ICONS = { 0: '🟢', 1: '🟡', 2: '🔴' };
  const NEXT_STATUS = { 0: 1, 1: 2, 2: 0 };

  function initApp() {
    // Tab logic
    tabTriggers.forEach(tab => {
      tab.addEventListener('click', () => {
        tabTriggers.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
      });
    });

    // Listen to firestore
    const catsRef = collection(db, 'zaiko_categories');
    const qCats = query(catsRef, orderBy('order', 'asc'));
    onSnapshot(qCats, (snapshot) => {
      categories = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      renderSettings();
      renderInventory();
      renderList();
    });

    const itemsRef = collection(db, 'zaiko_items');
    onSnapshot(itemsRef, (snapshot) => {
      items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      renderInventory();
      renderList();
    });

    // Event listeners
    btnAddShop.addEventListener('click', async () => {
      const name = newShopNameInput.value.trim();
      if (!name) return;
      const order = categories.length > 0 ? Math.max(...categories.map(c => c.order || 0)) + 1 : 0;
      await addDoc(collection(db, 'zaiko_categories'), { name, order });
      newShopNameInput.value = '';
    });

    btnAddItem.addEventListener('click', async () => {
      const name = newItemNameInput.value.trim();
      if (!name) {
         alert('アイテム名を入力してください');
         return;
      }
      const selectedShops = Array.from(shopCheckboxes.querySelectorAll('.selected')).map(el => el.dataset.shopId);
      if (selectedShops.length === 0) {
         alert('ショップを選択してください');
         return;
      }
      await addDoc(collection(db, 'zaiko_items'), {
        name,
        status: 0, // 0:たっぷり
        shopIds: selectedShops,
        isDone: false
      });
      newItemNameInput.value = '';
      shopCheckboxes.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
      alert('追加しました！');
    });

    btnClearDone.addEventListener('click', async () => {
      if(!confirm('取り消し線がついたアイテムを全て「たっぷり(🟢)」に戻しますか？')) return;
      
      const doneItems = items.filter(item => item.isDone && (item.status === 1 || item.status === 2));
      for (const item of doneItems) {
        await updateDoc(doc(db, 'zaiko_items', item.id), {
          status: 0,
          isDone: false
        });
      }
    });

    // Checkbox toggling delegation
    shopCheckboxes.addEventListener('click', (e) => {
      if(e.target.classList.contains('checkbox-item')) {
        e.target.classList.toggle('selected');
      }
    });
  }

  window.toggleItemDone = async function(itemId, currentState) {
    await updateDoc(doc(db, 'zaiko_items', itemId), {
      isDone: !currentState
    });
  };

  window.cycleItemStatus = async function(itemId, currentStatus) {
    const next = NEXT_STATUS[currentStatus];
    await updateDoc(doc(db, 'zaiko_items', itemId), {
      status: next,
      isDone: false // ステータスが変わったら完了状態解除
    });
  };

  window.deleteItem = async function(itemId) {
    if(confirm('このアイテムを削除しますか？')) {
      await deleteDoc(doc(db, 'zaiko_items', itemId));
    }
  };

  window.deleteCategory = async function(catId) {
    if(confirm('このショップを削除しますか？紐づくアイテムは表示されなくなります。')) {
      await deleteDoc(doc(db, 'zaiko_categories', catId));
    }
  };

  function renderList() {
    listContainer.innerHTML = '';
    let hasDone = false;
    
    categories.forEach(cat => {
      // 🟡か🔴のアイテムのみ
      const catItems = items.filter(i => (i.status === 1 || i.status === 2) && i.shopIds && i.shopIds.includes(cat.id));
      if(catItems.length === 0) return;

      const shopSection = document.createElement('div');
      shopSection.className = 'shop-section';
      shopSection.innerHTML = `<div class="shop-title"><span>🛒</span> ${escapeHtml(cat.name)}</div>`;
      
      catItems.forEach(item => {
        if(item.isDone) hasDone = true;
        
        const row = document.createElement('div');
        row.className = \`item-row \${item.isDone ? 'done' : ''}\`;
        
        row.innerHTML = \`
          <div class="item-name" onclick="toggleItemDone('\${item.id}', \${item.isDone})">
            \${escapeHtml(item.name)}
          </div>
          <div class="status-indicator" onclick="cycleItemStatus('\${item.id}', \${item.status})">
            <span>\${STATUS_ICONS[item.status]}</span>
          </div>
        \`;
        shopSection.appendChild(row);
      });
      listContainer.appendChild(shopSection);
    });

    if(listContainer.innerHTML === '') {
      listContainer.innerHTML = '<div style="text-align:center; color:#999; margin-top:40px;">買うべきものはありません 🎉</div>';
    }

    btnClearDone.style.display = hasDone ? 'block' : 'none';
  }

  function renderInventory() {
    inventoryContainer.innerHTML = '';
    
    categories.forEach(cat => {
      const catItems = items.filter(i => i.shopIds && i.shopIds.includes(cat.id));
      if(catItems.length === 0) return;

      const shopSection = document.createElement('div');
      shopSection.className = 'shop-section';
      shopSection.innerHTML = `<div class="shop-title"><span>🛒</span> ${escapeHtml(cat.name)}</div>`;
      
      catItems.forEach(item => {
        const row = document.createElement('div');
        row.className = 'item-row';
        
        row.innerHTML = \`
          <div class="item-name">
            \${escapeHtml(item.name)}
          </div>
          <div class="status-indicator" onclick="cycleItemStatus('\${item.id}', \${item.status})">
            <span>\${STATUS_ICONS[item.status]}</span>
          </div>
        \`;
        shopSection.appendChild(row);
      });
      inventoryContainer.appendChild(shopSection);
    });

    if(inventoryContainer.innerHTML === '') {
      inventoryContainer.innerHTML = '<div style="text-align:center; color:#999; margin-top:40px;">カテゴリとアイテムを追加してください</div>';
    }
  }

  function renderSettings() {
    // Categories for new items checkbox
    const currentSelections = Array.from(shopCheckboxes.querySelectorAll('.selected')).map(el => el.dataset.shopId);
    shopCheckboxes.innerHTML = categories.map(cat => {
      const isSelected = currentSelections.includes(cat.id) ? 'selected' : '';
      return \`<div class="checkbox-item \${isSelected}" data-shop-id="\${cat.id}">\${escapeHtml(cat.name)}</div>\`;
    }).join('');

    // Categories list for management
    shopListContainer.innerHTML = categories.map(cat => \`
      <div class="list-item">
        <span>\${escapeHtml(cat.name)}</span>
        <button class="delete-btn" onclick="deleteCategory('\${cat.id}')">✖</button>
      </div>
    \`).join('');
    
    // Add Item management
    const allItemsDiv = document.createElement('div');
    allItemsDiv.style.marginTop = '32px';
    allItemsDiv.innerHTML = '<h3>📦 アイテムの管理</h3>';
    items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'list-item';
      row.innerHTML = \`
        <span>\${escapeHtml(item.name)}</span>
        <button class="delete-btn" onclick="deleteItem('\${item.id}')">削除</button>
      \`;
      allItemsDiv.appendChild(row);
    });
    
    // ensure we don't append indefinitely
    const oldAll = document.getElementById('all-items-admin');
    if(oldAll) oldAll.remove();
    allItemsDiv.id = 'all-items-admin';
    shopListContainer.parentNode.appendChild(allItemsDiv);
  }

  function escapeHtml(str) {
    if(!str) return '';
    return str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

