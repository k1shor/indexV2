"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { deleteService, getAllServices } from "@/pages/api/servicesAPI";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  return (
      <div className="text-gray-800 dark:text-gray-100 transition-colors duration-300">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Services</h1>

          <Link
            href="/admin/services/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 
                       text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 
                       transition"
          >
            <FaPlus /> Add Service
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No services found.</p>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="text-left p-4 border-b dark:border-gray-600">Title</th>
                  <th className="text-left p-4 border-b dark:border-gray-600">Description</th>
                  <th className="text-left p-4 border-b dark:border-gray-600">Actions</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service) => (
                  <tr
                    key={service._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="p-4 border-b dark:border-gray-700">
                      {service.title}
                    </td>

                    <td className="p-4 border-b text-gray-600 dark:text-gray-300 dark:border-gray-700">
                      {service.description?.slice(0, 50)}...
                    </td>

                    <td className="p-4 border-b dark:border-gray-700 flex gap-3">
                      <Link
                        href={`/admin/services/edit/${service._id}`}
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white 
                                   rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-400 
                                   transition"
                      >
                        <FaEdit /> Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(service._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white 
                                   rounded-lg hover:bg-red-600 dark:hover:bg-red-400 
                                   transition"
                      >
                        <FaTrash /> Delete
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
