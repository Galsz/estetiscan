"""Script de teste rápido do pipeline EstetiScan AI."""
from motor.facade import processar_lote, gerar_relatorio, imprimir_resumo

batch = processar_lote("data/original")
resultados = batch["resultados"]
resumo = batch["resumo"]

# Resumo formatado
imprimir_resumo(resumo)

# Detalhe por imagem
for r in resultados:
    nome = r["arquivo"][:45]
    status = r["status_cliente"]
    sep = r.get("separabilidade_otsu")
    sep_s = f"{sep:.2f}" if sep is not None else "N/A"
    eq = r.get("needs_equalization")
    review = r.get("requires_human_review")
    print(f"{nome:45s} -> {status:30s} sep={sep_s}  eq={eq}  review={review}")

print()
csv_path = gerar_relatorio(resultados)
print(f"Relatorio salvo em: {csv_path}")
