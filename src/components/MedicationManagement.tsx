import React from 'react';
import { Header, Footer } from './layout';
import { Pill, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const MedicationManagement: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-sage-600 to-sage-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Pill className="w-16 h-16 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            Medication Management
                        </h1>
                        <p className="text-xl text-sage-100 max-w-3xl mx-auto">
                            Comprehensive medication management services to help you safely and effectively manage your prescriptions
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Overview */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-secondary-800 mb-4">
                            Our Medication Management Services
                        </h2>
                        <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
                            We provide personalized medication management to ensure optimal treatment outcomes
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Service Card 1 */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                                <Pill className="w-6 h-6 text-sage-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                                Medication Review
                            </h3>
                            <p className="text-secondary-600">
                                Comprehensive review of all your medications to ensure safety, effectiveness, and proper dosing.
                            </p>
                        </div>

                        {/* Service Card 2 */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-sage-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                                Dosage Optimization
                            </h3>
                            <p className="text-secondary-600">
                                Fine-tuning medication dosages to achieve the best therapeutic outcomes with minimal side effects.
                            </p>
                        </div>

                        {/* Service Card 3 */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                                <AlertCircle className="w-6 h-6 text-sage-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                                Side Effect Management
                            </h3>
                            <p className="text-secondary-600">
                                Monitoring and managing medication side effects to improve your quality of life.
                            </p>
                        </div>

                        {/* Service Card 4 */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                                <CheckCircle className="w-6 h-6 text-sage-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                                Adherence Support
                            </h3>
                            <p className="text-secondary-600">
                                Strategies and support to help you take your medications as prescribed.
                            </p>
                        </div>

                        {/* Service Card 5 */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                                <Pill className="w-6 h-6 text-sage-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                                Drug Interaction Screening
                            </h3>
                            <p className="text-secondary-600">
                                Identifying and preventing potentially harmful drug interactions.
                            </p>
                        </div>

                        {/* Service Card 6 */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-sage-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                                Regular Monitoring
                            </h3>
                            <p className="text-secondary-600">
                                Ongoing monitoring and adjustments to ensure continued effectiveness.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-secondary-800 mb-6">
                                Why Medication Management Matters
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <CheckCircle className="w-6 h-6 text-sage-600 mr-3 flex-shrink-0 mt-1" />
                                    <p className="text-secondary-600">
                                        <strong>Improved Treatment Outcomes:</strong> Proper medication management leads to better symptom control and recovery.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-6 h-6 text-sage-600 mr-3 flex-shrink-0 mt-1" />
                                    <p className="text-secondary-600">
                                        <strong>Reduced Side Effects:</strong> Careful monitoring helps minimize unwanted side effects.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-6 h-6 text-sage-600 mr-3 flex-shrink-0 mt-1" />
                                    <p className="text-secondary-600">
                                        <strong>Cost Savings:</strong> Optimized medication regimens can reduce overall healthcare costs.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-6 h-6 text-sage-600 mr-3 flex-shrink-0 mt-1" />
                                    <p className="text-secondary-600">
                                        <strong>Better Quality of Life:</strong> Effective medication management improves daily functioning and well-being.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-sage-50 rounded-lg p-8">
                            <h3 className="text-2xl font-semibold text-secondary-800 mb-4">
                                What to Expect
                            </h3>
                            <ul className="space-y-3 text-secondary-600">
                                <li className="flex items-start">
                                    <span className="text-sage-600 mr-2">•</span>
                                    Comprehensive medication history review
                                </li>
                                <li className="flex items-start">
                                    <span className="text-sage-600 mr-2">•</span>
                                    Discussion of treatment goals and concerns
                                </li>
                                <li className="flex items-start">
                                    <span className="text-sage-600 mr-2">•</span>
                                    Personalized medication plan development
                                </li>
                                <li className="flex items-start">
                                    <span className="text-sage-600 mr-2">•</span>
                                    Regular follow-up and monitoring
                                </li>
                                <li className="flex items-start">
                                    <span className="text-sage-600 mr-2">•</span>
                                    Education about your medications
                                </li>
                                <li className="flex items-start">
                                    <span className="text-sage-600 mr-2">•</span>
                                    Coordination with your other healthcare providers
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-sage-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-serif font-bold mb-6">
                        Ready to Optimize Your Medication Management?
                    </h2>
                    <p className="text-xl text-sage-100 mb-8">
                        Schedule a consultation to discuss your medication needs
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/book-appointment"
                            className="px-8 py-3 bg-white text-sage-600 rounded-lg font-medium hover:bg-sage-50 transition-colors"
                        >
                            Schedule Appointment
                        </a>
                        <a
                            href="/contact"
                            className="px-8 py-3 bg-sage-700 text-white rounded-lg font-medium hover:bg-sage-800 transition-colors border border-sage-500"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default MedicationManagement;