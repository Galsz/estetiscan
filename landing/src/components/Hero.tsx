export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32">
      {/* Background decorative shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand-light/30 blur-3xl" />
        <div className="absolute -left-20 top-1/2 h-[400px] w-[400px] rounded-full bg-surface-cream/60 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-surface-warm/30 blur-3xl" />
      </div>

      <div className="container-narrow relative px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-light bg-brand-light/30 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="text-xs font-medium tracking-wide text-brand">
              Triagem inteligente para clínicas de estética
            </span>
          </div>

          {/* Heading */}
          <h1 className="heading-display mb-6 text-balance">
            Automatize a triagem e o tratamento inicial das{" "}
            <span className="text-brand">fotos clínicas</span> do antes e depois
          </h1>

          {/* Subtitle */}
          <p className="body-large mx-auto mb-10 max-w-2xl text-balance">
            Padronize imagens, reduza o retrabalho da equipe e identifique
            automaticamente os casos que exigem revisão humana.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#demo" className="btn-primary">
              Solicitar demonstração
            </a>
            <a href="#demo" className="btn-secondary">
              Testar uma imagem
            </a>
          </div>
        </div>

        {/* Visual block — editorial cards */}
        <div className="relative mx-auto mt-20 max-w-4xl">
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {/* Card 1: Original */}
            <div className="group relative overflow-hidden rounded-3xl bg-surface-mist/40 p-1">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-brand-light/60 to-surface-cream/40 p-6 flex flex-col justify-end">
                <div className="rounded-xl bg-white/70 backdrop-blur-sm p-3">
                  <div className="h-2 w-12 rounded-full bg-brand/40 mb-2" />
                  <p className="text-xs font-medium text-foreground-muted">
                    Imagem original
                  </p>
                  <p className="text-[11px] text-foreground-light mt-0.5">
                    Análise automática de qualidade
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Corrigida */}
            <div className="group relative overflow-hidden rounded-3xl bg-surface-cream/40 p-1 translate-y-6">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-surface-warm/40 to-brand-light/30 p-6 flex flex-col justify-end">
                <div className="rounded-xl bg-white/70 backdrop-blur-sm p-3">
                  <div className="h-2 w-16 rounded-full bg-brand/60 mb-2" />
                  <p className="text-xs font-medium text-foreground-muted">
                    Correção inteligente
                  </p>
                  <p className="text-[11px] text-foreground-light mt-0.5">
                    CLAHE adaptativa no canal L*
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Segmentada */}
            <div className="group relative overflow-hidden rounded-3xl bg-brand-light/20 p-1">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-brand/10 to-surface-mist/40 p-6 flex flex-col justify-end">
                <div className="rounded-xl bg-white/70 backdrop-blur-sm p-3">
                  <div className="h-2 w-10 rounded-full bg-green-400/50 mb-2" />
                  <p className="text-xs font-medium text-foreground-muted">
                    Segmentação validada
                  </p>
                  <p className="text-[11px] text-foreground-light mt-0.5">
                    Otsu com controle de viabilidade
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-2xl border border-brand-light/60 bg-white px-6 py-3 shadow-lg shadow-brand-light/20">
            <p className="text-center text-sm font-medium text-foreground">
              <span className="text-brand">5 classificações</span> ·{" "}
              processamento 100% automático
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
