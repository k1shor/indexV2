"use client";

import { useState, useRef } from "react";

export default function DragDropImageUploader({ onFileSelect }) {
    const [preview, setPreview] = useState(null);
    const dropRef = useRef();

    const handleFiles = (file) => {
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        onFileSelect(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        handleFiles(file);
        dropRef.current.classList.remove("border-blue-500", "bg-blue-50/20");
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        dropRef.current.classList.add("border-blue-500", "bg-blue-50/20");
    };

    const handleDragLeave = () => {
        dropRef.current.classList.remove("border-blue-500", "bg-blue-50/20");
    };

    const openFilePicker = () => {
        document.getElementById("hidden-file-input").click();
    };

    return (
        <div className="w-full space-y-4">
            {/* DRAG BOX */}
            <div
                ref={dropRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={openFilePicker}
                className="
                    w-full h-48 flex flex-col items-center justify-center
                    border-2 border-dashed border-gray-400 dark:border-gray-600
                    rounded-xl cursor-pointer select-none
                    transition-all
                    bg-gray-50 dark:bg-gray-800/40
                "
            >
                {!preview ? (
                    <div className="text-center">
                        <p className="text-gray-700 dark:text-gray-200 font-medium">
                            Drag & Drop image here
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            or click to browse
                        </p>
                    </div>
                ) : (
                    <img
                        src={preview}
                        alt="Preview"
                        className="h-full object-contain rounded-lg p-2"
                    />
                )}
            </div>

            {/* Hidden file input */}
            <input
                id="hidden-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files[0])}
            />

            {/* Remove button */}
            {preview && (
                <button
                    onClick={() => {
                        setPreview(null);
                        onFileSelect(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                    Remove Image
                </button>
            )}
        </div>
    );
}
