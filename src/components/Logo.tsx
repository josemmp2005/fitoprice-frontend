import { Link } from "react-router-dom";
import logo from "@/assets/imgs/logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    to?: string;
}

export default function Logo({ className, to = "/" }: LogoProps) {
    return (
        <Link to={to} className={cn("group/logo inline-flex items-center gap-1.5 rounded-sm", className)} aria-label="FitoPrice, ir al inicio">
            {/* Al pasar el ratón la hoja se mece desde el pie */}
            <img
                src={logo}
                alt=""
                className="h-7 w-auto shrink-0 origin-bottom transition-transform duration-500 ease-(--ease-asienta) group-hover/logo:-rotate-12 group-focus-visible/logo:-rotate-12"
            />
            <span className="headline text-[1.65rem] leading-none">FitoPrice</span>
        </Link>
    );
}
