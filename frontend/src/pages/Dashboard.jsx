// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { obtenerUsuarioPorCorreo } from "../services/usuarios";
import { obtenerPresupuestoActivo } from "../services/presupuestos";
import {
  obtenerBalanceMensual,
  obtenerGastosPorCategoria,
} from "../services/reportes";
import { obtenerMetasUsuario } from "../services/metas";

import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  FolderOpen,
  Target,
  Calendar,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

export default function Dashboard({ user }) {

  // Si no hay usuario logueado, no cargamos nada.
  if (!user) {
    return <div className="p-6 text-gray-600">Cargando usuario...</div>;
  }

  const userEmail = user.email;
  const idUsuario = user.id_usuario;

  const [usuario, setUsuario] = useState(null);
  const [presupuesto, setPresupuesto] = useState(null);
  const [balance, setBalance] = useState(null);
  const [gastosCategoria, setGastosCategoria] = useState([]);
  const [topCategorias, setTopCategorias] = useState([]);
  const [metasProgreso, setMetasProgreso] = useState([]);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  // 1) Usuario por correo
  useEffect(() => {
    if (!userEmail) return;

    obtenerUsuarioPorCorreo(userEmail)
      .then((res) => {
        setUsuario(res.data.usuario);
      })
      .catch((err) => console.error("Error cargando usuario:", err));
  }, [userEmail]);

  // 2) Presupuesto activo
  useEffect(() => {
    if (!usuario) return;

    obtenerPresupuestoActivo(usuario.ID_USUARIO)
      .then((res) => {
        setPresupuesto(res.data.presupuesto_activo);
      })
      .catch((err) => console.error("Error cargando presupuesto:", err));
  }, [usuario]);

  // 3) Balance + Gastos categoría
  useEffect(() => {
    if (!presupuesto || !usuario) return;

    const params = {
      id_usuario: usuario.ID_USUARIO,
      id_presupuesto: presupuesto.ID_PRESUPUESTO,
      anio: presupuesto.ANIO_INICIO,
      mes: presupuesto.MES_INICIO,
    };

    obtenerBalanceMensual(params)
      .then((res) => {
        setBalance(res.data);
      })
      .catch((err) => console.error("Error balance:", err));

    obtenerGastosPorCategoria(params)
      .then((res) => {
        const lista = res.data.categorias || [];

        const parsed = lista.map((cat) => ({
          name: cat.CATEGORIA,
          value: cat.TOTAL_GASTADO,
        }));

        setGastosCategoria(parsed);

        const totalGastos = lista.reduce(
          (sum, c) => sum + Number(c.TOTAL_GASTADO || 0),
          0
        );

        const top = lista.map((cat) => ({
          nombre: cat.CATEGORIA,
          monto: cat.TOTAL_GASTADO,
          porcentaje: totalGastos
            ? Math.round((cat.TOTAL_GASTADO / totalGastos) * 100)
            : 0,
        }));

        setTopCategorias(top);
      })
      .catch((err) => console.error("Error gastos categoría:", err));
  }, [presupuesto, usuario]);

  // 4) Metas de ahorro
  useEffect(() => {
    if (!usuario) return;

    obtenerMetasUsuario(usuario.ID_USUARIO)
      .then((res) => {
        const metas = res.data.metas || [];

        const parsed = metas.map((m) => {
          const acumulado = Number(m.MONTO_AHORRADO || 0);
          const objetivo = Number(m.MONTO_TOTAL || 0);
          const porcentaje =
            objetivo > 0 ? Math.round((acumulado / objetivo) * 100) : 0;

          return {
            id: m.ID_META,
            nombre: m.NOMBRE,
            porcentaje,
            acumulado,
            objetivo,
          };
        });

        setMetasProgreso(parsed);
      })
      .catch((err) => console.error("Error cargando metas:", err));
  }, [usuario]);

  if (!usuario || !presupuesto || !balance) {
    return (
      <div className="p-6 text-gray-600">
        Cargando Dashboard financiero...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-gray-900 mb-2">Dashboard Financiero</h1>
        <p className="text-gray-600">
          {usuario.NOMBRES}, este es tu resumen para:{" "}
          <b>{presupuesto.NOMBRE}</b>
        </p>
      </div>

      {/* TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* INGRESOS */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm">+12%</span>
          </div>
          <p className="text-gray-600 mb-1">Ingresos del Mes</p>
          <p className="text-gray-900 text-xl">
            ${balance.ingresos.toLocaleString("es-MX")}
          </p>
        </div>

        {/* GASTOS */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-red-600 text-sm">+5%</span>
          </div>
          <p className="text-gray-600 mb-1">Gastos del Mes</p>
          <p className="text-gray-900 text-xl">
            ${balance.gastos.toLocaleString("es-MX")}
          </p>
        </div>

        {/* AHORROS */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <PiggyBank className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-blue-600 text-sm">28%</span>
          </div>
          <p className="text-gray-600 mb-1">Ahorros del Mes</p>
          <p className="text-gray-900 text-xl">
            ${balance.ahorros.toLocaleString("es-MX")}
          </p>
        </div>
      </div>

      {/* GRÁFICAS: PIE + TOP CATEGORÍAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIE CHART */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-gray-900 mb-4">Gastos por Categoría</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gastosCategoria}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                dataKey="value"
                nameKey="name"
              >
                {(gastosCategoria || []).map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  `$${value.toLocaleString("es-MX")}`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* TOP 5 CATEGORÍAS */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-gray-900 mb-4">Top 5 Categorías de Gasto</h2>
          <div className="space-y-4">
            {(topCategorias || []).map((cat, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{cat.nombre}</span>
                  </div>
                  <span className="text-gray-900">
                    ${cat.monto.toLocaleString("es-MX")}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${cat.porcentaje}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROGRESO DE METAS */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Progreso de Metas</h2>
          <Link
            to="/metas"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Ver todas
          </Link>
        </div>

        <div className="space-y-4">
          {(metasProgreso || []).map((meta) => (
            <div key={meta.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{meta.nombre}</span>
                </div>
                <span className="text-gray-600">
                  {meta.porcentaje}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${meta.porcentaje}%` }}
                />
              </div>

              <p className="text-gray-500 text-sm">
                ${meta.acumulado.toLocaleString("es-MX")} de{" "}
                ${meta.objetivo.toLocaleString("es-MX")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-gray-900 mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/categorias"
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <FolderOpen className="w-8 h-8 text-blue-600" />
            <span className="text-gray-700 text-center">Categorías</span>
          </Link>

          <Link
            to="/presupuestos"
            className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-gray-700 text-center">Presupuestos</span>
          </Link>

          <Link
            to="/transacciones"
            className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Calendar className="w-8 h-8 text-purple-600" />
            <span className="text-gray-700 text-center">Transacciones</span>
          </Link>

          <Link
            to="/metas"
            className="flex flex-col items-center gap-2 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
          >
            <Target className="w-8 h-8 text-yellow-600" />
            <span className="text-gray-700 text-center">Metas</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
