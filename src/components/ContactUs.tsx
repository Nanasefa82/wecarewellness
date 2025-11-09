import { useState } from 'react';
import { Phone, Mail, MapPin, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Header, Footer } from './layout';
import { useContactForm } from '../hooks/useContactForm';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const [submitMessage, setSubmitMessage] = useState('');
  const [submitType, setSubmitType] = useState<'success' | 'error' | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { createSubmission, submitting, clearError } = useContactForm();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setSubmitMessage('');
    setSubmitType(null);
    clearError();

    // Validate form
    if (!validateForm()) {
      setSubmitMessage('Please correct the errors below.');
      setSubmitType('error');
      return;
    }

    try {
      console.log('📧 ContactUs: Submitting form data:', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        messageLength: formData.message.trim().length
      });

      const submission = await createSubmission({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      });

      console.log('📧 ContactUs: Submission result:', submission);

      if (submission) {
        setSubmitMessage('Thank you for your message! We will get back to you within 24 hours.');
        setSubmitType('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: ''
        });
        setValidationErrors({});
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (submitError) {
      console.error('❌ ContactUs: Submission error:', submitError);
      const errorMessage = submitError instanceof Error ? submitError.message : 'There was an error submitting your message. Please try again or call us directly.';
      setSubmitMessage(errorMessage);
      setSubmitType('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-white py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="text-sage-600 text-sm tracking-wider uppercase font-medium mb-4">
              Contact Us
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-secondary-800 leading-tight mb-6">
              Get in Touch with Our Team
            </h1>
            <p className="text-lg md:text-xl text-secondary-600 leading-relaxed font-light">
              Ready to start your wellness journey? We're here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-4">
              How to Reach Us
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Choose the method that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                Phone
              </h3>
              <p className="text-secondary-600 text-sm mb-3">
                Call us directly for immediate assistance
              </p>
              <a
                href="tel:+17038287620"
                className="text-sage-600 hover:text-sage-700 transition-colors font-medium text-lg"
              >
                703-828-7620
              </a>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                Email
              </h3>
              <p className="text-secondary-600 text-sm mb-3">
                Send us a message anytime
              </p>
              <a
                href="mailto:info@wecarewellnessllc.com"
                className="text-sage-600 hover:text-sage-700 transition-colors font-medium text-sm break-all"
              >
                info@wecarewellnessllc.com
              </a>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                Office
              </h3>
              <p className="text-secondary-600 text-sm mb-3">
                Woodbridge, Virginia
              </p>
              <p className="text-sage-600 font-medium text-sm">
                14623 Aurora Drive<br />
                Woodbridge, VA 22193
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-4">
                Send Us a Message
              </h2>
              <p className="text-secondary-600">
                We'll get back to you within 24 hours
              </p>
            </div>

            {submitMessage && (
              <div className={`mb-6 p-4 rounded-lg border flex items-start space-x-3 ${submitType === 'success'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
                }`}>
                {submitType === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <p className={submitType === 'success' ? 'text-green-700' : 'text-red-700'}>
                  {submitMessage}
                </p>
              </div>
            )}

            {/* Display validation errors */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-700 font-medium mb-2">Please correct the following errors:</p>
                    <ul className="text-red-600 text-sm space-y-1">
                      {Object.entries(validationErrors).map(([field, error]) => (
                        <li key={field}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-base font-medium text-secondary-700 mb-3">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors text-lg ${validationErrors.firstName
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                      }`}
                    placeholder="First"
                  />
                  {validationErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-base font-medium text-secondary-700 mb-3">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors text-lg ${validationErrors.lastName
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                      }`}
                    placeholder="Last"
                  />
                  {validationErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-base font-medium text-secondary-700 mb-3">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors text-lg ${validationErrors.email
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                    }`}
                  placeholder="your.email@example.com"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-base font-medium text-secondary-700 mb-3">
                  Comment or Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors resize-vertical text-lg ${validationErrors.message
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                    }`}
                  placeholder="Tell us how we can help you... (minimum 10 characters)"
                />
                {validationErrors.message && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-10 py-5 bg-sage-600 hover:bg-sage-700 disabled:bg-sage-400 disabled:cursor-not-allowed text-white transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full flex items-center justify-center"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    SENDING...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="w-4 h-4 mr-2" />
                    SEND MESSAGE
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-secondary-600 mb-8 max-w-2xl mx-auto">
              Don't wait to take the first step towards better mental health. Book an appointment today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = 'tel:703-828-7620'}
                className="px-8 py-4 bg-secondary-200 hover:bg-secondary-300 text-secondary-800 transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
              >
                CALL US NOW
              </button>
              <button
                onClick={() => window.location.href = '/book-appointment'}
                className="px-8 py-4 bg-sage-600 hover:bg-sage-700 text-white transition-all duration-300 text-base tracking-widest uppercase font-medium rounded-full"
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

export default ContactUs;
