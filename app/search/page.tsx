import React from 'react';
import SearchResults from '@/app/search/SearchResults';
import { PageLayout } from '../../components';

export const dynamic = 'force-dynamic';

interface Product {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  image: string;
  buttonText: string;
  variant: 'product';
}

const SearchPage = () => {
  const allProducts: Product[] = [];

  return (
    <PageLayout title="Search Results" dark padding="lg">
      <React.Suspense
        fallback={
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-light-100 mr-3"></div>
            <div className="text-light-100">Loading search results...</div>
          </div>
        }
      >
        <SearchResults products={allProducts} />
      </React.Suspense>
    </PageLayout>
  );
};

export default SearchPage;
