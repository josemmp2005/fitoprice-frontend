/**
 * Header component for the landing page
 */

import logo from '../assets/imgs/logo.png'; // Logo image
import NavigationMenu from './NavigationMenuHeader'; // Navigation menu component
import useScrollListener from '../hooks/useScrollListener'; // Custom hook to detect scroll
import { Button } from './ui/button'; // UI Button component
import { Moon, Sun } from 'lucide-react'; // Icons for theme toggle
import { useState, useEffect } from 'react'; // React hooks


export default function Header() {
    // Custom hook for detecting scroll to add blur effect to the header
    // It's activated after scrolling 50px
    const isScrolled = useScrollListener(50);
    // State to manage theme (dark/light)
    const [isDark, setIsDark] = useState(false);
    // Classes for header styling based on scroll state
    const baseClasses = "transition-all duration-300 ease-in-out";
    const scrolledClasses = "backdrop-blur-lg";
    const defaultClasses = "bg-transparent";


    // Detect initial theme preference on component mount and set state accordingly
    useEffect(() => {
        // Check for saved theme in localStorage or system preference
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const storedTheme = localStorage.getItem('theme');

        // Set initial theme based on stored preference or system setting
        if (storedTheme) {
            setIsDark(storedTheme === 'dark');
        } else {
            setIsDark(darkModeMediaQuery.matches);
        }
    }, []);

    // Function to toggle theme and update localStorage
    const toggleTheme = () => {
        // Toggle the theme state
        const newTheme = !isDark;
        setIsDark(newTheme);

        // Update the document's class and localStorage
        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };


    return (
        // Header with dynamic classes based on scroll state
        <header className={`${baseClasses} ${isScrolled ? scrolledClasses : defaultClasses} header flex w-full lg:w-8/10 p-4 justify-between items-center mx-auto fixed top-0 left-0 right-0 z-10 `}>
            <div className="logo-container flex items-center gap-2">
                <img src={logo} alt="FitoPrice Logo" className='w-10 h-10' />
                <h1 className='text-2xl'>FitoPrice</h1>
            </div>
            <NavigationMenu />
            <div className="flex items-center gap-3">
                {/* Theme toggle button */}
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={toggleTheme}
                >
                    {/** Theme icon. It's change between a sun and a moon depending on the theme */}
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5 text-black dark:text-white" />}
                </Button>
            </div>

        </header>

    )
}