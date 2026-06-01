"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function CreateProjectRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/projects");
  }, [router]);

  return <div className="text-gray-700 dark:text-gray-200">Opening project management...</div>;
}
