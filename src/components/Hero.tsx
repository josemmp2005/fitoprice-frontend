import heroImg from '../assets/imgs/hero.png';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export default function Hero() {

    const navigate = useNavigate();

    return (
        <section className="mt-40 [@media(min-width:2920px)]:mt-0 h-screen flex flex-col justify-center items-center gap-10">
            <div className='max-w-2xl mx-auto text-center'>
                <h2 className="text-5xl font-bold mb-4 animate-fade-in-custom-duration-700">Compara Precios y Aumenta tu Rentabilidad </h2>
                <p className="text-xl animate-fade-in-custom-delay-400 p-4">Compara precios en tiempo real, rastrea el mercado y toma decisiones rentables para cada cosecha.</p>
                <div className="mt-6 space-x-4 animate-fade-in-custom-delay-800">
                    <Button className="text-white" onClick={() => navigate('/dashboard')}>Comenzar</Button>
                    <Button className="text-white">Más Información</Button>
                </div>
            </div>
            <img src={heroImg} alt="Hero" className="mt-20 rounded-xl w-9/10 mx-auto [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] animate-fade-in-custom-delay-1200" />
        </section>
    )
}