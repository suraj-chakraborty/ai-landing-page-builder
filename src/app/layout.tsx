'use client';

import React, { useState } from "react";
import "./globals.css";
import { ThemeProvider } from 'next-themes'
import Link from "next/link";
import Image from "next/image";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Build your dream landing page with our intuitive drag-and-drop builder." />
        <meta name="author" content="Landing Page Builder Team" />
        <meta name="robots" content="index, follow" />
      </head>
      <body className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 w-full z-50">
            <nav className="container bg-white dark:bg-gray-800 md:bg-white dark:md:bg-gray-800 lg:bg-white dark:lg:bg-gray-800 mx-auto flex items-center justify-between py-4 px-2">
              {/* Logo Section */}
              <div className="flex items-center gap-2">
                <Image src="/favicon.ico" alt="Landing Page Builder Logo" className="w-8 h-8" />
                <div className="text-xl font-semibold">Landing Page Builder</div>
              </div>

              {/* Navigation Links (Desktop) */}
              <div className="hidden bg-grey shadow-md py-4 px-6 md:flex gap-2">
                <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                <Link href="/preview" className="text-gray-700 hover:text-blue-600">Editor</Link>
                <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={toggleMenu}
                  className="text-gray-700 hover:text-blue-600"
                  aria-label="Toggle Navigation Menu"
                >
                  {isMenuOpen ? "✖" : "☰"}
                </button>
              </div>
            </nav>

            {/* Mobile Navigation Links */}
            {isMenuOpen && (
              <div className="md:hidden bg-white shadow-md py-4 px-6 absolute top-16 left-0 w-full" style={{backgroundColor: "inh"}}>
                <Link href="/" className="block text-gray-700 hover:text-blue-600 py-2">Home</Link>
                <Link href="/editor" className="block text-gray-700 hover:text-blue-600 py-2">Editor</Link>
                <Link href="/about" className="block text-gray-700 hover:text-blue-600 py-2">About</Link>
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="container mx-auto py-6 px-6 mt-24 bg-gray-50 dark:bg-gray-900">{children}</main>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 shadow-inner py-6 mt-10">
            <div className="container mx-auto text-center text-sm text-gray-600">
              <p>© {new Date().getFullYear()} Landing Page Builder. All rights reserved.</p>
              <div className="mt-4">
                <a href="/privacy-policy" className="text-gray-600 hover:text-blue-600">Privacy Policy</a> | 
                <a href="/terms-of-service" className="text-gray-600 hover:text-blue-600"> Terms of Service</a>
              </div>
              <div className="mt-2">
                <a href="https://twitter.com" className="text-gray-600 hover:text-blue-600 mx-2">Twitter</a>
                <a href="https://facebook.com" className="text-gray-600 hover:text-blue-600 mx-2">Facebook</a>
                <a href="https://github.com" className="text-gray-600 hover:text-blue-600 mx-2">GitHub</a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
