import moneyIcon from '../assets/icons/money-icon.svg';
import notePadIcon from '../assets/icons/notepad.svg';
import compareIcon from '../assets/icons/compare.svg';

const problems = [
    {
        icon: moneyIcon,
        title: "Precios Inflados",
        description: "Sin acceso a comparaciones de precios, los agricultores pueden pagar más de lo necesario por insumos esenciales."
    },
    {
        icon: notePadIcon,
        title: "La Carga de Comparar Manualmente",
        description: "Pasar horas llamando a proveedores o visitando webs es ineficiente y quita tiempo valioso en el campo."
    },
    {
        icon: compareIcon,
        title: "Planificación al Azar",
        description: "Comprar grandes volúmenes sin conocer la tendencia histórica del precio es un riesgo para tu margen de beneficio."
    }
];

export default function Problems() {
    return (
        <section className="text-center mt-20 px-4">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-semibold mb-8">El Costo Real De La Opcacidad</h2>
                <p className="mt-2 text-xl">Descubre cómo la falta de transparencia en los precios de los insumos afecta directamente la rentabilidad y eficiencia de tu campo.</p>
            </div>
            <div className="lg:flex lg:space-x-20 mt-10 max-w-7xl mx-auto">
                {problems.map((problem, index) => (
                    <article 
                        key={index}
                        className="mt-8 p-6 bg-card border rounded-lg hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in-custom-delay-400"
                    >
                        <img src={problem.icon} alt={problem.title} className="mx-auto w-12 h-12" />
                        <h3 className="text-xl font-semibold mt-6">{problem.title}</h3>
                        <p className="mt-1 text-lg">{problem.description}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}