"use client";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import ReasonForm from "./ReasonForm";
import ReasonsList from "./ReasonsList";
import {
  createReason,
  updateReason,
  deleteReason,
  getReasons,
} from "@/pages/api/reasonsAPI";

export default function ReasonsAdminPage() {
  const [reasons, setReasons] = useState([]);
  const [editingReason, setEditingReason] = useState(null);

  const loadReasons = async () => {
    try {
      const data = await getReasons();
      setReasons(Array.isArray(data) ? data : []);
    } catch {
      Swal.fire("Error", "Failed to load reasons.", "error");
    }
  };

  useEffect(() => {
    loadReasons();
  }, []);

  // 🔢 ORDER BY SN (ASC), fallback to createdAt
  const sortedReasons = useMemo(() => {
    const list = [...reasons];
    return list.sort((a, b) => {
      const aSn = Number.isFinite(Number(a?.sn)) ? Number(a.sn) : Number.POSITIVE_INFINITY;
      const bSn = Number.isFinite(Number(b?.sn)) ? Number(b.sn) : Number.POSITIVE_INFINITY;
      if (aSn !== bSn) return aSn - bSn;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [reasons]);

  const handleSubmit = async (formData) => {
    try {
      if (editingReason) {
        await updateReason(editingReason._id, formData);
        Swal.fire("Updated!", "Reason updated successfully!", "success");
      } else {
        await createReason(formData);
        Swal.fire("Created!", "Reason added successfully!", "success");
      }
      setEditingReason(null);
      loadReasons();
    } catch {
      Swal.fire("Error", "Operation failed.", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteReason(id);
          Swal.fire("Deleted!", "Reason removed successfully.", "success");
          loadReasons();
        } catch {
          Swal.fire("Error", "Failed to delete reason.", "error");
        }
      }
    });
  };

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-8 text-center">
        “Why Choose Index IT Hub” Reasons
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition">
        <ReasonForm
          onSubmit={handleSubmit}
          editingReason={editingReason}
          onCancel={() => setEditingReason(null)}
        />
      </div>

      {sortedReasons.length > 0 && (
        <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition">
          <ReasonsList
            reasons={sortedReasons}
            onEdit={setEditingReason}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}
