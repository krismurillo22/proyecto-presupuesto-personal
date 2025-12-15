--Calcular el monto ejecutado
CREATE OR REPLACE FUNCTION fn_calcular_monto_ejecutado (p_id_subcategoria INT, p_anio INT, p_mes INT)
RETURNS DECIMAL(10,2)
BEGIN ATOMIC
    DECLARE v_total DECIMAL(10,2);

    SELECT COALESCE(SUM(monto), 0)
    INTO v_total
    FROM TRANSACCIONES
    WHERE id_subcategoria = p_id_subcategoria AND anio = p_anio AND mes = p_mes;

    RETURN v_total;
END@

-- Porcentaje ejecutado
CREATE OR REPLACE FUNCTION fn_calcular_porcentaje_ejecutado ( p_id_subcategoria INT, p_id_presupuesto INT, p_anio INT, p_mes INT)
RETURNS DECIMAL(10,2)
BEGIN ATOMIC
    DECLARE v_pres DECIMAL(10,2);
    DECLARE v_eje DECIMAL(10,2);

    SELECT monto_mensual
    INTO v_pres
    FROM PRESUPUESTO_DETALLE
    WHERE id_subcategoria = p_id_subcategoria AND id_presupuesto = p_id_presupuesto;

    SELECT COALESCE(SUM(monto),0)
    INTO v_eje
    FROM TRANSACCIONES
    WHERE id_subcategoria = p_id_subcategoria AND id_presupuesto = p_id_presupuesto AND anio = p_anio AND mes = p_mes;

    IF v_pres = 0 THEN 
        RETURN 0; 
    END IF;

    RETURN (v_eje / v_pres) * 100;
END@

--Obtener balance disponible
CREATE OR REPLACE FUNCTION fn_obtener_balance_subcategoria ( p_id_presupuesto INT, p_id_subcategoria INT, p_anio INT, p_mes INT)
RETURNS DECIMAL(10,2)
BEGIN ATOMIC
    DECLARE v_pres DECIMAL(10,2);
    DECLARE v_eje DECIMAL(10,2);

    SELECT monto_mensual
    INTO v_pres
    FROM PRESUPUESTO_DETALLE
    WHERE id_presupuesto = p_id_presupuesto
      AND id_subcategoria = p_id_subcategoria;

    SET v_eje = fn_calcular_monto_ejecutado(p_id_subcategoria, p_anio, p_mes);

    RETURN v_pres - v_eje;
END@


-- Obtener presupuesto del mes
CREATE OR REPLACE FUNCTION fn_obtener_total_categoria_mes ( p_id_categoria INT, p_id_presupuesto INT)
RETURNS DECIMAL(10,2)
BEGIN ATOMIC
    DECLARE v_total DECIMAL(10,2);

    SELECT COALESCE(SUM(monto_mensual),0)
    INTO v_total
    FROM PRESUPUESTO_DETALLE D
    JOIN SUBCATEGORIAS S ON S.id_subcategoria = D.id_subcategoria
    WHERE S.id_categoria = p_id_categoria AND D.id_presupuesto = p_id_presupuesto;

    RETURN v_total;
END@

--Total ejecutado
CREATE OR REPLACE FUNCTION fn_obtener_total_ejecutado_categoria_mes (p_id_categoria INT, p_anio INT, p_mes INT)
RETURNS DECIMAL(10,2)
BEGIN ATOMIC
    DECLARE v_total DECIMAL(10,2);

    SELECT COALESCE(SUM(T.monto),0)
    INTO v_total
    FROM TRANSACCIONES T
    JOIN SUBCATEGORIAS S ON S.id_subcategoria = T.id_subcategoria
    WHERE S.id_categoria = p_id_categoria AND T.anio = p_anio AND T.mes = p_mes;

    RETURN v_total;
END@


-- Calcular dias hasta vencimiento
CREATE OR REPLACE FUNCTION fn_dias_hasta_vencimiento (p_id_obligacion INT)
RETURNS INT
BEGIN ATOMIC
    DECLARE v_fecha_fin DATE;
    DECLARE v_hoy DATE;

    SELECT fecha_fin
    INTO v_fecha_fin
    FROM OBLIGACION_FIJA
    WHERE id_obligacion = p_id_obligacion;

    SET v_hoy = CURRENT_DATE;

    RETURN DAYS(v_fecha_fin) - DAYS(v_hoy);
END@

--Validar vigencia de fecha
CREATE OR REPLACE FUNCTION fn_validar_vigencia_presupuesto ( p_fecha DATE, p_id_presupuesto INT)
RETURNS SMALLINT
BEGIN ATOMIC
    DECLARE v_anio_inicio INT;
    DECLARE v_mes_inicio INT;
    DECLARE v_anio_fin INT;
    DECLARE v_mes_fin INT;

    SELECT anio_inicio, mes_inicio, anio_fin, mes_fin
    INTO v_anio_inicio, v_mes_inicio, v_anio_fin, v_mes_fin
    FROM PRESUPUESTOS
    WHERE id_presupuesto = p_id_presupuesto;

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
END@


--Obtener categoria padre
CREATE OR REPLACE FUNCTION fn_obtener_categoria_por_subcategoria ( p_id_subcategoria INT)
RETURNS INT
BEGIN ATOMIC
    DECLARE p_categoria INT;

    SELECT id_categoria
    INTO p_categoria
    FROM SUBCATEGORIAS
    WHERE id_subcategoria = p_id_subcategoria;

    RETURN p_categoria;
END@


--Gasto a fin de mes
CREATE OR REPLACE FUNCTION fn_calcular_proyeccion_gasto_mensual ( p_id_subcategoria INT, p_anio INT, p_mes INT )
RETURNS DECIMAL(10,2)
BEGIN ATOMIC
    DECLARE ejecutado DECIMAL(10,2);
    DECLARE dia INT;
    DECLARE total_dias INT;

    SELECT COALESCE(SUM(monto),0)
    INTO ejecutado
    FROM TRANSACCIONES
    WHERE id_subcategoria = p_id_subcategoria AND anio = p_anio AND mes = p_mes;

    SET dia = DAY(CURRENT_DATE);
    SET total_dias = DAY(LAST_DAY(CURRENT_DATE));

    RETURN (ejecutado / dia) * total_dias;
END@


--Promedio de gasto 
CREATE OR REPLACE FUNCTION fn_obtener_promedio_gasto_subcategoria (p_id_usuario INT, p_id_subcategoria INT, p_meses INT )
RETURNS DECIMAL(10,2)
BEGIN ATOMIC
    DECLARE total DECIMAL(10,2);

    SELECT COALESCE(SUM(monto),0)
    INTO total
    FROM TRANSACCIONES
    WHERE id_usuario = p_id_usuario AND id_subcategoria = p_id_subcategoria AND fecha_movimiento >= (CURRENT_DATE - (p_meses * 30) DAYS);

    RETURN total / p_meses;
END@

