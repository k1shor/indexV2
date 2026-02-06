"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { fetchBlogs } from "../api/blogApi";
import { IMAGE } from "@/consts";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    Aos.init({ duration: 800, once: true, easing: "ease-in-out" });

    const fetchBlogss = async () => {
      try {
        const response = await fetchBlogs();
        setBlogs(response.data || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };

    fetchBlogss();
  }, []);

  const pageTitle = "Blogs | Index IT Hub";
  const pageDescription =
    "Read the latest blogs from Index IT Hub, including tech insights, tutorials, digital marketing tips, software development trends, and more.";

  return (
    <>
      {/* SEO Meta Tags */}
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

      <div className="lfooter pb-20 bg-white dark:bg-black text-gray-900 dark:text-gray-200 transition-colors duration-300">

        {/* Page Header */}
        <div
          className="
            contact-img text-center p-16
            bg-gray-100 dark:bg-gray-900
            transition-colors duration-300
          "
          data-aos="zoom-in"
        >
          <h1 className="career lg:text-4xl text-2xl font-bold text-[#13294b] dark:text-white">
            Latest Blogs
          </h1>

          <div
            className="
              flex justify-center p-3 mt-3
              text-[#13294b] dark:text-gray-200
              bg-[#ffffff50] dark:bg-gray-700/40 
              backdrop-blur-sm rounded-md
              transition-colors
            "
          >
            <a
              href="/"
              className="pr-2 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </a>
            /
            <span className="pl-2">Blogs</span>
          </div>
        </div>

        {/* Blog Grid Section */}
        <div className="body_mid w-full h-auto md:p-9 lg:flex lg:flex-wrap lg:justify-between items-start px-6">

          {
          blogs.length > 0 ?
          blogs.map((blog, index) => {
            const imgUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/uploads/${blog.image}`;

            return (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="
                  lg:w-[30%] md:w-full sm:w-full 
                  bg-white dark:bg-gray-800 
                  m-3 p-6 rounded-xl 
                  shadow-lg dark:shadow-gray-900 
                  hover:shadow-2xl dark:hover:shadow-gray-700
                  transform hover:-translate-y-2 
                  transition duration-300 ease-in-out 
                  flex flex-col items-center text-center
                  text-gray-900 dark:text-gray-200
                "
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Blog Image */}
                <img
                  src={imgUrl}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />

                {/* Blog Title */}
                <h2 className="text-2xl font-semibold mb-2">
                  {blog.title}
                </h2>

                {/* Short Description */}
                <p className="text-gray-700 dark:text-gray-300">
                  {blog.shortDescription}
                </p>
              </Link>
            );
          })
        :
        <div>No Blogs to show.</div>
        }
        </div>

        {/* Footer CTA */}
        <div
          className="mt-16 text-center transition-colors"
          data-aos="fade-up"
          data-aos-delay={blogs.length * 100 + 200}
        >
          <h2 className="text-2xl font-bold mb-4 dark:text-white">
            Want More Tech Insights?
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Stay updated with our latest articles, tutorials, and industry news.
          </p>

          <a
            href="/contact"
            className="
              inline-block px-8 py-3 
              bg-blue-600 dark:bg-blue-700 
              text-white font-medium rounded-lg shadow-md 
              hover:bg-blue-700 dark:hover:bg-blue-800 
              transition
            "
          >
            Contact Us
          </a>
        </div>

      </div>
    </>
  );
}
