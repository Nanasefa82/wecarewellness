import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, AuthState, Profile } from '../hooks/useAuth';

interface AuthContextType extends AuthState {
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string, fullName?: string) => Promise<any>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<Profile>;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (password: string) => Promise<void>;
    refetchProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};