/**
 * Info component about the mission and purpose of Fitoprice.
 */

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Componentes de la UI
import { Leaf, BarChart3, Users } from "lucide-react"; // Iconos

// Definition of the missionCards array
const missionCards = [
    {
        icon: Leaf,
        title: "Sostenibilidad y Transparencia",
        description: "Creemos que un mercado más transparente promueve prácticas agrícolas más sostenibles y equitativas.",
        colorClass: "text-grey-600"
    },
    {
        icon: BarChart3,
        title: "Datos Reales, Decisiones Reales",
        description: "Usamos tecnología de scraping inteligente para ofrecer información precisa y actualizada en todo momento.",
        colorClass: "text-grey-600"
    },
    {
        icon: Users,
        title: "Apoyo a Productores",
        description: "Empoderamos a los agricultores con herramientas profesionales que antes solo estaban al alcance de grandes corporaciones.",
        colorClass: "text-grey-600"
    }
];

export default function LandingInfo() {
    return (
        <section className="text-center mt-20 px-4 w-full" id="about">
            <div className="text-center mb-16 max-w-3xl mx-auto space-y-4"> 
                <h2 className='text-4xl md:text-4xl font-semibold'>Nuestra propósito</h2>
                <p className="text-xl">
                    Fitoprice nació con una idea simple, si el campo es la base de todo, sus insumos no deberían ser un misterio.
                </p>
                <p className="text-xl">
                    Nuestro objetivo es ofrecer a agricultores y cooperativas una plataforma donde puedan comparar, analizar y decidir con datos claros.
                </p>
                <p className="text-xl">
                    Creemos que la tecnología puede nivelar el terreno de juego entre pequeños productores y grandes distribuidores.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {missionCards.map((card, index) => {
                    const IconComponent = card.icon;
                    return (
                        <Card 
                            key={index}
                            className="mt-8 p-6 bg-card border rounded-lg hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in-custom-delay-400"
                        >
                            <CardHeader className="flex flex-col items-center text-center space-y-2">
                                <IconComponent className={`w-10 h-10 ${card.colorClass}`} />
                                <CardTitle>{card.title}</CardTitle>
                                <CardDescription>{card.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}