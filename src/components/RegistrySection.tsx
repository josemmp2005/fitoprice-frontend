/**
 * Datos del Registro Oficial de Productos Fitosanitarios para un producto de la tienda:
 * número de registro, titular, composición y, por cultivo, las plagas en las que está
 * autorizado con su dosis y plazo de seguridad. Los carga n8n cada semana.
 */

import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RegistryProduct, RegistryUse } from "@/lib/types";
import { formatDate, normalize } from "@/lib/utils";

const REGISTRY_URL = "https://servicio.mapa.gob.es/regfiweb";
const number = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 3 });

// "0,25–0,7 %" o "3 l/ha"
function formatDose(use: RegistryUse) {
    const { dosis_min: min, dosis_max: max, unidad } = use;
    if (min == null && max == null) return unidad || "Ver etiqueta";
    const range = min != null && max != null && max !== min ? `${number.format(min)}–${number.format(max)}` : number.format((min ?? max)!);
    return `${range} ${unidad}`.trim();
}

// "14" -> "14 días"; "NP", "NO PROCEDE", "N.P.", "NA" -> "No procede"
function formatSafety(value: string) {
    if (/^\d+$/.test(value)) return value === "1" ? "1 día" : `${value} días`;
    if (!value || /^(np|n\.p\.|na|no procede)$/i.test(value.trim())) return "No procede";
    return value;
}

// Códigos de sistema de cultivo de las tablas de buenas prácticas de la UE
const SYSTEMS: Record<string, string> = { F: "Aire libre", G: "Invernadero", I: "Interior" };
const systemName = (code: string) => SYSTEMS[code] ?? code;

// "2027/07/31" -> fecha legible
const parseSlashDate = (value: string | null) => (value ? value.replace(/\//g, "-") : null);

// Dosis por hectárea en la misma unidad que el envase: se puede pasar a la calculadora
function doseForCalculator(use: RegistryUse, unit: "L" | "kg" | null) {
    const dose = use.dosis_max ?? use.dosis_min;
    if (dose == null || !unit) return null;
    const u = normalize(use.unidad);
    if (unit === "L" && u === "l/ha") return { value: dose, unit: "L" };
    if (unit === "kg" && u === "kg/ha") return { value: dose, unit: "kg" };
    return null;
}

interface RegistrySectionProps {
    registry: RegistryProduct;
    shopName: string;
    unit: "L" | "kg" | null;
    onUseDose?: (dose: { value: number; unit: string }) => void;
}

export default function RegistrySection({ registry, shopName, unit, onUseDose }: RegistrySectionProps) {
    const crops = useMemo(
        () => [...new Set(registry.usos.map((u) => u.cultivo).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es")),
        [registry],
    );
    const [crop, setCrop] = useState<string>("");
    const uses = registry.usos.filter((u) => u.cultivo === crop);

    // El nombre de la tienda puede ser otra denominación comercial del mismo registro
    const otherName = normalize(shopName).startsWith(normalize(registry.nombre)) ? null : registry.nombre;

    return (
        <div className="space-y-6">
            <p className="max-w-[70ch] text-lg">
                Inscrito en el Registro de Productos Fitosanitarios del Ministerio de Agricultura con el{" "}
                <strong>nº {registry.num_registro}</strong>
                {otherName && <> como <strong>{otherName}</strong> (este nombre comercial es otra denominación del mismo producto)</>}.
            </p>

            <dl className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
                {registry.composicion.length > 0 && (
                    <>
                        <dt className="text-muted-foreground">Composición</dt>
                        <dd className="font-semibold">
                            {registry.composicion
                                .map((c) => `${c.sustancia}${c.concentracion != null ? ` ${number.format(c.concentracion)}${c.unidad === "%" ? " %" : c.unidad ? ` ${c.unidad}` : ""}` : ""}`)
                                .join(" + ")}
                        </dd>
                    </>
                )}
                {registry.formulado && (
                    <>
                        <dt className="text-muted-foreground">Formulado</dt>
                        <dd>{registry.formulado}</dd>
                    </>
                )}
                {registry.titular && (
                    <>
                        <dt className="text-muted-foreground">Titular</dt>
                        <dd>{registry.titular}</dd>
                    </>
                )}
                {registry.fecha_caducidad && (
                    <>
                        <dt className="text-muted-foreground">Autorizado hasta</dt>
                        <dd>{formatDate(parseSlashDate(registry.fecha_caducidad))}</dd>
                    </>
                )}
            </dl>

            <div className="space-y-4">
                <div className="grid max-w-sm gap-2">
                    <Label htmlFor="registry-crop">Usos autorizados en tu cultivo</Label>
                    <Select value={crop} onValueChange={setCrop}>
                        <SelectTrigger id="registry-crop" className="h-11 w-full bg-card text-base data-[size=default]:h-11">
                            <SelectValue placeholder={`Elige entre ${crops.length} cultivos`} />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                            {crops.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {crop && (
                    <div key={crop} className="overflow-x-auto rounded-lg border bg-card animate-in fade-in slide-in-from-top-1 duration-300">
                        <table className="w-full min-w-[560px] text-left text-sm">
                            <caption className="sr-only">Usos autorizados en {crop}</caption>
                            <thead>
                                <tr className="border-b-2 border-foreground">
                                    <th scope="col" className="px-4 py-2.5 font-semibold">Plaga o enfermedad</th>
                                    <th scope="col" className="px-4 py-2.5 font-semibold">Dosis</th>
                                    <th scope="col" className="px-4 py-2.5 font-semibold">Plazo de seguridad</th>
                                    <th scope="col" className="px-4 py-2.5 font-semibold">Aplicaciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {uses.map((use, i) => {
                                    const dose = onUseDose ? doseForCalculator(use, unit) : null;
                                    return (
                                        <tr key={i} className="align-top">
                                            <td className="px-4 py-3">
                                                {use.agente || "Sin especificar"}
                                                {(use.sistema || use.usuario) && (
                                                    <span className="mt-0.5 block text-xs text-muted-foreground">{[use.sistema && systemName(use.sistema), use.usuario && `uso ${use.usuario.toLowerCase()}`].filter(Boolean).join(", ")}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="font-semibold tabular-nums">{formatDose(use)}</span>
                                                {dose && (
                                                    <Button variant="link" size="sm" className="block h-auto px-0 py-0.5" onClick={() => onUseDose!(dose)}>
                                                        Calcular con {number.format(dose.value)} {use.unidad}
                                                    </Button>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">{formatSafety(use.plazo_seguridad)}</td>
                                            <td className="px-4 py-3">
                                                {use.aplicaciones && use.aplicaciones !== "-" ? use.aplicaciones : "—"}
                                                {use.intervalo && use.intervalo !== "-" && <span className="block text-xs text-muted-foreground">cada {use.intervalo}</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <p className="max-w-[70ch] text-sm text-muted-foreground">
                Datos del registro oficial a {formatDate(registry.fecha_datos)}, actualizados cada semana. Son un resumen:
                antes de aplicar, lee la etiqueta del producto.{" "}
                <a href={REGISTRY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                    Consultar el registro <ExternalLink className="size-3.5" aria-hidden />
                </a>
            </p>
        </div>
    );
}
