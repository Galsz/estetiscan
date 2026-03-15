export default function CTAFinal() {
  return (
    <section className="section-padding bg-white">
      <div className="container-narrow">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand/90 via-brand to-brand/80 px-8 py-18 text-center md:px-16 md:py-22">
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
          </div>

          <div className="relative z-10">
            <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-4xl lg:text-5xl">
              Pronto para padronizar suas
              <br className="hidden sm:block" /> imagens clínicas?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              Solicite uma demonstração e descubra como o EstetiScan AI pode
              transformar o fluxo de imagens da sua clínica.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-3.5 text-sm font-medium text-brand transition-all duration-300 hover:bg-white/90 hover:shadow-lg"
              >
                Solicitar demonstração
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/10"
              >
                Testar uma imagem
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
