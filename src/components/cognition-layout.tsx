import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";
import { cn } from "@/lib/utils";

export function BrandDot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      className={cn("cog-brand-dot", className)}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="64" cy="64" r="64" fill="var(--cog-accent)" />
    </svg>
  );
}

// The wordmark uses the serif logo voice, paired with the brand dot.
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("cog-wordmark", className)}>
      <span className="cog-wordmark-text">All Together</span>
      <BrandDot className="cog-wordmark-mark" />
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
}: {
  label?: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  wide?: boolean;
}) {
  return (
    <section className={cn("cog-section", wide && "cog-section--wide", className)}>
      <div className={cn("cog-section-body", bodyClassName)}>
        {label && <p className="cog-kicker">{label}</p>}
        {title && <h1 className="cog-title">{title}</h1>}
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
      <ArrowUpRight className="size-4" />
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
