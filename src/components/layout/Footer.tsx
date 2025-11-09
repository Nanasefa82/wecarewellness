import { Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
    const quickLinks = [
        { href: '#services', label: 'Individual Therapy' },
        { href: '#contact', label: 'Contact' },
        { href: '#conditions', label: 'Specialties' },
        { href: '#why-choose-us', label: 'About' },
        { href: '#insurance', label: 'Fees & Insurance' },
        { href: '#testimonials', label: 'Testimonials' },
    ];

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-sage-50 text-secondary-700">
            <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-8">

                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl md:text-3xl font-serif text-secondary-800">
                            We Care Wellness LLC
                        </h3>
                        <p className="text-lg text-secondary-600 leading-relaxed font-light">
                            Compassionate mental health services in Virginia.
                            Your mental health, your wellness, our priority.
                        </p>

                        {/* Contact Section */}
                        <div className="space-y-3">
                            <h4 className="text-xl font-medium text-secondary-800">Contact</h4>
                            <div className="space-y-2 text-lg text-secondary-600">
                                <p>
                                    <a
                                        href="mailto:info@wecarewellnessllc.com"
                                        className="hover:text-sage-600 transition-colors"
                                    >
                                        info@wecarewellnessllc.com
                                    </a>
                                </p>
                                <p>
                                    <a
                                        href="tel:703-828-7620"
                                        className="hover:text-sage-600 transition-colors"
                                    >
                                        703-828-7620
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-xl font-medium text-secondary-800">
                            Quick Links
                        </h4>
                        <nav className="space-y-2">
                            {quickLinks.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => scrollToSection(link.href)}
                                    className="block text-lg text-secondary-600 hover:text-sage-600 transition-colors text-left font-light"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Hours */}
                    <div className="space-y-4">
                        <h4 className="text-xl font-medium text-secondary-800">
                            Hours
                        </h4>
                        <div className="space-y-2 text-lg text-secondary-600">
                            <p className="font-medium">Monday — Friday</p>
                            <p>By Appointment</p>
                            <p className="text-base font-light">Evening and weekend hours available</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                        <h4 className="text-xl font-medium text-secondary-800">
                            Location
                        </h4>
                        <div className="space-y-2 text-lg text-secondary-600">
                            <p>14623 Aurora Drive</p>
                            <p>Woodbridge, VA 22193</p>
                            <p className="text-base font-light">Serving Virginia & DMV area</p>
                            <button
                                onClick={() => window.open('https://maps.google.com/?q=14623+Aurora+Drive+Woodbridge+VA+22193', '_blank')}
                                className="text-sage-600 hover:text-sage-700 transition-colors underline font-medium text-lg"
                            >
                                VIEW MAP
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="flex justify-center items-center space-x-4 mb-6">
                    <a
                        href="#"
                        className="w-8 h-8 bg-secondary-600 hover:bg-sage-600 rounded-full flex items-center justify-center transition-colors"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="w-4 h-4 text-white" />
                    </a>
                    <a
                        href="#"
                        className="w-8 h-8 bg-secondary-600 hover:bg-sage-600 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram className="w-4 h-4 text-white" />
                    </a>
                </div>

                {/* Emergency Notice */}
                <div className="text-center mb-6">
                    <p className="text-lg text-secondary-600">
                        If you are experiencing a mental health emergency, please call
                        <a
                            href="tel:988"
                            className="text-sage-600 hover:text-sage-700 transition-colors underline font-medium ml-1"
                        >
                            988 (Suicide & Crisis Lifeline)
                        </a>
                        {' '}or go to your nearest emergency room.
                    </p>
                </div>

                {/* Legal Links */}
                <div className="border-t border-secondary-200 pt-6">
                    <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-base text-secondary-500">
                        <a href="/privacy-policy" className="hover:text-sage-600 transition-colors">Privacy Policy</a>
                        <span className="hidden md:inline text-secondary-300">|</span>
                        <a href="/terms-conditions" className="hover:text-sage-600 transition-colors">Terms & Conditions</a>
                        <span className="hidden md:inline text-secondary-300">|</span>
                        <a href="/hipaa-notice" className="hover:text-sage-600 transition-colors">HIPAA Notice</a>
                        <span className="hidden md:inline text-secondary-300">|</span>
                        <a href="#" className="hover:text-sage-600 transition-colors">Good Faith Estimate</a>
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-base text-secondary-500">
                            © 2025 We Care Wellness LLC. All Rights Reserved. Licensed mental health professionals.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;