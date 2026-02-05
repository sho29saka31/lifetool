/**
 * Life-Tool Router
 * Simple hash-based routing for single-page application
 */

const LifeToolRouter = {
    currentPage: 'home',
    routes: {},
    
    /**
     * Initialize router
     */
    init() {
        // Define routes
        this.routes = {
            'home': this.renderHome,
            'features': this.renderFeatures,
            'settings': this.renderSettings,
            'help': this.renderHelp,
            'system': () => this.renderCategory('system', 'システム・基本機能'),
            'ai': () => this.renderCategory('ai', 'AI・外部連携'),
            'productivity': () => this.renderCategory('productivity', '生産性・ツール'),
            'mental': () => this.renderCategory('mental', 'メンタル・意思決定'),
            'life': () => this.renderCategory('life', 'ライフマネジメント'),
            'creative': () => this.renderCategory('creative', '思考・クリエイティブ'),
            'health': () => this.renderCategory('health', '健康・運動'),
            'money': () => this.renderCategory('money', 'マネー・資産'),
            'tech': () => this.renderCategory('tech', 'テック・開発'),
            'misc': () => this.renderCategory('misc', 'その他・遊び')
        };
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Handle initial route
        this.handleRoute();
        
        console.log('Router initialized');
    },
    
    /**
     * Handle route change
     */
    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        this.navigateTo(hash);
    },
    
    /**
     * Navigate to a page
     */
    navigateTo(page) {
        const route = this.routes[page];
        
        if (route) {
            this.currentPage = page;
            route.call(this);
            
            // Close hamburger menu if open
            const menu = document.getElementById('hamburger-menu');
            if (menu) {
                menu.classList.remove('active');
            }
            
            // Scroll to top
            window.scrollTo(0, 0);
        } else {
            console.warn(`Route not found: ${page}`);
            this.navigateTo('home');
        }
    },
    
    /**
     * Render home page
     */
    renderHome() {
        const container = document.querySelector('.main-container');
        if (!container) return;
        
        container.innerHTML = `
            <!-- Hero Section -->
            <section class="hero">
                <h1>Life-Tool</h1>
                <p>あなただけのパーソナルOS体験。500以上の機能で、あなたの生活をスマートに。</p>
            </section>
            
            <!-- Status Banner -->
            <div class="status-banner">
                <div class="status-info">
                    <div class="status-item">
                        <div class="status-dot"></div>
                        <span id="auth-status">ログイン状態: 未ログイン</span>
                    </div>
                    <div class="status-item">
                        <div class="status-dot" style="background: #f59e0b;"></div>
                        <span id="sync-status">同期: オフライン</span>
                    </div>
                    <div class="status-item">
                        <div class="status-dot" style="background: #3b82f6;"></div>
                        <span id="storage-status">ストレージ: 準備完了</span>
                    </div>
                </div>
                <div>
                    <button id="setup-btn" style="background: white; color: #667eea; border: none; padding: 0.5rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        セットアップ
                    </button>
                </div>
            </div>
            
            <!-- Quick Access -->
            <section class="quick-access">
                <h2 class="section-title">クイックアクセス</h2>
                <div class="features-grid" id="quick-access-grid"></div>
            </section>
            
            <!-- Categories -->
            <section class="categories">
                <h2 class="section-title">カテゴリー別機能</h2>
                <div class="features-grid" id="categories-grid"></div>
            </section>
        `;
        
        // Re-load quick access and categories
        this.loadQuickAccess();
        this.loadCategories();
        
        // Re-attach setup button handler
        document.getElementById('setup-btn')?.addEventListener('click', () => {
            this.navigateTo('settings');
        });
    },
    
    /**
     * Render features page
     */
    renderFeatures() {
        const container = document.querySelector('.main-container');
        if (!container) return;
        
        container.innerHTML = `
            <section class="page-header">
                <h1>全機能一覧</h1>
                <p>500以上の機能をカテゴリー別に表示</p>
            </section>
            
            <div class="filter-bar">
                <input type="text" id="feature-search" placeholder="機能を検索..." class="search-input">
                <select id="category-filter" class="filter-select">
                    <option value="all">すべてのカテゴリー</option>
                    <option value="system">システム</option>
                    <option value="ai">AI・外部連携</option>
                    <option value="productivity">生産性</option>
                    <option value="mental">メンタル</option>
                    <option value="life">ライフ</option>
                    <option value="creative">クリエイティブ</option>
                </select>
            </div>
            
            <div class="features-list" id="features-list">
                <div class="coming-soon">
                    <h2>🚧 開発中</h2>
                    <p>500機能の一覧は順次追加されます。</p>
                    <p>現在、コア基盤が完成しており、各機能の実装を進めています。</p>
                    <button onclick="LifeToolRouter.navigateTo('home')" class="primary-btn">ホームに戻る</button>
                </div>
            </div>
        `;
    },
    
    /**
     * Render settings page
     */
    renderSettings() {
        const container = document.querySelector('.main-container');
        if (!container) return;
        
        container.innerHTML = `
            <section class="page-header">
                <h1>⚙️ 設定</h1>
                <p>Life-Toolの設定とAPIキー管理</p>
            </section>
            
            <div class="settings-grid">
                <!-- Google Account -->
                <div class="settings-card">
                    <h3>🔐 Googleアカウント</h3>
                    <div class="setting-item">
                        <span>ログイン状態:</span>
                        <span id="google-auth-status">未ログイン</span>
                    </div>
                    <div class="setting-item">
                        <span>最終同期:</span>
                        <span id="last-sync-time">未同期</span>
                    </div>
                    <button id="sync-now-btn" class="primary-btn" disabled>今すぐ同期</button>
                    <p class="help-text">
                        ⚠️ Google OAuth設定が必要です。<br>
                        <a href="./SETUP_GUIDE.md" target="_blank">セットアップガイド</a>を参照してください。
                    </p>
                </div>
                
                <!-- API Keys -->
                <div class="settings-card">
                    <h3>🔑 APIキー管理</h3>
                    <p class="card-description">外部APIを使用する機能のためのキー設定（BYOK方式）</p>
                    <div id="api-keys-list"></div>
                </div>
                
                <!-- Theme -->
                <div class="settings-card">
                    <h3>🎨 テーマ設定</h3>
                    <div class="setting-item">
                        <span>現在のテーマ:</span>
                        <select id="theme-select" class="setting-select">
                            <option value="light">ライト</option>
                            <option value="dark">ダーク</option>
                            <option value="auto">自動（システム設定に従う）</option>
                        </select>
                    </div>
                </div>
                
                <!-- Data Management -->
                <div class="settings-card">
                    <h3>💾 データ管理</h3>
                    <div class="setting-item">
                        <button id="export-data-settings" class="secondary-btn">データをエクスポート</button>
                        <button id="import-data-settings" class="secondary-btn">データをインポート</button>
                    </div>
                    <div class="setting-item">
                        <button id="clear-all-data" class="danger-btn">全データを削除</button>
                    </div>
                    <p class="help-text">⚠️ 削除したデータは復元できません</p>
                </div>
                
                <!-- Storage Info -->
                <div class="settings-card">
                    <h3>📊 ストレージ情報</h3>
                    <div class="setting-item">
                        <span>使用量:</span>
                        <span id="storage-usage-settings">計算中...</span>
                    </div>
                    <div class="storage-bar">
                        <div class="storage-bar-fill" id="storage-bar-fill" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;
        
        this.initSettingsPage();
    },
    
    /**
     * Render help page
     */
    renderHelp() {
        const container = document.querySelector('.main-container');
        if (!container) return;
        
        container.innerHTML = `
            <section class="page-header">
                <h1>❓ ヘルプ</h1>
                <p>Life-Toolの使い方とよくある質問</p>
            </section>
            
            <div class="help-sections">
                <div class="help-card">
                    <h2>🚀 はじめに</h2>
                    <ul>
                        <li>Life-Toolは完全にローカルで動作するWebアプリです</li>
                        <li>データはあなたのブラウザとGoogle Driveにのみ保存されます</li>
                        <li>外部APIを使用する機能は、あなた自身のAPIキーで動作します（BYOK）</li>
                    </ul>
                </div>
                
                <div class="help-card">
                    <h2>🔧 セットアップ</h2>
                    <ol>
                        <li><a href="./SETUP_GUIDE.md" target="_blank">セットアップガイド</a>を参照</li>
                        <li>Google Cloud ConsoleでOAuth 2.0を設定</li>
                        <li>必要に応じて外部APIのキーを取得</li>
                        <li>設定ページからAPIキーを登録</li>
                    </ol>
                </div>
                
                <div class="help-card">
                    <h2>⌨️ キーボードショートカット</h2>
                    <ul>
                        <li><kbd>Cmd/Ctrl + K</kbd> - 検索窓を開く</li>
                        <li><kbd>Cmd/Ctrl + /</kbd> - ヘルプを表示（今後実装）</li>
                    </ul>
                </div>
                
                <div class="help-card">
                    <h2>❓ よくある質問</h2>
                    <details>
                        <summary>データはどこに保存されますか？</summary>
                        <p>ブラウザのIndexedDBとGoogle Driveの「App Data」フォルダにのみ保存されます。開発者のサーバーには一切送信されません。</p>
                    </details>
                    <details>
                        <summary>APIキーは安全ですか？</summary>
                        <p>APIキーはブラウザのLocalStorageにのみ保存され、外部に送信されることはありません。ただし、ブラウザのセキュリティには十分注意してください。</p>
                    </details>
                    <details>
                        <summary>オフラインで使えますか？</summary>
                        <p>基本機能はオフラインでも使用可能です。外部APIを使用する機能（天気予報、AIチャットなど）はインターネット接続が必要です。</p>
                    </details>
                </div>
                
                <div class="help-card">
                    <h2>📚 ドキュメント</h2>
                    <ul>
                        <li><a href="./README.md" target="_blank">README</a> - プロジェクト概要</li>
                        <li><a href="./SETUP_GUIDE.md" target="_blank">セットアップガイド</a> - 詳細な設定手順</li>
                        <li><a href="https://github.com" target="_blank">GitHub</a> - ソースコード</li>
                    </ul>
                </div>
            </div>
        `;
    },
    
    /**
     * Render category page
     */
    renderCategory(category, title) {
        const container = document.querySelector('.main-container');
        if (!container) return;
        
        const categoryInfo = {
            'system': { icon: '⚙️', description: 'コア機能とシステム設定' },
            'ai': { icon: '🤖', description: 'AI連携と自動化機能' },
            'productivity': { icon: '📊', description: '生産性向上ツール' },
            'mental': { icon: '🧘', description: 'メンタルケアと意思決定支援' },
            'life': { icon: '🏠', description: 'ライフマネジメント' },
            'creative': { icon: '🎨', description: '思考とクリエイティブ支援' },
            'health': { icon: '💪', description: '健康と運動管理' },
            'money': { icon: '💰', description: 'マネーと資産管理' },
            'tech': { icon: '💻', description: 'テック・開発ツール' },
            'misc': { icon: '✨', description: 'その他と遊び' }
        };
        
        const info = categoryInfo[category] || { icon: '📦', description: '' };
        
        container.innerHTML = `
            <section class="page-header">
                <h1>${info.icon} ${title}</h1>
                <p>${info.description}</p>
            </section>
            
            <div class="category-features">
                <div class="coming-soon">
                    <h2>🚧 開発中</h2>
                    <p>このカテゴリーの機能は順次実装されます。</p>
                    <button onclick="LifeToolRouter.navigateTo('home')" class="primary-btn">ホームに戻る</button>
                </div>
            </div>
        `;
    },
    
    /**
     * Initialize settings page functionality
     */
    initSettingsPage() {
        // API Keys list
        const apiKeysList = document.getElementById('api-keys-list');
        if (apiKeysList && APIManager) {
            const apis = APIManager.getAllAPIs();
            let html = '<div class="api-keys-grid">';
            
            for (const [apiName, apiInfo] of Object.entries(apis)) {
                const hasKey = APIManager.hasKey(apiName);
                html += `
                    <div class="api-key-item">
                        <div class="api-info">
                            <strong>${apiInfo.name}</strong>
                            <p>${apiInfo.description}</p>
                            <span class="api-status ${hasKey ? 'configured' : 'not-configured'}">
                                ${hasKey ? '✓ 設定済み' : '未設定'}
                            </span>
                        </div>
                        <button class="secondary-btn" onclick="LifeToolRouter.configureAPI('${apiName}')">
                            ${hasKey ? '変更' : '設定'}
                        </button>
                    </div>
                `;
            }
            html += '</div>';
            apiKeysList.innerHTML = html;
        }
        
        // Theme select
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            const currentTheme = localStorage.getItem('lifetool-theme') || 'light';
            themeSelect.value = currentTheme;
            
            themeSelect.addEventListener('change', (e) => {
                const newTheme = e.target.value;
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('lifetool-theme', newTheme);
            });
        }
        
        // Export/Import buttons
        document.getElementById('export-data-settings')?.addEventListener('click', async () => {
            try {
                const data = await LifeToolStorage.exportData();
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `lifetool-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                alert('データをエクスポートしました');
            } catch (error) {
                alert('エクスポートに失敗しました: ' + error.message);
            }
        });
        
        document.getElementById('import-data-settings')?.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const text = await file.text();
                        const success = await LifeToolStorage.importData(text);
                        if (success) {
                            alert('データをインポートしました。ページを再読み込みします。');
                            location.reload();
                        }
                    } catch (error) {
                        alert('インポートに失敗しました: ' + error.message);
                    }
                }
            };
            input.click();
        });
        
        // Clear all data
        document.getElementById('clear-all-data')?.addEventListener('click', async () => {
            if (confirm('本当に全データを削除しますか？この操作は取り消せません。')) {
                if (confirm('最終確認：全データを完全に削除します。よろしいですか？')) {
                    try {
                        // Clear IndexedDB
                        for (const store of Object.values(LifeToolStorage.stores)) {
                            await LifeToolStorage.clear(store);
                        }
                        // Clear LocalStorage
                        localStorage.clear();
                        alert('全データを削除しました。ページを再読み込みします。');
                        location.reload();
                    } catch (error) {
                        alert('削除に失敗しました: ' + error.message);
                    }
                }
            }
        });
        
        // Storage info
        this.updateStorageInfo();
    },
    
    /**
     * Update storage info in settings
     */
    async updateStorageInfo() {
        const usageEl = document.getElementById('storage-usage-settings');
        const barEl = document.getElementById('storage-bar-fill');
        
        if (usageEl && LifeToolStorage) {
            try {
                const info = await LifeToolStorage.getStorageInfo();
                if (info) {
                    usageEl.textContent = `${info.usageInMB} MB / ${info.quotaInMB} MB`;
                    if (barEl) {
                        barEl.style.width = `${info.percentUsed}%`;
                    }
                }
            } catch (error) {
                console.error('Error getting storage info:', error);
            }
        }
    },
    
    /**
     * Configure API key
     */
    configureAPI(apiName) {
        const apiInfo = APIManager.getAPIInfo(apiName);
        if (!apiInfo) return;
        
        const currentKey = APIManager.getKey(apiName);
        const newKey = prompt(
            `${apiInfo.name} のAPIキーを入力してください\n\n` +
            `形式: ${apiInfo.keyFormat}\n` +
            `必要な機能: ${apiInfo.requiredFor.join(', ')}\n\n` +
            (currentKey ? '現在設定されているキーを変更します。' : ''),
            currentKey || ''
        );
        
        if (newKey !== null && newKey.trim() !== '') {
            const validation = APIManager.validateKeyFormat(apiName, newKey);
            if (validation.valid) {
                APIManager.saveKey(apiName, newKey.trim());
                alert('APIキーを保存しました');
                this.navigateTo('settings'); // Refresh page
            } else {
                alert('エラー: ' + validation.message);
            }
        }
    },
    
    /**
     * Load quick access features
     */
    loadQuickAccess() {
        const grid = document.getElementById('quick-access-grid');
        if (!grid) return;
        
        const quickFeatures = [
            {
                title: 'TODOマネージャー',
                description: '階層型のタスク管理とヒートマップで進捗を可視化',
                badge: '人気',
                action: () => alert('TODOマネージャーは開発中です')
            },
            {
                title: 'AIチャット',
                description: 'カウンセラー役のAIとの対話でストレス解消',
                badge: '新機能',
                action: () => alert('AIチャットは開発中です')
            },
            {
                title: 'QRコード生成',
                description: 'URLやテキストを即座にQRコード化',
                badge: '便利',
                action: () => alert('QRコード生成は開発中です')
            },
            {
                title: '感謝の3行日記',
                description: '毎日3つのポジティブな出来事を記録',
                badge: 'おすすめ',
                action: () => alert('感謝の3行日記は開発中です')
            }
        ];
        
        grid.innerHTML = quickFeatures.map(feature => `
            <div class="feature-card" onclick='${feature.action.toString().replace(/'/g, "\\'")}()'>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
                <span class="feature-badge">${feature.badge}</span>
            </div>
        `).join('');
    },
    
    /**
     * Load categories
     */
    loadCategories() {
        const grid = document.getElementById('categories-grid');
        if (!grid) return;
        
        const categories = [
            { id: 'system', title: 'システム・基本機能', description: 'APIキー管理、テーマ設定、PWA対応など', badge: 'コア', icon: '⚙️' },
            { id: 'ai', title: 'AI・外部連携', description: 'AIチャット、文章要約、天気予報など', badge: '14機能', icon: '🤖' },
            { id: 'productivity', title: '生産性・ツール', description: 'TODO、ノート、QRコード、パスワード生成', badge: '21機能', icon: '📊' },
            { id: 'mental', title: 'メンタル・意思決定', description: 'ストレス解消、集中タイマー、感謝日記', badge: '18機能', icon: '🧘' },
            { id: 'life', title: 'ライフマネジメント', description: '家計簿、調理補助、健康管理', badge: '25機能', icon: '🏠' },
            { id: 'creative', title: '思考・クリエイティブ', description: 'アイデア発想、配色提案、SVG作成', badge: '32機能', icon: '🎨' }
        ];
        
        grid.innerHTML = categories.map(cat => `
            <div class="feature-card" onclick="LifeToolRouter.navigateTo('${cat.id}')">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${cat.icon}</div>
                <h3>${cat.title}</h3>
                <p>${cat.description}</p>
                <span class="feature-badge">${cat.badge}</span>
            </div>
        `).join('');
    }
};

// Initialize router when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        LifeToolRouter.init();
    });
} else {
    LifeToolRouter.init();
}