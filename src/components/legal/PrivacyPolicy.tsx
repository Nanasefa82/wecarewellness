import React from 'react';
import { Shield, Mail, Phone, MapPin, FileText, User } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
                        <Shield className="w-8 h-8 text-sage-600" />
                        <h1 className="text-3xl font-serif text-secondary-800">Privacy Policy</h1>
                    </div>
                    <p className="text-lg text-secondary-600 mb-6">
                        We Care Wellness LLC - Protecting Your Privacy and Personal Information
                    </p>

                    {/* Legal Pages Navigation */}
                    <div className="flex flex-wrap gap-4">
                        <span className="px-3 py-1 bg-sage-100 text-sage-700 rounded-lg font-medium">Privacy Policy</span>
                        <a href="/terms-conditions" className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-sage-100 hover:text-sage-700 rounded-lg transition-colors">Terms & Conditions</a>
                        <a href="/hipaa-notice" className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-sage-100 hover:text-sage-700 rounded-lg transition-colors">HIPAA Notice</a>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

                    {/* Privacy Statement */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-serif text-secondary-800 mb-4 flex items-center">
                            <FileText className="w-6 h-6 mr-3 text-sage-600" />
                            Privacy Statement
                        </h2>
                        <p className="text-secondary-700 leading-relaxed mb-4">
                            We are committed to protecting your privacy and providing a safe online experience. This Privacy Statement applies to our Practice's website and governs our data collection and usage practices. By using this website, you consent to the data practices described in this Privacy Statement.
                        </p>
                    </section>

                    {/* Collection of Personal Information */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Collection of Your Personal Information</h3>
                        <div className="space-y-4 text-secondary-700">
                            <p>
                                This Practice collects personally identifiable information provided by you, such as your e-mail address, name, home or work address or telephone number. This Practice also collects anonymous demographic information, which is not unique to you, such as your ZIP code, age, gender, preferences, interests, and favorites.
                            </p>
                            <p>
                                There is also information about your computer hardware and software that is automatically collected by this website. This information can include: your IP address, browser type, domain names, access times and referring website addresses. This information is used for the operation of the service, to maintain quality of the service, and to provide general statistics regarding use of this website.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800">
                                    <strong>Important:</strong> Please keep in mind that if you directly disclose personally identifiable information or personally sensitive data through public message boards, this information may be collected and used by others.
                                </p>
                            </div>
                            <p>
                                This Practice encourages you to review the privacy statements of websites you choose to link to from the website so that you can understand how those websites collect, use and share your information. This Practice is not responsible for the privacy statements or other content on any other websites.
                            </p>
                        </div>
                    </section>

                    {/* Use of Personal Information */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Use of Your Personal Information</h3>
                        <div className="space-y-4 text-secondary-700">
                            <p>
                                This Practice collects and uses your personal information to operate the website and deliver the services you have requested. This Practice also uses your personally identifiable information to inform you of other products or services available from this Practice and its affiliates.
                            </p>
                            <p>
                                This Practice may also contact you via surveys to conduct research about your opinion of current services or of potential new services that may be offered.
                            </p>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-800">
                                    <strong>Your Data Protection:</strong> This Practice does not sell, rent or lease its customer lists to third parties.
                                </p>
                            </div>
                            <p>
                                This Practice may share data with trusted partners to help us perform statistical analysis, send you email or postal mail, provide customer support, or arrange for deliveries. All such third parties are prohibited from using your personal information except to provide these services and they are required to maintain the confidentiality of your information.
                            </p>
                            <p>
                                This Practice does not use or disclose sensitive personal information, such as race, religion, or political affiliations, without your explicit consent. This Practice will disclose your personal information, without notice, only if required to do so by law.
                            </p>
                        </div>
                    </section>

                    {/* Use of Cookies */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Use of Cookies</h3>
                        <div className="space-y-4 text-secondary-700">
                            <p>
                                The website uses "cookies" to help this Practice personalize your online experience. A cookie is a text file that is placed on your hard disk by a webpage server. Cookies cannot be used to run programs or deliver viruses to your computer. Cookies are uniquely assigned to you and can only be read by a web server in the domain that issued the cookie to you.
                            </p>
                        </div>
                    </section>

                    {/* Security */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Security of Your Personal Information</h3>
                        <div className="space-y-4 text-secondary-700">
                            <p>
                                This Practice secures your personal information from unauthorized access, use or disclosure. This Practice secures the personally identifiable information you provide on computer servers in a controlled, secure environment, protected from unauthorized access, use or disclosure.
                            </p>
                            <p>
                                When personal information (such as a credit card number) is transmitted to other websites, it is protected using encryption, such as the Secure Socket Layer (SSL) protocol.
                            </p>
                        </div>
                    </section>

                    {/* Changes to Statement */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Changes to this Statement</h3>
                        <div className="space-y-4 text-secondary-700">
                            <p>
                                This Practice will occasionally update this Privacy Statement to reflect company and customer feedback. We encourage you to periodically review this Privacy Statement to be informed of how this Practice is protecting your information.
                            </p>
                            <p>
                                We support your right to the privacy of your health information. We will not retaliate in any way if you choose to file a complaint with us or with the U.S. Department of Health and Human Services.
                            </p>
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="bg-sage-50 border border-sage-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Privacy Contact Officer</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <User className="w-5 h-5 text-sage-600" />
                                <span className="text-secondary-700">
                                    <strong>Dr. Emma Boateng</strong>
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-sage-600" />
                                <a
                                    href="mailto:info@wecarewellnessllc.com"
                                    className="text-sage-600 hover:text-sage-700 transition-colors"
                                >
                                    info@wecarewellnessllc.com
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-sage-600" />
                                <a
                                    href="tel:703-828-7620"
                                    className="text-sage-600 hover:text-sage-700 transition-colors"
                                >
                                    (703) 828-7620
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-sage-600" />
                                <span className="text-secondary-700">
                                    14623 Aurora Drive, Woodbridge, VA 22193
                                </span>
                            </div>
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

export default PrivacyPolicy;