import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const euros = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" })

// Los precios se guardan en céntimos: 2495 -> "24,95 €"
export function formatPrice(cents: number | null | undefined) {
  return cents == null ? "—" : euros.format(cents / 100)
}

const UNIT_NAMES = { L: "litro", kg: "kilo" } as const

// 399 céntimos por litro -> "3,99 €/L"
export function formatUnitPrice(cents: number | null | undefined, unit: "L" | "kg" | null | undefined) {
  return cents == null || !unit ? null : `${euros.format(cents / 100)}/${unit}`
}

// "litro" o "kilo", para frases como "3,99 € el litro"
export function unitName(unit: "L" | "kg") {
  return UNIT_NAMES[unit]
}

const quantity = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 })

// Cantidades en L o kg, pasando a ml o g por debajo de 1: 0.25 L -> "250 ml"
export function formatQuantity(value: number, unit: "L" | "kg") {
  if (value > 0 && value < 1) return `${quantity.format(value * 1000)} ${unit === "L" ? "ml" : "g"}`
  return `${quantity.format(value)} ${unit}`
}

const dateFormat =new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" })
const dateTimeFormat = new Intl.DateTimeFormat("es-ES", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
})

// "26 nov 2026"
export function formatDate(value: string | null | undefined, withTime = false) {
  if (!value) return "—"
  return (withTime ? dateTimeFormat : dateFormat).format(new Date(value))
}

const relative = new Intl.RelativeTimeFormat("es-ES", { numeric: "auto" })

// "hace 3 horas", "ayer"...
export function formatRelative(value: string | null | undefined) {
  if (!value) return "—"
  const seconds = (new Date(value).getTime() - Date.now()) / 1000
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000], ["month", 2592000], ["week", 604800],
    ["day", 86400], ["hour", 3600], ["minute", 60],
  ]
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit)
  }
  return "hace un momento"
}

// Para buscar sin distinguir mayúsculas ni tildes: "Ácido" -> "acido"
export function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
}

// Iniciales para avatares: "admin@fitoprice.local" -> "AD"
export function initials(text: string) {
  return text.replace(/@.*/, "").slice(0, 2).toUpperCase()
}
