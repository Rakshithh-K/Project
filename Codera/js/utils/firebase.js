// Firebase configuration and initialization
class FirebaseUtils {
    constructor() {
        this.app = null;
        this.db = null;
        this.auth = null;
        this.isInitialized = false;
    }

    getFirebaseConfig() {
        return {
            apiKey: "AIzaSyCdl2AhZG9HBwDLcSENTroup0ryR7_NdW8",
            authDomain: "codera-battle.firebaseapp.com",
            projectId: "codera-battle",
            storageBucket: "codera-battle.firebasestorage.app",
            messagingSenderId: "825772579105",
            appId: "1:825772579105:web:583045e4bb94c7f9af0660",
            measurementId: "G-G10VGFQVBN"
        };
    }

    async initialize() {
        console.log('🔄 Starting Firebase initialization...');
        console.log('Firebase available:', !!window.firebase);
        
        try {
            const firebaseConfig = this.getFirebaseConfig();
            
            console.log('🔍 Firebase config check:');
            console.log('API Key present:', !!firebaseConfig.apiKey);
            console.log('Project ID:', firebaseConfig.projectId);
            console.log('Firebase global object:', !!window.firebase);
            
            // Check if Firebase config is provided
            if (firebaseConfig.apiKey && firebaseConfig.projectId && window.firebase) {
                console.log('Initializing Firebase for global communication...');
                
                // Initialize Firebase app using compat API
                this.app = firebase.initializeApp(firebaseConfig);
                this.db = firebase.firestore();
                this.auth = firebase.auth();
                
                console.log('✅ Firebase app initialized:', this.app.name);
                console.log('✅ Firestore initialized');
                console.log('✅ Auth initialized');
                
                this.isInitialized = true;
                return { app: this.app, db: this.db, auth: this.auth };
            } else {
                console.log('Firebase config not provided, authentication required');
                console.log('To enable authentication, add your Firebase config above.');
                
                // No authentication without Firebase
                return { app: null, db: null, auth: null };
            }
        } catch (error) {
            console.error("Error in Firebase initialization:", error);
            return { app: null, db: null, auth: null };
        }
    }

    setupAuthListener(callback) {
        if (this.auth) {
            return this.auth.onAuthStateChanged(callback);
        }
        return () => {}; // Return empty cleanup function
    }

    async signOut() {
        if (this.auth) {
            return await this.auth.signOut();
        }
    }

    async signInWithEmailAndPassword(email, password) {
        if (this.auth) {
            return await this.auth.signInWithEmailAndPassword(email, password);
        }
        throw new Error('Firebase auth not initialized');
    }

    async createUserWithEmailAndPassword(email, password) {
        if (this.auth) {
            return await this.auth.createUserWithEmailAndPassword(email, password);
        }
        throw new Error('Firebase auth not initialized');
    }

    async signInWithGoogle() {
        if (this.auth) {
            const provider = new firebase.auth.GoogleAuthProvider();
            return await this.auth.signInWithPopup(provider);
        }
        throw new Error('Firebase auth not initialized');
    }

    async signInAnonymously() {
        if (this.auth) {
            return await this.auth.signInAnonymously();
        }
        throw new Error('Firebase auth not initialized');
    }
}

// Create global instance
window.firebaseUtils = new FirebaseUtils();