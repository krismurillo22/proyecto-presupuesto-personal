import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Target, TrendingUp, Calendar } from "lucide-react";

import {
  obtenerMetasUsuario,
  crearMeta,
  actualizarMeta,
  eliminarMeta,
  abonarMeta
} from "../services/metas";

import { obtenerSubcategorias } from "../services/subcategorias";

export default function Metas({ user }) {
  const [metas, setMetas] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [subcategoriasCargadas, setSubcategoriasCargadas] = useState(false);
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
  // 1. Cargar subcategorías
  // =========================
  useEffect(() => {
    if (!user) return;

    obtenerSubcategorias()
      .then((res) => {
        setSubcategorias(
          res.data.subcategorias.map((s) => ({
            id: Number(s.ID_SUBCATEGORIA),
            nombre: s.NOMBRE,
          }))
        );
        setSubcategoriasCargadas(true);
      })
      .catch(console.error);
  }, [user]);

  // =========================
  // 2. Cargar metas
  // =========================
  useEffect(() => {
    if (!user || !subcategoriasCargadas) return;

    obtenerMetasUsuario(user.id_usuario)
      .then((res) => setMetas(res.data.metas))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, subcategoriasCargadas]);

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
  // Crear / Editar
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

      const res = await obtenerMetasUsuario(user.id_usuario);
      setMetas(res.data.metas);

      handleCloseModal();
    } catch (err) {
      console.error("Error guardando meta:", err);
      alert("Error guardando meta");
    }
  };

  // =========================
  // Abonar
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

  const handleAbonar = async (e) => {
    e.preventDefault();

    const monto = Number(montoAbono);
    const faltante = metaParaAbono.MONTO_TOTAL - (metaParaAbono.MONTO_AHORRADO || 0);

    if (monto <= 0) {
      alert("El monto debe ser mayor a 0");
      return;
    }

    if (monto > faltante) {
      alert("El abono no puede superar el monto faltante");
      return;
    }

    try {
      await abonarMeta(metaParaAbono.ID_META, {
        monto,
        modificado_por: user.email,
      });

      const res = await obtenerMetasUsuario(user.id_usuario);
      setMetas(res.data.metas);

      handleCloseAbonoModal();
    } catch (err) {
      alert(err.response?.data?.error || "Error al abonar");
    }
  };

  // =========================
  // Eliminar
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
  // Helpers seguros
  // =========================
  const getPorcentaje = (m) =>
    Math.round(((m.MONTO_AHORRADO || 0) / m.MONTO_TOTAL) * 100);

  const getDiasRestantes = (fecha) => {
    const hoy = new Date();
    const objetivo = new Date(fecha);
    return Math.ceil((objetivo - hoy) / (1000 * 60 * 60 * 24));
  };

  const totalObjetivo = metas.reduce((s, m) => s + m.MONTO_TOTAL, 0);
  const totalAcumulado = metas.reduce((s, m) => s + (m.MONTO_AHORRADO || 0), 0);

  // =========================
  // Render
  // =========================
  if (loading) return <div className="p-6">Cargando metas...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
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
          const faltante = m.MONTO_TOTAL - (m.MONTO_AHORRADO || 0);
          const dias = getDiasRestantes(m.FECHA_OBJETIVO);

          return (
            <div key={m.ID_META} className="bg-white rounded-xl border p-6">
              <div className="flex justify-between">
                <div>
                  <h3>{m.NOMBRE}</h3>
                  <p className="text-sm text-gray-600">{m.DESCRIPCION}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(m)} className="text-blue-600">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(m.ID_META)} className="text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Calendar size={16} />
                {m.FECHA_OBJETIVO.split(" ")[0]}
                <span className="ml-auto bg-blue-100 px-2 rounded">{dias} días</span>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 h-3 rounded">
                  <div
                    className="bg-blue-600 h-3 rounded"
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm mt-1">
                  <span>${(m.MONTO_AHORRADO || 0).toLocaleString("es-MX")}</span>
                  <span>${m.MONTO_TOTAL.toLocaleString("es-MX")}</span>
                </div>
              </div>

              {faltante > 0 ? (
                <button
                  onClick={() => handleOpenAbonoModal(m)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Abonar
                </button>
              ) : (
                <p className="mt-4 text-green-600">Meta completada 🎉</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Modales */}
      {showModal && (
        <FormModal
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          close={handleCloseModal}
          editingMeta={editingMeta}
          subcategorias={subcategorias}
        />
      )}

      {showAbonoModal && (
        <AbonoModal
          meta={metaParaAbono}
          montoAbono={montoAbono}
          setMontoAbono={setMontoAbono}
          handleAbonar={handleAbonar}
          close={handleCloseAbonoModal}
        />
      )}
    </div>
  );
}

/* ============================
   COMPONENTES AUXILIARES
================================ */

function ResumenCard({ icon, label, value }) {
  return (
    <div className="bg-white p-6 rounded border">
      <div className="flex items-center gap-2">{icon}{label}</div>
      <p>{value}</p>
    </div>
  );
}

function FormModal({
  formData,
  setFormData,
  handleSubmit,
  close,
  editingMeta,
  subcategorias
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {editingMeta ? "Editar Meta" : "Nueva Meta de Ahorro"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Subcategoría */}
          <div>
            <label className="block mb-1 text-gray-600">
              Subcategoría
            </label>
            <select
              className="w-full border rounded-lg p-2"
              value={formData.id_subcategoria}
              onChange={(e) =>
                setFormData({ ...formData, id_subcategoria: e.target.value })
              }
              required
            >
              <option value="">Seleccione una subcategoría</option>
              {subcategorias.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Nombre */}
          <div>
            <label className="block mb-1 text-gray-600">
              Nombre de la Meta
            </label>
            <input
              type="text"
              placeholder="Ej: Vacaciones 2025"
              className="w-full border rounded-lg p-2"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
            />
          </div>

          {/* Monto */}
          <div>
            <label className="block mb-1 text-gray-600">
              Monto Objetivo
            </label>
            <input
              type="number"
              placeholder="0.00"
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
            <label className="block mb-1 text-gray-600">
              Fecha Objetivo
            </label>
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
            <label className="block mb-1 text-gray-600">
              Descripción
            </label>
            <textarea
              className="w-full border rounded-lg p-2"
              rows="3"
              placeholder="Describe el propósito de esta meta..."
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
            />
          </div>

          {/* Prioridad */}
          <div>
            <label className="block mb-1 text-gray-600">
              Prioridad
            </label>
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

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 border rounded-lg"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {editingMeta ? "Guardar" : "Crear Meta"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

function AbonoModal({ meta, montoAbono, setMontoAbono, handleAbonar, close }) {
  const ahorrado = meta?.MONTO_AHORRADO || 0;
  const total = meta?.MONTO_TOTAL || 0;
  const faltante = total - ahorrado;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Abonar a {meta.NOMBRE}
        </h2>

        <form onSubmit={handleAbonar} className="space-y-4">
          {/* Resumen */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Acumulado:</span>
              <span className="text-gray-900">
                ${ahorrado.toLocaleString("es-MX")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Faltante:</span>
              <span className="text-blue-700">
                ${faltante.toLocaleString("es-MX")}
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
              placeholder="0.00"
              required
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 border rounded-lg"
              onClick={close}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
