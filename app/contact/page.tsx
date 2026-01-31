import type { Metadata } from 'next';
import { PageLayout } from '../../components';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with our team.',
};

export default function ContactPage() {
  return (
    <PageLayout title="Contact" description="Get in touch with our team.">
      <div className="prose prose-invert max-w-none">
        <p>
          Need help? Reach out via email or social channels. We aim to respond within 1–2 business days.
        </p>
      </div>
    </PageLayout>
  );
}

