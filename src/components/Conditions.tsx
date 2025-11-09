import { Check } from 'lucide-react';

const Conditions = () => {
    const conditions = [
        {
            name: 'Depression',
            image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Supporting individuals through depressive episodes with evidence-based therapy'
        },
        {
            name: 'Anxiety Disorders',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Managing anxiety through mindfulness and cognitive behavioral techniques'
        },
        {
            name: 'Bipolar Disorder',
            image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Stabilizing mood swings with comprehensive treatment approaches'
        },
        {
            name: 'ADHD',
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Improving focus and attention through behavioral strategies'
        },
        {
            name: 'Schizophrenia',
            image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Comprehensive care for complex mental health conditions'
        },
        {
            name: 'PTSD',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Compassionate support through the grieving process'
        },
        {
            name: 'Sleep Disorders',
            image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Improving sleep quality and addressing sleep-related issues'
        },
        {
            name: 'Stress Management',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Building resilience and healthy coping mechanisms'
        },
        {
            name: 'Substance Use Disorders',
            image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Recovery-focused treatment for addiction and substance abuse'
        },
        {
            name: 'Eating Disorders',
            image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Holistic approach to eating disorder recovery and body image'
        },
        {
            name: 'Relationship & Family Issues',
            image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
        <section id="conditions" className="bg-sage-50 py-24 lg:py-32">
            <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">

                {/* Section Header */}
                <div className="mb-20 lg:mb-28">
                    <div className="text-secondary-500 text-base tracking-widest uppercase font-light mb-6">
                        CONDITIONS WE TREAT
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-800 leading-tight mb-8 max-w-5xl">
                        Expertise Across a Wide Range of Mental Health Conditions
                    </h2>
                    <p className="text-xl md:text-2xl text-secondary-600 leading-relaxed max-w-4xl font-light">
                        Our clinicians specialize in diagnosing and managing complex conditions with care that addresses
                        both symptoms and underlying causes. We treat individuals across all life stages with empathy,
                        confidentiality, and professionalism.
                    </p>
                </div>

                {/* Conditions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16 lg:mb-20">
                    {conditions.map((condition, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-xl shadow-sm border border-sage-200 hover:shadow-lg hover:border-sage-300 transition-all duration-300 overflow-hidden"
                        >
                            {/* Image Container */}
                            <div className="relative h-48 overflow-hidden">
                                <div
                                    className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${condition.image}')` }}
                                >
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                                    {/* Check Icon */}
                                    <div className="absolute top-4 right-4">
                                        <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                                            <Check className="w-5 h-5 text-sage-600" />
                                        </div>
                                    </div>

                                    {/* Title Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-white font-medium text-lg leading-tight">
                                            {condition.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-secondary-600 text-sm leading-relaxed font-light">
                                    {condition.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="bg-white p-12 lg:p-16 rounded-lg shadow-sm border border-sage-200 mb-16 lg:mb-20">
                    <div className="text-center max-w-4xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-6">
                            Conditions We Commonly Support
                        </h3>
                        <p className="text-lg md:text-xl text-secondary-600 leading-relaxed font-light">
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