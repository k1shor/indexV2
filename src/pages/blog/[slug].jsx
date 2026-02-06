"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { fetchBlogBySlug } from "../api/blogApi";

export default function BlogDetailsPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [blog, setBlog] = useState(null);

  useEffect(() => {
    Aos.init({ duration: 800, once: true });

    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const response = await fetchBlogBySlug(slug);
        setBlog(response.data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };

    fetchBlog();
  }, [slug]);


  if (!blog) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-700 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/uploads/${blog.image}`;
  console.log(imageUrl)
  const pageUrl = `https://indexithub.com/blog/${blog.slug}`;

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>{blog.metaTitle || blog.title}</title>
        <meta name="description" content={blog.metaDescription} />
        <meta name="keywords" content={(blog.keywords || []).join(", ")} />

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
          className="contact-img text-center p-16 bg-gray-100 dark:bg-gray-900"
          data-aos="zoom-in"
        >
          <h1 className="text-4xl font-bold text-[#13294b] dark:text-white">
            {blog.title}
          </h1>

          <div
            className="
              flex justify-center p-3 mt-3 gap-2
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
            <span className="font-semibold">{blog.title}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="w-full flex justify-center my-10">
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-11/12 md:w-2/3 lg:w-1/2 rounded-xl shadow-xl"
            data-aos="fade-up"
          />
        </div>

        {/* Blog Info Section */}
        <div className="max-w-4xl mx-auto px-6" data-aos="fade-up">
          <div className="flex flex-wrap gap-4 text-gray-700 dark:text-gray-300 mb-6">
            <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
            <span>✍️ {blog.author}</span>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
              {blog.category || "General"}
            </span>
          </div>

          {/* Blog Description / Content */}


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


          {/* Keywords */}
          {blog.keywords?.length > 0 && (
            <div
              className="mt-10 text-gray-700 dark:text-gray-300"
              data-aos="fade-up"
            >
              <h3 className="text-xl font-semibold mb-2">Keywords:</h3>
              <div className="flex flex-wrap gap-2">
                {blog.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Share */}
          <div
            className="mt-14 text-center"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h3 className="text-xl font-semibold mb-3">
              Share this article
            </h3>

            <div className="flex justify-center gap-6 text-2xl">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
                target="_blank"
                className="hover:text-blue-600"
              >
                👍
              </a>
              <a
                href={`https://twitter.com/share?url=${pageUrl}&text=${blog.title}`}
                target="_blank"
                className="hover:text-blue-400"
              >
                🐦
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`}
                target="_blank"
                className="hover:text-blue-700"
              >
                💼
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
