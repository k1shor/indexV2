"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UsersRound, Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import {
  getPublicTeam,
  updateUser,
  deleteUser,
  userRegister,
} from "../pages/api/userApi";

const FALLBACK_TEAM_IMAGE = "/team-placeholder.png";

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function TeamMembersSection() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [token, setToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const [selectedMember, setSelectedMember] = useState(null);
  const [fileInput, setFileInput] = useState(null);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    position: "",
    gender: "Other",
    age: "25",
    phonenumber: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        setToken(parsed.token);
        if (parsed.user && parsed.user.role >= 1) {
          setIsAdminUser(true);
        }
      }
    }
    fetchTeamMembers();
  }, []);

 const fetchTeamMembers = async () => {
  try {
    setLoading(true);
    setError("");
    
    const data = await getPublicTeam(); 
    
    const list = data?.data || data?.users || (Array.isArray(data) ? data : []);
    setTeam(list);
  } catch (err) {
    console.error(err);
    setError("Failed to load team members.");
  } finally {
    setLoading(false);
  }
};

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      position: "",
      gender: "Other",
      age: "25",
      phonenumber: "0000000000",
    });
    setFileInput(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setModalMode("edit");
    setSelectedMember(member);
    setFormData({
      firstname: member.firstname || "",
      lastname: member.lastname || "",
      username: member.username || "",
      email: member.email || "",
      password: "",
      position: member.position || "",
      gender: member.gender || "Other",
      age: member.age || "25",
      phonenumber: member.phonenumber || "",
    });
    setFileInput(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (modalMode === "edit" && key === "password") return; 
      dataToSend.append(key, formData[key]);
    });

    if (fileInput) {
      dataToSend.append("image", fileInput);
    }

    try {
      let res;
      if (modalMode === "add") {
        res = await userRegister(dataToSend);
      } else {
        res = await updateUser(selectedMember._id, dataToSend, token);
      }

      if (res?.error) {
        alert(res.error);
      } else {
        setIsModalOpen(false);
        fetchTeamMembers();
      }
    } catch (err) {
      alert("Something went wrong. Please check your data variables.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      try {
        const res = await deleteUser(id, token);
        if (res?.error) {
          alert(res.error);
        } else {
          fetchTeamMembers();
        }
      } catch (err) {
        alert("Action failed.");
      }
    }
  };

  return (
    <section className="bg-slate-50 py-20 dark:bg-[#0b1624] lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-[#78a6f2]">
              Our Teams
            </p>
            <h2 className="text-3xl font-extrabold leading-tight text-[#1E3A8A] dark:text-white md:text-5xl">
              Meet the People Behind the Work
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300 max-w-2xl">
              A focused group of engineers, designers, and strategists committed
              to building fast, secure, and scalable solutions.
            </p>
          </div>

          {isAdminUser && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-white dark:text-[#1E3A8A] dark:hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" /> Add Team Member
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">
            Loading team...
          </div>
        ) : team.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => {
              const imageSrc = member?.image || FALLBACK_TEAM_IMAGE;
              return (
                <motion.div
                  key={member._id}
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition dark:border-white/10 dark:bg-white/[0.04]"
                >
                  {/* Image Display */}
                  <div className="relative h-64 w-full bg-slate-100 dark:bg-slate-950">
                    <img
                      src={imageSrc}
                      alt={`${member?.firstname} team profile`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_TEAM_IMAGE;
                      }}
                    />

                    {/* Admin management actions hover layer */}
                    {isAdminUser && (
                      <div className="absolute right-3 top-3 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-200 z-20">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-2 rounded-md bg-white/90 text-slate-800 shadow-sm hover:bg-white transition"
                          title="Edit Member"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="p-2 rounded-md bg-red-600/90 text-white shadow-sm hover:bg-red-600 transition"
                          title="Delete Member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  </div>

                  {/* Member Bio Information */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1E3A8A] dark:text-white">
                      {member?.firstname} {member?.lastname}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-[#78a6f2] dark:text-[#7ddfff]">
                      {member?.position || "Team Contributor"}
                    </p>
                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 italic">
                      @{member?.username || "member"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
            <UsersRound className="mx-auto mb-3 h-8 w-8 text-[#78a6f2]" />
            No team members found.
          </div>
        )}
      </div>

      {/* Admin Action Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg overflow-y-auto max-h-[90vh] rounded-xl bg-white p-6 shadow-xl dark:bg-[#0d1a2b] border dark:border-slate-800 text-slate-900 dark:text-white"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-2xl font-bold text-[#1E3A8A] dark:text-white mb-6">
                {modalMode === "add" ? "Register Team Member" : "Edit Details"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      required
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      required
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {modalMode === "add" && (
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Position / Company Role
                  </label>
                  <input
                    type="text"
                    name="position"
                    placeholder="e.g., Senior Frontend Architect"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-800 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Profile Photo Image
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                      <Upload className="h-4 w-4 text-slate-400" />
                      <span className="text-xs text-slate-500">
                        Choose file...
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setFileInput(e.target.files[0])}
                      />
                    </label>
                    {fileInput && (
                      <span className="text-xs text-emerald-500 truncate max-w-[200px]">
                        {fileInput.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-bold rounded-lg text-white bg-[#1E3A8A] hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
