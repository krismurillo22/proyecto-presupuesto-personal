import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { obtenerUsuarioPorCorreo } from "../services/usuarios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1) Buscar usuario por correo
      const res = await obtenerUsuarioPorCorreo(email);

      if (!res.data.usuario) {
        setError("El usuario no existe. Contacta al administrador.");
        return;
      }

      // 2) Usuario encontrado → iniciar sesión
      onLogin({
        email,
        id_usuario: res.data.usuario.ID_USUARIO,
      });

    } catch (err) {
      console.error("Error en login:", err);
      setError("Error consultando el usuario. Intenta más tarde.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Wallet className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-blue-600 text-center">Sistema de Presupuesto Personal</h1>
          <p className="text-gray-600 text-center mt-2">
            Ingresa tu correo electrónico para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Correo Electrónico</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="tu@email.com"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center -mt-3">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Iniciar Sesión
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            Si no tienes usuario, solicita la creación en el sistema.
          </p>
        </form>
      </div>
    </div>
  );
}
