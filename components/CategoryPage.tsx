'use client';

import React from 'react';
import { CategoryGrid, PageLayout } from '.';
import { fetchSneaksProducts } from '@/lib/external/sneaksFetch';
import type { UiProduct } from '@/lib/utils/sneaksTransform';

type CategoryType = 'men' | 'women' | 'kids' | 'sale' | 'new-arrivals';

type CategoryPageProps = {
  type: CategoryType;
  title: string;
  description: string;
};

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-17 sm:gap-21">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="border border-light-200 rounded-xl p-4 animate-pulse">
          <div className="w-full h-48 bg-light-200 rounded-lg" />
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-light-200 rounded w-3/4" />
            <div className="h-3 bg-light-200 rounded w-1/2" />
            <div className="h-5 bg-light-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CategoryPage({ type, title, description }: CategoryPageProps) {
  const [products, setProducts] = React.useState<UiProduct[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchSneaksProducts(type)
      .then((data) => {
        if (mounted) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setProducts([]);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [type]);

  return (
    <PageLayout title={title} description={description}>
      {loading ? (
        <CategorySkeleton />
      ) : products.length > 0 ? (
        <CategoryGrid products={products} toastFromModalOnly />
      ) : (
        <div className="text-center text-dark-700">
          <p className="mb-4">No products found for this category.</p>
          <div className="inline-flex gap-3">
            <a href="/men" className="underline">Men</a>
            <a href="/women" className="underline">Women</a>
            <a href="/kids" className="underline">Kids</a>
            <a href="/sale" className="underline">Sale</a>
            <a href="/new-arrivals" className="underline">New Arrivals</a>
          </div>
        </div>
      )}
    </PageLayout>
  );
}