"use client";

import { useState, useEffect } from "react";

import BrandLogo from "@/components/brand/BrandLogo";

const navLinks = [
  { label: "Solução", href: "#solucao" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Demo", href: "#demo" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 shadow-sm shadow-brand-light/20 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container-narrow flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <a href="#" className="flex items-center gap-2.5">
          <BrandLogo />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground-muted transition-colors duration-200 hover:text-brand"
            >
              {link.label}
            </a>
          ))}
          <a href="#demo" className="btn-primary text-sm">
            Solicitar demonstração
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground-muted transition-colors hover:bg-brand-light/40 md:hidden"
          aria-label="Menu"
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-brand-light/40 bg-white/95 px-6 pb-6 pt-4 backdrop-blur-lg md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-medium text-foreground-muted transition-colors hover:text-brand"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#demo"
            onClick={() => setMobileOpen(false)}
            className="btn-primary mt-4 w-full text-center text-sm"
          >
            Solicitar demonstração
          </a>
        </div>
      )}
    </header>
  );
}
