"use client";

import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Aos from "aos";
import "aos/dist/aos.css";
import { getAbout } from "./api/aboutAPI";
import { getAllUsers } from "./api/userApi";
import MissionVisionSection from "@/components/MissionVissionSection";
// import { getTeamMembers } from "./api/teamAPI";

// If you don't have these images in /public, add them OR keep fallback only.
const FALLBACK_TEAM_IMAGE = "/team-placeholder.png";

// -----------------------------
// Small inline SVG icon set (no extra deps)
// -----------------------------
function IconLink({ href, label, children }) {
  if (!href) return null;
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#13294b] shadow-sm ring-1 ring-black/5 transition hover:scale-105 hover:bg-white dark:bg-gray-900/80 dark:text-gray-100 dark:ring-white/10"
    >
      {children}
    </a>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.87v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.79-3.89 1.1 0 2.25.2 2.25.2v2.46h-1.27c-1.25 0-1.64.77-1.64 1.56V12h2.8l-.45 2.88h-2.35v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 23.5h4V7.98h-4V23.5ZM8 7.98h3.84v2.12h.06c.54-1.02 1.86-2.1 3.84-2.1 4.1 0 4.86 2.7 4.86 6.2v9.3h-4v-8.26c0-1.97-.04-4.5-2.74-4.5-2.75 0-3.17 2.14-3.17 4.36v8.4H8V7.98Z" />
    </svg>
  );
}

function IconTwitter() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2.25h3.37l-7.36 8.41L23.5 21.75h-6.73l-5.27-6.9-6.03 6.9H2.1l7.87-9.0L.5 2.25h6.9l4.76 6.23 5.74-6.23Zm-1.18 17.5h1.87L6.38 4.16H4.38l13.34 15.59Z" />
    </svg>
  );
}

function IconWebsite() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm7.93 9h-3.05a15.7 15.7 0 0 0-1.2-5.02A8.03 8.03 0 0 1 19.93 11ZM12 4c.9 0 2.34 1.78 3.05 7H8.95C9.66 5.78 11.1 4 12 4ZM4.07 13h3.05c.18 1.8.63 3.52 1.2 5.02A8.03 8.03 0 0 1 4.07 13Zm3.05-2H4.07a8.03 8.03 0 0 1 4.25-5.02A15.7 15.7 0 0 0 7.12 11Zm1.83 2h6.1c-.7 5.22-2.15 7-3.05 7s-2.35-1.78-3.05-7Zm7.93 0h3.05a8.03 8.03 0 0 1-4.25 5.02c.57-1.5 1.02-3.22 1.2-5.02Z" />
    </svg>
  );
}

// -----------------------------
// Org chart (simple, responsive)
// -----------------------------
function OrgChart() {
  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-[#13294b] dark:text-white">
          Organizational Structure
        </h2>
        <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A streamlined functional structure focused on delivery quality, engineering excellence,
          and measurable growth outcomes.
        </p>
      </div>

      {/* Nodes */}
      <div className="relative mx-auto max-w-6xl">
        {/* Top */}
        <div className="flex justify-center">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Managing Director / Founder
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              Strategy • Partnerships • Governance
            </p>
          </div>
        </div>

        {/* Connector */}
        <div className="mx-auto my-4 h-10 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Middle row */}
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Technical Lead",
              sub: "Architecture • Code Quality • DevOps",
            },
            {
              title: "Operations / PM",
              sub: "Delivery • Timelines • Client Communication",
            }
          ].map((n) => (
            <div
              key={n.title}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 shadow-sm text-center"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{n.title}</p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{n.sub}</p>
            </div>
          ))}
        </div>

        {/* Connector down */}
        <div className="mx-auto my-6 h-10 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Bottom row */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { title: "Frontend Developer", sub: "Next.js • React • UI" },
            { title: "Backend Developer", sub: "Node • APIs • DB" },
            { title: "UI UX Designer", sub: "UI/UX • Graphics" },
            { title: "QA and Support", sub: "Maintenance • Security" },
          ].map((n) => (
            <div
              key={n.title}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 shadow-sm text-center"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{n.title}</p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{n.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const AboutPage = () => {
  const [about, setAbout] = useState({ description: "", image: "" });
  const [team, setTeam] = useState([]);
  const [teamError, setTeamError] = useState("");

  useEffect(() => {
    Aos.init({ once: true });

    const fetchAbout = async () => {
      try {
        const data = await getAbout();
        if (!data?.error) {
          setAbout({ description: data.description || "", image: data.image || "" });
        }
      } catch (error) {
        console.error("Error fetching About:", error);
      }
    };

    const fetchTeam = async () => {
      setTeamError("");
      try {
        const data = await getAllUsers();
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setTeam(list);
      } catch (e) {
        setTeam([]);
        setTeamError(e?.message || "Failed to load team.");
      }
    };

    fetchAbout();
    fetchTeam();
  }, []);

  const renderParagraphs = (text) => {
    return (text || "")
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

  const safeTeam = useMemo(() => (Array.isArray(team) ? team : []), [team]);

  return (
    <>
      <Head>
        <title>About Us | Index IT Hub</title>
        <meta
          name="description"
          content="Learn about Index IT Hub, our mission, vision, team, and organizational structure."
        />
      </Head>

      <div className="bg-white dark:bg-[#0d1a2b] transition-colors duration-300">
        {/* Banner */}
        <div
          className="text-center p-16 bg-gray-100 dark:bg-gray-900"
          data-aos="zoom-in"
          data-aos-duration="1200"
        >
          <h1 className="lg:text-4xl text-2xl font-bold text-[#13294b] dark:text-white">
            About Us
          </h1>

          <div className="mt-4 flex justify-center p-3 text-[#13294b] dark:text-gray-200 bg-[#ffffff50] dark:bg-gray-700/40">
            <a href="/" className="pr-2 hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </a>
            /
            <span className="pl-2">About</span>
          </div>
        </div>

        {/* About content */}
        <div className="w-full h-auto md:p-9 flex flex-col lg:flex-row lg:justify-between items-center">
          <div
            className="lg:w-1/2 md:w-full lg:p-12 p-8 md:p-10 text-[#13294b] dark:text-gray-200 order-2 md:order-1"
            data-aos="zoom-in"
            data-aos-duration="1200"
          >
            {renderParagraphs(about.description)}
          </div>

          {about.image && (
            <div
              className="order-1 md:order-2 lg:w-1/2 flex justify-center px-5"
              data-aos="fade-up"
              data-aos-duration="1200"
            >
              <img
                src={about.image}
                alt="About Index IT Hub"
                className="p-10 w-full h-full object-cover rounded-lg shadow-md dark:shadow-gray-700 dark:rounded-full"
              />
            </div>
          )}
        </div>

        {/* Mission & Vision (previous bullet version + heading + paragraph) */}
       <MissionVisionSection/>


        {/* Team Section (API-connected + hover social icons) */}
        {/* <div className="py-16 px-6 md:px-20">
          <div className="max-w-6xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold text-[#13294b] dark:text-white">
              Meet Our Team
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A focused group of engineers, designers, and strategists committed to building
              fast, secure, and scalable solutions.
            </p>
            {teamError && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">{teamError}</p>
            )}
          </div>

          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeTeam.length > 0 ? (
              safeTeam.map((m) => {
                const imageSrc = m?.image || FALLBACK_TEAM_IMAGE;
                return (
                  <div
                    key={m._id || `${m?.name}-${m?.initials}`}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
                    data-aos="fade-up"
                  >
                    <div className="relative h-40 w-full bg-gray-100 dark:bg-gray-900">
                      <img
                        src={imageSrc}
                        alt={m?.name || "Team member"}
                        onError={(e) => (e.currentTarget.src = FALLBACK_TEAM_IMAGE)}
                        className="h-40 w-full object-cover"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/35 transition" />

                      <div className="pointer-events-auto absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <IconLink href={m?.socials?.facebook} label="Facebook">
                          <IconFacebook />
                        </IconLink>
                        <IconLink href={m?.socials?.linkedin} label="LinkedIn">
                          <IconLinkedIn />
                        </IconLink>
                        <IconLink href={m?.socials?.twitter} label="Twitter / X">
                          <IconTwitter />
                        </IconLink>
                        <IconLink href={m?.socials?.website} label="Website">
                          <IconWebsite />
                        </IconLink>
                      </div>

                      <div className="absolute left-4 bottom-4">
                        <span className="inline-flex items-center justify-center rounded-full bg-[#13294b] text-white px-3 py-2 text-xs font-bold shadow">
                          {m?.initials || "IT"}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 text-left">
                      <h3 className="text-lg font-bold text-[#13294b] dark:text-white">
                        {m?.name || "Team Member"}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {m?.title || m?.role || "Role"}
                      </p>
                      {m?.bio && (
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                          {m.bio}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-600 dark:text-gray-300">
                No team members found.
              </div>
            )}
          </div>
        </div>

        <div className="py-16 px-6 md:px-20 bg-gray-50 dark:bg-[#0b1624]">
          <div className="max-w-6xl mx-auto">
            <OrgChart />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default AboutPage;
