import type { Metadata } from 'next';
import CategoryPage from '../../components/CategoryPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Kids' Collection",
  description: "Durable, comfortable footwear designed for growing feet and active kids.",
};

export default async function KidsPage() {
  return (
    <CategoryPage
      type="kids"
      title="Kids&apos; Collection"
      description="Durable, comfortable footwear designed for growing feet and active kids."
    />
  );
}
