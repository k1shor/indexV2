"use client";

import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import { fetchBlogs } from "../api/blogApi";
import PageBanner from "@/components/PageBanner";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/components/premiumMotion";

const toBlogList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.blogs)) return payload.data.blogs;
  if (Array.isArray(payload?.blogs)) return payload.blogs;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const stripHtml = (value = "") =>
  String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const summarize = (blog) => {
  const clean = stripHtml(blog?.shortDescription || blog?.description);
  if (!clean) return "Practical thoughts on software, digital growth, product delivery, and better technology decisions.";
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

const formatDate = (value) => {
  if (!value) return "Recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await fetchBlogs();
        setBlogs(toBlogList(response).filter(Boolean));
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const featuredBlogs = useMemo(() => toBlogList(blogs).filter(Boolean), [blogs]);

  const pageTitle = "Blogs | Index IT Hub";
  const pageDescription =
    "Read the latest blogs from Index IT Hub, including tech insights, tutorials, digital marketing tips, software development trends, and more.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="blogs, IT blogs, software development, digital marketing, technology articles, Index IT Hub"
        />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indexithub.com/blog" />
        <meta property="og:image" content="/default-blog.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="/default-blog.jpg" />
      </Head>

      <main className="bg-white text-slate-950 dark:bg-[#0d1a2b] dark:text-white">
        <PageBanner
          eyebrow="Ideas, notes, and technology signals"
          title="Latest Blogs"
          description="Read practical insights on software delivery, digital growth, product thinking, and technology decisions."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blogs" }]}
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
                  Article Library
                </motion.p>
                <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-white sm:text-5xl">
                  Practical thinking for digital teams.
                </motion.h2>
              </div>
              <motion.p variants={fadeUp} className="text-lg leading-8 text-slate-600 dark:text-slate-300">
                Notes on software delivery, marketing systems, design decisions,
                infrastructure, and the work that makes digital products easier
                to launch and maintain.
              </motion.p>
            </motion.div>

            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              animate="show"
              className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {featuredBlogs.length > 0 ? (
                featuredBlogs.map((blog, index) => {
                  const imgUrl = normalizeImageSrc(blog.image);
                  const href = blog.slug ? `/blog/${blog.slug}` : "/blog";

                  return (
                    <motion.div
                      key={blog._id || blog.slug || blog.title || `blog-${index}`}
                      variants={scaleIn}
                      whileHover={{ y: -6 }}
                    >
                      <Link
                        href={href}
                        className="group block h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-brand-light hover:shadow-xl hover:shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:hover:shadow-none"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-white/[0.06]">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={blog.title || "Index IT Hub blog"}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#13294b] text-white">
                              <BookOpenText className="h-10 w-10 text-brand-light" />
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-brand-light" />
                              {formatDate(blog.createdAt)}
                            </span>
                          </div>

                          <h3 className="mt-5 text-2xl font-bold leading-tight text-[#1E3A8A] transition group-hover:text-brand-light dark:text-white">
                            {blog.title || "Index IT Hub Insight"}
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {summarize(blog)}
                          </p>

                          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-light">
                            Read article
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div variants={fadeUp} className="col-span-full rounded-lg border border-slate-200 bg-slate-50 p-8 text-center dark:border-white/10 dark:bg-white/[0.04]">
                  <BookOpenText className="mx-auto h-10 w-10 text-brand-light" />
                  <h3 className="mt-4 text-2xl font-bold text-[#1E3A8A] dark:text-white">
                    No blogs to show yet.
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    We are preparing more insights. Check back soon or reach out
                    if you want help with a current digital challenge.
                  </p>
                </motion.div>
              )}
            </motion.div>

            {loading && (
              <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                Loading the latest articles...
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
                <Sparkles className="h-4 w-4 text-brand-light" />
                Need a sharper digital direction?
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Bring the question. We will help shape the next step.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
                From software decisions to marketing systems, our team can help
                turn rough ideas into a practical action plan.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-light px-6 text-sm font-bold text-slate-50 transition hover:bg-[#4F96EE]"
            >
              Start a Conversation
              <MessageSquareText className="h-4 w-4" />
            </Link>
          </motion.div>
        </section>
      </main>
    </>
  );
}
