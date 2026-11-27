/**
 * Cabecera fija de la landing. Al hacer scroll gana fondo y borde para no
 * perderse sobre el contenido.
 */

import { Link } from "react-router-dom";
import LeafRule from "@/components/LeafRule";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import useScrollListener from "@/hooks/useScrollListener";
import { landingSections } from "@/lib/landing";
import { cn } from "@/lib/utils";

export default function Header() {
    const isScrolled = useScrollListener(16);

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-30 transition-colors",
                isScrolled ? "bg-background/90 backdrop-blur" : "bg-background",
            )}
        >
            {/* La línea de la hoja aparece al hacer scroll, cuando la cabecera se separa del contenido, o mientras carga */}
            <LeafRule className="absolute inset-x-0 bottom-0" hidden={!isScrolled} />
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 md:px-6">
                <Logo />
                <nav aria-label="Secciones" className="hidden md:block">
                    <ul className="flex items-center gap-7 text-[0.95rem]">
                        {landingSections.map((section) => (
                            <li key={section.href}>
                                <a href={section.href} className="text-muted-foreground transition-colors hover:text-foreground">
                                    {section.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button asChild>
                        <Link to="/dashboard">Abrir el catálogo</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
