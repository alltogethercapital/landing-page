import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";
import { WordmarkLettering } from "@/components/wordmark-lettering";
import { BRAND_SYMBOL } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function BrandDot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      className={cn("cog-brand-dot", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="cog-brand-dot-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--cog-accent)" stopOpacity="1" />
          <stop offset="94%" stopColor="var(--cog-accent)" stopOpacity="1" />
          <stop offset="98%" stopColor="var(--cog-accent)" stopOpacity="0.72" />
          <stop offset="100%" stopColor="var(--cog-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="64" cy="64" r="64" fill="url(#cog-brand-dot-fade)" />
    </svg>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("cog-wordmark", "cog-wordmark--live", className)}>
      <span className="cog-wordmark-symbol" aria-hidden="true">
        <Image
          src={BRAND_SYMBOL.ink}
          alt=""
          width={BRAND_SYMBOL.width}
          height={BRAND_SYMBOL.height}
          unoptimized
          className="cog-wordmark-logo cog-wordmark-logo--light"
        />
        <Image
          src={BRAND_SYMBOL.ivory}
          alt=""
          width={BRAND_SYMBOL.width}
          height={BRAND_SYMBOL.height}
          unoptimized
          className="cog-wordmark-logo cog-wordmark-logo--dark"
        />
      </span>
      <span className="cog-wordmark-name">
        <WordmarkLettering />
      </span>
    </span>
  );
}

export function CognitionPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <main className={cn("cog-page min-h-screen", className)}>{children}</main>;
}

export function CognitionSection({
  label,
  title,
  children,
  className,
  bodyClassName,
  wide = false,
  hideTitle = true,
}: {
  label?: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  wide?: boolean;
  hideTitle?: boolean;
}) {
  return (
    <section
      className={cn("cog-section", wide && "cog-section--wide", hideTitle && "cog-section--untitled", className)}
    >
      <div className={cn("cog-section-body", bodyClassName)}>
        {label && !hideTitle && <p className="cog-kicker">{label}</p>}
        {title && <h1 className={hideTitle ? "sr-only" : "cog-title"}>{title}</h1>}
        {children}
      </div>
    </section>
  );
}

export function CognitionStrip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("cog-strip", className)}>{children}</section>;
}

export function ArrowLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span>{children}</span>
      <ArrowUpRight />
    </>
  );

  const classes = cn("cog-button", className);

  if (href.startsWith("/") && !external) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      className={classes}
    >
      {content}
    </a>
  );
}
