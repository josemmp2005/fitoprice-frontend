/**
 * Página 404
 */

import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 md:px-6">
            <Logo />
            <div className="flex flex-1 flex-col justify-center gap-5 py-16">
                <p className="stencil text-[clamp(6rem,20vw,12rem)] text-sulfato" aria-hidden>404</p>
                <h1 className="headline text-5xl md:text-6xl">Esta página no existe</h1>
                <p className="max-w-[50ch] text-lg text-muted-foreground">
                    Puede que el enlace esté mal escrito o que la página se haya movido. Busca el producto desde el catálogo.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg">
                        <Link to="/dashboard">Abrir el catálogo</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link to="/">Ir al inicio</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
