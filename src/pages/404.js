import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { fadeUp, stagger } from "@/components/premiumMotion";

export default function Custom404() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#eef6ff_48%,#dbeafe_100%)] px-6 py-28 text-slate-950 dark:bg-[linear-gradient(135deg,#0b1526_0%,#13294b_48%,#2f6faa_100%)] dark:text-white">
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-45 dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-center justify-center opacity-35 dark:opacity-20">
        <Image
          src="/404b.jpg"
          alt="404 background"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-white/55 backdrop-blur-sm dark:bg-[#0b1526]/62" />

      <motion.section
        variants={stagger(0.12)}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <motion.div variants={fadeUp} className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#13294b]/10 bg-white/70 px-4 py-2 text-sm font-bold text-[#1E3A8A] shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/10 dark:text-white">
          <Sparkles className="h-4 w-4 text-brand-light" />
          Page not found
        </motion.div>

        <motion.h1 variants={fadeUp} className="text-7xl font-extrabold leading-none text-[#1E3A8A] dark:text-white sm:text-8xl">
          404
        </motion.h1>
        <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-700 dark:text-slate-200 sm:text-2xl">
          The page you are looking for does not exist or may have moved.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-light px-6 text-sm font-bold text-slate-950 shadow-lg shadow-blue-950/20 transition hover:bg-[#4F96EE]"
          >
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}
