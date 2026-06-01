"use client";

import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { API } from "@/consts";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/components/premiumMotion";

const fallbackReasons = [
  {
    reason:
      "We shape each product around business outcomes first, then choose the technology that makes those outcomes practical and maintainable.",
    reason_image: "/expertise.png",
  },
  {
    reason:
      "Our delivery style is transparent: clear milestones, working demos, measurable progress, and support after launch.",
    reason_image: "/trust.png",
  },
  {
    reason:
      "We build with scale, security, and long-term ownership in mind so your platform can keep improving after the first release.",
    reason_image: "/innovation.jpg",
  },
];

const processSteps = [
  ["Discover", "Map goals, users, systems, constraints, and the fastest path to value."],
  ["Design", "Turn requirements into clear flows, interfaces, architecture, and delivery milestones."],
  ["Build", "Ship in focused cycles with reviews, testing, integrations, and release readiness."],
  ["Grow", "Measure usage, refine performance, add features, and keep the platform healthy."],
];

const metrics = [
  ["10+", "Digital service lines"],
  ["4", "Core delivery squads"],
  ["24/7", "Operational mindset"],
  ["100%", "Owned source code"],
];

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const stripHtml = (value = "") =>
  value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const truncate = (value = "", length = 170) => {
  const clean = stripHtml(value);
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length).trim()}...`;
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const safeFetchJson = async (path, fallback) => {
  if (!API) return fallback;

  try {
    const response = await fetch(`${API}${path}`);
    if (!response.ok) return fallback;
    return await response.json();
  } catch {
    return fallback;
  }
};

export default function Home() {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [formState, setFormState] = useState({
    loading: false,
    message: "",
    error: "",
  });

  useEffect(() => {
    let mounted = true;

    const loadHomeContent = async () => {
      const [aboutResult, reasonsResult, projectsResult] =
        await Promise.all([
          safeFetchJson("/about/get", null),
          safeFetchJson("/reasons", []),
          safeFetchJson("/projects", []),
        ]);

      if (!mounted) return;

      if (aboutResult && !aboutResult.error) {
        setAbout(aboutResult);
      }

      setReasons(toArray(reasonsResult).slice(0, 3));
      setProjects(toArray(projectsResult).slice(0, 3));
    };

    loadHomeContent();

    return () => {
      mounted = false;
    };
  }, []);

  const featuredReasons = reasons.length ? reasons : fallbackReasons;
  const featuredProjects = projects.length ? projects : [];

  const aboutCopy = useMemo(() => {
    const description = truncate(about?.description, 330);
    return (
      description ||
      "Index IT Hub partners with businesses to plan, design, build, and improve digital products that are reliable, clear, and ready for growth."
    );
  }, [about]);

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();

    if (!isValidEmail(email)) {
      setFormState({
        loading: false,
        message: "",
        error: "Enter a valid email address.",
      });
      return;
    }

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESSKEY;
    if (!accessKey) {
      setFormState({
        loading: false,
        message: "",
        error: "Contact form is not configured yet.",
      });
      return;
    }

    formData.append("access_key", accessKey);
    formData.append("subject", "New project inquiry from Index IT Hub homepage");

    setFormState({ loading: true, message: "", error: "" });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Message could not be sent.");
      }

      form.reset();
      setFormState({
        loading: false,
        message: "Thanks. We will contact you shortly.",
        error: "",
      });
    } catch (error) {
      setFormState({
        loading: false,
        message: "",
        error: error.message || "Message could not be sent.",
      });
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Index IT Hub",
    url: "https://indexithub.com",
    logo: "https://indexithub.com/indexithub-logo.svg",
    image: "https://indexithub.com/index.gif",
    description:
      "Index IT Hub provides custom software development, web platforms, mobile apps, cloud automation, and digital growth services.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jyatha",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati Province",
      addressCountry: "NP",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977-9860113289",
      contactType: "sales",
      areaServed: "Global",
      availableLanguage: ["English", "Nepali"],
    },
    sameAs: [
      "https://www.facebook.com/indexithub",
      "https://www.instagram.com/indexithub/",
      "https://www.linkedin.com/company/index-it-hub",
    ],
  };

  return (
    <>
      <Head>
        <title>Index IT Hub | Premium Software Development Company</title>
        <meta
          name="description"
          content="Index IT Hub designs and builds premium software, web platforms, mobile apps, automation systems, and digital products for ambitious businesses."
        />
        <meta
          name="keywords"
          content="Index IT Hub, software development company, web development, mobile apps, cloud automation, Nepal IT company"
        />
        <link rel="canonical" href="https://indexithub.com" />
        <meta property="og:title" content="Index IT Hub | Premium Software Development Company" />
        <meta
          property="og:description"
          content="Build secure, scalable, premium digital products with Index IT Hub."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indexithub.com" />
        <meta property="og:image" content="https://indexithub.com/index.gif" />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="overflow-hidden bg-white text-slate-950 dark:bg-[#0d1a2b] dark:text-white">
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#eef6ff_48%,#dbeafe_100%)] px-6 pb-14 pt-32 text-slate-950 dark:bg-[linear-gradient(135deg,#0b1526_0%,#13294b_46%,#2f6faa_100%)] dark:text-white sm:px-10 sm:pb-16 sm:pt-36 lg:px-16 lg:pb-20 lg:pt-40">
          <div
            className="pointer-events-none absolute inset-0 hidden opacity-45 dark:block"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent dark:from-[#0d1a2b]" />
          <div className="relative z-10 mx-auto grid min-h-[72vh] w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <motion.div
              variants={stagger(0.12)}
              initial="hidden"
              animate="show"
              className="max-w-2xl"
            >
              <motion.div variants={fadeUp} className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[#13294b]/10 bg-white/70 px-4 py-2 text-xs font-medium text-[#1E3A8A] shadow-sm backdrop-blur sm:text-sm dark:border-white/15 dark:bg-white/10 dark:text-white">
                <Sparkles className="h-4 w-4 text-brand-light" />
                <span className="min-w-0 truncate">
                  Premium software delivery from Kathmandu to global teams
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="max-w-4xl text-4xl font-extrabold leading-tight text-[#1E3A8A] dark:text-white sm:text-6xl lg:text-7xl">
                Index IT Hub
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-4 max-w-[21rem] text-lg leading-7 text-slate-700 dark:text-slate-200 sm:max-w-2xl sm:text-2xl sm:leading-8">
                We design, build, and scale polished digital products for teams
                that need reliable software, clear strategy, and launch-ready
                execution.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-light px-6 py-3 font-semibold text-slate-50 shadow-lg shadow-blue-950/20 transition hover:bg-[#4F96EE] sm:w-auto"
                >
                  Start a Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/service"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#13294b]/20 bg-white/50 px-6 py-3 font-semibold text-[#1E3A8A] transition hover:bg-white dark:border-white/35 dark:bg-transparent dark:text-white dark:hover:bg-white/10 sm:w-auto"
                >
                  Explore Services
                </Link>
              </motion.div>

              <motion.div variants={stagger(0.08)} className="mt-8 grid max-w-[21rem] grid-cols-4 gap-3 border-t border-[#13294b]/15 pt-5 sm:max-w-2xl dark:border-white/20">
                {metrics.map(([value, label]) => (
                  <motion.div key={label} variants={fadeUp}>
                    <div className="text-xl font-bold text-[#1E3A8A] dark:text-white sm:text-3xl">{value}</div>
                    <div className="mt-1 text-[10px] leading-4 text-slate-600 dark:text-slate-300 sm:text-sm">
                      {label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.25, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-2xl"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-brand-light/20 blur-2xl dark:bg-brand-light/10" />
              <div className="relative overflow-hidden rounded-lg border border-white/80 bg-white/80 p-3 shadow-2xl shadow-slate-950/15 backdrop-blur dark:border-white/10 dark:bg-white/[0.05]">
                <img
                  src="/index.gif"
                  alt="Index IT Hub digital solutions"
                  className="block h-auto max-h-[520px] w-full rounded-xl bg-slate-950 object-contain"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative z-10 px-6 pb-16 pt-6 sm:px-10 lg:px-16">
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3"
          >
            {[
              [
                ShieldCheck,
                "Secure by default",
                "Auth, data protection, backups, and production discipline built into delivery.",
              ],
              [
                Zap,
                "Fast execution",
                "Lean milestones, early demos, and focused releases that keep momentum visible.",
              ],
              [
                BadgeCheck,
                "Premium ownership",
                "Readable code, clear handoff, and systems your team can keep improving.",
              ],
            ].map(([Icon, title, copy]) => (
              <motion.article
                key={title}
                variants={scaleIn}
                whileHover={{ y: -6 }}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
              >
                <Icon className="h-8 w-8 text-brand-light dark:text-cyan-300" />
                <h2 className="mt-4 text-xl font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {copy}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="bg-slate-50 px-6 py-20 dark:bg-[#0b1624] sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
            >
              <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-[0.18em] text-[#60a5fa]">
                Why Index IT Hub
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                Strategy, engineering, and support in one delivery team.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                {aboutCopy}
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/about"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-light px-6 py-3 font-semibold text-slate-50 shadow-lg shadow-blue-950/20 transition hover:bg-[#4F96EE] sm:w-auto"
                >
                  About Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/project"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#13294b]/20 bg-white/50 px-6 py-3 font-semibold text-[#1E3A8A] transition hover:bg-white dark:border-white/35 dark:bg-transparent dark:text-white dark:hover:bg-white/10 sm:w-auto"
                >
                  See Projects
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid gap-5 sm:grid-cols-2"
            >
              {featuredReasons.map((item, index) => (
                <motion.article
                  key={item._id || index}
                  variants={scaleIn}
                  whileHover={{ y: -6 }}
                  className={`overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04] ${
                    index === 0 ? "sm:row-span-2" : ""
                  }`}
                >
                  <img
                    src={item.reason_image || fallbackReasons[index % fallbackReasons.length].reason_image}
                    alt="Index IT Hub capability"
                    className={`w-full object-cover ${index === 0 ? "h-64 sm:h-80" : "h-44"}`}
                  />
                  <div className="p-5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {item.reason}
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="max-w-2xl"
            >
              <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-[0.18em] text-[#60a5fa]">
                Delivery model
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                A polished path from idea to launch.
              </motion.h2>
            </motion.div>

            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mt-10 grid gap-5 md:grid-cols-4"
            >
              {processSteps.map(([title, copy], index) => (
                <motion.div
                  key={title}
                  variants={scaleIn}
                  whileHover={{ y: -6 }}
                  className="relative rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#60a5fa] font-bold text-white dark:bg-slate-50 dark:text-slate-950">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {copy}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="bg-[linear-gradient(135deg,#0b1526_0%,#13294b_48%,#2f6faa_100%)] px-6 py-20 text-white sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
            >
              <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-[0.18em] text-[#60a5fa]">
                Selected work
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                Platforms built for real users and real operations.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 text-lg leading-8 text-slate-300">
                Explore systems shaped for booking flows, ecommerce, business
                operations, content, customer engagement, and scalable product
                teams.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  href="/project"
                  className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-light px-5 py-3 font-semibold text-slate-50 transition hover:bg-[#4F96EE]"
                >
                  View Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid gap-5 md:grid-cols-3"
            >
              {(featuredProjects.length
                ? featuredProjects
                : [
                    {
                      title: "Business Platforms",
                      category: { title: "Operations" },
                      description:
                        "Custom portals, dashboards, workflows, and reporting tools.",
                    },
                    {
                      title: "Commerce Systems",
                      category: { title: "Growth" },
                      description:
                        "Product catalogs, checkout journeys, admin tools, and integrations.",
                    },
                    {
                      title: "Service Websites",
                      category: { title: "Brand" },
                      description:
                        "High-trust websites with fast content, SEO foundations, and lead capture.",
                    },
                  ]
              ).map((project, index) => (
                <motion.div
                  key={project._id || project.slug || project.title}
                  variants={scaleIn}
                  whileHover={{ y: -6 }}
                >
                  <Link
                    href={project.slug ? `/project/${project.slug}` : "/project"}
                    className="group block h-full rounded-lg border border-white/10 bg-white/[0.06] p-6 transition hover:border-cyan-300/70 hover:bg-white/[0.09]"
                  >
                    <Briefcase className="h-7 w-7 text-slate-50" />
                    <div className="mt-14 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {project.category?.title || ["Operations", "Growth", "Experience"][index % 3]}
                    </div>
                    <h3 className="mt-3 text-xl font-bold">{project.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {truncate(project.description, 130)}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-50">
                      Open case
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
            >
              <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-light dark:text-cyan-300">
                Start smarter
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                Tell us what you want to build.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Share the rough idea, current challenge, or system you want to
                improve. We will help turn it into a practical next step.
              </motion.p>

              <motion.div variants={stagger(0.08)} className="mt-8 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-3">
                  <PhoneCall className="h-5 w-5 text-brand-light dark:text-cyan-300" />
                  +977-9860113289
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-brand-light dark:text-cyan-300" />
                  indexithub@gmail.com
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-brand-light dark:text-cyan-300" />
                  Discovery, design, build, launch, and support
                </div>
              </motion.div>
            </motion.div>

            <motion.form
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              onSubmit={handleContactSubmit}
              className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm font-semibold">
                  <span>Name</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-brand-light dark:border-white/10 dark:bg-[#0b1624]"
                  />
                </label>
                <label className="space-y-1 text-sm font-semibold">
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-brand-light dark:border-white/10 dark:bg-[#0b1624]"
                  />
                </label>
                <label className="space-y-1 text-sm font-semibold sm:col-span-2">
                  <span>Project brief</span>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="What are you planning to build or improve?"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-brand-light dark:border-white/10 dark:bg-[#0b1624]"
                  />
                </label>
              </div>

              {(formState.message || formState.error) && (
                <div
                  className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                    formState.error
                      ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
                  }`}
                >
                  {formState.error || formState.message}
                </div>
              )}

              <button
                type="submit"
                disabled={formState.loading}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-light px-6 py-3 font-semibold text-slate-50 transition hover:bg-[#4F96EE] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {formState.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquare className="h-4 w-4" />
                )}
                {formState.loading ? "Sending" : "Request Consultation"}
              </button>
            </motion.form>
          </div>
        </section>
      </main>
    </>
  );
}
