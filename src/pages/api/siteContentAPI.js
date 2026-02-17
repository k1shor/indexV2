export async function getMissionVision() {
  const base =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "";

  if (!base) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_BACKEND_URL");
  }

  // ✅ Backend endpoint you should provide:
  // GET {base}/api/site-content/mission-vision
  const res = await fetch(`${base}/api/site-content/mission-vision`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Mission/Vision load failed (${res.status}): ${text || res.statusText}`);
  }

  return res.json();
}
