import Link from 'next/link'
import Image from 'next/image'

export default function Custom404() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-sky-50 dark:bg-gray-900 overflow-hidden">
      {/* Background Image (fully visible) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/404b.jpg"
          alt="404 Background"
          fill
          className="object-contain opacity-40 dark:opacity-20 dark:grayscale"
          priority
        />
      </div>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-sky-100/40 dark:bg-gray-800/40 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 text-center p-6">
        <h1 className="text-7xl font-extrabold text-sky-500 dark:text-gray-400 mb-4">
          404
        </h1>
        <p className="text-2xl md:text-3xl text-sky-700 dark:text-gray-300 mb-8">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        <Link
          href="/"
          className="inline-block bg-sky-400 dark:bg-gray-400 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-sky-500 dark:hover:bg-gray-500 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  )
}
