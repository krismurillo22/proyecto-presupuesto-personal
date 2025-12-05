import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

export default function CrearPresupuesto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const subcategoriasDisponibles = [
    { id: 1, nombre: "Supermercado", categoriaNombre: "Alimentación" },
    { id: 2, nombre: "Restaurantes", categoriaNombre: "Alimentación" },
    { id: 3, nombre: "Renta", categoriaNombre: "Vivienda" },
    { id: 4, nombre: "Servicios", categoriaNombre: "Vivienda" },
    { id: 5, nombre: "Gasolina", categoriaNombre: "Transporte" },
    { id: 6, nombre: "Uber", categoriaNombre: "Transporte" },
    { id: 7, nombre: "Netflix", categoriaNombre: "Entretenimiento" },
    { id: 8, nombre: "Cine", categoriaNombre: "Entretenimiento" }
  ];

  const [formData, setFormData] = useState({
    nombre: isEditing ? "Presupuesto Mensual Nov 2025" : "",
    anoInicio: 2025,
    mesInicio: 11,
    anoFin: 2025,
    mesFin: 11
  });

  const [subcategorias, setSubcategorias] = useState(
    subcategoriasDisponibles.map((sub) => ({
      ...sub,
      montoAsignado: 0
    }))
  );

  const handleMontoChange = (id, monto) => {
    const montoNumero = parseFloat(monto) || 0;
    setSubcategorias(
      subcategorias.map((sub) =>
        sub.id === id ? { ...sub, montoAsignado: montoNumero } : sub
      )
    );
  };

  const montoTotal = subcategorias.reduce(
    (sum, sub) => sum + sub.montoAsignado,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Presupuesto guardado:", {
      ...formData,
      subcategorias: subcategorias.filter((s) => s.montoAsignado > 0),
      montoTotal
    });

    navigate("/presupuestos");
  };

  const meses = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" }
  ];

  const anos = [2024, 2025, 2026, 2027];

  const subcategoriasPorCategoria = subcategorias.reduce((acc, sub) => {
    if (!acc[sub.categoriaNombre]) acc[sub.categoriaNombre] = [];
    acc[sub.categoriaNombre].push(sub);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/presupuestos")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>

        <div>
          <h1 className="text-gray-900 mb-2">
            {isEditing ? "Editar Presupuesto" : "Crear Nuevo Presupuesto"}
          </h1>
          <p className="text-gray-600">
            Define el presupuesto y asigna montos a cada subcategoría
          </p>
        </div>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos generales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-gray-900 mb-4">Información General</h2>

          <div className="grid grid-cols-1 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-gray-700 mb-2">
                Nombre del Presupuesto
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Presupuesto Mensual Noviembre 2025"
                required
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Inicio */}
              <div>
                <label className="block text-gray-700 mb-2">Fecha de Inicio</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={formData.mesInicio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mesInicio: Number(e.target.value)
                      })
                    }
                    className="px-4 py-2 border rounded-lg"
                  >
                    {meses.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={formData.anoInicio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        anoInicio: Number(e.target.value)
                      })
                    }
                    className="px-4 py-2 border rounded-lg"
                  >
                    {anos.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fin */}
              <div>
                <label className="block text-gray-700 mb-2">Fecha de Fin</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={formData.mesFin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mesFin: Number(e.target.value)
                      })
                    }
                    className="px-4 py-2 border rounded-lg"
                  >
                    {meses.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={formData.anoFin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        anoFin: Number(e.target.value)
                      })
                    }
                    className="px-4 py-2 border rounded-lg"
                  >
                    {anos.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategorías (Asignación) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Asignación de Montos</h2>

            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-gray-600 text-sm">Total Presupuestado</p>
              <p className="text-blue-600">
                ${montoTotal.toLocaleString("es-MX")}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(subcategoriasPorCategoria).map(
              ([categoria, lista]) => (
                <div key={categoria}>
                  <h3 className="text-gray-900 mb-3 pb-2 border-b">
                    {categoria}
                  </h3>

                  {lista.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center gap-4 py-1"
                    >
                      <div className="flex-1">
                        <span className="text-gray-700">{sub.nombre}</span>
                      </div>

                      <div className="w-48">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            value={sub.montoAsignado || ""}
                            onChange={(e) =>
                              handleMontoChange(sub.id, e.target.value)
                            }
                            className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/presupuestos")}
            className="flex-1 px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <Save className="w-5 h-5" />
            {isEditing ? "Guardar Cambios" : "Crear Presupuesto"}
          </button>
        </div>
      </form>
    </div>
  );
}
