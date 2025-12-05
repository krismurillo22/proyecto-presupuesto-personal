import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Wallet, Calendar, TrendingUp } from "lucide-react";

export default function Presupuestos() {
  const [presupuestos, setPresupuestos] = useState([
    {
      id: 1,
      nombre: "Presupuesto Mensual Nov 2025",
      anoInicio: 2025,
      mesInicio: 11,
      anoFin: 2025,
      mesFin: 11,
      montoTotal: 35000,
      gastado: 28750
    },
    {
      id: 2,
      nombre: "Presupuesto Trimestral Q4 2025",
      anoInicio: 2025,
      mesInicio: 10,
      anoFin: 2025,
      mesFin: 12,
      montoTotal: 105000,
      gastado: 75300
    },
    {
      id: 3,
      nombre: "Presupuesto Anual 2025",
      anoInicio: 2025,
      mesInicio: 1,
      anoFin: 2025,
      mesFin: 12,
      montoTotal: 420000,
      gastado: 385200
    }
  ]);

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar este presupuesto?")) {
      setPresupuestos(presupuestos.filter((p) => p.id !== id));
    }
  };

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getVigencia = (p) => {
    if (p.anoInicio === p.anoFin && p.mesInicio === p.mesFin) {
      return `${meses[p.mesInicio - 1]} ${p.anoInicio}`;
    }
    return `${meses[p.mesInicio - 1]} ${p.anoInicio} - ${meses[p.mesFin - 1]} ${p.anoFin}`;
  };

  const getPorcentajeGastado = (presupuesto) => {
    return Math.round((presupuesto.gastado / presupuesto.montoTotal) * 100);
  };

  const getColorPorcentaje = (porcentaje) => {
    if (porcentaje >= 90) return "text-red-600 bg-red-100";
    if (porcentaje >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getBarColor = (porcentaje) => {
    if (porcentaje >= 90) return "bg-red-500";
    if (porcentaje >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Gestión de Presupuestos</h1>
          <p className="text-gray-600">
            Administra tus presupuestos y controla tus gastos
          </p>
        </div>
        <Link
          to="/crearpresupuestos"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Crear Presupuesto
        </Link>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-6 h-6 text-blue-600" />
            <span className="text-gray-700">Total Presupuestado</span>
          </div>
          <p className="text-gray-900">
            ${presupuestos
              .reduce((sum, p) => sum + p.montoTotal, 0)
              .toLocaleString("es-MX")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-red-600" />
            <span className="text-gray-700">Total Gastado</span>
          </div>
          <p className="text-gray-900">
            ${presupuestos
              .reduce((sum, p) => sum + p.gastado, 0)
              .toLocaleString("es-MX")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-green-600" />
            <span className="text-gray-700">Presupuestos Activos</span>
          </div>
          <p className="text-gray-900">{presupuestos.length}</p>
        </div>
      </div>

      {/* Lista de Presupuestos */}
      <div className="space-y-4">
        {presupuestos.map((presupuesto) => {
          const porcentaje = getPorcentajeGastado(presupuesto);
          const disponible = presupuesto.montoTotal - presupuesto.gastado;

          return (
            <div
              key={presupuesto.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Wallet className="w-6 h-6 text-blue-600" />
                    <h3 className="text-gray-900">{presupuesto.nombre}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Vigencia: {getVigencia(presupuesto)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getColorPorcentaje(
                      porcentaje
                    )}`}
                  >
                    {porcentaje}% gastado
                  </span>

                  <Link
                    to={`/presupuestos/editar/${presupuesto.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDelete(presupuesto.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Grid info */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Monto Total</p>
                  <p className="text-gray-900">
                    ${presupuesto.montoTotal.toLocaleString("es-MX")}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm mb-1">Gastado</p>
                  <p className="text-red-600">
                    ${presupuesto.gastado.toLocaleString("es-MX")}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm mb-1">Disponible</p>
                  <p
                    className={
                      disponible >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    ${disponible.toLocaleString("es-MX")}
                  </p>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${getBarColor(
                    porcentaje
                  )}`}
                  style={{ width: `${Math.min(porcentaje, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Si no hay presupuestos */}
      {presupuestos.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-900 mb-2">No hay presupuestos</h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer presupuesto para comenzar a controlar tus gastos
          </p>
          <Link
            to="/presupuestos/nuevo"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Crear Presupuesto
          </Link>
        </div>
      )}
    </div>
  );
}
