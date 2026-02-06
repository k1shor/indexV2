// app/service/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import * as FaIcons from "react-icons/fa";
import { getAllServices } from "../api/servicesAPI";

// Random Tailwind color classes
const colors = [
  "text-blue-600",
  "text-green-600",
  "text-purple-600",
  "text-pink-600",
  "text-orange-600",
  "text-indigo-600",
  "text-red-600",
  "text-yellow-600",
];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function ServicePage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    Aos.init({ duration: 800, once: true, easing: "ease-in-out" });

    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };

    fetchServices();
  }, []);

  const pageTitle = "Services | Index IT Hub";
  const pageDescription =
    "Explore Index IT Hub services: software development, mobile apps, digital marketing, IT consultation, SEO optimization, and more tailored for your business growth.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="IT services, software development, mobile apps, digital marketing, SEO, IT consultation, Index IT Hub"
        />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://indexithub.com/service" />
        <meta property="og:image" content="/default-service.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="/default-service.jpg" />
      </Head>

      <div className="lfooter pb-20 bg-white dark:bg-black text-gray-900 dark:text-gray-200 transition-colors duration-300">

        {/* Banner Section */}
        <div
          className="
            contact-img text-center p-16
            bg-gray-100 dark:bg-gray-900
            transition-colors duration-300
          "
          data-aos="zoom-in"
          data-aos-duration="2000"
        >
          <h1 className="career lg:text-4xl text-2xl font-bold text-[#13294b] dark:text-white">
            Our Services
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
            <span className="pl-2">Services</span>
          </div>
        </div>

        {/* Services Grid Section */}
        <div className="body_mid w-full h-auto md:p-9 lg:flex lg:flex-wrap lg:justify-between items-start px-6">
          {services.map((svc, index) => {
            const Icon = FaIcons[svc.image] || FaIcons.FaCogs;
            const colorClass = getRandomColor();

            return (
              <Link
                key={svc.slug}
                href={`/service/${svc.slug}`}
                className="
                  lg:w-[30%] md:w-full sm:w-full 
                  bg-white dark:bg-gray-800 
                  m-3 p-8 rounded-xl 
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
                <Icon className={`${colorClass} text-4xl mb-4`} />
                <h2 className="text-2xl font-semibold mb-2">{svc.title}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {svc.short_description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Call To Action */}
        <div
          className="mt-16 text-center transition-colors"
          data-aos="fade-up"
          data-aos-delay={services.length * 100 + 200}
        >
          <h2 className="text-2xl font-bold mb-4 dark:text-white">
            Ready to Transform Your Business?
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Let’s discuss how we can help you achieve your digital goals with our expert services.
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
            Get Started
          </a>
        </div>
      </div>
    </>
  );
}
