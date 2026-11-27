#  FitoPrice Frontend

Este repositorio contiene el **frontend de FitoPrice**, una plataforma que permite comparar precios de insumos agrícolas entre diferentes proveedores. Contiene también un panel de control para el administrador.
Desarrollada con **React**, **TypeScript**, **TailwindCSS** y **shadcn/ui**, ofrece una interfaz rápida y totalmente responsive.

---
##  Tecnologías Principales

-  **React 19 + Vite** — entorno rápido y modular para desarrollo frontend.
-  **TypeScript** — tipado estático y mayor robustez en el código.
-  **TailwindCSS 4 + shadcn/ui** — estilos y componentes reutilizables (Radix UI).
-  **Recharts** — gráfica de evolución del precio.
-  **API FitoPrice (Express + PostgreSQL)** — datos y autenticación con JWT.
-  **Netlify** — despliegue del frontend.

## URL
- [fitoprice.netlify.app](https://fitoprice.netlify.app)

---

## Qué puede hacer el visitante

No hace falta cuenta: lo que guarda el visitante se queda en su navegador.

| Página | Ruta | Qué hay |
|---|---|---|
| Inicio | `/` | Buscador sobre el catálogo real, cómo se leen los precios, tiendas y contacto |
| Catálogo | `/dashboard` | Todos los productos con su último precio. Buscar por nombre o materia activa (`?q=`), filtrar por tienda y por tipo (`?tipo=`), ordenar por precio o por precio por litro o kilo |
| Ficha de producto | `/product?id=` | Precio y precio por litro o kilo, precio en cada tienda, registro oficial, calculadora, evolución y alternativas |
| Tus productos | `/seguidos` | Los productos que sigue el visitante y cuánto han cambiado desde la última vez que los miró |

**En la ficha de producto:**
- **Precio en cada tienda**, con el más barato marcado.
- **Registro oficial**: número de registro, composición, titular y, por cultivo, plagas, dosis y plazo de seguridad
  (datos del Ministerio de Agricultura). Solo en los productos enlazados con el registro.
- **Coste del tratamiento**: con la dosis y las hectáreas calcula el producto necesario, cuántos envases y el coste por hectárea.
  Desde el registro se puede pasar la dosis a la calculadora ("Calcular con 15 l/ha").
- **Evolución del precio**: gráfica con cada lectura.
- **Alternativas**: productos con la misma materia activa, con la diferencia de precio por litro o kilo.
- **Seguir este precio**: lo añade a "Tus productos" (se guarda en `localStorage`, clave `fitoprice:seguidos`).

## Panel de administración

El acceso no está enlazado en la web: se entra escribiendo la ruta `/login/admin`. Las rutas de administración
sin sesión muestran la página 404, para no delatar dónde está el login.

| Página | Ruta |
|---|---|
| Resumen | `/admin/dashboard` |
| Productos | `/admin/products` |
| Empresas | `/admin/companies` |
| Scraping (páginas y selectores CSS de cada tienda) | `/admin/scraping-jobs` |

---

## Diseño

La paleta y la tipografía están en `src/index.css`, con los nombres de shadcn/ui apuntando a ellas.

| Color | Uso |
|---|---|
| Sulfato `#1F7FA8` | Color principal: marca, enlaces y botones (el azul del caldo bordelés) |
| Brote `#6FB956` | El verde del logo, solo en detalles de marca: la línea de la cabecera, el marcador del menú, los pasos de "Cómo funciona" y el brillo de las cargas. Nunca en cifras, para no confundirlo con "el precio baja" |
| Hoja `#2F7D4A` | Precio que baja |
| Óxido `#B5432A` | Precio que sube |
| Paja `#F1D27A` | Marca del precio más barato |

- Titulares en **Big Shoulders** y precios en **Big Shoulders Stencil** (como las cifras estarcidas de los sacos de abono);
  texto en **Atkinson Hyperlegible Next**.
- Modo claro y oscuro (botón de la cabecera, se recuerda en el navegador).

### Cargas y animaciones

- **Línea de la hoja:** bajo la cabecera hay una línea con el degradado del logo. Mientras hay peticiones a la API
  en marcha, un tramo verde la recorre (`useLoading` cuenta las peticiones de `useApi`).
- **Skeletons** con la forma del contenido (lista de productos, ficha, textos) y un brillo verde azulado (`.skeleton`).
- **Hoja que se llena** (`LeafLoader`) mientras se descarga una página: las rutas, salvo la de inicio, se cargan bajo demanda (`React.lazy`).
- **Entradas:** los bloques de cada página y las filas de las listas aparecen escalonados (`.reveal`, `.stagger`);
  el precio de la ficha cae como un sello; el icono de "Seguir este precio" da un salto al pulsarlo.
- Con **"reducir movimiento"** activado en el sistema, todo queda quieto.

---

## Arranque en local

Requisitos: Node.js 20 o superior y la API en marcha (ver el README del backend).

```bash
npm install
echo VITE_API_URL=http://localhost:3000 > .env    # solo la primera vez
npm run dev                                        # http://localhost:5173
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Comprueba los tipos y genera `dist/` |
| `npm run lint` | ESLint |

## Despliegue en Netlify

- `netlify.toml`: compila con `npm run build`, publica `dist/` y guarda en caché los assets con hash.
- `public/_redirects`: cualquier ruta (`/dashboard`, `/product?id=…`) la resuelve `index.html`, para que funcionen los enlaces directos.
- En Netlify, *Site configuration > Environment variables*: `VITE_API_URL` con la URL de la API en Vercel, sin barra final.
  Se lee al compilar: si cambia, hay que volver a desplegar.
- La URL de Netlify tiene que estar en `CORS_ORIGINS` de la API.

La guía completa (API, base de datos, fotos y n8n) está en el repositorio principal:
[docs/DESPLIEGUE.md](https://github.com/josemmp2005/fitoprice/blob/main/docs/DESPLIEGUE.md).

## Estructura

```
src/
  pages/        una pantalla por ruta (Landing, Dashboard, ProductDetail, Followed, Login y paneles de admin)
  components/   piezas de la interfaz (ProductRow, Price, CostCalculator, RegistrySection, AppShell…)
  components/ui componentes de shadcn/ui
  hooks/        useApi (peticiones), useLoading, useFollowed (productos seguidos), useTheme
  lib/          tipos de la API y utilidades de formato (precios, fechas, cantidades)
  config/       URL de la API y sesión del administrador
```
