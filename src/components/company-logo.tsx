import Image from "next/image";
import type { CSSProperties } from "react";
import { getCompanyLogoMetrics } from "@/lib/company-logo-metrics";

type LogoSize = "mosaic" | "card" | "compact";

type CompanyLogoProps = {
  name: string;
  src?: string;
  label?: string;
  size?: LogoSize;
  decorative?: boolean;
};

/** Size the visible artwork, including its transparent source margins. */
function LogoArtwork({ src, mark = false }: { src: string; mark?: boolean }) {
  const metric = getCompanyLogoMetrics(src);
  const aspect = metric?.inkAspect ?? 2.05;
  const boost = metric?.opticalBoost ?? 1;
  const height = Math.min(30, Math.sqrt(2600 / aspect)) * boost;
  const width = mark ? Math.min(24, 26 * aspect) : Math.min(132, height * aspect);
  const style = {
    "--logo-optical-width": `${width}px`,
    "--logo-compact-width": `${Math.min(46, 24 * aspect)}px`,
    aspectRatio: aspect,
  } as CSSProperties;

  // The official white-on-black icon provides a clean luminance mask. The
  // older Datoric wordmark file contains a baked checkerboard, not alpha.
  if (metric?.name === "Datoric") {
    return <span className="company-logo-artwork company-logo-datoric" style={{ ...style, aspectRatio: 1 }} />;
  }

  const crop = metric?.crop ?? { left: 0, top: 0, width: 1, height: 1 };
  return (
    <span className={`company-logo-artwork${mark ? " company-logo-artwork--mark" : ""}`} style={style}>
      <Image
        src={src}
        alt=""
        width={Math.ceil(metric?.intrinsicWidth ?? 1024)}
        height={Math.ceil(metric?.intrinsicHeight ?? 499)}
        quality={90}
        sizes={`${Math.ceil((mark ? 40 : 192) / crop.width)}px`}
        unoptimized={src.split(/[?#]/, 1)[0].endsWith(".svg")}
        className={`company-logo-image${metric?.bakedBackground ? "" : " company-logo-image--transparent"}`}
        style={{
          width: `${100 / crop.width}%`,
          height: `${100 / crop.height}%`,
          left: `${-100 * crop.left / crop.width}%`,
          top: `${-100 * crop.top / crop.height}%`,
        }}
      />
    </span>
  );
}

/** One optical scale for portfolio grids, cards, and compact search rows. */
export function CompanyLogo({ name, src, label, size = "mosaic", decorative = false }: CompanyLogoProps) {
  const metric = src ? getCompanyLogoMetrics(src) : undefined;
  const showLabel = Boolean(label && (metric?.kind === "icon" || !metric) && size !== "compact");

  return (
    <span
      className={`company-logo company-logo--${size}${showLabel ? " company-logo--lockup" : ""}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      data-logo-name={name}
      data-logo-kind={metric?.kind ?? "wordmark"}
    >
      {src ? (
        showLabel ? (
          <>
            <span className="company-logo-mark"><LogoArtwork src={src} mark /></span>
            <span className="company-logo-label">{label}</span>
          </>
        ) : <LogoArtwork src={src} />
      ) : <span className="company-logo-label">{name}</span>}
    </span>
  );
}
