/**
 * Login de administradores
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/config/auth";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            await login(email, password);
            navigate("/admin/dashboard");
        } catch (error) {
            setErrorMsg(error instanceof Error ? error.message : "Error al iniciar sesión");
            setLoading(false);
        }
    };

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Ruta oculta: que los buscadores no la indexen */}
            <meta name="robots" content="noindex, nofollow" />
            {/* Panel de marca (solo en pantallas grandes) */}
            <aside className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex dark:bg-accent dark:text-accent-foreground">
                <Logo />
                <div className="max-w-md space-y-4">
                    <p className="headline text-6xl">Panel de administración</p>
                    <p className="text-lg opacity-85">
                        Registra tiendas, ajusta qué se lee de cada web y revisa el catálogo.
                    </p>
                </div>
            </aside>

            <main className="flex flex-col p-6 md:p-10">
                <div className="flex items-center justify-between">
                    <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
                        <Link to="/"><ArrowLeft /> Volver</Link>
                    </Button>
                    <ThemeToggle />
                </div>

                <div className="flex flex-1 items-center justify-center py-10">
                    <div className="w-full max-w-sm space-y-8">
                        <div className="space-y-2">
                            <Logo className="lg:hidden" />
                            <h1 className="headline text-5xl">Iniciar sesión</h1>
                            <p className="text-muted-foreground">Acceso solo para administradores.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="username"
                                    placeholder="admin@fitoprice.com"
                                    className="h-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    className="h-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {errorMsg && (
                                <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                                    {errorMsg}
                                </p>
                            )}

                            <Button type="submit" size="lg" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="animate-spin" />}
                                {loading ? "Entrando…" : "Entrar"}
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
