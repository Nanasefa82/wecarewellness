import { DollarSign, FileText, Shield, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import { Header, Footer } from './layout';

const FeesInsurance = () => {
    const insuranceProviders = [
        { name: "Virginia Premier", logo: "/images/virginiapremier-1.jpg" },
        { name: "Optima Health", logo: "/images/optimahealth-1.jpg" },
        { name: "Kaiser Permanente", logo: "/images/kaiser-1.jpg" },
        { name: "Humana", logo: "/images/humana-1.jpg" },
        { name: "Blue Cross Blue Shield", logo: "/images/BlueCrossBlueShield-1.jpg" },
        { name: "Sentara", logo: "/images/sentara-1.jpg" },
        { name: "Quest Behavioral Health", logo: "/images/questbh-1.jpg" },
        { name: "Military OneSource", logo: "/images/militaryonesource-1.jpg" },
        { name: "Magellan Health", logo: "/images/megellahealth-1.jpg" },
        { name: "Aetna", logo: "/images/Aetna_Logo_ss_Violet_RGB_Coated-1.jpg" },
        { name: "Medicare", logo: "/images/medicare-1.jpg" },
        { name: "Medicaid", logo: "/images/medicaid-1.jpg" },
        { name: "Cigna", logo: "/images/cigna-1.jpg" },
        { name: "United Healthcare", logo: "/images/unitedhealthcare-1.jpg" },
        { name: "CareFirst", logo: "/images/carefirst-1.jpg" },
        { name: "Anthem", logo: "/images/Anthem-1.jpg" }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-sage-600 to-sage-700 py-16 lg:py-20">
                <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
                    <div className="text-center text-white">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <DollarSign className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-4">
                            Fees & Insurance Information
                        </h1>
                        <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
                            Transparent pricing and comprehensive insurance coverage for accessible mental health care
                        </p>
                    </div>
                </div>
            </section>

            {/* Service Fees Section */}
            <section className="bg-white py-16 lg:py-20">
                <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif text-secondary-800 mb-4">
                            Service Fees
                        </h2>
                        <p className="text-lg text-secondary-600 font-light max-w-3xl">
                            Our fees are competitive with Virginia mental health industry standards and reflect the quality of care provided by our licensed professionals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Initial Psychiatric Evaluation */}
                        <div className="bg-sage-50 p-8 rounded-2xl border border-sage-200 hover:shadow-lg transition-shadow">
                            <div className="mb-4">
                                <FileText className="w-10 h-10 text-sage-600 mb-3" />
                                <h3 className="text-2xl font-serif text-secondary-800 mb-2">
                                    Initial Psychiatric Evaluation
                                </h3>
                                <p className="text-sm text-secondary-500 uppercase tracking-wide">60-90 minutes</p>
                            </div>
                            <p className="text-secondary-600 font-light">
                                Comprehensive assessment including diagnostic evaluation, treatment planning, and initial recommendations. Contact us for current rates and insurance coverage details.
                            </p>
                        </div>

                        {/* Follow-up Medication Management */}
                        <div className="bg-sage-50 p-8 rounded-2xl border border-sage-200 hover:shadow-lg transition-shadow">
                            <div className="mb-4">
                                <Shield className="w-10 h-10 text-sage-600 mb-3" />
                                <h3 className="text-2xl font-serif text-secondary-800 mb-2">
                                    Medication Management
                                </h3>
                                <p className="text-sm text-secondary-500 uppercase tracking-wide">15-30 minutes</p>
                            </div>
                            <p className="text-secondary-600 font-light">
                                Follow-up visits for medication monitoring, adjustment, and ongoing psychiatric care. Fees vary based on session length and complexity.
                            </p>
                        </div>

                        {/* Psychotherapy Session */}
                        <div className="bg-sage-50 p-8 rounded-2xl border border-sage-200 hover:shadow-lg transition-shadow">
                            <div className="mb-4">
                                <CheckCircle className="w-10 h-10 text-sage-600 mb-3" />
                                <h3 className="text-2xl font-serif text-secondary-800 mb-2">
                                    Psychotherapy Session
                                </h3>
                                <p className="text-sm text-secondary-500 uppercase tracking-wide">45-60 minutes</p>
                            </div>
                            <p className="text-secondary-600 font-light">
                                Individual therapy sessions including cognitive behavioral therapy, supportive therapy, and counseling. Insurance typically covers these services.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <p className="text-secondary-700 font-light">
                                    <strong className="font-medium">Please Note:</strong> Service fees are competitive with Virginia mental health industry standards. Insurance coverage may significantly reduce your out-of-pocket costs. Contact us for detailed pricing information and to verify your insurance benefits.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Insurance Coverage Section */}
            <section className="bg-sage-50 py-16 lg:py-20">
                <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif text-secondary-800 mb-4">
                            Insurance Coverage
                        </h2>
                        <p className="text-lg text-secondary-600 font-light max-w-3xl">
                            We are in-network with most major insurance providers in Virginia and accept Medicare and Medicaid.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* What's Covered */}
                        <div className="bg-white p-8 rounded-2xl shadow-md">
                            <h3 className="text-2xl font-serif text-secondary-800 mb-6">
                                Typically Covered Services
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-1" />
                                    <span className="text-secondary-600">Psychiatric diagnostic evaluations</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-1" />
                                    <span className="text-secondary-600">Medication management and monitoring</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-1" />
                                    <span className="text-secondary-600">Individual psychotherapy</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-1" />
                                    <span className="text-secondary-600">Crisis intervention services</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-1" />
                                    <span className="text-secondary-600">Treatment for mental health conditions</span>
                                </li>
                            </ul>
                        </div>

                        {/* Your Responsibility */}
                        <div className="bg-white p-8 rounded-2xl shadow-md">
                            <h3 className="text-2xl font-serif text-secondary-800 mb-6">
                                Your Financial Responsibility
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start space-x-3">
                                    <div className="w-5 h-5 bg-sage-200 rounded-full flex-shrink-0 mt-1"></div>
                                    <div>
                                        <p className="text-secondary-800 font-medium">Copayment</p>
                                        <p className="text-secondary-600 text-sm">Fixed amount per visit</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-5 h-5 bg-sage-200 rounded-full flex-shrink-0 mt-1"></div>
                                    <div>
                                        <p className="text-secondary-800 font-medium">Deductible</p>
                                        <p className="text-secondary-600 text-sm">Annual amount before insurance coverage begins</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-5 h-5 bg-sage-200 rounded-full flex-shrink-0 mt-1"></div>
                                    <div>
                                        <p className="text-secondary-800 font-medium">Coinsurance</p>
                                        <p className="text-secondary-600 text-sm">Percentage of costs after deductible</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-5 h-5 bg-sage-200 rounded-full flex-shrink-0 mt-1"></div>
                                    <div>
                                        <p className="text-secondary-800 font-medium">Out-of-Network Fees</p>
                                        <p className="text-secondary-600 text-sm">Higher costs if we're not in your network</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Important Insurance Information */}
                    <div className="bg-white p-8 rounded-2xl shadow-md">
                        <h3 className="text-2xl font-serif text-secondary-800 mb-6">
                            Important Insurance Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-medium text-secondary-800 mb-3">Before Your First Visit</h4>
                                <ul className="space-y-2 text-secondary-600">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-sage-600">•</span>
                                        <span>Verify your mental health benefits with your insurance company</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-sage-600">•</span>
                                        <span>Confirm we are in-network with your plan</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-sage-600">•</span>
                                        <span>Ask about copay, deductible, and coinsurance amounts</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-sage-600">•</span>
                                        <span>Check if prior authorization is required</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-medium text-secondary-800 mb-3">What to Bring</h4>
                                <ul className="space-y-2 text-secondary-600">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-sage-600">•</span>
                                        <span>Current insurance card (front and back)</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-sage-600">•</span>
                                        <span>Photo identification</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-sage-600">•</span>
                                        <span>List of current medications</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-sage-600">•</span>
                                        <span>Payment method for copay/deductible</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Accepted Insurance Providers */}
            <section className="bg-white py-16 lg:py-20">
                <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif text-secondary-800 mb-4">
                            Accepted Insurance Providers
                        </h2>
                        <p className="text-lg text-secondary-600 font-light max-w-3xl mx-auto">
                            We are proud to work with these insurance companies to make mental health care accessible
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {insuranceProviders.map((provider, index) => (
                            <div 
                                key={index}
                                className="flex items-center justify-center p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]"
                            >
                                <img
                                    src={provider.logo}
                                    alt={provider.name}
                                    className="h-12 w-auto object-contain"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <p className="text-secondary-600 font-light italic">
                            Don't see your insurance provider? Contact us to verify coverage for your specific plan.
                        </p>
                    </div>
                </div>
            </section>

            {/* Payment Options */}
            <section className="bg-sage-50 py-16 lg:py-20">
                <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif text-secondary-800 mb-4">
                            Payment Options & Policies
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Payment Methods */}
                        <div className="bg-white p-8 rounded-2xl shadow-md">
                            <h3 className="text-2xl font-serif text-secondary-800 mb-6">
                                Accepted Payment Methods
                            </h3>
                            <ul className="space-y-3 text-secondary-600">
                                <li className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-sage-600" />
                                    <span>Major credit cards (Visa, MasterCard, Discover, Amex)</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-sage-600" />
                                    <span>Debit cards</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-sage-600" />
                                    <span>Health Savings Account (HSA)</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-sage-600" />
                                    <span>Flexible Spending Account (FSA)</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <CheckCircle className="w-5 h-5 text-sage-600" />
                                    <span>Cash or check</span>
                                </li>
                            </ul>
                        </div>

                        {/* Financial Policies */}
                        <div className="bg-white p-8 rounded-2xl shadow-md">
                            <h3 className="text-2xl font-serif text-secondary-800 mb-6">
                                Financial Policies
                            </h3>
                            <ul className="space-y-3 text-secondary-600">
                                <li className="flex items-start space-x-3">
                                    <div className="w-5 h-5 bg-sage-200 rounded-full flex-shrink-0 mt-1"></div>
                                    <span>Payment is due at time of service</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-5 h-5 bg-sage-200 rounded-full flex-shrink-0 mt-1"></div>
                                    <span>24-hour cancellation notice required to avoid fees</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-5 h-5 bg-sage-200 rounded-full flex-shrink-0 mt-1"></div>
                                    <span>Missed appointments may be charged full fee</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-5 h-5 bg-sage-200 rounded-full flex-shrink-0 mt-1"></div>
                                    <span>Payment plans available for self-pay patients</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-5 h-5 bg-sage-200 rounded-full flex-shrink-0 mt-1"></div>
                                    <span>Sliding scale fees may be available based on financial need</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white py-16 lg:py-20">
                <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif text-secondary-800 mb-4">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-6 max-w-4xl">
                        <div className="bg-sage-50 p-6 rounded-xl">
                            <h3 className="text-lg font-medium text-secondary-800 mb-2">
                                Do you accept my insurance?
                            </h3>
                            <p className="text-secondary-600 font-light">
                                We accept most major insurance plans in Virginia. Please contact our office with your insurance information, and we'll verify your coverage and benefits before your first appointment.
                            </p>
                        </div>

                        <div className="bg-sage-50 p-6 rounded-xl">
                            <h3 className="text-lg font-medium text-secondary-800 mb-2">
                                What if I don't have insurance?
                            </h3>
                            <p className="text-secondary-600 font-light">
                                We offer competitive self-pay rates and flexible payment plans. We also offer a sliding scale fee structure based on financial need. Contact us to discuss your options.
                            </p>
                        </div>

                        <div className="bg-sage-50 p-6 rounded-xl">
                            <h3 className="text-lg font-medium text-secondary-800 mb-2">
                                How do I know what my insurance will cover?
                            </h3>
                            <p className="text-secondary-600 font-light">
                                Call the customer service number on your insurance card and ask about your mental health benefits, including copay amounts, deductibles, and whether prior authorization is required for psychiatric services.
                            </p>
                        </div>

                        <div className="bg-sage-50 p-6 rounded-xl">
                            <h3 className="text-lg font-medium text-secondary-800 mb-2">
                                What is your cancellation policy?
                            </h3>
                            <p className="text-secondary-600 font-light">
                                We require 24-hour notice for cancellations. Late cancellations or missed appointments may be charged the full session fee, which is typically not covered by insurance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-gradient-to-br from-sage-600 to-sage-700 py-16">
                <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
                    <div className="text-center text-white">
                        <Phone className="w-12 h-12 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-serif mb-4">
                            Questions About Fees or Insurance?
                        </h2>
                        <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto">
                            Our billing team is here to help you understand your coverage and payment options
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => window.location.href = '/contact'}
                                className="px-8 py-4 bg-white hover:bg-gray-100 text-sage-700 transition-all duration-300 text-sm tracking-widest uppercase font-medium rounded-full shadow-lg"
                            >
                                CONTACT US
                            </button>
                            <button
                                onClick={() => window.location.href = '/book-appointment'}
                                className="px-8 py-4 bg-secondary-800 hover:bg-secondary-900 text-white transition-all duration-300 text-sm tracking-widest uppercase font-medium rounded-full shadow-lg"
                            >
                                BOOK APPOINTMENT
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default FeesInsurance;
