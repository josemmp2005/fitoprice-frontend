// Tipos de las respuestas de la API (los precios siempre van en céntimos)

export interface Product {
    id: number;
    name: string;
    brand: string | null;
    category: string | null;            // tipo de producto, sacado del nombre
    unit: "L" | "kg" | null;            // unidad del envase, sacada del nombre
    pack_amount: string | null;         // tamaño del envase (numeric de Postgres llega como texto)
    active_ingredients: string[];       // materias activas o nutrientes
    created_at: string;
    product_img_url: string;
    price: number | null;
    price_per_unit: number | null;      // céntimos por litro o kilo
    percentage_change: string | null; // el backend lo envía con toFixed(2)
    scraped_at: string | null;
    product_link: string | null;
    company_id: number | null;
    company_name: string | null;
    company_website: string | null;
}

// Registro Oficial de Productos Fitosanitarios (GET /products/:id/registry)
export interface RegistryUse {
    cultivo: string;
    agente: string;
    dosis_min: number | null;
    dosis_max: number | null;
    unidad: string;           // "l/ha", "%", "Kg/ha", "ml/Hl"...
    plazo_seguridad: string;  // días, o "NP" / "NO PROCEDE"
    aplicaciones: string;
    intervalo: string;
    sistema: string;
    usuario: string;
}

export interface RegistryProduct {
    num_registro: string;
    nombre: string;
    nombres: string[];
    titular: string | null;
    formulado: string | null;
    estado: string | null;
    fecha_caducidad: string | null; // "2027/07/31"
    composicion: { sustancia: string; concentracion: number | null; unidad: string }[];
    usos: RegistryUse[];
    fecha_datos: string | null;     // "2026-11-23"
}

export interface Company {
    id: number;
    name: string;
    website: string | null;
    product_count: number;
}

// Último precio de un producto en cada empresa (GET /companies/:productId)
export interface ProductSeller {
    company_id: number;
    name: string;
    website: string | null;
    product_link: string | null;
    price: number;
    scraped_at: string;
}

export interface PriceHistoryItem {
    id: number;
    product_id: number;
    company_id: number;
    price: number;
    product_link: string | null;
    scraped_at: string;
}

export interface ScrapingConfig {
    selector_card: string | null;
    selector_title: string;
    selector_price: string;
    selector_image: string;
    selector_link: string;
}

export interface CompanyUrl {
    id: number;
    url: string;
    active: boolean;
    scraping_config: ScrapingConfig | null;
}

export interface CompanyWithUrls {
    id: number;
    name: string;
    company_urls: CompanyUrl[];
}
