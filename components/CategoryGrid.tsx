'use client';

import React from 'react';
import { Card } from '.';
import { useCartStore } from '../lib/store/cart';
import type { UiProduct as Product } from '../lib/data/products';
import Modal from './Modal';
import Image from 'next/image';

type CategoryGridProps = {
  products: Product[];
  className?: string;
  toastFromModalOnly?: boolean;
  disableToast?: boolean;
};

export default function CategoryGrid({ products, className = '', toastFromModalOnly = false, disableToast = false }: CategoryGridProps) {
  const { addItem } = useCartStore();
  const [selected, setSelected] = React.useState<Product | null>(null);
  const [toastVisible, setToastVisible] = React.useState(false);
  const [toastFading, setToastFading] = React.useState(false);

  const addToCart = (title: string, price: string, image: string) => {
    const priceNumber = parseFloat(price.replace('$', ''));
    addItem({
      id: title.toLowerCase().replace(/\s+/g, '-'),
      name: title,
      price: priceNumber,
      image: image
    });
  };

  const showToast = () => {
    if (disableToast) return;
    setToastVisible(true);
    setToastFading(false);
    window.setTimeout(() => setToastFading(true), 1200);
    window.setTimeout(() => {
      setToastVisible(false);
      setToastFading(false);
    }, 2000);
  };

  const enriched = products.map(p => ({
    ...p,
    onButtonClick: () => {
      addToCart(p.title, p.price, p.image);
      if (!toastFromModalOnly) showToast();
    },
    onImageClick: () => setSelected(p)
  }));

  return (
    <>
      {toastVisible && (
        <div className={`fixed top-[275px] left-1/2 -translate-x-1/2 translate-x-[200px] z-[60] bg-dark-900 text-[#39ff14] font-bold [text-shadow:0_0_8px_rgba(57,255,20,0.7)] px-4 py-2 rounded-lg shadow-lg transition-all duration-700 ${toastFading ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
          Added to cart
        </div>
      )}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[4.25rem] sm:gap-[5.25rem] items-stretch ${className}`}>
        {enriched.map((product, index) => (
          <div 
            key={`${product.title}-${index}`}
            className="animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card {...product} />
          </div>
        ))}
      </div>

      <Modal 
        isOpen={!!selected} 
        onClose={() => setSelected(null)} 
        title={selected?.title} 
        size="xl"
      >
        {selected && (
          <div className="space-y-6">
            {selected.image && (
              <div className="relative w-full h-[32rem] sm:h-[40rem] overflow-hidden">
                <Image 
                  src={selected.image} 
                  alt={selected.title} 
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                  unoptimized
                />
              </div>
            )}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-dark-900">{selected.title}</h2>
              {selected.subtitle && (
                <p className="text-dark-700">{selected.subtitle}</p>
              )}
              {selected.description && (
                <p className="text-dark-700">{selected.description}</p>
              )}
              <p className="text-xl font-bold text-dark-900">{selected.price}</p>
              <button
                onClick={() => {
                  addToCart(selected.title, selected.price, selected.image);
                  showToast();
                }}
                className="w-full bg-dark-900 text-light-100 py-3 rounded-lg hover:bg-dark-700 transition-all duration-200 font-medium"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
