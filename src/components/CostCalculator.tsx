/**
 * Calculadora del coste de un tratamiento: con la dosis que pone el agricultor
 * y las hectáreas, cuánto producto hace falta, cuántos envases y cuánto cuesta.
 * No propone dosis: cada producto y cultivo tiene la suya en la etiqueta.
 */

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from "@/lib/types";
import { formatPrice, formatQuantity } from "@/lib/utils";

// Unidades de dosis por hectárea y su factor para pasar a L o kg
const DOSE_UNITS = {
    L: [{ value: "L", label: "L/ha", factor: 1 }, { value: "ml", label: "ml/ha", factor: 0.001 }],
    kg: [{ value: "kg", label: "kg/ha", factor: 1 }, { value: "g", label: "g/ha", factor: 0.001 }],
} as const;

// Acepta coma decimal: "1,5" -> 1.5
const parseNumber = (text: string) => {
    const value = parseFloat(text.replace(",", "."));
    return Number.isFinite(value) && value > 0 ? value : null;
};

interface CostCalculatorProps {
    product: Product & { unit: "L" | "kg"; price: number };
    packAmount: number;
    // Dosis de partida, p. ej. la del registro oficial (cambia la key del componente para aplicarla)
    initialDose?: { value: number; unit: string };
}

const decimal = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 3, useGrouping: false });

export default function CostCalculator({ product, packAmount, initialDose }: CostCalculatorProps) {
    const id = useId();
    const units = DOSE_UNITS[product.unit];
    const [dose, setDose] = useState(initialDose ? decimal.format(initialDose.value) : "");
    const [doseUnit, setDoseUnit] = useState<string>(initialDose?.unit ?? units[0].value);
    const [hectares, setHectares] = useState("1");

    const doseValue = parseNumber(dose);
    const hectaresValue = parseNumber(hectares);
    const factor = units.find((u) => u.value === doseUnit)?.factor ?? 1;

    let result = null;
    if (doseValue && hectaresValue) {
        const needed = doseValue * factor * hectaresValue;
        // Un pequeño margen evita pedir un envase de más por errores de redondeo
        const packs = Math.max(1, Math.ceil(needed / packAmount - 1e-9));
        const leftover = packs * packAmount - needed;
        result = {
            needed,
            packs,
            leftover,
            cost: packs * product.price,
            costPerHa: (doseValue * factor * product.price) / packAmount,
        };
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-10">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor={`${id}-dose`}>Dosis</Label>
                    <div className="flex gap-2">
                        <Input
                            id={`${id}-dose`}
                            inputMode="decimal"
                            autoComplete="off"
                            placeholder="La de la etiqueta"
                            className="h-11 bg-card text-base"
                            value={dose}
                            onChange={(e) => setDose(e.target.value)}
                        />
                        <Select value={doseUnit} onValueChange={setDoseUnit}>
                            <SelectTrigger className="h-11 w-28 bg-card text-base data-[size=default]:h-11" aria-label="Unidad de la dosis">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((u) => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor={`${id}-ha`}>Superficie a tratar (hectáreas)</Label>
                    <Input
                        id={`${id}-ha`}
                        inputMode="decimal"
                        autoComplete="off"
                        className="h-11 bg-card text-base"
                        value={hectares}
                        onChange={(e) => setHectares(e.target.value)}
                    />
                </div>
                <p className="text-sm text-muted-foreground">
                    Usa la dosis de la etiqueta para tu cultivo. Este cálculo solo cuenta producto, no agua ni mano de obra.
                </p>
            </div>

            <div aria-live="polite" className="rounded-lg border-2 border-foreground/80 bg-card p-5">
                {result ? (
                    // Al cambiar el número de envases el resultado vuelve a entrar, para que se note el cambio
                    <div key={result.packs} className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-300">
                        <p className="text-lg">
                            Necesitas <strong>{formatQuantity(result.needed, product.unit)}</strong>: {result.packs}{" "}
                            {result.packs === 1 ? "envase" : "envases"} de {formatQuantity(packAmount, product.unit)}
                            {result.leftover > 0.0001 && <>, y te sobran {formatQuantity(result.leftover, product.unit)}</>}.
                        </p>
                        <div className="flex flex-wrap gap-x-10 gap-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Lo que pagas</p>
                                <p className="stencil text-5xl">{formatPrice(result.cost)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Coste del producto por hectárea</p>
                                <p className="stencil text-5xl">{formatPrice(Math.round(result.costPerHa))}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        Escribe la dosis y las hectáreas para ver cuánto producto necesitas y lo que cuesta.
                    </p>
                )}
            </div>
        </div>
    );
}
