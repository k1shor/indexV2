// lib/blogApi.js
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/blogs";

export const fetchBlogs = async (query = "") => {
  // query can include ?page=1&search=...
  const res = await fetch(`${BASE_URL}${query}`);
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json(); // expected { success, total, data }
};

export const fetchBlogBySlug = async (slug) => {
  const res = await fetch(`${BASE_URL}/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch blog");
  return res.json();
};

export const fetchBlogById = async (id) => {
  const res = await fetch(`${BASE_URL}/id/${id}`); // if your backend supports fetch by id at /blogs/id/:id
  // If not, you can call GET /blogs and filter or add a dedicated endpoint.
  if (!res.ok) throw new Error("Failed to fetch blog by id");
  return res.json();
};

export const createBlog = async (formData) => {
  const { token } = JSON.parse(localStorage.getItem("auth"));

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });
  if (!res.ok) throw new Error(res.error);
  return res.json();
};

export const updateBlog = async (id, formData) => {
  const { token } = JSON.parse(localStorage.getItem("auth"));

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update blog");
  return res.json();
};

export const deleteBlog = async (id) => {
  const { token } = JSON.parse(localStorage.getItem("auth"));

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  if (!res.ok) throw new Error("Failed to delete blog");
  return res.json();
};
