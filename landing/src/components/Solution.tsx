const steps = [
  {
    number: "01",
    title: "Análise automática",
    description:
      "O sistema avalia métricas de qualidade — iluminação, contraste, distribuição tonal e nitidez — sem intervenção manual.",
    color: "bg-brand-light/50",
  },
  {
    number: "02",
    title: "Correção inteligente",
    description:
      "Imagens recuperáveis recebem equalização adaptativa CLAHE no canal de luminância, com validação de ganho real.",
    color: "bg-surface-cream/60",
  },
  {
    number: "03",
    title: "Decisão automática",
    description:
      "O motor classifica cada imagem entre 5 categorias — sem necessidade de revisão prévia ou ajuste manual por foto.",
    color: "bg-surface-warm/40",
  },
];

export default function Solution() {
  return (
    <section id="solucao" className="section-padding bg-white">
      <div className="container-narrow">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Text */}
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brand">
              A solução
            </p>
            <h2 className="heading-section mb-6">
              Triagem automatizada com inteligência visual
            </h2>
            <p className="body-large mb-10">
              O EstetiScan AI analisa cada imagem, corrige quando possível e
              separa automaticamente os casos complexos para revisão humana.
              Tudo sem configuração manual.
            </p>

            <div className="space-y-6">
              {steps.map((s) => (
                <div key={s.number} className="flex items-start gap-5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${s.color}`}
                  >
                    <span className="text-sm font-semibold text-brand">
                      {s.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-foreground">
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground-muted">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual block */}
          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-brand-light/30 via-surface-cream/30 to-surface-warm/20 p-8 md:p-12">
              {/* Classification cards */}
              <div className="space-y-3">
                {[
                  { label: "Ideal", color: "bg-emerald-400/20 text-emerald-700", icon: "✓" },
                  { label: "Adequada", color: "bg-blue-400/20 text-blue-700", icon: "✓" },
                  { label: "Corrigida automaticamente", color: "bg-amber-400/20 text-amber-700", icon: "↻" },
                  { label: "Ajuste sem ganho relevante", color: "bg-orange-400/20 text-orange-700", icon: "—" },
                  { label: "Requer revisão humana", color: "bg-rose-400/20 text-rose-700", icon: "⚑" },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center gap-4 rounded-2xl bg-white/70 px-5 py-3.5 backdrop-blur-sm"
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-semibold ${c.color}`}
                    >
                      {c.icon}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-brand-light/50 bg-white/60 px-5 py-3 text-center backdrop-blur-sm">
                <p className="text-xs font-medium text-foreground-muted">
                  Classificação 100% automática · sem ajuste por imagem
                </p>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 rounded-full bg-brand-light/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
