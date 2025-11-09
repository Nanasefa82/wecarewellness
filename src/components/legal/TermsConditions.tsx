import React from 'react';
import { FileText, Shield, AlertTriangle } from 'lucide-react';

const TermsConditions: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {/* Navigation */}
                    <div className="mb-6">
                        <a href="/" className="text-sage-600 hover:text-sage-700 transition-colors">
                            ← Back to Home
                        </a>
                    </div>

                    <div className="flex items-center space-x-3 mb-4">
                        <FileText className="w-8 h-8 text-sage-600" />
                        <h1 className="text-3xl font-serif text-secondary-800">Terms & Conditions</h1>
                    </div>
                    <p className="text-lg text-secondary-600 mb-6">
                        We Care Wellness LLC - Terms of Service and Website Usage
                    </p>

                    {/* Legal Pages Navigation */}
                    <div className="flex flex-wrap gap-4">
                        <a href="/privacy-policy" className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-sage-100 hover:text-sage-700 rounded-lg transition-colors">Privacy Policy</a>
                        <span className="px-3 py-1 bg-sage-100 text-sage-700 rounded-lg font-medium">Terms & Conditions</span>
                        <a href="/hipaa-notice" className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-sage-100 hover:text-sage-700 rounded-lg transition-colors">HIPAA Notice</a>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

                    {/* Acceptance of Terms */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-serif text-secondary-800 mb-4 flex items-center">
                            <Shield className="w-6 h-6 mr-3 text-sage-600" />
                            Acceptance of Terms
                        </h2>
                        <p className="text-secondary-700 leading-relaxed mb-4">
                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    {/* Website Usage */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Website Usage</h3>
                        <div className="space-y-4 text-secondary-700">
                            <p>
                                This website is provided for informational purposes only. The information contained on this website is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-yellow-800 font-medium mb-2">Important Medical Disclaimer</p>
                                        <p className="text-yellow-700">
                                            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Appointment Booking */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Appointment Booking and Cancellation</h3>
                        <div className="space-y-4 text-secondary-700">
                            <ul className="list-disc list-inside space-y-2">
                                <li>Appointments must be cancelled at least 24 hours in advance</li>
                                <li>Late cancellations or no-shows may be subject to fees</li>
                                <li>We reserve the right to reschedule appointments when necessary</li>
                                <li>Payment is due at the time of service unless other arrangements have been made</li>
                            </ul>
                        </div>
                    </section>

                    {/* Intellectual Property */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Intellectual Property</h3>
                        <div className="space-y-4 text-secondary-700">
                            <p>
                                All content included on this site, such as text, graphics, logos, images, and software, is the property of We Care Wellness LLC or its content suppliers and protected by copyright laws.
                            </p>
                        </div>
                    </section>

                    {/* Limitation of Liability */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Limitation of Liability</h3>
                        <div className="space-y-4 text-secondary-700">
                            <p>
                                We Care Wellness LLC shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to or use of this website.
                            </p>
                        </div>
                    </section>

                    {/* Changes to Terms */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Changes to Terms</h3>
                        <div className="space-y-4 text-secondary-700">
                            <p>
                                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website constitutes acceptance of the modified terms.
                            </p>
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="bg-sage-50 border border-sage-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Questions About These Terms</h3>
                        <p className="text-secondary-700 mb-4">
                            If you have any questions about these Terms & Conditions, please contact us:
                        </p>
                        <div className="space-y-2 text-secondary-700">
                            <p><strong>Email:</strong> info@wecarewellnessllc.com</p>
                            <p><strong>Phone:</strong> (703) 828-7620</p>
                            <p><strong>Address:</strong> 14623 Aurora Drive, Woodbridge, VA 22193</p>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-secondary-500 text-center">
                            Last updated: {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;