import { BrowserRouter, Route, Routes, Navigate } from "react-router"
import CafeMenu from "./features/menu/CafeMenu"
import CafeAdmin from "./features/management/CafeAdmin"
import Login from "./features/auth/Login"

function ProtectedRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CafeMenu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><CafeAdmin /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
