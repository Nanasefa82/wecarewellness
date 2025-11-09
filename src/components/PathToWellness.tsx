import { Step } from '../types';

const PathToWellness = () => {
    const steps: Step[] = [
        {
            number: 1,
            title: 'Initial Consultation',
            description: 'Begin with a private evaluation to understand your concerns and goals.'
        },
        {
            number: 2,
            title: 'Personalized Treatment Plan',
            description: 'Receive a tailored plan—whether medication, therapy, or both—built around your needs.'
        },
        {
            number: 3,
            title: 'Continuous Care & Support',
            description: 'Stay connected with ongoing sessions, follow-ups, and compassionate guidance.'
        }
    ];

    const handleStartJourney = () => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="path-to-wellness" className="bg-gradient-to-br from-sage-50 to-primary-50 py-24 lg:py-32">
            <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">

                {/* Section Header */}
                <div className="text-center mb-20 lg:mb-28">
                    <div className="text-secondary-500 text-base tracking-widest uppercase font-light mb-6">
                        YOUR JOURNEY TO WELLNESS
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-800 leading-tight mb-8 max-w-4xl mx-auto">
                        Your Path to Wellness
                    </h2>
                    <p className="text-xl md:text-2xl text-secondary-600 leading-relaxed max-w-3xl mx-auto font-light">
                        A Simple, Supportive Process Toward Healing
                    </p>
                </div>

                {/* Steps */}
                <div className="relative mb-20 lg:mb-28">
                    {/* Desktop Timeline Line */}
                    <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-sage-200 rounded-full"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                        {steps.map((step, index) => (
                            <div key={step.number} className="relative text-center lg:text-center">
                                {/* Mobile Timeline Line */}
                                {index < steps.length - 1 && (
                                    <div className="lg:hidden absolute left-1/2 transform -translate-x-1/2 top-20 w-1 h-20 bg-sage-200 rounded-full"></div>
                                )}

                                {/* Step Content */}
                                <div className="space-y-6">
                                    {/* Step Number */}
                                    <div className="relative z-10 w-16 h-16 bg-sage-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                                        {step.number}
                                    </div>

                                    {/* Step Title */}
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-secondary-800 leading-tight">
                                        {step.title}
                                    </h3>

                                    {/* Step Description */}
                                    <p className="text-lg md:text-xl text-secondary-600 leading-relaxed max-w-md mx-auto font-light">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                        <button
                            onClick={handleStartJourney}
                            className="px-10 py-5 bg-secondary-200 hover:bg-secondary-300 text-secondary-800 transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
                        >
                            START YOUR JOURNEY TODAY
                        </button>
                        <button
                            onClick={handleStartJourney}
                            className="px-10 py-5 bg-sage-600 hover:bg-sage-700 text-white transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
                        >
                            BOOK A CONSULTATION
                        </button>
                    </div>
                    <p className="text-lg md:text-xl text-secondary-600 font-light">
                        Take the first step toward better mental health and wellness
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PathToWellness;