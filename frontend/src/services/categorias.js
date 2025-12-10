import { API } from "./api";

// Obtener todas las categorías
export function obtenerCategorias() {
  return API.get("/categorias/get-categorias");
}

// Obtener una categoría por ID
export function obtenerCategoria(id) {
  return API.get(`/categorias/${id}`);
}

// Crear categoría
export function crearCategoria(data) {
  return API.post("/categorias/set-categorias", data);
}

// Actualizar categoría
export function actualizarCategoria(id, data) {
  return API.put(`/categorias/${id}`, data);
}

// Eliminar categoría
export function eliminarCategoria(id) {
  return API.delete(`/categorias/${id}`);
}
