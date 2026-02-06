"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as FaIcons from "react-icons/fa";
import { createService } from "@/pages/api/servicesAPI";
import AdminLayout from "@/components/admin/AdminLayout";
import ClientOnly from "@/components/ClientOnly";

export const metadata = {
  title: "Add Service | Admin Dashboard",
  description: "Add a new service to Index IT Hub. Set title, description, slug, and icon with color.",
  keywords: ["Index IT Hub", "Admin", "Add Service", "Dashboard", "React Icons"],
  openGraph: {
    title: "Add Service - Admin Dashboard",
    description: "Create a new service in the Index IT Hub admin panel.",
    url: "https://indexithub.com/admin/services/add",
    siteName: "Index IT Hub",
    images: [
      {
        url: "https://indexithub.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Index IT Hub Add Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function AddServicePage() {
  return (
    <ClientOnly>
      <PageContent />
    </ClientOnly>
  );
}

function PageContent() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    image: "FaCog",
    color: "#1D4ED8",
  });

  const [IconComponent, setIconComponent] = useState(() => FaIcons["FaCog"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    const icon = FaIcons[form.image];
    setIconComponent(() => icon || FaIcons["FaCog"]);
  }, [form.image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createService(form);
      router.push("/admin/services");
    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (

      <div className=" mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl  
                      text-gray-800 dark:text-gray-100 transition">
        
        <h1 className="text-2xl font-bold mb-6">Add New Service</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 
                          text-red-700 dark:text-red-300 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg 
                         bg-gray-50 dark:bg-gray-700 
                         border-gray-300 dark:border-gray-600
                         text-gray-800 dark:text-gray-200
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Slug</label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              placeholder="Unique slug for URL"
              className="w-full px-4 py-2 border rounded-lg 
                         bg-gray-50 dark:bg-gray-700 
                         border-gray-300 dark:border-gray-600
                         text-gray-800 dark:text-gray-200
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Short Description</label>
            <textarea
              name="short_description"
              value={form.short_description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Brief summary for the service"
              className="w-full px-4 py-2 border rounded-lg 
                         bg-gray-50 dark:bg-gray-700 
                         border-gray-300 dark:border-gray-600
                         text-gray-800 dark:text-gray-200
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border rounded-lg 
                         bg-gray-50 dark:bg-gray-700 
                         border-gray-300 dark:border-gray-600
                         text-gray-800 dark:text-gray-200
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Icon + Color */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon (react-icons code)
            </label>

            <div className="flex items-center gap-4">
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="e.g. FaRocket"
                className="flex-1 px-4 py-2 border rounded-lg 
                           bg-gray-50 dark:bg-gray-700 
                           border-gray-300 dark:border-gray-600
                           text-gray-800 dark:text-gray-200
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <input
                type="color"
                name="color"
                value={form.color}
                onChange={handleChange}
                className="w-12 h-12 border dark:border-gray-600 rounded-lg cursor-pointer"
              />

              <div className="text-2xl p-2 border dark:border-gray-600 rounded-lg 
                              flex items-center justify-center 
                              bg-gray-50 dark:bg-gray-700">
                <IconComponent color={form.color} />
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter icon name from <code>react-icons/fa</code> and select its color.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/services")}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 
                         text-gray-800 dark:text-gray-100 
                         rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 
                         transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 
                         text-white rounded-lg 
                         hover:bg-blue-700 dark:hover:bg-blue-600 
                         transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Service"}
            </button>
          </div>
        </form>
      </div>
  );
}
