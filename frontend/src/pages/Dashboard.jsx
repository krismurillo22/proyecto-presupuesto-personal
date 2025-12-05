import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  FolderOpen,
  Target,
  Calendar
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

export default function Dashboard() {
  // Datos de ejemplo
  const resumenFinanciero = {
    ingresos: 45000,
    gastos: 32500,
    ahorros: 12500
  };

  const topCategorias = [
    { nombre: "Alimentación", monto: 8500, porcentaje: 26 },
    { nombre: "Vivienda", monto: 7200, porcentaje: 22 },
    { nombre: "Transporte", monto: 5800, porcentaje: 18 },
    { nombre: "Entretenimiento", monto: 4500, porcentaje: 14 },
    { nombre: "Servicios", monto: 3500, porcentaje: 11 }
  ];

  const gastosCategoria = [
    { name: "Alimentación", value: 8500 },
    { name: "Vivienda", value: 7200 },
    { name: "Transporte", value: 5800 },
    { name: "Entretenimiento", value: 4500 },
    { name: "Otros", value: 6500 }
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const metasProgreso = [
    { id: 1, nombre: "Viaje a Europa", porcentaje: 75, acumulado: 15000, objetivo: 20000 },
    { id: 2, nombre: "Comprar un auto", porcentaje: 50, acumulado: 10000, objetivo: 20000 },
    { id: 3, nombre: "Invertir en acciones", porcentaje: 30, acumulado: 6000, objetivo: 20000 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Dashboard Financiero</h1>
        <p className="text-gray-600">
          Resumen de tus finanzas personales - Noviembre 2025
        </p>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm">+12%</span>
          </div>
          <p className="text-gray-600 mb-1">Ingresos del Mes</p>
          <p className="text-gray-900">
            ${resumenFinanciero.ingresos.toLocaleString("es-MX")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-red-600 text-sm">+5%</span>
          </div>
          <p className="text-gray-600 mb-1">Gastos del Mes</p>
          <p className="text-gray-900">
            ${resumenFinanciero.gastos.toLocaleString("es-MX")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <PiggyBank className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-blue-600 text-sm">28%</span>
          </div>
          <p className="text-gray-600 mb-1">Ahorros del Mes</p>
          <p className="text-gray-900">
            ${resumenFinanciero.ahorros.toLocaleString("es-MX")}
          </p>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
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
              >
                {gastosCategoria.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString("es-MX")}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categorías */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-gray-900 mb-4">Top 5 Categorías de Gasto</h2>
          <div className="space-y-4">
            {topCategorias.map((cat, index) => (
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

      {/* Progreso de Metas */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Progreso de Metas</h2>
          <Link to="/metas" className="text-blue-600 hover:text-blue-700 text-sm">
            Ver todas
          </Link>
        </div>

        <div className="space-y-4">
          {metasProgreso.map((meta) => (
            <div key={meta.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{meta.nombre}</span>
                </div>
                <span className="text-gray-600">{meta.porcentaje}%</span>
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

      {/* Accesos Rápidos */}
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
