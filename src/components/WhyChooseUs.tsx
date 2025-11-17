import {
    Award,
    User,
    Heart,
    Calendar
} from 'lucide-react';
import { Differentiator } from '../types';

const WhyChooseUs = () => {
    const differentiators: Differentiator[] = [
        {
            id: 'clinical-expertise',
            title: 'Clinical Expertise',
            description: 'Licensed professionals with diverse specialties and years of hands-on experience.',
            icon: Award
        },
        {
            id: 'personalized-treatment',
            title: 'Personalized Treatment',
            description: 'Custom care plans designed around your lifestyle, goals, and needs.',
            icon: User
        },
        {
            id: 'holistic-care',
            title: 'Holistic Care Philosophy',
            description: 'We treat the whole person—mind, body, and spirit—to foster true wellness.',
            icon: Heart
        },
        {
            id: 'flexible-access',
            title: 'Flexible Access',
            description: 'Choose virtual or in-person appointments to fit your schedule.',
            icon: Calendar
        }
    ];

    return (
        <section id="why-choose-us" className="bg-white py-24 lg:py-32">
            <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">

                {/* Section Header */}
                <div className="mb-20 lg:mb-28">
                    <div className="text-secondary-500 text-base tracking-widest uppercase font-light mb-6">
                        WHY CHOOSE US
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-800 leading-tight mb-8 max-w-4xl">
                        The Difference Compassion Makes
                    </h2>
                    <p className="text-xl md:text-2xl text-secondary-600 leading-relaxed max-w-4xl font-light">
                        At We Care Wellness LLC, we believe mental health care should be as unique as you are.
                        Our compassionate, multidisciplinary team combines clinical excellence with deep empathy
                        to ensure that every patient feels seen, supported, and safe.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 xl:gap-32 items-center mb-20 lg:mb-28">

                    {/* Left Side - Image */}
                    <div className="order-2 lg:order-1">
                        <div className="relative">
                            <div className="why-choose-us-bg">
                                <div className="absolute inset-0 bg-white bg-opacity-5 rounded-lg"></div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-sage-100 rounded-full opacity-60"></div>
                            <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary-100 rounded-full opacity-40"></div>
                        </div>
                    </div>

                    {/* Right Side - Differentiators */}
                    <div className="order-1 lg:order-2 space-y-12">
                        <h3 className="text-3xl md:text-4xl font-serif text-secondary-800 leading-tight">
                            Our Commitment to You
                        </h3>

                        <div className="space-y-10">
                            {differentiators.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <div key={item.id} className="group">
                                        <div className="flex items-start space-x-6">
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center group-hover:bg-sage-200 transition-colors duration-300">
                                                    <IconComponent className="w-8 h-8 text-sage-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-4 leading-tight">
                                                    {item.title}
                                                </h4>
                                                <p className="text-lg md:text-xl text-secondary-600 leading-relaxed font-light">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Testimonial Quote */}
                <div className="bg-sage-50 p-12 lg:p-16 rounded-lg text-center">
                    <blockquote className="text-3xl md:text-4xl lg:text-5xl font-serif text-secondary-800 italic mb-8 leading-tight">
                        "We're here to walk with you toward better mental health—one session at a{' '}
                        <span className="text-sage-600">time</span>."
                    </blockquote>
                    <div className="w-24 h-1 bg-sage-400 mx-auto mb-8"></div>
                    <button
                        onClick={() => {
                            const contactSection = document.querySelector('#contact');
                            if (contactSection) {
                                contactSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className="px-10 py-5 bg-sage-600 hover:bg-sage-700 text-white transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
                    >
                        BOOK A CONSULTATION
                    </button>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;