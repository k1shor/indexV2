"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getAllServices } from "../api/servicesAPI";
import PageBanner from "@/components/PageBanner";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/components/premiumMotion";

const deliverySteps = [
  ["Discover", "Goals, users, constraints, current systems, and success metrics."],
  ["Design", "Flows, interface direction, scope, and implementation plan."],
  ["Build", "Clean delivery cycles with reviews, testing, integrations, and release prep."],
  ["Improve", "Optimization, support, measurement, and practical next iterations."],
];

const highlights = [
  "Clear scope and roadmap",
  "Premium user experience",
  "Secure implementation",
  "Launch-ready delivery",
];

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.services)) return payload.services;
  return [];
};

const stripHtml = (value = "") =>
  String(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .trim();

const isImageAsset = (value = "") => {
  const src = String(value).trim();
  if (!src) return false;
  return (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    /\.(png|jpe?g|gif|webp|svg)$/i.test(src)
  );
};

const normalizeImageSrc = (value = "") => {
  const src = String(value).trim();
  if (!isImageAsset(src)) return "";
  if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return `/${src}`;
};

export default function ServiceDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function fetchService() {
      try {
        setLoading(true);
        const data = await getAllServices();
        const found = toArray(data).find((svc) => svc.slug === slug);
        setService(found || null);
        setImageFailed(false);
      } catch (err) {
        console.error("Failed to fetch service:", err);
        setService(null);
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-700 dark:bg-[#0d1a2b] dark:text-slate-300">
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          Loading service...
        </div>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-700 dark:bg-[#0d1a2b] dark:text-slate-300">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <h1 className="text-2xl font-extrabold text-[#1E3A8A] dark:text-white">
            Service not found
          </h1>
          <p className="mt-3 text-sm leading-6">
            The service you are looking for may have moved or is no longer available.
          </p>
          <Link
            href="/service"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-light px-5 text-sm font-bold text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  const Icon = FaIcons[service.image] || Layers3;
  const imageSrc = normalizeImageSrc(service.image);
  const descriptionText =
    stripHtml(service.description || service.short_description) ||
    "A focused digital service shaped around practical outcomes, clean execution, and long-term maintainability.";
  const descriptionBlocks = descriptionText
    .split(/\n{1,}/)
    .map((item) => item.trim())
    .filter(Boolean);
  const summary =
    stripHtml(service.short_description) ||
    `${descriptionText.slice(0, 155)}${descriptionText.length > 155 ? "..." : ""}`;
  const pageUrl = `https://indexithub.com/service/${service.slug}`;

  return (
    <>
      <Head>
        <title>{service.title} | Index IT Hub</title>
        <meta name="description" content={summary} />
        <meta property="og:title" content={`${service.title} | Index IT Hub`} />
        <meta property="og:description" content={summary} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content="/indexithub-logo.svg" />
      </Head>

      <main className="bg-white text-slate-950 dark:bg-[#0d1a2b] dark:text-white">
        <PageBanner
          compact
          eyebrow="Service capability"
          title={service.title}
          description={summary}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/service" },
            { label: service.title },
          ]}
          actionHref="/contact"
          actionLabel="Discuss This"
        />

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-14">
            <motion.article
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-[#1E3A8A] dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
                <Sparkles className="h-4 w-4 text-brand-light" />
                Built for clarity and launch momentum
              </motion.div>

              <motion.h2 variants={fadeUp} className="mt-6 text-3xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-white sm:text-5xl">
                A practical path from idea to dependable digital product.
              </motion.h2>

              <motion.div variants={fadeUp} className="mt-7 space-y-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                {descriptionBlocks.map((block, index) => (
                  <p key={`${block.slice(0, 20)}-${index}`}>{block}</p>
                ))}
              </motion.div>

              <motion.div variants={stagger(0.08)} className="mt-9 grid gap-4 sm:grid-cols-2">
                {highlights.map((item) => (
                  <motion.div
                    key={item}
                    variants={scaleIn}
                    whileHover={{ y: -4 }}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-light" />
                    {item}
                  </motion.div>
                ))}
              </motion.div>
            </motion.article>

            <motion.aside
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none sm:p-6"
            >
              {imageSrc && !imageFailed ? (
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.04]">
                  <img
                    src={imageSrc}
                    alt={service.title}
                    onError={() => setImageFailed(true)}
                    className="h-full min-h-[360px] w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex min-h-[360px] flex-col justify-between rounded-lg bg-[linear-gradient(135deg,#0b1526_0%,#13294b_48%,#2f6faa_100%)] p-7 text-white">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand-light text-slate-950">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                      Index IT Hub
                    </p>
                    <h3 className="mt-3 text-3xl font-extrabold">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-slate-200">
                      Strategy, design, engineering, and support aligned around real business outcomes.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-5 grid gap-3">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
                  <ShieldCheck className="h-5 w-5 text-brand-light" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Secure, maintainable delivery
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
                  <Clock3 className="h-5 w-5 text-brand-light" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Clear milestones and launch support
                  </span>
                </div>
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-16 dark:bg-[#0b1624] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-14">
              <motion.div
                variants={stagger(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
              >
                <motion.p variants={fadeUp} className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                  Delivery flow
                </motion.p>
                <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-white sm:text-5xl">
                  Structured enough to be reliable, flexible enough to move fast.
                </motion.h2>
              </motion.div>

              <motion.div
                variants={stagger(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="grid gap-5 sm:grid-cols-2"
              >
                {deliverySteps.map(([title, copy], index) => (
                  <motion.div
                    key={title}
                    variants={scaleIn}
                    whileHover={{ y: -6 }}
                    className="rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#13294b] text-sm font-bold text-white dark:bg-brand-light dark:text-slate-950">
                      {index + 1}
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-[#1E3A8A] dark:text-white">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {copy}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto grid max-w-7xl gap-8 rounded-lg bg-[linear-gradient(135deg,#0b1526_0%,#13294b_48%,#2f6faa_100%)] p-8 text-white shadow-2xl shadow-slate-300/60 dark:shadow-none sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:p-12"
          >
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200">
                <BadgeCheck className="h-4 w-4 text-brand-light" />
                Ready to shape this into a plan?
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Let&apos;s turn the rough brief into a clear next step.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
                Share what you need, what is blocked, or what you want to improve. We will help define the practical path.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-light px-6 text-sm font-bold text-slate-950 transition hover:bg-[#4F96EE]"
              >
                Start a Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/service"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                All Services
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
}
