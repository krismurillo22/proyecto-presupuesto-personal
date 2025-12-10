// =========================================
//   METAS DE AHORRO — COMPLETAMENTE CONECTADO
// =========================================

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Target, TrendingUp, Calendar } from "lucide-react";
import {
  obtenerMetasUsuario,
  crearMeta,
  actualizarMeta,
  eliminarMeta,
  abonarMeta
} from "../services/metas";

export default function Metas({ user }) {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showAbonoModal, setShowAbonoModal] = useState(false);

  const [editingMeta, setEditingMeta] = useState(null);
  const [metaParaAbono, setMetaParaAbono] = useState(null);
  const [montoAbono, setMontoAbono] = useState("");

  const [formData, setFormData] = useState({
    id_subcategoria: "",
    nombre: "",
    monto_total: "",
    fecha_objetivo: "",
    descripcion: "",
    prioridad: "media",
  });

  // =========================
  // Cargar metas del usuario
  // =========================
  useEffect(() => {
    if (!user) return;

    obtenerMetasUsuario(user.id_usuario)
      .then((res) => {
        setMetas(res.data.metas);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  // =========================
  // Abrir modal Crear/Editar
  // =========================
  const handleOpenModal = (meta) => {
    if (meta) {
      setEditingMeta(meta);
      setFormData({
        id_subcategoria: meta.ID_SUBCATEGORIA,
        nombre: meta.NOMBRE,
        monto_total: meta.MONTO_TOTAL,
        fecha_objetivo: meta.FECHA_OBJETIVO.split(" ")[0],
        descripcion: meta.DESCRIPCION || "",
        prioridad: meta.PRIORIDAD,
      });
    } else {
      setEditingMeta(null);
      setFormData({
        id_subcategoria: "",
        nombre: "",
        monto_total: "",
        fecha_objetivo: "",
        descripcion: "",
        prioridad: "media",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMeta(null);
  };

  // =========================
  // Enviar Crear/Editar
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        id_usuario: user.id_usuario,
        id_subcategoria: Number(formData.id_subcategoria),
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        monto_total: Number(formData.monto_total),
        fecha_inicio: new Date().toISOString().split("T")[0],
        fecha_objetivo: formData.fecha_objetivo,
        prioridad: formData.prioridad,
        creado_por: user.email,
      };

      if (editingMeta) {
        await actualizarMeta(editingMeta.ID_META, {
          ...payload,
          modificado_por: user.email,
        });
      } else {
        await crearMeta(payload);
      }

      // recargar
      const res = await obtenerMetasUsuario(user.id_usuario);
      setMetas(res.data.metas);

      handleCloseModal();
    } catch (err) {
      console.error("Error guardando meta:", err);
      alert("Error guardando meta");
    }
  };

  // =========================
  // Abrir modal de abonar
  // =========================
  const handleOpenAbonoModal = (meta) => {
    setMetaParaAbono(meta);
    setMontoAbono("");
    setShowAbonoModal(true);
  };

  const handleCloseAbonoModal = () => {
    setShowAbonoModal(false);
    setMontoAbono("");
    setMetaParaAbono(null);
  };

  // =========================
  // Guardar abono
  // =========================
  const handleAbonar = async (e) => {
    e.preventDefault();

    if (!montoAbono || montoAbono <= 0) return;

    try {
      await abonarMeta(metaParaAbono.ID_META, {
        monto: Number(montoAbono),
        modificado_por: user.email,
      });

      const res = await obtenerMetasUsuario(user.id_usuario);
      setMetas(res.data.metas);

      handleCloseAbonoModal();
    } catch (err) {
      console.error("Error abonando:", err);
      alert("Error al abonar");
    }
  };

  // =========================
  // Eliminar meta
  // =========================
  const handleDelete = async (id_meta) => {
    if (!confirm("¿Eliminar meta?")) return;

    try {
      await eliminarMeta(id_meta);

      setMetas(metas.filter((m) => m.ID_META !== id_meta));
    } catch (err) {
      console.error("Error eliminando meta:", err);
      alert("Error eliminando");
    }
  };

  // =========================
  // Helpers
  // =========================
  const getPorcentaje = (m) =>
    Math.round((m.MONTO_AHORRADO / m.MONTO_TOTAL) * 100);

  const getDiasRestantes = (fecha) => {
    const hoy = new Date();
    const objetivo = new Date(fecha);
    return Math.ceil((objetivo - hoy) / (1000 * 60 * 60 * 24));
  };

  const totalObjetivo = metas.reduce((s, m) => s + m.MONTO_TOTAL, 0);
  const totalAcumulado = metas.reduce((s, m) => s + m.MONTO_AHORRADO, 0);

  // =========================
  // Render
  // =========================

  if (loading) return <div className="p-6">Cargando metas...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Metas de Ahorro</h1>
          <p className="text-gray-600">Administra tus objetivos financieros</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" /> Nueva Meta
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResumenCard label="Total metas" value={metas.length} icon={<Target />} />
        <ResumenCard
          label="Total ahorrado"
          value={`$${totalAcumulado.toLocaleString("es-MX")}`}
          icon={<TrendingUp />}
        />
        <ResumenCard
          label="% General"
          value={`${Math.round((totalAcumulado / totalObjetivo) * 100)}%`}
          icon={<Target />}
        />
      </div>

      {/* Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metas.map((m) => {
          const porcentaje = getPorcentaje(m);
          const faltante = m.MONTO_TOTAL - m.MONTO_AHORRADO;
          const dias = getDiasRestantes(m.FECHA_OBJETIVO);

          return (
            <div
              key={m.ID_META}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              {/* Título */}
              <div className="flex justify-between">
                <div>
                  <h3 className="text-gray-900">{m.NOMBRE}</h3>
                  <p className="text-sm text-gray-600">{m.DESCRIPCION}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    className="p-2 text-blue-600"
                    onClick={() => handleOpenModal(m)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    className="p-2 text-red-600"
                    onClick={() => handleDelete(m.ID_META)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fecha */}
              <div className="flex items-center gap-2 mt-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {m.FECHA_OBJETIVO.split(" ")[0]}
                </span>
                <span className="ml-auto text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {dias} días
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 h-3 rounded-full">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm mt-1">
                  <span>${m.MONTO_AHORRADO.toLocaleString("es-MX")}</span>
                  <span>${m.MONTO_TOTAL.toLocaleString("es-MX")}</span>
                </div>
              </div>

              {/* Abono */}
              {faltante > 0 ? (
                <div className="mt-4 flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Faltante</p>
                    <p className="text-gray-900">
                      ${faltante.toLocaleString("es-MX")}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenAbonoModal(m)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Abonar
                  </button>
                </div>
              ) : (
                <p className="text-green-600 mt-4">Meta completada 🎉</p>
              )}
            </div>
          );
        })}
      </div>

      {/* MODALES (crear, editar, abono) */}
      {showModal &&
        FormModal({
          formData,
          setFormData,
          handleSubmit,
          close: handleCloseModal,
          editingMeta,
        })}

      {showAbonoModal &&
        AbonoModal({
          meta: metaParaAbono,
          montoAbono,
          setMontoAbono,
          handleAbonar,
          close: handleCloseAbonoModal,
        })}
    </div>
  );
}

/* ============================
   COMPONENTES AUXILIARES
================================ */

function ResumenCard({ icon, label, value }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex items-center gap-3 mb-1">
        {icon}
        <span className="text-gray-700">{label}</span>
      </div>
      <p className="text-gray-900">{value}</p>
    </div>
  );
}

function FormModal({ formData, setFormData, handleSubmit, close, editingMeta }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
        <h2 className="text-gray-900 mb-4">
          {editingMeta ? "Editar Meta" : "Nueva Meta"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block mb-1 text-gray-600">Nombre</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          {/* Monto total */}
          <div>
            <label className="block mb-1 text-gray-600">Monto total</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2"
              value={formData.monto_total}
              onChange={(e) =>
                setFormData({ ...formData, monto_total: e.target.value })
              }
              required
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block mb-1 text-gray-600">Fecha objetivo</label>
            <input
              type="date"
              className="w-full border rounded-lg p-2"
              value={formData.fecha_objetivo}
              onChange={(e) =>
                setFormData({ ...formData, fecha_objetivo: e.target.value })
              }
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block mb-1 text-gray-600">Descripción</label>
            <textarea
              className="w-full border rounded-lg p-2"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              rows="3"
              required
            />
          </div>

          {/* Prioridad */}
          <div>
            <label className="block mb-1 text-gray-600">Prioridad</label>
            <select
              className="w-full border rounded-lg p-2"
              value={formData.prioridad}
              onChange={(e) =>
                setFormData({ ...formData, prioridad: e.target.value })
              }
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              className="flex-1 border p-2 rounded-lg"
              onClick={close}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white p-2 rounded-lg"
            >
              {editingMeta ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AbonoModal({
  meta,
  montoAbono,
  setMontoAbono,
  handleAbonar,
  close,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
        <h2 className="text-gray-900 mb-4">Abonar a {meta.NOMBRE}</h2>

        <form onSubmit={handleAbonar} className="space-y-4">
          {/* Resumen */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">Acumulado:</span>
              <span className="text-gray-900">
                ${meta.MONTO_AHORRADO.toLocaleString("es-MX")}
              </span>
            </div>

            <div className="flex justify-between mt-1">
              <span className="text-gray-600">Faltante:</span>
              <span className="text-blue-700">
                ${(meta.MONTO_TOTAL - meta.MONTO_AHORRADO).toLocaleString("es-MX")}
              </span>
            </div>
          </div>

          {/* Monto */}
          <div>
            <label className="block mb-1 text-gray-600">Monto a abonar</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2"
              value={montoAbono}
              onChange={(e) => setMontoAbono(e.target.value)}
              required
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-4">
            <button type="button" className="flex-1 border p-2 rounded-lg" onClick={close}>
              Cancelar
            </button>

            <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded-lg">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
