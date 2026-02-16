// app/page.tsx - COMPLETELY UPDATED WITH FIXED WAVE AND COLORFUL DESIGN
"use client"; // 🔴 IMPORTANT: Add this at the top!

import { useState, useEffect } from "react"; // ✅ FIXED: Added useEffect import
import ScholarshipCard from "../components/ScholarshipCard";
import TemplateCard from "../components/TemplateCard";
import Link from "next/link";

const API_URL = "https://scholarbridge-backend-nvn2.onrender.com";

export default function Home() {
  // 🔴 NEW: State for contact form
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState({ 
    submitting: false, 
    success: false, 
    error: "" 
  });

  // State for scholarships and templates
  const [scholarships, setScholarships] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Use useEffect instead of useState for data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scholarshipsRes, templatesRes] = await Promise.all([
          fetch(`${API_URL}/api/scholarships`),
          fetch(`${API_URL}/api/templates`)
        ]);
        
        const scholarshipsData = await scholarshipsRes.json();
        const templatesData = await templatesRes.json();
        
        setScholarships(scholarshipsData);
        setTemplates(templatesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []); // ✅ Empty dependency array = run once on mount

  // 🔴 NEW: Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: "" });

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setFormStatus({ submitting: false, success: true, error: "" });
        setFormData({ name: "", email: "", message: "" });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setFormStatus(prev => ({ ...prev, success: false }));
        }, 5000);
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error: any) {
      setFormStatus({ 
        submitting: false, 
        success: false, 
        error: error.message || "Failed to send message. Please try again." 
      });
    }
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing scholarships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* HERO SECTION - FIXED WAVE POSITION - TEXT FULLY VISIBLE */}
      <section className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-visible">
        {/* Animated background */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Gateway to <span className="text-yellow-300 animate-pulse">Global Education</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
              Discover thousands of scholarships, download application templates, 
              and make your study abroad dream a reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="#scholarships" 
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 text-center shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Browse Scholarships</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="#templates" 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 text-center shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Download Templates</span>
                <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* FIXED WAVE - Now properly positioned with no text overlap */}
        <div className="absolute bottom-0 left-0 right-0 leading-none -mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="1" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* STATS SECTION - Colorful Cards */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Scholarships</div>
              <div className="mt-4 text-white/80 text-sm">🎓 Worldwide</div>
            </div>
            <div className="group bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-emerald-100">Countries</div>
              <div className="mt-4 text-white/80 text-sm">🌍 Global</div>
            </div>
            <div className="group bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-purple-100">Students Helped</div>
              <div className="mt-4 text-white/80 text-sm">🎯 Success Stories</div>
            </div>
            <div className="group bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-4xl font-bold text-white mb-2">100+</div>
              <div className="text-orange-100">Templates</div>
              <div className="mt-4 text-white/80 text-sm">📄 Free Resources</div>
            </div>
          </div>
        </div>
      </section>

      {/* SCHOLARSHIPS SECTION */}
      <section id="scholarships" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Latest Scholarships
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recently added opportunities from universities worldwide
            </p>
          </div>

          {scholarships.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
              <div className="text-6xl mb-4">🎓</div>
              <p className="text-gray-500 text-lg">No scholarships added yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {scholarships.slice(0, 6).map((sch: any, index: number) => (
                <div key={sch._id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ScholarshipCard scholarship={sch} />
                </div>
              ))}
            </div>
          )}

          {scholarships.length > 6 && (
            <div className="text-center mt-12">
              <Link 
                href="/scholarships" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                View All Scholarships
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* TEMPLATES SECTION - Ultra Colorful */}
      <section id="templates" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Application Templates
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Download free templates for your scholarship applications
            </p>
          </div>

          {templates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-500 text-lg">No templates available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.slice(0, 4).map((template: any, index: number) => (
                <div key={template._id} className="animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                  <TemplateCard template={template} />
                </div>
              ))}
            </div>
          )}
          
          {templates.length > 4 && (
            <div className="text-center mt-10">
              <Link 
                href="/templates" 
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition group"
              >
                View All Templates
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CONTACT SECTION - With working form */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions? We're here to help you on your scholarship journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              {/* WhatsApp Card */}
              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-green-500">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp</h3>
                    <p className="text-gray-600 mb-4">Direct message us on WhatsApp for instant support</p>
                    <a 
                      href="https://wa.me/93770038945" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 font-semibold shadow-lg group/btn"
                    >
                      <svg className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771z"/>
                      </svg>
                      +93 77 003 8945
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600 mb-4">Send us your questions anytime, we reply within 24h</p>
                    <a 
                      href="mailto:alibeehzadzai@gmail.com"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-semibold shadow-lg group/btn"
                    >
                      <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      alibeehzadzai@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 🔴 UPDATED: Contact Form with State and Submission Handler */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-500">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Send us a Message
              </h3>
              
              {/* Success Message */}
              {formStatus.success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <p className="text-green-700 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    ✅ Message sent successfully! We'll get back to you soon.
                  </p>
                </div>
              )}
              
              {/* Error Message */}
              {formStatus.error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="text-red-700 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ❌ {formStatus.error}
                  </p>
                </div>
              )}
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="group">
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Your Name" 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition outline-none group-hover:border-purple-300"
                    required
                    disabled={formStatus.submitting}
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Your Email" 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition outline-none"
                    required
                    disabled={formStatus.submitting}
                  />
                </div>
                <div>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Your Message" 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition outline-none resize-none"
                    required
                    disabled={formStatus.submitting}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={formStatus.submitting}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-6 py-4 rounded-xl font-bold hover:from-purple-700 hover:via-pink-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus.submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION - Enhanced */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                About ScholarBridge
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We're on a mission to make education accessible to everyone, everywhere. 
                ScholarBridge connects students with fully-funded scholarships, 
                provides application resources, and offers guidance throughout the journey.
              </p>
              <div className="space-y-4">
                {[
                  "Verified scholarships from official sources",
                  "Free downloadable application templates",
                  "Video guides and tutorials",
                  "24/7 support via WhatsApp and Email"
                ].map((text, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
              
              <h3 className="text-2xl font-bold mb-6 relative">Start Your Journey Today</h3>
              <p className="text-blue-100 mb-8 relative text-lg">
                Join thousands of students who have successfully secured scholarships through ScholarBridge.
              </p>
              
              <div className="space-y-4 relative">
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="font-semibold">New scholarships added daily</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-semibold">100% free resources</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Enhanced */}
      <section className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of students who found their perfect scholarship through ScholarBridge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#scholarships" 
              className="bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>Find Scholarships</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="#contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 group"
            >
              <span>Contact Us</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}/ /   F o r c e   V e r c e l   r e d e p l o y   0 2 / 1 6 / 2 0 2 6   1 7 : 1 3 : 2 8  
 