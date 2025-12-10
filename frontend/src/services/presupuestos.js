// src/services/presupuestos.js
import { API } from "./api";

export function obtenerPresupuestoActivo(idUsuario) {
  return API.get(`/presupuestos/usuario/${idUsuario}/activo`);
}

// Obtener todos los presupuestos activos
export function obtenerPresupuestos() {
  return API.get("/presupuestos/get-presupuestos");
}

// Obtener presupuesto por ID
export function obtenerPresupuestoPorId(id) {
  return API.get(`/presupuestos/${id}`);
}

// Obtener presupuesto activo de un usuario
export function obtenerPresupuestoActivoUser(id_usuario) {
  return API.get(`/presupuestos/usuario/${id_usuario}/activo`);
}

// Crear presupuesto
export function crearPresupuesto(data) {
  return API.post("/presupuestos/set-presupuestos", data);
}

// Actualizar presupuesto
export function actualizarPresupuesto(id, data) {
  return API.put(`/presupuestos/${id}`, data);
}

// Eliminar presupuesto
export function eliminarPresupuesto(id) {
  return API.delete(`/presupuestos/${id}`);
}

export function crearPresupuestoDetalle(data) {
  return API.post("/presupuesto-detalle", data);
}

// Obtener detalles de un presupuesto
export function obtenerPresupuestoDetalle(id_presupuesto) {
  return API.get(`/presupuestos/${id_presupuesto}/detalle`);
}

export function obtenerPresupuestosPorUsuario(id_usuario) {
  return API.get(`/presupuestos/usuario/${id_usuario}`);
}
