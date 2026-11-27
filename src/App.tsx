import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './pages/Landing'
import ProtectedRoute from './components/AdminRoute'
import NotFound from './pages/NotFound'
import LeafLoader from './components/LeafLoader'
import './App.css'

// La landing va en el paquete principal; el resto de pantallas se descargan al abrirlas
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Followed = lazy(() => import('./pages/Followed'))
const AdminPanel = lazy(() => import('./pages/AdminPanel'))
const CompaniesPanel = lazy(() => import('./pages/CompaniesPanel'))
const ProductPanel = lazy(() => import('./pages/ProductsPanel'))
const ScrapingPanel = lazy(() => import('./pages/ScrapingPanel'))
// NotFound también la usa AdminRoute, así que va en el paquete principal

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LeafLoader label="Abriendo la página" className="min-h-svh justify-center" />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login/admin" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/seguidos" element={<Followed />} />
          <Route path="/admin/dashboard" element={ <ProtectedRoute> <AdminPanel /> </ProtectedRoute> }/>
          <Route path="/admin/companies" element={<ProtectedRoute> <CompaniesPanel /> </ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute> <ProductPanel /> </ProtectedRoute>} />
          <Route path="/admin/scraping-jobs" element={<ProtectedRoute> <ScrapingPanel /> </ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )

}

export default App
