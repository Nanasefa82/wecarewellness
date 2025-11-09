import { MapPin, Phone, Mail } from 'lucide-react';
import { ContactInfo } from '../types';

const Contact = () => {
    const contactInfo: ContactInfo = {
        address: '14623 Aurora Drive, Woodbridge, VA 22193',
        phone: '703-828-7620',
        email: 'info@wecarewellnessllc.com'
    };

    const handlePhoneClick = () => {
        window.location.href = `tel:${contactInfo.phone}`;
    };

    const handleEmailClick = () => {
        window.location.href = `mailto:${contactInfo.email}`;
    };

    return (
        <section id="contact" className="bg-sage-50 py-24 lg:py-32">
            <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">

                {/* Section Header */}
                <div className="text-center mb-20 lg:mb-28">
                    <div className="text-secondary-500 text-base tracking-widest uppercase font-light mb-6">
                        GET IN TOUCH
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-800 leading-tight mb-8 max-w-4xl mx-auto">
                        Contact Us
                    </h2>
                    <p className="text-xl md:text-2xl text-secondary-600 leading-relaxed max-w-3xl mx-auto font-light">
                        Ready to take the first step toward better mental health?
                        We're here to help you begin your journey to wellness.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 xl:gap-32">

                    {/* Contact Information */}
                    <div className="space-y-12">
                        <h3 className="text-3xl md:text-4xl font-serif text-secondary-800 leading-tight">
                            Get in Touch
                        </h3>

                        <div className="space-y-8">
                            {/* Address */}
                            <div className="flex items-start space-x-6 p-8 bg-white rounded-lg shadow-sm border border-sage-200">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                                        <MapPin className="w-8 h-8 text-sage-600" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xl md:text-2xl font-serif text-secondary-800 mb-3">
                                        Our Location
                                    </h4>
                                    <p className="text-lg text-secondary-600 font-light">
                                        {contactInfo.address}
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start space-x-6 p-8 bg-white rounded-lg shadow-sm border border-sage-200">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                                        <Phone className="w-8 h-8 text-sage-600" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xl md:text-2xl font-serif text-secondary-800 mb-3">
                                        Phone
                                    </h4>
                                    <button
                                        onClick={handlePhoneClick}
                                        className="text-lg text-sage-600 hover:text-sage-700 font-light transition-colors"
                                    >
                                        {contactInfo.phone}
                                    </button>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start space-x-6 p-8 bg-white rounded-lg shadow-sm border border-sage-200">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                                        <Mail className="w-8 h-8 text-sage-600" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xl md:text-2xl font-serif text-secondary-800 mb-3">
                                        Email
                                    </h4>
                                    <button
                                        onClick={handleEmailClick}
                                        className="text-lg text-sage-600 hover:text-sage-700 font-light transition-colors"
                                    >
                                        {contactInfo.email}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-12">
                        <h3 className="text-3xl md:text-4xl font-serif text-secondary-800 leading-tight">
                            We Care Wellness LLC
                        </h3>

                        <div className="bg-white p-8 lg:p-10 rounded-lg shadow-sm border border-sage-200 space-y-8">
                            <div>
                                <h4 className="text-xl md:text-2xl font-serif text-secondary-800 mb-4">
                                    Our Mission
                                </h4>
                                <p className="text-lg text-secondary-600 leading-relaxed font-light">
                                    To promote mental health awareness, empower individuals and increase access to treatment and services for individuals with mental illnesses.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xl md:text-2xl font-serif text-secondary-800 mb-4">
                                    Our Vision
                                </h4>
                                <p className="text-lg text-secondary-600 leading-relaxed font-light">
                                    Our vision is to provide mental wellness, competent and quality care to improve the lives of individuals across the life span and their families to improve their quality of life.
                                </p>
                            </div>
                        </div>

                        <div className="bg-sage-100 p-8 lg:p-10 rounded-lg">
                            <h4 className="text-xl md:text-2xl font-serif text-secondary-800 mb-6">
                                Office Hours
                            </h4>
                            <div className="space-y-3 text-lg text-secondary-600 font-light">
                                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                <p>Saturday: 10:00 AM - 4:00 PM</p>
                                <p>Sunday: Closed</p>
                                <p className="text-base mt-6 italic text-secondary-500">
                                    Virtual appointments available outside regular hours
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center mt-16 lg:mt-20">
                    <div className="bg-white p-12 lg:p-16 rounded-lg shadow-sm border border-sage-200">
                        <h3 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-6">
                            Ready to Begin Your Journey?
                        </h3>
                        <p className="text-lg md:text-xl text-secondary-600 font-light mb-8 max-w-2xl mx-auto">
                            Take the first step toward better mental health. Schedule your consultation today.
                        </p>
                        <button
                            onClick={() => {
                                window.location.href = 'tel:703-828-7620';
                            }}
                            className="px-12 py-6 bg-sage-600 hover:bg-sage-700 text-white transition-all duration-300 text-lg tracking-widest uppercase font-medium rounded-full"
                        >
                            BOOK YOUR CONSULTATION NOW
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;