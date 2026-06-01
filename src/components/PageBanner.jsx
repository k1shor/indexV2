"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 28 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const stagger = (delay = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});

export default function PageBanner({
  eyebrow = "Index IT Hub",
  title,
  description,
  breadcrumbs = [],
  actionHref,
  actionLabel,
  compact = false,
}) {
  const trail = breadcrumbs.length
    ? breadcrumbs
    : [{ label: "Home", href: "/" }, { label: title }];

  return (
    <section
      className={`relative overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#eef6ff_48%,#dbeafe_100%)] px-6 text-slate-950 dark:bg-[linear-gradient(135deg,#0b1526_0%,#13294b_46%,#2f6faa_100%)] dark:text-white sm:px-10 lg:px-16 ${
        compact
          ? "pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-32"
          : "pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-45 dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-[#0d1a2b]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-9 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.div
            variants={fadeUp}
            className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[#13294b]/10 bg-white/70 px-4 py-2 text-xs font-medium text-[#1E3A8A] shadow-sm backdrop-blur sm:text-sm dark:border-white/15 dark:bg-white/10 dark:text-white"
          >
            <Sparkles className="h-4 w-4 text-brand-light" />
            <span className="min-w-0 truncate">{eyebrow}</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className={`font-extrabold leading-tight text-[#1E3A8A] dark:text-white ${
              compact ? "text-3xl sm:text-4xl lg:text-5xl" : "text-4xl sm:text-6xl"
            }`}
          >
            {title}
          </motion.h1>

          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-200"
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          variants={fadeRight}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4 sm:flex-row sm:items-center lg:justify-end"
        >
          <nav
            aria-label="Breadcrumb"
            className="inline-flex min-h-12 max-w-full items-center gap-2 rounded-full border border-[#13294b]/10 bg-white/65 px-4 text-sm font-semibold text-[#1E3A8A] shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-gray-100"
          >
            {trail.map((item, index) => (
              <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
                {index > 0 && <span className="text-[#1E3A8A]/35 dark:text-white/35">/</span>}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="whitespace-nowrap transition hover:text-brand-light"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="max-w-[12rem] truncate text-brand-light">{item.label}</span>
                )}
              </span>
            ))}
          </nav>

          {actionHref && actionLabel && (
            <Link
              href={actionHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-light px-5 text-sm font-bold text-slate-50 shadow-lg shadow-blue-950/10 transition hover:bg-[#4F96EE]"
            >
              {actionLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
