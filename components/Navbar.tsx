'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../lib/store/cart';
import CartSidebar from './CartSidebar';
import { navItems } from '@/lib/data/nav';

interface NavItem {
  href: string;
  label: string;
}

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className = "" }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastFading, setToastFading] = useState(false);
  const router = useRouter();
  const cartStore = useCartStore();
  const items = cartStore.items;
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
    }
  };
  
  React.useEffect(() => {
    const onAdded = () => {
      setToastVisible(true);
      setToastFading(false);
      window.setTimeout(() => setToastFading(true), 1200);
      window.setTimeout(() => {
        setToastVisible(false);
        setToastFading(false);
      }, 2000);
    };
    const handler = () => onAdded();
    window.addEventListener('cart:add', handler as EventListener);
    return () => {
      window.removeEventListener('cart:add', handler as EventListener);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={`sticky top-0 z-50 bg-light-100 border-b border-light-300 ${className} relative`}>
      <nav className="container mx-auto px-4 py-4" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center space-x-3"
            aria-label="Nike Home"
          >
            <Image 
              src="/logo.svg" 
              alt="Nike Logo" 
              width={56} 
              height={56}
              className="w-14 h-14"
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body text-dark-700 hover:text-dark-900 transition-colors duration-200 font-medium relative group py-2"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-dark-900 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button 
              onClick={toggleSearch}
              className="p-2 sm:p-2.5 text-dark-700 hover:bg-light-200 rounded-lg font-medium hover:text-dark-900 transition-colors duration-200"
              aria-label="Search"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button 
              onClick={() => router.push('/sign-in')}
              className="hidden sm:block p-2.5 text-dark-700 hover:bg-light-200 rounded-lg font-medium hover:text-dark-900 transition-colors duration-200"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push('/sign-up')}
              className="hidden sm:block border border-dark-300 text-dark-900 px-4 py-2 rounded-lg font-medium hover:bg-light-200 hover:text-dark-900 transition-colors duration-200"
            >
              Sign Up
            </button>
            <button 
              onClick={toggleCart}
              className="p-2 sm:p-2.5 text-dark-700 hover:bg-light-200 rounded-lg transition-colors duration-200 relative"
              aria-label="Shopping Cart"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-light-100 text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>
            
            <button 
              className="lg:hidden p-2 sm:p-2.5 text-dark-700 hover:bg-light-200 rounded-lg transition-colors duration-200"
              onClick={toggleMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-light-300 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-body text-dark-700 hover:text-dark-900 transition-colors duration-200 font-medium py-2"
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-light-300 space-y-3">
                <button 
                  onClick={() => {
                    router.push('/sign-in');
                    closeMenu();
                  }}
                  className="w-full p-2.5 text-dark-700 hover:bg-light-200 rounded-lg font-medium hover:text-dark-900 transition-colors duration-200 text-center"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    router.push('/sign-up');
                    closeMenu();
                  }}
                  className="w-full border border-dark-300 text-dark-900 px-4 py-2 rounded-lg font-medium hover:bg-light-200 hover:text-dark-900 transition-colors duration-200"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-light-100 border-b border-light-300 shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 pr-12 border border-light-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent text-dark-900 placeholder-dark-500"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-dark-700 hover:text-dark-900 transition-colors duration-200"
                aria-label="Submit search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="mt-2 text-sm text-dark-700 hover:text-dark-900 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
    </header>
  );
};

export default Navbar;
