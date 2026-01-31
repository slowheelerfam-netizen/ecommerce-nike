import { CategoryGrid, PageLayout } from '.';
import { getProductsByType } from '@/lib/data/products';

type CategoryType = 'men' | 'women' | 'kids' | 'sale' | 'new-arrivals';

type CategoryPageProps = {
  type: CategoryType;
  title: string;
  description: string;
};

export default async function CategoryPage({ type, title, description }: CategoryPageProps) {
  const products = await getProductsByType(type);

  return (
    <PageLayout title={title} description={description}>
      {products.length > 0 ? (
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
