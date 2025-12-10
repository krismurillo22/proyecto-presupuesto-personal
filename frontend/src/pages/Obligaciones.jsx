// src/pages/Obligaciones.jsx
import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  obtenerObligacionesPorUsuario,
  crearObligacion,
  actualizarObligacion,
  eliminarObligacion,
} from "../services/obligaciones";

import { obtenerSubcategorias } from "../services/subcategorias";

export default function Obligaciones({ user }) {
  const userId = user?.id_usuario;

  const [obligaciones, setObligaciones] = useState([]);
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingObligacion, setEditingObligacion] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    id_subcategoria: "",
    monto_mensual: 0,
    dia_vencimiento: 1,
    vigente: true,
  });

  // ---------------------------------------
  // CARGAR SUBCATEGORÍAS + OBLIGACIONES
  // ---------------------------------------
  useEffect(() => {
    if (!userId) return;

    obtenerSubcategorias().then((res) => {
      const lista = res.data.subcategorias.map((s) => ({
        id: s.ID_SUBCATEGORIA,
        nombre: s.NOMBRE,
        categoria: s.CATEGORIA,
      }));
      setSubcategoriasDisponibles(lista);
    });

    cargarObligaciones();
  }, [userId]);

  const cargarObligaciones = async () => {
    try {
      const res = await obtenerObligacionesPorUsuario(userId);
      setObligaciones(res.data.obligaciones);
    } catch (err) {
      console.error("Error cargando obligaciones:", err);
    }
  };

  // ---------------------------------------
  // MODAL: ABRIR / CERRAR
  // ---------------------------------------
  const handleOpenModal = (obligacion = null) => {
    if (obligacion) {
      setEditingObligacion(obligacion);

      setFormData({
        nombre: obligacion.NOMBRE,
        id_subcategoria: obligacion.ID_SUBCATEGORIA,
        monto_mensual: obligacion.MONTO_MENSUAL,
        dia_vencimiento: obligacion.DIA_VENCIMIENTO,
        vigente: obligacion.VIGENTE === 1,
      });
    } else {
      setEditingObligacion(null);
      setFormData({
        nombre: "",
        id_subcategoria: subcategoriasDisponibles[0]?.id || "",
        monto_mensual: 0,
        dia_vencimiento: 1,
        vigente: true,
      });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingObligacion(null);
  };

  // ---------------------------------------
  // GUARDAR / EDITAR OBLIGACIÓN
  // ---------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingObligacion) {
        // EDITAR
        await actualizarObligacion(editingObligacion.ID_OBLIGACION, {
          nombre: formData.nombre,
          descripcion: null,
          monto_mensual: Number(formData.monto_mensual),
          dia_vencimiento: Number(formData.dia_vencimiento),
          fecha_fin: null,
          vigente: formData.vigente ? 1 : 0,
          modificado_por: user.email,
        });
      } else {
        // CREAR
        await crearObligacion({
          id_usuario: user.id_usuario,
          id_subcategoria: formData.id_subcategoria,
          nombre: formData.nombre,
          descripcion: null,
          monto_mensual: Number(formData.monto_mensual),
          dia_vencimiento: Number(formData.dia_vencimiento),
          fecha_inicio: null,
          fecha_fin: null,
          creado_por: user.email,
        });
      }

      handleCloseModal();
      cargarObligaciones();

    } catch (err) {
      console.error("RAW ERROR DEL BACKEND:", err.response?.data || err);
      alert("Error guardando obligación");
    }
  };
  // ---------------------------------------
  // ELIMINAR
  // ---------------------------------------
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar obligación?")) return;

    await eliminarObligacion(id);
    cargarObligaciones();
  };

  // ---------------------------------------
  // UTILIDADES
  // ---------------------------------------
  const getProximoPago = (dia) => {
    const hoy = new Date();
    let fecha = new Date(hoy.getFullYear(), hoy.getMonth(), dia);

    if (fecha < hoy) {
      fecha = new Date(hoy.getFullYear(), hoy.getMonth() + 1, dia);
    }

    return fecha.toISOString().split("T")[0];
  };

  const getDiasParaVencimiento = (fecha) => {
    const hoy = new Date();
    const venc = new Date(fecha);
    return Math.ceil((venc - hoy) / (1000 * 60 * 60 * 24));
  };

  const getColorVencimiento = (dias) => {
    if (dias < 0) return "text-red-600 bg-red-100";
    if (dias <= 7) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  // ---------------------------------------
  // RENDER
  // ---------------------------------------
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Obligaciones Fijas</h1>
          <p className="text-gray-600">Pagos recurrentes automáticos</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" /> Nueva Obligación
        </button>
      </div>

      {/* Tabla completa */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Subcategoría</th>
              <th className="px-6 py-3 text-right">Monto</th>
              <th className="px-6 py-3 text-center">Día</th>
              <th className="px-6 py-3 text-center">Próximo</th>
              <th className="px-6 py-3 text-center">Estado</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {obligaciones.map((o) => {
              const proximo = getProximoPago(o.DIA_VENCIMIENTO);
              const dias = getDiasParaVencimiento(proximo);

              const categoria = subcategoriasDisponibles.find(
                (s) => s.id === o.ID_SUBCATEGORIA
              )?.categoria;

              return (
                <tr key={o.ID_OBLIGACION} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{o.NOMBRE}</td>
                  <td className="px-6 py-3">
                    {o.NOMBRE_SUBCATEGORIA}
                    <div className="text-sm text-gray-500">{categoria}</div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    ${o.MONTO_MENSUAL.toLocaleString("es-MX")}
                  </td>
                  <td className="px-6 py-3 text-center">{o.DIA_VENCIMIENTO}</td>
                  <td className="px-6 py-3 text-center">
                    <span>{proximo}</span>
                    <span
                      className={`block mt-1 px-2 py-1 rounded-full text-xs ${getColorVencimiento(
                        dias
                      )}`}
                    >
                      {dias < 0
                        ? "Vencida"
                        : dias === 0
                        ? "Hoy"
                        : `${dias} días`}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    {o.VIGENTE === 1 ? (
                      <span className="text-green-600 font-medium">
                        <CheckCircle className="w-5 h-5 inline" /> Vigente
                      </span>
                    ) : (
                      <span className="text-gray-500 font-medium">
                        <XCircle className="w-5 h-5 inline" /> Inactiva
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(o)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(o.ID_OBLIGACION)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <ModalObligacion
          subcategorias={subcategoriasDisponibles}
          formData={formData}
          setFormData={setFormData}
          editingObligacion={editingObligacion}
          handleClose={handleCloseModal}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

/* -----------------------------------------------------------
   MODAL COMPONENT
----------------------------------------------------------- */
function ModalObligacion({
  subcategorias,
  formData,
  setFormData,
  handleClose,
  handleSubmit,
  editingObligacion,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingObligacion ? "Editar Obligación" : "Nueva Obligación"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Nombre */}
          <div>
            <label className="block text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
            />
          </div>

          {/* Subcategoría */}
          <div>
            <label className="block text-gray-700 mb-1">Subcategoría</label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.id_subcategoria}
              onChange={(e) =>
                setFormData({ ...formData, id_subcategoria: Number(e.target.value) })
              }
            >
              {subcategorias.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} ({s.categoria})
                </option>
              ))}
            </select>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-gray-700 mb-1">Monto Mensual</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.montoMensual === 0 ? "" : formData.montoMensual}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  montoMensual: val === "" ? "" : Number(val),
                });
              }}
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Día vencimiento */}
          <div>
            <label className="block text-gray-700 mb-1">Día de vencimiento</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.dia_vencimiento}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dia_vencimiento: Number(e.target.value),
                })
              }
              min="1"
              max="31"
              required
            />
          </div>

          {/* Vigente */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.vigente}
              onChange={(e) =>
                setFormData({ ...formData, vigente: e.target.checked })
              }
            />
            <span>Obligación activa</span>
          </div>

          {/* BOTONES */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingObligacion ? "Guardar cambios" : "Crear Obligación"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
