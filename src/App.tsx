import './App.css'
// Cache bust - removed PerformanceDebug component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { Header } from './components/layout'
import Hero from './components/Hero'
import Services from './components/Services'
import Conditions from './components/Conditions'
import WhyChooseUs from './components/WhyChooseUs'
import PathToWellness from './components/PathToWellness'
import Testimonials from './components/Testimonials'
import Insurance from './components/Insurance'
import Contact from './components/Contact'
import { Footer } from './components/layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { PageLoader, RouteLoader } from './components/ui/LoadingSpinner'

// Lazy load admin components for better performance
const AdminLogin = lazy(() => import('./components/auth/AdminLogin'))
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const AvailabilityManager = lazy(() => import('./components/admin/AvailabilityManager'))
const AppointmentsDashboard = lazy(() => import('./components/admin/AppointmentsDashboard'))
const ContactSubmissionsManager = lazy(() => import('./components/admin/ContactSubmissionsManager'))
const Settings = lazy(() => import('./components/admin/Settings'))
const UserManagement = lazy(() => import('./components/admin/UserManagement'))
const BookingCalendar = lazy(() => import('./components/booking/BookingCalendar'))
const TestDataCreator = lazy(() => import('./components/TestDataCreator'))
// Import page components
import AboutUs from './components/AboutUs'
import ContactUs from './components/ContactUs'
import FeesInsurance from './components/FeesInsurance'
import BookingFormPage from './components/BookingFormPage'
import MedicationManagement from './components/MedicationManagement'
import SupabaseTest from './components/debug/SupabaseTest'
import AuthDebug from './components/debug/AuthDebug'
import DatabaseSetup from './components/debug/DatabaseSetup'
import ContactFormTest from './components/debug/ContactFormTest'
import SimpleContactTest from './components/debug/SimpleContactTest'
import AvailabilityDebug from './components/debug/AvailabilityDebug'
// Import legal pages
import PrivacyPolicy from './components/legal/PrivacyPolicy'
import TermsConditions from './components/legal/TermsConditions'
import HipaaNotice from './components/legal/HipaaNotice'
import './utils/testAuth' // Import to make testAuth available globally

// Main website component
const MainWebsite = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <Hero />

            {/* Services Section */}
            <Services />

            {/* Conditions Section */}
            <Conditions />

            {/* Why Choose Us Section */}
            <WhyChooseUs />

            {/* Path to Wellness Section */}
            <PathToWellness />

            {/* Testimonials Section */}
            <Testimonials />

            {/* Insurance Section */}
            <Insurance />

            {/* Contact Section */}
            <Contact />

            {/* Footer */}
            <Footer />
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Main website */}
                    <Route path="/" element={<MainWebsite />} />

                    {/* Public booking calendar */}
                    <Route path="/book-appointment" element={
                        <Suspense fallback={<PageLoader />}>
                            <BookingCalendar />
                        </Suspense>
                    } />

                    {/* About Us page */}
                    <Route path="/about" element={<AboutUs />} />

                    {/* Fees & Insurance page */}
                    <Route path="/fees-insurance" element={<FeesInsurance />} />

                    {/* Contact Us page */}
                    <Route path="/contact" element={<ContactUs />} />

                    {/* Booking Form page */}
                    <Route path="/book-appointment-form" element={<BookingFormPage />} />

                    {/* Medication Management page */}
                    <Route path="/medication-management" element={<MedicationManagement />} />

                    {/* Legal pages */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-conditions" element={<TermsConditions />} />
                    <Route path="/hipaa-notice" element={<HipaaNotice />} />

                    {/* Test data creator (for development) */}
                    <Route path="/test-data" element={
                        <Suspense fallback={<PageLoader />}>
                            <TestDataCreator />
                        </Suspense>
                    } />

                    {/* Supabase connection test (for debugging) */}
                    <Route path="/test-supabase" element={
                        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                            <SupabaseTest />
                        </div>
                    } />

                    {/* Auth debug page */}
                    <Route path="/debug-auth" element={<AuthDebug />} />

                    {/* Database setup page */}
                    <Route path="/setup-database" element={
                        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                            <DatabaseSetup />
                        </div>
                    } />

                    {/* Contact form test page */}
                    <Route path="/test-contact-form" element={
                        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                            <ContactFormTest />
                        </div>
                    } />

                    {/* Simple contact test page */}
                    <Route path="/test-simple-contact" element={
                        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                            <SimpleContactTest />
                        </div>
                    } />

                    {/* Availability debug page */}
                    <Route path="/debug-availability" element={
                        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                            <AvailabilityDebug />
                        </div>
                    } />

                    {/* Admin authentication */}
                    <Route path="/admin/login" element={
                        <Suspense fallback={<PageLoader />}>
                            <AdminLogin />
                        </Suspense>
                    } />

                    {/* Protected admin routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <ProtectedRoute requireDoctor>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/admin/availability"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <ProtectedRoute requireDoctor>
                                    <AdminDashboard>
                                        <Suspense fallback={<RouteLoader />}>
                                            <AvailabilityManager />
                                        </Suspense>
                                    </AdminDashboard>
                                </ProtectedRoute>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/admin/appointments"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <ProtectedRoute requireDoctor>
                                    <AdminDashboard>
                                        <Suspense fallback={<RouteLoader />}>
                                            <AppointmentsDashboard />
                                        </Suspense>
                                    </AdminDashboard>
                                </ProtectedRoute>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/admin/calendar"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <ProtectedRoute requireDoctor>
                                    <AdminDashboard>
                                        <Suspense fallback={<RouteLoader />}>
                                            <AvailabilityManager />
                                        </Suspense>
                                    </AdminDashboard>
                                </ProtectedRoute>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/admin/contact-messages"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <ProtectedRoute requireDoctor>
                                    <AdminDashboard>
                                        <Suspense fallback={<RouteLoader />}>
                                            <ContactSubmissionsManager />
                                        </Suspense>
                                    </AdminDashboard>
                                </ProtectedRoute>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/admin/settings"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <ProtectedRoute requireDoctor>
                                    <AdminDashboard>
                                        <Suspense fallback={<RouteLoader />}>
                                            <Settings />
                                        </Suspense>
                                    </AdminDashboard>
                                </ProtectedRoute>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <Suspense fallback={<PageLoader />}>
                                <ProtectedRoute requireAdmin>
                                    <AdminDashboard>
                                        <Suspense fallback={<RouteLoader />}>
                                            <UserManagement />
                                        </Suspense>
                                    </AdminDashboard>
                                </ProtectedRoute>
                            </Suspense>
                        }
                    />

                    {/* Unauthorized page */}
                    <Route
                        path="/unauthorized"
                        element={
                            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                                <div className="text-center">
                                    <h1 className="text-2xl font-serif text-secondary-800 mb-4">Access Denied</h1>
                                    <p className="text-secondary-600 mb-6">You don't have permission to access this page.</p>
                                    <a
                                        href="/"
                                        className="px-6 py-3 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
                                    >
                                        Return Home
                                    </a>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App