import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // Aquí puedes agregar la lógica para enviar el formulario
        alert("¡Mensaje enviado! Nos pondremos en contacto contigo pronto.");
        setFormData({ name: "", email: "", phone: "", message: "" });
    };

    const contactInfo = [
        {
            icon: Mail,
            title: "Email",
            info: "contacto@fitoprice.com",
            colorClass: "text-gray-600"
        },
        {
            icon: Phone,
            title: "Teléfono",
            info: "+34 123 456 789",
            colorClass: "text-gray-600"
        },
        {
            icon: MapPin,
            title: "Ubicación",
            info: "Madrid, España",
            colorClass: "text-gray-600"
        }
    ];

    return (
        <section className="py-20 px-4 md:px-8 w-full" id="contact">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-semibold mb-4">¿Tienes alguna pregunta?</h2>
                    <p className="text-xl text-muted-foreground">
                        Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Formulario */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Envíanos un mensaje</CardTitle>
                            <CardDescription>
                                Completa el formulario y nos pondremos en contacto contigo pronto.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Tu nombre"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+34 123 456 789"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="message">Mensaje</Label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Cuéntanos cómo podemos ayudarte..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={8}
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Enviar mensaje
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Información de contacto */}
                    <div className="space-y-6">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Información de contacto</CardTitle>
                                <CardDescription>
                                    Otras formas de ponerte en contacto con nosotros
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {contactInfo.map((contact, index) => {
                                    const IconComponent = contact.icon;
                                    return (
                                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition">
                                            <IconComponent className={`w-6 h-6 ${contact.colorClass}`} />
                                            <div>
                                                <p className="font-semibold">{contact.title}</p>
                                                <p className="text-sm text-muted-foreground">{contact.info}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>¿Necesitas ayuda?</CardTitle>
                                <CardDescription>
                                    Nuestro equipo está disponible para resolver tus dudas
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        Respondemos a todas las consultas en un plazo máximo de 24-48 horas laborables.
                                    </p>
                                    <div className="pt-2">
                                        <p className="font-semibold text-sm mb-1">¿Eres agricultor o cooperativa?</p>
                                        <p className="text-sm text-muted-foreground">
                                            Solicita una demo personalizada y descubre cómo FitoPrice puede ayudarte a optimizar tus compras.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}