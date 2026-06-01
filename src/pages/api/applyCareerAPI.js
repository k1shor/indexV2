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

export const applyCareer = async (career) => {
  const res = await fetch(`${API}/apply_career`, {
    method: "POST",
    body: career,
  });

  return parseJson(res);
};

export const getAppliedCareer = async () => {
  const res = await fetch(`${API}/view_appliedcareer`, {
    headers: getAuthHeaders(),
  });

  return parseJson(res);
};

export const getAppliedCareerByCareer = async (id) => {
  const res = await fetch(`${API}/view_appliedcareer/${id}`, {
    headers: getAuthHeaders(),
  });

  return parseJson(res);
};

export const updateAppliedCareer = async (id, payload) => {
  const res = await fetch(`${API}/view_appliedcareer/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return parseJson(res);
};

export const deleteAppliedCareer = async (id) => {
  const res = await fetch(`${API}/view_appliedcareer/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return parseJson(res);
};
