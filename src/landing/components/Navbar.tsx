'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { EVENT_INFO } from '@/landing/data/eventData';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
  ];

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav border-b border-obsidian-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-[72px]">
          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group no-underline">
              {/* Official JY Logo Emblem */}
              <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border border-gold/30 group-hover:border-gold transition-colors flex-shrink-0 shadow-lg shadow-gold/10">
                <Image
                  src="/images/jy-logo.png"
                  alt="Jesus Youth Logo"
                  fill
                  className="object-cover"
                  sizes="44px"
                  priority
                />
              </div>
              {/* Desktop Logo Text */}
              <div className="hidden md:flex flex-col">
                <span className="font-heading font-bold text-cream text-xl leading-tight tracking-tight">
                  JESUS YOUTH
                </span>
                <span className="font-heading text-[10px] tracking-[0.22em] text-gold uppercase leading-tight mt-0.5 font-semibold">
                  MALABAR CAMPUS MEET '26
                </span>
              </div>
              {/* Mobile Logo Text */}
              <div className="flex md:hidden flex-col">
                <span className="font-heading font-bold text-cream text-sm leading-tight">
                  JESUS YOUTH
                </span>
                <span className="font-heading text-[9px] tracking-[0.18em] text-gold uppercase font-semibold">
                  MALABAR '26
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-body font-medium text-cream-muted hover:text-cream transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={EVENT_INFO.registerUrl || '#register'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              REGISTER NOW
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-cream hover:text-gold transition-colors p-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open main menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-obsidian/95 backdrop-blur-lg flex flex-col"
          >
            <div className="flex justify-end items-center h-16 px-4 sm:px-6">
              <button
                type="button"
                className="text-cream hover:text-gold transition-colors p-2"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close main menu"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center flex-1 space-y-8 p-4 pb-20">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-heading text-3xl font-medium text-cream-muted hover:text-gold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-8 mt-4 w-full max-w-xs flex justify-center">
                <Link
                  href={EVENT_INFO.registerUrl || '#register'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center py-4 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  REGISTER NOW
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
