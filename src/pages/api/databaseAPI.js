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

const getErrorMessage = async (res) => {
  try {
    const data = await res.json();
    return data.error || data.message || "Request failed";
  } catch {
    return "Request failed";
  }
};

const getFilename = (res) => {
  const disposition = res.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match?.[1] || `indexithub-backup-${new Date().toISOString()}.json`;
};

export const downloadDatabaseBackup = async () => {
  const token = getToken();
  const res = await fetch(`${API}/admin/database/backup`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
  }

  return {
    blob: await res.blob(),
    filename: getFilename(res),
  };
};

export const previewDatabaseRestore = async (file) => {
  const token = getToken();
  const formData = new FormData();
  formData.append("backup", file);
  formData.append("dryRun", "true");

  const res = await fetch(`${API}/admin/database/restore`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Backup validation failed");
  }

  return data;
};

export const restoreDatabaseBackup = async (file) => {
  const token = getToken();
  const formData = new FormData();
  formData.append("backup", file);
  formData.append("confirmRestore", "true");

  const res = await fetch(`${API}/admin/database/restore`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Database restore failed");
  }

  return data;
};
