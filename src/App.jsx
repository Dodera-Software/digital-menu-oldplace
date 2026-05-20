import { BrowserRouter, Route, Routes } from "react-router"
import CafeMenu from "./features/menu/CafeMenu"
import CafeAdmin from "./features/management/CafeAdmin"
import Login from "./features/auth/Login"
import { CafeLoader } from "./features/loader/CafeLoader"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CafeMenu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<CafeAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
