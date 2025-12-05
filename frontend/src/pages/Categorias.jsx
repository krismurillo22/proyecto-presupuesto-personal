import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  FolderOpen,
  TrendingUp,
  TrendingDown,
  PiggyBank
} from "lucide-react";

export default function Categorias() {
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: "Salario", tipo: "ingreso", descripcion: "Ingresos por trabajo" },
    { id: 2, nombre: "Alimentación", tipo: "gasto", descripcion: "Compras de supermercado y restaurantes" },
    { id: 3, nombre: "Vivienda", tipo: "gasto", descripcion: "Renta, servicios y mantenimiento" },
    { id: 4, nombre: "Transporte", tipo: "gasto", descripcion: "Gasolina, transporte público, Uber" },
    { id: 5, nombre: "Ahorro", tipo: "ahorro", descripcion: "Ahorros mensuales" },
    { id: 6, nombre: "Entretenimiento", tipo: "gasto", descripcion: "Cine, streaming, salidas" }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "gasto",
    descripcion: ""
  });

  const handleOpenModal = (categoria) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({
        nombre: categoria.nombre,
        tipo: categoria.tipo,
        descripcion: categoria.descripcion
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCategoria) {
      // Editar categoría existente
      setCategorias(
        categorias.map((cat) =>
          cat.id === editingCategoria.id ? { ...cat, ...formData } : cat
        )
      );
    } else {
      // Crear nueva categoría
      const newCategoria = {
        id: Math.max(...categorias.map((c) => c.id), 0) + 1,
        ...formData
      };
      setCategorias([...categorias, newCategoria]);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      setCategorias(categorias.filter((cat) => cat.id !== id));
    }
  };

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
      ahorro: "bg-blue-100 text-blue-700"
    };
    return styles[tipo] || "bg-gray-100 text-gray-700";
  };

  const categoriasPorTipo = {
    ingreso: categorias.filter((c) => c.tipo === "ingreso"),
    gasto: categorias.filter((c) => c.tipo === "gasto"),
    ahorro: categorias.filter((c) => c.tipo === "ahorro")
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
                <tr key={categoria.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getTipoIcon(categoria.tipo)}
                      <span className="text-gray-900">{categoria.nombre}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getTipoBadge(
                        categoria.tipo
                      )}`}
                    >
                      {categoria.tipo.charAt(0).toUpperCase() +
                        categoria.tipo.slice(1)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {categoria.descripcion}
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
                        onClick={() => handleDelete(categoria.id)}
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

      {/* Modal */}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Alimentación"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="gasto">Gasto</option>
                  <option value="ahorro">Ahorro</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Describe esta categoría..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
