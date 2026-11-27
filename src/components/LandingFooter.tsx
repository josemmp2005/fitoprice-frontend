/**
 * Pie de la landing
 */

import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { landingSections } from "@/lib/landing";

export default function LandingFooter() {
    return (
        <footer className="border-t-2 border-foreground">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-start md:justify-between md:px-6">
                <div className="space-y-2">
                    <Logo />
                    <p className="max-w-[36ch] text-sm text-muted-foreground">
                        Precios de fitosanitarios, abonos y correctores de tiendas online, en un solo sitio.
                    </p>
                </div>
                <nav aria-label="Pie de página">
                    <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <li><Link to="/dashboard" className="hover:text-primary">Catálogo</Link></li>
                        {landingSections.map((section) => (
                            <li key={section.href}><a href={section.href} className="hover:text-primary">{section.label}</a></li>
                        ))}
                    </ul>
                </nav>
            </div>
            <p className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted-foreground md:px-6">
                © {new Date().getFullYear()} FitoPrice
            </p>
        </footer>
    );
}
