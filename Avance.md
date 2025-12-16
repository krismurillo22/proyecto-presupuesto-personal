# Avance del Proyecto – Sistema de Presupuesto Personal

- **Tipo de proyecto:** Backend / API REST / Base de Datos  
- **Tecnologías:** Node.js, Express, IBM DB2, Postman, React, Figma  
- **Autores:** Kristian Avril Murillo y Victoria Anahi Murillo  
- **Fecha:** 15 de diciembre de 2025  

---

## 1. Descripción General del Proyecto

El presente proyecto corresponde al desarrollo de un **Sistema de Presupuesto Personal**, cuyo objetivo principal es permitir a los usuarios organizar, controlar y analizar sus finanzas mensuales de manera estructurada y segura.

El sistema permite la administración de:
- Presupuestos mensuales
- Categorías y subcategorías financieras
- Transacciones de ingresos y gastos
- Obligaciones fijas
- Metas de ahorro

La arquitectura del sistema se basa en un enfoque **backend–base de datos**, donde la lógica de negocio se encuentra centralizada en **procedimientos almacenados dentro de la base de datos IBM DB2**, garantizando consistencia, validaciones y control de reglas financieras.

El backend, desarrollado con **Node.js y Express**, actúa como una **API REST** que expone los servicios necesarios para interactuar con el sistema, los cuales son consumidos tanto desde **Postman** como desde un **frontend desarrollado en React**, cuyo diseño inicial fue realizado en **Figma**.

---

## 2. Arquitectura del Sistema

El sistema está compuesto por tres capas principales:

### 2.1 Capa de Base de Datos
- Motor de base de datos: **IBM DB2**
- Uso de:
  - Tablas normalizadas
  - Llaves primarias y foráneas
  - Procedimientos almacenados
  - Funciones y triggers
- La lógica de negocio principal se ejecuta en la base de datos para:
  - Registrar transacciones
  - Validar presupuestos activos
  - Calcular montos ejecutados
  - Calcular balances y porcentajes de ejecución

### 2.2 Capa Backend (API REST)
- Desarrollada con **Node.js y Express**
- Encargada de:
  - Recibir solicitudes HTTP
  - Validar datos de entrada
  - Ejecutar procedimientos almacenados
  - Retornar respuestas en formato JSON

### 2.3 Capa Frontend
- Desarrollada con **React**
- Permite:
  - Visualización de presupuestos y transacciones
  - Interacción con la API
  - Gestión básica del sistema desde una interfaz gráfica
- Diseño previo realizado en **Figma** para definir la experiencia de usuario

---

## 3. Funcionalidades Completadas

### 3.1 Gestión del Backend y Base de Datos
- Configuración completa del servidor backend con **Node.js y Express**
- Conexión estable y funcional a la base de datos **IBM DB2**
- Creación del esquema de base de datos con tablas relacionadas
- Implementación de procedimientos almacenados para encapsular la lógica del negocio

### 3.2 Gestión de Usuarios
- Creación de usuarios
- Consulta de usuarios
- Actualización de información
- Inactivación lógica de usuarios

### 3.3 Gestión de Presupuestos
- Creación de presupuestos por usuario
- Definición de período (año y mes)
- Cierre de presupuestos
- Asociación de presupuestos con subcategorías

### 3.4 Categorías y Subcategorías
- Creación y administración de categorías
- Creación de subcategorías asociadas
- Clasificación de ingresos y gastos

### 3.5 Presupuesto Detallado
- Asignación de montos por subcategoría
- Control del presupuesto mensual por categoría

### 3.6 Transacciones
- Registro de transacciones de ingreso y gasto
- Modificación y eliminación de transacciones
- Validaciones de presupuesto activo
- Registro mediante procedimientos almacenados

### 3.7 Obligaciones Fijas
- Registro de gastos recurrentes mensuales
- Asociación a categorías

### 3.8 Metas de Ahorro
- Creación de metas de ahorro
- Definición de monto objetivo y fechas
- Registro de abonos manuales

### 3.9 Pruebas del Sistema
- Pruebas completas de todos los endpoints utilizando **Postman**
- Validación de respuestas JSON
- Verificación de reglas de negocio y errores controlados

---

## 4. Funcionalidades Parcialmente Completadas

- Validaciones adicionales de datos en backend (solo validaciones básicas)
- Manejo general de errores HTTP
- Endpoints de consulta financiera, como:
  - Balance mensual
  - Gastos por categoría
  - Monto ejecutado por subcategoría
  - Porcentaje de ejecución del presupuesto

Estas funcionalidades están implementadas a nivel de consultas SQL y procedimientos, pero no cuentan con visualización gráfica en el frontend.

---

## 5. Funcionalidades Fuera del Alcance del Proyecto

- Dashboards y reportes visuales
- Integración con **Metabase**
- Sistema de roles y permisos
- Autenticación avanzada mediante **JWT**
- Pruebas automatizadas
- Documentación automática de la API (Swagger / OpenAPI)

---

## 6. Porcentaje de Avance del Proyecto

Considerando que todas las funcionalidades principales del sistema están implementadas y operativas, se estima que el proyecto se encuentra completado en aproximadamente un **80%**.

---

## 7. Funcionamiento del Sistema

El sistema funciona correctamente en un entorno local.

Al iniciar el servidor:
- La **API REST** queda disponible para recibir solicitudes HTTP.
- Los endpoints ejecutan procedimientos almacenados en **IBM DB2**.
- Las respuestas se envían en formato **JSON**.
- El frontend en React consume estos servicios para permitir la interacción del usuario con el sistema.

---

## 8. Instalación y Ejecución del Proyecto

### 8.1 Requisitos Previos
- Node.js (versión 16 o superior)
- IBM DB2 (instalado localmente o en contenedor)
- Gestor de paquetes npm
- Postman (para pruebas)
- Navegador web moderno

### 8.2 Instalación del Backend
1. Clonar el repositorio del proyecto.
2. Acceder a la carpeta del backend.
3. Instalar dependencias:
   **npm install**
4. Configurar las credenciales de conexión a DB2.
5. Ejecutar el servidor:
    **npm start**

### 8.3 Configuración de la Base de Datos
- Crear la base de datos en IBM DB2.
- Ejecutar los scripts de:
    - Creación de tablas
    - Procedimientos almacenados
    - Funciones y triggers
- Verificar la conexión desde el backend.

### 8.4 Ejecución del Frontend
1. Acceder a la carpeta del frontend.
2. Instalar dependencias:
    **npm install**
3. Ejecutar la aplicación:
    **npm run dev**

---

## 9. Herramientas Utilizadas
- **Node.js**: Desarrollo del backend
- **Express**: Framework para la API REST
- **IBM DB2**: Base de datos relacional
- **Postman**: Pruebas de endpoints
- **React**: Desarrollo del frontend
- **Figma**: Diseño de interfaces
- **Git**: Control de versiones

---

## 10. Conocimientos Adquiridos
- Desarrollo y estructuración de APIs REST
- Uso de procedimientos almacenados como lógica de negocio
- Conexión entre backend y IBM DB2
- Consumo de APIs desde el frontend
- Pruebas funcionales con Postman
- Organización de proyectos backend de forma modular

---

## 11. Documentación del Proyecto

El proyecto cuenta con documentación adicional que complementa el funcionamiento del sistema y facilita su uso y comprensión.  
Dicha documentación se encuentra organizada dentro del repositorio en la carpeta raíz del proyecto y en el directorio `docs`.

### 11.1 Manual de la API
- **Archivo:** `manual api.pdf`
- **Descripción:**  
  Contiene la documentación de los endpoints desarrollados en la API REST, incluyendo:
  - Rutas disponibles
  - Métodos HTTP
  - Parámetros de entrada
  - Ejemplos de solicitudes y respuestas
  - Manejo de errores

### 11.2 Manual de Usuario
- **Archivo:** `Manual de Usuario - Proyecto.pdf`
- **Descripción:**  
  Describe el uso del sistema desde el punto de vista del usuario final, explicando:
  - Funcionalidades principales
  - Flujo de uso del sistema
  - Pantallas del frontend

### 11.3 Documentación Técnica
- **Ubicación:** Carpeta `docs/`
- **Archivos incluidos:**
  - `ERD.png` – Diagrama Entidad-Relación
  - `ModeloRelacional.pdf` – Modelo relacional del sistema
  - `DiccionarioDatos.xlsx` – Diccionario de datos
  - Presentaciones de avance del proyecto

Toda esta documentación forma parte del repositorio y respalda el diseño, desarrollo y funcionamiento del sistema.
