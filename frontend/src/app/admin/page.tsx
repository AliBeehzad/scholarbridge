"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ScholarshipCard from "../components/ScholarshipCard";
import TemplateCard from "../components/TemplateCard";

const API_URL = "https://scholarbridge-backend-nvn2.onrender.com";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  
  // Admin credentials
  const ADMIN_USERNAME = "alibeehzad";
  const ADMIN_PASSWORD = "alibeehzad4517";
  
  // Scholarship form state
  const [scholarship, setScholarship] = useState({
    title: "", country: "", degree: "", deadline: "", description: "",
    benefits: "", requirements: "", officialLink: "", youtubeLink: "", image: "",
  });
  
  // Template form state
  const [template, setTemplate] = useState({
    name: "", description: "", fileUrl: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // ✅ Check localStorage for existing login on component mount
  useEffect(() => {
    const savedLogin = localStorage.getItem("adminLoggedIn");
    if (savedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch message count when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchMessageCount();
    }
  }, [isLoggedIn]);

  const fetchMessageCount = async () => {
    try {
      const res = await fetch(`${API_URL}/api/contact`);
      const data = await res.json();
      setMessageCount(data.length);
    } catch (error) {
      console.error("Failed to fetch message count:", error);
    }
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (loginForm.username === ADMIN_USERNAME && loginForm.password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      // ✅ Save login state to localStorage
      localStorage.setItem("adminLoggedIn", "true");
      setError("");
      setMessage({ type: "", text: "" });
    } else {
      setError("Invalid username or password!");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // ✅ Remove login state from localStorage
    localStorage.removeItem("adminLoggedIn");
    setLoginForm({ username: "", password: "" });
  };

  const handleScholarshipChange = (e: any) => {
    setScholarship({ ...scholarship, [e.target.name]: e.target.value });
  };

  const handleTemplateChange = (e: any) => {
    setTemplate({ ...template, [e.target.name]: e.target.value });
  };

  const submitScholarship = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    
    try {
      const res = await fetch(`${API_URL}/api/scholarships`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(scholarship),
      });
      
      if (!res.ok) throw new Error("Failed to add scholarship");
      
      setMessage({ type: "success", text: "✅ Scholarship added successfully!" });
      
      setScholarship({
        title: "", country: "", degree: "", deadline: "", description: "",
        benefits: "", requirements: "", officialLink: "", youtubeLink: "", image: "",
      });
    } catch (err) {
      setMessage({ type: "error", text: "❌ Error adding scholarship." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitTemplate = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    
    try {
      const res = await fetch(`${API_URL}/api/templates`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(template),
      });
      
      if (!res.ok) throw new Error("Failed to add template");
      
      setMessage({ type: "success", text: "✅ Template added successfully!" });
      
      setTemplate({ name: "", description: "", fileUrl: "" });
    } catch (err) {
      setMessage({ type: "error", text: "❌ Error adding template." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not logged in, show login page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Access
              </h1>
              <p className="text-gray-500 mt-2">Secure portal for scholarship management</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Sign In to Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // If logged in, show admin dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-blue-100 text-sm">Connected to: {API_URL.replace('https://', '')}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/admin/messages"
                className="bg-purple-500 text-white px-5 py-2.5 rounded-xl hover:bg-purple-600 transition flex items-center gap-2 shadow-lg font-semibold relative"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Messages
                {messageCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {messageCount}
                  </span>
                )}
              </Link>
              
              <Link
                href="/admin/manage"
                className="bg-yellow-500 text-white px-5 py-2.5 rounded-xl hover:bg-yellow-600 transition flex items-center gap-2 shadow-lg font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Manage Content
              </Link>
              
              <button
                onClick={handleLogout}
                className="bg-white/20 px-5 py-2.5 rounded-xl hover:bg-white/30 transition flex items-center gap-2 backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
            <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>{message.text}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scholarship Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Add New Scholarship</h2>
            </div>
            
            <form onSubmit={submitScholarship} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input name="title" value={scholarship.title} onChange={handleScholarshipChange} placeholder="🎓 Scholarship Title" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" required />
                <input name="country" value={scholarship.country} onChange={handleScholarshipChange} placeholder="🌍 Country" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" required />
                <input name="degree" value={scholarship.degree} onChange={handleScholarshipChange} placeholder="📚 Degree Level" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" required />
                <input name="deadline" value={scholarship.deadline} onChange={handleScholarshipChange} type="date" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" required />
              </div>
              
              <input name="officialLink" value={scholarship.officialLink} onChange={handleScholarshipChange} placeholder="🔗 Official Link" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" required />
              <input name="youtubeLink" value={scholarship.youtubeLink} onChange={handleScholarshipChange} placeholder="▶️ YouTube Link" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" />
              <input name="image" value={scholarship.image} onChange={handleScholarshipChange} placeholder="🖼️ Image URL" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" />
              
              <textarea name="description" value={scholarship.description} onChange={handleScholarshipChange} placeholder="📝 Description" rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" required />
              <textarea name="benefits" value={scholarship.benefits} onChange={handleScholarshipChange} placeholder="💰 Benefits" rows={2} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" />
              <textarea name="requirements" value={scholarship.requirements} onChange={handleScholarshipChange} placeholder="📋 Requirements" rows={2} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" />
              
              <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50">
                {isSubmitting ? "Adding..." : "➕ Add Scholarship"}
              </button>
            </form>
          </div>

          {/* Template Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Upload New Template</h2>
            </div>
            
            <form onSubmit={submitTemplate} className="p-6 space-y-4">
              <input name="name" value={template.name} onChange={handleTemplateChange} placeholder="📄 Template Name" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" required />
              <textarea name="description" value={template.description} onChange={handleTemplateChange} placeholder="📝 Description" rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" required />
              <input name="fileUrl" value={template.fileUrl} onChange={handleTemplateChange} placeholder="🔗 File URL" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" required />
              
              <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50">
                {isSubmitting ? "Uploading..." : "📤 Upload Template"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}