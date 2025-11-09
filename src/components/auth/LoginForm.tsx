import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

interface LoginFormProps {
    onSuccess?: () => void;
    onToggleMode?: () => void;
    showSignUpLink?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
    onSuccess,
    onToggleMode,
    showSignUpLink = true
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { signIn } = useAuthContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('🔐 LoginForm: Starting sign in process');
            const { data, error: signInError } = await signIn(email, password);

            if (signInError) {
                console.error('❌ LoginForm: Sign in error:', signInError);
                setError(signInError.message);
                setLoading(false);
                return;
            }

            if (data?.user) {
                console.log('✅ LoginForm: Sign in successful, user:', data.user.email);
                // Call onSuccess immediately and let the parent handle navigation
                onSuccess?.();
                setLoading(false);
            } else {
                console.error('❌ LoginForm: No user data returned');
                setError('Authentication failed. Please try again.');
                setLoading(false);
            }
        } catch (err: unknown) {
            console.error('💥 LoginForm: Exception during sign in:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-sage-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-serif text-secondary-800 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-secondary-600">
                        Sign in to access your dashboard
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-secondary-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-secondary-400" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full pl-10 pr-12 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sage-600 hover:bg-sage-700 disabled:bg-sage-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-6 text-center space-y-3">
                    <button
                        type="button"
                        className="text-sage-600 hover:text-sage-700 text-sm transition-colors"
                        onClick={() => {
                            // Handle forgot password
                            const email = prompt('Enter your email address:');
                            if (email) {
                                // You can implement forgot password functionality here
                                alert('Password reset functionality will be implemented');
                            }
                        }}
                    >
                        Forgot your password?
                    </button>

                    {showSignUpLink && onToggleMode && (
                        <div className="text-sm text-secondary-600">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={onToggleMode}
                                className="text-sage-600 hover:text-sage-700 font-medium transition-colors"
                            >
                                Sign up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginForm;