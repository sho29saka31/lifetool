# Life-Tool セットアップガイド

## 📋 概要

Life-Toolは完全にローカルで動作する静的サイトです。GitHub Pagesでホスティングし、Google OAuth 2.0を使用してGoogle Driveと同期できます。

---

## 🚀 ステップ1: GitHub Pagesへのデプロイ

### 1.1 GitHubリポジトリの作成

1. GitHubにログイン
2. 新しいリポジトリを作成（例: `lifetool`）
3. リポジトリをpublicに設定

### 1.2 ファイルのアップロード

```bash
# ローカルでリポジトリをクローン
git clone https://github.com/sho29saka31/lifetool.git
cd lifetool

# lifetoolフォルダの中身をすべてコピー
# index.html、core/、common/、features/、assets/ をルートに配置

# コミット & プッシュ
git add .
git commit -m "Initial commit: Life-Tool v1.0"
git push origin main
```

### 1.3 GitHub Pagesの有効化

1. リポジトリの **Settings** へ移動
2. 左メニューから **Pages** を選択
3. **Source** を `main` ブランチ、`/ (root)` に設定
4. **Save** をクリック
5. 数分後、`https://sho29saka31.github.io/lifetool/` でアクセス可能

---

## 🔐 ステップ2: Google OAuth 2.0の設定

Google Driveとの同期機能を有効にするため、Google Cloud Consoleで設定が必要です。

### 2.1 Google Cloud Projectの作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（例: `Life-Tool`）
3. プロジェクトを選択

### 2.2 Google Drive APIの有効化

1. 左メニューから **APIとサービス** > **ライブラリ** を選択
2. 「Google Drive API」を検索
3. **有効にする** をクリック

### 2.3 OAuth 2.0認証情報の作成

#### APIキーの作成

1. **APIとサービス** > **認証情報** を選択
2. **認証情報を作成** > **APIキー** をクリック
3. 作成されたAPIキーをコピーして保存

#### OAuth 2.0クライアントIDの作成

1. **認証情報を作成** > **OAuthクライアントID** をクリック
2. 初回の場合、**同意画面を構成** が必要
   - ユーザータイプ: **外部**
   - アプリ名: `Life-Tool`
   - ユーザーサポートメール: あなたのメールアドレス
   - 承認済みドメイン: `github.io`
   - 開発者の連絡先情報: あなたのメールアドレス
   - **保存して次へ**
   
3. スコープの追加
   - **スコープを追加または削除**
   - `.../auth/drive.appdata` を検索して追加
   - **保存して次へ**

4. テストユーザーの追加（開発中のみ）
   - 自分のGoogleアカウントを追加
   - **保存して次へ**

5. OAuthクライアントIDの作成に戻る
   - アプリケーションの種類: **ウェブアプリケーション**
   - 名前: `Life-Tool Web Client`
   - 承認済みのJavaScript生成元:
     ```
     https://sho29saka31.github.io
     ```
   - 承認済みのリダイレクトURI:
     ```
     https://sho29saka31.github.io/lifetool/
     ```
   - **作成** をクリック

6. **クライアントID** と **クライアントシークレット** をコピーして保存

### 2.4 認証情報をコードに反映

`core/auth.js` ファイルを編集：

```javascript
// Before (行24-25)
clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
apiKey: 'YOUR_API_KEY',

// After
clientId: '実際のクライアントID.apps.googleusercontent.com',
apiKey: '実際のAPIキー',
```

変更後、GitHubにプッシュ：

```bash
git add core/auth.js
git commit -m "Add Google OAuth credentials"
git push origin main
```

---

## 🔑 ステップ3: 外部APIキーの設定（オプション）

Life-Toolの一部機能は外部APIを使用します。これらは**ユーザー自身が取得**して設定します。

### 3.1 サポートされているAPI

| API | 用途 | 無料枠 | 取得先 |
|-----|------|--------|--------|
| OpenAI | AIチャット、文章リライト | 試用可能 | [platform.openai.com](https://platform.openai.com) |
| Anthropic | Claude API | 試用可能 | [console.anthropic.com](https://console.anthropic.com) |
| OpenWeatherMap | 天気予報、洗濯指数 | 1日1000回 | [openweathermap.org/api](https://openweathermap.org/api) |
| NASA | 宇宙天気、ISS追跡 | 無制限 | [api.nasa.gov](https://api.nasa.gov) |
| ExchangeRate | 通貨換算 | 月1500回 | [exchangerate-api.com](https://www.exchangerate-api.com) |
| Google Maps | 住所変換 | 月$200分 | [console.cloud.google.com](https://console.cloud.google.com) |

### 3.2 APIキーの設定方法

1. Life-Toolサイトを開く
2. ヘッダーの**ハンバーガーメニュー**（☰）をクリック
3. **システム・基本機能** > **APIキー管理マネージャー** を選択
4. 各APIの **設定** ボタンをクリックして、APIキーを入力
5. **保存** をクリック

**重要**: APIキーはブラウザのLocalStorageにのみ保存され、サーバーには送信されません。

---

## ✅ ステップ4: 動作確認

### 4.1 基本機能の確認

1. サイトにアクセス
2. ヘッダーが正しく表示されているか
3. 検索窓（Cmd+K）が動作するか
4. テーマ切替（🌙/☀️）が動作するか

### 4.2 ストレージの確認

1. ブラウザのデベロッパーツールを開く（F12）
2. **Application** タブ > **IndexedDB** > **LifeToolDB**
3. 各ストアが作成されているか確認

### 4.3 Google連携の確認

1. ヘッダーの **Googleでログイン** ボタンをクリック
2. Googleアカウントでログイン
3. 権限の承認
4. ログイン状態が表示されるか確認

---

## 🛠️ トラブルシューティング

### Google OAuth エラー

**エラー**: `redirect_uri_mismatch`

**解決策**:
- Google Cloud Consoleの**承認済みのリダイレクトURI**が正確か確認
- URLの末尾の `/` に注意（あり/なし）
- `http` ではなく `https` であることを確認

**エラー**: `idpiframe_initialization_failed`

**解決策**:
- サードパーティCookieがブロックされている可能性
- ブラウザの設定で `accounts.google.com` のCookieを許可

### IndexedDB エラー

**エラー**: `VersionError` or `InvalidStateError`

**解決策**:
- ブラウザのデベロッパーツールで IndexedDB を削除
- ページを再読み込み
- データがある場合は、事前にエクスポートしておく

### GitHub Pages 404エラー

**解決策**:
- ファイルが正しくプッシュされているか確認
- GitHub Pages の設定が `main` ブランチ、`/ (root)` になっているか確認
- 数分待ってからアクセスし直す

---

## 📚 次のステップ

基盤ができたので、次は**500機能の実装**に進みます！

### おすすめの開発順序

1. **システム基本機能** (No.1-6)
   - 魔法の入力窓 (Command Bar)
   - APIキー管理マネージャー
   - テーマエンジン
   - PWA対応

2. **人気の生産性ツール** (No.15-21)
   - TODO・習慣トラッカー
   - QRコード生成
   - パスワード生成

3. **AI連携機能** (No.7-10)
   - AIチャット
   - 文章リライター

4. **その他の機能** (No.22-500)
   - ユーザーの希望に応じて順次実装

---

## 💡 開発のヒント

### 新機能の追加方法

1. `features/カテゴリ名/機能名/` フォルダを作成
2. `index.html`, `script.js`, `style.css` を作成
3. `common/header.js` の検索データに追加

### テンプレート

次回以降、各機能のテンプレートコードを提供します。

---

## 📞 サポート

質問や問題があれば、いつでもお知らせください！
一緒に素晴らしいLife-Toolを作りましょう 🚀

---

**作成日**: 2025年2月5日
**バージョン**: 1.0.0