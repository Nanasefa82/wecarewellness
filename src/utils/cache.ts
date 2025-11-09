// Simple in-memory cache for performance optimization
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

class SimpleCache {
    private cache = new Map<string, CacheEntry<any>>();

    set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void { // Default 5 minutes
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        
        if (!entry) {
            return null;
        }

        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    clear(): void {
        this.cache.clear();
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    // Clear expired entries
    cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }
}

export const cache = new SimpleCache();

// Auto cleanup every 10 minutes
setInterval(() => {
    cache.cleanup();
}, 10 * 60 * 1000);