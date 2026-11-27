import { cn } from "@/lib/utils"

// Bloque de carga con un brillo verde azulado que lo recorre (.skeleton en index.css)
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn("skeleton rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
