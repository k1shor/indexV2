// app/login/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { GiThreeLeaves } from "react-icons/gi";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { authenticate, userLogin } from "@/pages/api/userApi";
import jwt from "jsonwebtoken"; // ✅ use jsonwebtoken

// ✅ Metadata for SEO + Social sharing
export const metadata = {
  title: "Login | Index IT Hub",
  description:
    "Sign in to Index IT Hub to manage your account, projects, and dashboard securely.",
  keywords: ["Index IT Hub", "Login", "User Authentication", "Dashboard"],
  openGraph: {
    title: "Login - Index IT Hub",
    description: "Secure login page for Index IT Hub users.",
    url: "https://indexithub.com/login",
    siteName: "Index IT Hub",
    images: [
      {
        url: "https://indexithub.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Index IT Hub Login Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  let [error, setError] = useState("");
  let [success, setSuccess] = useState(false);

  const router = useRouter();
  const { email, password } = formData;

  // ✅ helper function to redirect based on role
  const redirectByRole = (token) => {
    try {
      const decoded = jwt.decode(token); // ⬅️ decode payload without secret
      const role = decoded?.role;
      if (role === 0) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("JWT decode error:", err);
      router.push("/"); // fallback
    }
  };

  // ✅ Check token in localStorage when page loads
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    let token = auth?.token
    if (token) {
      redirectByRole(token);
    }
  }, [router]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email?.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!password?.trim()) {
      setError("Please enter your password");
      return;
    }

    try {
      setSubmitting(true);
      const data = await userLogin({ email, password });

      if (data?.error) {
        setSuccess(false);
        setError(data.error);
      } else {
        setError("");
        setSuccess(true);
        authenticate(data); // ⬅️ stores JWT in localStorage
        // localStorage.setItem("token", data.token); // ensure token stored
        redirectByRole(data.token); // ✅ redirect based on role
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        toast: true,
        title: "Error",
        text: error,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        color: "#d33",
      });
      setError("");
    }
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md border border-blue-200/60 shadow-2xl rounded-3xl p-8">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-800">Log</h1>
            <GiThreeLeaves className="text-blue-700 text-3xl" />
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-800">In</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <label htmlFor="email" className="block">
              <div className="flex items-center gap-2 text-blue-900 font-medium mb-1">
                <span className="md:text-base text-sm">Email</span>
                <MdEmail className="text-lg" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email..."
                value={email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-blue-200 bg-white/60 px-3 py-2 text-sm md:text-base placeholder:text-blue-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200/60 focus:border-blue-400 transition"
              />
            </label>

            {/* Password */}
            <label htmlFor="password" className="block">
              <div className="flex items-center gap-2 text-blue-900 font-medium mb-1">
                <span className="md:text-base text-sm">Password</span>
                <FaUnlockKeyhole className="text-base" />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter your password..."
                  value={password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-blue-200 bg-white/60 px-3 py-2 text-sm md:text-base placeholder:text-blue-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200/60 focus:border-blue-400 transition pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
                </button>
              </div>
            </label>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="remember"
                className="flex items-center gap-2 text-sm md:text-base text-blue-900"
              >
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-blue-300 accent-blue-600"
                />
                <span>Remember me</span>
              </label>

              <Link
                href="/forgetpassword"
                className="text-sm md:text-base font-medium text-blue-700 hover:text-blue-800 hover:underline transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold text-sm md:text-base hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Signing in…" : "Login"}
            </button>

            {/* Register */}
            <p className="text-center text-sm md:text-base text-blue-900">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-700 font-semibold hover:text-blue-800 hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </div>

        {/* Decorative ring */}
        <div className="mt-6 h-2 w-44 mx-auto rounded-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 opacity-70" />
      </div>
    </div>
  );
};

export default Login;
