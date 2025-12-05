import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Receipt,
  TrendingUp,
  TrendingDown,
  Filter
} from "lucide-react";

export default function Transacciones() {
  const [transacciones, setTransacciones] = useState([
    {
      id: 1,
      subcategoria: "Supermercado",
      categoria: "Alimentación",
      tipo: "gasto",
      ano: 2025,
      mes: 11,
      monto: 2500,
      fecha: "2025-11-15",
      metodoPago: "Tarjeta de crédito",
      descripcion: "Compras de la semana"
    },
    {
      id: 2,
      subcategoria: "Renta",
      categoria: "Vivienda",
      tipo: "gasto",
      ano: 2025,
      mes: 11,
      monto: 7200,
      fecha: "2025-11-01",
      metodoPago: "Transferencia",
      descripcion: "Pago mensual de renta"
    },
    {
      id: 3,
      subcategoria: "Salario",
      categoria: "Salario",
      tipo: "ingreso",
      ano: 2025,
      mes: 11,
      monto: 45000,
      fecha: "2025-11-01",
      metodoPago: "Transferencia",
      descripcion: "Salario mensual"
    },
    {
      id: 4,
      subcategoria: "Gasolina",
      categoria: "Transporte",
      tipo: "gasto",
      ano: 2025,
      mes: 11,
      monto: 800,
      fecha: "2025-11-10",
      metodoPago: "Efectivo",
      descripcion: "Carga de gasolina"
    },
    {
      id: 5,
      subcategoria: "Netflix",
      categoria: "Entretenimiento",
      tipo: "gasto",
      ano: 2025,
      mes: 11,
      monto: 199,
      fecha: "2025-11-05",
      metodoPago: "Tarjeta de débito",
      descripcion: "Suscripción mensual"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingTransaccion, setEditingTransaccion] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const subcategoriasDisponibles = [
    { nombre: "Salario", categoria: "Salario", tipo: "ingreso" },
    { nombre: "Supermercado", categoria: "Alimentación", tipo: "gasto" },
    { nombre: "Restaurantes", categoria: "Alimentación", tipo: "gasto" },
    { nombre: "Renta", categoria: "Vivienda", tipo: "gasto" },
    { nombre: "Servicios", categoria: "Vivienda", tipo: "gasto" },
    { nombre: "Gasolina", categoria: "Transporte", tipo: "gasto" },
    { nombre: "Uber", categoria: "Transporte", tipo: "gasto" },
    { nombre: "Netflix", categoria: "Entretenimiento", tipo: "gasto" },
    { nombre: "Cine", categoria: "Entretenimiento", tipo: "gasto" }
  ];

  const [formData, setFormData] = useState({
    subcategoria: "Supermercado",
    ano: 2025,
    mes: 11,
    monto: 0,
    fecha: new Date().toISOString().split("T")[0],
    metodoPago: "Efectivo",
    descripcion: ""
  });

  const handleOpenModal = (transaccion) => {
    if (transaccion) {
      setEditingTransaccion(transaccion);
      setFormData({
        subcategoria: transaccion.subcategoria,
        ano: transaccion.ano,
        mes: transaccion.mes,
        monto: transaccion.monto,
        fecha: transaccion.fecha,
        metodoPago: transaccion.metodoPago,
        descripcion: transaccion.descripcion
      });
    } else {
      setEditingTransaccion(null);
      setFormData({
        subcategoria: "Supermercado",
        ano: 2025,
        mes: 11,
        monto: 0,
        fecha: new Date().toISOString().split("T")[0],
        metodoPago: "Efectivo",
        descripcion: ""
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTransaccion(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subcatInfo = subcategoriasDisponibles.find(
      (s) => s.nombre === formData.subcategoria
    );

    if (editingTransaccion) {
      setTransacciones(
        transacciones.map((t) =>
          t.id === editingTransaccion.id
            ? {
                ...t,
                ...formData,
                categoria: subcatInfo?.categoria || "",
                tipo: subcatInfo?.tipo || "gasto"
              }
            : t
        )
      );
    } else {
      const newTransaccion = {
        id: Math.max(...transacciones.map((t) => t.id), 0) + 1,
        ...formData,
        categoria: subcatInfo?.categoria || "",
        tipo: subcatInfo?.tipo || "gasto"
      };
      setTransacciones([newTransaccion, ...transacciones]);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar esta transacción?")) {
      setTransacciones(transacciones.filter((t) => t.id !== id));
    }
  };

  const transaccionesFiltradas =
    filtroTipo === "todos"
      ? transacciones
      : transacciones.filter((t) => t.tipo === filtroTipo);

  const totales = {
    ingresos: transacciones
      .filter((t) => t.tipo === "ingreso")
      .reduce((sum, t) => sum + t.monto, 0),
    gastos: transacciones
      .filter((t) => t.tipo === "gasto")
      .reduce((sum, t) => sum + t.monto, 0),
  };

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Gestión de Transacciones</h1>
          <p className="text-gray-600">
            Registra y administra todos tus ingresos y gastos
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Registrar Transacción
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <span className="text-gray-700">Total Ingresos</span>
          </div>
          <p className="text-green-600">
            ${totales.ingresos.toLocaleString("es-MX")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <span className="text-gray-700">Total Gastos</span>
          </div>
          <p className="text-red-600">
            ${totales.gastos.toLocaleString("es-MX")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span className="text-gray-700">Balance</span>
          </div>
          <p
            className={
              totales.ingresos - totales.gastos >= 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            ${(totales.ingresos - totales.gastos).toLocaleString("es-MX")}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Filtrar por tipo:</span>

          <div className="flex gap-2">
            {[
              { key: "todos", label: "Todos", color: "bg-blue-600" },
              { key: "ingreso", label: "Ingresos", color: "bg-green-600" },
              { key: "gasto", label: "Gastos", color: "bg-red-600" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFiltroTipo(btn.key)}
                className={`px-4 py-2 rounded-lg ${
                  filtroTipo === btn.key
                    ? `${btn.color} text-white`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Transacciones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-gray-900">Historial de Transacciones</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Fecha</th>
                <th className="px-6 py-3 text-left text-gray-700">Subcategoría</th>
                <th className="px-6 py-3 text-left text-gray-700">Tipo</th>
                <th className="px-6 py-3 text-left text-gray-700">Método de Pago</th>
                <th className="px-6 py-3 text-right text-gray-700">Monto</th>
                <th className="px-6 py-3 text-center text-gray-700">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {transaccionesFiltradas.map((transaccion) => (
                <tr key={transaccion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-gray-900">
                      {new Date(transaccion.fecha).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{transaccion.subcategoria}</p>
                      <p className="text-gray-500 text-sm">
                        {transaccion.categoria}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        transaccion.tipo === "ingreso"
                          ? "bg-green-100 text-green-700"
                          : transaccion.tipo === "gasto"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {transaccion.tipo.charAt(0).toUpperCase() +
                        transaccion.tipo.slice(1)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-gray-600">
                      {transaccion.metodoPago}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span
                      className={
                        transaccion.tipo === "ingreso"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {transaccion.tipo === "ingreso" ? "+" : "-"}$
                      {transaccion.monto.toLocaleString("es-MX")}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(transaccion)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaccion.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transaccionesFiltradas.length === 0 && (
            <div className="text-center py-10 text-gray-600">
              No hay transacciones disponibles.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-gray-900">
                {editingTransaccion ? "Editar Transacción" : "Nueva Transacción"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Subcategoría */}
              <div>
                <label className="block text-gray-700 mb-2">Subcategoría</label>
                <select
                  value={formData.subcategoria}
                  onChange={(e) =>
                    setFormData({ ...formData, subcategoria: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {subcategoriasDisponibles.map((sub) => (
                    <option key={sub.nombre} value={sub.nombre}>
                      {sub.nombre} ({sub.categoria})
                    </option>
                  ))}
                </select>
              </div>

              {/* Año y Mes */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Año</label>
                  <input
                    type="number"
                    value={formData.ano}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ano: Number(e.target.value)
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    min="2020"
                    max="2030"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Mes</label>
                  <select
                    value={formData.mes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mes: Number(e.target.value)
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {meses.map((mes, idx) => (
                      <option key={idx} value={idx + 1}>
                        {mes}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Monto */}
              <div>
                <label className="block text-gray-700 mb-2">Monto</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.monto || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monto: Number(e.target.value)
                      })
                    }
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-gray-700 mb-2">Fecha</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Método de pago */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Método de Pago
                </label>
                <select
                  value={formData.metodoPago}
                  onChange={(e) =>
                    setFormData({ ...formData, metodoPago: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta de débito">Tarjeta de débito</option>
                  <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Descripción de la transacción..."
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingTransaccion ? "Guardar Cambios" : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
