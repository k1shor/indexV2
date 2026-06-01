"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Clock3,
  Edit3,
  HelpCircle,
  Inbox,
  MessageSquareReply,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import {
  createAdminFaq,
  deleteAdminFaq,
  deleteAdminMessage,
  getAdminFaqs,
  getAdminMessages,
  replyToAdminMessage,
  updateAdminFaq,
  updateAdminMessage,
} from "@/pages/api/messagesAPI";

const initialFaqForm = {
  question: "",
  answer: "",
  category: "General",
  keywords: "",
  sortOrder: 0,
  isActive: true,
};

const statusOptions = ["all", "new", "open", "in-progress", "resolved", "closed", "archived"];
const sourceOptions = ["all", "contact", "chatbot", "website", "admin"];

const statusStyles = {
  new: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-200 dark:border-blue-500/30",
  open: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-200 dark:border-cyan-500/30",
  "in-progress": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/30",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-500/30",
  closed: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/10 dark:text-slate-200 dark:border-white/10",
  archived: "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/10",
};

const formatDate = (value) => {
  if (!value) return "Recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getMessageTitle = (message) =>
  message?.subject || message?.category || message?.message?.slice(0, 48) || "Message";

const MessagesAdminPage = () => {
  const [tab, setTab] = useState("inbox");
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    source: "all",
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving] = useState(false);

  const [faqs, setFaqs] = useState([]);
  const [defaultFaqs, setDefaultFaqs] = useState([]);
  const [faqForm, setFaqForm] = useState(initialFaqForm);
  const [editingFaqId, setEditingFaqId] = useState("");
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqError, setFaqError] = useState("");

  const statCards = useMemo(
    () => [
      ["Total", stats.total || 0, Inbox],
      ["New", stats.new || 0, AlertCircle],
      ["In progress", stats.inProgress || 0, Clock3],
      ["Resolved", stats.resolved || 0, CheckCircle2],
    ],
    [stats]
  );

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminMessages(filters);
      const list = data.data || data.messages || [];
      setMessages(list);
      setStats(data.stats || {});
      setPagination(data.pagination || { page: 1, pages: 1, total: list.length });
      setSelected((current) => {
        if (!current) return list[0] || null;
        return list.find((item) => item._id === current._id) || list[0] || null;
      });
    } catch (err) {
      setError(err.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  const loadFaqs = async () => {
    try {
      setFaqLoading(true);
      setFaqError("");
      const data = await getAdminFaqs({ limit: 100 });
      setFaqs(data.data || data.faqs || []);
      setDefaultFaqs(data.defaults || []);
    } catch (err) {
      setFaqError(err.message || "Failed to load FAQs.");
    } finally {
      setFaqLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [filters]);

  useEffect(() => {
    if (tab === "faqs") loadFaqs();
  }, [tab]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  };

  const handleStatusChange = async (message, status) => {
    try {
      setSaving(true);
      const data = await updateAdminMessage(message._id, { status });
      const updated = data.data;
      setMessages((items) => items.map((item) => (item._id === updated._id ? updated : item)));
      setSelected((current) => (current?._id === updated._id ? updated : current));
    } catch (err) {
      setError(err.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  const handleReply = async (event) => {
    event.preventDefault();
    if (!selected || !replyText.trim()) return;

    try {
      setSaving(true);
      const data = await replyToAdminMessage(selected._id, {
        message: replyText,
        status: selected.status === "resolved" ? "resolved" : "in-progress",
      });
      const updated = data.data;
      setSelected(updated);
      setMessages((items) => items.map((item) => (item._id === updated._id ? updated : item)));
      setReplyText("");
    } catch (err) {
      setError(err.message || "Failed to save reply.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMessage = async (message) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await deleteAdminMessage(message._id);
      setMessages((items) => items.filter((item) => item._id !== message._id));
      setSelected((current) => (current?._id === message._id ? null : current));
      loadMessages();
    } catch (err) {
      setError(err.message || "Failed to delete message.");
    }
  };

  const resetFaqForm = () => {
    setFaqForm(initialFaqForm);
    setEditingFaqId("");
  };

  const editFaq = (faq) => {
    setEditingFaqId(faq._id);
    setFaqForm({
      question: faq.question || "",
      answer: faq.answer || "",
      category: faq.category || "General",
      keywords: (faq.keywords || []).join(", "),
      sortOrder: faq.sortOrder || 0,
      isActive: faq.isActive !== false,
    });
  };

  const saveFaq = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      if (editingFaqId) {
        await updateAdminFaq(editingFaqId, faqForm);
      } else {
        await createAdminFaq(faqForm);
      }
      resetFaqForm();
      loadFaqs();
    } catch (err) {
      setFaqError(err.message || "Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const removeFaq = async (faq) => {
    if (!window.confirm("Delete this FAQ?")) return;

    try {
      await deleteAdminFaq(faq._id);
      if (editingFaqId === faq._id) resetFaqForm();
      loadFaqs();
    } catch (err) {
      setFaqError(err.message || "Failed to delete FAQ.");
    }
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-white/10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
            Messaging center
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#1E3A8A] dark:text-white">
            Inbox and chatbot management
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Manage website messages, chatbot handoffs, admin replies, and FAQ answers.
          </p>
        </div>

        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/[0.04]">
          {[
            ["inbox", "Inbox", Inbox],
            ["faqs", "FAQs", HelpCircle],
          ].map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-bold transition ${
                tab === value
                  ? "bg-brand-light text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-[#1E3A8A] dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "inbox" ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(([label, value, Icon]) => (
              <div
                key={label}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-950"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {label}
                    </p>
                    <p className="mt-2 text-3xl font-extrabold text-[#1E3A8A] dark:text-white">
                      {value}
                    </p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#78a6f2]/10 text-brand-light">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04] lg:grid-cols-[1fr_180px_180px_auto]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/20 dark:border-white/10 dark:bg-neutral-950"
                placeholder="Search name, email, message..."
              />
            </label>

            <select
              value={filters.status}
              onChange={(event) => updateFilter("status", event.target.value)}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-light dark:border-white/10 dark:bg-neutral-950"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All statuses" : status}
                </option>
              ))}
            </select>

            <select
              value={filters.source}
              onChange={(event) => updateFilter("source", event.target.value)}
              className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-light dark:border-white/10 dark:bg-neutral-950"
            >
              {sourceOptions.map((source) => (
                <option key={source} value={source}>
                  {source === "all" ? "All sources" : source}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={loadMessages}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#13294b] px-4 text-sm font-bold text-white transition hover:bg-slate-950 dark:bg-brand-light dark:text-slate-950"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(380px,1.05fr)]">
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-white/[0.04]">
                <h2 className="font-bold text-[#1E3A8A] dark:text-white">Messages</h2>
              </div>

              {loading ? (
                <div className="p-6 text-sm text-slate-500 dark:text-slate-400">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="p-6 text-sm text-slate-500 dark:text-slate-400">
                  No messages found.
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-white/10">
                  {messages.map((message) => (
                    <button
                      key={message._id}
                      type="button"
                      onClick={() => setSelected(message)}
                      className={`block w-full p-5 text-left transition hover:bg-slate-50 dark:hover:bg-white/[0.04] ${
                        selected?._id === message._id ? "bg-[#78a6f2]/10" : "bg-white dark:bg-neutral-950"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-[#1E3A8A] dark:text-white">
                              {message.name || "Website Visitor"}
                            </span>
                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-bold ${
                                statusStyles[message.status] || statusStyles.new
                              }`}
                            >
                              {message.status || "new"}
                            </span>
                            {message.source === "chatbot" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#78a6f2]/10 px-2.5 py-1 text-xs font-bold text-brand-light">
                                <Bot className="h-3 w-3" />
                                chatbot
                              </span>
                            )}
                          </div>
                          <p className="mt-2 line-clamp-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {getMessageTitle(message)}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {message.message}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-slate-400">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm dark:border-white/10 dark:bg-white/[0.04]">
                <span className="text-slate-500 dark:text-slate-400">
                  Page {pagination.page || 1} of {pagination.pages || 1}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={(pagination.page || 1) <= 1}
                    onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
                    className="rounded-lg border border-slate-200 px-3 py-2 font-bold disabled:opacity-40 dark:border-white/10"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={(pagination.page || 1) >= (pagination.pages || 1)}
                    onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
                    className="rounded-lg border border-slate-200 px-3 py-2 font-bold disabled:opacity-40 dark:border-white/10"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-neutral-950">
              {selected ? (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                        Message detail
                      </p>
                      <h2 className="mt-2 text-2xl font-extrabold text-[#1E3A8A] dark:text-white">
                        {getMessageTitle(selected)}
                      </h2>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        From {selected.name || "Website Visitor"} {selected.email ? `- ${selected.email}` : ""}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(selected)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                      aria-label="Delete message"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                        Status
                      </span>
                      <select
                        value={selected.status || "new"}
                        disabled={saving}
                        onChange={(event) => handleStatusChange(selected, event.target.value)}
                        className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-neutral-950"
                      >
                        {statusOptions.filter((status) => status !== "all").map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                        Source
                      </span>
                      <div className="mt-2 flex h-11 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold dark:border-white/10">
                        {selected.source || "website"}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-5 text-sm leading-7 text-slate-700 dark:bg-white/[0.04] dark:text-slate-200">
                    {selected.message}
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                      <MessageSquareReply className="h-4 w-4" />
                      Replies
                    </h3>

                    <div className="mt-4 space-y-3">
                      {selected.responses?.length ? (
                        selected.responses.map((reply) => (
                          <div
                            key={reply._id || reply.createdAt}
                            className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]"
                          >
                            <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                              <span>{reply.responderName || "Index IT Hub Team"}</span>
                              <span>{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                              {reply.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No replies saved yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleReply} className="space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      rows={4}
                      className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-brand-light focus:ring-4 focus:ring-[#78a6f2]/20 dark:border-white/10 dark:bg-white/[0.04]"
                      placeholder="Write an admin response or follow-up note..."
                    />
                    <button
                      type="submit"
                      disabled={saving || !replyText.trim()}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#13294b] px-5 text-sm font-bold text-white transition hover:bg-slate-950 disabled:opacity-50 dark:bg-brand-light dark:text-slate-950"
                    >
                      <Send className="h-4 w-4" />
                      Save Reply
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex min-h-[360px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  Select a message to view details.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={saveFaq}
            className="h-fit rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-light">
                  FAQ answer
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-[#1E3A8A] dark:text-white">
                  {editingFaqId ? "Edit FAQ" : "Add FAQ"}
                </h2>
              </div>
              {editingFaqId && (
                <button
                  type="button"
                  onClick={resetFaqForm}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10"
                  aria-label="Cancel edit"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {faqError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                {faqError}
              </div>
            )}

            <label className="mt-5 block">
              <span className="text-sm font-bold text-[#1E3A8A] dark:text-white">Question</span>
              <input
                value={faqForm.question}
                onChange={(event) => setFaqForm((current) => ({ ...current, question: event.target.value }))}
                required
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-light dark:border-white/10 dark:bg-neutral-950"
                placeholder="What services do you provide?"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-bold text-[#1E3A8A] dark:text-white">Answer</span>
              <textarea
                value={faqForm.answer}
                onChange={(event) => setFaqForm((current) => ({ ...current, answer: event.target.value }))}
                required
                rows={5}
                className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-brand-light dark:border-white/10 dark:bg-neutral-950"
                placeholder="Write the instant chatbot answer..."
              />
            </label>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-[#1E3A8A] dark:text-white">Category</span>
                <input
                  value={faqForm.category}
                  onChange={(event) => setFaqForm((current) => ({ ...current, category: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-light dark:border-white/10 dark:bg-neutral-950"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-[#1E3A8A] dark:text-white">Sort</span>
                <input
                  type="number"
                  value={faqForm.sortOrder}
                  onChange={(event) => setFaqForm((current) => ({ ...current, sortOrder: event.target.value }))}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-light dark:border-white/10 dark:bg-neutral-950"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-bold text-[#1E3A8A] dark:text-white">
                Keywords
              </span>
              <input
                value={faqForm.keywords}
                onChange={(event) => setFaqForm((current) => ({ ...current, keywords: event.target.value }))}
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-light dark:border-white/10 dark:bg-neutral-950"
                placeholder="price, cost, budget"
              />
            </label>

            <label className="mt-5 flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={faqForm.isActive}
                onChange={(event) => setFaqForm((current) => ({ ...current, isActive: event.target.checked }))}
                className="h-4 w-4 accent-brand-light"
              />
              Active in chatbot
            </label>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#13294b] px-5 text-sm font-bold text-white transition hover:bg-slate-950 disabled:opacity-50 dark:bg-brand-light dark:text-slate-950"
            >
              {editingFaqId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingFaqId ? "Update FAQ" : "Create FAQ"}
            </button>
          </form>

          <div className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-neutral-950">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-white/10">
                <h2 className="font-bold text-[#1E3A8A] dark:text-white">Custom FAQs</h2>
                <button
                  type="button"
                  onClick={loadFaqs}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-bold dark:border-white/10"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Refresh
                </button>
              </div>

              {faqLoading ? (
                <div className="p-5 text-sm text-slate-500 dark:text-slate-400">
                  Loading FAQs...
                </div>
              ) : faqs.length === 0 ? (
                <div className="p-5 text-sm text-slate-500 dark:text-slate-400">
                  No custom FAQs yet. The chatbot will still use the default answers below.
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-white/10">
                  {faqs.map((faq) => (
                    <div key={faq._id} className="p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-[#1E3A8A] dark:text-white">
                              {faq.question}
                            </h3>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              faq.isActive
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
                                : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"
                            }`}>
                              {faq.isActive ? "active" : "inactive"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {faq.answer}
                          </p>
                          <p className="mt-2 text-xs font-semibold text-slate-400">
                            {faq.category || "General"} {faq.keywords?.length ? `- ${faq.keywords.join(", ")}` : ""}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => editFaq(faq)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:text-brand-light dark:border-white/10 dark:text-slate-300"
                            aria-label="Edit FAQ"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFaq(faq)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                            aria-label="Delete FAQ"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <h2 className="font-bold text-[#1E3A8A] dark:text-white">Built-in fallback FAQs</h2>
              <div className="mt-4 grid gap-3">
                {defaultFaqs.map((faq) => (
                  <div
                    key={faq._id}
                    className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950"
                  >
                    <h3 className="text-sm font-bold text-[#1E3A8A] dark:text-white">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesAdminPage;
