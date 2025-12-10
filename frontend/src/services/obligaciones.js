// src/services/obligaciones.js
import { API } from "./api";

// Obtener TODAS las obligaciones (admin)
export function obtenerObligaciones() {
  return API.get("/obligaciones/get");
}

// Obtener obligaciones por usuario
export function obtenerObligacionesPorUsuario(id_usuario) {
  return API.get(`/obligaciones/usuario/${id_usuario}`);
}

// Obtener una obligación por ID
export function obtenerObligacionPorId(id_obligacion) {
  return API.get(`/obligaciones/${id_obligacion}`);
}

// Crear obligación fija
export function crearObligacion(data) {
  return API.post("/obligaciones/set", data);
}

// Actualizar obligación fija
export function actualizarObligacion(id_obligacion, data) {
  return API.put(`/obligaciones/${id_obligacion}`, data);
}

// Eliminar obligación fija
export function eliminarObligacion(id_obligacion) {
  return API.delete(`/obligaciones/${id_obligacion}`);
}
