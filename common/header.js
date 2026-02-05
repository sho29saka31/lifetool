/**
 * Life-Tool Common Header
 * Dynamic header with search, navigation, and auth
 */

const LifeToolHeader = {
    // Features data for search
    featuresData: [],
    
    /**
     * Render header
     */
    render() {
        const headerContainer = document.getElementById('header-container');
        if (!headerContainer) {
            console.error('Header container not found');
            return;
        }
        
        headerContainer.innerHTML = `
            <header class="lifetool-header">
                <div class="header-content">
                    <div class="header-left">
                        <a href="#home" class="logo">
                            <span class="logo-icon">🌟</span>
                            <span class="logo-text">Life-Tool</span>
                        </a>
                    </div>
                    
                    <div class="header-center">
                        <div class="search-box">
                            <span class="search-icon">🔍</span>
                            <input 
                                type="text" 
                                id="global-search" 
                                placeholder="機能を検索... (Cmd+K)"
                                autocomplete="off"
                            />
                            <span class="search-shortcut">⌘K</span>
                        </div>
                        <div id="search-results" class="search-results"></div>
                    </div>
                    
                    <div class="header-right">
                        <button id="theme-toggle" class="icon-btn" title="テーマ切替">
                            <span class="theme-icon">🌙</span>
                        </button>
                        
                        <button id="google-signin-btn" class="signin-btn">
                            Googleでログイン
                        </button>
                        
                        <button id="menu-toggle" class="icon-btn" title="メニュー">
                            <span class="menu-icon">☰</span>
                        </button>
                    </div>
                </div>
                
                <!-- Hamburger Menu -->
                <div id="hamburger-menu" class="hamburger-menu">
                    <div class="menu-content">
                        <div class="menu-header">
                            <h3>カテゴリー</h3>
                            <button id="menu-close" class="close-btn">×</button>
                        </div>
                        <nav class="menu-categories">
                            <a href="#system" class="menu-item">
                                <span class="menu-icon">⚙️</span>
                                <span class="menu-text">システム・基本機能</span>
                            </a>
                            <a href="#ai" class="menu-item">
                                <span class="menu-icon">🤖</span>
                                <span class="menu-text">AI・外部連携</span>
                            </a>
                            <a href="#productivity" class="menu-item">
                                <span class="menu-icon">📊</span>
                                <span class="menu-text">生産性・ツール</span>
                            </a>
                            <a href="#mental" class="menu-item">
                                <span class="menu-icon">🧘</span>
                                <span class="menu-text">メンタル・意思決定</span>
                            </a>
                            <a href="#life" class="menu-item">
                                <span class="menu-icon">🏠</span>
                                <span class="menu-text">ライフマネジメント</span>
                            </a>
                            <a href="#creative" class="menu-item">
                                <span class="menu-icon">🎨</span>
                                <span class="menu-text">思考・クリエイティブ</span>
                            </a>
                            <a href="#health" class="menu-item">
                                <span class="menu-icon">💪</span>
                                <span class="menu-text">健康・運動</span>
                            </a>
                            <a href="#money" class="menu-item">
                                <span class="menu-icon">💰</span>
                                <span class="menu-text">マネー・資産</span>
                            </a>
                            <a href="#tech" class="menu-item">
                                <span class="menu-icon">💻</span>
                                <span class="menu-text">テック・開発</span>
                            </a>
                            <a href="#misc" class="menu-item">
                                <span class="menu-icon">✨</span>
                                <span class="menu-text">その他・遊び</span>
                            </a>
                        </nav>
                    </div>
                </div>
            </header>
        `;
        
        // Load styles
        this.injectStyles();
        
        // Initialize functionality
        this.initSearch();
        this.initThemeToggle();
        this.initMenu();
        this.initAuth();
    },
    
    /**
     * Inject header styles
     */
    injectStyles() {
        if (document.getElementById('header-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'header-styles';
        style.textContent = `
            .lifetool-header {
                background: var(--bg-color);
                border-bottom: 1px solid var(--border-color);
                position: sticky;
                top: 0;
                z-index: 1000;
            }
            
            .header-content {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0.75rem 1rem;
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .header-left {
                flex-shrink: 0;
            }
            
            .logo {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                text-decoration: none;
                font-weight: 700;
                font-size: 1.25rem;
                color: var(--text-color);
            }
            
            .logo-icon {
                font-size: 1.5rem;
            }
            
            .header-center {
                flex: 1;
                max-width: 600px;
                position: relative;
            }
            
            .search-box {
                display: flex;
                align-items: center;
                background: var(--hover-color);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 0.5rem 1rem;
                gap: 0.5rem;
            }
            
            .search-box:focus-within {
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
            }
            
            .search-icon {
                font-size: 1.2rem;
            }
            
            #global-search {
                flex: 1;
                border: none;
                background: transparent;
                outline: none;
                font-size: 0.95rem;
                color: var(--text-color);
            }
            
            .search-shortcut {
                font-size: 0.8rem;
                color: #999;
                background: var(--bg-color);
                padding: 0.2rem 0.5rem;
                border-radius: 4px;
                border: 1px solid var(--border-color);
            }
            
            .search-results {
                display: none;
                position: absolute;
                top: calc(100% + 0.5rem);
                left: 0;
                right: 0;
                background: var(--bg-color);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                box-shadow: var(--shadow);
                max-height: 400px;
                overflow-y: auto;
                z-index: 1001;
            }
            
            .search-results.active {
                display: block;
            }
            
            .search-result-item {
                padding: 0.75rem 1rem;
                cursor: pointer;
                border-bottom: 1px solid var(--border-color);
            }
            
            .search-result-item:hover {
                background: var(--hover-color);
            }
            
            .search-result-item:last-child {
                border-bottom: none;
            }
            
            .result-title {
                font-weight: 600;
                color: var(--primary-color);
                margin-bottom: 0.25rem;
            }
            
            .result-description {
                font-size: 0.85rem;
                color: #666;
            }
            
            .result-category {
                display: inline-block;
                font-size: 0.75rem;
                background: var(--primary-color);
                color: white;
                padding: 0.2rem 0.5rem;
                border-radius: 4px;
                margin-top: 0.25rem;
            }
            
            .header-right {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .icon-btn {
                background: transparent;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 8px;
                transition: background 0.2s;
            }
            
            .icon-btn:hover {
                background: var(--hover-color);
            }
            
            .signin-btn {
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: opacity 0.2s;
            }
            
            .signin-btn:hover {
                opacity: 0.9;
            }
            
            /* Hamburger Menu */
            .hamburger-menu {
                position: fixed;
                top: 0;
                right: -100%;
                width: 320px;
                height: 100vh;
                background: var(--bg-color);
                border-left: 1px solid var(--border-color);
                box-shadow: -2px 0 8px rgba(0,0,0,0.1);
                transition: right 0.3s ease;
                z-index: 1002;
            }
            
            .hamburger-menu.active {
                right: 0;
            }
            
            .menu-content {
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            
            .menu-header {
                padding: 1rem;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .menu-header h3 {
                margin: 0;
                font-size: 1.25rem;
            }
            
            .close-btn {
                background: transparent;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                line-height: 1;
                padding: 0;
                width: 32px;
                height: 32px;
            }
            
            .menu-categories {
                flex: 1;
                overflow-y: auto;
                padding: 1rem 0;
            }
            
            .menu-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                text-decoration: none;
                color: var(--text-color);
                transition: background 0.2s;
            }
            
            .menu-item:hover {
                background: var(--hover-color);
            }
            
            .menu-item .menu-icon {
                font-size: 1.5rem;
            }
            
            .menu-item .menu-text {
                font-weight: 500;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .header-content {
                    flex-wrap: wrap;
                }
                
                .header-center {
                    order: 3;
                    width: 100%;
                    max-width: none;
                }
                
                .search-shortcut {
                    display: none;
                }
                
                .hamburger-menu {
                    width: 100%;
                    right: -100%;
                }
            }
        `;
        
        document.head.appendChild(style);
    },
    
    /**
     * Initialize search functionality
     */
    initSearch() {
        const searchInput = document.getElementById('global-search');
        const searchResults = document.getElementById('search-results');
        
        // Keyboard shortcut (Cmd+K / Ctrl+K)
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
        
        // Search input handler
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            
            if (query.length < 2) {
                searchResults.classList.remove('active');
                return;
            }
            
            const results = this.searchFeatures(query);
            this.displaySearchResults(results);
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    },
    
    /**
     * Search features
     */
    searchFeatures(query) {
        // TODO: Load actual features data
        const mockFeatures = [
            { id: 1, title: 'TODOマネージャー', description: '階層型タスク管理', category: '生産性' },
            { id: 2, title: 'AIチャット', description: 'AIとの対話', category: 'AI' },
            { id: 3, title: 'QRコード生成', description: 'QRコード作成', category: 'ツール' },
            { id: 4, title: '感謝の3行日記', description: '日記記録', category: 'メンタル' }
        ];
        
        return mockFeatures.filter(feature => 
            feature.title.toLowerCase().includes(query) ||
            feature.description.toLowerCase().includes(query) ||
            feature.category.toLowerCase().includes(query)
        );
    },
    
    /**
     * Display search results
     */
    displaySearchResults(results) {
        const searchResults = document.getElementById('search-results');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div style="padding: 1rem; text-align: center; color: #999;">結果が見つかりません</div>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" data-id="${result.id}">
                    <div class="result-title">${result.title}</div>
                    <div class="result-description">${result.description}</div>
                    <span class="result-category">${result.category}</span>
                </div>
            `).join('');
            
            // Add click handlers
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    alert(`${item.querySelector('.result-title').textContent}は開発中です`);
                    searchResults.classList.remove('active');
                });
            });
        }
        
        searchResults.classList.add('active');
    },
    
    /**
     * Initialize theme toggle
     */
    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle.querySelector('.theme-icon');
        
        // Load saved theme
        const savedTheme = localStorage.getItem('lifetool-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('lifetool-theme', newTheme);
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    },
    
    /**
     * Initialize menu
     */
    initMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const menuClose = document.getElementById('menu-close');
        const hamburgerMenu = document.getElementById('hamburger-menu');
        
        menuToggle.addEventListener('click', () => {
            hamburgerMenu.classList.add('active');
        });
        
        menuClose.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
        });
        
        // Close menu when clicking on a menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
            });
        });
    },
    
    /**
     * Initialize auth button
     */
    initAuth() {
        const signInBtn = document.getElementById('google-signin-btn');
        
        signInBtn.addEventListener('click', async () => {
            if (LifeToolAuth.isSignedIn) {
                await LifeToolAuth.signOut();
            } else {
                // TODO: Initialize auth if not already done
                alert('Google OAuth設定が必要です。セットアップガイドを参照してください。');
            }
        });
    }
};

// Auto-render on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        LifeToolHeader.render();
    });
} else {
    LifeToolHeader.render();
}