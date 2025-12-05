import { useState } from "react";
import { Plus, Edit2, Trash2, Layers, FolderOpen } from "lucide-react";

export default function Subcategorias() {
  const categorias = [
    { id: 1, nombre: "Salario" },
    { id: 2, nombre: "Alimentación" },
    { id: 3, nombre: "Vivienda" },
    { id: 4, nombre: "Transporte" },
    { id: 5, nombre: "Ahorro" },
    { id: 6, nombre: "Entretenimiento" }
  ];

  const [subcategorias, setSubcategorias] = useState([
    { id: 1, nombre: "Supermercado", categoriaId: 2, categoriaNombre: "Alimentación", descripcion: "Compras de despensa" },
    { id: 2, nombre: "Restaurantes", categoriaId: 2, categoriaNombre: "Alimentación", descripcion: "Comidas fuera de casa" },
    { id: 3, nombre: "Renta", categoriaId: 3, categoriaNombre: "Vivienda", descripcion: "Pago de renta mensual" },
    { id: 4, nombre: "Servicios", categoriaId: 3, categoriaNombre: "Vivienda", descripcion: "Luz, agua, internet" },
    { id: 5, nombre: "Gasolina", categoriaId: 4, categoriaNombre: "Transporte", descripcion: "Combustible para auto" },
    { id: 6, nombre: "Uber", categoriaId: 4, categoriaNombre: "Transporte", descripcion: "Viajes en Uber/Taxi" },
    { id: 7, nombre: "Netflix", categoriaId: 6, categoriaNombre: "Entretenimiento", descripcion: "Suscripción streaming" },
    { id: 8, nombre: "Cine", categoriaId: 6, categoriaNombre: "Entretenimiento", descripcion: "Boletos de cine" }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingSubcategoria, setEditingSubcategoria] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    categoriaId: 2,
    descripcion: ""
  });

  const [filtroCategoria, setFiltroCategoria] = useState(null);

  const handleOpenModal = (subcategoria) => {
    if (subcategoria) {
      setEditingSubcategoria(subcategoria);
      setFormData({
        nombre: subcategoria.nombre,
        categoriaId: subcategoria.categoriaId,
        descripcion: subcategoria.descripcion
      });
    } else {
      setEditingSubcategoria(null);
      setFormData({ nombre: "", categoriaId: 2, descripcion: "" });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSubcategoria(null);
    setFormData({ nombre: "", categoriaId: 2, descripcion: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const categoria = categorias.find((c) => c.id === formData.categoriaId);

    if (editingSubcategoria) {
      // Editar
      setSubcategorias(
        subcategorias.map((sub) =>
          sub.id === editingSubcategoria.id
            ? {
                ...sub,
                ...formData,
                categoriaNombre: categoria ? categoria.nombre : ""
              }
            : sub
        )
      );
    } else {
      // Crear
      const nueva = {
        id: Math.max(...subcategorias.map((s) => s.id), 0) + 1,
        ...formData,
        categoriaNombre: categoria ? categoria.nombre : ""
      };

      setSubcategorias([...subcategorias, nueva]);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar esta subcategoría?")) {
      setSubcategorias(subcategorias.filter((sub) => sub.id !== id));
    }
  };

  const subcategoriasFiltradas = filtroCategoria
    ? subcategorias.filter((sub) => sub.categoriaId === filtroCategoria)
    : subcategorias;

  const contadorPorCategoria = categorias.map((cat) => ({
    ...cat,
    count: subcategorias.filter((sub) => sub.categoriaId === cat.id).length
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Gestión de Subcategorías</h1>
          <p className="text-gray-600">
            Administra las subcategorías asociadas a cada categoría
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Agregar Subcategoría
        </button>
      </div>

      {/* Filtro por categoría */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-gray-900 mb-4">Filtrar por Categoría</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Todas */}
          <button
            onClick={() => setFiltroCategoria(null)}
            className={`p-4 rounded-lg border-2 transition-all ${
              filtroCategoria === null
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <FolderOpen className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-700 text-sm text-center">Todas</p>
            <p className="text-gray-900 text-center">{subcategorias.length}</p>
          </button>

          {/* Por categoría */}
          {contadorPorCategoria.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFiltroCategoria(cat.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                filtroCategoria === cat.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Layers className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-gray-700 text-sm text-center">{cat.nombre}</p>
              <p className="text-gray-900 text-center">{cat.count}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de subcategorías */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-gray-900">
            {filtroCategoria
              ? `Subcategorías de ${
                  categorias.find((c) => c.id === filtroCategoria)?.nombre
                }`
              : "Todas las Subcategorías"}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Categoría Principal
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Descripción
                </th>
                <th className="px-6 py-3 text-center text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {subcategoriasFiltradas.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-900">{sub.nombre}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {sub.categoriaNombre}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {sub.descripcion}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(sub)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(sub.id)}
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

          {subcategoriasFiltradas.length === 0 && (
            <div className="text-center py-12">
              <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay subcategorías para mostrar</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-gray-900">
                {editingSubcategoria ? "Editar Subcategoría" : "Nueva Subcategoría"}
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
                  placeholder="Ej: Supermercado"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Categoría Principal
                </label>
                <select
                  value={formData.categoriaId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoriaId: Number(e.target.value)
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
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
                  placeholder="Describe esta subcategoría..."
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
                  {editingSubcategoria ? "Guardar Cambios" : "Crear Subcategoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
