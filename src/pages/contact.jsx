"use client";

import React, { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  PhoneCall,
  Send,
  ShieldCheck,
} from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { createPublicMessage } from "@/pages/api/messagesAPI";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/components/premiumMotion";

const contactMethods = [
  {
    title: "Email",
    value: "info@indexithub.com",
    href: "mailto:info@indexithub.com",
    detail: "Share your brief, requirements, or questions.",
    icon: Mail,
  },
  {
    title: "Phone",
    value: "+977 9860113289",
    href: "tel:+9779860113289",
    detail: "Talk through scope, timelines, and next steps.",
    icon: PhoneCall,
  },
  {
    title: "Office",
    value: "Kathmandu, Nepal",
    href: "https://maps.google.com/?q=Kathmandu%2C%20Nepal",
    detail: "Local presence with remote-friendly delivery.",
    icon: MapPin,
  },
];

const projectTypes = [
  "New website",
  "Software product",
  "Mobile app",
  "Marketing growth",
  "Support and upgrade",
];

const trustPoints = [
  "Clear scope before build",
  "Senior review on execution",
  "Launch and support planning",
];

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function ContactPage() {
  const [selectedType, setSelectedType] = useState(projectTypes[0]);
  const [formState, setFormState] = useState({ message: "", error: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!isValidEmail(email)) {
      setFormState({ message: "", error: "Enter a valid email address." });
      return;
    }

    try {
      setSubmitting(true);
      await createPublicMessage({
        name,
        email,
        subject: `${selectedType} inquiry`,
        category: selectedType,
        source: "contact",
        message: [
          company ? `Company: ${company}` : "",
          message || "No project details provided.",
        ]
          .filter(Boolean)
          .join("\n\n"),
      });

      form.reset();
      setFormState({
        message: "Thanks, your inquiry is in our dashboard inbox. Our team will follow up soon.",
        error: "",
      });
    } catch (err) {
      setFormState({
        message: "",
        error: err.message || "Could not send your inquiry. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const pageTitle = "Contact | Index IT Hub";
  const pageDescription =
    "Contact Index IT Hub to discuss websites, software products, mobile apps, digital marketing, support, and IT consultation.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="contact Index IT Hub, IT company Nepal, software development inquiry, website development, mobile app development"
        />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indexithub.com/contact" />
        <meta property="og:image" content="/indexithub-logo.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>

      <main className="bg-white text-slate-950 dark:bg-[#0d1a2b] dark:text-white">
        <PageBanner
          eyebrow="Start with clarity"
          title="Contact Us"
          description="Tell us what you are building, improving, or untangling. We will help shape the next practical step."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
          actionHref="mailto:info@indexithub.com"
          actionLabel="Email Us"
        />

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-14">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
            >
              <motion.p variants={fadeUp} className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                Project inquiry
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-white sm:text-5xl">
                A sharper first conversation makes the whole project easier.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Use the form for a quick brief, or reach us directly through any channel below. We usually respond within one business day.
              </motion.p>

              <motion.div variants={stagger(0.08)} className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
                {contactMethods.map((method) => {
                  const Icon = method.icon;

                  return (
                    <motion.a
                      key={method.title}
                      variants={scaleIn}
                      whileHover={{ y: -6 }}
                      href={method.href}
                      target={method.href.startsWith("http") ? "_blank" : undefined}
                      rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                      className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-light hover:shadow-xl hover:shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:hover:shadow-none"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#78a6f2]/10 text-brand-light">
                          <Icon className="h-6 w-6" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                            {method.title}
                          </span>
                          <span className="mt-2 block break-words text-lg font-bold text-[#1E3A8A] transition group-hover:text-brand-light dark:text-white">
                            {method.value}
                          </span>
                          <span className="mt-2 block text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {method.detail}
                          </span>
                        </span>
                      </div>
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>

            <motion.form
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              onSubmit={handleSubmit}
              className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-2xl shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none sm:p-8 lg:p-10"
            >
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-7 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                    Tell us the shape
                  </p>
                  <h3 className="mt-3 text-2xl font-extrabold text-[#1E3A8A] dark:text-white">
                    Request a consultation
                  </h3>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                  <Clock3 className="h-4 w-4 text-brand-light" />
                  24-48 hr reply
                </div>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-[#1E3A8A] dark:text-white">
                    Name
                  </span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/20 dark:border-white/10 dark:bg-[#0b1624] dark:text-white"
                    placeholder="Your name"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-[#1E3A8A] dark:text-white">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/20 dark:border-white/10 dark:bg-[#0b1624] dark:text-white"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="mt-5 block">
                <span className="text-sm font-bold text-[#1E3A8A] dark:text-white">
                  Company
                </span>
                <input
                  name="company"
                  type="text"
                  autoComplete="organization"
                  className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/20 dark:border-white/10 dark:bg-[#0b1624] dark:text-white"
                  placeholder="Company or organization"
                />
              </label>

              <div className="mt-7">
                <p className="text-sm font-bold text-[#1E3A8A] dark:text-white">
                  Project type
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {projectTypes.map((type) => {
                    const active = selectedType === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelectedType(type)}
                        className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                          active
                            ? "border-brand-light bg-brand-light text-slate-950 shadow-lg shadow-blue-950/10"
                            : "border-slate-200 bg-white text-slate-600 hover:border-brand-light hover:text-[#1E3A8A] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:text-white"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="mt-7 block">
                <span className="text-sm font-bold text-[#1E3A8A] dark:text-white">
                  Message
                </span>
                <textarea
                  name="message"
                  rows={6}
                  required
                  className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/20 dark:border-white/10 dark:bg-[#0b1624] dark:text-white"
                  placeholder="What are you building, what is not working, or what outcome do you want?"
                />
              </label>

              {formState.error && (
                <p className="mt-4 text-sm font-semibold text-red-600 dark:text-red-300">
                  {formState.error}
                </p>
              )}

              {formState.message && (
                <p className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {formState.message}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#13294b] px-6 text-sm font-bold text-white shadow-lg shadow-slate-300/70 transition hover:bg-[#0f203b] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-light dark:text-slate-950 dark:shadow-none dark:hover:bg-[#4F96EE] sm:w-auto"
              >
                {submitting ? "Sending..." : "Send Inquiry"}
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </motion.form>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-16 dark:bg-[#0b1624] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
            >
              <motion.p variants={fadeUp} className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                What happens next
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-white sm:text-5xl">
                From first note to clear action plan.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                We focus the first conversation on your goals, constraints, current systems, timeline, and the smallest useful release or improvement.
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid gap-5"
            >
              {trustPoints.map((item, index) => (
                <motion.div
                  key={item}
                  variants={scaleIn}
                  whileHover={{ y: -6 }}
                  className="flex items-start gap-5 rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#13294b] text-sm font-bold text-white dark:bg-brand-light dark:text-slate-950">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1E3A8A] dark:text-white">
                      {item}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      You get practical direction before committing to heavy delivery.
                    </p>
                  </div>
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
                <ShieldCheck className="h-4 w-4 text-brand-light" />
                Confidential, practical, and outcome-led
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Bring the rough brief. We will help sharpen it.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
                Whether you need a new product, a better website, growth support, or a rescue plan, the first step is a clear conversation.
              </p>
            </div>

            <a
              href="mailto:info@indexithub.com"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-light px-6 text-sm font-bold text-slate-950 transition hover:bg-[#4F96EE]"
            >
              Contact Directly
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </section>
      </main>
    </>
  );
}
