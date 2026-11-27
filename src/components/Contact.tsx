/**
 * Contacto. No hay backend de correo, así que se ofrece el email directamente
 * en lugar de un formulario que no enviaría nada.
 */

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const EMAIL = "contacto@fitoprice.com";

export default function Contact() {
    return (
        <section id="contacto" className="border-t py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4 md:px-6">
                <h2 className="headline max-w-[18ch] text-5xl md:text-6xl">¿Echas en falta una tienda o un producto?</h2>
                <p className="mt-5 max-w-[60ch] text-lg text-muted-foreground">
                    Cuéntanos qué compras y dónde. Si eres una tienda o cooperativa y quieres que tus precios
                    aparezcan, también. Respondemos en uno o dos días laborables.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Button asChild size="lg">
                        <a href={`mailto:${EMAIL}?subject=FitoPrice`}>
                            <Mail aria-hidden />
                            Escribir a {EMAIL}
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}
