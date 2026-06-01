"use client";

import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ExternalLink,
  Layers3,
  Sparkles,
} from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { getAllProjects } from "../api/projectsAPI";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/components/premiumMotion";

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.projects)) return payload.data.projects;
  if (Array.isArray(payload?.projects)) return payload.projects;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const stripHtml = (value = "") =>
  String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const summarize = (project) => {
  const clean = stripHtml(project?.description || project?.short_description || project?.client);
  if (!clean) return "A digital delivery shaped around useful experience, practical systems, and maintainable implementation.";
  return clean.length > 150 ? `${clean.slice(0, 150).trim()}...` : clean;
};

const normalizeImageSrc = (value = "") => {
  const src = String(value?.url || value?.src || value || "").trim();
  if (!src) return "";
  if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  if (src.startsWith("public/")) {
    return `/${src.replace(/^public\//, "")}`;
  }
  return `/${src}`;
};

const labelFrom = (value, fallback = "") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.name || value.title || value.label || fallback;
};

const firstFrom = (...values) =>
  values
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .find(Boolean);

const getProjectTitle = (project) =>
  project?.project_title || project?.title || project?.name || "Index IT Hub Project";

const getProjectImage = (project) =>
  normalizeImageSrc(firstFrom(project?.project_image, project?.image, project?.thumbnail, project?.images));

const getProjectLink = (project) =>
  project?.link || project?.preview || project?.links?.demo || project?.links?.caseStudy || project?.links?.website || "";

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const loadProjects = async () => {
    //   try {
    //     const response = await getAllProjects();
    //     setProjects(toArray(response).filter(Boolean));
    //   } catch (err) {
    //     console.error("Failed to fetch projects:", err);
    //     setProjects([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // loadProjects();
  }, []);

  const projectList = useMemo(() => toArray(projects).filter(Boolean), [projects]);

  const pageTitle = "Projects | Index IT Hub";
  const pageDescription =
    "Discover Index IT Hub projects: innovative software, mobile apps, digital marketing campaigns, IT consultations, and more delivered for our clients.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="IT projects, software, mobile apps, digital marketing, IT consultation, Index IT Hub"
        />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indexithub.com/project" />
        <meta property="og:image" content="/default-project.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="bg-white text-slate-950 dark:bg-[#0d1a2b] dark:text-white">
        <PageBanner
          eyebrow="Selected digital work"
          title="Our Projects"
          description="A curated look at platforms, systems, websites, and product experiences shaped for real users and real operations."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
          actionHref="/contact"
          actionLabel="Start Yours"
        />

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
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
                  Project Portfolio
                </motion.p>
                <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-white sm:text-5xl">
                  Digital work with real operational weight.
                </motion.h2>
              </div>
              <motion.p variants={fadeUp} className="text-lg leading-8 text-slate-600 dark:text-slate-300">
                Every project is treated as a working system: clear goals,
                strong user experience, maintainable implementation, and a
                launch path that supports the business after delivery.
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              animate="show"
              className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {projectList.length > 0 ? (
                projectList.map((project, index) => {
                  const imageSrc = getProjectImage(project);
                  const title = getProjectTitle(project);
                  const clientLabel = labelFrom(project.client);
                  const href = project.slug || project._id ? `/project/${project.slug || project._id}` : "/project";
                  const externalLink = getProjectLink(project);

                  return (
                    <motion.div
                      key={project._id || project.slug || title || `project-${index}`}
                      variants={scaleIn}
                      whileHover={{ y: -6 }}
                    >
                      <Link
                        href={href}
                        className="group block h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-brand-light hover:shadow-xl hover:shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:hover:shadow-none"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-white/[0.06]">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#13294b] text-white">
                              <Layers3 className="h-10 w-10 text-brand-light" />
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <div className="flex items-center justify-between gap-4">
                            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500 dark:border-white/10 dark:text-slate-400">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {externalLink && <ExternalLink className="h-4 w-4 text-brand-light" />}
                          </div>

                          <h3 className="mt-5 text-2xl font-bold leading-tight text-[#1E3A8A] transition group-hover:text-brand-light dark:text-white">
                            {title}
                          </h3>
                          {clientLabel && (
                            <p className="mt-2 text-sm font-bold text-brand-light">
                              {clientLabel}
                            </p>
                          )}
                          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {summarize(project)}
                          </p>

                          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-light">
                            View project
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div variants={fadeUp} className="col-span-full rounded-lg border border-slate-200 bg-slate-50 p-8 text-center dark:border-white/10 dark:bg-white/[0.04]">
                  <BriefcaseBusiness className="mx-auto h-10 w-10 text-brand-light" />
                  <h3 className="mt-4 text-2xl font-bold text-[#1E3A8A] dark:text-white">
                    Projects are being prepared.
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    We are curating project stories for this space. In the
                    meantime, we can talk through a similar system for your team.
                  </p>
                </motion.div>
              )}
            </motion.div>

            {loading && (
              <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                Loading the latest projects...
              </p>
            )}
          </div>
        </section>

        <section className="px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto grid max-w-7xl gap-9 rounded-lg bg-[linear-gradient(135deg,#0b1526_0%,#13294b_48%,#2f6faa_100%)] p-8 text-white shadow-2xl shadow-slate-300/60 dark:shadow-none sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:p-12"
          >
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100">
                <BadgeCheck className="h-4 w-4 text-brand-light" />
                Launch-focused and built to improve
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to start your own digital system?
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
                Bring the rough version of the idea. We will help shape it into
                scope, milestones, and a practical launch path.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-light px-6 text-sm font-bold text-slate-50 transition hover:bg-[#4F96EE]"
            >
              Start a Project
              <Sparkles className="h-4 w-4" />
            </Link>
          </motion.div>
        </section>
      </main>
    </>
  );
}
