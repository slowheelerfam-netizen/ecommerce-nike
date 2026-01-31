'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, Section } from '../components';
import Modal from '../components/Modal';
import { useCartStore } from '../lib/store/cart';
import { fetchSneaksProducts } from '../lib/external/sneaksFetch';

interface Product {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  image: string;
  buttonText: string;
  onButtonClick: () => void;
  variant?: 'product' | 'featured';
}

interface Category {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  onButtonClick: () => void;
  variant: 'category';
}

const HomePage = () => {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedFeatured, setSelectedFeatured] = React.useState<Product | null>(null);
  const [toastVisible, setToastVisible] = React.useState(false);
  const [toastFading, setToastFading] = React.useState(false);

  const scrollToFeatured = () => {
    const featuredSection = document.getElementById('featured-products');
    if (featuredSection) {
      const sectionTop = featuredSection.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = sectionTop - 80; // Adjust this value to fine-tune the position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const addToCart = (title: string, price: string, image: string) => {
    const priceNumber = parseFloat(price.replace('$', ''));
    addItem({
      id: title.toLowerCase().replace(/\s+/g, '-'),
      name: title,
      price: priceNumber,
      image: image
    });
    setToastVisible(true);
    setToastFading(false);
    window.setTimeout(() => setToastFading(true), 1200);
    window.setTimeout(() => {
      setToastVisible(false);
      setToastFading(false);
    }, 2000);
  };

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const arrivals = await fetchSneaksProducts('new-arrivals');
        if (mounted) {
          const mapped = arrivals.slice(0, 6).map((p) => ({
            title: p.title,
            subtitle: p.subtitle,
            description: p.description,
            price: p.price,
            image: p.image,
            buttonText: p.buttonText,
            variant: 'featured' as const,
            onButtonClick: () => addToCart(p.title, p.price, p.image),
          }));
          setFeaturedProducts(mapped);
        }
      } catch {
        if (mounted) setFeaturedProducts([]);
      }
      try {
        const [men, women, kids] = await Promise.all([
          fetchSneaksProducts('men'),
          fetchSneaksProducts('women'),
          fetchSneaksProducts('kids'),
        ]);
        const menImg = men[0]?.image || '';
        const womenImg = women[0]?.image || '';
        const kidsImg = kids[0]?.image || '';
        if (mounted) {
          const raw: Category[] = [
            {
              title: 'Men',
              description: `${Math.max(1, men.length)}+ Products`,
              image: menImg,
              buttonText: 'Shop Now',
              variant: 'category',
              onButtonClick: () => router.push('/men'),
            },
            {
              title: 'Women',
              description: `${Math.max(1, women.length)}+ Products`,
              image: womenImg,
              buttonText: 'Shop Now',
              variant: 'category',
              onButtonClick: () => router.push('/women'),
            },
            {
              title: 'Kids',
              description: `${Math.max(1, kids.length)}+ Products`,
              image: kidsImg,
              buttonText: 'Shop Now',
              variant: 'category',
              onButtonClick: () => router.push('/kids'),
            },
          ];
          const items = raw.filter((c) => c.image && (/^https?:\/\//.test(c.image) || c.image.startsWith('/api/image?url=')));
          setCategories(items);
        }
      } catch {
        if (mounted) setCategories([]);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [router, addItem]);


  return (
    <div className="min-h-screen bg-light-100">
      {toastVisible && (
        <div className={`fixed top-[275px] left-1/2 -translate-x-1/2 translate-x-[200px] z-[60] bg-dark-900 text-[#39ff14] font-bold [text-shadow:0_0_8px_rgba(57,255,20,0.7)] px-4 py-2 rounded-lg shadow-lg transition-all duration-700 ${toastFading ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
          Added to cart
        </div>
      )}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-30"></div>
        </div>
        <div className="relative z-10 text-center text-light-100 px-4 max-w-4xl mx-auto">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
            <Image 
              src="/logo.svg" 
              alt="Nike Logo" 
              width={120}
              height={120}
              className="w-24 h-24 sm:w-32 sm:h-32 transition-transform duration-200 hover:scale-110"
              priority
            />
          </div>
          
          <h1 className="text-heading-1 font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Just Do It
          </h1>
          <p className="text-lead mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            Discover the latest in athletic footwear, apparel, and accessories. 
            Push your limits with innovative gear designed for champions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
            <button 
              onClick={() => router.push('/new-arrivals')}
              className="bg-light-100 text-gray-500 px-8 py-4 rounded-lg font-medium hover:bg-light-200 hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Shop New Arrivals
            </button>
            <button 
              onClick={() => router.push('/men')}
              className="border-2 border-light-100 px-8 py-4 rounded-lg font-medium hover:bg-light-100 hover:text-dark-900 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Explore Collections
            </button>
            <button 
              onClick={scrollToFeatured}
              className="bg-light-100 text-gray-500 px-8 py-4 rounded-lg font-medium hover:bg-light-200 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Featured Products
            </button>
          </div>
        </div>
      </section>
      <div className="border-t-4 border-light-100"></div>
      <Section
        id="featured-products"
        title="Featured Products"
        description="Discover our handpicked selection of the latest and greatest Nike footwear."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[4.25rem] sm:gap-[5.25rem] items-stretch">
          {featuredProducts.map((product, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card {...product} onImageClick={() => setSelectedFeatured(product)} />
            </div>
          ))}
        </div>
      </Section>
      <Modal 
        isOpen={!!selectedFeatured} 
        onClose={() => setSelectedFeatured(null)} 
        title={selectedFeatured?.title} 
        size="xl"
      >
        {selectedFeatured && (
          <div className="space-y-6">
            {selectedFeatured.image && (
              <div className="relative w-full h-[32rem] sm:h-[40rem] overflow-hidden">
                <Image 
                  src={selectedFeatured.image} 
                  alt={selectedFeatured.title} 
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                  unoptimized
                />
              </div>
            )}
            <div className="space-y-4">
              {selectedFeatured.subtitle && (
                <p className="text-dark-700">{selectedFeatured.subtitle}</p>
              )}
              {selectedFeatured.description && (
                <p className="text-dark-700">{selectedFeatured.description}</p>
              )}
              <p className="text-xl font-bold text-dark-900">{selectedFeatured.price}</p>
              <button
                onClick={() => {
                  addToCart(selectedFeatured.title, selectedFeatured.price, selectedFeatured.image);
                }}
                className="w-full bg-dark-900 text-light-100 py-3 rounded-lg hover:bg-dark-700 transition-all duration-200 font-medium"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Section
        title="Shop by Category"
        description="Find the perfect gear for your lifestyle and performance needs."
        className="bg-light-200"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[4.25rem] sm:gap-[5.25rem] items-stretch">
          {categories.map((category, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card {...category} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default HomePage;
