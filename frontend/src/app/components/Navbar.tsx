// app/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ScholarBridge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Home
            </Link>
            <Link href="/#scholarships" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Scholarships
            </Link>
            <Link href="/#templates" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Templates
            </Link>
            <Link href="/#about" className="text-gray-700 hover:text-blue-600 font-medium transition">
              About
            </Link>
            <Link href="/#contact" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Contact
            </Link>
            <Link 
              href="/admin" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition shadow-md"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/#scholarships" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                Scholarships
              </Link>
              <Link 
                href="/#templates" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                Templates
              </Link>
              <Link 
                href="/#about" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/#contact" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/admin" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium text-center"
                onClick={() => setIsOpen(false)}
              >
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}