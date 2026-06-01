"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import {
  addCareer,
  deleteCareer,
  getAdminCareers,
  updateCareer,
} from "@/pages/api/careerAPI";
import {
  deleteAppliedCareer,
  getAppliedCareer,
  updateAppliedCareer,
} from "@/pages/api/applyCareerAPI";

const emptyCareerForm = {
  career_title: "",
  vacancyNumber: 1,
  offered_salary: "",
  location: "Remote",
  type: "full-time",
  posted_date: "",
  deadline: "",
  job_description: "",
  qualification: "",
  isActive: true,
};

const applicationStatuses = ["new", "reviewing", "shortlisted", "rejected", "hired"];

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.careers)) return payload.careers;
  if (Array.isArray(payload?.applications)) return payload.applications;
  return [];
};

const formatDate = (value) => {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const toDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const money = (value) => {
  const amount = Number(value);
  return amount ? `NPR ${amount.toLocaleString()}` : "Not set";
};

const getApplicantName = (application) =>
  `${application.first_name || ""} ${application.last_name || ""}`.trim() || "Applicant";

const getCareerTitle = (career) => career?.career_title || "Untitled role";

export default function AdminCareersPage() {
  const [careers, setCareers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [careerForm, setCareerForm] = useState(emptyCareerForm);
  const [editingId, setEditingId] = useState("");
  const [selectedCareerId, setSelectedCareerId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const careerMap = useMemo(
    () => new Map(careers.map((career) => [career._id, career])),
    [careers]
  );

  const filteredApplications = useMemo(() => {
    if (selectedCareerId === "all") return applications;
    return applications.filter((application) => {
      const careerId = application.career?._id || application.career;
      return careerId === selectedCareerId;
    });
  }, [applications, selectedCareerId]);

  const stats = useMemo(
    () => [
      ["Total roles", careers.length, BriefcaseBusiness],
      ["Visible roles", careers.filter((career) => career.isActive !== false).length, Eye],
      ["Hidden roles", careers.filter((career) => career.isActive === false).length, EyeOff],
      ["Applications", applications.length, UsersRound],
    ],
    [applications.length, careers]
  );

  const clearStatus = () => {
    setMessage("");
    setError("");
  };

  const loadCareers = async () => {
    try {
      setLoading(true);
      clearStatus();
      const response = await getAdminCareers();
      setCareers(toArray(response));
    } catch (err) {
      setError(err.message || "Failed to load careers.");
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      setApplicationLoading(true);
      const response = await getAppliedCareer();
      setApplications(toArray(response));
    } catch (err) {
      setError(err.message || "Failed to load applications.");
    } finally {
      setApplicationLoading(false);
    }
  };

  useEffect(() => {
    loadCareers();
    loadApplications();
  }, []);

  const updateForm = (field, value) => {
    setCareerForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setCareerForm(emptyCareerForm);
    setEditingId("");
  };

  const editCareer = (career) => {
    setEditingId(career._id);
    setCareerForm({
      career_title: career.career_title || "",
      vacancyNumber: career.vacancyNumber || 1,
      offered_salary: career.offered_salary || "",
      location: career.location || "Remote",
      type: career.type || "full-time",
      posted_date: toDateInput(career.posted_date),
      deadline: toDateInput(career.deadline),
      job_description: career.job_description || "",
      qualification: career.qualification || "",
      isActive: career.isActive !== false,
    });
    clearStatus();
  };

  const saveCareer = async (event) => {
    event.preventDefault();
    clearStatus();
    setSaving(true);

    try {
      if (editingId) {
        await updateCareer(editingId, careerForm);
        setMessage("Career updated successfully.");
      } else {
        await addCareer(careerForm);
        setMessage("Career created successfully.");
      }
      resetForm();
      await loadCareers();
    } catch (err) {
      setError(err.message || "Failed to save career.");
    } finally {
      setSaving(false);
    }
  };

  const toggleCareerVisibility = async (career) => {
    clearStatus();
    try {
      await updateCareer(career._id, { isActive: career.isActive === false });
      setMessage(career.isActive === false ? "Career enabled on public page." : "Career hidden from public page.");
      await loadCareers();
    } catch (err) {
      setError(err.message || "Failed to update career visibility.");
    }
  };

  const removeCareer = async (career) => {
    if (!window.confirm(`Delete "${getCareerTitle(career)}"?`)) return;
    clearStatus();

    try {
      await deleteCareer(career._id);
      setMessage("Career deleted successfully.");
      if (editingId === career._id) resetForm();
      await loadCareers();
      await loadApplications();
    } catch (err) {
      setError(err.message || "Failed to delete career.");
    }
  };

  const updateApplicationStatus = async (application, status) => {
    clearStatus();
    try {
      const updated = await updateAppliedCareer(application._id, { status });
      setApplications((items) =>
        items.map((item) => (item._id === updated._id ? updated : item))
      );
      setMessage("Application status updated.");
    } catch (err) {
      setError(err.message || "Failed to update application status.");
    }
  };

  const removeApplication = async (application) => {
    if (!window.confirm(`Delete application from ${getApplicantName(application)}?`)) return;
    clearStatus();

    try {
      await deleteAppliedCareer(application._id);
      setApplications((items) => items.filter((item) => item._id !== application._id));
      setMessage("Application deleted successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete application.");
    }
  };

  return (
    <div className="text-gray-800 dark:text-gray-100">
      <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <BriefcaseBusiness className="h-6 w-6 text-brand-light" />
            Career Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Create roles, control public visibility, and review applications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            loadCareers();
            loadApplications();
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

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Roles</h2>
            {loading && <Loader2 className="h-5 w-5 animate-spin text-brand-light" />}
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Deadline</th>
                  <th className="px-4 py-3 font-semibold">Visibility</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {!loading && careers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No careers found. Create the first role from the form.
                    </td>
                  </tr>
                )}

                {careers.map((career) => (
                  <tr key={career._id} className="bg-white dark:bg-gray-800/60">
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold">{getCareerTitle(career)}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {career.location || "Remote"} · {career.type || "full-time"} · {money(career.offered_salary)}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top">{formatDate(career.deadline)}</td>
                    <td className="px-4 py-4 align-top">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                          career.isActive === false
                            ? "border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
                        }`}
                      >
                        {career.isActive === false ? "Hidden" : "Visible"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right align-top">
                      <div className="inline-flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => editCareer(career)}
                          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCareerVisibility(career)}
                          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                          {career.isActive === false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          {career.isActive === false ? "Enable" : "Disable"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCareer(career)}
                          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/40">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              {editingId ? <Edit3 className="h-5 w-5 text-brand-light" /> : <Plus className="h-5 w-5 text-brand-light" />}
              {editingId ? "Edit Role" : "Create Role"}
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

          <form onSubmit={saveCareer} className="grid gap-4">
            <label className="grid gap-1 text-sm font-medium">
              Career Title
              <input
                value={careerForm.career_title}
                onChange={(event) => updateForm("career_title", event.target.value)}
                required
                className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">
                Openings
                <input
                  type="number"
                  min="1"
                  value={careerForm.vacancyNumber}
                  onChange={(event) => updateForm("vacancyNumber", event.target.value)}
                  className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Salary
                <input
                  type="number"
                  min="0"
                  value={careerForm.offered_salary}
                  onChange={(event) => updateForm("offered_salary", event.target.value)}
                  className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">
                Location
                <input
                  value={careerForm.location}
                  onChange={(event) => updateForm("location", event.target.value)}
                  className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Type
                <select
                  value={careerForm.type}
                  onChange={(event) => updateForm("type", event.target.value)}
                  className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="remote">Remote</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">
                Posted Date
                <input
                  type="date"
                  value={careerForm.posted_date}
                  onChange={(event) => updateForm("posted_date", event.target.value)}
                  className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Deadline
                <input
                  type="date"
                  value={careerForm.deadline}
                  onChange={(event) => updateForm("deadline", event.target.value)}
                  className="min-h-11 rounded-lg border border-gray-300 px-3 outline-none focus:border-brand-light dark:border-gray-600"
                />
              </label>
            </div>

            <label className="grid gap-1 text-sm font-medium">
              Job Description
              <textarea
                rows={4}
                value={careerForm.job_description}
                onChange={(event) => updateForm("job_description", event.target.value)}
                required
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-brand-light dark:border-gray-600"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium">
              Qualifications
              <textarea
                rows={4}
                value={careerForm.qualification}
                onChange={(event) => updateForm("qualification", event.target.value)}
                required
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-brand-light dark:border-gray-600"
              />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium dark:border-gray-700 dark:bg-gray-800">
              Visible on public Career page
              <input
                type="checkbox"
                checked={careerForm.isActive}
                onChange={(event) => updateForm("isActive", event.target.checked)}
                className="h-5 w-5 accent-brand-light"
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-light px-4 py-2 font-semibold text-slate-950 transition hover:bg-[#4F96EE] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Save Changes" : "Create Career"}
            </button>
          </form>
        </aside>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-5 w-5 text-brand-light" />
            Applications
            {applicationLoading && <Loader2 className="h-4 w-4 animate-spin text-brand-light" />}
          </h2>
          <select
            value={selectedCareerId}
            onChange={(event) => setSelectedCareerId(event.target.value)}
            className="min-h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-brand-light dark:border-gray-600"
          >
            <option value="all">All roles</option>
            {careers.map((career) => (
              <option key={career._id} value={career._id}>
                {getCareerTitle(career)}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100">
              <tr>
                <th className="px-4 py-3 font-semibold">Applicant</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Experience</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {!applicationLoading && filteredApplications.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No applications found.
                  </td>
                </tr>
              )}

              {filteredApplications.map((application) => {
                const careerId = application.career?._id || application.career;
                const career = careerMap.get(careerId);
                return (
                  <tr key={application._id} className="bg-white dark:bg-gray-800/60">
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold">{getApplicantName(application)}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{application.email}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{application.phone_number}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      {application.career?.career_title || career?.career_title || "General application"}
                    </td>
                    <td className="max-w-xs px-4 py-4 align-top text-gray-600 dark:text-gray-300">
                      <p className="line-clamp-3">{application.experience}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <select
                        value={application.status || "new"}
                        onChange={(event) => updateApplicationStatus(application, event.target.value)}
                        className="min-h-9 rounded-lg border border-gray-300 px-2 text-sm outline-none focus:border-brand-light dark:border-gray-600"
                      >
                        {applicationStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-right align-top">
                      <button
                        type="button"
                        onClick={() => removeApplication(application)}
                        className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
