import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-400 dark:bg-slate-900 text-white dark:text-gray-300 py-6 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        
        {/* Navigation Links */}
        <div className="flex justify-center space-x-6 mb-4">
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            About
          </Link>
          <Link
            href="/service"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Services
          </Link>
          <Link
            href="/project"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Project
          </Link>
          <Link
            href="/blog"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Blogs
          </Link>
          <Link
            href="/career"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Career
          </Link>
          <Link
            href="/contact"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-4 mb-4 text-xl">
          <Link
            href="https://www.facebook.com/indexithub"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FaFacebook />
          </Link>

          <Link
            href="https://www.instagram.com/indexithub/"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FaInstagram />
          </Link>

          <Link
            href="https://www.linkedin.com/company/index-it-hub"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FaLinkedin />
          </Link>

          <Link
            href="#"
            className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <FaGithub />
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Index IT Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
