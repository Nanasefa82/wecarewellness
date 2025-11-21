import { Check } from 'lucide-react';

const Conditions = () => {
    const conditions = [
        {
            name: 'Depression',
            image: '/images/conditions/depression.jpg',
            description: 'Supporting individuals through depressive episodes with evidence-based therapy'
        },
        {
            name: 'Anxiety Disorders',
            image: '/images/conditions/anxiety.jpg',
            description: 'Managing anxiety through mindfulness and cognitive behavioral techniques'
        },
        {
            name: 'Bipolar Disorder',
            image: '/images/conditions/bipolar.jpg',
            description: 'Stabilizing mood swings with comprehensive treatment approaches'
        },
        {
            name: 'ADHD',
            image: '/images/conditions/adhd.jpg',
            description: 'Improving focus and attention through behavioral strategies'
        },
        {
            name: 'Schizophrenia',
            image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Comprehensive care for complex mental health conditions'
        },
        {
            name: 'PTSD',
            image: '/images/conditions/ptsd.jpg',
            description: 'Trauma-informed therapy for post-traumatic stress recovery'
        },
        {
            name: 'OCD',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Breaking cycles of obsessive-compulsive behaviors'
        },
        {
            name: 'Autism Spectrum',
            image: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Supporting neurodivergent individuals and families'
        },
        {
            name: 'Grief & Loss',
            image: '/images/conditions/loss.jpg',
            description: 'Compassionate support through the grieving process'
        },
        {
            name: 'Sleep Disorders',
            image: '/images/conditions/sleepdisorder.jpg',
            description: 'Improving sleep quality and addressing sleep-related issues'
        },
        {
            name: 'Stress Management',
            image: '/images/conditions/stress.jpg',
            description: 'Building resilience and healthy coping mechanisms'
        },
        {
            name: 'Substance Use Disorders',
            image: '/images/conditions/substanceabuse.jpg',
            description: 'Recovery-focused treatment for addiction and substance abuse'
        },
        {
            name: 'Eating Disorders',
            image: '/images/conditions/eatingdisorders.jpg',
            description: 'Holistic approach to eating disorder recovery and body image'
        },
        {
            name: 'Relationship & Family Issues',
            image: '/images/conditions/family.jpg',
            description: 'Strengthening relationships and family dynamics'
        }
    ];

    const handleFindSupport = () => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="conditions" className="bg-sage-50 py-12 sm:py-16 md:py-24 lg:py-32">
            <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-24">

                {/* Section Header */}
                <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-28">
                    <div className="text-secondary-500 text-xs sm:text-sm md:text-base tracking-widest uppercase font-light mb-4 md:mb-6">
                        CONDITIONS WE TREAT
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif text-secondary-800 leading-tight mb-4 sm:mb-6 md:mb-8 max-w-5xl">
                        Expertise Across a Wide Range of Mental Health Conditions
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-secondary-600 leading-relaxed max-w-4xl font-light">
                        Our clinicians specialize in diagnosing and managing complex conditions with care that addresses
                        both symptoms and underlying causes. We treat individuals across all life stages with empathy,
                        confidentiality, and professionalism.
                    </p>
                </div>

                {/* Conditions Grid - Taller cards with portrait images */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-12 sm:mb-16 lg:mb-20">
                    {conditions.map((condition, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-xl shadow-sm border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 overflow-hidden flex flex-col"
                        >
                            {/* Image Container - Taller portrait orientation */}
                            <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden bg-gray-200">
                                {/* Background Image */}
                                <img 
                                    src={condition.image} 
                                    alt={condition.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    loading="lazy"
                                />
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                                {/* Check Icon */}
                                <div className="absolute top-3 right-3 z-10">
                                    <div className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                                        <Check className="w-4 h-4 text-sage-600" />
                                    </div>
                                </div>

                                {/* Title Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                                    <h3 className="text-white font-medium text-sm sm:text-base leading-tight">
                                        {condition.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-3 sm:p-4 flex-1">
                                <p className="text-secondary-600 text-xs sm:text-sm leading-relaxed font-light">
                                    {condition.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="bg-white p-6 sm:p-8 md:p-12 lg:p-16 rounded-lg shadow-sm border border-sage-200 mb-12 sm:mb-16 lg:mb-20">
                    <div className="text-center max-w-4xl mx-auto">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-secondary-800 mb-4 sm:mb-6">
                            Conditions We Commonly Support
                        </h3>
                        <p className="text-base sm:text-lg md:text-xl text-secondary-600 leading-relaxed font-light">
                            This list represents some of the most common conditions we treat, but our expertise extends beyond these areas.
                            If you don't see your specific concern listed, please reach out to discuss how we can help you on your path to wellness.
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={handleFindSupport}
                            className="px-10 py-5 bg-secondary-200 hover:bg-secondary-300 text-secondary-800 transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
                        >
                            FIND SUPPORT FOR YOUR CONDITION
                        </button>
                        <button
                            onClick={handleFindSupport}
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

export default Conditions;