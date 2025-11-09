import React from 'react';
import { X, Calendar, Phone, Mail } from 'lucide-react';

interface SimpleBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SimpleBookingModal: React.FC<SimpleBookingModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleFullBooking = () => {
        // Redirect to full booking calendar
        window.location.href = '/book-appointment';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-sage-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-serif text-secondary-800 mb-2">
                            Book Your Appointment
                        </h2>
                        <p className="text-secondary-600">
                            Choose how you'd like to schedule your consultation
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleFullBooking}
                            className="w-full p-4 bg-sage-600 hover:bg-sage-700 text-white rounded-lg transition-colors text-left"
                        >
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-5 h-5" />
                                <div>
                                    <div className="font-medium">Online Booking</div>
                                    <div className="text-sm text-sage-100">View available times and book instantly</div>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => window.location.href = 'tel:703-828-7620'}
                            className="w-full p-4 border-2 border-sage-600 text-sage-600 hover:bg-sage-50 rounded-lg transition-colors text-left"
                        >
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5" />
                                <div>
                                    <div className="font-medium">Call to Book</div>
                                    <div className="text-sm text-sage-600">(703) 828-7620</div>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => window.location.href = 'mailto:info@wecarewellnessllc.com'}
                            className="w-full p-4 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5" />
                                <div>
                                    <div className="font-medium">Email Us</div>
                                    <div className="text-sm text-gray-500">info@wecarewellnessllc.com</div>
                                </div>
                            </div>
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            We typically respond within 24 hours
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleBookingModal;