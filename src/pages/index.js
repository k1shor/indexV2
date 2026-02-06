"use client";
import Aos from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Head from "next/head";
import { getReasonsforIndex, getSettings } from "./api/settingsAPI";
import { isAuthenticated } from "./api/userApi";
import { getAbout } from "./api/aboutAPI";

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const [btnText, setBtnText] = useState("Contact Us");
  const [ready, setReady] = useState(false);
  const [about, setAbout] = useState({});
  const [reasons, setReasons] = useState([]);

  const connectNow = (event) => {
    event.preventDefault();
    if (!ready) {
      Swal.fire({
        title: "Error",
        text: "Please provide a valid email address.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: "top-right",
        icon: "error",
      });
      return;
    }
    setBtnText("...Sending");
    const formData = new FormData(event.target);
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESSKEY);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Swal.fire({
            title: "Message Sent!",
            text: "Thank you for reaching out. We’ll contact you shortly.",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: "top-right",
            icon: "success",
          });
          setReady(false);
          event.target.reset();
        } else console.log("Error", data);

        setBtnText("Contact Us");
      })
      .catch(console.log);
  };

  useEffect(() => {
    Aos.init({ duration: 800, easing: "ease-in-out", once: true });
    getAbout().then((data) => {
      if (!data.error) {
        setAbout(data);
        getReasonsforIndex().then((data) => {
          if (!data.error) setReasons(data);
        });
      }
    });
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Index IT Hub",
    image: "https://indexithub.com/logo.png",
    url: "https://indexithub.com",
    logo: "https://indexithub.com/logo.png",
    description:
      "Index IT Hub is a software development company providing custom web, mobile, and cloud solutions tailored for businesses worldwide.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jyatha, Kathmandu",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati Province",
      postalCode: "44600",
      addressCountry: "NP",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977-9860113289",
      contactType: "sales",
      areaServed: "Global",
      availableLanguage: ["English", "Nepali"],
    },
    sameAs: [
      "https://www.facebook.com/indexithub",
      "https://www.instagram.com/indexithub",
      "https://www.linkedin.com/company/index-it-hub",
    ],
  };

  return (
    <>
      <Head>
        <title>Index IT Hub | Software Development Company</title>
        <meta
          name="description"
          content="Index IT Hub delivers high-quality software development, web design, and digital solutions for businesses and startups."
        />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* 🌟 Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-100 to-blue-300 dark:from-slate-800 dark:to-slate-900 dark:text-gray-200 py-20 md:py-40 transition-colors duration-300 overflow-hidden -z-50">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-16">
          <div data-aos="fade-right" className="text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 dark:text-white leading-tight">
              Building Innovative Digital Solutions
            </h1>
            <p className="mt-5 text-lg text-gray-700 dark:text-gray-300 md:w-3/4">
              We design, develop, and deliver software that helps businesses thrive in the digital era.
            </p>
          </div>

          <img
            data-aos="fade-left"
            src="/index.gif"
            className="w-full md:w-[45%] rounded-xl shadow-xl"
            alt="Index IT Hub Software Solutions"
          />
        </div>
      </section>

      {/* 💬 Contact Section */}
      <section className="bg-blue-400 dark:bg-slate-900 text-white dark:text-gray-200 py-16 px-6 md:px-20 text-center transition-colors duration-300">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Let’s Build Something Great</h2>
        <p className="text-base md:text-lg mb-8">
          Have a project in mind? Drop your email and we’ll connect with you shortly.
        </p>

        <form
          onSubmit={connectNow}
          className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-0"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email..."
            onChange={() => setReady(true)}
            className="w-full md:w-1/2 p-3 rounded-s-md text-gray-800 dark:text-gray-200 dark:bg-slate-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <button
            type="submit"
            className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 px-8 py-3 rounded-e-md font-semibold"
          >
            {btnText}
          </button>
        </form>
      </section>

      {/* 🧑‍💻 About Section */}
      <section className="py-20 bg-blue-50 dark:bg-slate-800 md:px-20 px-6 transition-colors duration-300">
        <h2 className="text-4xl font-extrabold text-blue-900 dark:text-white text-center mb-24">
          About Us
        </h2>

        <div className="container mx-auto flex flex-col md:flex-row items-center gap-10">
          <div data-aos="fade-right" className="md:w-1/2">
            <div
              className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-justify"
              dangerouslySetInnerHTML={{ __html: about.description }}
            ></div>
          </div>

          <div data-aos="fade-left" className="md:w-1/2 flex justify-center">
            <img
              src={`${API}/${about.image}`}
              alt="About Index IT Hub"
              className="w-96 h-96 object-cover rounded-full shadow-lg border-4 border-blue-300 dark:border-blue-700"
            />
          </div>
        </div>
      </section>

      {/* 💡 Reasons / Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-slate-900 dark:to-slate-800 px-6 md:px-20 transition-colors duration-300">
        <h2 className="text-4xl font-extrabold text-center text-blue-900 dark:text-white mb-24">
          Why Choose Index IT Hub?
        </h2>

        <div className="flex flex-col gap-20">
          {reasons.map((r, i) => (
            <div
              key={i}
              className={`px-10 md:px-36 flex flex-col md:flex-row ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              } items-center gap-8`}
              data-aos="fade-up"
            >
              <div className="md:w-2/5 h-60 overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={`${API}${r.reason_image}`}
                  alt="Service"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:w-1/2 text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                <p>{r.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
