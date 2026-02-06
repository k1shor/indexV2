// app/project/[slug]/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Aos from "aos";
import "aos/dist/aos.css";
import { getAllProjects } from "../api/projectsAPI";
import Head from "next/head";

export async function generateMetadata({ params }) {
  const data = await getAllProjects();
  const project = data.find((p) => p.slug === params.slug);

  if (!project) {
    return {
      title: "Project Not Found | Index IT Hub",
      description: "The project you are looking for does not exist.",
    };
  }

  const title = `${project.project_title} | Index IT Hub`;
  const description = project.description?.slice(0, 160) || "Explore our professional projects at Index IT Hub.";
  const url = `https://yourdomain.com/project/${project.slug}`;
  const image = project.project_image || "/default-project.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Index IT Hub",
      images: [{ url: image, width: 1200, height: 630, alt: project.project_title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function ProjectDetail() {
  const params = useParams();
  const slug = params?.slug;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Aos.init({ duration: 800, once: true });

    async function fetchProject() {
      try {
        const data = await getAllProjects();
        const found = data.find((p) => p.slug === slug);
        setProject(found || null);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600 animate-pulse">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">Project not found.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{project.project_title} | Index IT Hub</title>
        <meta
          name="description"
          content={project.description?.slice(0, 160) || "Explore our professional projects at Index IT Hub."}
        />
      </Head>

      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 py-12 px-6">
        <div
          className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg"
          data-aos="fade-up"
        >
          {/* Project Image */}
          <div className="mb-6" data-aos="zoom-in">
            <img
              src={project.project_image || "/default-project.jpg"}
              alt={project.project_title}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Title and Client */}
          <div className="mb-4" data-aos="fade-right">
            <h1 className="text-3xl font-bold">{project.project_title}</h1>
            {project.client && <p className="text-gray-600 mt-1">Client: {project.client}</p>}
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 leading-relaxed" data-aos="fade-left">
            {project.description}
          </p>

          {/* Technologies */}
          {project.technologies && (
            <p className="text-gray-500 mb-6" data-aos="fade-up">
              <strong>Technologies used:</strong> {project.technologies}
            </p>
          )}

          {/* Project Link */}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              data-aos="fade-up"
            >
              Visit Project
            </a>
          )}

          {/* Back Link */}
          <Link
            href="/project"
            className="inline-block mt-4 px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
            data-aos="fade-up"
          >
            ← Back to Projects
          </Link>
        </div>
      </section>
    </>
  );
}
