/**
 * Life-Tool API Manager
 * BYOK (Bring Your Own Key) 方式でAPIキーを管理
 */

const APIManager = {
    // API keys are stored in LocalStorage (encrypted in production)
    storagePrefix: 'lifetool_api_',
    
    // Supported APIs
    apis: {
        openai: {
            name: 'OpenAI',
            description: 'ChatGPT API for AI features',
            keyFormat: 'sk-...',
            requiredFor: ['AI Chat', 'Text Rewriter', 'Quiz Generator']
        },
        anthropic: {
            name: 'Anthropic',
            description: 'Claude API for AI features',
            keyFormat: 'sk-ant-...',
            requiredFor: ['AI Chat', 'Socratic Dialogue']
        },
        openweather: {
            name: 'OpenWeatherMap',
            description: 'Weather data and forecasts',
            keyFormat: '32-character hex',
            requiredFor: ['Weather', 'Laundry Index']
        },
        nasa: {
            name: 'NASA',
            description: 'Space data and astronomy',
            keyFormat: 'DEMO_KEY or custom',
            requiredFor: ['Space Weather', 'ISS Tracker']
        },
        exchangerate: {
            name: 'Exchange Rate API',
            description: 'Currency conversion rates',
            keyFormat: 'free or premium key',
            requiredFor: ['Currency Converter']
        },
        googlemaps: {
            name: 'Google Maps',
            description: 'Geocoding and location services',
            keyFormat: 'AIza...',
            requiredFor: ['Address Converter']
        }
    },
    
    /**
     * Save API key
     */
    saveKey(apiName, apiKey) {
        try {
            // In production, encrypt the key before storage
            const encryptedKey = this.encrypt(apiKey);
            localStorage.setItem(this.storagePrefix + apiName, encryptedKey);
            console.log(`API key saved for ${apiName}`);
            return true;
        } catch (error) {
            console.error('Error saving API key:', error);
            return false;
        }
    },
    
    /**
     * Get API key
     */
    getKey(apiName) {
        try {
            const encryptedKey = localStorage.getItem(this.storagePrefix + apiName);
            if (!encryptedKey) return null;
            
            // In production, decrypt the key
            return this.decrypt(encryptedKey);
        } catch (error) {
            console.error('Error getting API key:', error);
            return null;
        }
    },
    
    /**
     * Delete API key
     */
    deleteKey(apiName) {
        try {
            localStorage.removeItem(this.storagePrefix + apiName);
            console.log(`API key deleted for ${apiName}`);
            return true;
        } catch (error) {
            console.error('Error deleting API key:', error);
            return false;
        }
    },
    
    /**
     * Check if API key exists
     */
    hasKey(apiName) {
        return this.getKey(apiName) !== null;
    },
    
    /**
     * Get all configured APIs
     */
    getConfiguredAPIs() {
        const configured = [];
        for (const apiName in this.apis) {
            if (this.hasKey(apiName)) {
                configured.push(apiName);
            }
        }
        return configured;
    },
    
    /**
     * Validate API key format (basic check)
     */
    validateKeyFormat(apiName, apiKey) {
        if (!apiKey || apiKey.trim() === '') {
            return { valid: false, message: 'APIキーが空です' };
        }
        
        const api = this.apis[apiName];
        if (!api) {
            return { valid: false, message: '未知のAPI名です' };
        }
        
        // Basic format validation
        switch (apiName) {
            case 'openai':
                if (!apiKey.startsWith('sk-')) {
                    return { valid: false, message: 'OpenAI APIキーは "sk-" で始まる必要があります' };
                }
                break;
            case 'anthropic':
                if (!apiKey.startsWith('sk-ant-')) {
                    return { valid: false, message: 'Anthropic APIキーは "sk-ant-" で始まる必要があります' };
                }
                break;
            case 'openweather':
                if (!/^[a-f0-9]{32}$/i.test(apiKey)) {
                    return { valid: false, message: 'OpenWeatherMap APIキーは32文字の16進数である必要があります' };
                }
                break;
            case 'googlemaps':
                if (!apiKey.startsWith('AIza')) {
                    return { valid: false, message: 'Google Maps APIキーは "AIza" で始まる必要があります' };
                }
                break;
        }
        
        return { valid: true, message: 'フォーマットは正しいです' };
    },
    
    /**
     * Test API key (make a simple API call)
     */
    async testKey(apiName) {
        const apiKey = this.getKey(apiName);
        if (!apiKey) {
            return { success: false, message: 'APIキーが設定されていません' };
        }
        
        try {
            switch (apiName) {
                case 'openweather':
                    const weatherResponse = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=${apiKey}`
                    );
                    if (weatherResponse.ok) {
                        return { success: true, message: 'APIキーは有効です' };
                    } else {
                        return { success: false, message: `エラー: ${weatherResponse.status}` };
                    }
                
                case 'nasa':
                    const nasaResponse = await fetch(
                        `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
                    );
                    if (nasaResponse.ok) {
                        return { success: true, message: 'APIキーは有効です' };
                    } else {
                        return { success: false, message: `エラー: ${nasaResponse.status}` };
                    }
                
                default:
                    return { success: false, message: 'このAPIのテスト機能は未実装です' };
            }
        } catch (error) {
            return { success: false, message: `テストエラー: ${error.message}` };
        }
    },
    
    /**
     * Simple encryption (for demo - use proper encryption in production)
     */
    encrypt(text) {
        // In production, use Web Crypto API or a proper encryption library
        // This is just base64 encoding for demonstration
        return btoa(text);
    },
    
    /**
     * Simple decryption (for demo)
     */
    decrypt(encrypted) {
        try {
            return atob(encrypted);
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    },
    
    /**
     * Export API settings (excluding actual keys for security)
     */
    exportSettings() {
        const settings = {
            configured: this.getConfiguredAPIs(),
            timestamp: new Date().toISOString()
        };
        return JSON.stringify(settings, null, 2);
    },
    
    /**
     * Get usage statistics
     */
    getUsageStats() {
        const stats = {};
        
        // Get from LocalStorage if tracked
        for (const apiName in this.apis) {
            const usageKey = `${this.storagePrefix}usage_${apiName}`;
            const usage = localStorage.getItem(usageKey);
            if (usage) {
                stats[apiName] = JSON.parse(usage);
            }
        }
        
        return stats;
    },
    
    /**
     * Track API usage
     */
    trackUsage(apiName, cost = 0) {
        const usageKey = `${this.storagePrefix}usage_${apiName}`;
        const existing = localStorage.getItem(usageKey);
        
        let usage = existing ? JSON.parse(existing) : {
            count: 0,
            totalCost: 0,
            lastUsed: null
        };
        
        usage.count++;
        usage.totalCost += cost;
        usage.lastUsed = new Date().toISOString();
        
        localStorage.setItem(usageKey, JSON.stringify(usage));
    },
    
    /**
     * Get API information
     */
    getAPIInfo(apiName) {
        return this.apis[apiName] || null;
    },
    
    /**
     * Get all APIs
     */
    getAllAPIs() {
        return this.apis;
    }
};

// API Request Helper
class APIRequest {
    constructor(apiName) {
        this.apiName = apiName;
        this.apiKey = APIManager.getKey(apiName);
    }
    
    hasKey() {
        return this.apiKey !== null;
    }
    
    async call(endpoint, options = {}) {
        if (!this.hasKey()) {
            throw new Error(`${this.apiName} APIキーが設定されていません`);
        }
        
        try {
            const response = await fetch(endpoint, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            
            // Track usage
            APIManager.trackUsage(this.apiName);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`API call error (${this.apiName}):`, error);
            throw error;
        }
    }
}