import type { Metadata } from 'next';
import CategoryPage from '../../components/CategoryPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'New Arrivals',
  description: 'Discover the latest drops and newest additions to our collection.',
};

export default async function NewArrivalsPage() {
  return (
    <CategoryPage
      type="new-arrivals"
      title="New Arrivals"
      description="Discover the latest drops and newest additions to our collection."
    />
  );
}
