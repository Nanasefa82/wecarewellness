import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            name: "Sarah M.",
            location: "Woodbridge, VA",
            image: "/images/People-Feedback-1.jpg",
            rating: 5,
            text: "The care I received at We Care Wellness has been life-changing. The therapists are compassionate, professional, and truly understand what I'm going through. I finally feel like I have the tools to manage my anxiety.",
            condition: "Anxiety & Depression"
        },
        {
            name: "Michael R.",
            location: "Alexandria, VA",
            image: "/images/People-Feedback-2.jpg",
            rating: 5,
            text: "After struggling with ADHD for years, the comprehensive evaluation and treatment plan here has made such a difference. My focus has improved dramatically, and I feel more confident in my daily life.",
            condition: "ADHD"
        },
        {
            name: "Jennifer L.",
            location: "Fairfax, VA",
            image: "/images/People-Feedback-3.jpg",
            rating: 5,
            text: "The family therapy sessions helped us rebuild our relationships and communicate better. The therapist created a safe space where we could all express ourselves honestly and work toward healing.",
            condition: "Family Therapy"
        }
    ];

    const handleBookConsultation = () => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="testimonials" className="bg-white py-24 lg:py-32">
            <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">

                {/* Section Header */}
                <div className="text-center mb-20 lg:mb-28">
                    <div className="text-secondary-500 text-base tracking-widest uppercase font-light mb-6">
                        CLIENT TESTIMONIALS
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-800 leading-tight mb-8 max-w-4xl mx-auto">
                        Stories of <span className="italic font-light text-sage-600">Healing</span> and Growth
                    </h2>
                    <p className="text-xl md:text-2xl text-secondary-600 leading-relaxed max-w-3xl mx-auto font-light">
                        Hear from our clients about their journey to wellness and the positive impact our services have had on their lives.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16 lg:mb-20">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-sage-50 rounded-2xl p-8 lg:p-10 shadow-sm border border-sage-100 hover:shadow-md transition-all duration-300 relative"
                        >
                            {/* Quote Icon */}
                            <div className="absolute -top-4 left-8">
                                <div className="w-12 h-12 bg-sage-600 rounded-full flex items-center justify-center shadow-lg">
                                    <Quote className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center space-x-1 mb-6 pt-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <blockquote className="text-lg text-secondary-700 leading-relaxed font-light mb-8 italic">
                                "{testimonial.text}"
                            </blockquote>

                            {/* Client Info */}
                            <div className="flex items-center space-x-4">
                                {/* CSS custom property for dynamic avatar background */}
                                <div
                                    className="testimonial-avatar-bg"
                                    style={{
                                        '--bg-image': `url('${testimonial.image}')`
                                    } as React.CSSProperties & { '--bg-image': string }}
                                ></div>
                                <div>
                                    <div className="font-medium text-secondary-800 text-lg">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-secondary-500 text-sm">
                                        {testimonial.location}
                                    </div>
                                    <div className="text-sage-600 text-sm font-medium mt-1">
                                        {testimonial.condition}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Indicators */}
                <div className="bg-gradient-to-r from-sage-50 to-primary-50 rounded-2xl p-12 lg:p-16 mb-16 lg:mb-20">
                    <div className="text-center">
                        <h3 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-6">
                            Trusted by Our Community
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-serif text-sage-600 mb-2">500+</div>
                                <div className="text-secondary-600 font-light">Clients Served</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-serif text-sage-600 mb-2">15+</div>
                                <div className="text-secondary-600 font-light">Years Experience</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-serif text-sage-600 mb-2">98%</div>
                                <div className="text-secondary-600 font-light">Client Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="max-w-3xl mx-auto mb-8">
                        <h3 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-4">
                            Ready to Start Your Journey?
                        </h3>
                        <p className="text-lg text-secondary-600 leading-relaxed font-light">
                            Join hundreds of clients who have found healing and growth through our compassionate care.
                            Take the first step toward your wellness today.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={handleBookConsultation}
                            className="px-10 py-5 bg-sage-600 hover:bg-sage-700 text-white transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
                        >
                            BOOK YOUR CONSULTATION
                        </button>
                        <button
                            onClick={handleBookConsultation}
                            className="px-10 py-5 border-2 border-sage-600 text-sage-600 hover:bg-sage-50 transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
                        >
                            LEARN MORE ABOUT OUR SERVICES
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;