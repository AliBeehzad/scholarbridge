// app/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              ScholarBridge
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting students with fully-funded scholarships worldwide. 
              Your bridge to global education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/#scholarships" className="hover:text-white transition text-sm">
                  Scholarships
                </Link>
              </li>
              <li>
                <Link href="/#templates" className="hover:text-white transition text-sm">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white transition text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition text-sm">
                  Scholarship Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition text-sm">
                  Application Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition text-sm">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info - Updated with your details */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Contact Us</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2 text-sm">
                <div className="bg-green-600/20 p-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771z"/>
                  </svg>
                </div>
                <a href="https://wa.me/93770038945" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  +93 77 003 8945
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="bg-blue-600/20 p-1.5 rounded-lg">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href="mailto:alibeehzadzai@gmail.com" className="hover:text-white transition">
                  alibeehzadzai@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm mt-4">
                <div className="bg-purple-600/20 p-1.5 rounded-lg mt-0.5">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-400">
                  Available Mon-Fri,<br />9:00 AM - 6:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Admin Link */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ScholarBridge. All rights reserved.
          </p>
          <Link 
            href="/admin" 
            className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Admin Access
          </Link>
        </div>
      </div>
    </footer>
  );
}