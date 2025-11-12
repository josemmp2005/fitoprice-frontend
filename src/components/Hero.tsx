/**
 * Hero component for the landing page with theme-aware image switching.
 */


import heroImg from '../assets/imgs/hero.png'; // Dark mode image
import wHeroImg from '../assets/imgs/w-hero.png'; // Light mode image
import { Button } from './ui/button'; // Component Button
import { useNavigate } from 'react-router-dom'; // Navigation hook
import { useEffect, useState } from 'react'; // React hooks

export default function Hero() {
    // Declare navigation and theme state
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);

    // Function to check current theme
    const checkTheme = () => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
    };


    useEffect(() => {
        checkTheme();
        
        /**
         *   Observe changes in the theme and update state accordingly
         *   The observer monitors for changes in the document's class attribute, which indicates theme changes.
         *   When a change is detected, the observer calls the checkTheme() function to update the isDark state without reloading the page, allowing the hero image to change on the fly.
         */

        const observer = new MutationObserver(checkTheme);
        // Start observing the document element for class attribute changes
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Cleanup observer on component unmount
        return () => observer.disconnect();
    }, []);

    return (
        <section className="mt-10 sm:mt-50 [@media(min-width:2920px)]:mt-0 h-screen flex flex-col justify-center items-center gap-10">
            <div className='max-w-xl mx-auto text-center'>
                <h2 className="text-5xl font-bold mb-4 animate-fade-in-custom-duration-700">Compara Precios y Aumenta tu Rentabilidad </h2>
                <p className="text-xl animate-fade-in-custom-delay-400 p-4">Compara precios en tiempo real, rastrea el mercado y toma decisiones rentables para cada cosecha.</p>
                <div className="mt-6 space-x-4 animate-fade-in-custom-delay-800">
                    {/* Buttons for navigation */}
                    <Button className="text-xl mb-3 sm:mb-0" onClick={() => navigate('/dashboard')}>Comenzar</Button>
                    <a href="#characteristics"><Button className="text-xl" >Más Información</Button></a>
                </div>
            </div>
            {/* Hero Image with theme-aware switching */}
            <img
                src={isDark ? heroImg : wHeroImg}
                alt="Hero"
                className="mt-10 rounded-xl w-9/10 mx-auto [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_90%)] animate-fade-in-custom-delay-1200"
            />
        </section>
    )
}