"use client";

import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CheckCircle2,
  CloudCog,
  Code2,
  Gauge,
  Layers3,
  MonitorSmartphone,
  Palette,
  Search,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { getAllServices } from "../api/servicesAPI";
import PageBanner from "@/components/PageBanner";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/components/premiumMotion";

const fallbackServices = [
  {
    title: "Software Development",
    slug: "software-development",
    short_description: "Custom platforms, dashboards, portals, and business systems built for dependable operations.",
  },
  {
    title: "Mobile App Development",
    slug: "mobile-app-development",
    short_description: "Polished mobile experiences for customers, field teams, bookings, commerce, and internal workflows.",
  },
  {
    title: "Web Design and Development",
    slug: "web-development",
    short_description: "Fast websites and web apps with clean UX, strong content structure, and conversion-ready flows.",
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    short_description: "Campaigns, content, analytics, and growth systems that help qualified customers find you.",
  },
  {
    title: "SEO Optimization",
    slug: "seo-optimization",
    short_description: "Technical and content SEO foundations that improve visibility, speed, structure, and discoverability.",
  },
  {
    title: "IT Consultation",
    slug: "it-consultation",
    short_description: "Architecture, process, automation, and technology guidance before expensive decisions are made.",
  },
];

const serviceIconPool = [
  Code2,
  Smartphone,
  MonitorSmartphone,
  CloudCog,
  Search,
  Palette,
  Bot,
  ShieldCheck,
  Gauge,
  Layers3,
];

const deliverySteps = [
  ["Discover", "Clarify users, goals, constraints, systems, and the fastest route to useful value."],
  ["Prototype", "Shape flows, interface direction, technical approach, and delivery milestones before heavy build."],
  ["Build", "Ship in clean cycles with reviews, integrations, testing, and release readiness baked in."],
  ["Improve", "Measure, optimize, harden, and extend the product after launch."],
];

const outcomes = [
  "Clear scope and delivery roadmap",
  "Secure, maintainable implementation",
  "Launch support and iteration plan",
];

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.services)) return payload.services;
  return [];
};

const stripHtml = (value = "") =>
  String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const summarize = (service) =>
  stripHtml(service.short_description || service.description) ||
  "Premium digital service designed around practical outcomes, clean execution, and long-term maintainability.";

export default function ServicePage() {
  const [services, setServices] = useState(fallbackServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        const list = toArray(data);
        setServices(list.length ? list : fallbackServices);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const featuredServices = useMemo(
    () => (services.length ? services : fallbackServices),
    [services]
  );

  const pageTitle = "Services | Index IT Hub";
  const pageDescription =
    "Explore Index IT Hub services: software development, mobile apps, digital marketing, IT consultation, SEO optimization, and more tailored for your business growth.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="IT services, software development, mobile apps, digital marketing, SEO, IT consultation, Index IT Hub"
        />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indexithub.com/service" />
        <meta property="og:image" content="/indexithub-logo.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>

      <main className="bg-white text-slate-950 dark:bg-[#0d1a2b] dark:text-white">
        <PageBanner
          eyebrow="Strategy, design, engineering, and scale"
          title="Our Services"
          description="Explore focused digital services for software products, websites, mobile experiences, automation, growth, and long-term support."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
          actionHref="#service-cards"
          actionLabel="View Services"
        />

        <section id="service-cards" className="scroll-mt-28 px-6 pb-16 pt-8 sm:px-10 sm:pb-20 sm:pt-10 lg:px-16 lg:pb-24 lg:pt-12">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-12"
            >
              <div>
                <motion.p variants={fadeUp} className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                  Service portfolio
                </motion.p>
                <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-white sm:text-5xl">
                  Practical digital capabilities, packaged for momentum.
                </motion.h2>
              </div>
              <motion.p variants={fadeUp} className="text-lg leading-8 text-slate-600 dark:text-slate-300">
                Every engagement is shaped around the same promise: clear thinking, clean delivery, and software your team can keep improving after launch.
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              animate="show"
              className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {featuredServices.map((service, index) => {
                const Icon = serviceIconPool[index % serviceIconPool.length];
                const href = service.slug ? `/service/${service.slug}` : "/service";

                return (
                  <motion.div
                    key={service._id || service.slug || service.title || `service-${index}`}
                    variants={scaleIn}
                    whileHover={{ y: -6 }}
                  >
                    <Link
                      href={href}
                      className="group flex min-h-[280px] flex-col rounded-lg border border-slate-200 bg-white p-7 shadow-sm transition hover:border-brand-light hover:shadow-xl hover:shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:hover:shadow-none"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#78a6f2]/10 text-brand-light">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500 dark:border-white/10 dark:text-slate-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="mt-9 text-2xl font-bold text-[#1E3A8A] dark:text-white">
                        {service.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {summarize(service)}
                      </p>

                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-light">
                        Explore service
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {loading && (
              <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                Loading the latest service list...
              </p>
            )}
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-16 dark:bg-[#0b1624] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
            >
              <motion.p variants={fadeUp} className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                How we work
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-white sm:text-5xl">
                Senior delivery rhythm without the ceremony overload.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                We keep the process clear enough for stakeholders and detailed enough for engineering. The result is less ambiguity, fewer surprises, and faster decisions.
              </motion.p>

              <motion.div variants={stagger(0.08)} className="mt-9 space-y-4">
                {outcomes.map((item) => (
                  <motion.div key={item} variants={fadeUp} className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="h-5 w-5 text-brand-light" />
                    {item}
                  </motion.div>
                ))}
              </motion.div>
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
                  className="rounded-lg border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/[0.04]"
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
        </section>

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto grid max-w-7xl gap-9 rounded-lg bg-[linear-gradient(135deg,#0b1526_0%,#13294b_48%,#2f6faa_100%)] p-8 text-white shadow-2xl shadow-slate-300/60 dark:shadow-none sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:p-12"
          >
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200">
                <BadgeCheck className="h-4 w-4 text-brand-light" />
                Built for launch and long-term ownership
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Have a service need that does not fit neatly into a box?
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
                Bring the messy version. We will help define the scope, technical path, and first valuable release.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-light px-6 text-sm font-bold text-slate-50 transition hover:bg-[#4F96EE]"
            >
              Start a Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </section>
      </main>
    </>
  );
}
