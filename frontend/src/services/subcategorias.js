import { API } from "./api";

export function obtenerSubcategorias() {
  return API.get("/subcategorias/get-subcategorias");
}

export function obtenerSubcategoriasPorCategoria(id_categoria) {
  return API.get(`/subcategorias/categorias/${id_categoria}`);
}

export function crearSubcategoria(data) {
  return API.post("/subcategorias", data);
}

export function actualizarSubcategoria(id, data) {
  return API.put(`/subcategorias/${id}`, data);
}

export function eliminarSubcategoria(id) {
  return API.delete(`/subcategorias/${id}`);
}
