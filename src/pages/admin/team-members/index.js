"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllTeamRequests,
  approveTeamRequest,
  rejectTeamRequest,
  deleteTeamRequest,
} from "../../api/teammemberAPI";
import { isAuthenticated } from "../../api/userApi";
import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaLinkedin,
  FaGithub,
  FaUser,
  FaClock,
  FaUserCheck,
  FaUserTimes,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const STATUS_TABS = [
  {
    label: "All",
    value: "",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  },
  {
    label: "Pending",
    value: "pending",
    color:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  {
    label: "Approved",
    value: "approved",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
  {
    label: "Rejected",
    value: "rejected",
    color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
];

const statusBadge = (status) => {
  const map = {
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    approved:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
        map[status] || ""
      }`}
    >
      {status}
    </span>
  );
};

export default function AdminTeamMembersPage() {
  const token = isAuthenticated();

  const [activeTab, setActiveTab] = useState("");
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null); // which row is in action state

  // Modal state for approve / reject with optional note
  const [modal, setModal] = useState(null); // { type: 'approve'|'reject'|'delete', id, name }
  const [adminNote, setAdminNote] = useState("");

  const fetchData = useCallback(
    async (tab = activeTab, page = pagination.page) => {
      setLoading(true);
      const res = await getAllTeamRequests(token, tab, page, 10);
      if (res?.data) {
        setData(res.data);
        setStats(res.stats || {});
        setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
      }
      setLoading(false);
    },
    [token, activeTab, pagination.page]
  );

  useEffect(() => {
    fetchData(activeTab, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleTabChange = (val) => {
    setActiveTab(val);
  };

  const handlePage = (newPage) => {
    fetchData(activeTab, newPage);
  };

  const openModal = (type, id, name) => {
    setAdminNote("");
    setModal({ type, id, name });
  };

  const closeModal = () => setModal(null);

  const handleConfirm = async () => {
    if (!modal) return;
    setActionId(modal.id);

    if (modal.type === "approve") {
      await approveTeamRequest(modal.id, token, adminNote);
    } else if (modal.type === "reject") {
      await rejectTeamRequest(modal.id, token, adminNote);
    } else if (modal.type === "delete") {
      await deleteTeamRequest(modal.id, token);
    }

    setActionId(null);
    closeModal();
    fetchData(activeTab, pagination.page);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Team Members
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review join requests from registered users and manage who appears on
            the public team section.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total",
              count: stats.total,
              icon: <FaUser />,
              color: "text-gray-500",
            },
            {
              label: "Pending",
              count: stats.pending,
              icon: <FaClock />,
              color: "text-yellow-500",
            },
            {
              label: "Approved",
              count: stats.approved,
              icon: <FaUserCheck />,
              color: "text-green-500",
            },
            {
              label: "Rejected",
              count: stats.rejected,
              icon: <FaUserTimes />,
              color: "text-red-500",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center gap-3"
            >
              <span className={`text-2xl ${s.color}`}>{s.icon}</span>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {s.count ?? "—"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeTab === tab.value
                  ? tab.color + " ring-2 ring-offset-1 ring-current"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300 hover:opacity-80"
              }`}
            >
              {tab.label}
              {tab.value === "pending" && stats.pending > 0 && (
                <span className="ml-1.5 bg-yellow-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Member</th>
                <th className="px-4 py-3 text-left">Position</th>
                <th className="px-4 py-3 text-left">Bio</th>
                <th className="px-4 py-3 text-left">Links</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Applied</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Loading…
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    No requests found.
                  </td>
                </tr>
              ) : (
                data.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                  >
                    {/* Member */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {req.user?.image ? (
                          <img
                            src={req.user.image}
                            alt={req.user.username}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500">
                            <FaUser />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100">
                            {req.user?.firstname} {req.user?.lastname}
                          </p>
                          <p className="text-xs text-gray-400">
                            @{req.user?.username}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Position */}
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {req.position}
                    </td>

                    {/* Bio */}
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2">
                        {req.bio || <span className="italic">—</span>}
                      </p>
                      {req.adminNote && (
                        <p className="mt-1 text-xs text-red-400 italic">
                          Note: {req.adminNote}
                        </p>
                      )}
                    </td>

                    {/* Links */}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {req.linkedin && (
                          <a
                            href={req.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <FaLinkedin />
                          </a>
                        )}
                        {req.github && (
                          <a
                            href={req.github}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <FaGithub />
                          </a>
                        )}
                        {!req.linkedin && !req.github && (
                          <span className="text-gray-300 dark:text-gray-600 text-xs">
                            —
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">{statusBadge(req.status)}</td>

                    {/* Applied at */}
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {req.status !== "approved" && (
                          <button
                            onClick={() =>
                              openModal(
                                "approve",
                                req._id,
                                `${req.user?.firstname} ${req.user?.lastname}`
                              )
                            }
                            disabled={actionId === req._id}
                            title="Approve"
                            className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 transition disabled:opacity-50"
                          >
                            <FaCheck size={12} />
                          </button>
                        )}
                        {req.status !== "rejected" && (
                          <button
                            onClick={() =>
                              openModal(
                                "reject",
                                req._id,
                                `${req.user?.firstname} ${req.user?.lastname}`
                              )
                            }
                            disabled={actionId === req._id}
                            title="Reject"
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition disabled:opacity-50"
                          >
                            <FaTimes size={12} />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            openModal(
                              "delete",
                              req._id,
                              `${req.user?.firstname} ${req.user?.lastname}`
                            )
                          }
                          disabled={actionId === req._id}
                          title="Delete record"
                          className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition disabled:opacity-50"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>
              Page {pagination.page} of {pagination.pages} &nbsp;·&nbsp;{" "}
              {pagination.total} total
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePage(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 rounded-lg border dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <FaChevronLeft size={12} />
              </button>
              <button
                onClick={() => handlePage(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1.5 rounded-lg border dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
              {modal.type === "approve" && "Approve Request"}
              {modal.type === "reject" && "Reject Request"}
              {modal.type === "delete" && "Delete Record"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {modal.type === "delete"
                ? `Permanently delete the request from ${modal.name}? This cannot be undone.`
                : `${modal.type === "approve" ? "Approve" : "Reject"} ${
                    modal.name
                  }'s team member request?`}
            </p>

            {modal.type !== "delete" && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Admin note <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={
                    modal.type === "approve"
                      ? "e.g. Welcome aboard!"
                      : "e.g. Profile incomplete, please reapply."
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-light resize-none"
                />
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${
                  modal.type === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : modal.type === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {modal.type === "approve" && "Approve"}
                {modal.type === "reject" && "Reject"}
                {modal.type === "delete" && "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
