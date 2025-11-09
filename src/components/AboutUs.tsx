import { Heart, Award, Users, Shield } from 'lucide-react';
import { Header, Footer } from './layout';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Dr. Emma Boateng",
      title: "Doctor In Nursing Practice",
      icon: <Award className="w-8 h-8 text-sage-600" />,
      image: "/images/aboutus/DrEmma_370_237_Team.png"
    },
    {
      name: "Mr Emmanuel Boateng", 
      title: "Behavioral Specialist & Life Coach",
      icon: <Users className="w-8 h-8 text-sage-600" />,
      image: "/images/aboutus/RevEmmanuelBoateng_370_237_Team.png"
    }
  ];

  const conditions = [
    "Depression", "Anxiety", "Bipolar Disorders", "ADHD", "PTSD", 
    "OCD", "Schizophrenia", "Psychotic disorders", "Insomnia", "Personality Disorders"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header Section */}
      <section className="bg-white py-24 lg:py-32">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
          <div className="mb-20 lg:mb-28">
            <div className="text-secondary-500 text-base tracking-widest uppercase font-light mb-6">
              ABOUT WE CARE WELLNESS LLC
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-800 leading-tight mb-8 max-w-4xl">
              Compassionate Mental Health Care with a Personal Touch
            </h1>
            <p className="text-xl md:text-2xl text-secondary-600 leading-relaxed max-w-4xl font-light">
              At We Care Wellness LLC, we believe every individual deserves personalized, compassionate mental health care. Our experienced team is dedicated to supporting your journey towards wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-white py-24 lg:py-32">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 xl:gap-32 items-center w-full">
            <div className="space-y-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-sage-600" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-800 leading-tight mb-8">
                Our Mission & Values
              </h2>
              <p className="text-xl md:text-2xl text-secondary-600 leading-relaxed font-light mb-6">
                We specialize in providing comprehensive Mental Health care with a focus on individualized treatment. Our team of experienced mental health professionals are dedicated to supporting your journey towards mental wellness through a range of services including medication management, counseling and innovative therapies.
              </p>
              <p className="text-lg text-secondary-600 leading-relaxed font-light">
                We're committed to creating a compassionate and understanding environment, ensuring every patient feels heard and valued. Discover a path to better mental health with us.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/images/aboutus/WeCareWellness_AboutUs2.png" 
                alt="We Care Wellness - Compassionate Mental Health Care" 
                className="w-full h-[500px] lg:h-[600px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="bg-white py-24 lg:py-32">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
          <div className="mb-20 lg:mb-28">
            <div className="text-secondary-500 text-base tracking-widest uppercase font-light mb-6">
              OUR CLINICAL EXPERTISE
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-800 leading-tight mb-8 max-w-4xl">
              Comprehensive Care for Mental Health Conditions
            </h2>
            <p className="text-xl md:text-2xl text-secondary-600 leading-relaxed max-w-3xl font-light">
              Our expertise lies in evaluating and managing a wide range of mental health conditions with evidence-based treatments tailored to your unique needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {conditions.map((condition, index) => (
              <div 
                key={index}
                className="group"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center group-hover:bg-sage-200 transition-colors duration-300">
                    <Shield className="w-8 h-8 text-sage-600" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-4 leading-tight">
                  {condition}
                </h3>
                <p className="text-lg text-secondary-600 leading-relaxed font-light">
                  Expert evaluation and personalized treatment approaches.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-24 lg:py-32">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
          <div className="mb-20 lg:mb-28">
            <div className="text-secondary-500 text-base tracking-widest uppercase font-light mb-6">
              MEET OUR EXPERIENCED TEAM
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-800 leading-tight mb-8 max-w-4xl">
              Dedicated Professionals Committed to Your Wellness
            </h2>
            <p className="text-xl md:text-2xl text-secondary-600 leading-relaxed max-w-3xl font-light">
              Our team brings years of clinical expertise and a genuine passion for helping individuals achieve their mental health goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="group text-center"
              >
                <div className="mb-8">
                  <div className="relative inline-block">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-48 h-48 lg:w-56 lg:h-56 rounded-2xl object-cover shadow-2xl group-hover:shadow-3xl transition-shadow duration-300"
                    />
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center shadow-lg">
                      {member.icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-4 leading-tight">
                  {member.name}
                </h3>
                <p className="text-lg text-secondary-600 leading-relaxed font-light">
                  {member.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white py-24 lg:py-32">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
          <div className="text-center space-y-8">
            <div className="mb-12">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-800 leading-tight mb-8">
                Ready to Begin Your Journey?
              </h3>
              <p className="text-xl md:text-2xl text-secondary-600 leading-relaxed max-w-3xl mx-auto font-light">
                Take the first step towards better mental health with our compassionate and experienced team.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.location.href = '/contact'}
                className="px-10 py-5 bg-secondary-200 hover:bg-secondary-300 text-secondary-800 transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
              >
                CONTACT US TODAY
              </button>
              <button
                onClick={() => window.location.href = '/book-appointment'}
                className="px-10 py-5 bg-sage-600 hover:bg-sage-700 text-white transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
              >
                BOOK AN APPOINTMENT
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
