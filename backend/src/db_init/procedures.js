const procedureStatements = [
  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_insertar_usuario (
    IN p_nombres       VARCHAR(100),
    IN p_apellidos     VARCHAR(100),
    IN p_correo        VARCHAR(150),
    IN p_salario_base  DECIMAL(10,2),
    IN p_creado_por    VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    INSERT INTO PRESUPUESTO.USUARIOS
      (nombres, apellidos, correo, fecha_registro, salario_base, estado, creado_por, creado_en)
    VALUES
      (p_nombres, p_apellidos, p_correo, CURRENT_TIMESTAMP, p_salario_base, 1, p_creado_por, CURRENT_TIMESTAMP);
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_actualizar_usuario (
    IN p_id_usuario    INT,
    IN p_nombres       VARCHAR(100),
    IN p_apellidos     VARCHAR(100),
    IN p_salario_base  DECIMAL(10,2),
    IN p_modificado_por VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    UPDATE PRESUPUESTO.USUARIOS
    SET nombres       = p_nombres,
        apellidos     = p_apellidos,
        salario_base  = p_salario_base,
        modificado_por = p_modificado_por,
        modificado_en  = CURRENT_TIMESTAMP
    WHERE id_usuario = p_id_usuario;
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_eliminar_usuario (
    IN p_id_usuario INT
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    UPDATE PRESUPUESTO.USUARIOS
    SET estado       = 0,
        modificado_en = CURRENT_TIMESTAMP
    WHERE id_usuario = p_id_usuario;
  END
  `,

  // --- CRUD CATEGORIAS ---
  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_insertar_categoria (
    IN p_nombre        VARCHAR(100),
    IN p_descripcion   CLOB,
    IN p_tipo          VARCHAR(20),
    IN p_nombre_icono  CLOB,
    IN p_color_hex     VARCHAR(10),
    IN p_orden         INT,
    IN p_creado_por    VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    INSERT INTO PRESUPUESTO.CATEGORIAS
      (nombre, descripcion, tipo, nombre_icono, color_hex, orden_presentacion, creado_por, creado_en)
    VALUES
      (p_nombre, p_descripcion, p_tipo, p_nombre_icono, p_color_hex, p_orden, p_creado_por, CURRENT_TIMESTAMP);
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_actualizar_categoria (
    IN p_id_categoria   INT,
    IN p_nombre         VARCHAR(100),
    IN p_descripcion    CLOB,
    IN p_modificado_por VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    UPDATE PRESUPUESTO.CATEGORIAS
    SET nombre        = p_nombre,
        descripcion   = p_descripcion,
        modificado_por = p_modificado_por,
        modificado_en  = CURRENT_TIMESTAMP
    WHERE id_categoria = p_id_categoria;
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_eliminar_categoria (
    IN p_id_categoria INT
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    DELETE FROM PRESUPUESTO.CATEGORIAS
    WHERE id_categoria = p_id_categoria;
  END
  `,

  // --- CRUD SUBCATEGORIAS ---
  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_insertar_subcategoria (
    IN p_id_categoria INT,
    IN p_nombre       VARCHAR(100),
    IN p_descripcion  CLOB,
    IN p_es_defecto   SMALLINT,
    IN p_creado_por   VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    INSERT INTO PRESUPUESTO.SUBCATEGORIAS
      (id_categoria, nombre, descripcion, activa, es_defecto, creado_por, creado_en)
    VALUES
      (p_id_categoria, p_nombre, p_descripcion, 1, p_es_defecto, p_creado_por, CURRENT_TIMESTAMP);
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_actualizar_subcategoria (
    IN p_id_subcategoria INT,
    IN p_nombre          VARCHAR(100),
    IN p_descripcion     CLOB,
    IN p_modificado_por  VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    UPDATE PRESUPUESTO.SUBCATEGORIAS
    SET nombre         = p_nombre,
        descripcion    = p_descripcion,
        modificado_por = p_modificado_por,
        modificado_en  = CURRENT_TIMESTAMP
    WHERE id_subcategoria = p_id_subcategoria;
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_eliminar_subcategoria (
    IN p_id_subcategoria INT
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    DELETE FROM PRESUPUESTO.SUBCATEGORIAS
    WHERE id_subcategoria = p_id_subcategoria;
  END
  `,

  // --- CRUD PRESUPUESTOS ---
  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_insertar_presupuesto (
    IN p_id_usuario   INT,
    IN p_nombre       VARCHAR(100),
    IN p_anio_inicio  INT,
    IN p_mes_inicio   INT,
    IN p_anio_fin     INT,
    IN p_mes_fin      INT,
    IN p_creado_por   VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    INSERT INTO PRESUPUESTO.PRESUPUESTOS
      (id_usuario, nombre, anio_inicio, mes_inicio, anio_fin, mes_fin,
       estado, fecha_creacion, creado_por, creado_en)
    VALUES
      (p_id_usuario, p_nombre, p_anio_inicio, p_mes_inicio, p_anio_fin, p_mes_fin,
       'activo', CURRENT_TIMESTAMP, p_creado_por, CURRENT_TIMESTAMP);
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_actualizar_presupuesto (
    IN p_id_presupuesto INT,
    IN p_nombre         VARCHAR(100),
    IN p_anio_inicio    INT,
    IN p_mes_inicio     INT,
    IN p_anio_fin       INT,
    IN p_mes_fin        INT,
    IN p_modificado_por VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    UPDATE PRESUPUESTO.PRESUPUESTOS
    SET nombre        = p_nombre,
        anio_inicio   = p_anio_inicio,
        mes_inicio    = p_mes_inicio,
        anio_fin      = p_anio_fin,
        mes_fin       = p_mes_fin,
        modificado_por = p_modificado_por,
        modificado_en  = CURRENT_TIMESTAMP
    WHERE id_presupuesto = p_id_presupuesto;
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_eliminar_presupuesto (
    IN p_id_presupuesto INT
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    DELETE FROM PRESUPUESTO.PRESUPUESTOS
    WHERE id_presupuesto = p_id_presupuesto;
  END
  `,

  // --- CRUD PRESUPUESTO_DETALLE ---
  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_insertar_presupuesto_detalle (
    IN p_id_presupuesto INT,
    IN p_id_subcategoria INT,
    IN p_monto           DECIMAL(10,2),
    IN p_observaciones   CLOB,
    IN p_creado_por      VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    INSERT INTO PRESUPUESTO.PRESUPUESTO_DETALLE
      (id_presupuesto, id_subcategoria, monto_mensual, observaciones, creado_por, creado_en)
    VALUES
      (p_id_presupuesto, p_id_subcategoria, p_monto, p_observaciones, p_creado_por, CURRENT_TIMESTAMP);
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_actualizar_presupuesto_detalle (
    IN p_id_detalle      INT,
    IN p_monto           DECIMAL(10,2),
    IN p_observaciones   CLOB,
    IN p_modificado_por  VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    UPDATE PRESUPUESTO.PRESUPUESTO_DETALLE
    SET monto_mensual  = p_monto,
        observaciones  = p_observaciones,
        modificado_por = p_modificado_por,
        modificado_en  = CURRENT_TIMESTAMP
    WHERE id_detalle = p_id_detalle;
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_eliminar_presupuesto_detalle (
    IN p_id_detalle INT
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    DELETE FROM PRESUPUESTO.PRESUPUESTO_DETALLE
    WHERE id_detalle = p_id_detalle;
  END
  `,

  // --- CRUD OBLIGACION_FIJA ---
  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_insertar_obligacion (
    IN p_id_usuario     INT,
    IN p_id_subcategoria INT,
    IN p_nombre         VARCHAR(100),
    IN p_descripcion    CLOB,
    IN p_monto          DECIMAL(10,2),
    IN p_dia_venc       INT,
    IN p_fecha_inicio   TIMESTAMP,
    IN p_fecha_fin      TIMESTAMP,
    IN p_creado_por     VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    INSERT INTO PRESUPUESTO.OBLIGACION_FIJA
      (id_usuario, id_subcategoria, nombre, descripcion, monto_mensual,
       dia_vencimiento, vigente, fecha_inicio, fecha_fin, creado_por, creado_en)
    VALUES
      (p_id_usuario, p_id_subcategoria, p_nombre, p_descripcion, p_monto,
       p_dia_venc, 1, p_fecha_inicio, p_fecha_fin, p_creado_por, CURRENT_TIMESTAMP);
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_actualizar_obligacion (
    IN p_id_obligacion  INT,
    IN p_nombre         VARCHAR(100),
    IN p_descripcion    CLOB,
    IN p_monto          DECIMAL(10,2),
    IN p_dia_venc       INT,
    IN p_fecha_fin      TIMESTAMP,
    IN p_vigente        SMALLINT,
    IN p_modificado_por VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    UPDATE PRESUPUESTO.OBLIGACION_FIJA
    SET nombre         = p_nombre,
        descripcion    = p_descripcion,
        monto_mensual  = p_monto,
        dia_vencimiento = p_dia_venc,
        fecha_fin      = p_fecha_fin,
        vigente        = p_vigente,
        modificado_por = p_modificado_por,
        modificado_en  = CURRENT_TIMESTAMP
    WHERE id_obligacion = p_id_obligacion;
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_eliminar_obligacion (
    IN p_id_obligacion INT
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    UPDATE PRESUPUESTO.OBLIGACION_FIJA
    SET vigente      = 0,
        modificado_en = CURRENT_TIMESTAMP
    WHERE id_obligacion = p_id_obligacion;
  END
  `,

  // --- CRUD TRANSACCIONES ---
  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_insertar_transaccion (
    IN p_id_usuario     INT,
    IN p_id_presupuesto INT,
    IN p_id_subcategoria INT,
    IN p_id_obligacion  INT,
    IN p_anio           INT,
    IN p_mes            INT,
    IN p_tipo           VARCHAR(20),
    IN p_descripcion    CLOB,
    IN p_monto          DECIMAL(10,2),
    IN p_fecha          TIMESTAMP,
    IN p_metodo_pago    VARCHAR(30),
    IN p_num_fact       VARCHAR(50),
    IN p_observaciones  CLOB,
    IN p_creado_por     VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    INSERT INTO PRESUPUESTO.TRANSACCIONES
      (id_usuario, id_presupuesto, id_subcategoria, id_obligacion,
       anio, mes, tipo, descripcion, monto, fecha_movimiento,
       metodo_pago, numero_factura, observaciones, fecha_registro, creado_por, creado_en)
    VALUES
      (p_id_usuario, p_id_presupuesto, p_id_subcategoria, p_id_obligacion,
       p_anio, p_mes, p_tipo, p_descripcion, p_monto, p_fecha,
       p_metodo_pago, p_num_fact, p_observaciones, CURRENT_TIMESTAMP, p_creado_por, CURRENT_TIMESTAMP);
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_actualizar_transaccion (
    IN p_id_transaccion INT,
    IN p_anio           INT,
    IN p_mes            INT,
    IN p_descripcion    CLOB,
    IN p_monto          DECIMAL(10,2),
    IN p_fecha          TIMESTAMP,
    IN p_metodo_pago    VARCHAR(30),
    IN p_num_fact       VARCHAR(50),
    IN p_observaciones  CLOB,
    IN p_modificado_por VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    UPDATE PRESUPUESTO.TRANSACCIONES
    SET anio           = p_anio,
        mes            = p_mes,
        descripcion    = p_descripcion,
        monto          = p_monto,
        fecha_movimiento = p_fecha,
        metodo_pago    = p_metodo_pago,
        numero_factura = p_num_fact,
        observaciones  = p_observaciones,
        modificado_por = p_modificado_por,
        modificado_en  = CURRENT_TIMESTAMP
    WHERE id_transaccion = p_id_transaccion;
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_eliminar_transaccion (
    IN p_id_transaccion INT
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    DELETE FROM PRESUPUESTO.TRANSACCIONES
    WHERE id_transaccion = p_id_transaccion;
  END
  `,

  // --- CRUD META_AHORRO ---
  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_insertar_meta (
    IN p_id_usuario     INT,
    IN p_id_subcategoria INT,
    IN p_nombre         VARCHAR(100),
    IN p_descripcion    CLOB,
    IN p_monto_total    DECIMAL(10,2),
    IN p_fecha_inicio   TIMESTAMP,
    IN p_fecha_objetivo TIMESTAMP,
    IN p_prioridad      VARCHAR(20),
    IN p_creado_por     VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    INSERT INTO PRESUPUESTO.META_AHORRO
      (id_usuario, id_subcategoria, nombre, descripcion,
       monto_total, monto_ahorrado, fecha_inicio, fecha_objetivo,
       prioridad, estado, creado_por, creado_en)
    VALUES
      (p_id_usuario, p_id_subcategoria, p_nombre, p_descripcion,
       p_monto_total, 0, p_fecha_inicio, p_fecha_objetivo,
       p_prioridad, 'en_progreso', p_creado_por, CURRENT_TIMESTAMP);
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_actualizar_meta (
    IN p_id_meta        INT,
    IN p_nombre         VARCHAR(100),
    IN p_descripcion    CLOB,
    IN p_monto_total    DECIMAL(10,2),
    IN p_fecha_objetivo TIMESTAMP,
    IN p_prioridad      VARCHAR(20),
    IN p_estado         VARCHAR(20),
    IN p_modificado_por VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    UPDATE PRESUPUESTO.META_AHORRO
    SET nombre         = p_nombre,
        descripcion    = p_descripcion,
        monto_total    = p_monto_total,
        fecha_objetivo = p_fecha_objetivo,
        prioridad      = p_prioridad,
        estado         = p_estado,
        modificado_por = p_modificado_por,
        modificado_en  = CURRENT_TIMESTAMP
    WHERE id_meta = p_id_meta;
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_eliminar_meta (
    IN p_id_meta INT
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    DELETE FROM PRESUPUESTO.META_AHORRO
    WHERE id_meta = p_id_meta;
  END
  `,

  // --- PROCEDIMIENTOS de lógica de negocio ---
  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_registrar_transaccion_completa (
    IN p_id_usuario     INT,
    IN p_id_presupuesto INT,
    IN p_id_subcategoria INT,
    IN p_id_obligacion  INT,
    IN p_anio           INT,
    IN p_mes            INT,
    IN p_tipo           VARCHAR(20),
    IN p_descripcion    CLOB,
    IN p_monto          DECIMAL(10,2),
    IN p_fecha_mov      TIMESTAMP,
    IN p_metodo_pago    VARCHAR(30),
    IN p_creado_por     VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    DECLARE v_anio_ini INT;
    DECLARE v_mes_ini  INT;
    DECLARE v_anio_fin INT;
    DECLARE v_mes_fin  INT;

    SELECT anio_inicio, mes_inicio, anio_fin, mes_fin
    INTO v_anio_ini, v_mes_ini, v_anio_fin, v_mes_fin
    FROM PRESUPUESTO.PRESUPUESTOS
    WHERE id_presupuesto = p_id_presupuesto;

    IF (p_anio < v_anio_ini) OR (p_anio = v_anio_ini AND p_mes < v_mes_ini)
       OR (p_anio > v_anio_fin) OR (p_anio = v_anio_fin AND p_mes > v_mes_fin) THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La transacción está fuera de la vigencia del presupuesto.';
    END IF;

    INSERT INTO PRESUPUESTO.TRANSACCIONES
      (id_usuario, id_presupuesto, id_subcategoria, id_obligacion,
       anio, mes, tipo, descripcion,
       monto, fecha_movimiento, metodo_pago,
       fecha_registro, creado_por, creado_en)
    VALUES
      (p_id_usuario, p_id_presupuesto, p_id_subcategoria, p_id_obligacion,
       p_anio, p_mes, p_tipo, p_descripcion,
       p_monto, p_fecha_mov, p_metodo_pago,
       CURRENT_TIMESTAMP, p_creado_por, CURRENT_TIMESTAMP);
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_calcular_balance_mensual (
    IN  p_id_usuario     INT,
    IN  p_id_presupuesto INT,
    IN  p_anio           INT,
    IN  p_mes            INT,
    OUT p_ingresos       DECIMAL(10,2),
    OUT p_gastos         DECIMAL(10,2),
    OUT p_ahorros        DECIMAL(10,2),
    OUT p_balance        DECIMAL(10,2)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    SELECT
      COALESCE(SUM(CASE WHEN tipo = 'ingreso' THEN monto END), 0),
      COALESCE(SUM(CASE WHEN tipo = 'gasto'   THEN monto END), 0),
      COALESCE(SUM(CASE WHEN tipo = 'ahorro'  THEN monto END), 0)
    INTO p_ingresos, p_gastos, p_ahorros
    FROM PRESUPUESTO.TRANSACCIONES
    WHERE id_usuario     = p_id_usuario
      AND id_presupuesto = p_id_presupuesto
      AND anio           = p_anio
      AND mes            = p_mes;

    SET p_balance = p_ingresos - p_gastos - p_ahorros;
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_calcular_monto_ejecutado_mes (
    IN  p_id_subcategoria INT,
    IN  p_id_presupuesto  INT,
    IN  p_anio            INT,
    IN  p_mes             INT,
    OUT p_monto           DECIMAL(10,2)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    SELECT COALESCE(SUM(monto), 0)
    INTO p_monto
    FROM PRESUPUESTO.TRANSACCIONES
    WHERE id_subcategoria = p_id_subcategoria
      AND id_presupuesto  = p_id_presupuesto
      AND anio            = p_anio
      AND mes             = p_mes;
  END
  `,

  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_calcular_porcentaje_ejecucion_mes (
    IN  p_id_subcategoria INT,
    IN  p_id_presupuesto  INT,
    IN  p_anio            INT,
    IN  p_mes             INT,
    OUT p_porcentaje      DECIMAL(10,2)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    DECLARE v_monto_pres DECIMAL(10,2);
    DECLARE v_monto_eje  DECIMAL(10,2);

    SELECT monto_mensual
    INTO v_monto_pres
    FROM PRESUPUESTO.PRESUPUESTO_DETALLE
    WHERE id_subcategoria = p_id_subcategoria
      AND id_presupuesto  = p_id_presupuesto;

    SELECT COALESCE(SUM(monto), 0)
    INTO v_monto_eje
    FROM PRESUPUESTO.TRANSACCIONES
    WHERE id_subcategoria = p_id_subcategoria
      AND id_presupuesto  = p_id_presupuesto
      AND anio            = p_anio
      AND mes             = p_mes;

    IF v_monto_pres IS NULL OR v_monto_pres = 0 THEN
      SET p_porcentaje = 0;
    ELSE
      SET p_porcentaje = (v_monto_eje / v_monto_pres) * 100;
    END IF;
  END
  `,

    `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_actualizar_todas_metas_ahorro (
    IN p_id_usuario INT
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    DECLARE v_id_meta     INT;
    DECLARE v_id_subcat   INT;
    DECLARE v_monto_total DECIMAL(10,2);
    DECLARE v_total       DECIMAL(10,2);
    DECLARE done          SMALLINT DEFAULT 0;

    -- Cursor sobre las metas del usuario
    DECLARE c_metas CURSOR WITH HOLD FOR
      SELECT id_meta, id_subcategoria, monto_total
      FROM PRESUPUESTO.META_AHORRO
      WHERE id_usuario = p_id_usuario;

    -- Handler para NOT FOUND (cuando ya no hay más filas del cursor)
    DECLARE CONTINUE HANDLER FOR NOT FOUND
      SET done = 1;

    OPEN c_metas;

    -- Primer fetch
    FETCH c_metas INTO v_id_meta, v_id_subcat, v_monto_total;

    -- Loop sobre todas las metas
    WHILE done = 0 DO
      -- Total ahorrado en transacciones tipo 'ahorro' para esa subcategoría
      SELECT COALESCE(SUM(monto), 0)
      INTO v_total
      FROM PRESUPUESTO.TRANSACCIONES
      WHERE tipo           = 'ahorro'
        AND id_subcategoria = v_id_subcat
        AND id_usuario      = p_id_usuario;

      -- Actualizar la meta
      UPDATE PRESUPUESTO.META_AHORRO
      SET monto_ahorrado = v_total,
          estado = CASE
                     WHEN v_total >= v_monto_total THEN 'completada'
                     ELSE estado
                   END,
          modificado_en = CURRENT_TIMESTAMP
      WHERE id_meta = v_id_meta;

      -- Siguiente fila del cursor
      FETCH c_metas INTO v_id_meta, v_id_subcat, v_monto_total;
    END WHILE;

    CLOSE c_metas;
  END
  `
,
  `
  CREATE OR REPLACE PROCEDURE PRESUPUESTO.sp_cerrar_presupuesto (
    IN p_id_presupuesto INT,
    IN p_modificado_por VARCHAR(100)
  )
  LANGUAGE SQL
  BEGIN ATOMIC
    UPDATE PRESUPUESTO.PRESUPUESTOS
    SET estado        = 'cerrado',
        modificado_por = p_modificado_por,
        modificado_en  = CURRENT_TIMESTAMP
    WHERE id_presupuesto = p_id_presupuesto;
  END
  `
];

async function runProcedures(conn) {
  await new Promise((resolve, reject) => {
    conn.query('SET SCHEMA PRESUPUESTO', (err) => {
      if (err) {
        console.error('❌ Error en SET SCHEMA PRESUPUESTO (runProcedures):', err);
        return reject(err);
      }
      resolve();
    });
  });

  console.log(`Creando/actualizando ${procedureStatements.length} procedures...`);

  for (const sql of procedureStatements) {
    const trimmed = sql.trim();
    if (!trimmed) continue;

    console.log('> Ejecutando PROCEDURE:\n', trimmed.substring(0, 120).replace(/\s+/g, ' ') + ' ...');

    await new Promise((resolve, reject) => {
      conn.query(trimmed, (err) => {
        if (err) {
          const msg = String(err.message || err);

          if (msg.includes('SQL0601N')) {
            console.warn('⚠️ Procedure ya existe, se omite error:', msg);
            return resolve();
          }

          console.error('❌ Error creando procedure:', msg);
          return reject(err);
        }
        resolve();
      });
    });
  }

  console.log('✅ Procedures creados/actualizados correctamente');
}

module.exports = { runProcedures };
