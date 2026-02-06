"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Aos from "aos";
import "aos/dist/aos.css";
import { getAbout } from "./api/aboutAPI";
import { API } from "@/consts";

const AboutPage = () => {
  const [about, setAbout] = useState({
    description: "",
    image: "",
  });

  useEffect(() => {
    Aos.init({ once: true });

    const fetchAbout = async () => {
      try {
        const data = await getAbout();
        if (data?.error) {
          console.error("Error fetching About:", data.error);
        } else {
          setAbout({
            description: data.description || "",
            image: data.image || "",
          });
        }
      } catch (error) {
        console.error("Error fetching About:", error);
      }
    };

    fetchAbout();
  }, []);

  // Split description into paragraphs
  const renderParagraphs = (text) => {
    return text
      .split(/\r?\n|\r|\n/)
      .filter((para) => para.trim() !== "")
      .map((para, index) => (
        <p
          key={index}
          className="mb-4 lg:text-xl md:text-base text-sm text-justify text-[#13294b] dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: para }}
        />
      ));
  };

  return (
    <>
      <Head>
        <title>About Us | Index IT Hub</title>
        <meta
          name="description"
          content="Index IT Hub pioneers innovative IT solutions, including software development, mobile apps, digital marketing, SEO, and IT consulting. Learn more about our mission and expertise."
        />
        <meta
          name="keywords"
          content="Index IT Hub, IT solutions, software development, mobile apps, SEO, IT consulting, digital marketing"
        />
        <meta name="author" content="Index IT Hub" />
        <meta property="og:title" content="About Us | Index IT Hub" />
        <meta
          property="og:description"
          content="Discover how Index IT Hub delivers innovative IT solutions to businesses worldwide. Learn about our mission, services, and expertise."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/about" />
        <meta
          property="og:image"
          content={`${API}/${about.image || "default-about.jpg"}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Page Wrapper */}
      <div className="lfooter bg-white dark:bg-[#0d1a2b] transition-colors duration-300">

        {/* Banner Section */}
        <div
          className="
            contact-img text-center p-16
            bg-gray-100 dark:bg-gray-900
          "
          data-aos="zoom-in"
          data-aos-duration="2000"
        >
          <h1 className="career lg:text-4xl text-2xl font-bold text-[#13294b] dark:text-white">
            About Us
          </h1>

          <div
            className="
              flex justify-center p-3 
              text-[#13294b] dark:text-gray-200
              bg-[#ffffff50] dark:bg-gray-700/40 
            "
          >
            <a href="/" className="pr-2 hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </a>
            /
            <span className="pl-2">About</span>
          </div>
        </div>

        {/* About Content Section */}
        <div className="body_mid w-full h-auto md:p-9 flex flex-col lg:flex-row lg:justify-between items-center">

          {/* Left Content */}
          <div
            className="left lg:w-1/2 md:w-full sm:w-full lg:p-12 p-8 md:p-10 text-[#13294b] dark:text-gray-200 order-2 md:order-1"
            data-aos="zoom-in"
            data-aos-duration="2000"
          >
            {renderParagraphs(about.description)}
          </div>

          {/* Right Image */}
          {about.image && (
            <div
              className="right order-1 md:order-2 lg:w-1/2 flex justify-center px-5"
              data-aos="fade-up"
              data-aos-duration="2000"
            >
              <img
                src={`${API}/${about.image}`}
                alt="About Index IT Hub"
                className="p-10 w-full h-full object-cover rounded-lg shadow-md dark:shadow-gray-700 dark:rounded-full"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AboutPage;
