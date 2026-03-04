"use client";

import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   IndustrialButton — Industrial Clean v2.0
   
   Sharp corners, no shimmer. Two modes:
   - default (on light bg): solid black / ghost black border
   - onDark (on dark bg): solid white / ghost white border
   ═══════════════════════════════════════════════════════════════════ */

interface IndustrialButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  onDark?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

export function IndustrialButton({
  children,
  variant = "primary",
  onDark = false,
  href,
  onClick,
  className = "",
  type = "button",
}: IndustrialButtonProps) {
  const baseClasses = `
    inline-flex items-center gap-2
    px-7 py-3.5
    text-sm font-medium tracking-wide
    transition-all duration-300
    group cursor-pointer
    whitespace-nowrap
  `;

  const variantClasses = {
    primary: onDark
      ? "bg-white text-ink-black hover:bg-titanium-white"
      : "bg-ink-black text-white hover:bg-forged-slate",
    ghost: onDark
      ? "bg-transparent text-white border-[1.5px] border-white/80 hover:bg-white/10"
      : "bg-transparent text-ink-black border-[1.5px] border-ink-black hover:bg-ink-black/5",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  if (href) {
    const isExternal = href.startsWith("http");
    const isAnchor = href.startsWith("#");

    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }

    if (isAnchor) {
      return (
        <a
          href={href}
          onClick={(e) => {
            e.preventDefault();
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            onClick?.();
          }}
          className={classes}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
