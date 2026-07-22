import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../services/api';
import {
  HeartPulse, Shield, Award, Clock, Activity, Stethoscope,
  Building, PhoneCall, CheckCircle2, UserCheck, Star, MapPin, Mail, Calendar
} from 'lucide-react';

const LandingPage = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch departments and active doctors from public endpoint
    API.get('/public/departments')
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err));

    API.get('/public/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  }, []);

  const fallbackDepartments = [
    { id: 1, name: 'Cardiology', description: 'Advanced cardiovascular diagnostics, heart surgeries, and preventative care.' },
    { id: 2, name: 'Neurology', description: 'Comprehensive brain, spinal cord, and neuro-rehabilitation services.' },
    { id: 3, name: 'Orthopedics', description: 'Joint replacements, trauma care, and bone fracture treatments.' },
    { id: 4, name: 'Dental Care', description: 'Root canal treatment, cosmetic dentistry, and oral surgery.' },
    { id: 5, name: 'ENT Specialty', description: 'Ear, Nose, and Throat diagnostics and microsurgical procedures.' },
    { id: 6, name: 'Pediatrics', description: 'Child wellness, vaccination, and specialized pediatric intensive care.' },
    { id: 7, name: 'General Medicine', description: 'Primary healthcare checkups, fever treatment, and chronic disease control.' },
    { id: 8, name: 'Gynecology', description: 'Maternity care, fetal medicine, and women wellness care.' },
    { id: 9, name: 'Emergency Care', description: '24/7 life support, trauma response, and critical emergency ICU.' },
  ];

  const displayDepts = departments.length > 0 ? departments : fallbackDepartments;

  const facilities = [
    { title: 'Intensive Care Unit (ICU)', desc: 'Ultra-modern 50-bed ICU with round-the-clock monitoring.', icon: Activity },
    { title: 'Advanced Pathology Lab', desc: 'Fully automated diagnostic testing with instant online report generation.', icon: Shield },
    { title: '24/7 In-House Pharmacy', desc: 'Complete stock of life-saving medications and generic prescription drugs.', icon: Building },
    { title: 'Emergency Ambulance', desc: 'Mobile ICU ambulances equipped with ventilator support.', icon: PhoneCall },
    { title: 'Emergency Trauma Unit', desc: 'Immediate trauma resuscitation unit ready 24 hours a day.', icon: HeartPulse },
    { title: 'Modular Operation Theatres', desc: 'High-tech HEPA filtered laminar air flow surgical rooms.', icon: Stethoscope },
  ];

  const testimonials = [
    { name: 'Sarah Jenkins', role: 'Cardiology Patient', text: 'The doctors at PulseCare performed my heart surgery seamlessly. The staff was immensely caring, and the facilities were top notch!', rating: 5 },
    { name: 'Michael Rodriguez', role: 'Orthopedics Patient', text: 'Prompt emergency response and accurate diagnosis. I recovered from my knee joint replacement within weeks!', rating: 5 },
    { name: 'Emily Watson', role: 'Pediatrics Parent', text: 'The pediatric care unit took exceptional care of my son during his treatment. Truly grateful for their dedication.', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text font-sans">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 animate-fade-in flex flex-col items-center">
            
            {/* Left Text */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 text-xs font-bold tracking-wide uppercase">
              <HeartPulse className="w-4 h-4" /> 24/7 World-Class Healthcare
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Advanced Care, <br />
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Compassionate Hands.
              </span>
            </h1>

            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Welcome to PulseCare Hospital. We bring together renowned doctors, modern surgical technologies, and patient-first care to ensure your health and peace of mind.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-base shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" /> Book Appointment
              </Link>
              
              <a
                href="tel:108"
                className="px-8 py-4 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 font-bold text-base hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" /> Emergency 108
              </a>
            </div>

            {/* Highlights */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-gray-200 dark:border-gray-800 w-full max-w-lg">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">50+</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Specialist Doctors</p>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">100k+</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Happy Patients</p>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">24/7</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Emergency ICU</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white dark:bg-dark-card border-y border-gray-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-500">About PulseCare</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Healing With Compassion & Innovation</h2>
            <p className="text-gray-600 dark:text-gray-300 text-base">
              PulseCare Hospital is a state-of-the-art super-specialty hospital dedicated to offering comprehensive healthcare services with a team of top-tier medical experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-4 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xl">
                01
              </div>
              <h3 className="text-xl font-bold">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                To deliver ethical, affordable, and world-class medical care using cutting-edge medical technologies and dedicated patient support.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-4 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 flex items-center justify-center font-bold text-xl">
                02
              </div>
              <h3 className="text-xl font-bold">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                To become the most trusted healthcare institution known for excellence in clinical outcomes, medical research, and patient care.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-4 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl">
                03
              </div>
              <h3 className="text-xl font-bold">Core Values</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Integrity, patient safety, medical excellence, continuous innovation, and transparent healthcare administration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-500">Specialties</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Our Medical Departments</h2>
            <p className="text-gray-600 dark:text-gray-300 text-base">
              Explore our wide range of medical departments equipped with advanced diagnostic labs and specialist doctors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayDepts.map((dept) => (
              <div
                key={dept.id}
                className="p-6 rounded-2xl glass-panel border border-gray-200 dark:border-dark-border hover:border-primary-500/50 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors">{dept.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{dept.description}</p>
                <Link
                  to="/register"
                  className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                >
                  Book Specialist →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-20 bg-white dark:bg-dark-card border-y border-gray-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-500">Our Experts</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Meet Our Senior Doctors</h2>
            <p className="text-gray-600 dark:text-gray-300 text-base">
              Our team consists of internationally trained specialists, surgeons, and physicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.length > 0 ? (
              doctors.map((doc) => (
                <div key={doc.id} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 text-white font-bold flex items-center justify-center text-2xl mx-auto shadow-md">
                    {doc.name.charAt(4) || 'D'}
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold">{doc.name}</h3>
                    <p className="text-xs font-semibold text-primary-500">{doc.specialization}</p>
                    <p className="text-xs text-gray-500">{doc.qualification} ({doc.experience} Years Exp)</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Fee: ₹{doc.consultationFee}</span>
                    <Link
                      to="/register"
                      className="px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Default Doctor Cards
              <>
                <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 space-y-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 text-white font-bold flex items-center justify-center text-2xl mx-auto shadow-md">
                    JD
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">Dr. John Doe</h3>
                    <p className="text-xs font-semibold text-primary-500">Chief Cardiologist</p>
                    <p className="text-xs text-gray-500">MD - Cardiology (12 Years Exp)</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Fee: ₹500</span>
                    <Link to="/register" className="px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700">Book</Link>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 space-y-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-secondary-500 to-primary-500 text-white font-bold flex items-center justify-center text-2xl mx-auto shadow-md">
                    JS
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">Dr. Jane Smith</h3>
                    <p className="text-xs font-semibold text-primary-500">Senior Neurologist</p>
                    <p className="text-xs text-gray-500">MD - Neurology (8 Years Exp)</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Fee: ₹600</span>
                    <Link to="/register" className="px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700">Book</Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-500">Infrastructure</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Hospital Facilities</h2>
            <p className="text-gray-600 dark:text-gray-300 text-base">
              Designed to meet international medical standards with comfort, hygiene, and immediate critical care response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl glass-panel border border-gray-200 dark:border-dark-border flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{fac.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{fac.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-dark-card border-y border-gray-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-500">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">What Our Patients Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, r) => (
                    <Star key={r} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-primary-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-500">Get In Touch</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold">Emergency & Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Have questions or need immediate assistance? Reach out to our 24/7 hospital help desk or visit our main healthcare campus.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Hospital Address</h4>
                    <p className="text-xs text-gray-500">123 Healthcare Blvd, Medical District, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">24/7 Helpline</h4>
                    <p className="text-xs text-gray-500">+1 (800) 555-PULSE / Emergency 108</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Email Support</h4>
                    <p className="text-xs text-gray-500">contact@pulsecarehospital.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Mock/Embed */}
            <div className="h-96 rounded-3xl overflow-hidden glass-panel border border-gray-200 dark:border-dark-border shadow-xl relative">
              <iframe
                title="Hospital Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.217707317769!2d-73.98823768459367!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629831732948!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
