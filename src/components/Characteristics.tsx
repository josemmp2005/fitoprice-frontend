import heroImg from '../assets/imgs/hero.png';
import { CheckCircle2, TrendingUp, Bell, BarChart3 } from 'lucide-react';

const features = [
    {
        icon: BarChart3,
        title: "Comparación en Tiempo Real",
        description: "Compara precios de insumos agrícolas entre diferentes proveedores al instante."
    },
    {
        icon: TrendingUp,
        title: "Tendencias Históricas",
        description: "Rastrea y analiza el comportamiento de precios a lo largo del tiempo."
    },
    {
        icon: Bell,
        title: "Alertas Inteligentes",
        description: "Recibe notificaciones cuando hay cambios significativos en los precios."
    },
    {
        icon: CheckCircle2,
        title: "Análisis Personalizado",
        description: "Accede a recomendaciones de mercado adaptadas a tus necesidades."
    }
];

export default function Characteristics() {
    return (
        <section className="py-40 px-4 md:px-8 w-full">
            <div className="text-center mb-16 space-y-4">
                <h2 className='text-4xl md:text-5xl font-semibold'>¿Qué puedes hacer con FitoPrice?</h2>
                <p className="text-xl max-w-2xl mx-auto">Optimiza tus decisiones agrícolas con herramientas profesionales de análisis de precios</p>
            </div>

            <div className="lg:flex gap-12 items-center">
                <div className="space-y-6 order-2 lg:order-1 flex-1">
                    {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="group flex gap-4 p-6 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in-custom-delay-400"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="shrink-0">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-2xl">{feature.title}</h3>
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="order-1 lg:order-2 relative flex-1 mt-10 lg:mt-0">
                    <div className="relative group lg:[perspective:1000px]">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-50" />
                        <img 
                            src={heroImg} 
                            alt="FitoPrice Platform Preview" 
                            className="relative w-full h-auto rounded-2xl shadow-2xl max-w-6xl [transform:rotateY(-15deg)] [transform-style:preserve-3d] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}