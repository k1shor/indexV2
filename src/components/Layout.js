import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";
import { BsArrowUp } from "react-icons/bs";

const Layout = ({ children }) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      {children}
      <ChatWidget />

      {showButton && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-[997] rounded-full bg-[#13294b] p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-slate-950 dark:bg-brand-light dark:text-slate-950 dark:hover:bg-[#4F96EE] sm:right-8"
          aria-label="Scroll to top"
        >
          <BsArrowUp className="h-4 w-4" />
        </button>
      )}

      <Footer />
    </>
  );
};

export default Layout;
