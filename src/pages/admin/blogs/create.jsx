"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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

import Swal from "sweetalert2";
import { createBlog } from "@/pages/api/blogApi";
import AdminLayout from "@/components/admin/AdminLayout";
import DragDropImageUploader from "@/components/admin/DragDropImageUploader";

// ⭐ YOUR DRAG AND DROP COMPONENT

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  const [category, setCategory] = useState("General");
  const [status, setStatus] = useState("draft");
  const [author, setAuthor] = useState("Admin");

  const [image, setImage] = useState(null);       // actual file
  const [previewImg, setPreviewImg] = useState(null); // preview URL

  // -------------------------
  // DARK MODE DETECTION FOR JODIT
  // -------------------------
  const [joditTheme, setJoditTheme] = useState("default");

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setJoditTheme(isDark ? "dark" : "default");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !shortDescription || !description || !image) {
      return Swal.fire("Missing Fields", "All required fields must be filled", "error");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("shortDescription", shortDescription);
    formData.append("description", description);
    formData.append("image", image);

    if (metaTitle) formData.append("metaTitle", metaTitle);
    if (metaDescription) formData.append("metaDescription", metaDescription);
    if (keywords) formData.append("keywords", keywords);

    formData.append("category", category);
    formData.append("status", status);
    formData.append("author", author);

    try {
      await createBlog(formData);
      Swal.fire("Success", "Blog created successfully!", "success");

      setTitle("");
      setShortDescription("");
      setDescription("");
      setImage(null);
      setPreviewImg(null);
      setMetaTitle("");
      setMetaDescription("");
      setKeywords("");
      setCategory("General");
      setStatus("draft");
      setAuthor("Admin");

    } catch (error) {
      Swal.fire("Error", error.message || "Something went wrong", "error");
    }
  };

  return (
      <div className="p-6 flex justify-center">
        <Card className="w-full max-w-3xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Create New Blog
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* TITLE */}
              <div>
                <Label>Blog Title *</Label>
                <Input
                  placeholder="Blog title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* SHORT DESCRIPTION */}
              <div>
                <Label>Short Description *</Label>
                <Textarea
                  placeholder="Short intro..."
                  rows={3}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              {/* ⭐ DRAG & DROP IMAGE UPLOADER ⭐ */}
              <div>
                <Label>Feature Image *</Label>

                <DragDropImageUploader
                  preview={previewImg}
                  onFileSelect={(file, previewUrl) => {
                    setImage(file);
                    setPreviewImg(previewUrl);
                  }}
                  height="180px"
                />
              </div>

              {/* BLOG CONTENT */}
              <div>
                <Label>Blog Content *</Label>

                <div className="border rounded-md dark:bg-[#111]">
                  <JoditEditor
                    value={description}
                    config={{
                      theme: joditTheme,
                      style: {
                        background: joditTheme === "dark" ? "#0f0f0f" : "#fff",
                        color: joditTheme === "dark" ? "#f5f5f5" : "#000",
                      }
                    }}
                    onBlur={(newContent) => setDescription(newContent)}
                  />
                </div>
              </div>

              {/* META TITLE */}
              <div>
                <Label>Meta Title (optional)</Label>
                <Input
                  placeholder="Max 70 characters"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
              </div>

              {/* META DESCRIPTION */}
              <div>
                <Label>Meta Description (optional)</Label>
                <Textarea
                  placeholder="Max 160 characters"
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                />
              </div>

              {/* KEYWORDS */}
              <div>
                <Label>Keywords (comma separated)</Label>
                <Input
                  placeholder="blog, javascript, nextjs"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

              {/* CATEGORY */}
              <div>
                <Label>Category</Label>
                <Input
                  placeholder="e.g. Technology"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              {/* STATUS */}
              <div>
                <Label>Status</Label>
                <select
                  className="border p-2 rounded w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* AUTHOR */}
              <div>
                <Label>Author</Label>
                <Input
                  placeholder="Admin"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              {/* SUBMIT */}
              <Button type="submit" className="w-full">
                Create Blog
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
  );
}
