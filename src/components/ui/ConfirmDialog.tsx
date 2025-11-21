import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

export type DialogType = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: DialogType;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning'
}) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: 'text-red-600',
                    iconComponent: AlertTriangle,
                    confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    border: 'border-red-200'
                };
            case 'warning':
                return {
                    icon: 'text-yellow-600',
                    iconComponent: AlertTriangle,
                    confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
                    border: 'border-yellow-200'
                };
            case 'success':
                return {
                    icon: 'text-green-600',
                    iconComponent: CheckCircle,
                    confirmBtn: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
                    border: 'border-green-200'
                };
            default:
                return {
                    icon: 'text-blue-600',
                    iconComponent: AlertTriangle,
                    confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                    border: 'border-blue-200'
                };
        }
    };

    const styles = getTypeStyles();
    const IconComponent = styles.iconComponent;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border-2 ${styles.border}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <IconComponent className={`h-6 w-6 ${styles.icon}`} />
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    {type !== 'success' && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${styles.confirmBtn}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;