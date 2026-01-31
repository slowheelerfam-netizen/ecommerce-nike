import type { Metadata } from 'next';
import { CategoryPage } from '../../components';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sale',
  description: 'Discounted picks and deals across the catalog.',
};

export default async function SalePage() {
  return (
    <CategoryPage
      type="sale"
      title="Sale"
      description="Discounted picks and deals across the catalog."
    />
  );
}

