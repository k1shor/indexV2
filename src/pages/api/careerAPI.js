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

export const addCareer = async (career) => {
  const res = await fetch(`${API}/career/add_career`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(career),
  });

  return parseJson(res);
};

export const view_career = async () => {
  const res = await fetch(`${API}/career/view_career`);
  return parseJson(res);
};

export const getAdminCareers = async () => {
  const res = await fetch(`${API}/career/admin/all`, {
    headers: getAuthHeaders(),
  });

  return parseJson(res);
};

export const getCareerDetails = async (id) => {
  const res = await fetch(`${API}/career/view_careerdetailsbyid/${id}`);
  return parseJson(res);
};

export const updateCareer = async (id, career) => {
  const res = await fetch(`${API}/career/update_career/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(career),
  });

  return parseJson(res);
};

export const deleteCareer = async (id) => {
  const res = await fetch(`${API}/career/delete_career/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return parseJson(res);
};
