import BrandLogo from "@/components/brand/BrandLogo";

const footerLinks = [
  { label: "Solução", href: "#solucao" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Demo", href: "#demo" },
];

export default function Footer() {
  return (
    <footer className="border-t border-brand-light/30 bg-white px-6 py-12 md:px-12 lg:px-20">
      <div className="container-narrow">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2.5">
            <BrandLogo />
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-foreground-muted transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-brand-light/20 pt-8 text-center">
          <p className="text-xs text-foreground-light">
            © {new Date().getFullYear()} EstetiScan AI · Triagem inteligente
            de imagens clínicas
          </p>
        </div>
      </div>
    </footer>
  );
}
