import type { Metadata } from 'next';
import { CategoryPage } from '../../components';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Men's Collection",
  description: "Performance footwear and apparel for men.",
};

export default async function MenPage() {
  return (
    <CategoryPage
      type="men"
      title="Men&apos;s Collection"
      description="Performance footwear and apparel for men."
    />
  );
}

