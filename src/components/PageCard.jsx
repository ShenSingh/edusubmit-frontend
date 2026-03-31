export default function PageCard({ title, subtitle, children }) {
  return (
    <section className="page-card fade-in">
      <header className="page-card-header">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}
