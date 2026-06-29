"use client";

import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Code2,
  Globe2,
  Handshake,
  Layers3,
  Megaphone,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  Zap,
} from "lucide-react";
import { getAbout } from "@/pages/api/aboutAPI";
import MissionVisionSection from "@/components/MissionVissionSection";
import { getAllUsers, getPublicTeam } from "@/pages/api/userApi";
import TeamMembersSection from "@/components/TeamMembersSection";

const FALLBACK_TEAM_IMAGE = "/team-placeholder.png";
const BRAND_LOGO = "/image.png";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -28 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: "easeOut" },
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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const stagger = (delay = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});

const DEFAULT_ABOUT_COPY = [
  "<strong>Index IT Hub</strong> is a group of passionate technologists dedicated to crafting innovative solutions that drive business growth. We may be new, but our drive, skills, and commitment are anything but.",
  "We specialize in software development, web and mobile application development, graphic design, digital marketing, IT consulting, and search engine optimization.",
  "With a strong commitment to technical excellence and client success, we deliver customized solutions that foster growth, efficiency, and long-term sustainability.",
  "At <strong>Index IT Hub</strong>, we are more than just a service provider. We are a trusted partner in technology and innovation, empowering organizations to navigate the complexities of the digital landscape.",
];

const WHY_US = [
  {
    icon: Target,
    title: "Client-First Mindset",
    desc: "Every decision is shaped around what helps your business move forward, not what is easiest for us.",
  },
  {
    icon: Zap,
    title: "Fast and Agile Delivery",
    desc: "We move quickly, keep the process visible, and protect quality across every delivery stage.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Process",
    desc: "Clear scope, honest updates, and practical guidance keep your project predictable from day one.",
  },
  {
    icon: Handshake,
    title: "Long-Term Partnership",
    desc: "We build with the future in mind, then stay close as your product, traffic, and operations grow.",
  },
];

const CAPABILITIES = [
  { icon: Code2, label: "Software Development" },
  { icon: Layers3, label: "Web and Mobile Apps" },
  { icon: Palette, label: "UI/UX and Graphics" },
  { icon: Search, label: "SEO Strategy" },
  { icon: Megaphone, label: "Digital Marketing" },
  { icon: Globe2, label: "IT Consulting" },
];

function splitCopy(text) {
  return (text || "")
    .split(/\r?\n|\r|\n/)
    .map((para) => para.trim())
    .filter(Boolean);
}

function getInitials(member) {
  if (member?.initials) return member.initials;
  const name = member?.name || "";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return initials || "IT";
}

function IconLink({ href, label, children }) {
  if (!href) return null;
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#1E3A8A] shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-white dark:bg-gray-950/90 dark:text-gray-100 dark:ring-white/10"
    >
      {children}
    </a>
  );
}

function IconFacebook() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22 12a10 10 0 1 0-11.56 9.87v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.79-3.89 1.1 0 2.25.2 2.25.2v2.46h-1.27c-1.25 0-1.64.77-1.64 1.56V12h2.8l-.45 2.88h-2.35v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 23.5h4V7.98h-4V23.5ZM8 7.98h3.84v2.12h.06c.54-1.02 1.86-2.1 3.84-2.1 4.1 0 4.86 2.7 4.86 6.2v9.3h-4v-8.26c0-1.97-.04-4.5-2.74-4.5-2.75 0-3.17 2.14-3.17 4.36v8.4H8V7.98Z" />
    </svg>
  );
}

function IconTwitter() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2.25h3.37l-7.36 8.41L23.5 21.75h-6.73l-5.27-6.9-6.03 6.9H2.1l7.87-9.0L.5 2.25h6.9l4.76 6.23 5.74-6.23Zm-1.18 17.5h1.87L6.38 4.16H4.38l13.34 15.59Z" />
    </svg>
  );
}

function IconWebsite() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm7.93 9h-3.05a15.7 15.7 0 0 0-1.2-5.02A8.03 8.03 0 0 1 19.93 11ZM12 4c.9 0 2.34 1.78 3.05 7H8.95C9.66 5.78 11.1 4 12 4ZM4.07 13h3.05c.18 1.8.63 3.52 1.2 5.02A8.03 8.03 0 0 1 4.07 13Zm3.05-2H4.07a8.03 8.03 0 0 1 4.25-5.02A15.7 15.7 0 0 0 7.12 11Zm1.83 2h6.1c-.7 5.22-2.15 7-3.05 7s-2.35-1.78-3.05-7Zm7.93 0h3.05a8.03 8.03 0 0 1-4.25 5.02c.57-1.5 1.02-3.22 1.2-5.02Z" />
    </svg>
  );
}

function SectionHeading({ eyebrow, title, children, align = "center" }) {
  const isCentered = align === "center";
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={
        isCentered ? "mx-auto mb-12 max-w-3xl text-center" : "mb-10 max-w-3xl"
      }
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-[#78a6f2]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-extrabold leading-tight text-[#1E3A8A] dark:text-white md:text-5xl">
        {title}
      </h2>
      {children && (
        <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
          {children}
        </p>
      )}
    </motion.div>
  );
}

function OrgChart() {
  const leadership = {
    title: "Managing Director / Founder",
    sub: "Strategy / Partnerships / Governance",
  };

  const management = [
    {
      title: "Technical Lead",
      sub: "Architecture / Code Quality / DevOps",
    },
    {
      title: "Operations / PM",
      sub: "Delivery / Timelines / Client Communication",
    },
  ];

  const delivery = [
    { title: "Frontend Developer", sub: "Next.js / React / UI" },
    { title: "Backend Developer", sub: "Node / APIs / Database" },
    { title: "UI UX Designer", sub: "UI/UX / Graphics" },
    { title: "QA and Support", sub: "Maintenance / Security" },
  ];

  const chartCard =
    "rounded-lg border border-slate-200 bg-white px-6 py-4 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]";

  return (
    <section className="bg-white py-20 dark:bg-[#0d1a2b] lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="How We Work"
          title="A Lean Structure Built for Delivery"
        >
          Clear ownership helps every project move from strategy to design,
          engineering, launch, and support without losing momentum.
        </SectionHeading>

        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="relative mx-auto max-w-6xl"
        >
          <motion.div variants={scaleIn} className="flex justify-center">
            <div className={`${chartCard} min-w-[260px]`}>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                {leadership.title}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {leadership.sub}
              </p>
            </div>
          </motion.div>

          <div className="mx-auto my-4 h-10 w-px bg-slate-300 dark:bg-white/20" />

          <div className="grid gap-4 md:grid-cols-2">
            {management.map((n) => (
              <motion.div
                key={n.title}
                variants={scaleIn}
                className={chartCard}
              >
                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                  {n.title}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {n.sub}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mx-auto my-6 h-10 w-px bg-slate-300 dark:bg-white/20" />

          <div className="grid gap-4 md:grid-cols-4">
            {delivery.map((n) => (
              <motion.div
                key={n.title}
                variants={scaleIn}
                className={chartCard}
              >
                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                  {n.title}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {n.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const [about, setAbout] = useState({ description: "", image: "" });
  const [team, setTeam] = useState([]);
  const [teamError, setTeamError] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await getAbout();
        if (data && !data.error) {
          setAbout({
            description: data.description || "",
            image: data.image || "",
          });
        }
      } catch (error) {
        console.error("Error fetching About:", error);
      }
    };

    const fetchTeam = async () => {
      setTeamError("");
      try {
        const data = await getPublicTeam();
        const list = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        setTeam(list);
      } catch (e) {
        setTeam([]);
        setTeamError(e?.message || "Failed to load team.");
      }
    };

    fetchAbout();
    fetchTeam();
  }, []);

  const safeTeam = useMemo(() => (Array.isArray(team) ? team : []), [team]);
  const aboutCopy = useMemo(() => {
    const apiCopy = splitCopy(about.description);
    return apiCopy.length > 0 ? apiCopy : DEFAULT_ABOUT_COPY;
  }, [about.description]);
  const storyImage = about.image || BRAND_LOGO;

  return (
    <>
      <Head>
        <title>About Us | Index IT Hub</title>
        <meta
          name="description"
          content="Learn about Index IT Hub, our mission, vision, delivery culture, team, and organizational structure."
        />
      </Head>

      <style jsx global>{`
        .about-grid {
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.08) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
        }

        .about-shimmer {
          background: linear-gradient(
            90deg,
            #1e3a8a 0%,
            #78a6f2 42%,
            #1e3a8a 64%,
            #78a6f2 100%
          );
          background-size: 220% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: about-shimmer 3.5s linear infinite;
        }

        .dark .about-shimmer,
        .about-shimmer-on-dark {
          background: linear-gradient(
            90deg,
            #fefefe 0%,
            #7ddfff 42%,
            #fefefe 64%,
            #7ddfff 100%
          );
          background-size: 220% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .about-copy strong {
          color: #1e3a8a;
          font-weight: 800;
        }

        .dark .about-copy strong {
          color: #fefefe;
        }

        @keyframes about-shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>

      <main className="bg-white text-slate-900 transition-colors duration-300 dark:bg-[#0d1a2b] dark:text-white">
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#eef6ff_48%,#dbeafe_100%)] text-slate-950 dark:bg-[linear-gradient(135deg,#0b1526_0%,#13294b_46%,#2f6faa_100%)] dark:text-white">
          <div
            className="absolute inset-0 about-grid opacity-60"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent dark:from-[#0d1a2b]" />

          <div className="relative z-10 mx-auto grid min-h-[88vh] w-full max-w-7xl items-center gap-14 px-6 pb-20 pt-32 lg:grid-cols-[1.08fr_0.92fr] lg:pb-24 lg:pt-36">
            <motion.div
              variants={stagger(0.12)}
              initial="hidden"
              animate="show"
            >
              <motion.div
                variants={fadeUp}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#13294b]/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#1E3A8A] shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/10 dark:text-blue-100"
              >
                <Sparkles className="h-4 w-4 text-[#7ddfff]" />
                About Index IT Hub
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-normal md:text-6xl lg:text-7xl"
              >
                Fresh Vision.
                <br />
                <span className="about-shimmer">Real Passion.</span>
                <br />
                Built to Last.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-7 max-w-2xl text-base leading-8 text-slate-700 dark:text-blue-50/90 md:text-lg"
              >
                Index IT Hub is a passionate technology team helping businesses
                launch smarter websites, scalable software, useful digital
                experiences, and growth-focused campaigns.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-wrap gap-3"
              >
                <Link
                  href="#who-we-are"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-slate-50 shadow-xl shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-blue-500 dark:bg-white dark:text-[#1E3A8A] dark:hover:bg-blue-50"
                >
                  Our Story
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#mission"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#13294b]/20 bg-white/50 px-6 py-3 text-sm font-semibold text-[#1E3A8A] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  Mission and Vision
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.25, ease: "easeOut" }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[420px]">
                <div className="rounded-lg border border-white/80 bg-white/80 p-5 shadow-2xl shadow-slate-950/15 backdrop-blur-md dark:border-white/15 dark:bg-white/[0.08] dark:shadow-blue-950/30">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative mx-auto aspect-square w-full max-w-[330px]"
                  >
                    <Image
                      src={BRAND_LOGO}
                      alt="Index IT Hub logo"
                      fill
                      priority
                      sizes="(max-width: 1024px) 280px, 330px"
                      className=" object-cover shadow-2xl"
                    />
                  </motion.div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-[#13294b]/10 bg-white/70 px-4 py-3 backdrop-blur dark:border-white/15 dark:bg-white/10">
                    <p className="font-bold text-[#1E3A8A] dark:text-white">
                      Design
                    </p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-blue-100">
                      Useful, clear, premium
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#13294b]/10 bg-white/70 px-4 py-3 backdrop-blur dark:border-white/15 dark:bg-white/10">
                    <p className="font-bold text-[#1E3A8A] dark:text-white">
                      Delivery
                    </p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-blue-100">
                      Fast, scalable, steady
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          id="who-we-are"
          className="bg-white py-20 dark:bg-[#0d1a2b] lg:py-24"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.94fr_1.06fr]">
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="order-2 lg:order-1"
            >
              <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-2xl shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/30">
                <div className="aspect-[4/3] relative w-full h-full min-h-[300px]">
                  <Image
                    src={storyImage}
                    alt="Index IT Hub team and brand"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1E3A8A]/95 to-transparent px-6 pb-6 pt-16">
                  <p className="text-sm font-semibold text-white">
                    More than a service provider, a trusted technology partner.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="order-1 lg:order-2"
            >
              <motion.p
                variants={fadeUp}
                className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-[#78a6f2]"
              >
                Who We Are
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl font-extrabold leading-tight text-[#1E3A8A] dark:text-white md:text-5xl"
              >
                Building the Digital Future, Together
              </motion.h2>

              <motion.div
                variants={fadeUp}
                className="about-copy mt-7 space-y-5 text-base leading-8 text-slate-600 dark:text-slate-300"
              >
                {aboutCopy.map((para, index) => (
                  <div key={index} dangerouslySetInnerHTML={{ __html: para }} />
                ))}
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-8 grid gap-3 sm:grid-cols-2"
              >
                {CAPABILITIES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-[#1E3A8A] dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#78a6f2]/15 text-[#78a6f2] dark:bg-[#78a6f2]/20 dark:text-[#7ddfff]">
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.label}
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div id="mission">
          <MissionVisionSection />
        </div>

        <section className="bg-white py-20 dark:bg-[#0d1a2b] lg:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="Why Work With Us"
              title="What Makes Us Different"
            >
              We blend the energy of a new team with disciplined delivery,
              direct communication, and practical technical choices.
            </SectionHeading>

            <motion.div
              variants={stagger(0.12)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {WHY_US.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    variants={scaleIn}
                    whileHover={{ y: -6 }}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm transition dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#78a6f2]/15 text-[#78a6f2] dark:bg-[#78a6f2]/20 dark:text-[#7ddfff]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1E3A8A] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

       

        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0b1526_0%,#13294b_45%,#2f6faa_100%)] px-6 py-20 text-center text-white lg:py-24">
          <div
            className="absolute inset-0 about-grid opacity-50"
            aria-hidden="true"
          />
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="relative z-10 mx-auto max-w-3xl"
          >
            <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-[#7ddfff] backdrop-blur">
              <BadgeCheck className="h-6 w-6" />
            </div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-blue-100">
              Work With Us
            </p>
            <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
              Let&apos;s Build Something
              <br />
              <span className="about-shimmer about-shimmer-on-dark">
                Extraordinary
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-blue-50/90 md:text-lg">
              Whether you are a startup with a vision or an enterprise seeking
              transformation, Index IT Hub is ready to help shape the next move.
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-4 text-sm font-bold text-[#1E3A8A] shadow-xl shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </section>

        <TeamMembersSection />

        {/* OrgChart if uncommented */}
        {/* <OrgChart /> */}
      </main>
    </>
  );
}
