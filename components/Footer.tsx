'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [newsletterMsg, setNewsletterMsg] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const handleHashNavigation = (href: string) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      
      if (pathname !== path) {
        // Navigate to the page first, then scroll
        router.push(path);
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const offset = 80; // Header height offset
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        // Same page, just scroll
        const element = document.getElementById(hash);
        if (element) {
          const offset = 80; // Header height offset
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
  };
  const footerSections: FooterSection[] = [
    {
      title: "Shop",
      links: [
        { href: "/men", label: "Men" },
        { href: "/women", label: "Women" },
        { href: "/kids", label: "Kids" },
        { href: "/new-arrivals", label: "New Arrivals" },
        { href: "/sale", label: "Sale" }
      ]
    },
    {
      title: "Support",
      links: [
        { href: "/#featured-products", label: "Help Center" },
        { href: "/#featured-products", label: "Shipping Info" },
        { href: "/#featured-products", label: "Returns & Exchanges" },
        { href: "/#featured-products", label: "Order Status" },
        { href: "/#featured-products", label: "Size Guide" }
      ]
    },
    {
      title: "Company",
      links: [
        { href: "https://about.nike.com/en/", label: "About Nike" },
        { href: "https://about.nike.com/en/", label: "Careers" },
        { href: "/", label: "Sustainability" },
        { href: "/", label: "Press Center" },
        { href: "/", label: "Investors" }
      ]
    }
  ];

  const socialLinks = [
    { href: "#", label: "Facebook", icon: "/facebook.svg" },
    { href: "#", label: "Instagram", icon: "/instagram.svg" },
    { href: "#", label: "Twitter", icon: "/x.svg" }
  ];

  const legalLinks: FooterLink[] = [
    { href: "/", label: "Privacy Policy" },
    { href: "/", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Settings" },
    { href: "/", label: "Accessibility" }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('email') as HTMLInputElement | null;
    const value = (input?.value || '').trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isValid) {
      setNewsletterMsg({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setNewsletterMsg({ type: 'success', text: 'Thanks! You are subscribed.' });
    e.currentTarget.reset();
  };

  return (
    <footer className={`bg-dark-900 text-light-100 ${className}`}>
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Image 
                src="/logo.svg" 
                alt="Nike Logo" 
                width={48} 
                height={48}
                className="w-12 h-12"
              />
              <h3 className="text-body-large font-bold text-xl sm:text-2xl">Nike</h3>
            </div>
            <p className="text-body text-dark-500 mb-8 max-w-sm leading-relaxed">
              Just Do It. Innovation and inspiration for every athlete in the world.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-dark-500 hover:text-light-100 transition-colors duration-200 p-2.5 hover:bg-dark-800 rounded-lg"
                  aria-label={social.label}
                >
                  <Image
                    src={social.icon}
                    alt={social.label}
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-body-medium font-semibold mb-6 text-light-100 uppercase tracking-wide">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link, i) => (
                    <li key={`${section.title}-${link.href}-${i}`}>
                      {link.href.includes('#') ? (
                        <button
                          onClick={() => handleHashNavigation(link.href)}
                          className="text-body text-dark-500 hover:text-light-100 transition-colors duration-200 text-sm leading-relaxed text-left w-full"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-body text-dark-500 hover:text-light-100 transition-colors duration-200 text-sm leading-relaxed"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-dark-700 pt-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-body-medium font-semibold mb-3 text-light-100 text-lg">
                Stay in the Loop
              </h4>
              <p className="text-body text-dark-500 mb-6 max-w-lg leading-relaxed">
                Get exclusive access to new releases, special offers, and the latest Nike news.
              </p>
            </div>
            <form 
              className="flex flex-col sm:flex-row gap-4 max-w-md lg:max-w-none"
              onSubmit={handleNewsletterSubmit}
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                type="email"
                name="email"
                id="newsletter-email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-light-100 text-light-100 placeholder-dark-500 transition-colors text-base"
                required
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
              />
              <button
                type="submit"
                className="px-8 py-4 bg-light-100 text-dark-900 rounded-lg hover:bg-light-200 transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-light-100 focus:ring-offset-2 focus:ring-offset-dark-900 text-base whitespace-nowrap transform hover:scale-105 active:scale-95"
              >
                Subscribe
              </button>
            </form>
            {newsletterMsg && (
              <p
                className={`mt-3 text-sm ${newsletterMsg.type === 'success' ? 'text-light-100' : 'text-red-400'}`}
                role="status"
                aria-live="polite"
              >
                {newsletterMsg.text}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-dark-700 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
            <p className="text-body text-dark-500 text-base leading-relaxed">
              &copy; {new Date().getFullYear()} Nike, Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-8">
              {legalLinks.map((link, i) => (
                <Link
                  key={`${link.href}-${link.label}-${i}`}
                  href={link.href}
                  className="text-body text-dark-500 hover:text-light-100 transition-colors duration-200 text-base leading-relaxed"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
