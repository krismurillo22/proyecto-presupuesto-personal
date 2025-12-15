-- Seed de Datos de Prueba
-- 2 MESES: Enero Y Febrero 2025


-- Crear usuario principal
INSERT INTO USUARIOS (
    nombres, apellidos, correo, fecha_registro, salario_base, estado,
    creado_por, creado_en
) VALUES (
    'Samuel', 'Paz', 'samuel_paz@gmail.com', CURRENT_TIMESTAMP,
    18000.00, 1, 'seed', CURRENT_TIMESTAMP
);

-- Obtener id_usuario generado
SELECT IDENTITY_VAL_LOCAL() AS id_usuario FROM SYSIBM.SYSDUMMY1;

-- CATEGORÍAS
INSERT INTO CATEGORIAS (nombre, descripcion, tipo, nombre_icono, color_hex, orden_presentacion, creado_por, creado_en)
VALUES
('Ingresos', 'Entradas de dinero mensuales', 'ingreso', 'icon_ingreso', '#4CAF50', 1, 'seed', CURRENT_TIMESTAMP),
('Gastos Fijos', 'Gastos mensuales obligatorios', 'gasto', 'icon_gasto_fijo', '#F44336', 2, 'seed', CURRENT_TIMESTAMP),
('Gastos Variables', 'Compras diarias y gastos pequeños', 'gasto', 'icon_var', '#FF9800', 3, 'seed', CURRENT_TIMESTAMP),
('Ahorro', 'Metas de ahorro', 'ahorro', 'icon_save', '#2196F3', 4, 'seed', CURRENT_TIMESTAMP);


-- SUBCATEGORÍAS
-- Ingresos
INSERT INTO SUBCATEGORIAS (id_categoria, nombre, descripcion, activa, es_defecto, creado_por, creado_en)
VALUES
(1, 'Salario Mensual', 'Salario recibido cada mes', 1, 1, 'seed', CURRENT_TIMESTAMP),
(1, 'Ingresos Extras', 'Freelance o ventas', 1, 0, 'seed', CURRENT_TIMESTAMP);

-- Gastos fijos
INSERT INTO SUBCATEGORIAS (id_categoria, nombre, descripcion, activa, es_defecto, creado_por, creado_en)
VALUES
(2, 'Renta', 'Pago mensual de vivienda', 1, 1, 'seed', CURRENT_TIMESTAMP),
(2, 'Electricidad', 'Factura de energía eléctrica', 1, 0, 'seed', CURRENT_TIMESTAMP),
(2, 'Internet', 'Servicio de Internet mensual', 1, 0, 'seed', CURRENT_TIMESTAMP),
(2, 'Teléfono', 'Plan de celular', 1, 0, 'seed', CURRENT_TIMESTAMP);

-- Gastos variables
INSERT INTO SUBCATEGORIAS (id_categoria, nombre, descripcion, activa, es_defecto, creado_por, creado_en)
VALUES
(3, 'Supermercado', 'Compras de alimentos', 1, 1, 'seed', CURRENT_TIMESTAMP),
(3, 'Restaurantes', 'Comidas fuera de casa', 1, 0, 'seed', CURRENT_TIMESTAMP),
(3, 'Transporte', 'Gastos en gasolina o Uber', 1, 0, 'seed', CURRENT_TIMESTAMP);

-- Ahorro
INSERT INTO SUBCATEGORIAS (id_categoria, nombre, descripcion, activa, es_defecto, creado_por, creado_en)
VALUES
(4, 'Ahorro General', 'Ahorro mensual', 1, 1, 'seed', CURRENT_TIMESTAMP),
(4, 'Fondo de Emergencias', 'Ahorro para imprevistos', 1, 0, 'seed', CURRENT_TIMESTAMP);

-- PRESUPUESTOS (Enero Y Febrero 2025)
INSERT INTO PRESUPUESTOS (
    id_usuario, nombre, anio_inicio, mes_inicio, anio_fin, mes_fin,
    total_ingresos, total_gastos, total_ahorros, fecha_creacion, estado,
    creado_por, creado_en
)
VALUES
(1, 'Presupuesto Enero 2025', 2025, 1, 2025, 1,
 18000, 8000, 3000, CURRENT_TIMESTAMP, 'activo', 'seed', CURRENT_TIMESTAMP),
(1, 'Presupuesto Febrero 2025', 2025, 2, 2025, 2,
 18000, 8200, 3200, CURRENT_TIMESTAMP, 'activo', 'seed', CURRENT_TIMESTAMP);

-- IDs generados:
-- Enero  = 1
-- Febrero = 2

-- PRESUPUESTO DETALLE
INSERT INTO PRESUPUESTO_DETALLE (id_presupuesto, id_subcategoria, monto_mensual, creado_por, creado_en)
VALUES
-- Enero
(1, 1, 18000, 'seed', CURRENT_TIMESTAMP),
(1, 3, 4500, 'seed', CURRENT_TIMESTAMP),
(1, 4, 1500, 'seed', CURRENT_TIMESTAMP),
(1, 5, 800, 'seed', CURRENT_TIMESTAMP),
(1, 6, 600, 'seed', CURRENT_TIMESTAMP),
(1, 7, 2500, 'seed', CURRENT_TIMESTAMP),
(1, 8, 1500, 'seed', CURRENT_TIMESTAMP),
(1, 9, 1200, 'seed', CURRENT_TIMESTAMP),
(1, 10, 1200, 'seed', CURRENT_TIMESTAMP),
(1, 11, 800, 'seed', CURRENT_TIMESTAMP),

-- Febrero
(2, 1, 18000, 'seed', CURRENT_TIMESTAMP),
(2, 3, 4500, 'seed', CURRENT_TIMESTAMP),
(2, 4, 1500, 'seed', CURRENT_TIMESTAMP),
(2, 5, 850, 'seed', CURRENT_TIMESTAMP),
(2, 6, 650, 'seed', CURRENT_TIMESTAMP),
(2, 7, 2600, 'seed', CURRENT_TIMESTAMP),
(2, 8, 1600, 'seed', CURRENT_TIMESTAMP),
(2, 9, 1200, 'seed', CURRENT_TIMESTAMP),
(2, 10, 1200, 'seed', CURRENT_TIMESTAMP),
(2, 11, 900, 'seed', CURRENT_TIMESTAMP);

-- OBLIGACIONES FIJAS
INSERT INTO OBLIGACION_FIJA ( id_usuario, id_subcategoria, nombre, descripcion, monto_mensual,
     dia_vencimiento, vigente, fecha_inicio, fecha_fin, creado_por, creado_en)
VALUES
(1, 3, 'Pago de Renta', 'Renta mensual del apartamento', 4500, 5, 1, '2023-01-01', NULL, 'seed', CURRENT_TIMESTAMP),
(1, 4, 'Electricidad', 'Pago de energía', 1500, 10, 1, '2023-01-01', NULL, 'seed', CURRENT_TIMESTAMP),
(1, 5, 'Internet Hogar', 'Plan de Internet', 800, 15, 1, '2023-01-01', NULL, 'seed', CURRENT_TIMESTAMP),
(1, 6, 'Teléfono', 'Plan móvil', 600, 20, 1, '2023-01-01', NULL, 'seed', CURRENT_TIMESTAMP);


-- METAS DE AHORRO
INSERT INTO META_AHORRO (id_usuario, id_subcategoria, nombre, descripcion, monto_total, monto_ahorrado, fecha_inicio, fecha_objetivo,
    prioridad, estado, creado_por, creado_en)
VALUES
(1, 10, 'Viaje a Guatemala', 'Ahorro para viaje en junio', 5000, 1200, '2024-12-01', '2025-06-01', 'media', 'en_progreso', 'seed', CURRENT_TIMESTAMP),
(1, 11, 'Fondo de Emergencias', 'Meta para emergencias', 8000, 2000, '2024-12-01', '2025-12-01', 'alta', 'en_progreso', 'seed', CURRENT_TIMESTAMP);


-- TRANSACCIONES - Enero 2025
INSERT INTO TRANSACCIONES (id_usuario, id_presupuesto, id_subcategoria, id_obligacion, anio, mes, tipo, descripcion, monto, fecha_movimiento,
    metodo_pago, numero_factura, observaciones, fecha_registro, creado_por, creado_en)
VALUES
-- Ingresos
(1, 1, 1, NULL, 2025, 1, 'ingreso', 'Salario enero', 18000, '2025-01-01', 'transferencia', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),

-- Gastos fijos
(1, 1, 3, 1, 2025, 1, 'gasto', 'Pago de renta', 4500, '2025-01-05', 'transferencia', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),
(1, 1, 4, 2, 2025, 1, 'gasto', 'Pago de energía', 1500, '2025-01-10', 'efectivo', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),
(1, 1, 5, 3, 2025, 1, 'gasto', 'Internet', 800, '2025-01-15', 'tarjeta', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),

-- Gastos variables
(1, 1, 7, NULL, 2025, 1, 'gasto', 'Supermercado', 1200, '2025-01-04', 'tarjeta', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),
(1, 1, 7, NULL, 2025, 1, 'gasto', 'Supermercado', 1300, '2025-01-14', 'tarjeta', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),
(1, 1, 8, NULL, 2025, 1, 'gasto', 'Restaurante', 400, '2025-01-12', 'efectivo', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),
(1, 1, 9, NULL, 2025, 1, 'gasto', 'Gasolina', 600, '2025-01-20', 'tarjeta', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),

-- Ahorra
(1, 1, 10, NULL, 2025, 1, 'ahorro', 'Ahorro general', 600, '2025-01-03', 'transferencia', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),
(1, 1, 11, NULL, 2025, 1, 'ahorro', 'Fondo de emergencias', 600, '2025-01-18', 'transferencia', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP);

-- TRANSACCIONES - Febrero 2025
INSERT INTO TRANSACCIONES (id_usuario, id_presupuesto, id_subcategoria, id_obligacion,
    anio, mes, tipo, descripcion, monto, fecha_movimiento, metodo_pago, numero_factura, observaciones, fecha_registro, creado_por, creado_en)
VALUES
-- Ingresos
(1, 2, 1, NULL, 2025, 2, 'ingreso', 'Salario febrero', 18000, '2025-02-01', 'transferencia', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),

-- Gastos fijos
(1, 2, 3, 1, 2025, 2, 'gasto', 'Pago de renta', 4500, '2025-02-05', 'transferencia', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),
(1, 2, 4, 2, 2025, 2, 'gasto', 'Pago de energía', 1550, '2025-02-10', 'efectivo', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),
(1, 2, 5, 3, 2025, 2, 'gasto', 'Internet', 850, '2025-02-15', 'tarjeta', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),

-- Gastos variables
(1, 2, 7, NULL, 2025, 2, 'gasto', 'Supermercado', 1250, '2025-02-04', 'tarjeta', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),
(1, 2, 7, NULL, 2025, 2, 'gasto', 'Supermercado', 1350, '2025-02-14', 'tarjeta', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),
(1, 2, 8, NULL, 2025, 2, 'gasto', 'Restaurante', 420, '2025-02-12', 'efectivo', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),
(1, 2, 9, NULL, 2025, 2, 'gasto', 'Gasolina', 620, '2025-02-20', 'tarjeta', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),

-- Ahorro
(1, 2, 10, NULL, 2025, 2, 'ahorro', 'Ahorro general', 650, '2025-02-03', 'transferencia', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP),
(1, 2, 11, NULL, 2025, 2, 'ahorro', 'Fondo de emergencias', 650, '2025-02-18', 'transferencia', NULL, NULL, CURRENT_TIMESTAMP, 'seed', CURRENT_TIMESTAMP);

