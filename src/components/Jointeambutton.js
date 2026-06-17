"use client";

import { useState, useEffect } from "react";
import {
  applyToTeam,
  getMyTeamRequest,
  withdrawTeamRequest,
} from "../pages/api/teammemberAPI";
import { isAdminUser } from "../pages/api/userApi";
import { FaLinkedin, FaGithub, FaTimes, FaUsers } from "react-icons/fa";

export default function JoinTeamButton() {
  const [token, setToken] = useState(null); 
  const [myRequest, setMyRequest] = useState(undefined); 
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    position: "",
    bio: "",
    skills: "",
    linkedin: "",
    github: "",
  });

  // Hydrate token from localStorage (safe — only runs client-side)
  useEffect(() => {
    const getToken = () => {
      const stored = localStorage.getItem("auth");
      if (!stored || stored === "undefined" || stored === "null") {
        setToken(false);
        return;
      }
      try {
        const parsed = JSON.parse(stored);
        setToken(parsed?.token || false);
      } catch {
        setToken(false);
      }
    };

    getToken();

    // Re-sync if user logs in/out elsewhere
    window.addEventListener("authChange", getToken);
    window.addEventListener("storage", getToken);
    return () => {
      window.removeEventListener("authChange", getToken);
      window.removeEventListener("storage", getToken);
    };
  }, []);

  // Once we have a token, fetch existing request
  useEffect(() => {
    if (!token) {
      setMyRequest(null);
      return;
    }
    getMyTeamRequest(token).then((res) => {
      setMyRequest(res?.error ? null : res);
    });
  }, [token]);

  // Still hydrating — render nothing to avoid flicker
  if (token === null) return null;

  // Not logged in — public visitors/clients don't see this
  if (!token) return null;

  // Admins already have the "Add Member" button — don't show apply form to them
  if (isAdminUser()) return null;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.position.trim()) {
      setError("Position is required.");
      return;
    }

    setSubmitting(true);
    const payload = {
      position: form.position.trim(),
      bio: form.bio.trim(),
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      linkedin: form.linkedin.trim(),
      github: form.github.trim(),
    };

    const res = await applyToTeam(payload, token);
    setSubmitting(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(res?.message || "Request submitted!");
      setMyRequest(res?.request || { status: "pending", ...payload });
      setShowForm(false);
      setForm({ position: "", bio: "", skills: "", linkedin: "", github: "" });
    }
  };

  const handleWithdraw = async () => {
    if (!confirm("Withdraw your team member request?")) return;
    setWithdrawing(true);
    const res = await withdrawTeamRequest(token);
    setWithdrawing(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    setMyRequest(null);
    setSuccess("Request withdrawn.");
  };

  // ── Pending ───────────────────────────────────────────────────────────────
  if (myRequest?.status === "pending") {
    return (
      <div className="mt-10 max-w-lg mx-auto rounded-2xl border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 p-6 text-center space-y-3">
        <p className="text-2xl">⏳</p>
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">
          Request pending review
        </h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-400">
          Your application as <strong>{myRequest.position}</strong> is waiting
          for admin approval.
        </p>
        <button
          onClick={handleWithdraw}
          disabled={withdrawing}
          className="text-xs text-yellow-600 dark:text-yellow-400 underline hover:no-underline disabled:opacity-50"
        >
          {withdrawing ? "Withdrawing…" : "Withdraw request"}
        </button>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  // ── Approved ──────────────────────────────────────────────────────────────
  if (myRequest?.status === "approved") {
    return (
      <div className="mt-10 max-w-lg mx-auto rounded-2xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-6 text-center space-y-2">
        <p className="text-2xl">🎉</p>
        <h3 className="font-semibold text-green-800 dark:text-green-300">
          You're an official team member!
        </h3>
        <p className="text-sm text-green-700 dark:text-green-400">
          Your profile is now visible on the team section.
        </p>
        {myRequest.adminNote && (
          <p className="text-xs text-green-600 dark:text-green-400 italic">
            "{myRequest.adminNote}"
          </p>
        )}
      </div>
    );
  }

  // ── Rejected ──────────────────────────────────────────────────────────────
  if (myRequest?.status === "rejected") {
    return (
      <div className="mt-10 max-w-lg mx-auto rounded-2xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-6 text-center space-y-3">
        <p className="text-2xl">😔</p>
        <h3 className="font-semibold text-red-800 dark:text-red-300">
          Application not approved
        </h3>
        {myRequest.adminNote && (
          <p className="text-sm text-red-600 dark:text-red-400 italic">
            Admin note: "{myRequest.adminNote}"
          </p>
        )}
        <button
          onClick={() => {
            setMyRequest(null);
            setShowForm(true);
          }}
          className="mt-2 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
        >
          Re-apply
        </button>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  // ── No request yet: button + form ─────────────────────────────────────────
  return (
    <div className="mt-10 text-center">
      {success && !showForm && (
        <p className="mb-4 text-sm text-green-600 dark:text-green-400 font-medium">
          ✓ {success}
        </p>
      )}

      {!showForm ? (
        <button
          onClick={() => {
            setShowForm(true);
            setError("");
            setSuccess("");
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-light text-white font-semibold shadow hover:brightness-110 transition"
        >
          <FaUsers /> Join Our Team
        </button>
      ) : (
        <div className="max-w-lg mx-auto text-left bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 relative">
          <button
            onClick={() => setShowForm(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FaTimes />
          </button>

          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
            Apply to join the team
          </h3>
          <p className="text-xs text-gray-400 mb-5">
            Submit your details — an admin will review your request.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Short bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell us a bit about yourself…"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Skills <span className="text-gray-400">(comma-separated)</span>
              </label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  <FaLinkedin className="text-blue-500" /> LinkedIn URL
                </label>
                <input
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/…"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  <FaGithub /> GitHub URL
                </label>
                <input
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  placeholder="https://github.com/…"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-brand-light hover:brightness-110 transition disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
