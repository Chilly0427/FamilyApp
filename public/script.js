// Firebaseプロジェクトの設定情報をここに入力してください
// Firebase Consoleのプロジェクト設定ページで「ウェブアプリにFirebaseを追加」から取得できます。
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjMS3fQNYtg2c3QChfCGCMsUDqzqTZjkA",
  authDomain: "familyapp-bd103.firebaseapp.com",
  projectId: "familyapp-bd103",
  storageBucket: "familyapp-bd103.firebasestorage.app",
  messagingSenderId: "673885915559",
  appId: "1:673885915559:web:9ba52b471349ebce2d4e82",
  measurementId: "G-SRCXMBNSDS"
};

// Firebaseを初期化
firebase.initializeApp(firebaseConfig);

// Firebase Authenticationのインスタンスを取得
const auth = firebase.auth();

// FirebaseUIの構成設定
const uiConfig = {
    signInSuccessUrl: '/', // 認証成功時のリダイレクト先URL (同じページにリダイレクト)
    signInOptions: [
        // サポートする認証プロバイダをここに記述します
        // Firebase Consoleで有効にするのを忘れないでください！
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    ],
    // 利用規約やプライバシーポリシーのURLを設定する場合
    // tosUrl: '<your-tos-url>',
    // privacyPolicyUrl: '<your-privacy-policy-url>'
};

// FirebaseUIのインスタンスを初期化
const ui = new firebaseui.auth.AuthUI(auth);

// DOM要素の参照
const firebaseuiAuthContainer = document.getElementById('firebaseui-auth-container');
const userInfoDiv = document.getElementById('user-info');
const userEmailSpan = document.getElementById('user-email');
const userUidSpan = document.getElementById('user-uid');
const signOutButton = document.getElementById('sign-out-button');
const loadingMessage = document.getElementById('loading-message');

// 認証状態の変更を監視
auth.onAuthStateChanged((user) => {
    loadingMessage.classList.add('hidden'); // ローディングメッセージを非表示にする

    if (user) {
        // ユーザーがログインしている場合
        firebaseuiAuthContainer.classList.add('hidden'); // 認証UIを非表示にする
        userInfoDiv.classList.remove('hidden'); // ユーザー情報表示エリアを表示する

        userEmailSpan.textContent = user.email;
        userUidSpan.textContent = user.uid;

        console.log("ユーザーがログインしました:", user);
    } else {
        // ユーザーがログインしていない場合
        userInfoDiv.classList.add('hidden'); // ユーザー情報表示エリアを非表示にする
        firebaseuiAuthContainer.classList.remove('hidden'); // 認証UIを表示する

        // FirebaseUIをレンダリングして認証フローを開始
        ui.start('#firebaseui-auth-container', uiConfig);

        console.log("ユーザーはログインしていません。");
    }
});

// サインアウトボタンのイベントリスナー
signOutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
        console.log("ユーザーがサインアウトしました。");
        // サインアウト後の追加処理があればここに記述
    }).catch((error) => {
        console.error("サインアウト中にエラーが発生しました:", error);
    });
});

