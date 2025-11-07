/**
 * GlassmorphicNavbar - Fixed navigation bar with glassmorphism
 *
 * Features:
 * - Fixed positioning with sticky behavior
 * - Mobile responsive
 * - Animated mobile menu
 * - Active link indication
 * - Accessibility features
 */

import React, { useState } from 'react';
import Link from 'next/link';

const NavLink = ({ href, children, active = false }) => (
  <Link
    href={href}
    className={`
      px-3 py-2 rounded-lg transition duration-200
      ${
        active
          ? 'text-white bg-white/20'
          : 'text-gray-100 hover:text-white hover:bg-white/10'
      }
      focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
    `}
  >
    {children}
  </Link>
);

export const GlassmorphicNavbar = ({ logo = 'Logo', links = [] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState('/');

  const defaultLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  const navLinks = links.length > 0 ? links : defaultLinks;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full z-50">
      {/* Glass backdrop effect */}
      <div className="
        bg-white/5 backdrop-filter backdrop-blur-lg
        border-b border-white/10
      ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="
                text-2xl font-bold text-white
                hover:text-gray-100 transition duration-200
                focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1
              "
              onClick={() => setActivePath('/')}
            >
              {logo}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  active={activePath === link.href}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="
                md:hidden p-2 rounded-lg
                hover:bg-white/10 transition duration-200
                text-white focus:outline-none focus:ring-2 focus:ring-white
              "
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="
              md:hidden pb-4 space-y-2
              border-t border-white/10 pt-4
              animate-in fade-in slide-in-from-top-2 duration-200
            ">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    block px-4 py-2 rounded-lg transition duration-200
                    ${
                      activePath === link.href
                        ? 'text-white bg-white/20'
                        : 'text-gray-100 hover:bg-white/10'
                    }
                  `}
                  onClick={() => {
                    setActivePath(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default GlassmorphicNavbar;
