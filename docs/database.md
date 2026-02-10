# Esquema de Base de Datos - BitaCoraMar

## Descripción General
BitaCoraMar utiliza SQLite como base de datos local para almacenar información de usuarios, registros de cultivo, gastos y ventas.

## Tablas

### `usuarios`
Almacena información de los usuarios del sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria autoincrement |
| `nombre` | TEXT | Nombre del usuario (requerido) |
| `email` | TEXT | Email único del usuario (requerido) |
| `password` | TEXT | Contraseña (requerido) |
| `pregunta` | TEXT | Pregunta de seguridad (requerido) |
| `respuesta` | TEXT | Respuesta de seguridad (requerido) |

### `registros`
Registros de cultivo y producción.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria autoincrement |
| `proveedor` | TEXT | Nombre del proveedor (requerido) |
| `kilos` | REAL | Cantidad en kilos (requerido) |
| `calibre` | TEXT | Calibre del producto (requerido) |
| `fecha_siembra` | TEXT | Fecha de siembra (requerido) |
| `fecha_listo` | TEXT | Fecha listo para cosecha (requerido) |
| `proceso` | TEXT | Tipo de proceso (requerido) |
| `linea_sector` | TEXT | Línea o sector (requerido) |
| `observacion` | TEXT | Observaciones adicionales (opcional) |
| `usuario_id` | INTEGER | FK hacia usuarios (requerido) |

### `gastos`
Registro de gastos del negocio.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria autoincrement |
| `categoria` | TEXT | Categoría del gasto (requerido) |
| `monto` | REAL | Monto del gasto (requerido) |
| `fecha` | TEXT | Fecha del gasto (requerido) |
| `nota` | TEXT | Nota adicional (opcional) |
| `usuario_id` | INTEGER | FK hacia usuarios (requerido) |

### `ventas`
Registro de ventas realizadas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria autoincrement |
| `comprador` | TEXT | Nombre del comprador (requerido) |
| `kilos` | REAL | Cantidad vendida en kilos (requerido) |
| `precio_kilo` | REAL | Precio por kilo (requerido) |
| `total` | REAL | Total de la venta (requerido) |
| `pagado` | INTEGER | Estado de pago (0=no, 1=sí) (requerido) |
| `fecha` | TEXT | Fecha de la venta (requerido) |  
| `usuario_id` | INTEGER | FK hacia usuarios (requerido) |

## Relaciones
- Todas las tablas principales tienen relación con `usuarios` a través de `usuario_id`
- Un usuario puede tener múltiples registros, gastos y ventas
- Eliminación en cascada no implementada - manejar en aplicación

## Inicialización
La base de datos se inicializa automáticamente en `src/database/db.js` con el método `initDb()`.