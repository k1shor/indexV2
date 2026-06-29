"use client";
const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── USER ────────────────────────────────────────────────────────────────────

// Submit a join-the-team request (logged-in user)
export const applyToTeam = (data, token) => {
  return fetch(`${API}/team/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

// Get the current user's own request status
export const getMyTeamRequest = (token) => {
  return fetch(`${API}/team/my-request`, {
    headers: { Authorization: token },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

// Withdraw a pending request
export const withdrawTeamRequest = (token) => {
  return fetch(`${API}/team/my-request`, {
    method: "DELETE",
    headers: { Authorization: token },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

// ─── PUBLIC ──────────────────────────────────────────────────────────────────

// Get all approved team members (no auth needed)
export const getPublicTeam = () => {
  return fetch(`${API}/team/public`)
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

// ─── ADMIN ───────────────────────────────────────────────────────────────────

// Get all requests with optional status filter + pagination
export const getAllTeamRequests = (
  token,
  status = "",
  page = 1,
  limit = 10
) => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.set("status", status);
  return fetch(`${API}/team?${params.toString()}`, {
    headers: { Authorization: token },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

// Get a single request by ID
export const getTeamRequestById = (id, token) => {
  return fetch(`${API}/team/${id}`, {
    headers: { Authorization: token },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

// Approve a request
export const approveTeamRequest = (id, token, adminNote = "") => {
  return fetch(`${API}/team/${id}/approve`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ adminNote }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

// Reject a request
export const rejectTeamRequest = (id, token, adminNote = "") => {
  return fetch(`${API}/team/${id}/reject`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ adminNote }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

// Delete a request record
export const deleteTeamRequest = (id, token) => {
  return fetch(`${API}/team/${id}`, {
    method: "DELETE",
    headers: { Authorization: token },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

// Search registered users not yet on the team (for the "Add Member" picker)
export const searchEligibleUsers = (token, search = "") => {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  return fetch(`${API}/team/eligible-users?${params.toString()}`, {
    headers: { Authorization: token },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

// Directly add an existing registered user as an approved team member
export const addExistingUserAsMember = (data, token) => {
  return fetch(`${API}/team/add-existing`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

// Update an existing team member's details (position/bio/links)
export const updateTeamRequest = (id, data, token) => {
  return fetch(`${API}/team/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};
