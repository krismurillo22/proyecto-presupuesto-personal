// src/services/reportes.js
import { API } from "./api";

export function obtenerBalanceMensual({ id_usuario, id_presupuesto, anio, mes }) {
  return API.get(`/reportes/balance-mensual`, {
    params: { id_usuario, id_presupuesto, anio, mes }
  });
}

export function obtenerGastosPorCategoria({ id_usuario, id_presupuesto, anio, mes }) {
  return API.get(`/reportes/gastos-por-categoria`, {
    params: { id_usuario, id_presupuesto, anio, mes }
  });
}
