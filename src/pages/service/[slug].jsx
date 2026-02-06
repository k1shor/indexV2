// app/service/[slug]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import * as FaIcons from "react-icons/fa";
import Aos from "aos";
import "aos/dist/aos.css";
import { getAllServices } from "../api/servicesAPI";
import Head from "next/head";

export async function generateMetadata({ params }) {
  const data = await getAllServices();
  const service = data.find((svc) => svc.slug === params.slug);

  if (!service) {
    return {
      title: "Service Not Found | Index IT Hub",
      description: "The service you are looking for does not exist.",
    };
  }

  const title = `${service.title} - ${
    service.short_description || "IT Services"
  } | Index IT Hub`;

  const description =
    service.short_description ||
    service.description?.slice(0, 160) ||
    "Explore our professional IT services at Index IT Hub.";

  const url = `https://yourdomain.com/service/${service.slug}`;
  const image = service.image || "/default-service.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Index IT Hub",
      images: [{ url: image, width: 1200, height: 630, alt: service.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        description: description,
        provider: {
          "@type": "Organization",
          name: "Index IT Hub",
          url: "https://yourdomain.com",
        },
        url,
        image,
      }),
    },
  };
}

export default function ServiceDetail() {
  const params = useParams();
  const slug = params?.slug;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // fallback
  const FALLBACK_IMAGE = "/image3.jpg";

  useEffect(() => {
    Aos.init({ duration: 800, once: true, easing: "ease-in-out" });

    async function fetchService() {
      try {
        const data = await getAllServices();
        const found = data.find((svc) => svc.slug === slug);
        setService(found || null);
      } catch (err) {
        console.error("Failed to fetch service:", err);
        setService(null);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f172a] transition-colors">
        <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">
          Loading service...
        </p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f172a] transition-colors">
        <p className="text-lg text-red-600 dark:text-red-400">
          Service not found.
        </p>
      </div>
    );
  }

  const Icon = FaIcons[service.image] || FaIcons.FaCogs;

  return (
    <>
      <Head>
        <title>{service.title} | Index IT Hub</title>
        <meta
          name="description"
          content={
            service.short_description || service.description?.slice(0, 160)
          }
        />
      </Head>

      <div className="lfooter pb-20 bg-white dark:bg-[#0f172a] transition-colors duration-300">

        {/* Banner Section */}
        <div
          className="contact-img text-center p-16 bg-white/50 dark:bg-black/30 transition-colors duration-300"
          data-aos="zoom-in"
        >
          <h1 className="career lg:text-4xl text-2xl font-bold text-[#13294b] dark:text-white">
            {service.title}
          </h1>

          <div className="flex justify-center p-3 text-[#13294b] dark:text-gray-200 bg-[#ffffff50] dark:bg-white/10 rounded-lg">
            <Link href="/" className="pr-2 hover:text-black dark:hover:text-white">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/service" className="px-2 hover:text-black dark:hover:text-white">
              Services
            </Link>{" "}
            / <span className="pl-2">{service.title}</span>
          </div>
        </div>

        {/* Service Content */}
        <div className="body_mid w-full h-auto md:p-9 lg:flex lg:justify-between items-center px-6">
          <div
            className="left lg:w-1/2 md:w-full sm:w-full lg:p-12 p-8 md:p-10"
            data-aos="fade-right"
          >
            <div className="flex items-center gap-4 mb-6">
              <Icon className="text-blue-600 dark:text-blue-400 text-5xl" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {service.title}
              </h2>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {service.description || service.short_description}
            </p>
          </div>

          {/* Right Image */}
          {service.image && (
            <div className="right m-5 lg:w-1/2 flex justify-center" data-aos="fade-left">
              <img
                src={service.image}
                alt={service.title}
                onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                className="p-10 w-full h-full object-cover rounded-lg shadow-md dark:shadow-gray-800 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Back button */}
        <div className="text-center mt-12" data-aos="fade-up">
          <Link
            href="/service"
            className="inline-block px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-400 transition"
          >
            ← Back to Services
          </Link>
        </div>
      </div>
    </>
  );
}
