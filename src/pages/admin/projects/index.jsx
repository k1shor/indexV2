"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  FolderKanban,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCcw,
  Save,
  Star,
  Trash2,
  X,
} from "lucide-react";
import {
  createProject,
  deleteProject,
  getAdminProjects,
  updateProject,
} from "@/pages/api/projectsAPI";
import { getAllServices } from "@/pages/api/servicesAPI";

const emptyProjectForm = {
  title: "",
  slug: "",
  category: "",
  description: "",
  technologies: "",
  images: "",
  clientName: "",
  clientWebsite: "",
  demo: "",
  repository: "",
  caseStudy: "",
  status: "completed",
  featured: false,
  isActive: true,
};

const statusOptions = ["completed", "ongoing", "paused"];

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.projects)) return payload.projects;
  if (Array.isArray(payload?.services)) return payload.services;
  return [];
};

const firstFrom = (...values) =>
  values
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .find(Boolean);

const labelFrom = (value, fallback = "") => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.name || value.title || value.label || fallback;
};

const getProjectTitle = (project) =>
  project?.title || project?.project_title || project?.name || "Untitled project";

const getProjectImage = (project) => {
  const image = firstFrom(project?.images, project?.project_image, project?.image, project?.thumbnail);
  if (!image) return "";
  return typeof image === "object" ? image.url || image.src || "" : String(image);
};

const getProjectDemo = (project) =>
  project?.links?.demo || project?.demo || project?.preview || project?.link || "";

const getProjectTechnologies = (project) => {
  const value = project?.technologies || project?.language || project?.tools || "";
  return Array.isArray(value) ? value.join(", ") : String(value || "");
};

const getProjectStatus = (project) => {
  const status = String(project?.status || "completed").toLowerCase();
  return statusOptions.includes(status) ? status : "completed";
};

const truncate = (value = "", limit = 120) => {
  const text = String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const stats = useMemo(
    () => [
      ["Total projects", projects.length, FolderKanban],
      ["Visible", projects.filter((project) => project.isActive !== false).length, Eye],
      ["Hidden", projects.filter((project) => project.isActive === false).length, EyeOff],
      ["Featured", projects.filter((project) => project.featured).length, Star],
    ],
    [projects]
  );

  const serviceMap = useMemo(
    () => new Map(services.map((service) => [service._id, service])),
    [services]
  );

  const clearStatus = () => {
    setMessage("");
    setError("");
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      clearStatus();
      const response = await getAdminProjects();
      setProjects(toArray(response));
    } catch (err) {
      setError(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      setServiceLoading(true);
      const response = await getAllServices();
      setServices(toArray(response));
    } catch (err) {
      setError(err.message || "Failed to load services.");
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    loadServices();
  }, []);

  const updateForm = (field, value) => {
    setProjectForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setProjectForm(emptyProjectForm);
    setEditingId("");
  };

  const editProject = (project) => {
    const categoryId = project.category?._id || project.category || "";
    setEditingId(project._id);
    setProjectForm({
      title: project.title || project.project_title || "",
      slug: project.slug || "",
      category: categoryId,
      description: project.description || project.short_description || "",
      technologies: getProjectTechnologies(project),
      images: getProjectImage(project),
      clientName: labelFrom(project.client),
      clientWebsite: project.client?.website || "",
      demo: getProjectDemo(project),
      repository: project.links?.repository || project.repository || "",
      caseStudy: project.links?.caseStudy || project.caseStudy || "",
      status: getProjectStatus(project),
      featured: Boolean(project.featured),
      isActive: project.isActive !== false,
    });
    clearStatus();
  };

  const buildPayload = () => ({
    title: projectForm.title,
    slug: projectForm.slug,
    category: projectForm.category,
    description: projectForm.description,
    technologies: projectForm.technologies,
    images: projectForm.images,
    clientName: projectForm.clientName,
    clientWebsite: projectForm.clientWebsite,
    demo: projectForm.demo,
    repository: projectForm.repository,
    caseStudy: projectForm.caseStudy,
    status: projectForm.status,
    featured: projectForm.featured,
    isActive: projectForm.isActive,
  });

  const saveProject = async (event) => {
    event.preventDefault();
    clearStatus();
    setSaving(true);

    try {
      if (editingId) {
        await updateProject(editingId, buildPayload());
        setMessage("Project updated successfully.");
      } else {
        await createProject(buildPayload());
        setMessage("Project created successfully.");
      }
      resetForm();
      await loadProjects();
    } catch (err) {
      setError(err.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const toggleProjectVisibility = async (project) => {
    clearStatus();
    try {
      await updateProject(project._id, { isActive: project.isActive === false });
      setMessage(project.isActive === false ? "Project enabled on public page." : "Project hidden from public page.");
      await loadProjects();
    } catch (err) {
      setError(err.message || "Failed to update project visibility.");
    }
  };

  const toggleFeatured = async (project) => {
    clearStatus();
    try {
      await updateProject(project._id, { featured: !project.featured });
      setMessage(project.featured ? "Project removed from featured." : "Project marked as featured.");
      await loadProjects();
    } catch (err) {
      setError(err.message || "Failed to update featured state.");
    }
  };

  const removeProject = async (project) => {
    if (!window.confirm(`Delete "${getProjectTitle(project)}"?`)) return;
    clearStatus();

    try {
      await deleteProject(project._id);
      setMessage("Project deleted successfully.");
      if (editingId === project._id) resetForm();
      await loadProjects();
    } catch (err) {
      setError(err.message || "Failed to delete project.");
    }
  };

  return (
    <div className="text-gray-800 dark:text-gray-100">
      <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <FolderKanban className="h-6 w-6 text-brand-light" />
            Project Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Create projects, edit details, and control public visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            loadProjects();
            loadServices();
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {(message || error) && (
        <div
          className={`mt-5 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
          }`}
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4" />
          <span>{error || message}</span>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <div key={label} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
            <Icon className="h-5 w-5 text-brand-light" />
            <p className="mt-3 text-2xl font-bold">{value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Projects</h2>
            {loading && <Loader2 className="h-5 w-5 animate-spin text-brand-light" />}
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Project</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Visibility</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {!loading && projects.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No projects found. Create the first project from the form.
                    </td>
                  </tr>
                )}

                {projects.map((project) => {
                  const categoryId = project.category?._id || project.category;
                  const category = serviceMap.get(categoryId);
                  return (
                    <tr key={project._id} className="bg-white dark:bg-gray-800/60">
                      <td className="px-4 py-4 align-top">
                        <div className="flex gap-3">
                          <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                            {getProjectImage(project) ? (
                              <img src={getProjectImage(project)} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold">{getProjectTitle(project)}</p>
                            <p className="mt-1 line-clamp-2 max-w-sm text-xs text-gray-500 dark:text-gray-400">
                              {truncate(project.description || project.client?.name || project.client)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">{project.category?.title || category?.title || "Unassigned"}</td>
                      <td className="px-4 py-4 align-top capitalize">{getProjectStatus(project)}</td>
                      <td className="px-4 py-4 align-top">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                            project.isActive === false
                              ? "border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
                          }`}
                        >
                          {project.isActive === false ? "Hidden" : "Visible"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right align-top">
                        <div className="inline-flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => editProject(project)}
                            className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleProjectVisibility(project)}
                            className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            {project.isActive === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            {project.isActive === false ? "Enable" : "Disable"}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleFeatured(project)}
                            className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            <Star className={`h-4 w-4 ${project.featured ? "fill-brand-light text-brand-light" : ""}`} />
                            {project.featured ? "Unfeature" : "Feature"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeProject(project)}
                            className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/40">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              {editingId ? <Edit3 className="h-5 w-5 text-brand-light" /> : <Plus className="h-5 w-5 text-brand-light" />}
              {editingId ? "Edit Project" : "Create Project"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={saveProject} className="grid gap-4">
            <label className="grid gap-1 text-sm font-medium">
              Project Title
              <input
                value={projectForm.title}
                onChange={(event) => updateForm("title", event.target.value)}
                required
                className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium">
              Slug
              <input
                value={projectForm.slug}
                onChange={(event) => updateForm("slug", event.target.value)}
                placeholder="Auto-generated if left blank"
                className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium">
              Service Category
              <select
                value={projectForm.category}
                onChange={(event) => updateForm("category", event.target.value)}
                required
                className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
              >
                <option value="">{serviceLoading ? "Loading services..." : "Select service"}</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-sm font-medium">
              Description
              <textarea
                rows={4}
                value={projectForm.description}
                onChange={(event) => updateForm("description", event.target.value)}
                required
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-brand-light dark:border-gray-600"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium">
              Technologies
              <input
                value={projectForm.technologies}
                onChange={(event) => updateForm("technologies", event.target.value)}
                placeholder="Next.js, Node.js, MongoDB"
                className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium">
              Image URL
              <input
                value={projectForm.images}
                onChange={(event) => updateForm("images", event.target.value)}
                placeholder="https://..."
                className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">
                Client Name
                <input
                  value={projectForm.clientName}
                  onChange={(event) => updateForm("clientName", event.target.value)}
                  className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Client Website
                <input
                  value={projectForm.clientWebsite}
                  onChange={(event) => updateForm("clientWebsite", event.target.value)}
                  className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
                />
              </label>
            </div>

            <label className="grid gap-1 text-sm font-medium">
              Demo URL
              <input
                value={projectForm.demo}
                onChange={(event) => updateForm("demo", event.target.value)}
                className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">
                Repository URL
                <input
                  value={projectForm.repository}
                  onChange={(event) => updateForm("repository", event.target.value)}
                  className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Case Study URL
                <input
                  value={projectForm.caseStudy}
                  onChange={(event) => updateForm("caseStudy", event.target.value)}
                  className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">
                Status
                <select
                  value={projectForm.status}
                  onChange={(event) => updateForm("status", event.target.value)}
                  className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium dark:border-gray-700 dark:bg-gray-800">
                Featured
                <input
                  type="checkbox"
                  checked={projectForm.featured}
                  onChange={(event) => updateForm("featured", event.target.checked)}
                  className="h-5 w-5 accent-brand-light"
                />
              </label>
            </div>

            <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium dark:border-gray-700 dark:bg-gray-800">
              Visible on public Projects page
              <input
                type="checkbox"
                checked={projectForm.isActive}
                onChange={(event) => updateForm("isActive", event.target.checked)}
                className="h-5 w-5 accent-brand-light"
              />
            </label>

            <button
              type="submit"
              disabled={saving || serviceLoading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-light px-4 py-2 font-semibold text-slate-950 transition hover:bg-[#4F96EE] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Save Changes" : "Create Project"}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
