/**
 *  LandingFooter Component for the landing page footer
 * 
 */

export default function LandingFooter() {
    return (
        <footer className="w-full border-t border-gray-400 mt-20">
            <p className="mt-3">© 2025 FitoPrice. Todos los derechos reservados.</p>
            <div className="flex justify-center gap-4 text-sm">
                <a href="/privacy" className="hover:underline">Política de Privacidad</a>
                <a href="/terms" className="hover:underline">Términos de Servicio</a>
                <a href="/about" className="hover:underline">Sobre Nosotros</a>
                <a href="/contact" className="hover:underline">Contacto</a>
            </div>
            <div className="text-xs text-gray-500 mt-2">
                <p>contacto@fitoprice.com · +34 600 123 456</p>
            </div> 
        </footer>
    )
}