"use client";

import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Share2,
  Tag,
  UserRound,
} from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { fetchBlogBySlug, fetchBlogs } from "../api/blogApi";
import PageBanner from "@/components/PageBanner";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/components/premiumMotion";

const stripHtml = (value = "") =>
  String(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toBlogList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.blogs)) return payload.data.blogs;
  if (Array.isArray(payload?.blogs)) return payload.blogs;
  return [];
};

const normalizeImageSrc = (value = "") => {
  const src = String(value).trim();
  if (!src) return "";
  if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return `/${src}`;
};

const toAbsoluteImage = (value = "") => {
  const src = normalizeImageSrc(value);
  if (!src) return "https://indexithub.com/indexithub-logo.svg";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `https://indexithub.com${src}`;
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

const labelFrom = (value, fallback) => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.name || value.title || fallback;
};

export default function BlogDetailsPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [blog, setBlog] = useState(null);
  const [blogLoading, setBlogLoading] = useState(true);
  const [archiveBlogs, setArchiveBlogs] = useState([]);
  const [archiveLoading, setArchiveLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        setBlogLoading(true);
        const response = await fetchBlogBySlug(slug);
        setBlog(response?.data || response?.blog || response || null);
        setImgError(false);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setBlog(null);
      } finally {
        setBlogLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const loadArchive = async () => {
      try {
        setArchiveLoading(true);
        const res = await fetchBlogs();
        setArchiveBlogs(toBlogList(res));
      } catch (e) {
        console.error("Failed to fetch archive blogs:", e);
        setArchiveBlogs([]);
      } finally {
        setArchiveLoading(false);
      }
    };

    loadArchive();
  }, []);

  const keywordList = useMemo(() => {
    const keywords = blog?.keywords;
    if (!keywords) return [];

    if (Array.isArray(keywords)) {
      return keywords
        .flatMap((item) => String(item).split(","))
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return String(keywords)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [blog]);

  const plainDescription = stripHtml(blog?.description);
  const summary =
    blog?.metaDescription ||
    blog?.shortDescription ||
    `${plainDescription.slice(0, 155)}${plainDescription.length > 155 ? "..." : ""}` ||
    "Read insights from Index IT Hub on digital products, technology, marketing, and business growth.";
  const displayImageUrl = normalizeImageSrc(blog?.image)
    ? toAbsoluteImage(blog?.image)
    : "";
  const seoImageUrl = toAbsoluteImage(blog?.image);
  const pageUrl = blog?.slug ? `https://indexithub.com/blog/${blog.slug}` : "https://indexithub.com/blog";
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(blog?.title || "Index IT Hub article");
  const readTime = Math.max(
    1,
    Math.ceil(plainDescription.split(/\s+/).filter(Boolean).length / 220)
  );
  const relatedPosts = archiveBlogs
    .filter((item) => item?.slug && item.slug !== blog?.slug)
    .slice(0, 6);

  if (blogLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-700 dark:bg-[#0d1a2b] dark:text-slate-300">
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          Loading article...
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-slate-700 dark:bg-[#0d1a2b] dark:text-slate-300">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <h1 className="text-2xl font-extrabold text-[#1E3A8A] dark:text-white">
            Article not found
          </h1>
          <p className="mt-3 text-sm leading-6">
            The article you are looking for may have moved or is no longer available.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-light px-5 text-sm font-bold text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{blog.metaTitle || `${blog.title} | Index IT Hub`}</title>
        <meta name="description" content={summary} />
        <meta name="keywords" content={keywordList.join(", ")} />

        <meta property="og:title" content={blog.metaTitle || blog.title} />
        <meta property="og:description" content={summary} />
        <meta property="og:image" content={seoImageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.metaTitle || blog.title} />
        <meta name="twitter:description" content={summary} />
        <meta name="twitter:image" content={seoImageUrl} />
      </Head>

      <main className="bg-white text-slate-950 dark:bg-[#0d1a2b] dark:text-white">
        <PageBanner
          compact
          eyebrow="Article"
          title={blog.title}
          description={summary}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Blogs", href: "/blog" },
            { label: "Post" },
          ]}
          actionHref="/blog"
          actionLabel="All Blogs"
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
                  {!imgError && displayImageUrl ? (
                    <img
                      src={displayImageUrl}
                      alt={blog.title}
                      onError={() => setImgError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#13294b] px-6 text-center text-sm font-bold text-white">
                      Image not available
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div variants={stagger(0.06)} className="mt-8 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/[0.04]">
                  <CalendarDays className="h-4 w-4 text-brand-light" />
                  {formatDate(blog.createdAt)}
                </span>
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/[0.04]">
                  <UserRound className="h-4 w-4 text-brand-light" />
                  {labelFrom(blog.author, "Index IT Hub")}
                </span>
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/[0.04]">
                  <Tag className="h-4 w-4 text-brand-light" />
                  {labelFrom(blog.category, "General")}
                </span>
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/[0.04]">
                  <Clock3 className="h-4 w-4 text-brand-light" />
                  {readTime} min read
                </span>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="
                  prose prose-slate mt-10 max-w-none
                  text-base leading-8
                  dark:prose-invert
                  prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-[#1E3A8A]
                  dark:prose-headings:text-white
                  prose-h1:mt-10 prose-h1:mb-5 prose-h1:text-3xl prose-h1:leading-tight
                  prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl prose-h2:leading-snug
                  prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-h3:leading-snug
                  prose-h4:mt-7 prose-h4:text-lg
                  prose-p:text-base prose-p:leading-8 prose-p:text-slate-700
                  dark:prose-p:text-slate-300
                  prose-li:text-slate-700 dark:prose-li:text-slate-300
                  prose-strong:text-[#1E3A8A] dark:prose-strong:text-white
                  prose-a:text-brand-light prose-a:no-underline prose-a:underline-offset-4
                  prose-img:rounded-lg prose-img:border prose-img:border-slate-200
                  dark:prose-img:border-white/10
                "
                dangerouslySetInnerHTML={{ __html: blog.description || "" }}
              />

              {(keywordList.length > 0 || pageUrl) && (
                <motion.div variants={fadeUp} className="mt-14 grid gap-8 border-t border-slate-200 pt-8 dark:border-white/10 lg:grid-cols-[1fr_auto] lg:items-start">
                  {keywordList.length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                        Keywords
                      </h2>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {keywordList.map((keyword, index) => (
                          <span
                            key={`${keyword}-${index}`}
                            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                      <Share2 className="h-4 w-4" />
                      Share
                    </h2>
                    <div className="mt-4 flex items-center gap-3">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on Facebook"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-brand-light hover:text-brand-light dark:border-white/10 dark:text-slate-200"
                      >
                        <FaFacebookF />
                      </a>
                      <a
                        href={`https://twitter.com/share?url=${encodedUrl}&text=${encodedTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on Twitter"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-brand-light hover:text-brand-light dark:border-white/10 dark:text-slate-200"
                      >
                        <FaTwitter />
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on LinkedIn"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-brand-light hover:text-brand-light dark:border-white/10 dark:text-slate-200"
                      >
                        <FaLinkedinIn />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.article>

            <motion.aside
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="h-fit rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none lg:sticky lg:top-28"
            >
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-white/10">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                    Archive
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold text-[#1E3A8A] dark:text-white">
                    More insights
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#13294b] text-white transition hover:bg-slate-950 dark:bg-brand-light dark:text-slate-950"
                  aria-label="Back to all blogs"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5">
                {archiveLoading ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Loading archive...
                  </p>
                ) : relatedPosts.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    No other blogs found.
                  </p>
                ) : (
                  <motion.div
                    variants={stagger(0.08)}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewportOnce}
                    className="grid gap-4"
                  >
                    {relatedPosts.map((item) => {
                      const thumbUrl = item.image ? toAbsoluteImage(item.image) : "";

                      return (
                        <motion.div
                          key={item._id || item.slug}
                          variants={scaleIn}
                          whileHover={{ y: -4 }}
                        >
                          <Link
                            href={`/blog/${item.slug}`}
                            className="group grid grid-cols-[88px_1fr] gap-4 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-brand-light dark:border-white/10 dark:bg-white/[0.04]"
                          >
                            <div className="h-16 overflow-hidden rounded-lg bg-slate-100 dark:bg-white/10">
                              {thumbUrl ? (
                                <img
                                  src={thumbUrl}
                                  alt={item.title || "Blog"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-[#13294b]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#1E3A8A] transition group-hover:text-brand-light dark:text-white">
                                {item.title}
                              </h3>
                              <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                {formatDate(item.createdAt)}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </motion.aside>
          </div>
        </section>
      </main>
    </>
  );
}
