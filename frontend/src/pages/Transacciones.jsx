import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Receipt,
  TrendingUp,
  TrendingDown,
  Filter,
  Layers
} from "lucide-react";

import {
  obtenerTransaccionesPorUsuario,
  crearTransaccion,
  actualizarTransaccion,
  eliminarTransaccion
} from "../services/transacciones";

import { obtenerSubcategorias } from "../services/subcategorias";

export default function Transacciones({ user }) {
  const [transacciones, setTransacciones] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaccion, setEditingTransaccion] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const [formData, setFormData] = useState({
    id_subcategoria: "",
    ano: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    monto: "",
    fecha: new Date().toISOString().split("T")[0],
    metodoPago: "Efectivo",
    descripcion: ""
  });

  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  const determinarTipo = (nombreCategoria) => {
    if (!nombreCategoria) return null;

    const cat = nombreCategoria.toLowerCase();

    if (cat.includes("ingreso")) return "ingreso";
    if (cat.includes("ahorro")) return "ahorro";
    if (cat.includes("gasto")) return "gasto";

    return null;
  };


  // 🔥 1) Cargar subcategorías + transacciones
  useEffect(() => {
    cargarSubcategorias();
  }, []);

  useEffect(() => {
    if (subcategorias.length > 0) cargarTransacciones();
  }, [subcategorias]);

  const cargarSubcategorias = () => {
    obtenerSubcategorias()
      .then(res => {
        setSubcategorias(
          res.data.subcategorias.map(s => ({
            id: Number(s.ID_SUBCATEGORIA),
            nombre: s.NOMBRE,
            id_categoria: s.ID_CATEGORIA,
            categoria: s.NOMBRE_CATEGORIA,
            tipo: s.TIPO            // 🔥 AHORA SÍ EXISTE
          }))
        );
      })
      .catch(console.error);
  };

  const cargarTransacciones = () => {
    obtenerTransaccionesPorUsuario(user.id_usuario)
      .then(res => {
        console.log("RAW FROM BACKEND:", res.data.transacciones);
        const t = res.data.transacciones.map(tr => ({
          id: tr.ID_TRANSACCION,
          id_subcategoria: tr.ID_SUBCATEGORIA,
          subcategoria: tr.NOMBRE_SUBCATEGORIA,
          categoria: tr.ID_CATEGORIA || "",
          tipo: tr.TIPO,
          ano: tr.ANIO,
          mes: tr.MES,
          monto: tr.MONTO,
          fecha: tr.FECHA_MOVIMIENTO.split(" ")[0],
          metodoPago: tr.METODO_PAGO,
          descripcion: tr.DESCRIPCION
        }));
        setTransacciones(t);
      })
      .catch(err => console.error("Error transacciones:", err));
  };

  // 🔥 Abrir modal
  const handleOpenModal = (transaccion = null) => {
    if (transaccion) {
      setEditingTransaccion(transaccion);
      setFormData({
        id_subcategoria: transaccion.id_subcategoria,
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
        id_subcategoria: subcategorias[0]?.id || "",
        ano: new Date().getFullYear(),
        mes: new Date().getMonth() + 1,
        monto: "",
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

  // 🔥 Guardar (crear/editar)
const handleSubmit = (e) => {
  e.preventDefault();

  // 1️⃣ Validaciones duras
  if (!formData.id_subcategoria) {
    alert("Seleccione una subcategoría");
    return;
  }

  if (!formData.monto || Number(formData.monto) <= 0) {
    alert("Ingrese un monto válido");
    return;
  }

  const subInfo = subcategorias.find(
    s => s.id === Number(formData.id_subcategoria)
  );

  if (!subInfo || !subInfo.tipo) {
    alert("No se pudo determinar el tipo de la transacción");
    return;
  }

  const payload = {
    id_usuario: user.id_usuario,
    id_presupuesto: 2,
    id_subcategoria: subInfo.id,
    id_obligacion: null,
    anio: Number(formData.ano),
    mes: Number(formData.mes),
    tipo: subInfo.tipo,  
    descripcion: formData.descripcion,
    monto: Number(formData.monto),
    fecha_movimiento: formData.fecha,
    metodo_pago: formData.metodoPago,
    numero_factura: null,
    observaciones: null,
    creado_por: user.email
  };

  // 3️⃣ Crear
  crearTransaccion(payload)
    .then(() => {
      cargarTransacciones();
      handleCloseModal();
    })
    .catch(err => {
      console.error("ERROR BACKEND:", err.response?.data || err);
      alert(err.response?.data?.error || "Error al guardar transacción");
    });
};

  // 🔥 Eliminar
  const handleDelete = (id) => {
    if (!confirm("¿Eliminar transacción?")) return;

    eliminarTransaccion(id)
      .then(() => cargarTransacciones())
      .catch(err => console.error("Error eliminando transacción:", err));
  };

  // Filtro
  const transaccionesFiltradas =
    filtroTipo === "todos"
      ? transacciones
      : transacciones.filter(t => t.tipo === filtroTipo);

  const totales = {
    ingresos: transacciones.filter(t => t.tipo === "ingreso").reduce((a, b) => a + b.monto, 0),
    gastos: transacciones.filter(t => t.tipo === "gasto").reduce((a, b) => a + b.monto, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Gestión de Transacciones</h1>
          <p className="text-gray-600">
            Registra y administra ingresos y gastos
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" />
          Registrar Transacción
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Ingresos */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <span className="text-gray-700">Total Ingresos</span>
          </div>
          <p className="text-green-600">
            ${totales.ingresos.toLocaleString("es-MX")}
          </p>
        </div>

        {/* Gastos */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <span className="text-gray-700">Total Gastos</span>
          </div>
          <p className="text-red-600">
            ${totales.gastos.toLocaleString("es-MX")}
          </p>
        </div>

        {/* Balance */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span className="text-gray-700">Balance</span>
          </div>
          <p className={totales.ingresos - totales.gastos >= 0 ? "text-green-600" : "text-red-600"}>
            ${(totales.ingresos - totales.gastos).toLocaleString("es-MX")}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Filtrar por tipo:</span>

          <button
            onClick={() => setFiltroTipo("todos")}
            className={`px-4 py-2 rounded-lg ${filtroTipo === "todos" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Todos
          </button>

          <button
            onClick={() => setFiltroTipo("ingreso")}
            className={`px-4 py-2 rounded-lg ${filtroTipo === "ingreso" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            Ingresos
          </button>

          <button
            onClick={() => setFiltroTipo("gasto")}
            className={`px-4 py-2 rounded-lg ${filtroTipo === "gasto" ? "bg-red-600 text-white" : "bg-gray-200"}`}
          >
            Gastos
          </button>
        </div>
      </div>

      {/* Listado */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-gray-900">Historial de Transacciones</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Subcategoría</th>
                <th className="px-6 py-3 text-left">Tipo</th>
                <th className="px-6 py-3 text-left">Método</th>
                <th className="px-6 py-3 text-right">Monto</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {transaccionesFiltradas.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{t.fecha}</td>

                  <td className="px-6 py-4">{t.subcategoria}</td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      t.tipo === "ingreso"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {t.tipo}
                    </span>
                  </td>

                  <td className="px-6 py-4">{t.metodoPago}</td>

                  <td className="px-6 py-4 text-right">
                    {t.tipo === "ingreso" ? "+" : "-"}${t.monto.toLocaleString("es-MX")}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(t)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(t.id)}
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
            <div className="text-center py-8 text-gray-500">
              No hay transacciones registradas.
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-gray-900">
                {editingTransaccion ? "Editar Transacción" : "Nueva Transacción"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Subcategoría */}
              <div>
                <label className="block text-gray-700 mb-2">Subcategoría</label>
                <select
                  value={formData.id_subcategoria}
                  onChange={e =>
                    setFormData({ 
                      ...formData, 
                      id_subcategoria: Number(e.target.value) 
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">-- Seleccione --</option>
                  {subcategorias.map(sub => (
                    <option key={sub.id} value={sub.id}>
                      {sub.nombre}
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
                    onChange={e => setFormData({ ...formData, ano: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Mes</label>
                  <select
                    value={formData.mes}
                    onChange={e => setFormData({ ...formData, mes: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {meses.map((m, idx) => (
                      <option key={idx} value={idx + 1}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Monto */}
              <div>
                <label className="block text-gray-700 mb-2">Monto</label>
                <input
                  type="number"
                  value={formData.monto}
                  onChange={e => setFormData({ ...formData, monto: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-gray-700 mb-2">Fecha</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={e => {
                    const raw = e.target.value;

                    // Si viene "19/02/2025", lo re-formateamos a YYYY-MM-DD
                    if (raw.includes("/")) {
                      const [dia, mes, anio] = raw.split("/");
                      const iso = `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
                      setFormData({ ...formData, fecha: iso });
                    } else {
                      // si viene ISO normal, lo usamos directo
                      setFormData({ ...formData, fecha: raw });
                    }
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Método */}
              <div>
                <label className="block text-gray-700 mb-2">Método de pago</label>
                <select
                  value={formData.metodoPago}
                  onChange={e => setFormData({ ...formData, metodoPago: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
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
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
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
