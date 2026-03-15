const problems = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Iluminação inadequada",
    description:
      "Fotos escuras, claras demais ou com sombras fortes prejudicam a comparação visual e o registro clínico.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 16l5-5 4 4 4-6 5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Fundo poluído",
    description:
      "Elementos indesejados no fundo da imagem dificultam a segmentação automática e a padronização.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    ),
    title: "Inconsistência visual",
    description:
      "Enquadramentos e qualidades técnicas diferentes entre as fotos tornam inviável uma comparação confiável.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Retrabalho da equipe",
    description:
      "Revisão manual de cada imagem consome tempo da equipe que poderia ser dedicado ao atendimento.",
  },
];

export default function Problem() {
  return (
    <section className="section-padding bg-surface-cream/30">
      <div className="container-narrow">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brand">
            O desafio
          </p>
          <h2 className="heading-section mb-5">
            A realidade das fotos clínicas hoje
          </h2>
          <p className="body-large">
            Clínicas de estética lidam diariamente com imagens em condições
            técnicas muito diferentes — e isso gera retrabalho, inconsistência e
            perda de tempo.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p, i) => (
            <div
              key={i}
              className="card-soft group flex flex-col items-start"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light/40 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                {p.icon}
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground-muted">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
