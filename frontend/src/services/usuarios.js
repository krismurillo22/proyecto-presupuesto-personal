import { API } from "./api";

export function obtenerUsuarioPorCorreo(correo) {
  return API.get(`/usuarios/buscar?correo=${correo}`);
}

export function crearUsuario(data) {
  return API.post("/usuarios/set-usuario", data);
}
