import "@/styles/globals.css";
import { Raleway as myfont } from "next/font/google";

import { isAuthenticated } from "@/pages/api/userApi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import AdminLayout from "@/components/admin/AdminLayout";
import Layout from "@/components/Layout";
import { ThemeProvider } from "@/components/theme-provider";

const poppins = myfont({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-poppins",
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const canonicalUrl = `https://indexithub.com${router.asPath === "/" ? "" : router.asPath}`;


  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const route = router.pathname;

      const adminRoute = route.startsWith("/admin");

      const auth = await isAuthenticated(); // your custom API

      if (adminRoute && !auth) {
        router.replace("/login");
        return;
      }

      setIsAdmin(adminRoute && auth); // admin layout only for admin pages
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
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </main>
    </ThemeProvider>
  );
}
