import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Target,
  TrendingUp,
  Calendar
} from "lucide-react";

export default function Metas() {
  const [metas, setMetas] = useState([
    {
      id: 1,
      nombre: "Vacaciones 2025",
      montoObjetivo: 30000,
      montoAcumulado: 18000,
      fechaObjetivo: "2025-07-01",
      descripcion: "Viaje familiar a la playa"
    },
    {
      id: 2,
      nombre: "Fondo de Emergencia",
      montoObjetivo: 50000,
      montoAcumulado: 35000,
      fechaObjetivo: "2025-12-31",
      descripcion: "Ahorro equivalente a 3 meses de gastos"
    },
    {
      id: 3,
      nombre: "Laptop Nueva",
      montoObjetivo: 15000,
      montoAcumulado: 6000,
      fechaObjetivo: "2025-03-15",
      descripcion: "MacBook Air M2"
    },
    {
      id: 4,
      nombre: "Enganche Auto",
      montoObjetivo: 80000,
      montoAcumulado: 25000,
      fechaObjetivo: "2026-06-01",
      descripcion: "Enganche para auto nuevo"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showAbonoModal, setShowAbonoModal] = useState(false);

  const [editingMeta, setEditingMeta] = useState(null);
  const [metaParaAbono, setMetaParaAbono] = useState(null);
  const [montoAbono, setMontoAbono] = useState(0);

  const [formData, setFormData] = useState({
    nombre: "",
    montoObjetivo: 0,
    fechaObjetivo: "",
    descripcion: ""
  });

  const handleOpenModal = (meta) => {
    if (meta) {
      setEditingMeta(meta);
      setFormData({
        nombre: meta.nombre,
        montoObjetivo: meta.montoObjetivo,
        fechaObjetivo: meta.fechaObjetivo,
        descripcion: meta.descripcion
      });
    } else {
      setEditingMeta(null);
      setFormData({
        nombre: "",
        montoObjetivo: 0,
        fechaObjetivo: "",
        descripcion: ""
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMeta(null);
  };

  const handleOpenAbonoModal = (meta) => {
    setMetaParaAbono(meta);
    setMontoAbono(0);
    setShowAbonoModal(true);
  };

  const handleCloseAbonoModal = () => {
    setShowAbonoModal(false);
    setMetaParaAbono(null);
    setMontoAbono(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingMeta) {
      setMetas(
        metas.map((m) =>
          m.id === editingMeta.id ? { ...m, ...formData } : m
        )
      );
    } else {
      const newMeta = {
        id: Math.max(...metas.map((m) => m.id), 0) + 1,
        ...formData,
        montoAcumulado: 0
      };
      setMetas([...metas, newMeta]);
    }

    handleCloseModal();
  };

  const handleAbonar = (e) => {
    e.preventDefault();
    if (metaParaAbono && montoAbono > 0) {
      setMetas(
        metas.map((m) =>
          m.id === metaParaAbono.id
            ? {
                ...m,
                montoAcumulado: Math.min(
                  m.montoAcumulado + montoAbono,
                  m.montoObjetivo
                )
              }
            : m
        )
      );
      handleCloseAbonoModal();
    }
  };

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar esta meta?")) {
      setMetas(metas.filter((m) => m.id !== id));
    }
  };

  const getPorcentaje = (meta) =>
    Math.round((meta.montoAcumulado / meta.montoObjetivo) * 100);

  const getColorPorcentaje = (porcentaje) => {
    if (porcentaje >= 100) return "bg-green-500";
    if (porcentaje >= 75) return "bg-blue-500";
    if (porcentaje >= 50) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getDiasRestantes = (fecha) => {
    const hoy = new Date();
    const objetivo = new Date(fecha);
    const diferencia = Math.ceil(
      (objetivo - hoy) / (1000 * 60 * 60 * 24)
    );
    return diferencia;
  };

  const totalObjetivo = metas.reduce((sum, m) => sum + m.montoObjetivo, 0);
  const totalAcumulado = metas.reduce(
    (sum, m) => sum + m.montoAcumulado,
    0
  );

  const porcentajeGeneral = Math.round(
    (totalAcumulado / totalObjetivo) * 100
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Metas de Ahorro</h1>
          <p className="text-gray-600">
            Establece y da seguimiento a tus objetivos financieros
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Nueva Meta
        </button>
      </div>

      {/* RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total metas */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-blue-600" />
            <span className="text-gray-700">Total de Metas</span>
          </div>
          <p className="text-gray-900">{metas.length} objetivos</p>
        </div>

        {/* Total ahorrado */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <span className="text-gray-700">Total Ahorrado</span>
          </div>
          <p className="text-green-600">
            ${totalAcumulado.toLocaleString("es-MX")}
          </p>
        </div>

        {/* Progreso general */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-purple-600" />
            <span className="text-gray-700">Progreso General</span>
          </div>
          <p className="text-purple-600">{porcentajeGeneral}%</p>
        </div>
      </div>

      {/* LISTA DE METAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metas.map((meta) => {
          const porcentaje = getPorcentaje(meta);
          const faltante = meta.montoObjetivo - meta.montoAcumulado;
          const diasRestantes = getDiasRestantes(meta.fechaObjetivo);

          return (
            <div
              key={meta.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              {/* Encabezado meta */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    <h3 className="text-gray-900">{meta.nombre}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {meta.descripcion}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(meta)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(meta.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* FECHA */}
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {new Date(meta.fechaObjetivo).toLocaleDateString(
                      "es-MX",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      }
                    )}
                  </span>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    diasRestantes < 0
                      ? "bg-red-100 text-red-700"
                      : diasRestantes <= 30
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {diasRestantes < 0
                    ? "Vencida"
                    : `${diasRestantes} días`}
                </span>
              </div>

              {/* PROGRESO */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progreso</span>
                  <span className="text-gray-900">{porcentaje}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${getColorPorcentaje(
                      porcentaje
                    )}`}
                    style={{ width: `${Math.min(porcentaje, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">
                    ${meta.montoAcumulado.toLocaleString("es-MX")}
                  </span>
                  <span className="text-gray-500">
                    de ${meta.montoObjetivo.toLocaleString("es-MX")}
                  </span>
                </div>
              </div>

              {/* FALTANTE / BOTÓN ABONAR */}
              {faltante > 0 ? (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-gray-600 text-sm">Faltante</p>
                    <p className="text-gray-900">
                      ${faltante.toLocaleString("es-MX")}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenAbonoModal(meta)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Abonar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-green-700">
                    ¡Meta completada!
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Crear/Editar Meta */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-gray-900">
                {editingMeta ? "Editar Meta" : "Nueva Meta de Ahorro"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Nombre de la Meta
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre: e.target.value
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              {/* Monto Objetivo */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Monto Objetivo
                </label>
                <input
                  type="number"
                  value={formData.montoObjetivo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      montoObjetivo: Number(e.target.value)
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Fecha Objetivo
                </label>
                <input
                  type="date"
                  value={formData.fechaObjetivo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fechaObjetivo: e.target.value
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descripcion: e.target.value
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                  required
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
                  {editingMeta ? "Guardar" : "Crear Meta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Abonar */}
      {showAbonoModal && metaParaAbono && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-gray-900">
                Abonar a {metaParaAbono.nombre}
              </h2>
            </div>

            <form onSubmit={handleAbonar} className="p-6 space-y-4">
              {/* Resumen */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Acumulado:</span>
                  <span className="text-gray-900">
                    $
                    {metaParaAbono.montoAcumulado.toLocaleString(
                      "es-MX"
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Faltante:</span>
                  <span className="text-blue-600">
                    $
                    {(
                      metaParaAbono.montoObjetivo -
                      metaParaAbono.montoAcumulado
                    ).toLocaleString("es-MX")}
                  </span>
                </div>
              </div>

              {/* Monto */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Monto a Abonar
                </label>
                <input
                  type="number"
                  value={montoAbono}
                  onChange={(e) =>
                    setMontoAbono(Number(e.target.value))
                  }
                  max={
                    metaParaAbono.montoObjetivo -
                    metaParaAbono.montoAcumulado
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseAbonoModal}
                  className="flex-1 py-2 border rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Confirmar Abono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
