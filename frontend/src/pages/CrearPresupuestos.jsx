// src/pages/CrearPresupuesto.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, Save } from "lucide-react";

import { API } from "../services/api";
import { obtenerPresupuestoPorId } from "../services/presupuestos";
import { obtenerSubcategorias } from "../services/subcategorias";

export default function CrearPresupuesto({ user }) { 
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [subcategoriasCargadas, setSubcategoriasCargadas] = useState(false);

  // --------------------------
  // ESTADOS
  // --------------------------
  const [formData, setFormData] = useState({
    nombre: "",
    anio_inicio: new Date().getFullYear(),
    mes_inicio: new Date().getMonth() + 1,
    anio_fin: new Date().getFullYear(),
    mes_fin: new Date().getMonth() + 1,
  });

  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);

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
    { value: 12, label: "Diciembre" },
  ];

  const anos = [2024, 2025, 2026, 2027];

  // --------------------------
  // 1. CARGAR SUBCATEGORÍAS
  // --------------------------
  useEffect(() => {
    obtenerSubcategorias()
      .then((res) => {
        setSubcategorias(
          res.data.subcategorias.map((sub) => ({
            id: Number(sub.ID_SUBCATEGORIA),
            nombre: sub.NOMBRE,
            categoriaNombre: sub.CATEGORIA,
            montoAsignado: 0,
          }))
        );
        setSubcategoriasCargadas(true);   // 🔥 ya están listas
      })
      .catch(console.error);
  }, []);
  // --------------------------
  // 2. SI ES EDICIÓN → CARGA DATA
  // --------------------------
  useEffect(() => {
    if (!isEditing || !subcategoriasCargadas) return;

    async function cargarDatos() {
      try {
        const resPresupuesto = await obtenerPresupuestoPorId(id);
        const p = resPresupuesto.data.presupuesto;

        setFormData({
          nombre: p.NOMBRE,
          anio_inicio: p.ANIO_INICIO,
          mes_inicio: p.MES_INICIO,
          anio_fin: p.ANIO_FIN,
          mes_fin: p.MES_FIN,
        });

        // Ahora sí cargar detalle
        const resDetalle = await API.get(`/presupuestos/${id}/detalle`);
        const detalles = resDetalle.data.detalle;

        setSubcategorias((prev) =>
          prev.map((sub) => {
            const detalle = detalles.find((d) => d.ID_SUBCATEGORIA == sub.id);
            return {
              ...sub,
              montoAsignado: detalle ? detalle.MONTO_MENSUAL : 0,
            };
          })
        );

        setLoading(false);
      } catch (err) {
        console.error("Error cargando presupuesto:", err);
      }
    }

    cargarDatos();
  }, [id, isEditing, subcategoriasCargadas]);

  // 🔥 Cuando NO es edición → cerrar loading cuando ya cargaron subcategorías
  useEffect(() => {
    if (!isEditing && subcategoriasCargadas) {
      setLoading(false);
    }
  }, [isEditing, subcategoriasCargadas]);

  // --------------------------
  // CALCULAR TOTAL
  // --------------------------
  const montoTotal = subcategorias.reduce(
    (sum, sub) => sum + (parseFloat(sub.montoAsignado) || 0),
    0
  );

  const subcategoriasPorCategoria = subcategorias.reduce((acc, sub) => {
    const categoria = sub.categoriaNombre || "Sin categoría";

    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(sub);

    return acc;
  }, {});
  
  // --------------------------
  // CAMBIO DE MONTOS POR SUBCATEGORÍA
  // --------------------------
  const handleMontoChange = (id, monto) => {
    const value = monto === "" ? 0 : parseFloat(monto);

    setSubcategorias(subcategorias.map((sub) =>
      sub.id === id ? { ...sub, montoAsignado: value } : sub
    ));
  };
  
  // --------------------------
  // SUBMIT (CREAR o EDITAR)
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isEditing) {

        // CREAR PRESUPUESTO
        const res = await API.post("/presupuestos/set-presupuestos", {
          id_usuario: user.id_usuario,   // ✅ antes estaba HARDCODEADO en 1
          nombre: formData.nombre,
          anio_inicio: formData.anio_inicio,
          mes_inicio: formData.mes_inicio,
          anio_fin: formData.anio_fin,
          mes_fin: formData.mes_fin,
          creado_por: user.email,        // (opcional, mejor que admin)
        });

        const respUltimo = await API.get(`/presupuestos/usuario/1/activo`);
        const nuevoId = respUltimo.data.presupuesto_activo.ID_PRESUPUESTO;

        // INSERTAR DETALLES
        for (const sub of subcategorias) {
          if (sub.montoAsignado > 0) {
            await API.post("/presupuesto-detalle", {
              id_presupuesto: nuevoId,
              id_subcategoria: sub.id,
              monto_mensual: sub.montoAsignado === 0 ? "0" : sub.montoAsignado,
              observaciones: null,
              creado_por: user.email,
            });
          }
        }

      } else {

        // EDITAR
        await API.put(`/presupuestos/${id}`, {
          nombre: formData.nombre,
          anio_inicio: formData.anio_inicio,
          mes_inicio: formData.mes_inicio,
          anio_fin: formData.anio_fin,
          mes_fin: formData.mes_fin,
          modificado_por: user.email,
        });

        await API.delete(`/presupuesto-detalle/presupuesto/${id}`);

        for (const sub of subcategorias) {
          if (sub.montoAsignado > 0) {
            await API.post("/presupuesto-detalle", {
              id_presupuesto: id,
              id_subcategoria: sub.id,
              monto_mensual: sub.montoAsignado === 0 ? "0" : sub.montoAsignado,
              observaciones: null,
              creado_por: user.email,
            });
          }
        }
      }

      alert("Presupuesto guardado correctamente");
      navigate("/presupuestos");

    } catch (error) {
      console.error("Error guardando:", error);
      alert("Error al guardar");
    }
  };

  // --------------------------
  // LOADING SIMPLE
  // --------------------------
  if (loading) {
    return <div className="p-6">Cargando datos...</div>;
  }

  // --------------------------
  // RENDER
  // --------------------------
  return (
    <div className="space-y-6">
      {/* HEADER */}
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
        {/* INFO GENERAL */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-gray-900 mb-4">Información General</h2>

          <div className="grid gap-4">
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
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            {/* FECHAS */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* INICIO */}
              <div>
                <label className="block text-gray-700 mb-2">Fecha de Inicio</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={formData.mes_inicio}
                    onChange={(e) =>
                      setFormData({ ...formData, mes_inicio: Number(e.target.value) })
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
                    value={formData.anio_inicio}
                    onChange={(e) =>
                      setFormData({ ...formData, anio_inicio: Number(e.target.value) })
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

              {/* FIN */}
              <div>
                <label className="block text-gray-700 mb-2">Fecha de Fin</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={formData.mes_fin}
                    onChange={(e) =>
                      setFormData({ ...formData, mes_fin: Number(e.target.value) })
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
                    value={formData.anio_fin}
                    onChange={(e) =>
                      setFormData({ ...formData, anio_fin: Number(e.target.value) })
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

        {/* ASIGNACIÓN */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-gray-900">Asignación de Montos</h2>

            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-gray-600 text-sm">Total Presupuestado</p>
              <p className="text-blue-600">
                ${montoTotal.toLocaleString("es-MX")}
              </p>
            </div>
          </div>

          {Object.entries(subcategoriasPorCategoria).map(([categoria, lista]) => (
            <div key={categoria}>
              <h3 className="text-gray-900 mb-3 pb-2 border-b">{categoria}</h3>

              {lista.map((sub) => (
                <div key={sub.id} className="flex items-center gap-4 py-1">
                  <div className="flex-1">
                    <span className="text-gray-700">{sub.nombre}</span>
                  </div>

                  <div className="w-48 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                      <input
                        type="number"
                        value={sub.montoAsignado === 0 ? "" : sub.montoAsignado}
                        onChange={(e) => handleMontoChange(sub.id, e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* BOTONES */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/presupuestos")}
            className="flex-1 px-6 py-3 border rounded-lg"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            <Save className="w-5 h-5" />
            {isEditing ? "Guardar Cambios" : "Crear Presupuesto"}
          </button>
        </div>
      </form>
    </div>
  );
}
