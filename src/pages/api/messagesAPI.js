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

const getErrorMessage = async (res) => {
  try {
    const data = await res.json();
    return data.error || data.message || "Request failed";
  } catch {
    return "Request failed";
  }
};

const parseJson = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }
  return data;
};

const toQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const stringQuery = query.toString();
  return stringQuery ? `?${stringQuery}` : "";
};

export const getPublicFaqs = async () => {
  const res = await fetch(`${API}/messages/faqs`);
  return parseJson(res);
};

export const createPublicMessage = async (payload) => {
  const res = await fetch(`${API}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseJson(res);
};

export const askChatbot = async (payload) => {
  const res = await fetch(`${API}/messages/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseJson(res);
};

export const getAdminMessages = async (params = {}) => {
  const res = await fetch(`${API}/messages/admin${toQuery(params)}`, {
    headers: getAuthHeaders(),
  });

  return parseJson(res);
};

export const getAdminMessageStats = async () => {
  const res = await fetch(`${API}/messages/admin/stats`, {
    headers: getAuthHeaders(),
  });

  return parseJson(res);
};

export const updateAdminMessage = async (id, payload) => {
  const res = await fetch(`${API}/messages/admin/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return parseJson(res);
};

export const replyToAdminMessage = async (id, payload) => {
  const res = await fetch(`${API}/messages/admin/${id}/reply`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return parseJson(res);
};

export const deleteAdminMessage = async (id) => {
  const res = await fetch(`${API}/messages/admin/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return res.json();
};

export const getAdminFaqs = async (params = {}) => {
  const res = await fetch(`${API}/messages/admin/faqs${toQuery(params)}`, {
    headers: getAuthHeaders(),
  });

  return parseJson(res);
};

export const createAdminFaq = async (payload) => {
  const res = await fetch(`${API}/messages/admin/faqs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return parseJson(res);
};

export const updateAdminFaq = async (id, payload) => {
  const res = await fetch(`${API}/messages/admin/faqs/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return parseJson(res);
};

export const deleteAdminFaq = async (id) => {
  const res = await fetch(`${API}/messages/admin/faqs/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return res.json();
};
