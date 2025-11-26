
const functionStatements = [
  `
  CREATE OR REPLACE FUNCTION PRESUPUESTO.fn_calcular_monto_ejecutado (
    p_id_subcategoria INT,
    p_anio            INT,
    p_mes             INT
  )
  RETURNS DECIMAL(10,2)
  LANGUAGE SQL
  BEGIN ATOMIC
    DECLARE v_total DECIMAL(10,2) DEFAULT 0;

    SET v_total = (
      SELECT COALESCE(SUM(monto), 0)
      FROM PRESUPUESTO.TRANSACCIONES
      WHERE id_subcategoria = p_id_subcategoria
        AND anio            = p_anio
        AND mes             = p_mes
    );

    RETURN v_total;
  END
  `,

  // 2) fn_calcular_porcentaje_ejecutado
  `
  CREATE OR REPLACE FUNCTION PRESUPUESTO.fn_calcular_porcentaje_ejecutado (
    p_id_subcategoria INT,
    p_id_presupuesto  INT,
    p_anio            INT,
    p_mes             INT
  )
  RETURNS DECIMAL(10,2)
  LANGUAGE SQL
  BEGIN ATOMIC
    DECLARE v_pres DECIMAL(10,2) DEFAULT 0;
    DECLARE v_eje  DECIMAL(10,2) DEFAULT 0;

    SET v_pres = (
      SELECT monto_mensual
      FROM PRESUPUESTO.PRESUPUESTO_DETALLE
      WHERE id_subcategoria = p_id_subcategoria
        AND id_presupuesto  = p_id_presupuesto
    );

    SET v_eje = (
      SELECT COALESCE(SUM(monto), 0)
      FROM PRESUPUESTO.TRANSACCIONES
      WHERE id_subcategoria = p_id_subcategoria
        AND id_presupuesto  = p_id_presupuesto
        AND anio            = p_anio
        AND mes             = p_mes
    );

    IF v_pres IS NULL OR v_pres = 0 THEN
      RETURN 0;
    END IF;

    RETURN (v_eje / v_pres) * 100;
  END
  `,

  // 3) fn_obtener_balance_subcategoria
  `
  CREATE OR REPLACE FUNCTION PRESUPUESTO.fn_obtener_balance_subcategoria (
    p_id_presupuesto  INT,
    p_id_subcategoria INT,
    p_anio            INT,
    p_mes             INT
  )
  RETURNS DECIMAL(10,2)
  LANGUAGE SQL
  BEGIN ATOMIC
    DECLARE v_pres DECIMAL(10,2) DEFAULT 0;
    DECLARE v_eje  DECIMAL(10,2) DEFAULT 0;

    SET v_pres = (
      SELECT monto_mensual
      FROM PRESUPUESTO.PRESUPUESTO_DETALLE
      WHERE id_presupuesto  = p_id_presupuesto
        AND id_subcategoria = p_id_subcategoria
    );

    SET v_eje = PRESUPUESTO.fn_calcular_monto_ejecutado(
      p_id_subcategoria,
      p_anio,
      p_mes
    );

    RETURN v_pres - v_eje;
  END
  `,

  // 4) fn_obtener_total_categoria_mes
  `
  CREATE OR REPLACE FUNCTION PRESUPUESTO.fn_obtener_total_categoria_mes (
    p_id_categoria   INT,
    p_id_presupuesto INT
  )
  RETURNS DECIMAL(10,2)
  LANGUAGE SQL
  BEGIN ATOMIC
    DECLARE v_total DECIMAL(10,2) DEFAULT 0;

    SET v_total = (
      SELECT COALESCE(SUM(D.monto_mensual), 0)
      FROM PRESUPUESTO.PRESUPUESTO_DETALLE D
      JOIN PRESUPUESTO.SUBCATEGORIAS S
        ON S.id_subcategoria = D.id_subcategoria
      WHERE S.id_categoria   = p_id_categoria
        AND D.id_presupuesto = p_id_presupuesto
    );

    RETURN v_total;
  END
  `,

  // 5) fn_obtener_total_ejecutado_categoria_mes
  `
  CREATE OR REPLACE FUNCTION PRESUPUESTO.fn_obtener_total_ejecutado_categoria_mes (
    p_id_categoria INT,
    p_anio         INT,
    p_mes          INT
  )
  RETURNS DECIMAL(10,2)
  LANGUAGE SQL
  BEGIN ATOMIC
    DECLARE v_total DECIMAL(10,2) DEFAULT 0;

    SET v_total = (
      SELECT COALESCE(SUM(T.monto), 0)
      FROM PRESUPUESTO.TRANSACCIONES T
      JOIN PRESUPUESTO.SUBCATEGORIAS S
        ON S.id_subcategoria = T.id_subcategoria
      WHERE S.id_categoria = p_id_categoria
        AND T.anio        = p_anio
        AND T.mes         = p_mes
    );

    RETURN v_total;
  END
  `,

  // 6) fn_dias_hasta_vencimiento
  `
  CREATE OR REPLACE FUNCTION PRESUPUESTO.fn_dias_hasta_vencimiento (
    p_id_obligacion INT
  )
  RETURNS INT
  LANGUAGE SQL
  BEGIN ATOMIC
    DECLARE v_fecha_fin DATE;
    DECLARE v_hoy       DATE;

    SET v_fecha_fin = (
      SELECT DATE(fecha_fin)
      FROM PRESUPUESTO.OBLIGACION_FIJA
      WHERE id_obligacion = p_id_obligacion
    );

    SET v_hoy = CURRENT_DATE;

    RETURN DAYS(v_fecha_fin) - DAYS(v_hoy);
  END
  `,

  // 7) fn_validar_vigencia_presupuesto
  `
  CREATE OR REPLACE FUNCTION PRESUPUESTO.fn_validar_vigencia_presupuesto (
    p_fecha         DATE,
    p_id_presupuesto INT
  )
  RETURNS SMALLINT
  LANGUAGE SQL
  BEGIN ATOMIC
    DECLARE v_anio_inicio INT;
    DECLARE v_mes_inicio  INT;
    DECLARE v_anio_fin    INT;
    DECLARE v_mes_fin     INT;

    SET v_anio_inicio = (
      SELECT anio_inicio
      FROM PRESUPUESTO.PRESUPUESTOS
      WHERE id_presupuesto = p_id_presupuesto
    );

    SET v_mes_inicio = (
      SELECT mes_inicio
      FROM PRESUPUESTO.PRESUPUESTOS
      WHERE id_presupuesto = p_id_presupuesto
    );

    SET v_anio_fin = (
      SELECT anio_fin
      FROM PRESUPUESTO.PRESUPUESTOS
      WHERE id_presupuesto = p_id_presupuesto
    );

    SET v_mes_fin = (
      SELECT mes_fin
      FROM PRESUPUESTO.PRESUPUESTOS
      WHERE id_presupuesto = p_id_presupuesto
    );

    IF YEAR(p_fecha) < v_anio_inicio THEN
      RETURN 0;
    END IF;

    IF YEAR(p_fecha) = v_anio_inicio AND MONTH(p_fecha) < v_mes_inicio THEN
      RETURN 0;
    END IF;

    IF YEAR(p_fecha) > v_anio_fin THEN
      RETURN 0;
    END IF;

    IF YEAR(p_fecha) = v_anio_fin AND MONTH(p_fecha) > v_mes_fin THEN
      RETURN 0;
    END IF;

    RETURN 1;
  END
  `,

  // 8) fn_obtener_categoria_por_subcategoria
  `
  CREATE OR REPLACE FUNCTION PRESUPUESTO.fn_obtener_categoria_por_subcategoria (
    p_id_subcategoria INT
  )
  RETURNS INT
  LANGUAGE SQL
  BEGIN ATOMIC
    DECLARE v_categoria INT;

    SET v_categoria = (
      SELECT id_categoria
      FROM PRESUPUESTO.SUBCATEGORIAS
      WHERE id_subcategoria = p_id_subcategoria
    );

    RETURN v_categoria;
  END
  `,

  // 9) fn_calcular_proyeccion_gasto_mensual
  `
  CREATE OR REPLACE FUNCTION PRESUPUESTO.fn_calcular_proyeccion_gasto_mensual (
    p_id_subcategoria INT,
    p_anio            INT,
    p_mes             INT
  )
  RETURNS DECIMAL(10,2)
  LANGUAGE SQL
  BEGIN ATOMIC
    DECLARE ejecutado   DECIMAL(10,2) DEFAULT 0;
    DECLARE dia         INT;
    DECLARE total_dias  INT;

    SET ejecutado = (
      SELECT COALESCE(SUM(monto), 0)
      FROM PRESUPUESTO.TRANSACCIONES
      WHERE id_subcategoria = p_id_subcategoria
        AND anio            = p_anio
        AND mes             = p_mes
    );

    SET dia        = DAY(CURRENT_DATE);
    SET total_dias = DAY(LAST_DAY(CURRENT_DATE));

    IF dia = 0 THEN
      RETURN 0;
    END IF;

    RETURN (ejecutado / dia) * total_dias;
  END
  `,

  // 10) fn_obtener_promedio_gasto_subcategoria
  `
  CREATE OR REPLACE FUNCTION PRESUPUESTO.fn_obtener_promedio_gasto_subcategoria (
    p_id_usuario     INT,
    p_id_subcategoria INT,
    p_meses          INT
  )
  RETURNS DECIMAL(10,2)
  LANGUAGE SQL
  BEGIN ATOMIC
    DECLARE v_total DECIMAL(10,2) DEFAULT 0;

    SET v_total = (
      SELECT COALESCE(SUM(monto), 0)
      FROM PRESUPUESTO.TRANSACCIONES
      WHERE id_usuario     = p_id_usuario
        AND id_subcategoria = p_id_subcategoria
        AND fecha_movimiento >= (CURRENT_DATE - (p_meses * 30) DAYS)
    );

    IF p_meses = 0 THEN
      RETURN 0;
    END IF;

    RETURN v_total / p_meses;
  END
  `
];


async function runFunctions(conn) {
  await new Promise((resolve, reject) => {
    conn.query('SET SCHEMA PRESUPUESTO', (err) => {
      if (err) {
        console.error('❌ Error en SET SCHEMA PRESUPUESTO (runFunctions):', err);
        return reject(err);
      }
      resolve();
    });
  });

  console.log(`Creando/actualizando ${functionStatements.length} functions...`);

  for (const sql of functionStatements) {
    const trimmed = sql.trim();
    if (!trimmed) continue;

    console.log('> Ejecutando FUNCTION:\n', trimmed.substring(0, 120).replace(/\s+/g, ' ') + ' ...');

    await new Promise((resolve, reject) => {
      conn.query(trimmed, (err) => {
        if (err) {
          const msg = String(err.message || err);

          if (msg.includes('SQL0601N')) {
            console.warn('⚠️ Function ya existe, se omite error:', msg);
            return resolve();
          }

          console.error('❌ Error creando function:', msg);
          return reject(err);
        }
        resolve();
      });
    });
  }

  console.log('✅ Functions creadas/actualizadas correctamente');
}

module.exports = { runFunctions };
