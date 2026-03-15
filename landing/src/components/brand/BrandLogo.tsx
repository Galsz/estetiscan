import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
};

export default function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <span className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-brand-light/20 ring-1 ring-brand-light/30">
        <Image
          src="/img/EstetiScan_Vector.svg"
          alt="EstetiScan"
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
          priority
        />
      </span>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-[0.02em] text-foreground">
          EstetiScan<span className="text-brand"> AI</span>
        </span>
      )}
    </span>
  );
}