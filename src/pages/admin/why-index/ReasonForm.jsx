"use client";
import { useState, useEffect } from "react";

export default function ReasonForm({ onSubmit, editingReason, onCancel }) {
  const [reason, setReason] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editingReason) {
      setReason(editingReason.reason);
      setPreview(
        editingReason.reason_image
          ? process.env.NEXT_PUBLIC_BACKEND_URL + editingReason.reason_image
          : null
      );
    } else {
      setReason("");
      setPreview(null);
      setImage(null);
    }
  }, [editingReason]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return alert("Reason is required");

    const formData = new FormData();
    formData.append("reason", reason);
    if (image) formData.append("reason_image", image);

    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 border border-gray-200 dark:border-gray-700 transition">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-start md:items-center gap-6"
      >
        <div className="flex-1 w-full">
          <label className="block font-semibold mb-1 text-gray-800 dark:text-gray-200">
            Reason
          </label>

          <textarea
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason..."
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-md p-3 focus:ring-2 focus:ring-blue-400 resize-none "
            rows={10}
          />
        </div>
<div className=" text-center px-5 py-10">
        <div className="flex flex-col items-center">
          <label className="font-semibold mb-1 text-gray-800 dark:text-gray-200">
            Image (optional)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setImage(file);
              setPreview(URL.createObjectURL(file));
            }}
            className="mb-3 text-gray-800 dark:text-gray-200"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-40 object-cover rounded-md border border-gray-300 dark:border-gray-600"
            />
          )}
        </div>

        <div className="flex justify-evenly w-3/4 mx-auto mt-5">
          <button
            type="submit"
            className="bg-blue-600 dark:bg-blue-500 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all"
          >
            {editingReason ? "Update" : "Add"}
          </button>

          {editingReason && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-400 dark:bg-gray-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-gray-500 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
        </div>
      </form>
    </div>
  );
}
