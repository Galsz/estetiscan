"""Script de teste rápido do pipeline EstetiScan AI."""
from motor.facade import processar_lote, gerar_relatorio
from collections import Counter

resultados = processar_lote("data/original")

c = Counter(r["status_cliente"] for r in resultados)
print("=== RESUMO ===")
for k, v in sorted(c.items()):
    print(f"  {k}: {v}")
print(f"  TOTAL: {len(resultados)}")
print()

for r in resultados:
    nome = r["arquivo"][:45]
    status = r["status_cliente"]
    sep = r.get("separabilidade_otsu")
    sep_s = f"{sep:.2f}" if sep is not None else "N/A"
    eq = r.get("needs_equalization")
    print(f"{nome:45s} -> {status:30s} sep={sep_s}  eq={eq}")

print()
csv_path = gerar_relatorio(resultados)
print(f"Relatorio salvo em: {csv_path}")
