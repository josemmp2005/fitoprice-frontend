import type { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description?: ReactNode;
    actions?: ReactNode;
}

// Título de cada pantalla de la app, con su descripción y acciones a la derecha
export default function PageHeader({ title, description, actions }: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
                <h1 className="headline text-5xl md:text-6xl">{title}</h1>
                {/* div y no p: la descripción puede ser un esqueleto de carga */}
                {description && <div className="max-w-[65ch] text-muted-foreground">{description}</div>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
    );
}
