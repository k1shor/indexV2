"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { API } from "@/consts";

const roleLabels = {
  0: "User",
  1: "Admin",
  2: "Super Admin",
};

const emptyStats = {
  total: 0,
  verified: 0,
  admins: 0,
  pending: 0,
};

const getStoredToken = () => {
  if (typeof window === "undefined") return "";

  const auth = localStorage.getItem("auth");
  if (auth) {
    try {
      return JSON.parse(auth)?.token || "";
    } catch {
      return "";
    }
  }

  return localStorage.getItem("token") || "";
};

const getAuthHeaders = (contentType = "application/json") => {
  const token = getStoredToken();
  const headers = {};

  if (contentType) headers["Content-Type"] = contentType;
  if (token) headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

  return headers;
};

const requestJson = async (url, options = {}) => {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
};

const getInitials = (user) => {
  const name = `${user.firstname || ""} ${user.lastname || ""}`.trim() || user.username || user.email || "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const mapUserToForm = (user) => ({
  firstname: user.firstname || "",
  lastname: user.lastname || "",
  username: user.username || "",
  email: user.email || "",
  gender: user.gender || "",
  age: user.age || "",
  phonenumber: user.phonenumber || "",
  position: user.position || "",
  about: user.about || "",
  permanentAddress: user.address?.permanentAddress || "",
  tempAddress: Array.isArray(user.address?.tempAddress)
    ? user.address.tempAddress.join(", ")
    : "",
});

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const totalPages = pagination.pages || 1;

  const visibleStats = useMemo(() => {
    if (stats.total || stats.verified || stats.admins || stats.pending) return stats;

    return users.reduce(
      (summary, user) => ({
        total: summary.total + 1,
        verified: summary.verified + (user.isVerified ? 1 : 0),
        admins: summary.admins + (Number(user.role) >= 1 ? 1 : 0),
        pending: summary.pending + (!user.isVerified ? 1 : 0),
      }),
      { ...emptyStats }
    );
  }, [stats, users]);

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        search: activeSearch,
        page: String(page),
        limit: String(limit),
      });

      const data = await requestJson(`${API}/user/getallusers?${params.toString()}`, {
        headers: getAuthHeaders(null),
      });

      const list = Array.isArray(data.users)
        ? data.users
        : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];

      setUsers(list);
      setPagination(data.pagination || { total: list.length, page, limit, pages: 1 });
      setStats(data.stats || emptyStats);
    } catch (err) {
      setUsers([]);
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [activeSearch, page, limit]);

  const setStatus = (text, isError = false) => {
    setMessage(isError ? "" : text);
    setError(isError ? text : "");
  };

  const updateUserInList = (updatedUser) => {
    setUsers((current) => current.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setActiveSearch(search.trim());
  };

  const handleReset = () => {
    setSearch("");
    setActiveSearch("");
    setPage(1);
  };

  const handleRoleChange = async (user, role) => {
    const nextRole = Number(role);
    if (nextRole === Number(user.role)) return;

    const confirmed = window.confirm(`Change ${user.username || user.email} to ${roleLabels[nextRole]}?`);
    if (!confirmed) return;

    setWorkingId(user._id);
    setStatus("");

    try {
      const updated = await requestJson(`${API}/user/changerole/${user._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ role: nextRole }),
      });

      updateUserInList(updated.user || updated);
      setStatus("User role updated.");
      await loadUsers();
    } catch (err) {
      setStatus(err.message || "Failed to update role.", true);
    } finally {
      setWorkingId("");
    }
  };

  const handleVerify = async (user) => {
    setWorkingId(user._id);
    setStatus("");

    try {
      const updated = await requestJson(`${API}/user/verifyuserbyadmin/${user._id}`, {
        method: "PUT",
        headers: getAuthHeaders(null),
      });

      updateUserInList(updated.user || updated);
      setStatus("User verified.");
      await loadUsers();
    } catch (err) {
      setStatus(err.message || "Failed to verify user.", true);
    } finally {
      setWorkingId("");
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Delete ${user.username || user.email}? This cannot be undone.`);
    if (!confirmed) return;

    setWorkingId(user._id);
    setStatus("");

    try {
      await requestJson(`${API}/user/deleteuser/${user._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(null),
      });

      setStatus("User deleted.");
      await loadUsers();
    } catch (err) {
      setStatus(err.message || "Failed to delete user.", true);
    } finally {
      setWorkingId("");
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setEditForm(mapUserToForm(user));
    setStatus("");
  };

  const closeEdit = () => {
    setEditingUser(null);
    setEditForm(null);
  };

  const handleEditChange = (field, value) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!editingUser || !editForm) return;

    setWorkingId(editingUser._id);
    setStatus("");

    try {
      const payload = {
        firstname: editForm.firstname.trim(),
        lastname: editForm.lastname.trim(),
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        gender: editForm.gender || undefined,
        age: editForm.age === "" ? undefined : Number(editForm.age),
        phonenumber: editForm.phonenumber === "" ? undefined : Number(editForm.phonenumber),
        position: editForm.position.trim(),
        about: editForm.about.trim(),
        address: {
          permanentAddress: editForm.permanentAddress.trim(),
          tempAddress: editForm.tempAddress
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      };

      const data = await requestJson(`${API}/user/updateuser/${editingUser._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      updateUserInList(data.user || data);
      setStatus("User profile updated.");
      closeEdit();
    } catch (err) {
      setStatus(err.message || "Failed to update user.", true);
    } finally {
      setWorkingId("");
    }
  };

  return (
    <div className="text-gray-800 dark:text-gray-100">
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 dark:border-gray-700 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Users className="h-6 w-6 text-brand-light dark:text-blue-400" />
            User Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Manage accounts, verification, and admin access.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, role, position"
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm outline-none transition focus:border-brand-light focus:ring-2 focus:ring-[#78a6f2]/20 dark:border-gray-600 dark:bg-gray-900 dark:focus:ring-blue-900/40"
            />
          </label>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-light px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-[#4F96EE] dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total users", visibleStats.total, Users],
          ["Verified", visibleStats.verified, CheckCircle2],
          ["Admins", visibleStats.admins, ShieldCheck],
          ["Pending", visibleStats.pending, UserCheck],
        ].map(([label, value, Icon]) => (
          <div key={label} className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
              <Icon className="h-4 w-4 text-brand-light dark:text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
          </div>
        ))}
      </div>

      {(message || error) && (
        <div
          className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto border-collapse text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100">
            <tr>
              {['User', 'Contact', 'Role', 'Status', 'Joined', 'Actions'].map((heading) => (
                <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center text-gray-500 dark:text-gray-300">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading users...
                  </span>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center text-gray-500 dark:text-gray-300">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img src={user.image} alt="" className="h-11 w-11 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#78a6f2]/15 font-semibold text-brand-light dark:bg-blue-900/50 dark:text-blue-200">
                          {getInitials(user)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {[user.firstname, user.lastname].filter(Boolean).join(" ") || user.username || "Unnamed user"}
                        </div>
                        <div className="truncate text-xs text-gray-500 dark:text-gray-400">@{user.username || "user"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{user.email}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.phonenumber || user.position || "-"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={Number(user.role || 0)}
                      onChange={(event) => handleRoleChange(user, event.target.value)}
                      disabled={workingId === user._id}
                      className="min-h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-light dark:border-gray-600 dark:bg-gray-900"
                    >
                      <option value={0}>User</option>
                      <option value={1}>Admin</option>
                      <option value={2}>Super Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.isVerified
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
                      }`}
                    >
                      {user.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {!user.isVerified && (
                        <button
                          type="button"
                          onClick={() => handleVerify(user)}
                          disabled={workingId === user._id}
                          className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          Verify
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => openEdit(user)}
                        className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-yellow-600"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        disabled={workingId === user._id}
                        className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing page {pagination.page || page} of {totalPages} ({pagination.total || users.length} users)
        </div>
        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(event) => {
              setLimit(Number(event.target.value));
              setPage(1);
            }}
            className="min-h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
          </select>
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            disabled={page <= 1 || loading}
            className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
            disabled={page >= totalPages || loading}
            className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {editingUser && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <form
            onSubmit={handleSaveEdit}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-900"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold">Edit User</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Update profile details for {editingUser.email}.</p>
              </div>
              <button
                type="button"
                onClick={closeEdit}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 transition hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["firstname", "First name"],
                ["lastname", "Last name"],
                ["username", "Username"],
                ["email", "Email"],
                ["phonenumber", "Phone"],
                ["position", "Position"],
                ["age", "Age"],
                ["permanentAddress", "Permanent address"],
              ].map(([field, label]) => (
                <label key={field} className="space-y-1 text-sm font-medium">
                  <span>{label}</span>
                  <input
                    value={editForm[field]}
                    onChange={(event) => handleEditChange(field, event.target.value)}
                    type={field === "email" ? "email" : field === "age" || field === "phonenumber" ? "number" : "text"}
                    className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-brand-light dark:border-gray-600 dark:bg-gray-950"
                  />
                </label>
              ))}

              <label className="space-y-1 text-sm font-medium">
                <span>Gender</span>
                <select
                  value={editForm.gender}
                  onChange={(event) => handleEditChange("gender", event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-brand-light dark:border-gray-600 dark:bg-gray-950"
                >
                  <option value="">Not set</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </label>

              <label className="space-y-1 text-sm font-medium md:col-span-2">
                <span>Temporary addresses</span>
                <input
                  value={editForm.tempAddress}
                  onChange={(event) => handleEditChange("tempAddress", event.target.value)}
                  placeholder="Separate multiple addresses with commas"
                  className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-brand-light dark:border-gray-600 dark:bg-gray-950"
                />
              </label>

              <label className="space-y-1 text-sm font-medium md:col-span-2">
                <span>About</span>
                <textarea
                  value={editForm.about}
                  onChange={(event) => handleEditChange("about", event.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-brand-light dark:border-gray-600 dark:bg-gray-950"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEdit}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-4 py-2 font-medium transition hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={workingId === editingUser._id}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-light px-4 py-2 font-medium text-slate-950 transition hover:bg-[#4F96EE] disabled:opacity-60 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
              >
                {workingId === editingUser._id && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
