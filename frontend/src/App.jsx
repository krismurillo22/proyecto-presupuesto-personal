// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Layout from "./pages/Layout";
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
  const [user, setUser] = useState(null); // email + id_usuario

  if (!authenticated) {
    return (
      <Login
        onLogin={(userData) => {
          setUser(userData); // email + id_usuario
          setAuthenticated(true);
        }}
      />
    );
  }

  return (
    <BrowserRouter>
      <Layout onLogout={() => setAuthenticated(false)}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />}/>
          <Route path="/dashboard" element={<Dashboard user={user} />}/>
          <Route path="/categorias" element={<Categorias user={user} />}/>
          <Route path="/subcategorias" element={<Subcategorias user={user} />}/>

          <Route
            path="/presupuestos"
            element={<Presupuestos user={user} />}
          />

          <Route
            path="/transacciones"
            element={<Transacciones user={user} />}
          />

          <Route
            path="/obligaciones"
            element={<Obligaciones user={user} />}
          />

          <Route
            path="/metas"
            element={<Metas user={user} />}
          />

          <Route
            path="/crearpresupuestos"
            element={<CrearPresupuestos user={user} />}
          />

          <Route
            path="/presupuestos/editar/:id"
            element={<CrearPresupuestos user={user} />}
          />

          <Route
            path="*"
            element={<div>404 - Página no encontrada</div>}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
