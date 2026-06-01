"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Code2,
  Globe2,
  Handshake,
  Lightbulb,
  Megaphone,
  Palette,
  Rocket,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
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

const ICONS = {
  code: Code2,
  ux: Palette,
  seo: Search,
  marketing: Megaphone,
  trust: Handshake,
  global: Globe2,
  innovation: Lightbulb,
  growth: TrendingUp,
  impact: Rocket,
};

function ItemIcon({ name }) {
  const Icon = ICONS[name] || CheckCircle2;
  return <Icon className="h-4 w-4" aria-hidden="true" />;
}

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
        // Keep defaults if API content is unavailable.
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
    <section className="bg-slate-50 px-6 py-20 dark:bg-[#0b1624] lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-[#78a6f2]">
            Purpose
          </p>
          <h2 className="text-3xl font-extrabold leading-tight text-[#1E3A8A] dark:text-white md:text-5xl">
            {heading}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
            {intro}
          </p>

          {loading && (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Loading content...
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-7 flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#78a6f2]/15 text-[#78a6f2] dark:bg-[#78a6f2]/20 dark:text-[#7ddfff]">
                <BarChart3 className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-2xl font-bold text-[#1E3A8A] dark:text-white">
                {missionTitle}
              </h3>
            </div>

            <ul className="space-y-4 text-slate-700 dark:text-slate-300">
              {missionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#78a6f2]/15 text-[#78a6f2] dark:bg-[#78a6f2]/20 dark:text-[#7ddfff]">
                    <ItemIcon name={item.icon} />
                  </span>
                  <span className="leading-7">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-7 flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#78a6f2]/15 text-[#78a6f2] dark:bg-[#78a6f2]/20 dark:text-[#7ddfff]">
                <Sparkles className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-2xl font-bold text-[#1E3A8A] dark:text-white">
                {visionTitle}
              </h3>
            </div>

            <ul className="space-y-4 text-slate-700 dark:text-slate-300">
              {visionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#78a6f2]/15 text-[#78a6f2] dark:bg-[#78a6f2]/20 dark:text-[#7ddfff]">
                    <ItemIcon name={item.icon} />
                  </span>
                  <span className="leading-7">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
