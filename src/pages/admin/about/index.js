"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { addAbout, getAbout, updateAbout } from "@/pages/api/aboutAPI";
import { API } from "@/consts";
import DragDropImageUploader from "@/components/admin/DragDropImageUploader";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AdminAboutPage = () => {
    const [about, setAbout] = useState({
        description: "",
        image: null,
        imageUrl: "",
    });

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const data = await getAbout();
                if (!data.error) {
                    setAbout({
                        description: data.description || "",
                        image: null,
                        imageUrl: data.image || "",
                    });

                    setDescription(data.description || "");
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchAbout();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setAbout({ ...about, image: file });
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("description", description);
        if (about.image) formData.append("image-about", about.image);

        try {
            setLoading(true);

            let data;
            if (about.imageUrl || about.description) {
                data = await updateAbout(formData);
            } else {
                data = await addAbout(formData);
            }

            if (!data.error) {
                alert("About section saved successfully!");
                setAbout({
                    description: data.description,
                    image: null,
                    imageUrl: data.image || about.imageUrl,
                });
                setDescription(data.description || "");
                setShowForm(false);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to save About section");
        } finally {
            setLoading(false);
        }
    };

    const config = { readonly: false, toolbar: true };

    /** Reusable UI classes */
    const card =
        "border rounded-xl p-6 bg-white dark:bg-gray-900 dark:border-gray-700 " +
        "text-gray-900 dark:text-gray-100 shadow-sm";

    const input =
        "mt-1 w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 " +
        "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";

    const primaryBtn =
        "px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white";

    const secondaryBtn =
        "px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white";

    const successBtn =
        "px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white";

    return (
            <div className="space-y-8">

                {/* ==========================================================
                    CURRENT ABOUT SECTION (Improved visibility + side-by-side)
                =========================================================== */}
                <div className={card}>
                    <h2 className="text-2xl font-semibold mb-4">Current About Section</h2>

                    {about.description || about.imageUrl ? (
                        <div className="flex flex-col md:flex-row gap-6 items-start">

                            {/* LEFT: Text */}
                            <div className="flex-1 prose dark:prose-invert max-w-none leading-relaxed">
                                <div
                                    dangerouslySetInnerHTML={{ __html: about.description }}
                                />
                            </div>

                            {/* RIGHT: Image */}
                            {about.imageUrl && (
                                <img
                                    src={`${API}/${about.imageUrl}`}
                                    alt="About Image"
                                    className="md:w-1/3 w-full rounded-lg shadow border dark:border-gray-700 object-cover"
                                />
                            )}

                        </div>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-300">
                            No About section added yet.
                        </p>
                    )}
                </div>

                {/* ACTION BUTTON */}
                {!showForm && (
                    <button onClick={() => setShowForm(true)} className={primaryBtn}>
                        {about.description || about.imageUrl
                            ? "Update About Section"
                            : "Add About Section"}
                    </button>
                )}

                {/* ==========================================================
                    FORM SECTION
                =========================================================== */}
                {showForm && (
                    <div className={card + " space-y-5"}>
                        <h2 className="text-2xl font-semibold mb-2">
                            {about.description || about.imageUrl
                                ? "Update About Section"
                                : "Add About Section"}
                        </h2>

                        {/* Editor */}
                        <div className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-2">
                            <JoditEditor
                                value={description}
                                config={config}
                                onBlur={(content) => setDescription(content)}
                                onChange={() => { }}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-6">
                            <label className="font-medium text-gray-900 dark:text-gray-100">Upload Image</label>

                            <DragDropImageUploader
                                onFileSelect={(file) => setAbout({ ...about, image: file })}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className={successBtn}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>

                            <button
                                onClick={() => setShowForm(false)}
                                className={secondaryBtn}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
    );
};

export default AdminAboutPage;
