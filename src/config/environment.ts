// Production-ready environment configuration

export const config = {
    // Environment
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    
    // Supabase Configuration
    supabase: {
        url: import.meta.env.VITE_SUPABASE_URL,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY, // Only use server-side
    },
    
    // App Configuration
    app: {
        name: 'We Care Wellness',
        version: '1.0.0',
        supportEmail: 'support@wecarewellness.com',
    },
    
    // Feature Flags
    features: {
        enableDebugMode: import.meta.env.DEV,
        enablePerformanceMonitoring: import.meta.env.PROD,
        enableErrorReporting: import.meta.env.PROD,
    },
    
    // API Configuration
    api: {
        timeout: 10000, // 10 seconds
        retryAttempts: 3,
        retryDelay: 1000, // 1 second
    },
    
    // Cache Configuration
    cache: {
        profileTTL: 10 * 60 * 1000, // 10 minutes (longer cache for profiles)
        availabilityTTL: 5 * 60 * 1000, // 5 minutes (longer cache for availability)
        componentCacheTTL: 30 * 60 * 1000, // 30 minutes for component cache
    },
    
    // Security Configuration
    security: {
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    }
};

// Validation
const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
];

const missingEnvVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
);

if (missingEnvVars.length > 0) {
    throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
}

export default config;