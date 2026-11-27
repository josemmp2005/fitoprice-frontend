/**
 * Tema claro/oscuro compartido por toda la app.
 * La clase "dark" de <html> es la fuente de verdad (la pone index.html antes del primer pintado);
 * este hook la observa para que cualquier componente se entere del cambio.
 */

import { useCallback, useEffect, useState } from "react";

const isDarkNow = () => document.documentElement.classList.contains("dark");

export function useTheme() {
    const [isDark, setIsDark] = useState(isDarkNow);

    useEffect(() => {
        const observer = new MutationObserver(() => setIsDark(isDarkNow()));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    const toggleTheme = useCallback(() => {
        const next = !isDarkNow();
        document.documentElement.classList.toggle("dark", next);
        try {
            localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
            // Sin almacenamiento (modo privado): el cambio vale solo para esta visita
        }
    }, []);

    return { isDark, toggleTheme };
}
