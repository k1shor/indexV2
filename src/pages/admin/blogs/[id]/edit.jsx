"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

import { fetchBlogById } from "@/pages/api/blogApi";

// Jodit (no SSR)
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [category, setCategory] = useState("General");
  const [author, setAuthor] = useState("Admin");
  const [keywords, setKeywords] = useState("");

  const [existingImage, setExistingImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [editorTheme, setEditorTheme] = useState("default");

  // Detect dark mode auto
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setEditorTheme(isDark ? "dark" : "default");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // Auto-generate slug
  useEffect(() => {
    if (!title) return;
    setSlug(
      title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    );
  }, [title]);

  // Load blog
  useEffect(() => {
    if (!id) return;
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      setLoading(true);

      const res = await fetchBlogById(id);
      const payload = res.data?.data || res.data || res;

      setTitle(payload.title || "");
      setSlug(payload.slug || "");
      setShortDescription(payload.shortDescription || "");
      setDescription(payload.description || "");
      setStatus(payload.status || "draft");
      setCategory(payload.category || "General");
      setAuthor(payload.author || "Admin");
      setKeywords(
        Array.isArray(payload.keywords)
          ? payload.keywords.join(", ")
          : payload.keywords || ""
      );

      if (payload.image) {
        const imgUrl = payload.image;
        setExistingImage(payload.image);
        setPreview(imgUrl);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to load blog", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!title.trim() || !shortDescription.trim() || !description.trim()) {
      Swal.fire("Validation", "All required fields must be filled", "warning");
      return false;
    }
    if (!existingImage && !imageFile) {
      Swal.fire("Validation", "Featured image is required", "warning");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("slug", slug);
      form.append("shortDescription", shortDescription);
      form.append("description", description);
      form.append("status", status);
      form.append("category", category);
      form.append("author", author);
      form.append("keywords", keywords);

      if (imageFile) form.append("image", imageFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/${id}`,
        { method: "PUT", body: form }
      );

      const json = await res.json();
      if (!res.ok || json.success === false)
        throw new Error(json.message || "Update failed");

      Swal.fire("Success", "Blog updated successfully!", "success").then(() => {
        router.push("/admin/blogs");
      });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
        <div className="p-10 text-center text-gray-500 dark:text-gray-300">
          Loading blog...
        </div>
    );

  return (
      <div className="p-6 flex justify-center">
        <Card className="w-full max-w-3xl shadow-md dark:shadow-lg dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Edit Blog
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title / Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div>
                  <Label>Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <Label>Short Description *</Label>
                <Textarea
                  rows={3}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              {/* Editor */}
              <div>
                <Label>Content *</Label>

                <div
                  className={`rounded-md border dark:border-gray-700 ${
                    editorTheme === "dark" ? "jodit_theme_dark" : ""
                  }`}
                >
                  <JoditEditor
                    value={description}
                    onBlur={(val) => setDescription(val)}
                    config={{
                      height: 350,
                      toolbarAdaptive: true,
                      theme: editorTheme,
                    }}
                  />
                </div>
              </div>

              {/* Category / Status / Author */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>

                <div>
                  <Label>Status</Label>
                  <select
                    className="w-full p-2 rounded-md border dark:bg-gray-900 dark:border-gray-700"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <Label>Author</Label>
                  <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Keywords (comma separated)</Label>
                <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} />
              </div>

              {/* Image */}
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <Label>Featured Image</Label>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                  <p className="text-xs text-gray-500 mt-1">Upload to replace</p>
                </div>

                <div className="w-44">
                  {preview ? (
                    <img
                      src={preview}
                      className="w-44 h-28 object-cover rounded-md border dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-44 h-28 rounded-md bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/admin/blogs")}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
