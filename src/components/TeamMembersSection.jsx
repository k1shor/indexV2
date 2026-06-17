"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersRound,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getPublicTeam,
  searchEligibleUsers,
  addExistingUserAsMember,
  updateTeamRequest,
  deleteTeamRequest,
} from "../pages/api/teammemberAPI";
import JoinTeamButton from "../components/Jointeambutton";

// ─── Animation variants ────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// ─── Social icon helpers ───────
function IconLink({ href, label, children }) {
  if (!href) return null;
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1E3A8A] shadow-md backdrop-blur-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-blue-600 dark:bg-gray-950/80 dark:text-gray-100 dark:ring-white/10 dark:hover:bg-gray-900"
    >
      {children}
    </a>
  );
}

function IconLinkedIn() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 23.5h4V7.98h-4V23.5ZM8 7.98h3.84v2.12h.06c.54-1.02 1.86-2.1 3.84-2.1 4.1 0 4.86 2.7 4.86 6.2v9.3h-4v-8.26c0-1.97-.04-4.5-2.74-4.5-2.75 0-3.17 2.14-3.17 4.36v8.4H8V7.98Z" />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.18-.02-2.13-3.17.69-3.84-1.34-3.84-1.34-.52-1.31-1.27-1.66-1.27-1.66-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.54-2.53-.29-5.19-1.26-5.19-5.62 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.58.23 2.75.11 3.04.73.8 1.17 1.82 1.17 3.06 0 4.37-2.67 5.33-5.21 5.61.41.36.77 1.07.77 2.15 0 1.56-.01 2.81-.01 3.19 0 .31.21.66.79.55A11.51 11.51 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z" />
    </svg>
  );
}

// ─── Image with initials fallback ───────────
function ImgWithFallback({ src, alt, initials, className }) {
  const [failed, setFailed] = React.useState(!src);
  React.useEffect(() => {
    setFailed(!src);
  }, [src]);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#1E3A8A] to-blue-600 text-[#7ddfff] font-extrabold select-none rounded-full overflow-hidden ${className}`}
        aria-label={alt}
        style={{
          fontSize: "clamp(0.7rem, 3vw, 1.8rem)",
          letterSpacing: "0.06em",
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} rounded-full`}
      onError={() => setFailed(true)}
      draggable="false"
    />
  );
}

// ─── Single team card (Cover Flow Ready) ───────────
function TeamCard({ member, isAdminUser, onEdit, onDelete, position }) {
  const fullName =
    `${member?.firstname || ""} ${member?.lastname || ""}`.trim() ||
    "Team Member";
  const initials =
    `${member?.firstname?.[0] || ""}${
      member?.lastname?.[0] || ""
    }`.toUpperCase() || "IT";

  const isCenter = position === "center";

  return (
    <div className="relative group p-4 select-none">
      {isCenter && (
        <div className="absolute inset-x-8 top-12 bottom-0 bg-blue-500/20 blur-[40px] dark:bg-blue-400/10 rounded-full transition-all duration-500 pointer-events-none" />
      )}

      <div
        className={`w-[260px] sm:w-[290px] md:w-[320px] overflow-hidden rounded-[32px] transition-all duration-500 backdrop-blur-xl border relative z-10
          ${
            isCenter
              ? "bg-white/80 dark:bg-white/10 border-white/40 dark:border-white/20 shadow-[0_25px_50px_-12px_rgba(30,58,138,0.25)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
              : "bg-white/40 dark:bg-white/5 border-white/10 dark:border-white/5 shadow-md"
          }`}
      >
        <div className="relative flex justify-center pt-8">
          <div
            className={`h-36 w-36 md:h-40 md:w-40 overflow-hidden rounded-full transition-all duration-500 p-1 bg-gradient-to-tr
              ${
                isCenter
                  ? "from-[#1E3A8A] via-[#78a6f2] to-[#7ddfff] shadow-[0_0_25px_rgba(120,166,242,0.6)] scale-105"
                  : "from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 shadow-sm"
              }`}
          >
            <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 overflow-hidden">
              <ImgWithFallback
                src={member?.image}
                alt={fullName}
                initials={initials}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="pointer-events-auto absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <IconLink href={member?.linkedin} label="LinkedIn">
              <IconLinkedIn />
            </IconLink>
            <IconLink href={member?.github} label="GitHub">
              <IconGithub />
            </IconLink>
          </div>

          {isAdminUser && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(member);
                }}
                className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#1E3A8A] shadow-md transition hover:bg-white hover:scale-105"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(member._teamMemberId);
                }}
                className="inline-flex items-center gap-1 rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-bold text-white shadow-md transition hover:bg-red-600 hover:scale-105"
              >
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            </div>
          )}
        </div>

        <div className="px-6 pb-8 pt-6 text-center select-none">
          <h3 className="text-lg md:text-xl font-extrabold text-[#1E3A8A] dark:text-white tracking-tight">
            {fullName}
          </h3>
          <p className="mt-1 text-xs md:text-sm font-semibold text-[#78a6f2] dark:text-[#7ddfff]">
            {member?.position || "Team Contributor"}
          </p>
          {(member?.linkedin || member?.github) && (
            <div className="mt-4 flex items-center justify-center gap-3">
              {member?.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 transition hover:bg-blue-100 dark:hover:bg-blue-900/40"
                >
                  <IconLinkedIn />
                  LinkedIn
                </a>
              )}
              {member?.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <IconGithub />
                  GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────
export default function TeamMembersSection() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [token, setToken] = useState("");

  // Slider state
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayRef = useRef(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedMember, setSelectedMember] = useState(null);

  // ── "Add Member" picker state (search existing registered users) ──
  const [userSearch, setUserSearch] = useState("");
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [pickedUser, setPickedUser] = useState(null);
  const [addForm, setAddForm] = useState({
    position: "",
    bio: "",
    skills: "",
    linkedin: "",
    github: "",
  });
  const [submittingAdd, setSubmittingAdd] = useState(false);
  const [addError, setAddError] = useState("");

  // ── "Edit Member" form state (position/bio only — no account fields) ──
  const [editForm, setEditForm] = useState({
    position: "",
    bio: "",
    linkedin: "",
    github: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        setToken(parsed.token);
        if (parsed.user?.role >= 1) setIsAdminUser(true);
      }
    }
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    if (team.length <= 1) return;
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((p) => (p + 1) % team.length);
    }, 4500);
    return () => clearInterval(autoPlayRef.current);
  }, [team.length]);

  const stopAuto = () => clearInterval(autoPlayRef.current);

  const prev = useCallback(() => {
    stopAuto();
    setActiveIndex((p) => (p - 1 + team.length) % team.length);
  }, [team.length]);

  const next = useCallback(() => {
    stopAuto();
    setActiveIndex((p) => (p + 1) % team.length);
  }, [team.length]);

  const goTo = (i) => {
    stopAuto();
    setActiveIndex(i);
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold) {
      next();
    } else if (info.offset.x > swipeThreshold) {
      prev();
    }
  };

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPublicTeam();
      const raw =
        data?.data || data?.users || (Array.isArray(data) ? data : []);

      // Flatten: /team/public returns { _id, user: {...}, position, bio, linkedin, github }
      const list = raw.map((item) => {
        if (item?.user && typeof item.user === "object") {
          return {
            ...item.user,
            position: item.position || item.user.position || "Team Contributor",
            about: item.bio || item.user.about || "",
            linkedin: item.linkedin || "",
            github: item.github || "",
            _teamMemberId: item._id, // TeamMember document id (needed for edit/delete)
          };
        }
        return item;
      });

      setTeam(list);
    } catch {
      setError("Failed to load team members.");
    } finally {
      setLoading(false);
    }
  };

  // ── Search registered users as admin types ──
  useEffect(() => {
    if (modalMode !== "add" || !isModalOpen) return;
    const delay = setTimeout(async () => {
      setSearchingUsers(true);
      const res = await searchEligibleUsers(token, userSearch);
      setEligibleUsers(res?.data || []);
      setSearchingUsers(false);
    }, 300);
    return () => clearTimeout(delay);
  }, [userSearch, modalMode, isModalOpen, token]);

  const openAddModal = () => {
    setModalMode("add");
    setPickedUser(null);
    setUserSearch("");
    setEligibleUsers([]);
    setAddForm({ position: "", bio: "", skills: "", linkedin: "", github: "" });
    setAddError("");
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setModalMode("edit");
    setSelectedMember(member);
    setEditForm({
      position: member.position || "",
      bio: member.about || "",
      linkedin: member.linkedin || "",
      github: member.github || "",
    });
    setIsModalOpen(true);
  };

  const handleAddFormChange = (e) =>
    setAddForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditFormChange = (e) =>
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError("");

    if (!pickedUser) {
      setAddError("Please select a registered user first.");
      return;
    }
    if (!addForm.position.trim()) {
      setAddError("Position is required.");
      return;
    }

    setSubmittingAdd(true);
    const payload = {
      userId: pickedUser._id,
      position: addForm.position.trim(),
      bio: addForm.bio.trim(),
      skills: addForm.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      linkedin: addForm.linkedin.trim(),
      github: addForm.github.trim(),
    };

    const res = await addExistingUserAsMember(payload, token);
    setSubmittingAdd(false);

    if (res?.error) {
      setAddError(res.error);
    } else {
      setIsModalOpen(false);
      fetchTeamMembers();
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateTeamRequest(
        selectedMember._teamMemberId,
        {
          position: editForm.position.trim(),
          bio: editForm.bio.trim(),
          linkedin: editForm.linkedin.trim(),
          github: editForm.github.trim(),
        },
        token
      );
      if (res?.error) alert(res.error);
      else {
        setIsModalOpen(false);
        fetchTeamMembers();
      }
    } catch {
      alert("Something went wrong.");
    }
  };

  const handleDelete = async (teamMemberId) => {
    if (
      confirm(
        "Remove this person from the team section? Their user account will NOT be deleted."
      )
    ) {
      try {
        const res = await deleteTeamRequest(teamMemberId, token);
        if (res?.error) alert(res.error);
        else fetchTeamMembers();
      } catch {
        alert("Action failed.");
      }
    }
  };

  return (
    <section className="bg-gradient-to-b from-slate-50 to-slate-100 pt-16 pb-20 dark:from-[#0b1624] dark:to-[#070d16] lg:pt-20 lg:pb-24 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-6">
        {/* ── Header ── */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-2xl"
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[#78a6f2]">
              Our Visionaries
            </p>
            <h2 className="text-4xl font-black leading-none text-[#1E3A8A] dark:text-white md:text-6xl tracking-tight">
              Meet the Experts.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              A focused group of engineers, designers, and strategists committed
              to building fast, secure, and scalable solutions.
            </p>
          </motion.div>

          {isAdminUser && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1E3A8A] to-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/20"
              >
                <Plus className="h-4 w-4" />
                Add Member
              </button>
            </motion.div>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </p>
        )}

        {/* ── Loading Skeleton ── */}
        {loading ? (
          <div className="flex items-center justify-center gap-8 py-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-80 w-[290px] animate-pulse rounded-[32px] bg-slate-200/60 dark:bg-white/[0.04]"
              />
            ))}
          </div>
        ) : team.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-white/50 p-16 text-center text-slate-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-300 backdrop-blur-md">
            <UsersRound className="mx-auto mb-4 h-12 w-12 text-[#78a6f2]" />
            <p className="text-base font-semibold">Our team is coming soon.</p>
            <p className="mt-1 text-sm text-slate-400">Check back later!</p>
          </div>
        ) : (
          <div>
            {/* ── Apple Cover Flow Track ── */}
            <div
              className="relative flex items-center justify-center min-h-[380px] sm:min-h-[420px] py-1"
              style={{ perspective: "1200px" }}
            >
              {/* Left arrow Navigation */}
              {team.length > 1 && (
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="absolute left-2 md:left-6 xl:left-12 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/70 shadow-2xl text-[#1E3A8A] backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {/* Cover Flow Presentation Window */}
              <motion.div
                className="relative flex items-center justify-center w-full max-w-[1400px] h-[360px] overflow-visible cursor-grab active:cursor-grabbing"
                style={{ transformStyle: "preserve-3d" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragStart={stopAuto}
                onDragEnd={handleDragEnd}
              >
                {team.map((member, idx) => {
                  let offset = idx - activeIndex;

                  if (offset < -team.length / 2) offset += team.length;
                  if (offset > team.length / 2) offset -= team.length;

                  const isCenter = offset === 0;
                  const isLeft = offset < 0;
                  const absOffset = Math.abs(offset);

                  const isVisible = absOffset <= 2;
                  const positionString = isCenter
                    ? "center"
                    : isLeft
                    ? "left"
                    : "right";

                  return (
                    <motion.div
                      key={member._id || idx}
                      style={{
                        transformStyle: "preserve-3d",
                        position: "absolute",
                        pointerEvents: isCenter ? "auto" : "none",
                        zIndex: 20 - absOffset,
                      }}
                      animate={{
                        scale: isCenter ? 1.05 : 0.85 - absOffset * 0.05,
                        rotateY: isCenter ? 0 : isLeft ? 40 : -40,
                        opacity: isCenter
                          ? 1
                          : absOffset === 1
                          ? 0.75
                          : absOffset === 2
                          ? 0.4
                          : 0,
                        x: `calc(${offset} * var(--card-spacing, 160px))`,
                        z: -120 * absOffset,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 24,
                      }}
                      className={`transition-opacity duration-300 
                        ${
                          !isVisible ? "pointer-events-none opacity-0" : "block"
                        }
                        [--card-spacing:130px] sm:[--card-spacing:160px] md:[--card-spacing:200px] lg:[--card-spacing:240px] xl:[--card-spacing:280px]`}
                    >
                      <TeamCard
                        member={member}
                        isAdminUser={isAdminUser}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                        position={positionString}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Right arrow Navigation */}
              {team.length > 1 && (
                <button
                  onClick={next}
                  aria-label="Next"
                  className="absolute right-2 md:right-6 xl:right-12 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/70 shadow-2xl text-[#1E3A8A] backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 dark:border-white/10 dark:bg-white/[0.06] dark:text-white"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* ── Dot Indicators ── */}
            {team.length > 1 && (
              <div className="mt-2 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2.5 bg-slate-200/50 dark:bg-white/[0.05] px-4 py-2 rounded-full backdrop-blur-sm">
                  {team.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Go to member ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        i === activeIndex
                          ? "w-8 h-2 bg-[#1E3A8A] dark:bg-[#78a6f2]"
                          : "w-2 h-2 bg-slate-400/60 hover:bg-slate-500 dark:bg-white/20 dark:hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {activeIndex + 1} of {team.length}
                </p>
              </div>
            )}
          </div>
        )}
        {/* ── Join Team: only shown to logged-in non-admin users ── */}
        <JoinTeamButton />
      </div>

      {/* ── Admin Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg overflow-y-auto max-h-[90vh] rounded-[24px] bg-white p-8 shadow-2xl dark:bg-[#0d1a2b] border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-5 top-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-2xl font-black text-[#1E3A8A] dark:text-white mb-1 tracking-tight">
                {modalMode === "add"
                  ? "Add Team Member"
                  : "Edit Member Details"}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                {modalMode === "add"
                  ? "Only users with an existing account can be added."
                  : "Update this member's role and bio."}
              </p>

              {/* ───────────── ADD MODE: search & pick existing user ───────────── */}
              {modalMode === "add" ? (
                <form onSubmit={handleAddSubmit} className="space-y-4">
                  {!pickedUser ? (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Search registered users *
                      </label>
                      <input
                        type="text"
                        autoFocus
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Search by name, username, or email…"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a6f2] transition"
                      />

                      <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                        {searchingUsers ? (
                          <p className="px-4 py-6 text-center text-sm text-slate-400">
                            Searching…
                          </p>
                        ) : eligibleUsers.length === 0 ? (
                          <p className="px-4 py-6 text-center text-sm text-slate-400">
                            {userSearch
                              ? "No matching users found."
                              : "Start typing to search registered users."}
                          </p>
                        ) : (
                          eligibleUsers.map((u) => (
                            <button
                              key={u._id}
                              type="button"
                              onClick={() => {
                                setPickedUser(u);
                                // Pre-fill with data already on the user's account —
                                // admin only needs to fill in what's missing
                                setAddForm((prev) => ({
                                  ...prev,
                                  position: u.position || prev.position,
                                  bio: u.about || prev.bio,
                                }));
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                            >
                              <ImgWithFallback
                                src={u.image}
                                alt={u.username}
                                initials={
                                  `${u.firstname?.[0] || ""}${
                                    u.lastname?.[0] || ""
                                  }`.toUpperCase() || "U"
                                }
                                className="h-9 w-9 flex-shrink-0 text-xs"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                                  {u.firstname} {u.lastname}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                  @{u.username} · {u.email}
                                </p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Selected user preview */}
                      <div className="flex items-center gap-3 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-900/10 px-4 py-3">
                        <ImgWithFallback
                          src={pickedUser.image}
                          alt={pickedUser.username}
                          initials={
                            `${pickedUser.firstname?.[0] || ""}${
                              pickedUser.lastname?.[0] || ""
                            }`.toUpperCase() || "U"
                          }
                          className="h-10 w-10 flex-shrink-0 text-xs"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                            {pickedUser.firstname} {pickedUser.lastname}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            @{pickedUser.username}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPickedUser(null)}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
                        >
                          Change
                        </button>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          Position / Role *
                          {pickedUser?.position && (
                            <span className="text-[10px] font-semibold normal-case tracking-normal text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full">
                              from profile
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          name="position"
                          required
                          placeholder="e.g., Senior Frontend Architect"
                          value={addForm.position}
                          onChange={handleAddFormChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a6f2] transition"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          Short bio
                          {pickedUser?.about && (
                            <span className="text-[10px] font-semibold normal-case tracking-normal text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full">
                              from profile
                            </span>
                          )}
                        </label>
                        <textarea
                          name="bio"
                          rows={3}
                          placeholder="A short bio shown on their card…"
                          value={addForm.bio}
                          onChange={handleAddFormChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a6f2] transition resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          Skills{" "}
                          <span className="text-slate-400">
                            (comma-separated)
                          </span>
                        </label>
                        <input
                          type="text"
                          name="skills"
                          placeholder="e.g. React, Node.js, MongoDB"
                          value={addForm.skills}
                          onChange={handleAddFormChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a6f2] transition"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            LinkedIn URL
                          </label>
                          <input
                            type="text"
                            name="linkedin"
                            placeholder="https://linkedin.com/in/…"
                            value={addForm.linkedin}
                            onChange={handleAddFormChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a6f2] transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            GitHub URL
                          </label>
                          <input
                            type="text"
                            name="github"
                            placeholder="https://github.com/…"
                            value={addForm.github}
                            onChange={handleAddFormChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a6f2] transition"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {addError && (
                    <p className="text-xs font-medium text-red-500">
                      {addError}
                    </p>
                  )}

                  <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 dark:border-slate-800 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 text-sm font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!pickedUser || submittingAdd}
                      className="px-5 py-2.5 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-[#1E3A8A] to-blue-700 hover:opacity-95 transition shadow-lg shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingAdd ? "Adding…" : "Add to Team"}
                    </button>
                  </div>
                </form>
              ) : (
                /* ───────────── EDIT MODE ───────────── */
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 px-4 py-3">
                    <ImgWithFallback
                      src={selectedMember?.image}
                      alt={selectedMember?.username}
                      initials={
                        `${selectedMember?.firstname?.[0] || ""}${
                          selectedMember?.lastname?.[0] || ""
                        }`.toUpperCase() || "U"
                      }
                      className="h-10 w-10 flex-shrink-0 text-xs"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {selectedMember?.firstname} {selectedMember?.lastname}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        @{selectedMember?.username}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Position / Role *
                    </label>
                    <input
                      type="text"
                      name="position"
                      required
                      value={editForm.position}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a6f2] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Short bio
                    </label>
                    <textarea
                      name="bio"
                      rows={3}
                      value={editForm.bio}
                      onChange={handleEditFormChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a6f2] transition resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        LinkedIn URL
                      </label>
                      <input
                        type="text"
                        name="linkedin"
                        value={editForm.linkedin}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a6f2] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        GitHub URL
                      </label>
                      <input
                        type="text"
                        name="github"
                        value={editForm.github}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#78a6f2] transition"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 dark:border-slate-800 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 text-sm font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-[#1E3A8A] to-blue-700 hover:opacity-95 transition shadow-lg shadow-blue-500/10"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
