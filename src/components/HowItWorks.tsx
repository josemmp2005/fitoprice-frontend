/**
 * De dónde salen los precios. Es un proceso en orden, por eso va numerado.
 */

const steps = [
    {
        title: "Leemos los catálogos",
        text: "Un proceso automático recorre las páginas de productos de cada tienda registrada y apunta nombre, precio, foto y enlace.",
    },
    {
        title: "Guardamos cada lectura",
        text: "Cada precio se guarda con su fecha. Así, en la siguiente lectura se ve si ha subido, ha bajado o repite.",
    },
    {
        title: "Tú comparas",
        text: "Buscas un producto y ves su último precio en cada tienda, con un enlace para comprarlo allí.",
    },
];

export default function HowItWorks() {
    return (
        <section id="como-funciona" className="border-t py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4 md:px-6">
                <h2 className="headline max-w-[16ch] text-5xl md:text-6xl">De la tienda a esta página</h2>
                <ol className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
                    {steps.map((step, index) => (
                        <li key={step.title} className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                            <span className="stencil leaf-text row-span-2 text-6xl" aria-hidden>{index + 1}</span>
                            <h3 className="pt-1 text-lg font-bold">{step.title}</h3>
                            <p className="max-w-[40ch] text-muted-foreground">{step.text}</p>
                        </li>
                    ))}
                </ol>
                <p className="mt-12 max-w-[65ch] border-l-4 border-paja pl-4 text-muted-foreground">
                    Los precios son los que publica cada tienda en el momento de la lectura. Antes de comprar,
                    confirma el precio y los gastos de envío en su web.
                </p>
            </div>
        </section>
    );
}
