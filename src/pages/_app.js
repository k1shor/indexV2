import "@/styles/globals.css";
import { Raleway as myfont } from "next/font/google";

import { isAuthenticated, isAdminUser } from "@/pages/api/userApi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

import AdminLayout from "@/components/admin/AdminLayout";
import Layout from "@/components/Layout";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "next/head";

const poppins = myfont({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-poppins",
});

// Pages that render WITHOUT the Header/Footer Layout
const NO_LAYOUT_ROUTES = [
  // "/login",
  // "/register",
  "/verify",
  "/resetpassword",
  "/forgetpassword",
];

// Pages that logged-in users should NOT be able to visit
const AUTH_ONLY_ROUTES = ["/login", "/register"];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const canonicalUrl = `https://indexithub.com${
    router.asPath === "/" ? "" : router.asPath
  }`;

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const route = router.pathname;
      const adminRoute = route.startsWith("/admin");
      const token = isAuthenticated();

      // ── Guard: already logged in → block /login and /register ──
      const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some(
        (path) => route === path || route.startsWith(path + "/")
      );

      if (isAuthOnlyRoute && token) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: "You are already logged in",
          text: "Redirecting you to the home page…",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#1E3A8A",
          color: "#ffffff",
          iconColor: "#78a6f2",
        });
        router.replace("/");
        return;
      }

      if (!adminRoute) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Admin route: check both token AND role
      const adminAllowed = isAdminUser();

      if (!token) {
        router.replace("/login");
        return;
      }

      if (!adminAllowed) {
        router.replace("/");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAuth();
  }, [router.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Checking authentication...
      </div>
    );
  }

  // Check if current route should have no layout (login, register, etc.)
  const isNoLayout = NO_LAYOUT_ROUTES.some(
    (path) => router.pathname === path || router.pathname.startsWith(path + "/")
  );

  return (
    <ThemeProvider>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <main className={poppins.className}>
        {isAdmin ? (
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        ) : isNoLayout ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </main>
    </ThemeProvider>
  );
}
