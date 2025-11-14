import {
    Brain,
    Pill,
    MessageCircle,
    Focus,
    Heart,
    Users,
    Target
} from 'lucide-react';
import { Service } from '../types';

const Services = () => {
    const services: Service[] = [
        {
            id: 'psychiatric-evaluations',
            title: 'Psychiatric Evaluations',
            description: 'Professional diagnosis and treatment planning for mental, emotional, and behavioral disorders.',
            icon: Brain
        },
        {
            id: 'medication-management',
            title: 'Medication Management',
            description: 'Safe, expert supervision to optimize your treatment outcomes.',
            icon: Pill
        },
        {
            id: 'psychotherapy-counseling',
            title: 'Psychotherapy & Counseling',
            description: 'Talk therapy to process emotions, navigate challenges, and foster healing.',
            icon: MessageCircle
        },
        {
            id: 'adhd-testing',
            title: 'ADHD Assessment',
            description: 'Accurate assessments and ongoing support for adults.',
            icon: Focus
        },
        {
            id: 'substance-abuse-support',
            title: 'Substance Abuse Support',
            description: 'Compassionate recovery guidance in a judgment-free space.',
            icon: Heart
        },
        {
            id: 'marriage-family-therapy',
            title: 'Marriage & Family Therapy',
            description: 'Strengthen communication and emotional connection within relationships.',
            icon: Users
        },
        {
            id: 'life-coaching',
            title: 'Life Coaching',
            description: 'Set goals, overcome barriers, and unlock your best self.',
            icon: Target
        }
    ];

    const handleExploreServices = () => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="services" className="bg-white py-12 sm:py-16 md:py-24 lg:py-32">
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-24">

                {/* Section Header */}
                <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-28">
                    <div className="text-secondary-500 text-xs sm:text-sm md:text-base tracking-widest uppercase font-light mb-4 md:mb-6">
                        OUR COMPREHENSIVE SERVICES
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif text-secondary-800 leading-tight mb-4 sm:mb-6 md:mb-8 max-w-4xl">
                        Comprehensive Psychiatric & Counseling Services
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-secondary-600 leading-relaxed max-w-3xl font-light">
                        Experience full-spectrum, patient-centered psychiatric care tailored to your unique needs.
                        From medication management to therapy and coaching, our integrated services help restore balance and peace of mind.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-16 lg:mb-20">
                    {services.map((service) => {
                        const IconComponent = service.icon;
                        return (
                            <div
                                key={service.id}
                                className="group"
                            >
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center group-hover:bg-sage-200 transition-colors duration-300">
                                        <IconComponent className="w-8 h-8 text-sage-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-4 leading-tight">
                                    {service.title}
                                </h3>
                                <p className="text-lg text-secondary-600 leading-relaxed font-light">
                                    {service.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className="text-center space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={handleExploreServices}
                            className="px-10 py-5 bg-secondary-200 hover:bg-secondary-300 text-secondary-800 transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
                        >
                            EXPLORE ALL OUR SERVICES
                        </button>
                        <button
                            onClick={handleExploreServices}
                            className="px-10 py-5 bg-sage-600 hover:bg-sage-700 text-white transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
                        >
                            BOOK A CONSULTATION
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;