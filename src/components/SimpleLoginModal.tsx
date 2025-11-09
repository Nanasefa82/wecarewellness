import React from 'react';
import { X } from 'lucide-react';
import LoginForm from './auth/LoginForm';

interface SimpleLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SimpleLoginModal: React.FC<SimpleLoginModalProps> = ({ isOpen, onClose }) => {
    console.log('🔄 SimpleLoginModal render - isOpen:', isOpen);

    if (!isOpen) return null;

    const handleLoginSuccess = () => {
        console.log('🎉 SimpleLoginModal handleLoginSuccess called');
        // Close modal first
        onClose();

        // Small delay to ensure modal closes, then redirect
        setTimeout(() => {
            console.log('🚀 Redirecting to /admin/dashboard');
            window.location.href = '/admin/dashboard';
        }, 100);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Close login modal"
                    aria-label="Close login modal"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <LoginForm
                        onSuccess={handleLoginSuccess}
                        showSignUpLink={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default SimpleLoginModal;