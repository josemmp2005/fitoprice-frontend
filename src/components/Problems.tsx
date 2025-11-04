import moneyIcon from '../assets/icons/money-icon.svg';

export default function Problems() {
    return (
        <section className="text-center mt-20 px-4">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold">El Costo Real De La Opcacidad</h2>
                <p className="mt-2 text-xl">Descubre cómo la falta de transparencia en los precios de los insumos afecta directamente la rentabilidad y eficiencia de tu campo.</p>
            </div>
            <div className="lg:flex lg:space-x-6 mt-10">
                <article className="mt-8 p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <img src={moneyIcon} alt="" className="mx-auto w-12 " />
                    <h3 className="text-2xl font-semibold mt-6">Precios Inflados</h3>
                    <p className="mt-1 text-xl">Sin acceso a comparaciones de precios, los agricultores pueden pagar más de lo necesario por insumos esenciales.</p>
                </article>
                <article className="mt-8 p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <img src="" alt="" />
                    <h3 className="text-2xl font-semibold mt-6">La Carga de Comparar Manualmente</h3>
                    <p className="mt-1 text-xl">Pasar horas llamando a proveedores o visitando webs es ineficiente y quita tiempo valioso en el campo.</p>
                </article>
                <article className="mt-8 p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <img src="" alt="" />
                    <h3 className="text-2xl font-semibold mt-6">Planificación al Azar</h3>
                    <p className="mt-1 text-xl">Comprar grandes volúmenes sin conocer la tendencia histórica del precio es un riesgo para tu margen de beneficio.</p>
                </article>
            </div>
        </section>
    )
}