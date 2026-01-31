'use client';

import React from 'react';
import Image from 'next/image';

interface CardProps {
  title: string;
  subtitle?: string;
  description?: string;
  price?: string;
  image?: string;
  imageAlt?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  onImageClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  variant?: 'product' | 'category' | 'featured';
}

const Card = ({
  title,
  subtitle,
  description,
  price,
  image,
  imageAlt = title,
  buttonText,
  onButtonClick,
  onImageClick,
  className = "",
  children,
  variant = 'product'
}: CardProps) => {
  const [imgSrc, setImgSrc] = React.useState(image || '');
  const getCardHeight = () => {
    return 'h-[380px] sm:h-[420px]';
  };

  const getImageHeight = () => {
    return 'h-[260px] sm:h-[300px]';
  };

  return (
    <article 
      className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-default ${getCardHeight()} flex flex-col ${className}`}
      role="article"
    >
      {imgSrc && (
        <div 
          onClick={onImageClick}
          role={onImageClick ? 'button' : undefined}
          aria-label={onImageClick ? `View ${title}` : undefined}
          tabIndex={onImageClick ? 0 : undefined}
          className={`relative w-full ${getImageHeight()} overflow-hidden bg-transparent ${onImageClick ? 'cursor-pointer' : ''} p-2`}
        >
          <Image
            src={imgSrc}
            alt={imageAlt}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
            onError={() => setImgSrc('')}
          />
          {variant === 'featured' && (
            <div className="absolute top-3 left-3 bg-red-600 text-light-100 text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </div>
          )}
        </div>
      )}

      <div className="p-1 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold mb-1 text-dark-900">
          {title}
        </h3>
        
        {description && (
          <p className="text-body text-gray-500 mb-2 min-h-[48px] overflow-hidden">
            {description.length > 120 ? `${description.slice(0, 120)}…` : description}
          </p>
        )}
        
        {price && (
          <p className="text-sm font-bold mb-2 text-dark-900 mt-auto">
            {price}
          </p>
        )}

        {children}

        {buttonText && (
          <button
            onClick={onButtonClick}
            className="w-full bg-dark-900 text-light-100 py-3 rounded-lg hover:bg-dark-700 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base cursor-pointer"
          >
            {buttonText}
          </button>
        )}
      </div>
    </article>
  );
};

export default Card;
