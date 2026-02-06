// lib/api/services.js
// Handles all service-related API calls

import { API } from "@/consts";

export const getAllServices = async () => {
  try {
    const res = await fetch(`${API}/services`, { cache: "no-store" });
    if (!res.ok) throw new Error(res.error);
    return await res.json();
  } catch (error) {
    console.error("getAllServices error:", error);
    throw error;
  }
};

export const getServiceById = async (id) => {
  try {
    const res = await fetch(`${API}/services/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error(res.error);
    return await res.json();
  } catch (error) {
    console.error("getServiceById error:", error);
    throw error;
  }
};

export const createService = async (data) => {
  try {
    const {token} = JSON.parse(localStorage.getItem("auth"));
    const res = await fetch(`${API}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.error);
    return await res.json();
  } catch (error) {
    console.error("createService error:", error);
    throw error;
  }
};

export const updateService = async (id, data) => {
  try {
    const {token} = JSON.parse(localStorage.getItem("auth"));
    const res = await fetch(`${API}/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.error);
    return await res.json();
  } catch (error) {
    console.error("updateService error:", error);
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const {token} = JSON.parse(localStorage.getItem("auth"));
    const res = await fetch(`${API}/services/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(res.error);
    return await res.json();
  } catch (error) {
    console.error("deleteService error:", error);
    throw error;
  }
};
