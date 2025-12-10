import { API } from "./api";

// Obtener TODAS las transacciones
export function obtenerTransacciones() {
  return API.get("/transacciones/get");
}

// Obtener transacciones por usuario
export function obtenerTransaccionesPorUsuario(id_usuario) {
  return API.get(`/transacciones/usuario/${id_usuario}`);
}

// Obtener transacciones por presupuesto
export function obtenerTransaccionesPorPresupuesto(id_presupuesto) {
  return API.get(`/transacciones/presupuesto/${id_presupuesto}`);
}

// Obtener una transacción por ID
export function obtenerTransaccion(id_transaccion) {
  return API.get(`/transacciones/${id_transaccion}`);
}

// Crear transacción
export function crearTransaccion(data) {
  return API.post("/transacciones", data);
}

// Actualizar transacción
export function actualizarTransaccion(id_transaccion, data) {
  return API.put(`/transacciones/${id_transaccion}`, data);
}

// Eliminar transacción
export function eliminarTransaccion(id_transaccion) {
  return API.delete(`/transacciones/${id_transaccion}`);
}
