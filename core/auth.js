/**
 * Life-Tool Authentication & Google Drive Sync
 * Google OAuth 2.0 and Drive API integration
 */

const LifeToolAuth = {
    // Google OAuth Configuration
    // TODO: Replace with your actual Client ID from Google Cloud Console
    clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
    apiKey: 'YOUR_API_KEY',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    scopes: 'https://www.googleapis.com/auth/drive.appdata',
    
    // State
    isSignedIn: false,
    currentUser: null,
    
    /**
     * Initialize Google API
     */
    async init() {
        // Check if gapi is loaded
        if (typeof gapi === 'undefined') {
            console.warn('Google API not loaded. Loading now...');
            await this.loadGAPI();
        }
        
        return new Promise((resolve, reject) => {
            gapi.load('client:auth2', async () => {
                try {
                    await gapi.client.init({
                        apiKey: this.apiKey,
                        clientId: this.clientId,
                        discoveryDocs: this.discoveryDocs,
                        scope: this.scopes
                    });
                    
                    // Listen for sign-in state changes
                    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));
                    
                    // Handle the initial sign-in state
                    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                    
                    console.log('Google API initialized');
                    resolve();
                } catch (error) {
                    console.error('Error initializing Google API:', error);
                    reject(error);
                }
            });
        });
    },
    
    /**
     * Load Google API script
     */
    async loadGAPI() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },
    
    /**
     * Update sign-in status
     */
    updateSigninStatus(isSignedIn) {
        this.isSignedIn = isSignedIn;
        
        if (isSignedIn) {
            const user = gapi.auth2.getAuthInstance().currentUser.get();
            const profile = user.getBasicProfile();
            
            this.currentUser = {
                id: profile.getId(),
                name: profile.getName(),
                email: profile.getEmail(),
                imageUrl: profile.getImageUrl()
            };
            
            console.log('User signed in:', this.currentUser.email);
            this.onSignInChange(true);
        } else {
            this.currentUser = null;
            console.log('User signed out');
            this.onSignInChange(false);
        }
    },
    
    /**
     * Sign in
     */
    async signIn() {
        try {
            await gapi.auth2.getAuthInstance().signIn();
            return true;
        } catch (error) {
            console.error('Sign in error:', error);
            return false;
        }
    },
    
    /**
     * Sign out
     */
    async signOut() {
        try {
            await gapi.auth2.getAuthInstance().signOut();
            return true;
        } catch (error) {
            console.error('Sign out error:', error);
            return false;
        }
    },
    
    /**
     * Callback for sign-in state changes
     */
    onSignInChange(isSignedIn) {
        // Update UI elements
        const authButton = document.getElementById('google-signin-btn');
        if (authButton) {
            authButton.textContent = isSignedIn ? 'ログアウト' : 'Googleでログイン';
        }
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('lifetool-auth-change', {
            detail: { isSignedIn, user: this.currentUser }
        }));
    },
    
    /**
     * Save data to Google Drive (App Data folder)
     */
    async saveToDrive(fileName, data) {
        if (!this.isSignedIn) {
            throw new Error('Not signed in to Google');
        }
        
        try {
            // Check if file exists
            const existingFile = await this.findFile(fileName);
            
            const boundary = '-------314159265358979323846';
            const delimiter = "\r\n--" + boundary + "\r\n";
            const close_delim = "\r\n--" + boundary + "--";
            
            const metadata = {
                name: fileName,
                mimeType: 'application/json',
                parents: ['appDataFolder']
            };
            
            const multipartRequestBody =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(data) +
                close_delim;
            
            const method = existingFile ? 'PATCH' : 'POST';
            const path = existingFile 
                ? `/upload/drive/v3/files/${existingFile.id}`
                : '/upload/drive/v3/files';
            
            const response = await gapi.client.request({
                path: path,
                method: method,
                params: {
                    uploadType: 'multipart',
                    fields: 'id,name,modifiedTime'
                },
                headers: {
                    'Content-Type': 'multipart/related; boundary="' + boundary + '"'
                },
                body: multipartRequestBody
            });
            
            console.log('Saved to Drive:', fileName);
            return response.result;
        } catch (error) {
            console.error('Error saving to Drive:', error);
            throw error;
        }
    },
    
    /**
     * Load data from Google Drive
     */
    async loadFromDrive(fileName) {
        if (!this.isSignedIn) {
            throw new Error('Not signed in to Google');
        }
        
        try {
            const file = await this.findFile(fileName);
            
            if (!file) {
                console.log('File not found in Drive:', fileName);
                return null;
            }
            
            const response = await gapi.client.drive.files.get({
                fileId: file.id,
                alt: 'media'
            });
            
            console.log('Loaded from Drive:', fileName);
            return response.result;
        } catch (error) {
            console.error('Error loading from Drive:', error);
            throw error;
        }
    },
    
    /**
     * Find file in App Data folder
     */
    async findFile(fileName) {
        try {
            const response = await gapi.client.drive.files.list({
                spaces: 'appDataFolder',
                q: `name='${fileName}'`,
                fields: 'files(id, name, modifiedTime)',
                pageSize: 1
            });
            
            if (response.result.files && response.result.files.length > 0) {
                return response.result.files[0];
            }
            
            return null;
        } catch (error) {
            console.error('Error finding file:', error);
            throw error;
        }
    },
    
    /**
     * Delete file from Drive
     */
    async deleteFromDrive(fileName) {
        if (!this.isSignedIn) {
            throw new Error('Not signed in to Google');
        }
        
        try {
            const file = await this.findFile(fileName);
            
            if (!file) {
                console.log('File not found:', fileName);
                return false;
            }
            
            await gapi.client.drive.files.delete({
                fileId: file.id
            });
            
            console.log('Deleted from Drive:', fileName);
            return true;
        } catch (error) {
            console.error('Error deleting from Drive:', error);
            throw error;
        }
    },
    
    /**
     * Sync all data to Drive
     */
    async syncAll() {
        if (!this.isSignedIn) {
            throw new Error('Not signed in to Google');
        }
        
        try {
            // Export all local data
            const localData = await LifeToolStorage.exportData();
            
            // Save to Drive
            await this.saveToDrive('lifetool-backup.json', {
                version: 1,
                timestamp: new Date().toISOString(),
                data: localData
            });
            
            console.log('All data synced to Drive');
            return true;
        } catch (error) {
            console.error('Sync error:', error);
            throw error;
        }
    },
    
    /**
     * Restore all data from Drive
     */
    async restoreAll() {
        if (!this.isSignedIn) {
            throw new Error('Not signed in to Google');
        }
        
        try {
            const backup = await this.loadFromDrive('lifetool-backup.json');
            
            if (!backup) {
                console.log('No backup found in Drive');
                return false;
            }
            
            // Import data
            await LifeToolStorage.importData(backup.data);
            
            console.log('Data restored from Drive');
            return true;
        } catch (error) {
            console.error('Restore error:', error);
            throw error;
        }
    },
    
    /**
     * Get last sync time
     */
    async getLastSyncTime() {
        try {
            const file = await this.findFile('lifetool-backup.json');
            return file ? new Date(file.modifiedTime) : null;
        } catch (error) {
            console.error('Error getting sync time:', error);
            return null;
        }
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Don't auto-init here, let the page decide when to initialize
        console.log('Auth module loaded. Call LifeToolAuth.init() to start.');
    });
} else {
    console.log('Auth module loaded. Call LifeToolAuth.init() to start.');
}