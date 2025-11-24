-- Crear schema
CREATE SCHEMA PRESUPUESTO AUTHORIZATION DB2INST1;
SET SCHEMA PRESUPUESTO;

-- Tabla USUARIOS
CREATE TABLE USUARIOS (
    id_usuario INT NOT NULL 
        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    correo VARCHAR(150) NOT NULL UNIQUE,
    fecha_registro TIMESTAMP,
    salario_base DECIMAL(10,2),
    estado SMALLINT, -- 1 = activo, 0 = inactivo

    -- Auditoría
    creado_por VARCHAR(100),
    modificado_por VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_en TIMESTAMP
);


-- Tabla PRESUPUESTOS
CREATE TABLE PRESUPUESTOS (
    id_presupuesto INT NOT NULL 
        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT,
    nombre VARCHAR(100),
    anio_inicio INT,
    mes_inicio INT,
    anio_fin INT,
    mes_fin INT,
    total_ingresos DECIMAL(10,2),
    total_gastos DECIMAL(10,2),
    total_ahorros DECIMAL(10,2),
    fecha_creacion TIMESTAMP,
    estado VARCHAR(20),

    -- Auditoría
    creado_por VARCHAR(100),
    modificado_por VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_en TIMESTAMP
);


-- Tabla CATEGORIAS
CREATE TABLE CATEGORIAS (
    id_categoria INT NOT NULL 
        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion CLOB,
    tipo VARCHAR(20),
    nombre_icono CLOB,
    color_hex VARCHAR(10),
    orden_presentacion INT,

    -- Auditoría
    creado_por VARCHAR(100),
    modificado_por VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_en TIMESTAMP
);


-- Tabla SUBCATEGORIAS
CREATE TABLE SUBCATEGORIAS (
    id_subcategoria INT NOT NULL 
        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria INT,
    nombre VARCHAR(100),
    descripcion CLOB,
    activa SMALLINT,
    es_defecto SMALLINT,

    -- Auditoría
    creado_por VARCHAR(100),
    modificado_por VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_en TIMESTAMP
);


-- Tabla PRESUPUESTO_DETALLE
CREATE TABLE PRESUPUESTO_DETALLE (
    id_detalle INT NOT NULL 
        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_presupuesto INT,
    id_subcategoria INT,
    monto_mensual DECIMAL(10,2),
    observaciones CLOB,

    -- Auditoría
    creado_por VARCHAR(100),
    modificado_por VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_en TIMESTAMP
);


-- Tabla OBLIGACION_FIJA
CREATE TABLE OBLIGACION_FIJA (
    id_obligacion INT NOT NULL 
        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT,
    id_subcategoria INT,
    nombre VARCHAR(100),
    descripcion CLOB,
    monto_mensual DECIMAL(10,2),
    dia_vencimiento INT,
    vigente SMALLINT,
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,

    -- Auditoría
    creado_por VARCHAR(100),
    modificado_por VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_en TIMESTAMP
);


-- Tabla META_AHORRO
CREATE TABLE META_AHORRO (
    id_meta INT NOT NULL 
        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT,
    id_subcategoria INT,
    nombre VARCHAR(100),
    descripcion CLOB,
    monto_total DECIMAL(10,2),
    monto_ahorrado DECIMAL(10,2),
    fecha_inicio TIMESTAMP,
    fecha_objetivo TIMESTAMP,
    prioridad VARCHAR(20),
    estado VARCHAR(20),

    -- Auditoría
    creado_por VARCHAR(100),
    modificado_por VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_en TIMESTAMP
);


-- Tabla TRANSACCIONES
CREATE TABLE TRANSACCIONES (
    id_transaccion INT NOT NULL 
        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INT,
    id_presupuesto INT,
    id_subcategoria INT,
    id_obligacion INT, -- opcional
    anio INT,
    mes INT,
    tipo VARCHAR(20),
    descripcion CLOB,
    monto DECIMAL(10,2),
    fecha_movimiento TIMESTAMP,
    metodo_pago VARCHAR(30),
    numero_factura VARCHAR(50),
    observaciones CLOB,
    fecha_registro TIMESTAMP,

    -- Auditoría
    creado_por VARCHAR(100),
    modificado_por VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_en TIMESTAMP
);


-- Llaves foráneas=

ALTER TABLE PRESUPUESTOS 
  ADD CONSTRAINT FK_PRESUP_USUARIO 
  FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario);

ALTER TABLE OBLIGACION_FIJA 
  ADD CONSTRAINT FK_OBLIG_USUARIO 
  FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario);

ALTER TABLE META_AHORRO 
  ADD CONSTRAINT FK_META_USUARIO 
  FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario);

ALTER TABLE TRANSACCIONES 
  ADD CONSTRAINT FK_TRANS_USUARIO 
  FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario);

ALTER TABLE SUBCATEGORIAS 
  ADD CONSTRAINT FK_SUB_CAT 
  FOREIGN KEY (id_categoria) REFERENCES CATEGORIAS(id_categoria);

ALTER TABLE PRESUPUESTO_DETALLE 
  ADD CONSTRAINT FK_DET_SUB 
  FOREIGN KEY (id_subcategoria) REFERENCES SUBCATEGORIAS(id_subcategoria);

ALTER TABLE PRESUPUESTO_DETALLE 
  ADD CONSTRAINT FK_DET_PRES 
  FOREIGN KEY (id_presupuesto) REFERENCES PRESUPUESTOS(id_presupuesto);

ALTER TABLE TRANSACCIONES 
  ADD CONSTRAINT FK_TRANS_SUB 
  FOREIGN KEY (id_subcategoria) REFERENCES SUBCATEGORIAS(id_subcategoria);

ALTER TABLE OBLIGACION_FIJA 
  ADD CONSTRAINT FK_OBLIG_SUB 
  FOREIGN KEY (id_subcategoria) REFERENCES SUBCATEGORIAS(id_subcategoria);

ALTER TABLE META_AHORRO 
  ADD CONSTRAINT FK_META_SUB 
  FOREIGN KEY (id_subcategoria) REFERENCES SUBCATEGORIAS(id_subcategoria);

ALTER TABLE TRANSACCIONES 
  ADD CONSTRAINT FK_TRANS_OBLIG 
  FOREIGN KEY (id_obligacion) REFERENCES OBLIGACION_FIJA(id_obligacion);

ALTER TABLE TRANSACCIONES 
  ADD CONSTRAINT FK_TRANS_PRES 
  FOREIGN KEY (id_presupuesto) REFERENCES PRESUPUESTOS(id_presupuesto);