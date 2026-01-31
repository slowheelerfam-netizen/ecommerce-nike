import type { Metadata } from 'next';
import { PageLayout } from '../../components';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about our store and mission.',
};

export default function AboutPage() {
  return (
    <PageLayout title="About" description="Learn more about our store and mission.">
      <div className="prose prose-invert max-w-none">
        <p>
          We curate the latest performance footwear and apparel. Our goal is to bring you
          high-quality gear sourced from trusted marketplaces, with streamlined browsing and checkout.
        </p>
      </div>
    </PageLayout>
  );
}

