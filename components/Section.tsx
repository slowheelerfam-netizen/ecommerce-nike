type SectionProps = {
  id?: string;
  title?: string;
  description?: string;
  dark?: boolean;
  padding?: 'default' | 'lg';
  children: React.ReactNode;
  className?: string;
};

export default function Section({ id, title, description, dark = false, padding = 'default', children, className = '' }: SectionProps) {
  const bg = dark ? 'bg-dark-900' : '';
  const textTitle = dark ? 'text-light-100' : 'text-dark-900';
  const textBody = dark ? 'text-light-100' : 'text-dark-700';
  const py = padding === 'lg' ? 'py-16 sm:py-24 lg:py-32' : 'py-16 sm:py-20';

  return (
    <section id={id} className={`${py} ${bg} ${className}`}>
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="text-center mb-12">
            {title ? <h2 className={`text-heading-2 ${textTitle} mb-4`}>{title}</h2> : null}
            {description ? <p className={`text-body ${textBody} max-w-2xl mx-auto`}>{description}</p> : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
