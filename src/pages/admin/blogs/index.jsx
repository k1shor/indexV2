// pages/admin/blogs/index.jsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { fetchBlogs, deleteBlog } from "@/pages/api/blogApi";
import ConfirmModal from "@/components/admin/ConfirmModal";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminBlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchBlogs();
      setBlogs(res.data || res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return load();

    const filtered = (blogs || []).filter((b) =>
      (b.title || "").toLowerCase().includes(query.toLowerCase()) ||
      (b.shortDescription || "").toLowerCase().includes(query.toLowerCase()) ||
      (b.slug || "").toLowerCase().includes(query.toLowerCase())
    );

    setBlogs(filtered);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const doDelete = async () => {
    try {
      await deleteBlog(deleteId);
      setModalOpen(false);
      setDeleteId(null);
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  return (
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Manage Blogs</h1>
          <Link
            href="/admin/blogs/create"
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow"
          >
            + New Blog
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, slug or description"
              className="flex-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
            >
              Search
            </button>
            <button
              type="button"
              onClick={load}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
            >
              Reset
            </button>
          </form>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-gray-700 dark:text-gray-300">Loading...</div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
                  {["Image", "Title", "Slug", "Status", "Created", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {blogs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500 dark:text-gray-400">
                      No blogs found
                    </td>
                  </tr>
                )}

                {blogs.map((b) => (
                  <tr
                    key={b._id || b.id || b.slug}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/uploads/${b.image}`}
                        alt=""
                        className="w-20 h-12 object-cover rounded-md border border-gray-300 dark:border-gray-700"
                      />
                    </td>

                    <td className="px-4 py-3 text-gray-900 dark:text-gray-200">{b.title}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{b.slug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          b.status === "published"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">

                        <button
                          onClick={() => router.push(`/blog/${b.slug}`)}
                          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                        >
                          View
                        </button>

                        <button
                          onClick={() => router.push(`/admin/blogs/${b._id || b.id}/edit`)}
                          className="px-3 py-1 rounded bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 text-yellow-800 dark:text-yellow-200"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => confirmDelete(b._id || b.id)}
                          className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        <ConfirmModal
          open={modalOpen}
          title="Delete Blog"
          onConfirm={doDelete}
          onCancel={() => setModalOpen(false)}
        >
          Are you sure you want to delete this blog? This action cannot be undone.
        </ConfirmModal>
      </div>
  );
}
