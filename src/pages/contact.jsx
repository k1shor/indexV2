import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

const contact = () => {
  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <div className="text-[#13294b] dark:text-gray-200 bg-white dark:bg-[#0f172a] transition-colors duration-300 lfooter">

      {/* Banner */}
      <div
          className="
            contact-img text-center p-16
            bg-gray-100 dark:bg-gray-900
          "
          data-aos="zoom-in"
          data-aos-duration="2000"
        >
          <h1 className="career lg:text-4xl text-2xl font-bold text-[#13294b] dark:text-white">
            Contact Us
          </h1>

          <div
            className="
              flex justify-center p-3 
              text-[#13294b] dark:text-gray-200
              bg-[#ffffff50] dark:bg-gray-700/40 
            "
          >
            <a href="/" className="pr-2 hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </a>
            /
            <span className="pl-2">Contact</span>
          </div>
        </div>

      {/* Contact Section */}
      <div className="px-5 md:px-32 py-20 mx-auto flex sm:flex-nowrap flex-wrap">

        {/* Map Section */}
        <div className="lg:w-2/3 md:w-1/2 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative transition-colors">
          
          <iframe
            width="100%"
            height="100%"
            className="absolute inset-0"
            title="Index IT Hub"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3421.876296697841!2d85.3120967!3d27.709275999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb199c1f1cac3b%3A0xa4902429c22e0203!2sIndex%20I.T.%20Hub!5e1!3m2!1sen!2snp!4v1763271681932!5m2!1sen!2snp"
            loading="lazy"
          ></iframe>

          <div
            className="bg-white dark:bg-[#1e293b] relative flex flex-wrap py-6 rounded shadow-md transition-colors invisible md:visible"
            data-aos="fade-up"
            data-aos-duration="2000"
          >
            <div className="lg:w-1/2 px-6">
              <h2 className="title-font font-semibold tracking-widest text-xs text-gray-700 dark:text-gray-300">
                ADDRESS
              </h2>
              <p className="mt-1">Jyatha, Kathmandu.</p>
            </div>

            <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
              <h2 className="title-font font-semibold tracking-widest text-xs text-gray-700 dark:text-gray-300">
                EMAIL
              </h2>
              <a className="leading-relaxed">info@indexithub.com</a>

              <h2 className="title-font font-semibold tracking-widest text-xs mt-4 text-gray-700 dark:text-gray-300">
                PHONE
              </h2>
              <p className="leading-relaxed">+977-9860113289</p>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div
          className="lg:w-1/3 md:w-1/2 bg-white dark:bg-[#1e293b] rounded flex flex-col md:ml-auto w-full py-8 px-8 mt-8 md:mt-0 shadow-lg transition-colors"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <h2 className="text-3xl mb-1 font-bold text-center text-[#13294b] dark:text-white">
            Contact Us
          </h2>
          <p className="leading-relaxed mb-5 text-center text-gray-600 dark:text-gray-300">
            Contact For Any Query
          </p>

          {/* Name */}
          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full bg-white dark:bg-[#0f172a] rounded border border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-300 text-base outline-none py-1 px-3 transition-colors duration-200"
            />
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-white dark:bg-[#0f172a] rounded border border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-300 text-base outline-none py-1 px-3 transition-colors duration-200"
            />
          </div>

          {/* Message */}
          <div className="relative mb-4">
            <label htmlFor="message" className="leading-7 text-sm text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full bg-white dark:bg-[#0f172a] rounded border border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-300 h-32 text-base outline-none py-1 px-3 resize-none transition-colors duration-200"
            ></textarea>
          </div>

          {/* Button */}
          <button className="text-white bg-blue-500 dark:bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-[#13294b] dark:hover:bg-blue-700 rounded text-lg transition-colors duration-200">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default contact;
