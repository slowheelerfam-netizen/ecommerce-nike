'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchSneaksByQuery } from '@/lib/external/sneaksFetch';
import { CategoryGrid } from '../../components';

interface Product {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  image: string;
  buttonText: string;
  variant: 'product';
}

interface SearchResultsProps {
  products: Product[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ products }) => {
  const baseProducts = products && products.length > 0 ? products : [];
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  
  
  
  
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      const norm = (s: string) =>
        s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
      const raw = query.trim();
      const tokens = norm(raw).split(' ').filter(Boolean);
      const phrasePattern = new RegExp(raw.replace(/\*/g, '.*').replace(/\?/g, '.'), 'i');
      const filteredWithScores = baseProducts
        .map((product) => {
          const title = product.title || '';
          const subtitle = product.subtitle || '';
          const desc = product.description || '';
          const nTitle = norm(title);
          const nSubtitle = norm(subtitle);
          const nDesc = norm(desc);
          let score = 0;

          if (phrasePattern.test(title)) score += 6;
          if (phrasePattern.test(subtitle)) score += 3;
          if (phrasePattern.test(desc)) score += 3;

          tokens.forEach((t) => {
            if (!t) return;
            const tokenPattern = new RegExp(t.replace(/\*/g, '.*').replace(/\?/g, '.'), 'i');

            if (tokenPattern.test(title)) score += 5;
            else if (nTitle.includes(t)) score += 3;
            if (tokenPattern.test(subtitle)) score += 3;
            else if (nSubtitle.includes(t)) score += 2;
            if (tokenPattern.test(desc)) score += 2;
            else if (nDesc.includes(t)) score += 1;

            if (nTitle.startsWith(t)) score += 2;
            if (nSubtitle.startsWith(t)) score += 1;
          });

          return { product, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ product }) => product);

      const fetchRemoteAndMerge = async () => {
        const remoteQuery = query.length <= 3 ? `Nike ${query}` : query;
        const remote = await fetchSneaksByQuery(remoteQuery, 12);
        const seen = new Set<string>();
        const merged: Product[] = [];
        const pushUnique = (p: Product) => {
          const key = `${p.title}|${p.image}`;
          if (!seen.has(key)) {
            seen.add(key);
            merged.push(p);
          }
        };
        filteredWithScores.forEach(pushUnique);
        // Filter remote by token presence to keep relevance
        const nQuery = norm(query);
        remote
          .filter((p) => {
            const nt = norm(p.title || '');
            const ns = norm(p.subtitle || '');
            const nd = norm(p.description || '');
            return nt.includes(nQuery) || ns.includes(nQuery) || nd.includes(nQuery);
          })
          .forEach(pushUnique);
        setSearchResults(merged);
      };

      fetchRemoteAndMerge().catch(() => {
        setSearchResults(filteredWithScores);
      });
    }
  }, [searchParams, products, baseProducts]);

  return (
    <>
      {searchResults.length > 0 && (
        <CategoryGrid
          products={searchResults.filter(
            (p) => p.image && (/^https?:\/\//.test(p.image) || p.image.startsWith('/api/image?url='))
          )}
        />
      )}
      
      {searchQuery && searchResults.length === 0 && (
        <div className="text-center">
          <p className="text-body text-light-100">No results found for "{searchQuery}"</p>
        </div>
      )}
    </>
  );
};

export default SearchResults;
