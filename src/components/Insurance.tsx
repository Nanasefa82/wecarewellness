import { CreditCard } from 'lucide-react';

const Insurance = () => {
    const handleCheckInsurance = () => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="insurance" className="bg-white py-24 lg:py-32">
            <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">

                {/* Section Header */}
                <div className="text-center mb-20 lg:mb-28">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-10 h-10 text-sage-600" />
                        </div>
                    </div>

                    <div className="text-secondary-500 text-base tracking-widest uppercase font-light mb-6">
                        ACCESSIBLE CARE FOR EVERYONE
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-800 leading-tight mb-8">
                        Accessible Mental Health Care for Everyone
                    </h2>
                    <p className="text-xl md:text-2xl text-secondary-600 leading-relaxed font-light">
                        Insurance & Self-Pay Options
                    </p>
                </div>

                {/* Content */}
                <div className="w-full">
                    <div className="bg-sage-50 p-12 lg:p-16 rounded-lg shadow-sm border border-sage-200 mb-16 lg:mb-20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                            {/* Insurance Accepted */}
                            <div className="space-y-6">
                                <h3 className="text-2xl md:text-3xl font-serif text-secondary-800 leading-tight">
                                    Insurance Plans Accepted
                                </h3>
                                <p className="text-lg md:text-xl text-secondary-600 leading-relaxed font-light">
                                    We accept most major insurance plans and continually expand our partnerships
                                    to make quality care more accessible.
                                </p>
                                <ul className="space-y-3 text-lg text-secondary-600 font-light">
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                                        <span>Most major insurance providers</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                                        <span>Medicare and Medicaid</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                                        <span>Employee assistance programs</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                                        <span>Flexible spending accounts (FSA/HSA)</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Self-Pay Options */}
                            <div className="space-y-6">
                                <h3 className="text-2xl md:text-3xl font-serif text-secondary-800 leading-tight">
                                    Self-Pay Options
                                </h3>
                                <p className="text-lg md:text-xl text-secondary-600 leading-relaxed font-light">
                                    Self-pay options are available for individuals without insurance coverage
                                    or those who prefer to pay directly.
                                </p>
                                <ul className="space-y-3 text-lg text-secondary-600 font-light">
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                                        <span>Competitive self-pay rates</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                                        <span>Flexible payment plans available</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                                        <span>No insurance pre-authorization required</span>
                                    </li>
                                    <li className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                                        <span>Immediate scheduling availability</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Insurance Providers */}
                    <div className="mb-16 lg:mb-20">
                        <div className="text-center mb-12">
                            <h3 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-4">
                                Accepted Insurance Providers
                            </h3>
                            <p className="text-lg text-secondary-600 font-light">
                                We work with these major insurance companies and many more
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-10 items-center">
                            {/* Virginia Premier */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/virginiapremier-1.jpg"
                                    alt="Virginia Premier"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* Optima Health */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/optimahealth-1.jpg"
                                    alt="Optima Health"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* Kaiser Permanente
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/kaiser-1.jpg"
                                    alt="Kaiser Permanente"
                                    className="h-16 w-auto object-contain"
                                />
                            </div> */}

                            {/* Humana */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/humana-1.jpg"
                                    alt="Humana"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* Blue Cross Blue Shield */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/BlueCrossBlueShield-1.jpg"
                                    alt="Blue Cross Blue Shield"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* Sentara */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/sentara-1.jpg"
                                    alt="Sentara"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* Quest Behavioral Health */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/questbh-1.jpg"
                                    alt="Quest Behavioral Health"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* Military OneSource */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/militaryonesource-1.jpg"
                                    alt="Military OneSource"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* Magellan Health */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/megellahealth-1.jpg"
                                    alt="Magellan Health"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* Aetna */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/Aetna_Logo_ss_Violet_RGB_Coated-1.jpg"
                                    alt="Aetna"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* Medicare */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/medicare-1.jpg"
                                    alt="Medicare"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* Medicaid */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/medicaid-1.jpg"
                                    alt="Medicaid"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* Cigna */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/cigna-1.jpg"
                                    alt="Cigna"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* United Healthcare */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/unitedhealthcare-1.jpg"
                                    alt="United Healthcare"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* CareFirst */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/carefirst-1.jpg"
                                    alt="CareFirst"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* Anthem */}
                            <div className="flex items-center justify-center p-8 lg:p-10 bg-white rounded-xl shadow-md border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 min-h-[120px]">
                                <img
                                    src="/images/Anthem-1.jpg"
                                    alt="Anthem"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <p className="text-base text-secondary-500 font-light italic">
                                Don't see your insurance provider? Contact us to verify coverage for your specific plan.
                            </p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                            <button
                                onClick={handleCheckInsurance}
                                className="px-10 py-5 bg-secondary-200 hover:bg-secondary-300 text-secondary-800 transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
                            >
                                CHECK ACCEPTED INSURANCE
                            </button>
                            <button
                                onClick={handleCheckInsurance}
                                className="px-10 py-5 bg-sage-600 hover:bg-sage-700 text-white transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
                            >
                                BOOK A CONSULTATION
                            </button>
                        </div>
                        <p className="text-lg md:text-xl text-secondary-600 font-light">
                            Contact us to verify your insurance coverage or discuss self-pay options
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Insurance;