const principles = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Triagem, não diagnóstico",
    description:
      "O sistema atua exclusivamente na triagem, padronização e apoio visual. Não substitui a avaliação profissional clínica.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Privacidade respeitada",
    description:
      "As imagens são processadas sem armazenamento externo. Confidencialidade e privacidade são tratadas como prioridade.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Transparência total",
    description:
      "Cada classificação vem acompanhada de métricas e justificativa. O sistema nunca oculta incertezas.",
  },
];

export default function Ethics() {
  return (
    <section className="section-padding bg-surface-mist/20">
      <div className="container-narrow">
        <div className="rounded-3xl bg-white p-8 md:p-14 lg:p-18">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brand">
              Ética e confiança
            </p>
            <h2 className="heading-section mb-5">
              Tecnologia com responsabilidade
            </h2>
            <p className="body-large">
              O EstetiScan AI é uma ferramenta de apoio. A decisão clínica
              final permanece sempre com o profissional.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {principles.map((p, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light/40 text-brand">
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
      </div>
    </section>
  );
}
