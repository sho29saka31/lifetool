# 🌟 Life-Tool

**あなただけのパーソナルOS体験**

Life-Toolは、GitHub Pagesでホストされる完全静的なWebアプリケーションでありながら、500以上の機能を持つ「サーバーレスOS」です。データはすべてあなたのブラウザとGoogle Driveにのみ保存され、プライバシーとセキュリティを最優先に設計されています。

---

## ✨ 特徴

### 🔒 完全ローカル・パーソナル
- データは開発者のサーバーに送信されません
- すべてブラウザのIndexedDBとGoogle Driveに保存
- あなただけのデータ、あなただけの管理

### 🔑 BYOK (Bring Your Own Key)
- AI等の有料API機能は、あなた自身のAPIキーで利用
- APIキーはブラウザのLocalStorageにのみ保存
- 使用量・コストもあなた自身が管理

### 🎨 500以上の機能
- **システム**: PWA対応、テーマ切替、API管理
- **生産性**: TODO、ノート、QRコード、パスワード生成
- **AI**: チャット、文章リライト、要約、アイデア支援
- **メンタル**: ストレス解消、集中タイマー、感謝日記
- **ライフ**: 家計簿、調理補助、健康管理
- **クリエイティブ**: 配色提案、SVG作成、アイデア発想
- **その他**: 宇宙データ、歴史検索、遊び心のある演出

---

## 🚀 クイックスタート

### 必要なもの
- GitHubアカウント
- Googleアカウント（Drive同期用）
- モダンなWebブラウザ

### インストール

```bash
# 1. リポジトリをクローン
git clone https://github.com/your-username/lifetool.git
cd lifetool

# 2. ファイルを確認
ls
# index.html  core/  common/  features/  assets/

# 3. GitHubにプッシュ
git add .
git commit -m "Initial commit"
git push origin main

# 4. GitHub Pagesを有効化
# Settings > Pages > Source: main branch, / (root)
```

### セットアップ

詳細は [SETUP_GUIDE.md](./SETUP_GUIDE.md) を参照してください。

1. Google Cloud ConsoleでOAuth 2.0を設定
2. `core/auth.js` にClient IDとAPI Keyを設定
3. サイトにアクセスしてログイン
4. 各機能に必要なAPIキーを設定（オプション）

---

## 📂 ディレクトリ構造

```
lifetool/
├── index.html              # メインハブページ
├── core/                   # コアシステム
│   ├── auth.js             # Google OAuth & Drive同期
│   ├── storage.js          # IndexedDBラッパー
│   └── api-manager.js      # APIキー管理
├── common/                 # 共通コンポーネント
│   ├── header.js           # ヘッダー（検索・ナビ）
│   └── footer.js           # フッター（ステータス）
├── features/               # 500機能
│   ├── system/             # システム機能
│   ├── productivity/       # 生産性ツール
│   ├── ai/                 # AI連携
│   ├── mental/             # メンタルケア
│   ├── life/               # ライフマネジメント
│   ├── creative/           # クリエイティブ
│   └── ...                 # その他
└── assets/                 # 画像・フォント
```

---

## 🛠️ 技術スタック

- **Frontend**: Pure HTML, CSS, JavaScript (フレームワーク不使用)
- **Storage**: IndexedDB (Dexie.js不使用のネイティブAPI)
- **Auth**: Google OAuth 2.0
- **Sync**: Google Drive API (App Data Folder)
- **Hosting**: GitHub Pages
- **APIs**: OpenAI, Anthropic, OpenWeatherMap, NASA等（ユーザー提供）

---

## 🎯 開発の原則

### 1. 完全静的
- サーバーサイドの処理なし
- すべてブラウザ内で完結
- GitHub Pagesで動作

### 2. モジュラー設計
- 各機能は独立した`features/`内のフォルダ
- 相互依存を最小化
- プラグイン的に追加可能

### 3. プライバシー第一
- データは外部サーバーに送信しない
- APIキーはローカルストレージのみ
- Google Driveは暗号化された「App Data」フォルダを使用

---

## 📱 対応機能（一部）

### システム・基本
- [x] ローカルオートセーブ
- [x] APIキー管理
- [x] テーマエンジン
- [ ] PWA対応
- [ ] 通知センター

### 生産性
- [ ] TODO・習慣トラッカー
- [ ] Markdownエディタ
- [ ] QRコード生成
- [ ] パスワード生成

### AI連携
- [ ] AIチャット
- [ ] 文章リライター
- [ ] デジタルクローン

### メンタル
- [ ] ストレスシュレッダー
- [ ] 集中タイマー
- [ ] 感謝の3行日記

*（全500機能の一覧は `Life-Tool追加コンテンツ一覧` を参照）*

---

## 🤝 開発への参加

このプロジェクトは**ユーザーとAIの共同開発**です。

### フィードバック歓迎
- 機能のリクエスト
- バグ報告
- UI/UX改善提案

### 開発への貢献
- 第三者によるソースコード変更は受け入れません
- ただし、意見やアイデアは大歓迎です
- ユーザーとAIが協議して実装を決定します

---

## 📄 ライセンス

MIT License

---

## 🙏 謝辞

このプロジェクトは以下の技術・サービスを活用しています：

- GitHub Pages
- Google APIs
- OpenAI / Anthropic APIs
- NASA Open APIs
- OpenWeatherMap
- その他オープンソースプロジェクト

---

## 📞 サポート

質問や問題があれば、Issueを作成してください。

---

**Built with ❤️ by You & AI**

🚀 Let's build your personal OS together!