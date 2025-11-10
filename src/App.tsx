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
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/admin" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/product" element={<ProductDetail />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/companies" element={<CompaniesPanel />} />
        <Route path="/admin/products" element={<ProductPanel />} />
        <Route path="/admin/scraping-jobs" element={<ScrapingPanel />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App
