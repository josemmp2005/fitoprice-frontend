import logo from '../assets/logo.png';

export default function Header() {
    return (
        <header className="header flex w-full p-4 justify-between items-center max-w-4xl mx-auto fixed top-0 left-0 right-0">
            <div className="logo-container flex items-center">
                <img src={logo} alt="FitoPrice Logo" className='w-10 h-10' />
                <h1 className='text-2xl'>FitoPrice</h1>
            </div>
            <nav className="nav-links hidden md:flex gap-4">
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
                <a href="/login">Login</a>
                <a href="/tracker">Tracker</a>
                <a href="/comparer">Comparer</a>
            </nav>
        </header>
    )
}
