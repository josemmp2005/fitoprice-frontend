

export default function NavigationMenuHeader(){
    return (
        <nav  className="hidden lg:flex w-full flex items-center justify-center p-4">
            <ul className="flex space-x-10 text-xl font-medium">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/services">Tracker</a></li>
                <li><a href="/comparador">Comparador</a></li>
            </ul>
        </nav>
    )
}