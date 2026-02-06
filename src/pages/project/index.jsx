"use client";
import Link from "next/link";
import * as FaIcons from "react-icons/fa";

export const metadata = {
  title: "Projects | Index IT Hub",
  description:
    "Discover Index IT Hub projects: innovative software, mobile apps, digital marketing campaigns, IT consultations, and more delivered for our clients.",
  keywords:
    "IT projects, software, mobile apps, digital marketing, IT consultation, Index IT Hub",
  openGraph: {
    title: "Projects | Index IT Hub",
    description:
      "Discover Index IT Hub projects: innovative software, mobile apps, digital marketing campaigns, IT consultations, and more delivered for our clients.",
    type: "website",
    url: "https://indexithub.com/project",
    images: ["/default-project.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Index IT Hub",
    description:
      "Discover Index IT Hub projects: innovative software, mobile apps, digital marketing campaigns, IT consultations, and more delivered for our clients.",
    images: ["/default-project.jpg"],
  },
};

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

export default function ProjectPage() {
  let projects = []; // Replace with your dynamic data

  return (
    <div className="lfooter pb-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 transition-colors duration-300">
      {/* HEADER */}
      <div
        className="contact-img text-center p-16 bg-gray-100 dark:bg-gray-800 transition-colors duration-300"
        data-aos="zoom-in"
        data-aos-duration="2000"
      >
        <h1 className="career lg:text-5xl text-3xl font-extrabold text-[#13294b] dark:text-white">
          Our Projects
        </h1>

        <div className="flex justify-center p-3 mt-4 text-[#13294b] dark:text-gray-200 bg-white/50 dark:bg-gray-700/40 backdrop-blur-md rounded-md transition-colors">
          <Link href="/" className="pr-2 hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </Link>
          /
          <span className="pl-2 font-medium">Projects</span>
        </div>
      </div>

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 py-20">
        {projects.length > 0 ? (
          projects.map((proj) => {
            const Icon = FaIcons[proj.icon] || FaIcons.FaProjectDiagram;
            const colorClass = getRandomColor();

            return (
              <Link
                key={proj.slug}
                href={`/project/${proj.slug}`}
                className="
                  bg-white dark:bg-gray-800/80
                  rounded-3xl p-8
                  shadow-lg dark:shadow-gray-950/50
                  border border-gray-200 dark:border-gray-700
                  hover:shadow-2xl hover:-translate-y-2 transform
                  transition-all duration-300 ease-out
                  flex flex-col items-center text-center
                  backdrop-blur-sm
                "
              >
                <div className="mb-5">
                  <Icon className={`${colorClass} text-5xl`} />
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {proj.project_title}
                </h2>

                <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                  {proj.client || "Client project"}
                </p>
              </Link>
            );
          })
        ) : (
          <p className="text-center col-span-3 text-gray-700 dark:text-gray-300 text-lg">
            This section is under construction. Please check back later for updates.
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="mt-20 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Ready to Start Your Project?
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-xl mx-auto text-lg md:text-xl">
          Our team is ready to turn your ideas into real, working solutions. Let’s build something great together.
        </p>

        <Link
          href="/contact"
          className="
            inline-block px-10 py-3 
            bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800
            text-white font-semibold rounded-xl shadow-lg hover:shadow-xl
            transition-all duration-300
          "
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
