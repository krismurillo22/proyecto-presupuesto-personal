import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Wallet,
  Calendar,
  TrendingUp,
} from "lucide-react";

import {
  obtenerPresupuestosPorUsuario,
  eliminarPresupuesto
} from "../services/presupuestos";

import { obtenerBalanceMensual } from "../services/reportes";

export default function Presupuestos({ user }) {
  const [presupuestos, setPresupuestos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // 🟦 1. Cargar todos los presupuestos desde DB
  useEffect(() => {
    cargarPresupuestos();
  }, []);

  const cargarPresupuestos = async () => {
    try {
      const res = await obtenerPresupuestosPorUsuario(user.id_usuario);
      const datos = res.data.presupuestos;

      const presupuestosConGasto = await Promise.all(
        datos.map(async (p) => {
          const balance = await obtenerBalanceMensual({
            id_usuario: user.id_usuario,
            id_presupuesto: p.ID_PRESUPUESTO,
            anio: p.ANIO_INICIO,
            mes: p.MES_INICIO
          });

          const ingresos = p.TOTAL_INGRESOS;
          const presupuestoPlanificado = p.TOTAL_GASTOS + p.TOTAL_AHORROS;
          const gastadoReal = balance.data.gastos + balance.data.ahorros;

          return {
            id: p.ID_PRESUPUESTO,
            nombre: p.NOMBRE,
            anoInicio: p.ANIO_INICIO,
            mesInicio: p.MES_INICIO,
            anoFin: p.ANIO_FIN,
            mesFin: p.MES_FIN,

            ingresos,
            presupuesto: presupuestoPlanificado,
            gastado: gastadoReal,

            disponiblePresupuesto: presupuestoPlanificado - gastadoReal,
            disponibleIngresos: ingresos - gastadoReal
          };
        })
      );

      setPresupuestos(presupuestosConGasto);
    } catch (err) {
      console.error("Error cargando presupuestos:", err);
    } finally {
      setCargando(false);
    }
  };

  // 🟥 Eliminar
  const handleDelete = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este presupuesto?")) {
      await eliminarPresupuesto(id);
      cargarPresupuestos();
    }
  };

  // 🟦 Helpers
  const getVigencia = (p) => {
    if (p.anoInicio === p.anoFin && p.mesInicio === p.mesFin) {
      return `${meses[p.mesInicio - 1]} ${p.anoInicio}`;
    }
    return `${meses[p.mesInicio - 1]} ${p.anoInicio} - ${meses[p.mesFin - 1]} ${p.anoFin}`;
  };

  const getPorcentaje = (p) =>
  p.presupuesto > 0
    ? Math.round((p.gastado / p.presupuesto) * 100)
    : 0;

  const getColorPorcentaje = (pct) => {
    if (pct >= 90) return "text-red-600 bg-red-100";
    if (pct >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getBarColor = (pct) => {
    if (pct >= 90) return "bg-red-500";
    if (pct >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (cargando) {
    return <div className="p-6">Cargando presupuestos...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Gestión de Presupuestos</h1>
          <p className="text-gray-600">Administra tus presupuestos y controla tus gastos</p>
        </div>
        <Link
          to="/crearpresupuestos"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Crear Presupuesto
        </Link>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-6 h-6 text-blue-600" />
            <span className="text-gray-700">Total Presupuesto</span>
          </div>
          <p className="text-gray-900">
            ${presupuestos.reduce((s, p) => s + p.presupuesto, 0).toLocaleString("es-MX")}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-red-600" />
            <span className="text-gray-700">Total Gastado</span>
          </div>
          <p className="text-gray-900">
            ${presupuestos.reduce((s, p) => s + p.gastado, 0).toLocaleString("es-MX")}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-green-600" />
            <span className="text-gray-700">Presupuestos Activos</span>
          </div>
          <p className="text-gray-900">{presupuestos.length}</p>
        </div>
      </div>

      {/* Total Ingresos */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <span className="text-gray-700">Total Ingresos</span>
        </div>
        <p className="text-gray-900">
          $
          {presupuestos
            .reduce((s, p) => s + p.ingresos, 0)
            .toLocaleString("es-MX")}
        </p>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {presupuestos.map((p) => {
          const pct = getPorcentaje(p);

          return (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Wallet className="w-6 h-6 text-blue-600" />
                    <h3 className="text-gray-900">{p.nombre}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Vigencia: {getVigencia(p)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getColorPorcentaje(pct)}`}
                  >
                    {pct}% gastado
                  </span>

                  <Link to={`/presupuestos/editar/${p.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Grid de montos */}
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Ingresos</p>
                  <p className="text-gray-900">
                    ${p.ingresos.toLocaleString("es-MX")}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm mb-1">Presupuesto</p>
                  <p className="text-gray-900">
                    ${p.presupuesto.toLocaleString("es-MX")}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm mb-1">Gastado</p>
                  <p className="text-red-600">
                    ${p.gastado.toLocaleString("es-MX")}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm mb-1">Disp. Presupuesto</p>
                  <p className={p.disponiblePresupuesto >= 0 ? "text-green-600" : "text-red-600"}>
                    ${p.disponiblePresupuesto.toLocaleString("es-MX")}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm mb-1">Disp. Ingresos</p>
                  <p className={p.disponibleIngresos >= 0 ? "text-green-600" : "text-red-600"}>
                    ${p.disponibleIngresos.toLocaleString("es-MX")}
                  </p>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div
                  className={`h-3 rounded-full ${getBarColor(pct)}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
