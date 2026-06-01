"use client";

import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Send,
  Sparkles,
  UsersRound,
} from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { applyCareer } from "./api/applyCareerAPI";
import { view_career } from "./api/careerAPI";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/components/premiumMotion";

const cultureItems = [
  {
    title: "Builder Mindset",
    description: "We care about practical progress, clear ownership, and shipping work that actually helps people.",
    icon: Sparkles,
  },
  {
    title: "Calm Collaboration",
    description: "Design, engineering, marketing, and clients stay close enough to make better decisions faster.",
    icon: UsersRound,
  },
  {
    title: "Long-Term Craft",
    description: "Readable systems, thoughtful interfaces, and honest communication matter as much as launch day.",
    icon: BadgeCheck,
  },
];

const processSteps = [
  ["Apply", "Share your profile, experience, and the role you want to explore."],
  ["Conversation", "We talk through your work, interests, and how you think through real problems."],
  ["Practical Review", "For technical or design roles, we may review a small practical sample or portfolio."],
  ["Offer", "If the fit is strong, we align on scope, expectations, timing, and next steps."],
];

const initialForm = {
  career: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  qualification: "",
  experience: "",
  reference: "",
};

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.careers)) return payload.careers;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const stripHtml = (value = "") =>
  String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const formatDate = (value) => {
  if (!value) return "Open";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Open";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatSalary = (value) => {
  const amount = Number(value);
  if (!amount) return "Discussed during interview";
  return `NPR ${amount.toLocaleString()}`;
};

const splitDetails = (value = "") =>
  stripHtml(value)
    .split(/\n|\. |, /)
    .map((item) => item.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .slice(0, 4);

const roleTypeLabel = (value = "") =>
  String(value || "full-time")
    .replace("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function CareerPage() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });

  useEffect(() => {
    const loadCareers = async () => {
      try {
        const response = await view_career();
        setCareers(toArray(response).filter(Boolean));
      } catch (error) {
        console.error("Failed to fetch careers:", error);
        setCareers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCareers();
  }, []);

  const careerList = useMemo(() => toArray(careers).filter(Boolean), [careers]);
  const selectedCareer = careerList.find((career) => career._id === form.career);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const selectCareer = (id) => {
    setForm((current) => ({ ...current, career: id }));
    setNotice({ type: "", message: "" });

    if (typeof window !== "undefined") {
      document.getElementById("career-application")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice({ type: "", message: "" });

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });

      const response = await applyCareer(payload);
      if (response?.error) {
        throw new Error(response.error);
      }

      setNotice({
        type: "success",
        message: "Application submitted successfully. We will review it and get back to you.",
      });
      setForm(initialForm);
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || "Could not submit your application. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const pageTitle = "Career | Index IT Hub";
  const pageDescription =
    "Join Index IT Hub and help build premium digital products, websites, software systems, and growth platforms for ambitious teams.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="Index IT Hub careers, software jobs, web development jobs, design jobs, digital marketing jobs, Kathmandu tech jobs"
        />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indexithub.com/career" />
        <meta property="og:image" content="/indexithub-logo.svg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="bg-white text-slate-950 dark:bg-[#0d1a2b] dark:text-white">
        <PageBanner
          eyebrow="Careers at Index IT Hub"
          title="Build Useful Digital Work With Us"
          description="Join a focused team creating websites, software, mobile experiences, and growth systems for businesses that need reliable delivery."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Career" }]}
          actionHref="#open-roles"
          actionLabel="Open Roles"
        />

        <section id="open-roles" className="scroll-mt-28 px-6 pb-16 pt-8 sm:px-10 sm:pb-20 sm:pt-10 lg:px-16 lg:pb-24 lg:pt-12">
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
                  Open Roles
                </motion.p>
                <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-white sm:text-5xl">
                  Come for the work. Stay for the ownership.
                </motion.h2>
              </div>
              <motion.p variants={fadeUp} className="text-lg leading-8 text-slate-600 dark:text-slate-300">
                We look for people who can think clearly, communicate honestly, and care about the details that make digital products easier to use and maintain.
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              animate="show"
              className="mt-10 grid gap-6 lg:grid-cols-2"
            >
              {careerList.length > 0 ? (
                careerList.map((career, index) => {
                  const requirements = splitDetails(career.qualification);
                  const description = stripHtml(career.job_description);

                  return (
                    <motion.article
                      key={career._id || career.career_title || `career-${index}`}
                      variants={scaleIn}
                      whileHover={{ y: -6 }}
                      className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-7 shadow-sm transition hover:border-brand-light hover:shadow-xl hover:shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:hover:shadow-none"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#78a6f2]/10 text-brand-light">
                          <BriefcaseBusiness className="h-6 w-6" />
                        </div>
                        <span className="inline-flex min-h-8 items-center rounded-full border border-brand-light/30 bg-[#78a6f2]/10 px-3 text-xs font-black uppercase tracking-[0.12em] text-[#1E3A8A] dark:text-white">
                          {roleTypeLabel(career.type)}
                        </span>
                      </div>

                      <h3 className="mt-7 text-2xl font-extrabold leading-tight text-[#1E3A8A] dark:text-white">
                        {career.career_title || "Open Position"}
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200 px-3 dark:border-white/10">
                          <MapPin className="h-4 w-4 text-brand-light" />
                          {career.location || "Remote"}
                        </span>
                        <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200 px-3 dark:border-white/10">
                          <UsersRound className="h-4 w-4 text-brand-light" />
                          {career.vacancyNumber || 1} opening{Number(career.vacancyNumber) === 1 ? "" : "s"}
                        </span>
                        <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200 px-3 dark:border-white/10">
                          <CalendarDays className="h-4 w-4 text-brand-light" />
                          Apply by {formatDate(career.deadline)}
                        </span>
                      </div>

                      <p className="mt-5 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {description || "Work with a team focused on useful digital products, clean execution, and long-term client success."}
                      </p>

                      {requirements.length > 0 && (
                        <div className="mt-6 grid gap-3">
                          {requirements.map((item, itemIndex) => (
                            <div key={`${item}-${itemIndex}`} className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-7 flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm font-bold text-[#1E3A8A] dark:text-white">
                          {formatSalary(career.offered_salary)}
                        </span>
                        <button
                          type="button"
                          onClick={() => selectCareer(career._id || "")}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-light px-5 text-sm font-bold text-slate-950 transition hover:bg-[#4F96EE]"
                        >
                          Apply Now
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.article>
                  );
                })
              ) : (
                <motion.div variants={fadeUp} className="col-span-full rounded-lg border border-slate-200 bg-slate-50 p-8 text-center dark:border-white/10 dark:bg-white/[0.04]">
                  <BriefcaseBusiness className="mx-auto h-10 w-10 text-brand-light" />
                  <h3 className="mt-4 text-2xl font-bold text-[#1E3A8A] dark:text-white">
                    No open roles right now.
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    We are not actively hiring for a listed role at the moment, but strong people are always welcome to introduce themselves.
                  </p>
                </motion.div>
              )}
            </motion.div>

            {loading && (
              <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                Loading open roles...
              </p>
            )}
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-16 dark:bg-[#0b1624] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="max-w-3xl"
            >
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                Life at Index IT Hub
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-white sm:text-5xl">
                A small team with a high bar for useful work.
              </h2>
            </motion.div>

            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mt-10 grid gap-6 md:grid-cols-3"
            >
              {cultureItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    variants={scaleIn}
                    whileHover={{ y: -6 }}
                    className="rounded-lg border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#78a6f2]/10 text-brand-light">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-[#1E3A8A] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
            >
              <motion.p variants={fadeUp} className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                Hiring Process
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-white sm:text-5xl">
                Clear, respectful, and focused on real fit.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                We keep hiring conversations direct and useful. You will know what we are evaluating, what the role needs, and what the next step looks like.
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid gap-5 sm:grid-cols-2"
            >
              {processSteps.map(([title, copy], index) => (
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

        <section id="career-application" className="scroll-mt-28 px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
          <div className="mx-auto grid max-w-7xl gap-10 rounded-lg bg-[linear-gradient(135deg,#0b1526_0%,#13294b_48%,#2f6faa_100%)] p-8 text-white shadow-2xl shadow-slate-300/60 dark:shadow-none sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:p-12">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200">
                <Clock3 className="h-4 w-4 text-brand-light" />
                Applications are reviewed by the team
              </motion.div>
              <motion.h2 variants={fadeUp} className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Ready to introduce yourself?
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 text-lg leading-8 text-slate-200">
                Tell us what you have built, how you think, and where you want to grow. A concise but honest application is better than a perfect one.
              </motion.p>

              {selectedCareer && (
                <motion.div variants={fadeUp} className="mt-8 rounded-lg border border-white/15 bg-white/10 p-5">
                  <p className="text-sm font-semibold text-slate-200">Selected role</p>
                  <h3 className="mt-2 text-xl font-bold">{selectedCareer.career_title}</h3>
                </motion.div>
              )}
            </motion.div>

            <motion.form
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              onSubmit={handleSubmit}
              className="grid gap-4 rounded-lg border border-white/15 bg-white p-5 text-slate-950 shadow-xl sm:p-6 dark:bg-white/[0.97]"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold">
                  First Name
                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                    className="min-h-12 rounded-lg border border-slate-200 px-4 font-medium outline-none transition focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/15"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                  Last Name
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                    className="min-h-12 rounded-lg border border-slate-200 px-4 font-medium outline-none transition focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/15"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="min-h-12 rounded-lg border border-slate-200 px-4 font-medium outline-none transition focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/15"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                  Phone
                  <input
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    required
                    className="min-h-12 rounded-lg border border-slate-200 px-4 font-medium outline-none transition focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/15"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-bold">
                Role
                <select
                  name="career"
                  value={form.career}
                  onChange={handleChange}
                  className="min-h-12 rounded-lg border border-slate-200 bg-white px-4 font-medium outline-none transition focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/15"
                >
                  <option value="">General application</option>
                  {careerList.map((career) => (
                    <option key={career._id} value={career._id}>
                      {career.career_title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-bold">
                Qualification
                <textarea
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  required
                  minLength={10}
                  rows={3}
                  className="rounded-lg border border-slate-200 px-4 py-3 font-medium outline-none transition focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/15"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold">
                Experience
                <textarea
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  required
                  minLength={10}
                  rows={4}
                  className="rounded-lg border border-slate-200 px-4 py-3 font-medium outline-none transition focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/15"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold">
                Portfolio or Reference Link
                <input
                  name="reference"
                  value={form.reference}
                  onChange={handleChange}
                  placeholder="LinkedIn, GitHub, portfolio, or reference"
                  className="min-h-12 rounded-lg border border-slate-200 px-4 font-medium outline-none transition focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/15"
                />
              </label>

              {notice.message && (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
                    notice.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {notice.message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-light px-6 text-sm font-black text-slate-50 shadow-lg shadow-blue-950/10 transition hover:bg-[#4F96EE] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Submitting" : "Submit Application"}
                <Send className="h-4 w-4" />
              </button>
            </motion.form>
          </div>
        </section>
      </main>
    </>
  );
}
