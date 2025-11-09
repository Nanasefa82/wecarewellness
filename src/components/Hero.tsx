import { useState, useEffect } from 'react';
import { Phone, ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handlePhoneClick = () => {
        window.location.href = 'tel:703-828-7620';
    };

    const slides = [
        {
            id: 1,
            image: '/images/hero/heroimage.jpg',
            title: 'YOUR MENTAL HEALTH AND WELLNESS IS OUR',
            highlight: 'PRIORITY',
            subtitle: 'WELCOME TO WE CARE WELLNESS LLC – VIRGINIA',
            description: 'Our expertise lies in evaluating and managing a wide range of conditions including Depression, Anxiety, Bipolar Disorders, ADHD, PTSD, OCD, Schizophrenia, Psychotic disorders, Insomnia and Personality Disorders.',
            cta: 'BOOK ONLINE NOW'
        },
        {
            id: 2,
            image: '/images/wellness_images/helena-lopes-_SzvRwdFo6o-unsplash.jpg',
            title: 'VIRTUAL INDIVIDUALIZED',
            highlight: 'HOLISTIC CARE',
            subtitle: 'COMPREHENSIVE MENTAL HEALTH SERVICES',
            description: 'We provide personalized virtual care to manage your mental and behavioral health needs with compassionate, evidence-based treatment approaches.',
            cta: 'LEARN MORE'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            title: 'EXPERIENCED MENTAL HEALTH',
            highlight: 'PROFESSIONALS',
            subtitle: 'DEDICATED TO YOUR WELLNESS JOURNEY',
            description: 'Our team offers medication management, counseling, and innovative therapies in a compassionate environment where every patient feels heard and valued.',
            cta: 'CONTACT US'
        }
    ];

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const handleCTA = (cta: string) => {
        switch (cta) {
            case 'BOOK ONLINE NOW':
                window.location.href = '/book-appointment';
                break;
            case 'LEARN MORE': {
                const servicesSection = document.querySelector('#services');
                if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
                break;
            }
            case 'CONTACT US':
                window.location.href = '/contact';
                break;
            default:
                window.location.href = '/book-appointment';
        }
    };

    return (
        <section className="relative w-full h-screen overflow-hidden" id="home">
            {/* Carousel Container */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url('${slide.image}')`
                            }}
                        >
                            {/* Overlay for better text readability */}
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-10 h-full flex items-center">
                            <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
                                <div className="max-w-4xl">
                                    {/* Subtitle */}
                                    <div className="text-white/90 text-base md:text-lg tracking-widest uppercase font-light mb-6">
                                        {slide.subtitle}
                                    </div>

                                    {/* Main Title */}
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-white leading-tight mb-8">
                                        {slide.title}{' '}
                                        <span className="italic font-light text-sage-300">{slide.highlight}</span>
                                    </h1>

                                    {/* Description */}
                                    <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-light mb-10 max-w-3xl">
                                        {slide.description}
                                    </p>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handleCTA(slide.cta)}
                                        className="px-10 py-5 bg-sage-600 hover:bg-sage-700 text-white transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        {slide.cta}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
                aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide
                                ? 'bg-white scale-125'
                                : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Contact Info Overlay */}
            <div className="absolute bottom-8 right-8 z-20 text-white/90 text-right hidden lg:block">
                <p className="text-sm font-medium mb-1">We Care Wellness LLC</p>
                <p className="text-xs mb-2">14623 Aurora Drive, Woodbridge, VA 22193</p>
                <button
                    onClick={handlePhoneClick}
                    className="text-white/90 hover:text-white text-sm transition-colors flex items-center gap-2 ml-auto"
                >
                    <Phone size={16} />
                    703-828-7620
                </button>
            </div>
        </section>
    );
};

export default Hero;