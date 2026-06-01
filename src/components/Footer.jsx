"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
} from "react-icons/io";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/components/premiumMotion";

const companyLinks = [
  ["/about", "About"],
  ["/project", "Projects"],
  ["/blog", "Blogs"],
  ["/career", "Career"],
];

const serviceLinks = [
  ["/service", "Services"],
  ["/service/software-development", "Software Development"],
  ["/service/mobile-app-development", "Mobile Apps"],
  ["/service/digital-marketing", "Digital Marketing"],
];

const contactLinks = [
  ["mailto:info@indexithub.com", "info@indexithub.com", Mail],
  ["tel:+9779860113289", "+977 9860113289", PhoneCall],
  ["https://maps.google.com/?q=Jyatha%2C%20Kathmandu%2C%20Nepal", "Jyatha, Kathmandu", MapPin],
];

const socials = [
  ["https://www.instagram.com/indexithub/", "Instagram", IoLogoInstagram],
  ["https://www.facebook.com/indexithub", "Facebook", IoLogoFacebook],
  ["https://www.linkedin.com/company/index-it-hub", "LinkedIn", IoLogoLinkedin],
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#0b1526_0%,#13294b_48%,#2f6faa_100%)] px-6 pt-16 text-white sm:px-10 sm:pt-20 lg:px-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-light/80 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-6 border-b border-white/10 pb-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]"
        >
          <motion.div variants={scaleIn} className="rounded-lg border border-white/15 bg-white/[0.08] p-6 shadow-2xl shadow-blue-950/20 backdrop-blur-2xl">
            <Link
              href="/"
              className="inline-flex rounded-2xl border border-[#9fe6ff]/70 bg-[#f8fcff]/95 px-4 py-3 shadow-[0_18px_42px_rgba(0,185,255,0.18)] ring-1 ring-white/60"
              aria-label="Index IT Hub home"
            >
              <Image
                src="/indexithub-logo.png"
                alt="Index IT Hub"
                width={500}
                height={120}
                className="h-auto w-[180px] drop-shadow-[0_10px_22px_rgba(0,185,255,0.18)]"
              />
            </Link>

            <p className="mt-7 max-w-md text-base leading-8 text-slate-300">
              Premium websites, software products, mobile apps, and growth systems built with clear strategy and careful execution.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-brand-light" />
              Launch-focused digital partner
            </div>
          </motion.div>

          <motion.div variants={scaleIn} className="rounded-lg border border-white/15 bg-white/[0.06] p-6 backdrop-blur-xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-light">
              Company
            </h2>
            <nav className="mt-5 grid gap-3">
              {companyLinks.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="w-fit text-sm font-semibold text-slate-300 transition hover:translate-x-1 hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>

          <motion.div variants={scaleIn} className="rounded-lg border border-white/15 bg-white/[0.06] p-6 backdrop-blur-xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-light">
              Services
            </h2>
            <nav className="mt-5 grid gap-3">
              {serviceLinks.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="w-fit text-sm font-semibold text-slate-300 transition hover:translate-x-1 hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>

          <motion.div variants={scaleIn} className="rounded-lg border border-white/15 bg-white/[0.06] p-6 backdrop-blur-xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-light">
              Contact
            </h2>
            <div className="mt-5 grid gap-3">
              {contactLinks.map(([href, label, Icon]) => (
                <Link
                  key={label}
                  href={href}
                  target={String(href).startsWith("http") ? "_blank" : undefined}
                  rel={String(href).startsWith("http") ? "noreferrer" : undefined}
                  className="flex min-h-11 items-center gap-3 rounded-lg border border-white/15 bg-white/[0.08] px-4 text-sm font-semibold text-slate-100 transition hover:border-brand-light/60 hover:bg-white/[0.12] hover:text-white"
                >
                  <Icon className="h-4 w-4 shrink-0 text-brand-light" />
                  <span className="min-w-0 break-words">{label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-6 py-8 lg:grid-cols-[1fr_auto] lg:items-center"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Sparkles className="h-4 w-4 text-brand-light" />
              Ready to plan something useful?
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Share the rough brief and we will help shape the first clear step.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-light px-6 text-sm font-bold text-slate-50 shadow-lg shadow-brand-light/20 transition hover:-translate-y-0.5 hover:bg-[#4F96EE]"
            >
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-3 text-2xl">
              {socials.map(([href, label, Icon]) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-white/[0.08] text-slate-100 transition hover:border-brand-light/60 hover:bg-white/[0.12] hover:text-brand-light"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Index IT Hub. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
            <Link href="/service" className="transition hover:text-white">
              Services
            </Link>
            <Link href="/project" className="transition hover:text-white">
              Projects
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
