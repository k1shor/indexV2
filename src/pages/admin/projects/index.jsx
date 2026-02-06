"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { deleteProject, getAllProjects } from "@/pages/api/projectsAPI";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };
    getProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(id);
      setProjects(projects.filter((proj) => proj._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting project: " + err.message);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600 dark:text-gray-300">
        Loading projects...
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-600 dark:text-red-400">
        Error: {error}
      </div>
    );

  return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Projects
        </h1>

        <Link
          href="/admin/projects/create"
          className="bg-green-600 text-white px-5 py-2 rounded-md mb-6 inline-block hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors"
        >
          Add Project
        </Link>

        {projects.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 mt-4">
            No projects found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-gray-800 dark:text-gray-200">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="border px-4 py-2 text-left">Title</th>
                  <th className="border px-4 py-2 text-left">Client</th>
                  <th className="border px-4 py-2 text-left">Category</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj, index) => (
                  <tr
                    key={proj._id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-900"
                    } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                  >
                    <td className="border px-4 py-2">{proj.project_title}</td>
                    <td className="border px-4 py-2">{proj.client || "N/A"}</td>
                    <td className="border px-4 py-2">
                      {proj.category?.name || "N/A"}
                    </td>
                    <td className="border px-4 py-2">{proj.status || "Active"}</td>
                    <td className="border px-4 py-2 space-x-3">
                      <Link
                        href={`/admin/projects/edit/${proj._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(proj._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  );
}
