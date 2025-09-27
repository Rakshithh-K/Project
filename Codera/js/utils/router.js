// Routing utility for navigation management
class Router {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.previousPage = '/home';
        this.listeners = [];
    }

    getCurrentPage() {
        const hash = window.location.hash;
        const pathname = window.location.pathname;
        const href = window.location.href;
        
        console.log('=== INITIAL PAGE LOAD DEBUG ===');
        console.log('Full URL:', href);
        console.log('Hash:', hash);
        console.log('Pathname:', pathname);
        
        if (hash && hash.startsWith('#/')) {
            const page = hash.substring(1);
            console.log('Using hash route:', page);
            return page;
        }
        
        const fallback = pathname || '/';
        console.log('Using fallback route:', fallback);
        return fallback;
    }

    onRouteChange(callback) {
        this.listeners.push(callback);
        
        // Return cleanup function
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    notifyListeners(page) {
        this.listeners.forEach(callback => callback(page));
    }

    navigateTo(path) {
        // Store previous page before navigating to any new page
        if (this.currentPage !== path && !this.currentPage.startsWith('/profile')) {
            // Only update previous page if we're not currently on a profile page
            this.previousPage = this.currentPage;
        } else if (this.currentPage !== path && this.currentPage.startsWith('/profile') && !path.startsWith('/profile')) {
            // If leaving profile to go somewhere else, don't update previous page
            // Keep the original previous page intact
        } else if (this.currentPage !== path && !this.currentPage.startsWith('/profile') && path.startsWith('/profile')) {
            // If going to profile from non-profile page, store current as previous
            this.previousPage = this.currentPage;
        }
        
        this.currentPage = path;
        
        // Use hash-based routing for file:// protocol compatibility
        const hashPath = '#' + path;
        try {
            // Try pushState first
            if (window.location.protocol === 'file:') {
                // For file:// protocol, use hash routing only
                window.location.hash = path;
            } else {
                window.history.pushState({}, '', hashPath);
            }
        } catch (error) {
            // Fallback to hash routing if pushState fails
            console.log('Using hash routing fallback');
            window.location.hash = path;
        }

        this.notifyListeners(path);
    }

    toggleProfile() {
        if (this.currentPage.startsWith('/profile')) {
            // If currently on profile, go back to previous page
            this.navigateTo(this.previousPage);
        } else {
            // If not on profile, store current page and go to profile
            this.navigateTo('/profile');
        }
    }

    setupEventListeners() {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash && hash.startsWith('#/')) {
                const newPage = hash.substring(1); // Remove the # symbol
                if (newPage !== this.currentPage) {
                    this.currentPage = newPage;
                    this.notifyListeners(newPage);
                }
            } else {
                const newPage = window.location.pathname || '/';
                if (newPage !== this.currentPage) {
                    this.currentPage = newPage;
                    this.notifyListeners(newPage);
                }
            }
        };
        
        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('popstate', handleHashChange);
        
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('popstate', handleHashChange);
        };
    }

    parseRoute(path) {
        // Handle both path and query parameters from hash-based URLs
        const [pathname, queryString] = path.split('?');
        const pathSegments = pathname.split('/').filter(Boolean); // ['', 'practice', '1'] -> ['practice', '1']
        const baseRoute = `/${pathSegments[0] || ''}`;
        const id = pathSegments[1];
        const subRoute = pathSegments[1]; // for /battle/random or /battle/friends
        
        return {
            pathname,
            baseRoute,
            id,
            subRoute,
            pathSegments,
            queryString
        };
    }
}

// Create global router instance
window.router = new Router();