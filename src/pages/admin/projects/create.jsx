"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllServices } from "@/pages/api/servicesAPI";
import { createProject } from "@/pages/api/projectsAPI";

export default function CreateProject() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    project_title: "",
    category: "",
    description: "",
    technologies: "",
    project_image: null,
    link: "",
    client: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await getAllServices();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories");
      }
    };
    getCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "project_image") {
      setFormData({ ...formData, project_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const projectData = new FormData();
      for (let key in formData) {
        if (formData[key]) projectData.append(key, formData[key]);
      }
      await createProject(projectData);
      alert("Project created successfully!");
      router.push("/admin/projects");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="p-8 mx-auto dark:bg-gray-800 rounded-lg  transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Add New Project
        </h1>

        {error && (
          <p className="text-red-600 dark:text-red-400 mb-4 font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Title */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Project Title
            </label>
            <input
              type="text"
              name="project_title"
              value={formData.project_title}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              rows={5}
              required
            ></textarea>
          </div>

          {/* Technologies */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Technologies
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="e.g. React, Node.js, MongoDB"
            />
          </div>

          {/* Project Image */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Project Image
            </label>
            <input
              type="file"
              name="project_image"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Project Link */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Project Link
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="https://example.com"
            />
          </div>

          {/* Client */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Client
            </label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Create Project"}
          </button>
        </form>
      </div>
  );
}
