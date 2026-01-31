import type { Metadata } from 'next';
import CategoryPage from '../../components/CategoryPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Women's Collection",
  description: 'Stylish performance footwear designed specifically for women.',
};

export default async function WomenPage() {
  return (
    <CategoryPage
      type="women"
      title="Women&apos;s Collection"
      description="Stylish performance footwear designed specifically for women."
    />
  );
}
