import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
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
    monto_mensual: "",
    dia_vencimiento: 1,
    vigente: true,
  });

  // ---------------------------------------
  // CARGAR SUBCATEGORÍAS Y OBLIGACIONES
  // ---------------------------------------
  useEffect(() => {
    if (!userId) return;

    obtenerSubcategorias()
      .then((res) => {
        setSubcategoriasDisponibles(
          res.data.subcategorias.map((s) => ({
            id: Number(s.ID_SUBCATEGORIA),
            nombre: s.NOMBRE,
            categoria: s.CATEGORIA,
          }))
        );
      })
      .catch(console.error);

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
  // MODAL
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
        id_subcategoria: "",
        monto_mensual: "",
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
  // GUARDAR
  // ---------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingObligacion) {
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
        await crearObligacion({
          id_usuario: user.id_usuario,
          id_subcategoria: Number(formData.id_subcategoria),
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
      console.error("ERROR BACKEND:", err.response?.data || err);
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
  // RENDER
  // ---------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-gray-900 mb-2">Obligaciones Fijas</h1>
          <p className="text-gray-600">Pagos recurrentes</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" /> Nueva Obligación
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Subcategoría</th>
              <th className="px-6 py-3 text-right">Monto</th>
              <th className="px-6 py-3 text-center">Día</th>
              <th className="px-6 py-3 text-center">Estado</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {obligaciones.map((o) => (
              <tr key={o.ID_OBLIGACION} className="hover:bg-gray-50">
                <td className="px-6 py-3">{o.NOMBRE}</td>
                <td className="px-6 py-3">
                  {o.NOMBRE_SUBCATEGORIA}
                  <div className="text-sm text-gray-500">
                    {
                      subcategoriasDisponibles.find(
                        (s) => s.id === o.ID_SUBCATEGORIA
                      )?.categoria
                    }
                  </div>
                </td>
                <td className="px-6 py-3 text-right">
                  ${o.MONTO_MENSUAL.toLocaleString("es-MX")}
                </td>
                <td className="px-6 py-3 text-center">{o.DIA_VENCIMIENTO}</td>
                <td className="px-6 py-3 text-center">
                  {o.VIGENTE === 1 ? (
                    <span className="text-green-600">
                      <CheckCircle className="inline w-4 h-4" /> Vigente
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      <XCircle className="inline w-4 h-4" /> Inactiva
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenModal(o)}
                      className="text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(o.ID_OBLIGACION)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <ModalObligacion
          subcategorias={subcategoriasDisponibles}
          formData={formData}
          setFormData={setFormData}
          handleClose={handleCloseModal}
          handleSubmit={handleSubmit}
          editingObligacion={editingObligacion}
        />
      )}
    </div>
  );
}

/* -----------------------------------------------------------
   MODAL
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          {editingObligacion ? "Editar Obligación" : "Nueva Obligación"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-600">Nombre</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Subcategoría</label>
            <select
              className="w-full border rounded-lg p-2"
              value={formData.id_subcategoria}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  id_subcategoria: Number(e.target.value),
                })
              }
              required
            >
              <option value="">Seleccione una subcategoría</option>
              {subcategorias.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} ({s.categoria})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Monto Mensual</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2"
              value={formData.monto_mensual}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  monto_mensual: e.target.value,
                })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Día de vencimiento</label>
            <input
              type="number"
              min="1"
              max="31"
              className="w-full border rounded-lg p-2"
              value={formData.dia_vencimiento}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dia_vencimiento: Number(e.target.value),
                })
              }
              required
            />
          </div>

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

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 border rounded-lg"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {editingObligacion ? "Guardar" : "Crear Obligación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
