import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }: { className?: string }) {
    const { isDark, toggleTheme } = useTheme();
    const label = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";

    return (
        <Button variant="ghost" size="icon" className={cn("rounded-full", className)} onClick={toggleTheme} aria-label={label} title={label}>
            {/* El icono entra girando al cambiar de tema */}
            {isDark
                ? <Sun key="sun" className="animate-in spin-in-90 fade-in duration-300" />
                : <Moon key="moon" className="animate-in spin-in-[-90deg] fade-in duration-300" />}
        </Button>
    );
}
