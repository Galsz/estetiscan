"use client";

import { useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type DemoStatus = "idle" | "uploading" | "processing" | "done" | "error";

const STATUS_STYLES: Record<string, string> = {
  ideal: "bg-emerald-50 text-emerald-700 border-emerald-200",
  adequada: "bg-blue-50 text-blue-700 border-blue-200",
  corrigida_automaticamente: "bg-amber-50 text-amber-700 border-amber-200",
  ajuste_sem_ganho_relevante: "bg-orange-50 text-orange-700 border-orange-200",
  requer_revisao_humana: "bg-rose-50 text-rose-700 border-rose-200",
};

interface ApiResult {
  filename: string;
  status: string;
  status_label: string;
  message: string;
  needs_correction: boolean;
  correction_applied: boolean;
  requires_human_review: boolean;
  metrics: {
    original: { mean: number; std: number; laplacian_var: number };
    final: { mean: number; std: number; laplacian_var: number };
    separability: number | null;
    otsu_threshold: number | null;
  };
  validation: {
    attempted: boolean;
    accepted: boolean;
    std_gain: number | null;
    mean_shift: number | null;
  };
  artifacts: {
    original: string | null;
    grayscale: string | null;
    corrected: string | null;
    corrected_gray: string | null;
    binary_mask: string | null;
    segmented: string | null;
    cropped: string | null;
  };
}

/* eslint-disable @next/next/no-img-element */

export default function Demo() {
  const [status, setStatus] = useState<DemoStatus>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    setStatus("uploading");
    setResult(null);
    setError("");
    setFileName(file.name);

    // Preview local
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setStatus("processing");

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_URL}/api/process`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data: ApiResult = await res.json();
      setResult(data);
      setStatus("done");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao processar imagem"
      );
      setStatus("error");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const reset = () => {
    setStatus("idle");
    setPreview(null);
    setResult(null);
    setFileName("");
    setError("");
  };

  return (
    <section id="demo" className="section-padding bg-white">
      <div className="container-narrow">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-brand">
            Demonstração
          </p>
          <h2 className="heading-section mb-5">
            Experimente o EstetiScan AI
          </h2>
          <p className="body-large">
            Envie uma imagem e veja como o motor analisa, corrige e classifica
            — processamento real, em tempo real.
          </p>
        </div>

        <div className="mx-auto max-w-5xl rounded-3xl border border-brand-light/50 bg-gradient-to-br from-white via-surface-cream/10 to-brand-light/10 p-6 md:p-10">
          {/* Upload row */}
          {status === "idle" ? (
            <label
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="group mx-auto flex max-w-lg cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-light bg-surface-mist/20 px-8 py-14 transition-all hover:border-brand/40 hover:bg-brand-light/20"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleInput}
                className="hidden"
              />
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="mb-1 text-sm font-medium text-foreground">
                Arraste ou clique para enviar
              </p>
              <p className="text-xs text-foreground-light">
                JPG, PNG — qualquer resolução
              </p>
            </label>
          ) : (
            <>
              {/* Status badge + message */}
              {status === "done" && result && (
                <div className="mb-8">
                  <div
                    className={`rounded-2xl border px-6 py-5 ${
                      STATUS_STYLES[result.status] || "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider opacity-60">
                          Classificação
                        </p>
                        <p className="mt-0.5 text-xl font-semibold">
                          {result.status_label}
                        </p>
                      </div>
                      <p className="max-w-md text-sm leading-relaxed opacity-80">
                        {result.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing spinner */}
              {(status === "uploading" || status === "processing") && (
                <div className="mb-8 flex items-center justify-center rounded-2xl border border-brand-light/30 bg-surface-mist/10 py-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-light border-t-brand" />
                    <p className="text-sm font-medium text-brand">
                      Processando imagem pelo motor...
                    </p>
                  </div>
                </div>
              )}

              {/* Error */}
              {status === "error" && (
                <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5">
                  <p className="text-sm font-medium text-rose-700">
                    Não foi possível processar a imagem.
                  </p>
                  <p className="mt-1 text-xs text-rose-600">{error}</p>
                  <p className="mt-2 text-xs text-rose-500">
                    Verifique se o servidor da API está rodando em{" "}
                    <code className="rounded bg-rose-100 px-1.5 py-0.5">
                      {API_URL}
                    </code>
                  </p>
                </div>
              )}

              {/* Image gallery */}
              {(status === "done" || status === "processing" || status === "error") && (
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Original */}
                  <ImageCard
                    label="Imagem original"
                    src={preview}
                    subtitle={fileName}
                    loading={status === "processing"}
                  />

                  {/* Corrected */}
                  <ImageCard
                    label="Imagem corrigida"
                    src={result?.artifacts.corrected ?? null}
                    subtitle={
                      result
                        ? result.correction_applied
                          ? "CLAHE aplicada com sucesso"
                          : result.needs_correction
                          ? "Correção tentada sem ganho"
                          : "Correção não necessária"
                        : undefined
                    }
                    loading={status === "processing"}
                    empty={
                      result ? !result.correction_applied : false
                    }
                    emptyLabel={
                      result?.needs_correction
                        ? "Sem ganho relevante"
                        : "Não necessária"
                    }
                  />

                  {/* Segmented */}
                  <ImageCard
                    label="Segmentação"
                    src={result?.artifacts.segmented ?? null}
                    subtitle={
                      result?.metrics.separability != null
                        ? `Separabilidade: ${result.metrics.separability.toFixed(3)}`
                        : undefined
                    }
                    loading={status === "processing"}
                    empty={result ? !result.artifacts.segmented : false}
                    emptyLabel="Segmentação inviável"
                  />
                </div>
              )}

              {/* Metrics grid */}
              {status === "done" && result && (
                <div className="mb-8">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                    Métricas do processamento
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                      label="Média (original)"
                      value={result.metrics.original.mean}
                    />
                    <MetricCard
                      label="Desvio padrão"
                      value={result.metrics.original.std}
                    />
                    <MetricCard
                      label="Separabilidade"
                      value={
                        result.metrics.separability != null
                          ? result.metrics.separability.toFixed(3)
                          : "N/A"
                      }
                    />
                    <MetricCard
                      label="Limiar Otsu"
                      value={result.metrics.otsu_threshold ?? "N/A"}
                    />
                    <MetricCard
                      label="Média (final)"
                      value={result.metrics.final.mean}
                    />
                    <MetricCard
                      label="Desvio (final)"
                      value={result.metrics.final.std}
                    />
                    <MetricCard
                      label="Ganho de desvio"
                      value={
                        result.validation.std_gain != null
                          ? `${result.validation.std_gain > 0 ? "+" : ""}${result.validation.std_gain}`
                          : "—"
                      }
                    />
                    <MetricCard
                      label="Laplaciano"
                      value={result.metrics.original.laplacian_var}
                    />
                  </div>
                </div>
              )}

              {/* Reset */}
              <div className="text-center">
                <button onClick={reset} className="btn-secondary text-sm">
                  Testar outra imagem
                </button>
              </div>
            </>
          )}

          <p className="mt-8 text-center text-xs text-foreground-light">
            Processamento real via motor EstetiScan AI ·{" "}
            <code className="rounded bg-surface-mist/40 px-1.5 py-0.5 text-[11px]">
              motor/service.py → api.py
            </code>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ImageCard({
  label,
  src,
  subtitle,
  loading,
  empty,
  emptyLabel,
}: {
  label: string;
  src: string | null;
  subtitle?: string;
  loading?: boolean;
  empty?: boolean;
  emptyLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-light/30 bg-white">
      <div className="relative aspect-[4/3] bg-surface-mist/20">
        {loading && !src && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-light border-t-brand" />
          </div>
        )}
        {src && (
          <img
            src={src}
            alt={label}
            className="h-full w-full object-cover"
          />
        )}
        {!loading && !src && empty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground-light">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              className="mb-2 opacity-40"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-xs">{emptyLabel || "Não disponível"}</p>
          </div>
        )}
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {subtitle && (
          <p className="mt-0.5 text-xs text-foreground-muted">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-surface-mist/30 p-3.5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-foreground-muted">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
