import logo from '../assets/imgs/logo.png';
import { Button } from "@/components/ui/button";


export default function NotFound() {
    return (
        <section className="h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col justify-center items-center gap-6 text-center px-4">

                <img src={logo} alt="FitoPrice Logo" className='w-20 h-20' />
                <h1>404 - Página No Encontrada</h1>

                <p>Lo sentimos, la página que buscas no existe.</p>
                <Button onClick={() => window.location.href = '/'}>
                    Volver a la Página Principal
                </Button>
            </div>
        </section>
    );
}