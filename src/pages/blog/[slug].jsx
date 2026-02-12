"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import Image from "next/image";
import { fetchBlogBySlug, fetchBlogs } from "../api/blogApi";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function BlogDetailsPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [blog, setBlog] = useState(null);

  // Archive state
  const [archiveBlogs, setArchiveBlogs] = useState([]);
  const [archiveLoading, setArchiveLoading] = useState(true);

  const [imgError, setImgError] = useState(false);

  // ✅ Always call hooks before any conditional return
  const keywordList = useMemo(() => {
    const keywords = blog?.keywords;
    if (!keywords) return [];

    if (Array.isArray(keywords)) {
      return keywords
        .flatMap((k) => String(k).split(","))
        .map((k) => k.trim())
        .filter(Boolean);
    }

    return String(keywords)
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
  }, [blog]);

  useEffect(() => {
    Aos.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const response = await fetchBlogBySlug(slug);
        setBlog(response.data);
        setImgError(false);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };

    fetchBlog();
  }, [slug]);

  // Fetch archive list
  useEffect(() => {
    const loadArchive = async () => {
      try {
        setArchiveLoading(true);

        const res = await fetchBlogs();
        const list = Array.isArray(res.data) ? res.data : res.data?.blogs || [];

        setArchiveBlogs(list);
      } catch (e) {
        console.error("Failed to fetch archive blogs:", e);
        setArchiveBlogs([]);
      } finally {
        setArchiveLoading(false);
      }
    };

    loadArchive();
  }, []);

  // ✅ compute URLs safely (no hooks)
  const rawImage = `${blog?.image || ""}`;
  const imageUrl =
    rawImage && (rawImage.startsWith("http://") || rawImage.startsWith("https://"))
      ? rawImage
      : rawImage
      ? `https://indexithub.com${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
      : "";

  const pageUrl = blog?.slug ? `https://indexithub.com/blog/${blog.slug}` : "";

  // ✅ conditional return AFTER hooks
  if (!blog) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-700 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>{blog.metaTitle || blog.title}</title>
        <meta name="description" content={blog.metaDescription} />
        <meta name="keywords" content={keywordList.join(", ")} />

        <meta property="og:title" content={blog.metaTitle || blog.title} />
        <meta property="og:description" content={blog.metaDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.metaTitle || blog.title} />
        <meta name="twitter:description" content={blog.metaDescription} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>

      <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-200 min-h-screen pb-20">
        {/* Header Section */}
        <div
          className="contact-img text-center p-12 md:p-16 bg-gray-100 dark:bg-gray-900"
          data-aos="zoom-in"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-[#13294b] dark:text-white">
            BLOG POST
          </h1>

          <div
            className="
              flex justify-center p-3 mt-4 gap-2
              text-[#13294b] dark:text-gray-200
              bg-[#ffffff70] dark:bg-gray-700/40 
              backdrop-blur-sm rounded-md
            "
          >
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
            /
            <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">
              Blogs
            </Link>
            /
            <span className="font-semibold">Post</span>
          </div>
        </div>

        {/* Main Content + Archive */}
        <div className="max-w-6xl mx-auto px-6 mt-10" data-aos="fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
            {/* LEFT SIDE */}
            <div>
              {/* Dynamic Blog Title */}
              <h2 className="text-3xl md:text-3xl font-semibold leading-tight text-gray-900 dark:text-gray-100 mb-6">
                {blog.title}
              </h2>

              {/* Featured Image */}
              <div className="w-full overflow-hidden rounded-2xl mb-8">
                <div className="relative w-full aspect-[16/9]">
                  {!imgError && imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={blog.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 66vw"
                      className="object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      Image not available
                    </div>
                  )}
                </div>
              </div>

              {/* Blog Meta */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <span className="flex items-center gap-2">
                  <span className="opacity-80">📅</span>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>

                <span className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />

                <span className="flex items-center gap-2">
                  <span className="opacity-80">✍️</span>
                  {blog.author}
                </span>

                <span className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />

                <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {blog.category || "General"}
                </span>
              </div>

              {/* Blog Content */}
              <div
                className="
                  prose prose-lg max-w-none
                  dark:prose-invert
                  text-gray-800 dark:text-gray-200
                  prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                  prose-li:text-gray-800 dark:prose-li:text-gray-200
                  prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                  prose-a:text-blue-600 dark:prose-a:text-blue-400
                "
                dangerouslySetInnerHTML={{ __html: blog.description }}
              ></div>

              {/* ✅ Keywords as Separate Blocks (split by comma) */}
              {keywordList.length > 0 && (
                <div className="mt-12" data-aos="fade-up">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Keywords
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    {keywordList.map((kw, i) => (
                      <span
                        key={`${kw}-${i}`}
                        className="
                          px-4 py-2 text-sm font-medium
                          rounded-lg
                          bg-gray-100 dark:bg-gray-800
                          border border-gray-200 dark:border-gray-700
                          hover:bg-blue-50 dark:hover:bg-gray-700
                          transition duration-200
                        "
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Share */}
              <div className="mt-14">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Share this article
                </h3>

                <div className="flex items-center gap-4">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    className="
                      inline-flex items-center justify-center
                      h-11 w-11 rounded-full
                      border border-gray-200 dark:border-gray-800
                      text-gray-700 dark:text-gray-200
                      hover:border-blue-300 hover:text-blue-600
                      dark:hover:border-blue-600/50 dark:hover:text-blue-400
                      transition duration-200
                    "
                  >
                    <FaFacebookF />
                  </a>

                  <a
                    href={`https://twitter.com/share?url=${pageUrl}&text=${blog.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter"
                    className="
                      inline-flex items-center justify-center
                      h-11 w-11 rounded-full
                      border border-gray-200 dark:border-gray-800
                      text-gray-700 dark:text-gray-200
                      hover:border-sky-300 hover:text-sky-500
                      dark:hover:border-sky-600/50 dark:hover:text-sky-400
                      transition duration-200
                    "
                  >
                    <FaTwitter />
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="
                      inline-flex items-center justify-center
                      h-11 w-11 rounded-full
                      border border-gray-200 dark:border-gray-800
                      text-gray-700 dark:text-gray-200
                      hover:border-blue-400 hover:text-blue-700
                      dark:hover:border-blue-700/50 dark:hover:text-blue-400
                      transition duration-200
                    "
                  >
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - ARCHIVE (with thumbnails) */}
            <aside className="h-fit mt-5">
              <h3 className="text-lg md:text-3xl underline font-semibold text-gray-900 dark:text-gray-100 mb-5">
                Archive
              </h3>

              {archiveLoading ? (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Loading archive...
                </div>
              ) : archiveBlogs.length === 0 ? (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  No blogs found.
                </div>
              ) : (
                <div className="space-y-4">
                  {archiveBlogs.map((b) => {
                    const isActive = b.slug === blog.slug;

                    const rawThumb = `${b.image || ""}`;
                    const thumbUrl =
                      rawThumb &&
                      (rawThumb.startsWith("http://") ||
                        rawThumb.startsWith("https://"))
                        ? rawThumb
                        : rawThumb
                        ? `https://indexithub.com${
                            rawThumb.startsWith("/") ? "" : "/"
                          }${rawThumb}`
                        : "";

                    return (
                      <Link
                        key={b._id || b.slug}
                        href={`/blog/${b.slug}`}
                        className={`group flex gap-3 items-start ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 shrink-0">
                          {thumbUrl ? (
                            <Image
                              src={thumbUrl}
                              alt={b.title || "Blog"}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />
                          )}
                        </div>

                        {/* Text */}
                        <div className="min-w-0">
                          <div className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                            {b.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
