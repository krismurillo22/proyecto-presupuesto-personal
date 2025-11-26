
async function runTriggers(conn) {
  const trigger1 = `
CREATE TRIGGER PRESUPUESTO.TRG_CATEGORIA_CREAR_SUBCATEGORIA
AFTER INSERT ON PRESUPUESTO.CATEGORIAS
REFERENCING NEW AS N
FOR EACH ROW
BEGIN ATOMIC
    INSERT INTO PRESUPUESTO.SUBCATEGORIAS (
        id_categoria, nombre, descripcion, activa, es_defecto,
        creado_por, creado_en
    )
    VALUES (
        N.id_categoria,
        N.nombre,
        'Subcategoría generada por defecto',
        1,
        1,
        N.creado_por,
        CURRENT_TIMESTAMP
    );
END
`;

  const trigger2 = `
CREATE TRIGGER PRESUPUESTO.TRG_TRANSACCION_META_AHORRO
AFTER INSERT ON PRESUPUESTO.TRANSACCIONES
REFERENCING NEW AS N
FOR EACH ROW
WHEN (N.tipo = 'ahorro')
BEGIN ATOMIC
    UPDATE PRESUPUESTO.META_AHORRO
    SET monto_ahorrado = monto_ahorrado + N.monto,
        modificado_en = CURRENT_TIMESTAMP
    WHERE id_subcategoria = N.id_subcategoria;
END
`;

  const statements = [trigger1, trigger2];

  console.log(`Ejecutando ${statements.length} triggers...`);

  for (const stmt of statements) {
    console.log('> Ejecutando trigger:\n', stmt.substring(0, 120) + '...');
    await new Promise((resolve, reject) => {
      conn.query(stmt, (err) => {
        if (err) {
          console.error('❌ Error creando trigger:', err);
          return reject(err);
        }
        resolve();
      });
    });
  }

  console.log('✅ Triggers creados correctamente');
}

module.exports = { runTriggers };
