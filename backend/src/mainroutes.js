const express = require('express');
const router = express.Router();
const { getConnection } = require('./dbconfig');


router.get('/usuarios/get-usuarios', (req, res) => {
    getConnection((err, conn) => {
        if (err) {
            console.error('Error conectando a DB2:', err);
            return res.status(500).json({ ok: false, error: err.message });
        }

        const sql = "SELECT * FROM PRESUPUESTO.USUARIOS";

        conn.query(sql, (err, rows) => {
            conn.close(() => console.log('Conexión DB2 cerrada GET usuarios'));

            if (err) {
                console.error('Error ejecutando SELECT usuarios:', err);
                return res.status(500).json({ ok: false, error: err.message });
            }

            return res.json({
                ok: true,
                usuarios: rows
            });
        });
    });
});

router.get("/usuarios/buscar", (req, res) => {
  const { correo } = req.query;

  if (!correo)
    return res.status(400).json({ ok: false, message: "Correo requerido" });

  getConnection((err, conn) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });

    const sql = `
      SELECT *
      FROM PRESUPUESTO.USUARIOS
      WHERE CORREO = ?
    `;

    conn.query(sql, [correo], (err, data) => {
      conn.close();

      if (err) return res.status(500).json({ ok: false, error: err.message });

      return res.json({ ok: true, usuario: data[0] });
    });
  });
});


router.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "SELECT * FROM PRESUPUESTO.USUARIOS WHERE id_usuario = ? AND estado = 1";

        conn.query(sql, [id], (err, rows) => {
            conn.close();

            if (err) return res.status(500).json({ ok: false, error: err.message });
            if (rows.length === 0) return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });

            return res.json({ ok: true, usuario: rows[0] });
        });
    });
});

router.post('/usuarios/set-usuario', (req, res) => {
    const { nombres, apellidos, correo, salario_base, creado_por } = req.body;

    if (!nombres || !correo || !creado_por) {
        return res.status(400).json({
            ok: false,
            error: "Faltan datos obligatorios: nombres, correo, creado_por"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_insertar_usuario(?,?,?,?,?)";
        const params = [nombres, apellidos || null, correo, salario_base || 0, creado_por];

        conn.query(sql, params, (err) => {
            conn.close();

            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Usuario creado correctamente" });
        });
    });
});

router.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombres, apellidos, salario_base, modificado_por } = req.body;

    if (!modificado_por) {
        return res.status(400).json({ ok: false, error: "modificado_por es obligatorio" });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_actualizar_usuario(?,?,?,?,?)";
        const params = [id, nombres || null, apellidos || null, salario_base || 0, modificado_por];

        conn.query(sql, params, (err) => {
            conn.close();

            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Usuario actualizado correctamente" });
        });
    });
});

router.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_eliminar_usuario(?)";

        conn.query(sql, [id], (err) => {
            conn.close();

            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Usuario eliminado (inactivado) correctamente" });
        });
    });
});

router.get('/presupuestos/get-presupuestos', (req, res) => {
    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "SELECT * FROM PRESUPUESTO.PRESUPUESTOS WHERE estado = 'activo'";

        conn.query(sql, (err, rows) => {
            conn.close();

            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, presupuestos: rows });
        });
    });
});

router.get('/presupuestos/:id', (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ ok: false, error: "El ID debe ser numérico" });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "SELECT * FROM PRESUPUESTO.PRESUPUESTOS WHERE id_presupuesto = ?";

        conn.query(sql, [id], (err, rows) => {
            conn.close();

            if (err) return res.status(500).json({ ok: false, error: err.message });
            if (rows.length === 0) return res.status(404).json({ ok: false, mensaje: "Presupuesto no encontrado" });

            return res.json({ ok: true, presupuesto: rows[0] });
        });
    });
});

router.get('/presupuestos/usuario/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    if (!id_usuario) {
        return res.status(400).json({ ok: false, error: "id_usuario requerido" });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT *
            FROM PRESUPUESTO.PRESUPUESTOS
            WHERE id_usuario = ?
            ORDER BY anio_inicio DESC, mes_inicio DESC
        `;

        conn.query(sql, [id_usuario], (err, rows) => {
            conn.close();

            if (err) {
                return res.status(500).json({ ok: false, error: err.message });
            }

            return res.json({
                ok: true,
                presupuestos: rows
            });
        });
    });
});

router.get('/presupuestos/usuario/:id_usuario/activo', (req, res) => {
    const { id_usuario } = req.params;

    if (!id_usuario) {
        return res.status(400).json({ ok: false, error: "id_usuario requerido" });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT *
            FROM PRESUPUESTO.PRESUPUESTOS
            WHERE id_usuario = ?
            ORDER BY anio_inicio DESC, mes_inicio DESC
            FETCH FIRST 1 ROW ONLY
        `;

        conn.query(sql, [id_usuario], (err, rows) => {
            conn.close();

            if (err) return res.status(500).json({ ok: false, error: err.message });

            if (rows.length === 0) {
                return res.status(404).json({ ok: false, mensaje: "El usuario no tiene presupuestos" });
            }

            return res.json({
                ok: true,
                presupuesto_activo: rows[0]
            });
        });
    });
});

router.post('/presupuestos/set-presupuestos', (req, res) => {
    const { id_usuario, nombre, anio_inicio, mes_inicio, anio_fin, mes_fin, creado_por} = req.body;

    // Validación mínima
    if (!id_usuario || !nombre || !anio_inicio || !mes_inicio || !creado_por) {
        return res.status(400).json({
            ok: false,
            error: "Faltan datos obligatorios: id_usuario, nombre, anio_inicio, mes_inicio, creado_por"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_insertar_presupuesto(?,?,?,?,?,?,?)";
        const params = [ id_usuario, nombre, anio_inicio, mes_inicio, anio_fin || null, mes_fin || null, creado_por ];

        conn.query(sql, params, (err) => {
            conn.close();

            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Presupuesto creado correctamente" });
        });
    });
});

router.put('/presupuestos/:id', (req, res) => {
    const { id } = req.params;

    const { nombre, anio_inicio, mes_inicio, anio_fin, mes_fin, modificado_por } = req.body;

    if (!modificado_por) {
        return res.status(400).json({ ok: false, error: "modificado_por es obligatorio" });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_actualizar_presupuesto(?,?,?,?,?,?,?)";
        const params = [ id, nombre || null, anio_inicio || null, mes_inicio || null, anio_fin || null, mes_fin || null, modificado_por];

        conn.query(sql, params, (err) => {
            conn.close();

            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Presupuesto actualizado correctamente" });
        });
    });
});

router.delete('/presupuestos/:id', (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({
            ok: false,
            error: "El ID debe ser numérico"
        });
    }

    getConnection((err, conn) => {
        if (err) {
            return res.status(500).json({ ok: false, error: err.message });
        }

        // 1️⃣ Eliminar detalles primero
        const sqlEliminarDetalles = `
            DELETE FROM PRESUPUESTO.PRESUPUESTO_DETALLE
            WHERE id_presupuesto = ?
        `;

        // 2️⃣ Luego eliminar el presupuesto
        const sqlEliminarPresupuesto = `
            DELETE FROM PRESUPUESTO.PRESUPUESTOS
            WHERE id_presupuesto = ?
        `;

        conn.query(sqlEliminarDetalles, [id], (err) => {
            if (err) {
                conn.close();
                console.error("❌ Error eliminando detalles:", err);
                return res.status(500).json({
                    ok: false,
                    error: "Error eliminando detalles del presupuesto"
                });
            }

            conn.query(sqlEliminarPresupuesto, [id], (err2) => {
                conn.close();

                if (err2) {
                    console.error("❌ Error eliminando presupuesto:", err2);
                    return res.status(500).json({
                        ok: false,
                        error: "Error eliminando el presupuesto"
                    });
                }

                return res.json({
                    ok: true,
                    mensaje: "Presupuesto eliminado correctamente"
                });
            });
        });
    });
});


router.get('/categorias/get-categorias', (req, res) => {
    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "SELECT * FROM PRESUPUESTO.CATEGORIAS ORDER BY orden_presentacion ASC";

        conn.query(sql, (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, categorias: rows });
        });
    });
});

router.get('/categorias/:id', (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ ok: false, error: "El ID debe ser numérico" });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "SELECT * FROM PRESUPUESTO.CATEGORIAS WHERE id_categoria = ?";

        conn.query(sql, [id], (err, rows) => {
            conn.close();

            if (err) return res.status(500).json({ ok: false, error: err.message });
            if (rows.length === 0) return res.status(404).json({ ok: false, mensaje: "Categoría no encontrada" });

            return res.json({ ok: true, categoria: rows[0] });
        });
    });
});


router.post('/categorias/set-categorias', (req, res) => {
    const { nombre, descripcion, tipo, nombre_icono, color_hex, orden_presentacion, creado_por} = req.body;

    if (!nombre || !tipo || !creado_por) {
        return res.status(400).json({
            ok: false,
            error: "Faltan datos obligatorios: nombre, tipo, creado_por"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_insertar_categoria(?,?,?,?,?,?,?)";

        const params = [ nombre, descripcion || null, tipo, nombre_icono || null, color_hex || null, orden_presentacion || 0, creado_por];

        conn.query(sql, params, (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Categoría creada correctamente" });
        });
    });
});

router.put('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, modificado_por } = req.body;

    if (!modificado_por) {
        return res.status(400).json({ ok: false, error: "modificado_por es obligatorio" });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_actualizar_categoria(?,?,?,?)";

        const params = [ id, nombre || null, descripcion || null, modificado_por];

        conn.query(sql, params, (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Categoría actualizada correctamente" });
        });
    });
});

router.delete('/categorias/:id', (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ ok: false, error: "El ID debe ser numérico" });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_eliminar_categoria(?)";

        conn.query(sql, [id], (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Categoría eliminada correctamente" });
        });
    });
});

router.get('/subcategorias/get-subcategorias', (req, res) => {
    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT
            s.id_subcategoria,
            s.nombre,
            c.id_categoria,
            c.nombre AS nombre_categoria,
            c.tipo
            FROM PRESUPUESTO.SUBCATEGORIAS s
            INNER JOIN PRESUPUESTO.CATEGORIAS c
            ON s.id_categoria = c.id_categoria
            ORDER BY c.nombre, s.nombre;
        `;

        conn.query(sql, (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, subcategorias: rows });
        });
    });
});

router.get('/subcategorias/categorias/:id_categoria', (req, res) => {
    const { id_categoria } = req.params;

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT * FROM PRESUPUESTO.SUBCATEGORIAS WHERE id_categoria = ?
            ORDER BY id_subcategoria ASC
        `;

        conn.query(sql, [id_categoria], (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, subcategorias: rows });
        });
    });
});

router.get('/subcategorias/:id', (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ ok: false, error: "El ID debe ser numérico" });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT * FROM PRESUPUESTO.SUBCATEGORIAS
            WHERE id_subcategoria = ?
        `;

        conn.query(sql, [id], (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            if (rows.length === 0)
                return res.status(404).json({ ok: false, mensaje: "Subcategoría no encontrada" });

            return res.json({ ok: true, subcategoria: rows[0] });
        });
    });
});

//Arreglarlo, no se porque no acepta
router.post('/subcategorias', (req, res) => {
    const {id_categoria, nombre, descripcion, es_defecto, creado_por } = req.body;

    if (!id_categoria || !nombre || !creado_por) {
        return res.status(400).json({
            ok: false,
            error: "Faltan datos obligatorios: id_categoria, nombre, creado_por"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_insertar_subcategoria(?,?,?,?,?)";

        const params = [ id_categoria, nombre, descripcion || null, es_defecto || 0, creado_por];

        conn.query(sql, params, (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Subcategoría creada correctamente" });
        });
    });
});

router.put('/subcategorias/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, modificado_por } = req.body;

    if (!modificado_por) {
        return res.status(400).json({
            ok: false,
            error: "modificado_por es obligatorio"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_actualizar_subcategoria(?,?,?,?)";
        const params = [ id, nombre || null, descripcion || null, modificado_por];

        conn.query(sql, params, (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Subcategoría actualizada correctamente" });
        });
    });
});

//no sirve por el fk de presupuesto detalle
router.delete('/subcategorias/:id', (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({
            ok: false,
            error: "El ID debe ser numérico"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_eliminar_subcategoria(?)";

        conn.query(sql, [id], (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Subcategoría eliminada correctamente" });
        });
    });
});

router.get('/presupuesto-detalle/get', (req, res) => {
    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT *
            FROM PRESUPUESTO.PRESUPUESTO_DETALLE
            ORDER BY id_detalle ASC
        `;

        conn.query(sql, (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, detalles: rows });
        });
    });
});

router.get('/presupuestos/:id/detalle', (req, res) => {
    const { id } = req.params;

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT d.*, s.nombre AS nombre_subcategoria 
            FROM PRESUPUESTO.PRESUPUESTO_DETALLE d
            LEFT JOIN PRESUPUESTO.SUBCATEGORIAS s ON d.id_subcategoria = s.id_subcategoria
            WHERE d.id_presupuesto = ?
        `;

        conn.query(sql, [id], (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, detalle: rows });
        });
    });
});

router.post('/presupuesto-detalle', (req, res) => {
    const { id_presupuesto,id_subcategoria, monto_mensual, observaciones,creado_por } = req.body;

    if (!id_presupuesto || !id_subcategoria || !monto_mensual || !creado_por) {
        return res.status(400).json({
            ok: false,
            error: "Faltan datos obligatorios: id_presupuesto, id_subcategoria, monto_mensual, creado_por"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_insertar_presupuesto_detalle(?,?,?,?,?)";

        const params = [ id_presupuesto,  id_subcategoria,  monto_mensual,  observaciones || null,  creado_por];

        conn.query(sql, params, (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Detalle agregado correctamente" });
        });
    });
});

router.put('/presupuesto-detalle/:id', (req, res) => {
    const { id } = req.params;
    const { monto_mensual, observaciones, modificado_por } = req.body;

    if (!modificado_por) {
        return res.status(400).json({
            ok: false,
            error: "modificado_por es obligatorio"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_actualizar_presupuesto_detalle(?,?,?,?)";

        const params = [ id, monto_mensual || 0, observaciones || null, modificado_por];

        conn.query(sql, params, (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Detalle actualizado correctamente" });
        });
    });
});

router.delete('/presupuesto-detalle/presupuesto/:id_presupuesto', (req, res) => {
    const { id_presupuesto } = req.params;

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            DELETE FROM PRESUPUESTO.PRESUPUESTO_DETALLE
            WHERE id_presupuesto = ?
        `;

        conn.query(sql, [id_presupuesto], (err) => {
            conn.close();

            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err.message
                });
            }

            return res.json({ ok: true, mensaje: "Detalles eliminados correctamente" });
        });
    });
});

router.delete('/presupuesto-detalle/:id', (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ ok: false, error: "El ID debe ser numérico" });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_eliminar_presupuesto_detalle(?)";

        conn.query(sql, [id], (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Detalle eliminado correctamente" });
        });
    });
});

router.get('/obligaciones/get', (req, res) => {
    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT o.*, s.nombre AS nombre_subcategoria
            FROM PRESUPUESTO.OBLIGACION_FIJA o
            LEFT JOIN PRESUPUESTO.SUBCATEGORIAS s ON o.id_subcategoria = s.id_subcategoria
            ORDER BY o.id_obligacion ASC
        `;

        conn.query(sql, (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });
            
            return res.json({ ok: true, obligaciones: rows });
        });
    });
});

router.get('/obligaciones/usuario/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT o.*, s.nombre AS nombre_subcategoria
            FROM PRESUPUESTO.OBLIGACION_FIJA o
            LEFT JOIN PRESUPUESTO.SUBCATEGORIAS s ON o.id_subcategoria = s.id_subcategoria
            WHERE o.id_usuario = ?
            ORDER BY o.dia_vencimiento ASC
        `;

        conn.query(sql, [id_usuario], (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });
            
            return res.json({ ok: true, obligaciones: rows });
        });
    });
});

router.get('/obligaciones/:id_obligacion', (req, res) => {
    const { id_obligacion } = req.params;

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT *
            FROM PRESUPUESTO.OBLIGACION_FIJA
            WHERE id_obligacion = ?
        `;

        conn.query(sql, [id_obligacion], (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            if (rows.length === 0)
                return res.status(404).json({ ok: false, mensaje: "Obligación no encontrada" });

            return res.json({ ok: true, obligacion: rows[0] });
        });
    });
});

router.post('/obligaciones/set', (req, res) => {
    const { id_usuario, id_subcategoria, nombre, descripcion, monto_mensual, dia_vencimiento, fecha_inicio, fecha_fin, creado_por} = req.body;

    if (!id_usuario || !id_subcategoria || !nombre || !monto_mensual || !dia_vencimiento || !creado_por) {
        return res.status(400).json({
            ok: false,
            error: "Faltan datos obligatorios: id_usuario, id_subcategoria, nombre, monto_mensual, dia_vencimiento, creado_por"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_insertar_obligacion(?,?,?,?,?,?,?,?,?)";

        const params = [ id_usuario, id_subcategoria,nombre,descripcion || null,monto_mensual,dia_vencimiento, fecha_inicio || null,
            fecha_fin || null, creado_por];

        conn.query(sql, params, (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Obligación creada correctamente" });
        });
    });
});

router.put('/obligaciones/:id_obligacion', (req, res) => {
    const { id_obligacion } = req.params;
    const { nombre, descripcion, monto_mensual, dia_vencimiento,fecha_fin, vigente, modificado_por} = req.body;

    if (!modificado_por) {
        return res.status(400).json({
            ok: false,
            error: "modificado_por es obligatorio"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_actualizar_obligacion(?,?,?,?,?,?,?,?)";

        const params = [ id_obligacion,nombre || null,descripcion || null, monto_mensual || 0, dia_vencimiento || null,fecha_fin || null, vigente || 0,
            modificado_por];

        conn.query(sql, params, (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Obligación actualizada correctamente" });
        });
    });
});

router.delete('/obligaciones/:id_obligacion', (req, res) => {
    const { id_obligacion } = req.params;

    if (isNaN(id_obligacion)) {
        return res.status(400).json({
            ok: false,
            error: "El ID debe ser numérico"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = "CALL PRESUPUESTO.sp_eliminar_obligacion(?)";

        conn.query(sql, [id_obligacion], (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Obligación eliminada correctamente (vigente = 0)" });
        });
    });
});

router.get('/transacciones/get', (req, res) => {
    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT t.*, s.nombre AS nombre_subcategoria
            FROM PRESUPUESTO.TRANSACCIONES t
            LEFT JOIN PRESUPUESTO.SUBCATEGORIAS s ON t.id_subcategoria = s.id_subcategoria
            ORDER BY t.fecha_movimiento DESC
        `;

        conn.query(sql, (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, transacciones: rows });
        });
    });
});

router.get('/transacciones/usuario/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT t.*, s.nombre AS nombre_subcategoria
            FROM PRESUPUESTO.TRANSACCIONES t
            LEFT JOIN PRESUPUESTO.SUBCATEGORIAS s ON t.id_subcategoria = s.id_subcategoria
            WHERE t.id_usuario = ?
            ORDER BY t.fecha_movimiento DESC
        `;

        conn.query(sql, [id_usuario], (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, transacciones: rows });
        });
    });
});

router.get('/transacciones/presupuesto/:id_presupuesto', (req, res) => {
    const { id_presupuesto } = req.params;

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT t.*, s.nombre AS nombre_subcategoria
            FROM PRESUPUESTO.TRANSACCIONES t
            LEFT JOIN PRESUPUESTO.SUBCATEGORIAS s ON t.id_subcategoria = s.id_subcategoria
            WHERE t.id_presupuesto = ?
            ORDER BY t.fecha_movimiento DESC
        `;

        conn.query(sql, [id_presupuesto], (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, transacciones: rows });
        });
    });
});

router.get('/transacciones/:id_transaccion', (req, res) => {
    const { id_transaccion } = req.params;

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT *
            FROM PRESUPUESTO.TRANSACCIONES
            WHERE id_transaccion = ?
        `;

        conn.query(sql, [id_transaccion], (err, rows) => {
            conn.close();

            if (err) return res.status(500).json({ ok: false, error: err.message });

            if (rows.length === 0)
                return res.status(404).json({ ok: false, mensaje: "Transacción no encontrada" });

            return res.json({ ok: true, transaccion: rows[0] });
        });
    });
});

router.post('/transacciones', (req, res) => {
    const { id_usuario, id_presupuesto, id_subcategoria, id_obligacion, anio, mes, tipo, descripcion, monto, fecha_movimiento, metodo_pago,
        numero_factura, observaciones, creado_por} = req.body;

    if (!id_usuario || !id_subcategoria || !tipo || !monto || !creado_por) {
        return res.status(400).json({
            ok: false,
            error: "Faltan datos obligatorios: id_usuario, id_subcategoria, tipo, monto, creado_por"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `CALL PRESUPUESTO.sp_insertar_transaccion(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const params = [ id_usuario, id_presupuesto || null, id_subcategoria, id_obligacion || null, anio || null, mes || null, tipo,
            descripcion || null, monto, fecha_movimiento || new Date(), metodo_pago || null, numero_factura || null, observaciones || null,
            creado_por];

        conn.query(sql, params, (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Transacción creada correctamente" });
        });
    });
});

router.put('/transacciones/:id_transaccion', (req, res) => {
    const { id_transaccion } = req.params;

    const { anio, mes, descripcion, monto, fecha_movimiento, metodo_pago, numero_factura, observaciones, modificado_por} = req.body;

    if (!modificado_por) {
        return res.status(400).json({
            ok: false,
            error: "modificado_por es obligatorio"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `CALL PRESUPUESTO.sp_actualizar_transaccion(?,?,?,?,?,?,?,?,?,?)`;

        const params = [ id_transaccion, anio || null, mes || null, descripcion || null, monto || 0, fecha_movimiento || null,
            metodo_pago || null, numero_factura || null, observaciones || null, modificado_por];

        conn.query(sql, params, (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Transacción actualizada correctamente" });
        });
    });
});

router.delete('/transacciones/:id_transaccion', (req, res) => {
    const { id_transaccion } = req.params;

    if (isNaN(id_transaccion)) {
        return res.status(400).json({
            ok: false,
            error: "El ID debe ser numérico"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `CALL PRESUPUESTO.sp_eliminar_transaccion(?)`;

        conn.query(sql, [id_transaccion], (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Transacción eliminada correctamente" });
        });
    });
});

router.get('/metas', (req, res) => {
    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT m.*, s.nombre AS nombre_subcategoria
            FROM PRESUPUESTO.META_AHORRO m
            LEFT JOIN PRESUPUESTO.SUBCATEGORIAS s ON m.id_subcategoria = s.id_subcategoria
            ORDER BY m.fecha_objetivo ASC
        `;

        conn.query(sql, (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, metas: rows });
        });
    });
});

router.get('/metas/usuario/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT m.*, s.nombre AS nombre_subcategoria
            FROM PRESUPUESTO.META_AHORRO m
            LEFT JOIN PRESUPUESTO.SUBCATEGORIAS s ON m.id_subcategoria = s.id_subcategoria
            WHERE m.id_usuario = ?
            ORDER BY m.fecha_objetivo ASC
        `;

        conn.query(sql, [id_usuario], (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, metas: rows });
        });
    });
});

router.get('/metas/:id_meta', (req, res) => {
    const { id_meta } = req.params;

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT *
            FROM PRESUPUESTO.META_AHORRO
            WHERE id_meta = ?
        `;

        conn.query(sql, [id_meta], (err, rows) => {
            conn.close();

            if (err) return res.status(500).json({ ok: false, error: err.message });
            if (rows.length === 0)
                return res.status(404).json({ ok: false, mensaje: "Meta no encontrada" });

            return res.json({ ok: true, meta: rows[0] });
        });
    });
});

router.post('/metas', (req, res) => {
    const { id_usuario, id_subcategoria, nombre, descripcion, monto_total, fecha_inicio, fecha_objetivo, prioridad, creado_por} = req.body;

    if (!id_usuario || !id_subcategoria || !nombre || !monto_total || !fecha_inicio || !fecha_objetivo || !prioridad || !creado_por) {
        return res.status(400).json({
            ok: false,
            error: "Faltan datos obligatorios"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `CALL PRESUPUESTO.sp_insertar_meta(?,?,?,?,?,?,?,?,?)`;

        const params = [ id_usuario, id_subcategoria, nombre, descripcion || null,  monto_total, fecha_inicio, fecha_objetivo,
            prioridad, creado_por];

        conn.query(sql, params, (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Meta creada correctamente" });
        });
    });
});

router.put('/metas/:id_meta', (req, res) => {
    const { id_meta } = req.params;

    const { nombre, descripcion, monto_total, fecha_objetivo, prioridad, estado, modificado_por } = req.body;

    if (!modificado_por) {
        return res.status(400).json({
            ok: false,
            error: "modificado_por es obligatorio"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `CALL PRESUPUESTO.sp_actualizar_meta(?,?,?,?,?,?,?,?)`;

        const params = [ id_meta, nombre || null, descripcion || null, monto_total || 0, fecha_objetivo || null, prioridad || null,
            estado || 'en_progreso', modificado_por];

        conn.query(sql, params, (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Meta actualizada correctamente" });
        });
    });
});

router.delete('/metas/:id_meta', (req, res) => {
    const { id_meta } = req.params;

    if (isNaN(id_meta)) {
        return res.status(400).json({
            ok: false,
            error: "El ID debe ser numérico"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `CALL PRESUPUESTO.sp_eliminar_meta(?)`;

        conn.query(sql, [id_meta], (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, mensaje: "Meta eliminada correctamente" });
        });
    });
});

// ABONAR META
router.put('/metas/:id_meta/abonar', (req, res) => {
    const { id_meta } = req.params;
    const { monto, modificado_por } = req.body;

    if (!monto || monto <= 0 || !modificado_por) {
        return res.status(400).json({
            ok: false,
            error: "Monto y modificado_por son obligatorios"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `CALL PRESUPUESTO.sp_abonar_meta(?,?,?)`;

        conn.query(sql, [id_meta, monto, modificado_por], (err) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({
                ok: true,
                mensaje: "Abono registrado correctamente"
            });
        });
    });
});

//Procedimientos logicos
router.get('/reportes/gastos-por-categoria', (req, res) => {
    const { id_usuario, id_presupuesto, anio, mes } = req.query;

    if (!id_usuario || !id_presupuesto || !anio || !mes) {
        return res.status(400).json({
            ok: false,
            error: "id_usuario, id_presupuesto, anio y mes son obligatorios"
        });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `
            SELECT 
                c.id_categoria,
                c.nombre AS categoria,
                COALESCE(SUM(t.monto), 0) AS total_gastado
            FROM PRESUPUESTO.TRANSACCIONES t
            JOIN PRESUPUESTO.SUBCATEGORIAS s 
                ON t.id_subcategoria = s.id_subcategoria
            JOIN PRESUPUESTO.CATEGORIAS c 
                ON s.id_categoria = c.id_categoria
            WHERE 
                t.id_usuario = ?
                AND t.id_presupuesto = ?
                AND t.anio = ?
                AND t.mes = ?
                AND t.tipo = 'gasto'
            GROUP BY 
                c.id_categoria, c.nombre
            ORDER BY 
                total_gastado DESC
        `;

        const params = [
            Number(id_usuario),
            Number(id_presupuesto),
            Number(anio),
            Number(mes)
        ];

        conn.query(sql, params, (err, rows) => {
            conn.close();
            if (err) return res.status(500).json({ ok: false, error: err.message });

            return res.json({ ok: true, categorias: rows });
        });
    });
});

router.post('/transacciones/registrar', (req, res) => {
    const { id_usuario, id_presupuesto, id_subcategoria, id_obligacion, anio, mes, tipo,
        descripcion, monto, fecha_movimiento, metodo_pago, creado_por } = req.body;

    if (!id_usuario || !id_presupuesto || !id_subcategoria || !tipo || !monto || !creado_por) {
        return res.status(400).json({ ok: false, error: "Faltan datos obligatorios" });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        const sql = `CALL PRESUPUESTO.sp_registrar_transaccion_completa(?,?,?,?,?,?,?,?,?,?,?,?)`;

        const params = [
            { ParamType:"INPUT", DataType:"INTEGER", Data:id_usuario },
            { ParamType:"INPUT", DataType:"INTEGER", Data:id_presupuesto },
            { ParamType:"INPUT", DataType:"INTEGER", Data:id_subcategoria },
            { ParamType:"INPUT", DataType:"INTEGER", Data:id_obligacion ?? null },
            { ParamType:"INPUT", DataType:"INTEGER", Data:anio },
            { ParamType:"INPUT", DataType:"INTEGER", Data:mes },
            { ParamType:"INPUT", DataType:"VARCHAR", Data:tipo },
            { ParamType:"INPUT", DataType:"CLOB", Data:descripcion ?? null },
            { ParamType:"INPUT", DataType:"DECFLOAT", Data:monto },
            { ParamType:"INPUT", DataType:"TIMESTAMP", Data:fecha_movimiento ?? new Date() },
            { ParamType:"INPUT", DataType:"VARCHAR", Data:metodo_pago ?? null },
            { ParamType:"INPUT", DataType:"VARCHAR", Data:creado_por }
        ];

        conn.query(sql, params, (err) => {
            conn.close();

            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err.message
                });
            }

            return res.json({ ok: true, mensaje: "Transacción registrada correctamente" });
        });
    });
});

router.get('/reportes/balance-mensual', (req, res) => {
  const { id_usuario, id_presupuesto, anio, mes } = req.query;

  getConnection((err, conn) => {
    if (err) return res.status(500).json({ ok:false, error:err.message });

    const sql = `
      SELECT
        COALESCE(SUM(CASE WHEN tipo='ingreso' THEN monto END),0) AS ingresos,
        COALESCE(SUM(CASE WHEN tipo='gasto'   THEN monto END),0) AS gastos,
        COALESCE(SUM(CASE WHEN tipo='ahorro'  THEN monto END),0) AS ahorros
      FROM PRESUPUESTO.TRANSACCIONES
      WHERE id_usuario=? AND id_presupuesto=? AND anio=? AND mes=?
    `;

    const params = [
      Number(id_usuario),
      Number(id_presupuesto),
      Number(anio),
      Number(mes)
    ];

    conn.query(sql, params, (err, rows) => {
      conn.close();

      if (err) return res.status(500).json({ ok:false, error:err.message });

      const r = rows[0];
      return res.json({
        ok:true,
        ingresos : r.INGRESOS,
        gastos   : r.GASTOS,
        ahorros  : r.AHORROS,
        balance  : r.INGRESOS - r.GASTOS - r.AHORROS
      });
    });
  });
});


router.get('/reportes/monto-ejecutado', (req, res) => {
  const { id_subcategoria, id_presupuesto, anio, mes } = req.query;

  getConnection((err, conn) => {
    if (err) return res.status(500).json({ ok:false, error:err.message });

    const sql = `
      SELECT COALESCE(SUM(monto),0) AS monto
      FROM PRESUPUESTO.TRANSACCIONES
      WHERE id_subcategoria=? AND id_presupuesto=? AND anio=? AND mes=?
    `;

    const params = [
      Number(id_subcategoria),
      Number(id_presupuesto),
      Number(anio),
      Number(mes)
    ];

    conn.query(sql, params, (err, rows) => {
      conn.close();
      if (err) return res.status(500).json({ ok:false, error:err.message });

      return res.json({ ok:true, monto_ejecutado: rows[0].MONTO });
    });
  });
});

router.get('/porcentaje-ejecucion', (req, res) => {
  const { id_subcategoria, id_presupuesto, anio, mes } = req.query;

  getConnection((err, conn) => {
    if (err) return res.status(500).json({ ok:false, error:err.message });

    const sql = `
      WITH det AS (
        SELECT monto_mensual FROM PRESUPUESTO.PRESUPUESTO_DETALLE
        WHERE id_subcategoria=? AND id_presupuesto=?
      ),
      eje AS (
        SELECT COALESCE(SUM(monto),0) AS ejecutado
        FROM PRESUPUESTO.TRANSACCIONES
        WHERE id_subcategoria=? AND id_presupuesto=? AND anio=? AND mes=?
      )
      SELECT
        CASE
          WHEN det.monto_mensual IS NULL OR det.monto_mensual = 0 THEN 0
          ELSE (eje.ejecutado / det.monto_mensual) * 100
        END AS porcentaje
      FROM det, eje
    `;

    const params = [
      Number(id_subcategoria),
      Number(id_presupuesto),

      Number(id_subcategoria),
      Number(id_presupuesto),
      Number(anio),
      Number(mes)
    ];

    conn.query(sql, params, (err, rows) => {
      conn.close();
      if (err) return res.status(500).json({ ok:false, error:err.message });

      return res.json({
        ok:true,
        porcentaje: rows[0].PORCENTAJE
      });
    });
  });
});

router.post('/metas/recalcular', (req, res) => {
    const { id_usuario } = req.body;

    if (!id_usuario) {
        return res.status(400).json({ ok: false, error: "id_usuario requerido" });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        conn.query(
            "CALL PRESUPUESTO.sp_actualizar_todas_metas_ahorro(?)",
            [id_usuario],
            (err) => {
                conn.close();
                if (err) return res.status(500).json({ ok: false, error: err.message });

                return res.json({ ok: true, mensaje: "Metas recalculadas correctamente" });
            }
        );
    });
});

router.put('/presupuestos/cerrar/:id_presupuesto', (req, res) => {
    const { id_presupuesto } = req.params;
    const { modificado_por } = req.body;

    if (!modificado_por) {
        return res.status(400).json({ ok: false, error: "modificado_por es obligatorio" });
    }

    getConnection((err, conn) => {
        if (err) return res.status(500).json({ ok: false, error: err.message });

        conn.query(
            "CALL PRESUPUESTO.sp_cerrar_presupuesto(?,?)",
            [id_presupuesto, modificado_por],
            (err) => {
                conn.close();
                if (err) return res.status(500).json({ ok: false, error: err.message });

                return res.json({ ok: true, mensaje: "Presupuesto cerrado correctamente" });
            }
        );
    });
});

module.exports = router;


