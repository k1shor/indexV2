import { API } from "@/consts";

const getToken = () => {
  if (typeof window === "undefined") return "";

  const auth = localStorage.getItem("auth");
  if (auth) {
    try {
      return JSON.parse(auth)?.token || "";
    } catch {
      return "";
    }
  }

  return localStorage.getItem("token") || "";
};

const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseJson = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }
  return data;
};

const formDataToObject = (payload) => {
  if (typeof FormData === "undefined" || !(payload instanceof FormData)) {
    return payload;
  }

  const output = {};
  payload.forEach((value, key) => {
    if (typeof File !== "undefined" && value instanceof File) return;
    output[key] = value;
  });
  return output;
};

export async function getAllProjects() {
  const res = await fetch(`${API}/projects`);
  return parseJson(res);
}

export async function getAdminProjects() {
  const res = await fetch(`${API}/projects/admin/all`, {
    headers: getAuthHeaders(),
  });

  return parseJson(res);
}

export async function getProjectDetails(id) {
  const res = await fetch(`${API}/projects/id/${id}`, {
    headers: getAuthHeaders(),
  });

  return parseJson(res);
}

export async function getProjectBySlug(slug) {
  const res = await fetch(`${API}/projects/${slug}`);
  return parseJson(res);
}

export async function createProject(payload) {
  const res = await fetch(`${API}/projects`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(formDataToObject(payload)),
  });

  return parseJson(res);
}

export async function updateProject(id, payload) {
  const res = await fetch(`${API}/projects/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(formDataToObject(payload)),
  });

  return parseJson(res);
}

export async function deleteProject(id) {
  const res = await fetch(`${API}/projects/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return parseJson(res);
}
