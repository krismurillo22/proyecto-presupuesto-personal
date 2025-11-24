--#SET TERMINATOR @

-- TRIGGER #1: Crear subcategoría por defecto al insertar categoría
CREATE TRIGGER trg_categoria_crear_subcategoria
AFTER INSERT ON CATEGORIAS
REFERENCING NEW AS N
FOR EACH ROW
BEGIN ATOMIC
    INSERT INTO SUBCATEGORIAS (
        id_categoria, nombre, descripcion, activa, es_defecto,
        creado_por, creado_en
    )
    VALUES (
        N.id_categoria,
        N.nombre,                      -- mismo nombre de categoría
        'Subcategoría generada por defecto',
        1,                             -- activa
        1,                             -- es por defecto
        N.creado_por,
        CURRENT_TIMESTAMP
    );
END@


-- TRIGGER #2: Sumar monto a META_AHORRO cuando se inserta una transacción de tipo "ahorro"
CREATE TRIGGER trg_transaccion_meta_ahorro
AFTER INSERT ON TRANSACCIONES
REFERENCING NEW AS N
FOR EACH ROW
WHEN (N.tipo = 'ahorro')
BEGIN ATOMIC
    
    -- Actualiza el monto acumulado asociado a la subcategoría
    UPDATE META_AHORRO
    SET monto_ahorrado = monto_ahorrado + N.monto,
        modificado_en = CURRENT_TIMESTAMP
    WHERE id_subcategoria = N.id_subcategoria;

END@

-- Restaurar terminador
--#SET TERMINATOR ;
