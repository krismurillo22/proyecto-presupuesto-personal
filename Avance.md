# Avance del Proyecto – Sistema de Presupuesto Personal

- **Tipo de proyecto:** Backend / API REST / Base de Datos / Frontend  
- **Tecnologías utilizadas:** Node.js, Express, IBM DB2, Postman, React, Figma  
- **De:** Kristian Avril Murillo y Victoria Anahi Murillo 
- **Fecha:** 15 de diciembre del 2025  

---

## Descripción General del Proyecto

El proyecto consiste en el desarrollo de un **sistema de presupuesto personal** que permite a los usuarios planificar y controlar sus finanzas mensuales mediante presupuestos, categorías, transacciones, obligaciones fijas y metas de ahorro.

El sistema está construido bajo una arquitectura **backend–base de datos**, donde la lógica de negocio principal se encuentra implementada mediante **procedimientos almacenados en la base de datos IBM DB2**, y es consumida a través de una **API REST desarrollada con Node.js y Express**, la cual se conecta a un frontend en React.

Este documento describe el **avance final del proyecto**, indicando las funcionalidades implementadas y aquellas que no forman parte del alcance actual.

---

## Funcionalidades Completadas

- Creación y configuración del servidor backend utilizando **Node.js y Express**.
- Conexión correcta y estable a la base de datos **IBM DB2**.
- Implementación completa de **endpoints REST** para el manejo del sistema.
- Gestión de **usuarios** (crear, consultar, actualizar e inactivar).
- Gestión de **presupuestos** por usuario, incluyendo cierre de presupuestos.
- Gestión de **categorías y subcategorías** para la organización del dinero.
- Asignación de montos mediante **presupuesto detallado por subcategoría**.
- Registro, modificación y eliminación de **transacciones** de gasto y ahorro.
- Manejo de **obligaciones fijas** (gastos recurrentes mensuales).
- Creación y administración de **metas de ahorro**, incluyendo abonos manuales.
- Implementación de **procedimientos almacenados** para encapsular la lógica de negocio.
- Pruebas funcionales de todos los endpoints utilizando **Postman**.

---

## Funcionalidades Parcialmente Completadas

- Validaciones de datos a nivel de backend (validaciones básicas implementadas).
- Manejo de errores generales en los endpoints.
- Endpoints de consulta para cálculos financieros como:
  - Balance mensual
  - Gastos por categoría
  - Monto ejecutado por subcategoría
  - Porcentaje de ejecución del presupuesto

Estas funcionalidades están implementadas a nivel de lógica y consultas SQL, pero no cuentan con visualización gráfica.

---

## Funcionalidades No Completadas

- Módulo de **reportes visuales** (dashboards o gráficos).
- Uso de Metabase.
- Sistema de **roles y permisos**.
- Autenticación avanzada mediante **JWT**.
- Pruebas automatizadas.
- Documentación automática de la API (Swagger u OpenAPI).

---

## Porcentaje de Avance

Se estima que el proyecto se encuentra completado en aproximadamente un **80%**, considerando que la mayor parte de la funcionalidad principal del sistema está implementada y es completamente operativa.

---

## Funcionamiento del Proyecto

El proyecto se ejecuta correctamente en un entorno local.  
Al iniciar el servidor, la **API REST** queda disponible para recibir solicitudes HTTP desde herramientas como Postman o desde el frontend en React.

Cada endpoint procesa las solicitudes, ejecuta la lógica correspondiente mediante procedimientos almacenados y responde en formato **JSON**, permitiendo la interacción completa con la base de datos y el control del presupuesto personal del usuario.

---

## Conocimientos Adquiridos

- Desarrollo de **APIs REST** con Node.js y Express.
- Uso de **procedimientos almacenados** como lógica de negocio.
- Conexión y manejo de una base de datos **IBM DB2**.
- Diseño y consumo de endpoints desde el frontend.
- Pruebas de servicios con **Postman**.
- Organización de un proyecto backend de forma modular.
