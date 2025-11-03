export default function LandingFooter() {
    return (
        <footer className="w-full border-t border-gray-200 mt-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:gap-2 sm:text-left">
                        <p className="text-sm text-[#333333] dark:text-gray-400">© 2024 FitoPrice. Todos los derechos reservados.</p>
                        <div className="flex gap-4 text-sm">
                            <a className="text-[#333333] hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors" href="#">Política de Privacidad</a>
                            <a className="text-[#333333] hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors" href="#">Términos de Servicio</a>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4 sm:items-end">
                        <div className="flex items-center gap-4 text-sm text-[#333333] dark:text-gray-400">
                            <a className="flex items-center gap-2 hover:text-primary dark:hover:text-primary transition-colors" href="mailto:contacto@agroclaro.com">
                                <span className="material-symbols-outlined !text-base">email</span>
                                <span>contacto@agroclaro.com</span>
                            </a>
                            <a className="flex items-center gap-2 hover:text-primary dark:hover:text-primary transition-colors" href="tel:+5491123456789">
                                <span className="material-symbols-outlined !text-base">call</span>
                                <span>+54 9 11 2345-6789</span>
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <a className="social-icon" href="#">
                                <svg className="feather feather-facebook" fill="none" height="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                            <a className="social-icon" href="#">
                                <svg className="feather feather-instagram" fill="none" height="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                            </a>
                            <a className="social-icon" href="#">
                                <svg className="feather feather-linkedin" fill="none" height="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect height="12" width="4" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}