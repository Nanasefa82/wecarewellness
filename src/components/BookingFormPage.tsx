import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, MapPin, Users, Heart, Briefcase, Shield } from 'lucide-react';
import { Header, Footer } from './layout';
import { format, parseISO } from 'date-fns';
import { useBookings } from '../hooks/useBookings';
import { ExtendedBookingFormData } from '../types/booking';
import { supabase } from '../lib/supabase';

const BookingFormPage: React.FC = () => {
    const { createBooking, loading, error } = useBookings();
    
    const [selectedSlot, setSelectedSlot] = useState<{
        id: string;
        start_time: string;
        end_time: string;
        appointment_type: string;
        doctor_id: string;
    } | null>(null);
    
    const [doctors, setDoctors] = useState<Array<{
        id: string;
        user_id: string;
        name: string;
        specialization?: string;
        bio?: string;
    }>>([]);
    
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
    
    const [formData, setFormData] = useState<ExtendedBookingFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        preferredDate: '',
        preferredTime: '',
        reasonForVisit: '',
        previousTreatment: '',
        currentMedications: '',
        insuranceProvider: '',
        emergencyContact: '',
        emergencyPhone: '',
        availability_slot_id: undefined,
        consent_accepted: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [showConsentForm, setShowConsentForm] = useState(false);
    const [consentAccepted, setConsentAccepted] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Fetch available doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data, error } = await supabase
                    .from('doctor_profiles')
                    .select('id, user_id, name, specialization, bio')
                    .order('name');
                
                if (error) throw error;
                setDoctors(data || []);
            } catch (err) {
                console.error('Error fetching doctors:', err);
            }
        };
        
        fetchDoctors();
    }, []);

    // Load selected slot from localStorage on component mount
    useEffect(() => {
        const storedSlot = localStorage.getItem('selectedSlot');
        if (storedSlot) {
            try {
                const slot = JSON.parse(storedSlot);
                setSelectedSlot(slot);
                
                // Pre-populate form with slot information
                const slotDate = parseISO(slot.start_time);
                setFormData(prev => ({
                    ...prev,
                    availability_slot_id: slot.id,
                    preferredDate: format(slotDate, 'yyyy-MM-dd'),
                    preferredTime: format(slotDate, 'HH:mm')
                }));
            } catch (error) {
                console.error('Error parsing selected slot:', error);
            }
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate doctor selection
        if (!selectedDoctorId) {
            setSubmitMessage('Please select a doctor for your appointment.');
            return;
        }
        
        // Check if consent has been accepted
        if (!consentAccepted) {
            setShowConsentForm(true);
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Create booking with consent accepted
            const bookingData = {
                ...formData,
                consent_accepted: true
            };
            
            // Transform form data to API format
            // For date fields, ensure they're stored as ISO date strings (YYYY-MM-DD)
            const createData = {
                availability_slot_id: bookingData.availability_slot_id,
                doctor_id: selectedDoctorId, // Include selected doctor
                first_name: bookingData.firstName,
                last_name: bookingData.lastName,
                email: bookingData.email,
                phone: bookingData.phone,
                date_of_birth: bookingData.dateOfBirth, // Already in YYYY-MM-DD format from date input
                preferred_date: bookingData.preferredDate,
                preferred_time: bookingData.preferredTime,
                reason_for_visit: bookingData.reasonForVisit,
                previous_treatment: bookingData.previousTreatment,
                current_medications: bookingData.currentMedications,
                insurance_provider: bookingData.insuranceProvider,
                emergency_contact: bookingData.emergencyContact,
                emergency_phone: bookingData.emergencyPhone,
                consent_accepted: bookingData.consent_accepted
            };
            
            const result = await createBooking(createData);
            
            // Success - show success message and reset form
            setBookingSuccess(true);
            setSubmitMessage('Thank you for your appointment request! We will contact you within 24 hours to confirm your appointment.');
            
            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                dateOfBirth: '',
                preferredDate: '',
                preferredTime: '',
                reasonForVisit: '',
                previousTreatment: '',
                currentMedications: '',
                insuranceProvider: '',
                emergencyContact: '',
                emergencyPhone: '',
                availability_slot_id: undefined,
                consent_accepted: false
            });
            
            // Clear localStorage
            localStorage.removeItem('selectedSlot');
            setSelectedSlot(null);
            
            console.log('✅ Booking created successfully:', result);
            
        } catch (err) {
            console.error('❌ Booking submission failed:', err);
            setSubmitMessage('Sorry, there was an error submitting your appointment request. Please try again or contact us directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const benefits = [
        {
            icon: <MapPin className="w-6 h-6 text-sage-600" />,
            title: "Distance and Transportation",
            problem: "You live far away from a psychiatric clinic, don't have access to transportation, or simply prefer not to spend the time traveling to a clinic.",
            solution: "Log on and meet with a clinician exactly where you are, no driving required."
        },
        {
            icon: <Users className="w-6 h-6 text-sage-600" />,
            title: "Caregiving Responsibilities",
            problem: "You are a parent or primary caregiver for an elderly or disabled family member and find it difficult to arrange care during appointment times.",
            solution: "Have your visit from the comfort of home, no need to arrange extra care."
        },
        {
            icon: <Clock className="w-6 h-6 text-sage-600" />,
            title: "Specialized Care Availability",
            problem: "There are no psychiatrists in your local area who specialize in your issue, or their wait time is too long.",
            solution: "Access providers from across your state and book within days, not weeks or months!"
        },
        {
            icon: <Heart className="w-6 h-6 text-sage-600" />,
            title: "Comfort and Accessibility",
            problem: "You feel more comfortable talking to someone from the comfort of your own home or office, or you have a physical or mental health condition that makes it hard to leave the house.",
            solution: "Join your session from wherever you are, no office visit required!"
        },
        {
            icon: <Briefcase className="w-6 h-6 text-sage-600" />,
            title: "Work Schedule Constraints",
            problem: "Your work hours are restrictive, and you are unable to attend appointments within your working hours.",
            solution: "We Care Wellness LLC provides flexible scheduling Monday through Saturday that fit your schedule."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />
            
            {/* Header Section */}
            <section className="bg-white py-16 lg:py-20">
                <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
                    <div className="text-center mb-12">
                        <div className="text-secondary-500 text-base tracking-widest uppercase font-light mb-6">
                            BOOK YOUR APPOINTMENT
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-800 leading-tight mb-8 max-w-4xl mx-auto">
                            Start Your Mental Health Journey Today
                        </h1>
                        <p className="text-xl md:text-2xl text-secondary-600 leading-relaxed max-w-3xl mx-auto font-light">
                            Experience the convenience and comfort of online psychiatric care with our experienced team.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content - Two Column Layout */}
            <section className="bg-white py-16 lg:py-20">
                <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        
                        {/* Left Column - Information */}
                        <div className="space-y-12">
                            {/* Medication Information */}
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
                                <div className="flex items-center mb-6">
                                    <Shield className="w-8 h-8 text-blue-600 mr-4" />
                                    <h2 className="text-2xl md:text-3xl font-serif text-secondary-800">
                                        What Medications Does We Care Wellness LLC Prescribe?
                                    </h2>
                                </div>
                                <div className="space-y-4 text-secondary-700">
                                    <p className="leading-relaxed">
                                        At We Care Wellness LLC, our psychiatric nurse practitioners can prescribe a range of psychiatric medications, including <strong>antidepressants, anti-anxiety medications, and other non-stimulant medications</strong>.
                                    </p>
                                    <p className="leading-relaxed">
                                        We prioritize safe medical care according to current best practices. While we do not prescribe any controlled substances, we are happy to evaluate and recommend alternative medications that could potentially benefit you.
                                    </p>
                                    <div className="bg-blue-100 rounded-lg p-4 mt-4">
                                        <h4 className="font-semibold text-blue-800 mb-2">Important Note:</h4>
                                        <p className="text-sm text-blue-700 leading-relaxed">
                                            Our psychiatric nurse practitioners are unable to prescribe controlled substances, including stimulant medications (Adderall, Concerta, Focalin, Vyvanse), benzodiazepines (Xanax, Ativan, Lorazepam), and hypnotics (Lunesta, Sonata, Ambien). We also do not currently treat substance use disorders.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits Section */}
                            <div>
                                <h2 className="text-3xl md:text-4xl font-serif text-secondary-800 mb-8">
                                    Benefits of Online Psychiatry at We Care Wellness LLC
                                </h2>
                                <p className="text-lg text-secondary-600 leading-relaxed mb-8">
                                    Accessing care online through We Care Wellness LLC means you have fast, easy access to care no matter where you are or what barriers to care you may face. Instead of taking time off work or spending time driving to a clinic, you can simply find a comfortable, private location wherever you are to access effective, personalized care with our team.
                                </p>
                                
                                <div className="space-y-6">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                                                    {benefit.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-serif text-secondary-800 mb-3">
                                                        {benefit.title}
                                                    </h3>
                                                    <p className="text-secondary-600 mb-3 leading-relaxed">
                                                        <strong>Challenge:</strong> {benefit.problem}
                                                    </p>
                                                    <p className="text-sage-700 font-medium leading-relaxed">
                                                        <strong>Solution:</strong> {benefit.solution}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-sage-50 border border-sage-200 rounded-xl">
                                    <p className="text-lg text-secondary-800 font-medium text-center">
                                        In short, online psychiatry at We Care Wellness LLC is ideal for people who want <strong>speedy access to care</strong> that emphasizes <strong>comfort and convenience</strong> without sacrificing quality.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Booking Form */}
                        <div className="lg:sticky lg:top-8">
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
                                <h2 className="text-2xl md:text-3xl font-serif text-secondary-800 mb-6">
                                    Book Your Appointment
                                </h2>

                                {/* Selected Appointment Details */}
                                {selectedSlot && (
                                    <div className="mb-6 p-4 bg-sage-50 border border-sage-200 rounded-lg">
                                        <h3 className="text-lg font-medium text-secondary-800 mb-3 flex items-center">
                                            <Calendar className="w-5 h-5 text-sage-600 mr-2" />
                                            Selected Appointment
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-secondary-700">
                                                <Calendar className="w-4 h-4 text-sage-600 mr-2" />
                                                <span className="font-medium">
                                                    {format(parseISO(selectedSlot.start_time), 'EEEE, MMMM d, yyyy')}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-secondary-700">
                                                <Clock className="w-4 h-4 text-sage-600 mr-2" />
                                                <span>
                                                    {format(parseISO(selectedSlot.start_time), 'h:mm a')} - {format(parseISO(selectedSlot.end_time), 'h:mm a')}
                                                </span>
                                            </div>
                                            <div className="text-sm text-secondary-600 capitalize">
                                                Appointment Type: {selectedSlot.appointment_type}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {submitMessage && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-700">{submitMessage}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Personal Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                                                placeholder="First Name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                                                placeholder="Last Name"
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-secondary-700 mb-2">
                                            Date of Birth *
                                        </label>
                                        <input
                                            type="date"
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                                        />
                                    </div>

                                    {/* Doctor Selection */}
                                    <div>
                                        <label htmlFor="doctorSelection" className="block text-sm font-medium text-secondary-700 mb-2">
                                            Select Doctor *
                                        </label>
                                        <select
                                            id="doctorSelection"
                                            value={selectedDoctorId}
                                            onChange={(e) => setSelectedDoctorId(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                                        >
                                            <option value="">-- Select a doctor --</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor.id} value={doctor.user_id}>
                                                    {doctor.name}
                                                    {doctor.specialization && ` - ${doctor.specialization}`}
                                                </option>
                                            ))}
                                        </select>
                                        {doctors.length === 0 && (
                                            <p className="text-sm text-gray-500 mt-1">Loading doctors...</p>
                                        )}
                                    </div>

                                    {/* Appointment Preferences */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="preferredDate" className="block text-sm font-medium text-secondary-700 mb-2">
                                                Preferred Date
                                            </label>
                                            <input
                                                type="date"
                                                id="preferredDate"
                                                name="preferredDate"
                                                value={formData.preferredDate}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="preferredTime" className="block text-sm font-medium text-secondary-700 mb-2">
                                                Preferred Time
                                            </label>
                                            <select
                                                id="preferredTime"
                                                name="preferredTime"
                                                value={formData.preferredTime}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                                            >
                                                <option value="">Select Time</option>
                                                <option value="morning">Morning (8AM - 12PM)</option>
                                                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                                                <option value="evening">Evening (5PM - 8PM)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Medical Information */}
                                    <div>
                                        <label htmlFor="reasonForVisit" className="block text-sm font-medium text-secondary-700 mb-2">
                                            Reason for Visit *
                                        </label>
                                        <textarea
                                            id="reasonForVisit"
                                            name="reasonForVisit"
                                            value={formData.reasonForVisit}
                                            onChange={handleInputChange}
                                            required
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors resize-vertical"
                                            placeholder="Please describe what brings you to seek care..."
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="previousTreatment" className="block text-sm font-medium text-secondary-700 mb-2">
                                            Previous Mental Health Treatment
                                        </label>
                                        <textarea
                                            id="previousTreatment"
                                            name="previousTreatment"
                                            value={formData.previousTreatment}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors resize-vertical"
                                            placeholder="Previous therapy, medications, or treatments..."
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="currentMedications" className="block text-sm font-medium text-secondary-700 mb-2">
                                            Current Medications
                                        </label>
                                        <textarea
                                            id="currentMedications"
                                            name="currentMedications"
                                            value={formData.currentMedications}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors resize-vertical"
                                            placeholder="List all current medications and dosages..."
                                        />
                                    </div>

                                    {/* Insurance Information */}
                                    <div>
                                        <label htmlFor="insuranceProvider" className="block text-sm font-medium text-secondary-700 mb-2">
                                            Insurance Provider
                                        </label>
                                        <input
                                            type="text"
                                            id="insuranceProvider"
                                            name="insuranceProvider"
                                            value={formData.insuranceProvider}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                                            placeholder="e.g., Blue Cross Blue Shield, Aetna, etc."
                                        />
                                    </div>

                                    {/* Emergency Contact */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="emergencyContact" className="block text-sm font-medium text-secondary-700 mb-2">
                                                Emergency Contact Name
                                            </label>
                                            <input
                                                type="text"
                                                id="emergencyContact"
                                                name="emergencyContact"
                                                value={formData.emergencyContact}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                                                placeholder="Emergency contact name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="emergencyPhone" className="block text-sm font-medium text-secondary-700 mb-2">
                                                Emergency Contact Phone
                                            </label>
                                            <input
                                                type="tel"
                                                id="emergencyPhone"
                                                name="emergencyPhone"
                                                value={formData.emergencyPhone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    {/* Consent Notice */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-start space-x-3">
                                            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-sm font-medium text-blue-800 mb-1">Consent Required</h4>
                                                <p className="text-sm text-blue-700">
                                                    Before submitting your appointment request, you'll be asked to review and accept our consent form for mental health services.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || loading}
                                        className="w-full px-8 py-4 bg-sage-600 hover:bg-sage-700 disabled:bg-sage-400 text-white transition-all duration-300 text-lg tracking-wide uppercase font-medium rounded-full flex items-center justify-center"
                                    >
                                        {(isSubmitting || loading) ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                                SUBMITTING...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Calendar className="w-5 h-5 mr-3" />
                                                REVIEW CONSENT & SUBMIT
                                            </div>
                                        )}
                                    </button>
                                </form>

                                {/* Error Message */}
                                {error && (
                                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0">⚠️</div>
                                            <div>
                                                <h4 className="text-sm font-medium text-red-800 mb-1">Submission Error</h4>
                                                <p className="text-sm text-red-700">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Success Message */}
                                {submitMessage && bookingSuccess && (
                                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="text-sm font-medium text-green-800 mb-1">Booking Submitted Successfully!</h4>
                                                <p className="text-sm text-green-700">{submitMessage}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* General Info */}
                                {!bookingSuccess && (
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-secondary-600">
                                                We will review your request and contact you within 24 hours to confirm your appointment and provide next steps.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Consent Form Modal */}
            {showConsentForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-serif text-secondary-800">Consent Form</h2>
                                <button
                                    onClick={() => setShowConsentForm(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Close consent form"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6 text-secondary-700">
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Informed Consent for Mental Health Services</h3>
                                    <p className="mb-4">
                                        By scheduling an appointment with We Care Wellness, you acknowledge and agree to the following terms:
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">1. Nature of Services</h4>
                                    <p className="mb-4">
                                        Mental health counseling involves discussing personal matters in a confidential setting to help you achieve your therapeutic goals. 
                                        The success of treatment depends on your active participation and honest communication.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">2. Confidentiality</h4>
                                    <p className="mb-4">
                                        All information shared during sessions is confidential and protected by law. However, there are limited circumstances 
                                        where confidentiality may be broken, including imminent danger to yourself or others, suspected child or elder abuse, 
                                        or when required by court order.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">3. Risks and Benefits</h4>
                                    <p className="mb-4">
                                        While therapy can provide significant benefits, it may also involve discussing uncomfortable topics that could 
                                        temporarily increase distress. You have the right to discontinue treatment at any time.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">4. Cancellation Policy</h4>
                                    <p className="mb-4">
                                        Please provide at least 24 hours notice for appointment cancellations. Late cancellations or no-shows may result in charges.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">5. Emergency Situations</h4>
                                    <p className="mb-4">
                                        If you experience a mental health emergency, please call 911 or go to your nearest emergency room. 
                                        For crisis support, contact the National Suicide Prevention Lifeline at 988.
                                    </p>
                                </div>

                                <div className="bg-sage-50 p-4 rounded-lg">
                                    <p className="text-sm">
                                        <strong>By accepting this consent form, you acknowledge that:</strong>
                                    </p>
                                    <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                                        <li>You have read and understood the above information</li>
                                        <li>You consent to receiving mental health services</li>
                                        <li>You understand your rights and responsibilities as a client</li>
                                        <li>You agree to the terms and conditions outlined above</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                                <button
                                    onClick={() => setShowConsentForm(false)}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setConsentAccepted(true);
                                        setShowConsentForm(false);
                                        // Automatically submit the form after consent is accepted
                                        const form = document.querySelector('form');
                                        if (form) {
                                            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                        }
                                    }}
                                    className="flex-1 px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
                                >
                                    I Accept & Submit Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default BookingFormPage;
