import React from 'react';
import { HeartPulse, MapPin, Phone, Mail, Clock, Globe, Share2, Send, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-lg">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">PulseCare</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Providing compassionate, world-class healthcare solutions with modern technology, specialist doctors, and 24/7 emergency care.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
                <Send className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 border-b border-slate-800 pb-2">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#home" className="hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-primary-400 transition-colors">About Hospital</a></li>
              <li><a href="#departments" className="hover:text-primary-400 transition-colors">Specialized Departments</a></li>
              <li><a href="#doctors" className="hover:text-primary-400 transition-colors">Meet Our Doctors</a></li>
              <li><a href="#facilities" className="hover:text-primary-400 transition-colors">Facilities & ICU</a></li>
              <li><a href="#contact" className="hover:text-primary-400 transition-colors">Emergency Contact</a></li>
            </ul>
          </div>

          {/* Col 3: Departments */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 border-b border-slate-800 pb-2">Departments</h3>
            <ul className="space-y-3 text-sm">
              <li>Cardiology & Heart Care</li>
              <li>Neurology & Spine</li>
              <li>Orthopedics & Joint Surgery</li>
              <li>Pediatrics & Newborn Care</li>
              <li>Dental & Oral Surgery</li>
              <li>ENT Specialty</li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 border-b border-slate-800 pb-2">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span>123 Healthcare Blvd, Medical District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                <span>+1 (800) 555-PULSE / 108 Emergency</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                <span>contact@pulsecarehospital.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-500 shrink-0" />
                <span>Open 24/7 365 Days</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PulseCare Hospital Management System. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">HIPAA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
