import { useState } from 'react';
import { Menu, X } from 'lucide-react';


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigationLinks = [
        { href: '#services', label: 'Individual Therapy' },
        { href: '/about', label: 'About', isRoute: true },
        { href: '/contact', label: 'Contact', isRoute: true },
        { href: '#insurance', label: 'Fees & Insurance' },
        { href: '#conditions', label: 'Specialties' },
    ];

    const handleNavigation = (href: string, isRoute?: boolean) => {
        if (isRoute) {
            window.location.href = href;
        } else {
            // Check if we're on the homepage
            if (window.location.pathname === '/') {
                // We're on homepage, scroll to section
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // We're on another page, redirect to homepage with section
                window.location.href = '/' + href;
            }
        }
        setIsMenuOpen(false);
    };

    const handleBookConsultation = () => {
        // Redirect to the booking calendar to select available slots first
        window.location.href = '/book-appointment';
    };

    const handleStaffLogin = () => {
        console.log('🔐 Staff Login button clicked');
        console.log('📍 Redirecting to /admin/login');
        window.location.href = '/admin/login';
    };

    return (
        <header className="sticky top-0 z-50 bg-white py-2 px-8 sm:px-12 lg:px-20 xl:px-24 shadow-sm">
            <div className="w-full">
                <div className="flex items-center justify-between">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="flex items-center space-x-3 group"
                        >
                            {/* Logo Icon */}
                            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                                <img
                                    src="/images/logo/wecarewellness_logo_130.png"
                                    alt="We Care Wellness Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            {/* Logo Text */}
                            <div className="flex flex-col">
                                <span className="text-xl md:text-2xl lg:text-3xl font-serif text-secondary-800 group-hover:text-secondary-700 transition-colors tracking-wide leading-tight">
                                    WE CARE WELLNESS
                                </span>
                                <span className="text-xs md:text-sm text-sage-600 font-light tracking-widest uppercase">
                                    LLC
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
                        {navigationLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => handleNavigation(link.href, link.isRoute)}
                                className="text-secondary-700 hover:text-secondary-900 font-medium transition-colors duration-200 text-lg xl:text-xl tracking-wide px-3 py-2 rounded-lg hover:bg-secondary-50"
                            >
                                {link.label}
                            </button>
                        ))}

                        {/* Divider */}
                        <div className="h-8 w-px bg-secondary-200"></div>

                        {/* Staff Login Link */}
                        <button
                            onClick={handleStaffLogin}
                            className="text-secondary-600 hover:text-secondary-800 font-medium transition-colors duration-200 text-base xl:text-lg tracking-wide px-4 py-2 rounded-lg hover:bg-secondary-50 border border-secondary-200"
                        >
                            Staff Login
                        </button>

                        {/* Book Consultation Button */}
                        <button
                            onClick={handleBookConsultation}
                            className="px-8 py-3 bg-sage-600 hover:bg-sage-700 text-white transition-all duration-200 text-lg xl:text-xl tracking-wide rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            BOOK ONLINE
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-secondary-600 hover:text-secondary-800 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="lg:hidden mt-4 border-t border-secondary-200 pt-4">
                        <nav className="space-y-4">
                            {navigationLinks.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => handleNavigation(link.href, link.isRoute)}
                                    className="block w-full text-left text-secondary-600 hover:text-secondary-800 font-light transition-colors duration-200 text-xl tracking-wide py-2"
                                >
                                    {link.label}
                                </button>
                            ))}

                            {/* Staff Login Link */}
                            <button
                                onClick={handleStaffLogin}
                                className="block w-full text-left text-secondary-500 hover:text-secondary-700 font-light transition-colors duration-200 text-lg tracking-wide py-2"
                            >
                                Staff Login
                            </button>

                            {/* Book Consultation Button */}
                            <button
                                onClick={handleBookConsultation}
                                className="w-full mt-3 px-6 py-2 bg-sage-600 hover:bg-sage-700 text-white transition-all duration-200 text-lg tracking-wide rounded-full font-medium"
                            >
                                BOOK ONLINE
                            </button>
                        </nav>
                    </div>
                )}
            </div>

        </header>
    );
};

export default Header;