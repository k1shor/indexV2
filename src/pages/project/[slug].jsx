"use client";

import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Code2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { getAllProjects } from "../api/projectsAPI";
import PageBanner from "@/components/PageBanner";
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

const normalizeImageSrc = (value = "") => {
  const src = String(value?.url || value?.src || value || "").trim();
  if (!src) return "/default-project.jpg";
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

const getProjectImage = (project) =>
  normalizeImageSrc(firstFrom(project?.project_image, project?.image, project?.thumbnail, project?.images));

const getProjectLink = (project) =>
  project?.link || project?.preview || project?.links?.demo || project?.links?.caseStudy || project?.links?.website || "";

const formatTechnologies = (value) => {
  if (!value) return "";
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return String(value);
};

const detailHighlights = [
  "Clear product direction",
  "Premium interface delivery",
  "Scalable implementation",
  "Launch-ready handoff",
];

export default function ProjectDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function fetchProject() {
      try {
        setLoading(true);
        const data = await getAllProjects();
        const found = toArray(data).find((item) => item.slug === slug || item._id === slug || item.id === slug);
        setProject(found || null);
        setImageFailed(false);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  const projectTitle = project?.project_title || project?.title || "Project";
  const description = stripHtml(project?.description);
  const summary = useMemo(() => {
    if (!description) {
      return "Explore how this project came together and what it delivered for real users and operations.";
    }

    return `${description.slice(0, 155)}${description.length > 155 ? "..." : ""}`;
  }, [description]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-700 dark:bg-[#0d1a2b] dark:text-slate-300">
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          Loading project...
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-700 dark:bg-[#0d1a2b] dark:text-slate-300">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <h1 className="text-2xl font-extrabold text-[#1E3A8A] dark:text-white">
            Project not found
          </h1>
          <p className="mt-3 text-sm leading-6">
            The project you are looking for may have moved or is no longer available.
          </p>
          <Link
            href="/project"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-light px-5 text-sm font-bold text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  const projectImage = getProjectImage(project);
  const projectClient = labelFrom(project.client);
  const projectCategory = labelFrom(project.category, "Case study");
  const projectTechnologies = formatTechnologies(project.technologies || project.language || project.tools);
  const projectLink = getProjectLink(project);
  const pageUrl = project.slug
    ? `https://indexithub.com/project/${project.slug}`
    : "https://indexithub.com/project";

  return (
    <>
      <Head>
        <title>{projectTitle} | Index IT Hub</title>
        <meta name="description" content={summary} />
        <meta property="og:title" content={`${projectTitle} | Index IT Hub`} />
        <meta property="og:description" content={summary} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={projectImage} />
      </Head>

      <main className="bg-white text-slate-950 dark:bg-[#0d1a2b] dark:text-white">
        <PageBanner
          compact
          eyebrow="Project detail"
          title={projectTitle}
          description={summary}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/project" },
            { label: projectTitle },
          ]}
          actionHref="/contact"
          actionLabel="Build Similar"
        />

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
            <motion.article
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="min-w-0"
            >
              <motion.div variants={fadeUp} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
                <div className="aspect-[16/9] w-full">
                  {!imageFailed && projectImage ? (
                    <img
                      src={projectImage}
                      alt={projectTitle}
                      onError={() => setImageFailed(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#0b1526_0%,#13294b_48%,#2f6faa_100%)] px-6 text-center text-sm font-bold text-white">
                      Project image not available
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/[0.04]">
                  <Briefcase className="h-4 w-4 text-brand-light" />
                  {projectCategory}
                </span>
                {projectClient && (
                  <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/[0.04]">
                    <Sparkles className="h-4 w-4 text-brand-light" />
                    {projectClient}
                  </span>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="mt-10">
                <h2 className="text-3xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-white sm:text-5xl">
                  Built with a practical balance of experience, performance, and maintainability.
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                  {description || "This project reflects the same delivery approach we use across product, web, and platform work: clear scope, thoughtful design, dependable implementation, and clean handoff."}
                </p>
              </motion.div>

              {projectTechnologies && (
                <motion.div variants={fadeUp} className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                    <Code2 className="h-4 w-4" />
                    Technologies
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {projectTechnologies}
                  </p>
                </motion.div>
              )}

              <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
                {projectLink && (
                  <a
                    href={projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-light px-6 py-2 font-semibold text-slate-950 shadow transition hover:bg-[#4F96EE]"
                  >
                    Visit Project
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                <Link
                  href="/project"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Projects
                </Link>
              </motion.div>
            </motion.article>

            <motion.aside
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="h-fit rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none lg:sticky lg:top-28"
            >
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                Delivery highlights
              </p>
              <h2 className="mt-3 text-2xl font-extrabold text-[#1E3A8A] dark:text-white">
                Why this approach works
              </h2>

              <motion.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={viewportOnce} className="mt-6 grid gap-4">
                {detailHighlights.map((item) => (
                  <motion.div
                    key={item}
                    variants={scaleIn}
                    whileHover={{ y: -4 }}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
                  >
                    <BadgeCheck className="h-5 w-5 shrink-0 text-brand-light" />
                    {item}
                  </motion.div>
                ))}
              </motion.div>
            </motion.aside>
          </div>
        </section>

        <section className="px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
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
                Need a similar result?
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Let&apos;s turn your idea into a clear, buildable plan.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
                Share the rough version and we will help define the scope, timeline, and first useful release.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-light px-6 text-sm font-bold text-slate-950 transition hover:bg-[#4F96EE]"
            >
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </section>
      </main>
    </>
  );
}
