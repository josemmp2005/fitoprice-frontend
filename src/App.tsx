import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProductDetail from './pages/ProductDetail'
import AdminPanel from './pages/AdminPanel'
import ProtectedRoute from './components/AdminRoute'
import CompaniesPanel from './pages/CompaniesPanel'
import ProductPanel from './pages/ProductsPanel'
import ScrapingPanel from './pages/ScrapingPanel'
import NotFound from './pages/NotFound'
import DatabaseSuspensionBanner from './components/DatabaseSuspensionBanner'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <DatabaseSuspensionBanner />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/admin" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product" element={<ProductDetail />} />
        <Route path="/admin/dashboard" element={ <ProtectedRoute> <AdminPanel /> </ProtectedRoute> }/>
        <Route path="/admin/companies" element={<ProtectedRoute> <CompaniesPanel /> </ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute> <ProductPanel /> </ProtectedRoute>} />
        <Route path="/admin/scraping-jobs" element={<ProtectedRoute> <ScrapingPanel /> </ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )

}

export default App
