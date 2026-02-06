"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import {
  FaHome,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaInfoCircle,
  FaBriefcase,
  FaProjectDiagram,
  FaQuestionCircle,
  FaServicestack,
  FaMoon,
  FaSun
} from "react-icons/fa";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <FaHome /> },
    { name: "Users", href: "/admin/users", icon: <FaUsers /> },
    { name: "Reports", href: "/admin/reports", icon: <FaChartBar /> },
    { name: "About Page", href: "/admin/about", icon: <FaInfoCircle /> },
    { name: "Services Page", href: "/admin/services", icon: <FaServicestack /> },
    { name: "WHY Index?", href: "/admin/why-index", icon: <FaQuestionCircle /> },
    { name: "Projects Section", href: "/admin/projects", icon: <FaProjectDiagram /> },
    { name: "Career Section", href: "/admin/careers", icon: <FaBriefcase /> },
    { name: "Blogs", href: "/admin/blogs", icon: <FaChartBar /> },
  ];

  // 🟥 LOGOUT HANDLER — Clears cookies + localStorage + redirects
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("auth");

    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const eq = cookie.indexOf("=");
      const name = eq > -1 ? cookie.substring(0, eq) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Redirect to login page
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col transition-colors duration-300 fixed min-h-screen">

        {/* Logo */}
        <div className="px-6 py-4 text-2xl font-bold text-blue-600 dark:text-blue-400 border-b dark:border-gray-700">
          Admin Panel
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${pathname === item.href
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600"
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Footer: Logout + Theme Toggle */}
        <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between">

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>

          {/* THEME TOGGLE */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-64 transition-colors duration-300">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-right">
            Welcome, <span className="font-medium">Admin</span>
          </h1>
        </header>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
