import logo from '../assets/imgs/logo.png';
import NavigationMenu from './NavigationMenuHeader';
import useScrollListener from '../hooks/useScrollListener'; 
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';



export default function Header() {
    const isScrolled = useScrollListener(50); // El blur se activa después de 50px de scroll
    const [isDark, setIsDark] = useState(false);
    const navigate = useNavigate();
    
    // Detectar el tema inicial y sincronizar con el sistema
    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const storedTheme = localStorage.getItem('theme');
        
        if (storedTheme) {
            setIsDark(storedTheme === 'dark');
        } else {
            setIsDark(darkModeMediaQuery.matches);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        
        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Clases base para el header
    const baseClasses = "transition-all duration-300 ease-in-out";
    const scrolledClasses = "backdrop-blur-lg";
    const defaultClasses = "bg-transparent";

    return (

        <header
            // Se combinan las clases base con las clases condicionales
            className={`${baseClasses} ${isScrolled ? scrolledClasses : defaultClasses} header flex w-8/10 p-2 justify-between items-center mx-auto fixed top-5 left-0 right-0 z-10 `}
        >
            <div className="logo-container flex items-center gap-2">
                <img src={logo} alt="FitoPrice Logo" className='w-10 h-10' />
                <h1 className='text-2xl'>FitoPrice</h1>
            </div>
            <NavigationMenu />
            <div className="flex items-center gap-3">
                <Button className="bg-blue-500 dark:text-white text-xl rounded" onClick={() => navigate('/login')}>Login</Button>
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full"
                    onClick={toggleTheme}
                >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5 text-black dark:text-white" />}
                </Button>
            </div>

        </header>

    )
}