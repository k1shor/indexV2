"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getMissionVision } from "@/pages/api/siteContentAPI";

const DEFAULT_CONTENT = {
  heading: "Mission & Vision",
  intro:
    "We combine technology, design, SEO, and digital marketing to create solutions that drive measurable growth.",
  mission: {
    title: "Our Mission",
    items: [
      { icon: "code", text: "Deliver scalable web and software solutions" },
      { icon: "ux", text: "Create intuitive and engaging UI/UX experiences" },
      { icon: "seo", text: "Improve visibility through strategic SEO" },
      { icon: "marketing", text: "Run data-driven digital marketing campaigns" },
      { icon: "trust", text: "Build long-term client partnerships" },
    ],
  },
  vision: {
    title: "Our Vision",
    items: [
      { icon: "global", text: "Become a trusted full-service tech partner" },
      { icon: "innovation", text: "Lead in modern web and software innovation" },
      { icon: "growth", text: "Drive sustainable business growth" },
      { icon: "impact", text: "Deliver solutions with real-world impact" },
    ],
  },
};

export default function MissionVissionSection() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      try {
        const res = await getMissionVision();
        const payload = res?.data || res;

        if (!ignore && payload && typeof payload === "object") {
          setContent({
            ...DEFAULT_CONTENT,
            ...payload,
            mission: {
              ...DEFAULT_CONTENT.mission,
              ...(payload.mission || {}),
              items: Array.isArray(payload?.mission?.items)
                ? payload.mission.items
                : DEFAULT_CONTENT.mission.items,
            },
            vision: {
              ...DEFAULT_CONTENT.vision,
              ...(payload.vision || {}),
              items: Array.isArray(payload?.vision?.items)
                ? payload.vision.items
                : DEFAULT_CONTENT.vision.items,
            },
          });
        }
      } catch (e) {
        // keep defaults if API fails
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const heading = useMemo(
    () => content?.heading || DEFAULT_CONTENT.heading,
    [content]
  );

  const intro = useMemo(
    () => content?.intro || DEFAULT_CONTENT.intro,
    [content]
  );

  const missionTitle = content?.mission?.title || DEFAULT_CONTENT.mission.title;
  const missionItems = Array.isArray(content?.mission?.items)
    ? content.mission.items
    : DEFAULT_CONTENT.mission.items;

  const visionTitle = content?.vision?.title || DEFAULT_CONTENT.vision.title;
  const visionItems = Array.isArray(content?.vision?.items)
    ? content.vision.items
    : DEFAULT_CONTENT.vision.items;

  return (
    <section className="py-16 px-6 md:px-20 bg-gray-50 dark:bg-[#0b1624]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#13294b] dark:text-white">
            {heading}
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {intro}
          </p>

          {loading && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Loading content…
            </p>
          )}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow border border-gray-200 dark:border-gray-700 transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-[#13294b] dark:text-white">
              {missionTitle}
            </h3>

            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
              {missionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                    ✓
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vision */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow border border-gray-200 dark:border-gray-700 transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-[#13294b] dark:text-white">
              {visionTitle}
            </h3>

            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
              {visionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                    ✓
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
