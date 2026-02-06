// components/ConfirmModal.jsx
"use client";
import React from "react";

export default function ConfirmModal({
  open,
  title = "Confirm",
  children,
  onConfirm,
  onCancel,
  closeOnOverlay = true,
}) {
  if (!open) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlay) onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-11/12 max-w-md p-6 
                   border border-gray-200 dark:border-gray-700 
                   animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          {title}
        </h3>

        {/* Body */}
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          {children}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600
                       bg-gray-100 dark:bg-gray-800 
                       text-gray-800 dark:text-gray-200 
                       hover:bg-gray-200 dark:hover:bg-gray-700 
                       transition-all"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md 
                       bg-red-600 hover:bg-red-700 active:bg-red-800
                       text-white font-medium shadow transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
