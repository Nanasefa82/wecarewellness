import { Heart, Award, Users } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header Section with Hero Image */}
      <section className="relative bg-white py-16 lg:py-24">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="text-secondary-500 text-base tracking-widest uppercase font-light mb-6">
                ABOUT WE CARE WELLNESS LLC
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-800 leading-tight mb-6">
                Compassionate Mental Health Care with a Personal Touch
              </h1>
              <p className="text-xl md:text-2xl text-secondary-600 leading-relaxed font-light">
                At We Care Wellness LLC, we believe every individual deserves personalized, compassionate mental health care. Our experienced team is dedicated to supporting your journey towards wellness.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/images/aboutus/WeCareWellness_AboutUs2.png" 
                alt="We Care Wellness - Mental Health Support" 
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Statement */}
      <section className="bg-sage-50 py-16 lg:py-20">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-10">
              {/* Vision */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="mb-4">
                  <div className="text-secondary-500 text-sm tracking-widest uppercase font-light mb-3">
                    OUR VISION
                  </div>
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-sage-600" />
                  </div>
                </div>
                <p className="text-lg md:text-xl text-secondary-600 leading-relaxed font-light">
                  Our vision is to provide mental wellness, competent and quality care to improve the lives of individuals across the life span and their families to improve their quality of life.
                </p>
              </div>

              {/* Mission */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="mb-4">
                  <div className="text-secondary-500 text-sm tracking-widest uppercase font-light mb-3">
                    OUR MISSION
                  </div>
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-sage-600" />
                  </div>
                </div>
                <p className="text-lg md:text-xl text-secondary-600 leading-relaxed font-light">
                  To promote mental health awareness, empower individuals and increase access to treatment and services for individuals with mental illnesses.
                </p>
              </div>
            </div>
            <div className="relative lg:order-first">
              <img 
                src="/images/aboutus/ourmission.jpg" 
                alt="We Care Wellness - Our Vision and Mission" 
                className="w-full h-[450px] lg:h-[550px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-16 lg:py-20">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
          <div className="text-center mb-12 lg:mb-16">
            <div className="text-secondary-500 text-base tracking-widest uppercase font-light mb-4">
              MEET OUR EXPERIENCED TEAM
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-secondary-800 leading-tight mb-4 max-w-3xl mx-auto">
              Dedicated Professionals Committed to Your Wellness
            </h2>
            <p className="text-lg md:text-xl text-secondary-600 leading-relaxed max-w-2xl mx-auto font-light">
              Our team brings years of clinical expertise and a genuine passion for helping individuals achieve their mental health goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="group bg-sage-50 p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-6">
                  <div className="relative inline-block">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-40 h-40 lg:w-48 lg:h-48 rounded-2xl object-cover shadow-lg"
                    />
                    <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                      {member.icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-2 leading-tight">
                  {member.name}
                </h3>
                <p className="text-base md:text-lg text-secondary-600 leading-relaxed font-light">
                  {member.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative bg-gradient-to-br from-sage-600 to-sage-700 py-16 lg:py-20">
        <div className="absolute inset-0 bg-[url('/images/hero/WeCareWellness_Hero1.png')] opacity-10 bg-cover bg-center"></div>
        <div className="relative w-full px-8 sm:px-12 lg:px-20 xl:px-24">
          <div className="text-center space-y-6">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight">
              Ready to Begin Your Journey?
            </h3>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto font-light">
              Take the first step towards better mental health with our compassionate and experienced team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button
                onClick={() => window.location.href = '/contact'}
                className="px-8 py-4 bg-white hover:bg-gray-100 text-sage-700 transition-all duration-300 text-sm tracking-widest uppercase font-medium rounded-full shadow-lg"
              >
                CONTACT US TODAY
              </button>
              <button
                onClick={() => window.location.href = '/book-appointment'}
                className="px-8 py-4 bg-secondary-800 hover:bg-secondary-900 text-white transition-all duration-300 text-sm tracking-widest uppercase font-medium rounded-full shadow-lg"
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
