

export default function NavigationMenuHeader(){
    return (
        <nav  className="hidden lg:flex w-full flex items-center justify-center p-4">
            <ul className="flex space-x-10 text-xl font-medium">
                <li><a href="/">Inicio</a></li>
                <li><a href="#about">Sobre Nosotros</a></li>
                <li><a href="#contact">Contacto</a></li>
                <li><a href="/dashboard">Tracker</a></li>
            </ul>
        </nav>
    )
}