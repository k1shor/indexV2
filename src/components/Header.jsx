import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Mail, Menu, Moon, Sun, X } from "lucide-react";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoTwitter,
} from "react-icons/io";

const navItems = [
  ["/", "Home"],
  ["/about", "About"],
  ["/service", "Services"],
  ["/project", "Projects"],
  ["/blog", "Blogs"],
  ["/career", "Career"],
];

const socials = [
  ["https://www.instagram.com/indexithub/", "Instagram", IoLogoInstagram],
  ["https://www.facebook.com/indexithub", "Facebook", IoLogoFacebook],
  ["https://www.linkedin.com/company/index-it-hub", "LinkedIn", IoLogoLinkedin],
  ["#", "Twitter", IoLogoTwitter],
];

const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header className="fixed inset-x-0 top-4 z-[999] bg-transparent px-3 text-[#1E3A8A] dark:text-gray-100 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto flex min-h-[76px] w-full max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/45 px-3 shadow-[0_18px_60px_rgba(19,41,75,0.16)] backdrop-blur-2xl dark:border-white/15 dark:bg-white/[0.08] dark:shadow-[0_18px_60px_rgba(3,12,28,0.28)] sm:px-5 lg:px-6">
        <Link
          href="/"
          className="group flex items-center"
          aria-label="Index IT Hub home"
          onClick={() => setMenuOpen(false)}
        >
          <span className="inline-flex rounded-xl bg-transparent transition dark:border dark:border-[#9fe6ff]/70 dark:bg-[#f8fcff]/95 dark:px-3 dark:py-2 dark:shadow-[0_18px_42px_rgba(0,185,255,0.18)] dark:ring-1 dark:ring-white/60">
            <Image
              src="/indexithub-logo.png"
              alt="Index IT Hub"
              width={500}
              height={120}
              className="h-auto w-[168px] cursor-pointer drop-shadow-[0_10px_18px_rgba(30,58,138,0.16)] sm:w-[190px] dark:drop-shadow-[0_10px_22px_rgba(0,185,255,0.18)]"
              priority
            />
          </span>
        </Link>

        <nav className="hidden items-center rounded-full bg-white/55 p-1 text-sm font-semibold shadow-inner shadow-white/30 ring-1 ring-white/60 backdrop-blur-xl dark:bg-white/[0.10] dark:ring-white/15 lg:flex">
          {navItems.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-4 py-2 transition ${
                isActive(href)
                  ? "bg-[#78a6f2] text-white shadow-sm dark:bg-white dark:text-neutral-950"
                  : "text-[#1E3A8A]/80 hover:bg-[#13294b]/10 hover:text-[#1E3A8A] dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/75 text-[#1E3A8A] shadow-sm ring-1 ring-white/50 transition hover:bg-white hover:shadow-md dark:bg-white/10 dark:text-slate-50 dark:ring-white/10 dark:hover:bg-white/15"
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#78a6f2] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#13294b]/20 transition hover:-translate-y-0.5 hover:bg-slate-950 dark:bg-brand-light dark:text-slate-50 dark:hover:bg-[#4F96EE]"
          >
            Let&apos;s Talk
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1E3A8A] shadow-sm ring-1 ring-white/50 transition dark:bg-gray-800 dark:text-gray-100 dark:ring-white/10"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[9998] bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`fixed right-0 top-0 z-[9999] flex h-screen w-[min(88vw,360px)] flex-col bg-brand-light p-5 text-[#1E3A8A] shadow-2xl shadow-slate-950/30 transition-transform duration-300 dark:bg-[linear-gradient(135deg,#0b1526_0%,#13294b_52%,#2f6faa_100%)] dark:text-gray-100 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#13294b]/15 pb-4 dark:border-white/10">
          <Link href="/" aria-label="Index IT Hub home" onClick={() => setMenuOpen(false)}>
            <span className="inline-flex rounded-xl bg-transparent dark:border dark:border-[#9fe6ff]/70 dark:bg-[#f8fcff]/95 dark:px-3 dark:py-2 dark:shadow-[0_18px_42px_rgba(0,185,255,0.18)] dark:ring-1 dark:ring-white/60">
              <Image src="/indexithub-logo.png" alt="Index IT Hub" width={500} height={120} priority className="h-auto w-[188px] drop-shadow-[0_10px_22px_rgba(30,58,138,0.16)] dark:drop-shadow-[0_10px_22px_rgba(0,185,255,0.18)]" />
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/75 shadow-sm ring-1 ring-white/50 transition dark:bg-white/10 dark:ring-white/10"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-7 flex flex-col gap-2">
          {[...navItems, ["/contact", "Contact"]].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`flex min-h-12 items-center justify-between rounded-lg px-4 text-base font-bold transition ${
                isActive(href)
                  ? "bg-white text-[#1E3A8A] shadow-sm dark:bg-white dark:text-neutral-950"
                  : "text-[#1E3A8A]/85 hover:bg-white/35 dark:text-gray-200 dark:hover:bg-white/10"
              }`}
            >
              {label}
              {isActive(href) && <ArrowRight className="h-4 w-4" />}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={toggleTheme}
          className="mt-6 flex min-h-12 items-center justify-between rounded-lg bg-white/35 px-4 text-sm font-bold ring-1 ring-white/25 transition hover:bg-white/50 dark:bg-white/10 dark:ring-white/10"
          aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
        >
          <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-300" />}
        </button>

        <div className="mt-auto border-t border-[#13294b]/15 pt-5 dark:border-white/10">
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#13294b] px-5 py-3 font-bold text-white shadow-lg shadow-[#13294b]/20 transition hover:bg-slate-950 dark:bg-brand-light dark:text-slate-950"
          >
            Start a Project
            <Mail className="h-4 w-4" />
          </Link>

          <div className="mt-5 flex items-center justify-center gap-4 text-2xl">
            {socials.map(([href, label, Icon]) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="transition hover:text-slate-950 dark:hover:text-brand-light"
              >
                <Icon />
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </header>
  );
};

export default Header;
