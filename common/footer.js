/**
 * Life-Tool Common Footer
 * Dynamic footer with status and links
 */

const LifeToolFooter = {
    /**
     * Render footer
     */
    render() {
        const footerContainer = document.getElementById('footer-container');
        if (!footerContainer) {
            console.error('Footer container not found');
            return;
        }
        
        footerContainer.innerHTML = `
            <footer class="lifetool-footer">
                <div class="footer-content">
                    <div class="footer-section">
                        <h4>Life-Tool</h4>
                        <p class="footer-description">
                            完全ローカル・パーソナルなOS体験を提供します。
                            データはあなたのブラウザとGoogle Driveにのみ保存されます。
                        </p>
                    </div>
                    
                    <div class="footer-section">
                        <h4>クイックリンク</h4>
                        <ul class="footer-links">
                            <li><a href="#home">ホーム</a></li>
                            <li><a href="#features">機能一覧</a></li>
                            <li><a href="#settings">設定</a></li>
                            <li><a href="#help">ヘルプ</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h4>システム情報</h4>
                        <ul class="footer-status">
                            <li>
                                <span class="status-label">ストレージ使用量:</span>
                                <span id="storage-usage">計算中...</span>
                            </li>
                            <li>
                                <span class="status-label">最終同期:</span>
                                <span id="last-sync">未同期</span>
                            </li>
                            <li>
                                <span class="status-label">バージョン:</span>
                                <span>v1.0.0</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h4>開発者向け</h4>
                        <ul class="footer-links">
                            <li><a href="#" id="export-data-btn">データをエクスポート</a></li>
                            <li><a href="#" id="import-data-btn">データをインポート</a></li>
                            <li><a href="#" id="clear-cache-btn">キャッシュをクリア</a></li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p class="copyright">
                        © 2025 Life-Tool. Built with ❤️ by You & AI.
                    </p>
                    <div class="footer-badges">
                        <span class="badge">🔒 100% ローカル</span>
                        <span class="badge">🔑 BYOK</span>
                        <span class="badge">📦 500+ 機能</span>
                    </div>
                </div>
            </footer>
        `;
        
        // Load styles
        this.injectStyles();
        
        // Initialize functionality
        this.initStatus();
        this.initActions();
    },
    
    /**
     * Inject footer styles
     */
    injectStyles() {
        if (document.getElementById('footer-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'footer-styles';
        style.textContent = `
            .lifetool-footer {
                background: var(--bg-color);
                border-top: 1px solid var(--border-color);
                margin-top: 4rem;
            }
            
            .footer-content {
                max-width: 1400px;
                margin: 0 auto;
                padding: 3rem 1rem;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
            }
            
            .footer-section h4 {
                margin-bottom: 1rem;
                color: var(--primary-color);
                font-size: 1.1rem;
            }
            
            .footer-description {
                color: #666;
                font-size: 0.9rem;
                line-height: 1.6;
            }
            
            .footer-links {
                list-style: none;
                padding: 0;
            }
            
            .footer-links li {
                margin-bottom: 0.5rem;
            }
            
            .footer-links a {
                color: var(--text-color);
                text-decoration: none;
                font-size: 0.9rem;
                transition: color 0.2s;
            }
            
            .footer-links a:hover {
                color: var(--primary-color);
            }
            
            .footer-status {
                list-style: none;
                padding: 0;
            }
            
            .footer-status li {
                margin-bottom: 0.75rem;
                font-size: 0.9rem;
            }
            
            .status-label {
                color: #666;
                display: inline-block;
                min-width: 120px;
            }
            
            .footer-bottom {
                border-top: 1px solid var(--border-color);
                padding: 1.5rem 1rem;
                max-width: 1400px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }
            
            .copyright {
                color: #666;
                font-size: 0.9rem;
                margin: 0;
            }
            
            .footer-badges {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            
            .badge {
                background: var(--primary-color);
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .footer-content {
                    grid-template-columns: 1fr;
                }
                
                .footer-bottom {
                    flex-direction: column;
                    text-align: center;
                }
            }
        `;
        
        document.head.appendChild(style);
    },
    
    /**
     * Initialize status displays
     */
    async initStatus() {
        // Update storage usage
        this.updateStorageUsage();
        
        // Update last sync time
        this.updateLastSync();
        
        // Update every 30 seconds
        setInterval(() => {
            this.updateStorageUsage();
            this.updateLastSync();
        }, 30000);
    },
    
    /**
     * Update storage usage display
     */
    async updateStorageUsage() {
        const storageUsageEl = document.getElementById('storage-usage');
        if (!storageUsageEl) return;
        
        try {
            const info = await LifeToolStorage.getStorageInfo();
            if (info) {
                storageUsageEl.textContent = `${info.usageInMB} MB / ${info.quotaInMB} MB (${info.percentUsed}%)`;
            } else {
                storageUsageEl.textContent = '不明';
            }
        } catch (error) {
            console.error('Error getting storage info:', error);
            storageUsageEl.textContent = 'エラー';
        }
    },
    
    /**
     * Update last sync time
     */
    async updateLastSync() {
        const lastSyncEl = document.getElementById('last-sync');
        if (!lastSyncEl) return;
        
        try {
            if (LifeToolAuth.isSignedIn) {
                const lastSync = await LifeToolAuth.getLastSyncTime();
                if (lastSync) {
                    lastSyncEl.textContent = this.formatRelativeTime(lastSync);
                } else {
                    lastSyncEl.textContent = '未同期';
                }
            } else {
                lastSyncEl.textContent = 'オフライン';
            }
        } catch (error) {
            console.error('Error getting sync time:', error);
            lastSyncEl.textContent = 'エラー';
        }
    },
    
    /**
     * Format relative time
     */
    formatRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}日前`;
        if (hours > 0) return `${hours}時間前`;
        if (minutes > 0) return `${minutes}分前`;
        return 'たった今';
    },
    
    /**
     * Initialize action buttons
     */
    initActions() {
        // Export data
        const exportBtn = document.getElementById('export-data-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', async (e) => {
                e.preventDefault();
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
                    console.error('Export error:', error);
                    alert('エクスポートに失敗しました');
                }
            });
        }
        
        // Import data
        const importBtn = document.getElementById('import-data-btn');
        if (importBtn) {
            importBtn.addEventListener('click', (e) => {
                e.preventDefault();
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
                            } else {
                                alert('インポートに失敗しました');
                            }
                        } catch (error) {
                            console.error('Import error:', error);
                            alert('インポートエラー: ' + error.message);
                        }
                    }
                };
                input.click();
            });
        }
        
        // Clear cache
        const clearCacheBtn = document.getElementById('clear-cache-btn');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                if (confirm('キャッシュをクリアしますか？（設定とメインデータは保持されます）')) {
                    try {
                        await LifeToolStorage.clear('cache');
                        alert('キャッシュをクリアしました');
                    } catch (error) {
                        console.error('Clear cache error:', error);
                        alert('キャッシュのクリアに失敗しました');
                    }
                }
            });
        }
    }
};

// Auto-render on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        LifeToolFooter.render();
    });
} else {
    LifeToolFooter.render();
}