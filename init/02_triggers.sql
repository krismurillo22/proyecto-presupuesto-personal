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
        N.nombre,                      
        'Subcategoría generada por defecto',
        1,                             
        1,                             
        N.creado_por,
        CURRENT_TIMESTAMP
    );
END@

CREATE TRIGGER trg_transaccion_meta_ahorro
AFTER INSERT ON TRANSACCIONES
REFERENCING NEW AS N
FOR EACH ROW
WHEN (N.tipo = 'ahorro')
BEGIN ATOMIC
    
    UPDATE META_AHORRO
    SET monto_ahorrado = monto_ahorrado + N.monto,
        modificado_en = CURRENT_TIMESTAMP
    WHERE id_subcategoria = N.id_subcategoria;

END@
