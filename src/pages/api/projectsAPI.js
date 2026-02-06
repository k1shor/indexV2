// services/projectAPI.js
// const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

import { API } from "@/consts";

/**
 * Fetch all projects
 */
export async function getAllProjects() {
    try {
        const res = await fetch(`${API}/projects`);
        if (!res.ok) throw new Error("Failed to fetch projects");
        return await res.json();
    } catch (error) {
        console.error("getAllProjects:", error);
        return [];
    }
}

/**
 * Fetch single project by slug
 */
export async function getProjectBySlug(slug) {
    try {
        const res = await fetch(`${API}/projects/${slug}`);
        if (!res.ok) throw new Error("Project not found");
        return await res.json();
    } catch (error) {
        console.error("getProjectBySlug:", error);
        return null;
    }
}

/**
 * Create a new project (admin)
 */
export async function createProject(formData) {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/projects`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error("createProject:", error);
        return { error: error.message };
    }
}

/**
 * Update existing project by ID (admin)
 */
export async function updateProject(id, formData, token) {
    try {
        const res = await fetch(`${API}/projects/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error("updateProject:", error);
        return { error: error.message };
    }
}

/**
 * Delete project by ID (admin)
 */
export async function deleteProject(id, token) {
    try {
        const res = await fetch(`${API}/projects/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return await res.json();
    } catch (error) {
        console.error("deleteProject:", error);
        return { error: error.message };
    }
}
