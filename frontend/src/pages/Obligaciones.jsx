import { useState } from "react";
import { Plus, Edit2, Trash2, Calendar, CheckCircle, XCircle } from "lucide-react";

export default function Obligaciones() {
  const [obligaciones, setObligaciones] = useState([
    {
      id: 1,
      nombre: "Renta mensual",
      subcategoria: "Renta",
      categoria: "Vivienda",
      montoMensual: 7200,
      diaVencimiento: 1,
      vigente: true,
      proximoVencimiento: "2025-12-01",
    },
    {
      id: 2,
      nombre: "Netflix",
      subcategoria: "Netflix",
      categoria: "Entretenimiento",
      montoMensual: 199,
      diaVencimiento: 5,
      vigente: true,
      proximoVencimiento: "2025-12-05",
    },
    {
      id: 3,
      nombre: "Servicios básicos",
      subcategoria: "Servicios",
      categoria: "Vivienda",
      montoMensual: 850,
      diaVencimiento: 15,
      vigente: true,
      proximoVencimiento: "2025-11-15",
    },
    {
      id: 4,
      nombre: "Seguro de auto",
      subcategoria: "Gasolina",
      categoria: "Transporte",
      montoMensual: 1200,
      diaVencimiento: 10,
      vigente: true,
      proximoVencimiento: "2025-12-10",
    },
    {
      id: 5,
      nombre: "Gimnasio",
      subcategoria: "Cine",
      categoria: "Entretenimiento",
      montoMensual: 500,
      diaVencimiento: 20,
      vigente: false,
      proximoVencimiento: "2025-11-20",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingObligacion, setEditingObligacion] = useState(null);

  const subcategoriasDisponibles = [
    { nombre: "Renta", categoria: "Vivienda" },
    { nombre: "Servicios", categoria: "Vivienda" },
    { nombre: "Gasolina", categoria: "Transporte" },
    { nombre: "Netflix", categoria: "Entretenimiento" },
    { nombre: "Cine", categoria: "Entretenimiento" },
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    subcategoria: "Renta",
    montoMensual: 0,
    diaVencimiento: 1,
    vigente: true,
  });

  const handleOpenModal = (obligacion) => {
    if (obligacion) {
      setEditingObligacion(obligacion);
      setFormData({
        nombre: obligacion.nombre,
        subcategoria: obligacion.subcategoria,
        montoMensual: obligacion.montoMensual,
        diaVencimiento: obligacion.diaVencimiento,
        vigente: obligacion.vigente,
      });
    } else {
      setEditingObligacion(null);
      setFormData({
        nombre: "",
        subcategoria: "Renta",
        montoMensual: 0,
        diaVencimiento: 1,
        vigente: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingObligacion(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subcatInfo = subcategoriasDisponibles.find(
      (s) => s.nombre === formData.subcategoria
    );

    const hoy = new Date();
    const proximoMes =
      formData.diaVencimiento < hoy.getDate()
        ? new Date(hoy.getFullYear(), hoy.getMonth() + 1, formData.diaVencimiento)
        : new Date(hoy.getFullYear(), hoy.getMonth(), formData.diaVencimiento);

    if (editingObligacion) {
      setObligaciones(
        obligaciones.map((o) =>
          o.id === editingObligacion.id
            ? {
                ...o,
                ...formData,
                categoria: subcatInfo?.categoria || "",
                proximoVencimiento: proximoMes.toISOString().split("T")[0],
              }
            : o
        )
      );
    } else {
      const newObligacion = {
        id: Math.max(...obligaciones.map((o) => o.id), 0) + 1,
        ...formData,
        categoria: subcatInfo?.categoria || "",
        proximoVencimiento: proximoMes.toISOString().split("T")[0],
      };

      setObligaciones([...obligaciones, newObligacion]);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar esta obligación?")) {
      setObligaciones(obligaciones.filter((o) => o.id !== id));
    }
  };

  const toggleVigencia = (id) => {
    setObligaciones(
      obligaciones.map((o) =>
        o.id === id ? { ...o, vigente: !o.vigente } : o
      )
    );
  };

  const obligacionesVigentes = obligaciones.filter((o) => o.vigente);
  const totalMensual = obligacionesVigentes.reduce(
    (sum, o) => sum + o.montoMensual,
    0
  );

  const getDiasParaVencimiento = (fecha) => {
    const hoy = new Date();
    const vencimiento = new Date(fecha);
    return Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
  };

  const getColorVencimiento = (dias) => {
    if (dias < 0) return "text-red-600 bg-red-100";
    if (dias <= 7) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Obligaciones Fijas</h1>
          <p className="text-gray-600">
            Administra tus pagos recurrentes y obligaciones mensuales
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" /> Agregar Obligación
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResumenCard
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          label="Total Obligaciones"
          value={obligaciones.length}
        />
        <ResumenCard
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          label="Vigentes"
          value={obligacionesVigentes.length}
        />
        <ResumenCard
          icon={<Calendar className="w-6 h-6 text-red-600" />}
          label="Gasto Mensual"
          value={`$${totalMensual.toLocaleString("es-MX")}`}
          textColor="text-red-600"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-gray-900">Todas las Obligaciones</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Nombre",
                  "Subcategoría",
                  "Monto Mensual",
                  "Día Vencimiento",
                  "Próximo Pago",
                  "Estado",
                  "Acciones",
                ].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-gray-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {obligaciones.map((o) => {
                const diasRestantes = getDiasParaVencimiento(
                  o.proximoVencimiento
                );

                return (
                  <tr key={o.id} className="hover:bg-gray-50">
                    {/* Nombre */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-900">{o.nombre}</span>
                      </div>
                    </td>

                    {/* Subcategoria */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900">{o.subcategoria}</p>
                        <p className="text-gray-500 text-sm">{o.categoria}</p>
                      </div>
                    </td>

                    {/* Monto */}
                    <td className="px-6 py-4 text-right">
                      ${o.montoMensual.toLocaleString("es-MX")}
                    </td>

                    {/* Día */}
                    <td className="px-6 py-4 text-center">Día {o.diaVencimiento}</td>

                    {/* Vencimiento */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-gray-700">
                          {new Date(o.proximoVencimiento).toLocaleDateString(
                            "es-MX",
                            { day: "2-digit", month: "short" }
                          )}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getColorVencimiento(
                            diasRestantes
                          )}`}
                        >
                          {diasRestantes < 0
                            ? "Vencida"
                            : diasRestantes === 0
                            ? "Hoy"
                            : diasRestantes === 1
                            ? "1 día"
                            : `${diasRestantes} días`}
                        </span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleVigencia(o.id)}
                        className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 mx-auto ${
                          o.vigente
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {o.vigente ? (
                          <>
                            <CheckCircle className="w-4 h-4" /> Vigente
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" /> No vigente
                          </>
                        )}
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal(o)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(o.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
      </div>

      {/* Modal */}
      {showModal && (
        <ModalObligacion
          editingObligacion={editingObligacion}
          formData={formData}
          setFormData={setFormData}
          subcategorias={subcategoriasDisponibles}
          handleClose={handleCloseModal}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

/* ---------------------- COMPONENTES AUXILIARES ---------------------- */

function ResumenCard({ icon, label, value, textColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-2">{icon}<span className="text-gray-700">{label}</span></div>
      <p className={textColor || "text-gray-900"}>{value}</p>
    </div>
  );
}

function ModalObligacion({
  editingObligacion,
  formData,
  setFormData,
  subcategorias,
  handleClose,
  handleSubmit,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-gray-900">
            {editingObligacion ? "Editar Obligación" : "Nueva Obligación Fija"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 mb-2">
              Nombre de la Obligación
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Renta mensual"
              required
            />
          </div>

          {/* Subcategoria */}
          <div>
            <label className="block text-gray-700 mb-2">Subcategoría</label>
            <select
              value={formData.subcategoria}
              onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {subcategorias.map((sub) => (
                <option key={sub.nombre} value={sub.nombre}>
                  {sub.nombre} ({sub.categoria})
                </option>
              ))}
            </select>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-gray-700 mb-2">Monto Mensual</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={formData.montoMensual || ""}
                onChange={(e) =>
                  setFormData({ ...formData, montoMensual: Number(e.target.value) })
                }
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Día vencimiento */}
          <div>
            <label className="block text-gray-700 mb-2">Día de Vencimiento</label>
            <input
              type="number"
              value={formData.diaVencimiento}
              onChange={(e) =>
                setFormData({ ...formData, diaVencimiento: Number(e.target.value) })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="31"
              required
            />
          </div>

          {/* Vigente */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="vigente"
              checked={formData.vigente}
              onChange={(e) => setFormData({ ...formData, vigente: e.target.checked })}
              className="w-5 h-5"
            />
            <label htmlFor="vigente" className="text-gray-700">
              Obligación vigente (activa)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
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
              {editingObligacion ? "Guardar Cambios" : "Crear Obligación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
