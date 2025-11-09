import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const HipaaNotice: React.FC = () => {
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
                        <h1 className="text-3xl font-serif text-secondary-800">HIPAA Notice of Privacy Practices</h1>
                    </div>
                    <p className="text-lg text-secondary-600 mb-6">
                        We Care Wellness LLC - Notice of Privacy Practices for Protected Health Information
                    </p>

                    {/* Legal Pages Navigation */}
                    <div className="flex flex-wrap gap-4">
                        <a href="/privacy-policy" className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-sage-100 hover:text-sage-700 rounded-lg transition-colors">Privacy Policy</a>
                        <a href="/terms-conditions" className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-sage-100 hover:text-sage-700 rounded-lg transition-colors">Terms & Conditions</a>
                        <span className="px-3 py-1 bg-sage-100 text-sage-700 rounded-lg font-medium">HIPAA Notice</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

                    {/* Introduction */}
                    <section className="mb-8">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold text-blue-800 mb-3">Your Rights Regarding Your Health Information</h2>
                            <p className="text-blue-700">
                                This notice describes how medical information about you may be used and disclosed and how you can get access to this information. Please review it carefully.
                            </p>
                        </div>
                    </section>

                    {/* Our Commitment */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-serif text-secondary-800 mb-4 flex items-center">
                            <Lock className="w-6 h-6 mr-3 text-sage-600" />
                            Our Commitment to Your Privacy
                        </h2>
                        <div className="space-y-4 text-secondary-700">
                            <p>
                                We Care Wellness LLC is committed to protecting your health information. We are required by law to maintain the privacy of your protected health information (PHI) and to provide you with this notice of our legal duties and privacy practices.
                            </p>
                            <p>
                                We are required to follow the terms of this notice while it is in effect. We reserve the right to change the terms of this notice and to make new provisions effective for all PHI we maintain.
                            </p>
                        </div>
                    </section>

                    {/* How We Use and Disclose Information */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center">
                            <Eye className="w-5 h-5 mr-2 text-sage-600" />
                            How We May Use and Disclose Your Health Information
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-secondary-800 mb-2">For Treatment</h4>
                                <p className="text-secondary-700">
                                    We may use your health information to provide you with medical treatment or services. We may disclose health information about you to doctors, nurses, technicians, or other personnel who are involved in taking care of you.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-secondary-800 mb-2">For Payment</h4>
                                <p className="text-secondary-700">
                                    We may use and disclose your health information so that the treatment and services you receive may be billed and payment may be collected from you, an insurance company, or a third party.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-secondary-800 mb-2">For Healthcare Operations</h4>
                                <p className="text-secondary-700">
                                    We may use and disclose your health information for healthcare operations purposes, such as quality assessment and improvement activities, reviewing competence or qualifications of healthcare professionals, and conducting training programs.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Your Rights */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-sage-600" />
                            Your Rights Regarding Your Health Information
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-green-800 mb-2">Right to Request Restrictions</h4>
                                <p className="text-green-700">
                                    You have the right to request a restriction or limitation on the health information we use or disclose about you for treatment, payment, or healthcare operations.
                                </p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-green-800 mb-2">Right to Access</h4>
                                <p className="text-green-700">
                                    You have the right to inspect and copy your health information that may be used to make decisions about your care.
                                </p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-green-800 mb-2">Right to Amend</h4>
                                <p className="text-green-700">
                                    If you feel that health information we have about you is incorrect or incomplete, you may ask us to amend the information.
                                </p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-green-800 mb-2">Right to an Accounting</h4>
                                <p className="text-green-700">
                                    You have the right to request an accounting of disclosures of your health information made by us for certain purposes.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Complaints */}
                    <section className="mb-8">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Filing a Complaint</h3>
                        <div className="space-y-4 text-secondary-700">
                            <p>
                                If you believe your privacy rights have been violated, you may file a complaint with us or with the Secretary of the Department of Health and Human Services.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800 font-medium">
                                    We will not retaliate against you for filing a complaint.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="bg-sage-50 border border-sage-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-secondary-800 mb-4">Contact Information</h3>
                        <p className="text-secondary-700 mb-4">
                            For more information about our privacy practices or to file a complaint, contact:
                        </p>
                        <div className="space-y-2 text-secondary-700">
                            <p><strong>Privacy Officer:</strong> Dr. Emma Boateng</p>
                            <p><strong>Email:</strong> info@wecarewellnessllc.com</p>
                            <p><strong>Phone:</strong> (703) 828-7620</p>
                            <p><strong>Address:</strong> 14623 Aurora Drive, Woodbridge, VA 22193</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-sage-300">
                            <p className="text-sm text-secondary-600">
                                <strong>U.S. Department of Health and Human Services</strong><br />
                                Office for Civil Rights<br />
                                200 Independence Avenue, S.W.<br />
                                Washington, D.C. 20201<br />
                                Phone: 1-877-696-6775
                            </p>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-secondary-500 text-center">
                            Effective Date: {new Date().toLocaleDateString('en-US', {
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

export default HipaaNotice;