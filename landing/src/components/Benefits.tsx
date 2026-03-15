const benefits = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Padronização visual",
    description:
      "Garanta consistência nas fotos do antes e depois com análise e correção automática de qualidade.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Economia de tempo",
    description:
      "Elimine a revisão manual de cada foto. O motor processa lotes inteiros em segundos.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Melhora técnica automática",
    description:
      "Imagens recuperáveis são corrigidas com CLAHE adaptativa, sempre com validação de ganho real.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 12h16M4 18h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 16v4M16 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Separação automática",
    description:
      "Casos problemáticos são identificados e separados para revisão humana com total transparência.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Portfólio organizado",
    description:
      "Apoie a organização do acervo clínico com classificação automática e artefatos padronizados.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Menos esforço manual",
    description:
      "Reduza a carga operacional da equipe, liberando tempo para o que realmente importa: o atendimento.",
  },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="section-padding bg-surface-cream/20">
      <div className="container-narrow">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brand">
            Benefícios
          </p>
          <h2 className="heading-section mb-5">
            Valor real para a sua clínica
          </h2>
          <p className="body-large">
            O retorno mais importante não é uma máscara binária — é tempo
            recuperado, padronização e confiança no fluxo clínico.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <div key={i} className="card-soft group">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light/40 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                {b.icon}
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {b.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground-muted">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
