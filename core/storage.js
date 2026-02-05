/**
 * Life-Tool Storage Manager
 * IndexedDBを使用したローカルデータ管理
 */

const LifeToolStorage = {
    dbName: 'LifeToolDB',
    version: 1,
    db: null,
    
    // Store names
    stores: {
        todos: 'todos',
        notes: 'notes',
        diary: 'diary',
        habits: 'habits',
        logs: 'logs',
        settings: 'settings',
        cache: 'cache'
    },
    
    /**
     * Initialize IndexedDB
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => {
                console.error('IndexedDB error:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('IndexedDB initialized successfully');
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains(this.stores.todos)) {
                    const todoStore = db.createObjectStore(this.stores.todos, { keyPath: 'id', autoIncrement: true });
                    todoStore.createIndex('createdAt', 'createdAt', { unique: false });
                    todoStore.createIndex('completed', 'completed', { unique: false });
                }
                
                if (!db.objectStoreNames.contains(this.stores.notes)) {
                    const notesStore = db.createObjectStore(this.stores.notes, { keyPath: 'id', autoIncrement: true });
                    notesStore.createIndex('createdAt', 'createdAt', { unique: false });
                    notesStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
                }
                
                if (!db.objectStoreNames.contains(this.stores.diary)) {
                    const diaryStore = db.createObjectStore(this.stores.diary, { keyPath: 'date' });
                    diaryStore.createIndex('createdAt', 'createdAt', { unique: false });
                }
                
                if (!db.objectStoreNames.contains(this.stores.habits)) {
                    const habitsStore = db.createObjectStore(this.stores.habits, { keyPath: 'id', autoIncrement: true });
                    habitsStore.createIndex('date', 'date', { unique: false });
                }
                
                if (!db.objectStoreNames.contains(this.stores.logs)) {
                    const logsStore = db.createObjectStore(this.stores.logs, { keyPath: 'id', autoIncrement: true });
                    logsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    logsStore.createIndex('type', 'type', { unique: false });
                }
                
                if (!db.objectStoreNames.contains(this.stores.settings)) {
                    db.createObjectStore(this.stores.settings, { keyPath: 'key' });
                }
                
                if (!db.objectStoreNames.contains(this.stores.cache)) {
                    const cacheStore = db.createObjectStore(this.stores.cache, { keyPath: 'key' });
                    cacheStore.createIndex('expiry', 'expiry', { unique: false });
                }
                
                console.log('IndexedDB stores created');
            };
        });
    },
    
    /**
     * Save data to store
     */
    async save(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    /**
     * Update data in store
     */
    async update(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    /**
     * Get data by key
     */
    async get(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    /**
     * Get all data from store
     */
    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    /**
     * Delete data by key
     */
    async delete(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },
    
    /**
     * Clear all data from store
     */
    async clear(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },
    
    /**
     * Query data with index
     */
    async query(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    /**
     * Export all data as JSON
     */
    async exportData() {
        const data = {};
        
        for (const storeName of Object.values(this.stores)) {
            data[storeName] = await this.getAll(storeName);
        }
        
        // Add LocalStorage data
        data.localStorage = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data.localStorage[key] = localStorage.getItem(key);
        }
        
        return JSON.stringify(data, null, 2);
    },
    
    /**
     * Import data from JSON
     */
    async importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            // Import to IndexedDB
            for (const [storeName, items] of Object.entries(data)) {
                if (storeName === 'localStorage') continue;
                
                if (this.stores[storeName]) {
                    await this.clear(storeName);
                    for (const item of items) {
                        await this.save(storeName, item);
                    }
                }
            }
            
            // Import to LocalStorage
            if (data.localStorage) {
                for (const [key, value] of Object.entries(data.localStorage)) {
                    localStorage.setItem(key, value);
                }
            }
            
            console.log('Data imported successfully');
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    },
    
    /**
     * Get storage usage info
     */
    async getStorageInfo() {
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate();
            return {
                usage: estimate.usage,
                quota: estimate.quota,
                usageInMB: (estimate.usage / 1024 / 1024).toFixed(2),
                quotaInMB: (estimate.quota / 1024 / 1024).toFixed(2),
                percentUsed: ((estimate.usage / estimate.quota) * 100).toFixed(2)
            };
        }
        return null;
    }
};

// Auto-save helper
class AutoSave {
    constructor(storeName, interval = 5000) {
        this.storeName = storeName;
        this.interval = interval;
        this.timer = null;
        this.pendingData = null;
    }
    
    schedule(data) {
        this.pendingData = data;
        
        if (this.timer) {
            clearTimeout(this.timer);
        }
        
        this.timer = setTimeout(() => {
            this.save();
        }, this.interval);
    }
    
    async save() {
        if (this.pendingData) {
            try {
                await LifeToolStorage.update(this.storeName, this.pendingData);
                console.log(`Auto-saved to ${this.storeName}`);
                this.pendingData = null;
            } catch (error) {
                console.error('Auto-save error:', error);
            }
        }
    }
    
    cancel() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}