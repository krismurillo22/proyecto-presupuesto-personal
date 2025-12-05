// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Layout from "./pages/Layout";

// Páginas del Proyecto (creamos archivos vacíos si no existen)
import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias";
import Subcategorias from "./pages/Subcategorias";
import Presupuestos from "./pages/Presupuestos";
import Transacciones from "./pages/Transacciones";
import Obligaciones from "./pages/Obligaciones";
import Metas from "./pages/Metas";
import CrearPresupuestos from "./pages/CrearPresupuestos";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  // Usuario NO autenticado → Mostrar Login
  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <Layout onLogout={() => setAuthenticated(false)}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/subcategorias" element={<Subcategorias />} />
          <Route path="/presupuestos" element={<Presupuestos />} />
          <Route path="/transacciones" element={<Transacciones />} />
          <Route path="/obligaciones" element={<Obligaciones />} />
          <Route path="/metas" element={<Metas />} />
          <Route path="/crearpresupuestos" element={<CrearPresupuestos />} />

          {/* Ruta fallback */}
          <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
