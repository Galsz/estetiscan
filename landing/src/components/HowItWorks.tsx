const flow = [
  {
    step: 1,
    title: "Upload da imagem ou lote",
    description: "Envie uma imagem individual ou um lote completo. O sistema aceita JPG, PNG e outros formatos comuns.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    step: 2,
    title: "Análise automática de qualidade",
    description: "Métricas como média de intensidade, desvio padrão, percentis e variância do Laplaciano são avaliadas automaticamente.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M21 21H4.6a.6.6 0 01-.6-.6V3M7 14l4-4 4 4 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    step: 3,
    title: "Correção quando possível",
    description: "Imagens recuperáveis recebem equalização CLAHE no canal de luminância. O ganho é validado antes de aceitar a correção.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    step: 4,
    title: "Segmentação quando viável",
    description: "O sistema verifica a separabilidade pelo método de Otsu. Se houver confiança, gera máscara binária e recorte.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    step: 5,
    title: "Revisão humana quando necessário",
    description: "Imagens complexas são sinalizadas e separadas em pasta dedicada, com relatório detalhado para a equipe.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M19 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section-padding bg-white">
      <div className="container-narrow">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brand">
            Como funciona
          </p>
          <h2 className="heading-section mb-5">
            Do upload ao relatório em segundos
          </h2>
          <p className="body-large">
            Um fluxo automatizado em cinco etapas — sem configuração,
            sem ajuste manual.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-brand-light via-brand/20 to-brand-light md:block" />

          <div className="space-y-10">
            {flow.map((f, i) => (
              <div key={f.step} className="flex gap-6 md:gap-8">
                {/* Circle */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-brand-light bg-white text-brand">
                  {f.icon}
                </div>

                {/* Content */}
                <div className={`rounded-3xl p-6 md:p-8 flex-1 ${
                  i % 2 === 0 ? "bg-surface-mist/30" : "bg-surface-cream/30"
                }`}>
                  <div className="mb-1 flex items-center gap-3">
                    <span className="text-xs font-semibold text-brand">
                      Etapa {f.step}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground-muted">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
