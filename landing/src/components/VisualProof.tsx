import Image from "next/image";

const examples = [
  {
    label: "Original",
    status: "Imagem real aprovada pelo motor sem necessidade de intervenção.",
    src: "/showcase/original.png",
    badge: null,
  },
  {
    label: "Corrigida",
    status: "Exemplo real com equalização CLAHE validada automaticamente.",
    src: "/showcase/corrected.png",
    badge: { text: "Melhora validada", color: "bg-amber-100 text-amber-700" },
  },
  {
    label: "Segmentada",
    status: "Recorte segmentado gerado após confirmação de separabilidade.",
    src: "/showcase/segmented.png",
    badge: { text: "Segmentação viável", color: "bg-emerald-100 text-emerald-700" },
  },
  {
    label: "Revisão humana",
    status: "Caso complexo reservado para triagem manual quando a confiança visual é limitada.",
    src: "/showcase/review-human.jpg",
    badge: { text: "Avaliação manual", color: "bg-rose-100 text-rose-700" },
  },
];

export default function VisualProof() {
  return (
    <section className="section-padding bg-surface-cream/20">
      <div className="container-narrow">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brand">
            Resultados reais
          </p>
          <h2 className="heading-section mb-5">
            Veja o pipeline em ação
          </h2>
          <p className="body-large">
            Exemplos do processamento automático — da imagem original até a
            classificação final.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {examples.map((ex, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-3xl border border-brand-light/40 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-brand-light/20"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-mist/30">
                <Image
                  src={ex.src}
                  alt={ex.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/18 via-transparent to-transparent" />

                {ex.badge && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <span
                      className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-medium ${ex.badge.color}`}
                    >
                      {ex.badge.text}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="mb-1 text-sm font-semibold text-foreground">
                  {ex.label}
                </h3>
                <p className="text-xs leading-relaxed text-foreground-muted">
                  {ex.status}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-foreground-muted">
            Exemplos reais exportados a partir do motor EstetiScan AI para representar cada etapa visual do fluxo.
          </p>
        </div>
      </div>
    </section>
  );
}
