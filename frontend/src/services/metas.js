// src/services/metas.js
import { API } from "./api";

export function obtenerMetasUsuario(idUsuario) {
  return API.get(`/metas/usuario/${idUsuario}`);
}

export function crearMeta(data) {
  return API.post("/metas", data);
}

export function actualizarMeta(id, data) {
  return API.put(`/metas/${id}`, data);
}

export function eliminarMeta(id) {
  return API.delete(`/metas/${id}`);
}

export function abonarMeta(id_meta, monto) {
  return API.put(`/metas/${id_meta}`, {
    monto_total: null,
    monto_acumulado: monto,
    modificado_por: data.modificado_por,
  });
}
