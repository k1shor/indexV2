import Link from 'next/link';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { IoIosMail, IoLogoFacebook, IoLogoInstagram, IoLogoTwitter, IoLogoLinkedin } from 'react-icons/io';
import { BsSun, BsMoon } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const Header = () => {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const handleNav = () => setMenuOpen(!menuOpen);

    return (
        <nav className="w-full py-2 bg-blue-400 dark:bg-gray-900 z-[999] relative">
            <div className="flex justify-between items-center h-full w-full px-4 xl:px-16 text-white dark:text-gray-200">
                <div>
                    <Link href="/">
                        <Image src={'/logo.png'} alt='Logo' width={150} height={50} className='cursor-pointer' priority />
                    </Link>
                </div>

                <div className='hidden md:flex items-center gap-6'>
                    <ul className='hidden md:flex gap-6 text-white dark:text-gray-200'>
                        {[['/', 'Home'], ['/about', 'About'], ['/service', 'Services'], ['/project', 'Projects'], ['/blog', 'Blogs'],['/career', 'Career'], ['/contact', 'Contact']]
                            .map(([href, label]) => (
                                <Link key={href} href={href}>
                                    <li className={`dark:text-white text-xl ${pathname === href ? 'text-[#13294b] dark:font-bold' : 'hover:text-[#13294b] dark:hover:font-semibold'}`}>{label}</li>
                                </Link>
                            ))}
                    </ul>

                    <button
                        onClick={toggleTheme}
                        className="text-2xl cursor-pointer p-2 rounded-full bg-white dark:bg-gray-700 text-blue-500 dark:text-yellow-300 shadow"
                    >
                        {theme === 'light' ? <BsMoon /> : <BsSun />}
                    </button>
                </div>

                {/* MOBILE HAMBURGER BUTTON */}
                <div
                    onClick={handleNav}
                    className='sm:hidden cursor-pointer text-white dark:text-gray-200 z-[9999]'
                >
                    <AiOutlineMenu size={25} />
                </div>
            </div>

            {/* MOBILE MENU */}
            <div
                className={
                    menuOpen
                        ? "fixed right-0 top-0 w-[65%] sm:hidden h-screen opacity-95 bg-[#7bf] dark:bg-gray-800 p-10 ease-in duration-100 z-[9998]"
                        : "fixed left-[-100%] top-0 p-10 ease-in duration-100 z-[9998]"
                }
            >
                <div className='flex w-full items-center justify-end'>
                    <div onClick={handleNav} className='sm:hidden cursor-pointer text-blue-900 dark:text-gray-200'>
                        <AiOutlineClose size={25} />
                    </div>
                </div>

                <div className='flex-col py-4 text-blue-500 dark:text-gray-200 font-bold'>
                    <ul>
                        {[['/', 'Home'], ['/about', 'About'], ['/service', 'Services'], ['/project', 'Projects'],  ['/blog', 'Blogs'],['/career', 'Career'], ['/contact', 'Contact']]
.map(([href, label]) => (
                            <Link key={href} href={href}>
                                <li className={`py-4 cursor-pointer ${pathname === href ? 'text-white dark:text-yellow-300' : 'hover:text-white dark:hover:text-yellow-300'}`}>{label}</li>
                            </Link>
                        ))}
                    </ul>
                </div>

                <div className='flex flex-row justify-around pt-7 items-center text-[#13294b] dark:text-gray-200'>
                    <IoLogoInstagram size={35} className='cursor-pointer hover:text-white dark:hover:text-yellow-300' />
                    <IoLogoFacebook size={35} className='cursor-pointer hover:text-white dark:hover:text-yellow-300' />
                    <IoLogoTwitter size={35} className='cursor-pointer hover:text-white dark:hover:text-yellow-300' />
                    <IoIosMail size={35} className='cursor-pointer hover:text-white dark:hover:text-yellow-300' />
                    <IoLogoLinkedin size={35} className='cursor-pointer hover:text-white dark:hover:text-yellow-300' />
                </div>

                <div className='mt-6 flex justify-center'>
                    <button
                        onClick={toggleTheme}
                        className="text-2xl cursor-pointer p-2 rounded-full bg-slate-200 dark:bg-gray-700 text-blue-500 dark:text-yellow-300 shadow"
                    >
                        {theme === 'light' ? <BsMoon /> : <BsSun />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;
