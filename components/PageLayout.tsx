'use client';

type PageLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  dark?: boolean;
  padding?: 'default' | 'lg';
};

export default function PageLayout({ title, description, children, dark = false, padding = 'default' }: PageLayoutProps) {
  const bg = dark ? 'bg-dark-900' : 'bg-light-100';
  const textTitle = dark ? 'text-light-100' : 'text-dark-900';
  const textBody = dark ? 'text-light-100' : 'text-dark-700';
  const py = padding === 'lg' ? 'py-16 sm:py-24 lg:py-32' : 'py-16 sm:py-20';

  return (
    <div className={`min-h-screen ${bg}`}>
      <main className={`container mx-auto px-4 ${py}`}>
        <div className="text-center mb-12">
          <h1 className={`text-heading-3 sm:text-heading-2 ${textTitle} mb-4`}>{title}</h1>
          {description ? (
            <p className={`text-body ${textBody} max-w-2xl mx-auto`}>{description}</p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
}
