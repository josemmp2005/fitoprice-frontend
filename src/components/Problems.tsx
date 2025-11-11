import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, FileText, TrendingDown } from "lucide-react";

const problems = [
    {
        icon: DollarSign,
        title: "Precios Inflados",
        description: "Sin acceso a comparaciones de precios, los agricultores pueden pagar más de lo necesario por insumos esenciales.",
        colorClass: "text-grey-600"
    },
    {
        icon: FileText,
        title: "La Carga de Comparar Manualmente",
        description: "Pasar horas llamando a proveedores o visitando webs es ineficiente y quita tiempo valioso en el campo.",
        colorClass: "text-grey-600"
    },
    {
        icon: TrendingDown,
        title: "Planificación al Azar",
        description: "Comprar grandes volúmenes sin conocer la tendencia histórica del precio es un riesgo para tu margen de beneficio.",
        colorClass: "text-grey-600"
    }
];

export default function Problems() {
    return (
        <section className="text-center mt-20 px-4 w-full">
            
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-semibold mb-8">El Costo Real De La Opcacidad</h2>
                <p className="mt-2 text-xl">Descubre cómo la falta de transparencia en los precios de los insumos afecta directamente la rentabilidad y eficiencia de tu campo.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {problems.map((problem, index) => {
                    const IconComponent = problem.icon;
                    return (
                        <Card
                            key={index}
                            className="mt-8 p-6 bg-card border rounded-lg hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in-custom-delay-400"
                        >
                        <CardHeader className="flex flex-col items-center text-center space-y-2">
                                <IconComponent className={`w-10 h-10 ${problem.colorClass}`} />
                            <CardTitle>{problem.title}</CardTitle>
                            <CardDescription>{problem.description}</CardDescription>
                        </CardHeader>
                    </Card>
                );
                })}
            </div>
        </section>
    )
}