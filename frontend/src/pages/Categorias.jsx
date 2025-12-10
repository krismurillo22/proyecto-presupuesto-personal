import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  FolderOpen,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../services/categorias";

export default function Categorias({ user }) {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "gasto",
    descripcion: "",
  });

  // 🔥 1) CARGAR CATEGORÍAS desde DB2
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = () => {
    obtenerCategorias()
      .then((res) => setCategorias(res.data.categorias))
      .catch((err) => console.error("Error cargando categorías:", err));
  };

  // 🔥 Abrir modal
  const handleOpenModal = (categoria) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({
        nombre: categoria.NOMBRE,
        tipo: categoria.TIPO,
        descripcion: categoria.DESCRIPCION || "",
      });
    } else {
      setEditingCategoria(null);
      setFormData({ nombre: "", tipo: "gasto", descripcion: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategoria(null);
    setFormData({ nombre: "", tipo: "gasto", descripcion: "" });
  };

  // 🔥 CREAR / EDITAR categoría
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      tipo: formData.tipo,
      creado_por: user.email
    };

    // EDITAR
    if (editingCategoria) {
      actualizarCategoria(editingCategoria.ID_CATEGORIA, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        modificado_por: user.email
      })
        .then(() => {
          cargarCategorias();
          handleCloseModal();
        })
        .catch((err) => console.error("Error editando:", err));
      return;
    }

    // CREAR
    crearCategoria(payload)
      .then(() => {
        cargarCategorias();
        handleCloseModal();
      })
      .catch((err) => console.error("Error creando:", err));
  };

  // 🔥 ELIMINAR
  const handleDelete = (id) => {
    if (!confirm("¿Seguro deseas eliminar esta categoría?")) return;

    eliminarCategoria(id)
      .then(() => cargarCategorias())
      .catch((err) => console.error("Error eliminando:", err));
  };

  // Iconos según tipo
  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "ingreso":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "gasto":
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case "ahorro":
        return <PiggyBank className="w-5 h-5 text-blue-600" />;
      default:
        return <FolderOpen className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTipoBadge = (tipo) => {
    const styles = {
      ingreso: "bg-green-100 text-green-700",
      gasto: "bg-red-100 text-red-700",
      ahorro: "bg-blue-100 text-blue-700",
    };
    return styles[tipo] || "bg-gray-100 text-gray-700";
  };

  // Agrupar por tipo
  const categoriasPorTipo = {
    ingreso: categorias.filter((c) => c.TIPO === "ingreso"),
    gasto: categorias.filter((c) => c.TIPO === "gasto"),
    ahorro: categorias.filter((c) => c.TIPO === "ahorro"),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Gestión de Categorías</h1>
          <p className="text-gray-600">
            Administra las categorías de ingresos, gastos y ahorros
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Agregar Categoría
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <span className="text-gray-700">Ingresos</span>
          </div>
          <p className="text-gray-900">
            {categoriasPorTipo.ingreso.length} categorías
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <span className="text-gray-700">Gastos</span>
          </div>
          <p className="text-gray-900">
            {categoriasPorTipo.gasto.length} categorías
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <PiggyBank className="w-6 h-6 text-blue-600" />
            <span className="text-gray-700">Ahorros</span>
          </div>
          <p className="text-gray-900">
            {categoriasPorTipo.ahorro.length} categorías
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-gray-900">Todas las Categorías</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-gray-700">Tipo</th>
                <th className="px-6 py-3 text-left text-gray-700">Descripción</th>
                <th className="px-6 py-3 text-center text-gray-700">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {categorias.map((categoria) => (
                <tr key={categoria.ID_CATEGORIA} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getTipoIcon(categoria.TIPO)}
                      <span className="text-gray-900">{categoria.NOMBRE}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getTipoBadge(
                        categoria.TIPO
                      )}`}
                    >
                      {categoria.TIPO}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {categoria.DESCRIPCION}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(categoria)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(categoria.ID_CATEGORIA)
                        }
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
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-gray-900">
                {editingCategoria ? "Editar Categoría" : "Nueva Categoría"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="gasto">Gasto</option>
                  <option value="ahorro">Ahorro</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descripcion: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {editingCategoria ? "Guardar Cambios" : "Crear Categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
