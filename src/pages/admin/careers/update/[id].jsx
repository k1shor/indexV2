"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function UpdateCareerRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/careers");
  }, [router]);

  return <div className="text-gray-700 dark:text-gray-200">Opening career management...</div>;
}
