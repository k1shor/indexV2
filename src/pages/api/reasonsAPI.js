const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/reasons";

// ✅ Get all reasons
export const getReasons = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch reasons");
  return res.json();
};

// ✅ Create a reason
export const createReason = async (formData) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to create reason");
  return res.json();
};

// ✅ Update a reason
export const updateReason = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update reason");
  return res.json();
};

// ✅ Delete a reason
export const deleteReason = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete reason");
  return res.json();
};
