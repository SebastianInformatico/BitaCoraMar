# Esquema de Base de Datos - BitaCoraMar

## Descripción General
BitaCoraMar es una plataforma integral para la industria mar\u00edtima que soporta pescadores, acuicultores, capitanes y operadores mar\u00edtimos.

## Tablas Principales

### `usuarios`
Perfiles de usuarios del ecosistema mar\u00edtimo.

| Campo | Tipo | Descripci\u00f3n |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria autoincrement |
| `nombre` | TEXT | Nombre del usuario (requerido) |
| `email` | TEXT | Email \u00fanico del usuario (requerido) |
| `password` | TEXT | Contrase\u00f1a (requerido) |
| `sector` | TEXT | Sector: 'pesca', 'acuicultura', 'navegacion' |
| `licencia` | TEXT | N\u00famero de licencia/permiso |
| `ubicacion` | TEXT | Puerto/zona base de operaciones |
| `telefono` | TEXT | Tel\u00e9fono de contacto |
| `pregunta` | TEXT | Pregunta de seguridad (requerido) |
| `respuesta` | TEXT | Respuesta de seguridad (requerido) |
| `fecha_registro` | TEXT | Fecha de registro |
| `activo` | INTEGER | Estado del usuario (0=inactivo, 1=activo) |

### `embarcaciones`
Registro de embarcaciones y equipos.

| Campo | Tipo | Descripci\u00f3n |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria autoincrement |
| `nombre` | TEXT | Nombre de la embarcaci\u00f3n |
| `matricula` | TEXT | Matr\u00edcula \u00fanica |
| `tipo` | TEXT | Tipo: 'lancha', 'bote', 'plataforma', 'balsa' |
| `capacidad` | REAL | Capacidad de carga (toneladas) |
| `eslora` | REAL | Eslora en metros |
| `motor` | TEXT | Especificaciones del motor |
| `usuario_id` | INTEGER | FK hacia usuarios (propietario) |

### `productos`
Cat\u00e1logo de productos mar\u00edtimos.

| Campo | Tipo | Descripci\u00f3n |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria autoincrement |
| `nombre` | TEXT | Nombre del producto |
| `categoria` | TEXT | 'pescado', 'mariscos', 'algas', 'otros' |
| `especie` | TEXT | Especie espec\u00edfica |
| `unidad` | TEXT | Unidad de medida (kg, ton, unidades) |
| `sector` | TEXT | Sector que lo produce |

### `capturas_pesca`
Registros de actividad pesquera.

| Campo | Tipo | Descripci\u00f3n |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria autoincrement |
| `embarcacion_id` | INTEGER | FK hacia embarcaciones |
| `producto_id` | INTEGER | FK hacia productos |
| `cantidad` | REAL | Cantidad capturada |
| `zona_pesca` | TEXT | Zona de captura |
| `coordenadas` | TEXT | Coordenadas GPS |
| `fecha_salida` | TEXT | Fecha/hora de salida |
| `fecha_regreso` | TEXT | Fecha/hora de regreso |
| `tripulacion` | TEXT | Miembros de la tripulaci\u00f3n |
| `metodo_pesca` | TEXT | M\u00e9todo utilizado |
| `temperatura_agua` | REAL | Temperatura del agua |
| `usuario_id` | INTEGER | FK hacia usuarios |

### `produccion_acuicultura`  
Registros de acuicultura (salmones, choritos, ostras, algas).

| Campo | Tipo | Descripci\u00f3n |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria autoincrement |
| `producto_id` | INTEGER | FK hacia productos |
| `centro_cultivo` | TEXT | Nombre del centro de cultivo |
| `coordenadas` | TEXT | Coordenadas del centro |
| `cantidad_sembrada` | REAL | Cantidad sembrada |
| `fecha_siembra` | TEXT | Fecha de siembra |
| `fecha_cosecha_estimada` | TEXT | Fecha estimada de cosecha |
| `fecha_cosecha_real` | TEXT | Fecha real de cosecha |
| `cantidad_cosechada` | REAL | Cantidad cosechada |
| `mortalidad` | REAL | Porcentaje de mortalidad |
| `observaciones` | TEXT | Observaciones del ciclo |
| `usuario_id` | INTEGER | FK hacia usuarios |

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

### `navegacion`
Bitácoras de navegación.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria autoincrement |
| `embarcacion_id` | INTEGER | FK hacia embarcaciones |
| `puerto_origen` | TEXT | Puerto de origen |
| `puerto_destino` | TEXT | Puerto de destino |
| `fecha_salida` | TEXT | Fecha/hora de salida |
| `fecha_llegada` | TEXT | Fecha/hora de llegada |
| `distancia_nm` | REAL | Distancia en millas náuticas |
| `combustible_usado` | REAL | Litros de combustible |
| `carga` | TEXT | Descripción de la carga |
| `tripulacion` | TEXT | Lista de tripulantes |
| `condiciones_clima` | TEXT | Condiciones climáticas |
| `incidentes` | TEXT | Incidentes reportados |
| `usuario_id` | INTEGER | FK hacia usuarios (capitán) |

### `marketplace`
Ofertas y demandas de productos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria autoincrement |
| `vendedor_id` | INTEGER | FK hacia usuarios (vendedor) |
| `producto_id` | INTEGER | FK hacia productos |
| `tipo` | TEXT | 'oferta' o 'demanda' |
| `cantidad_disponible` | REAL | Cantidad disponible |
| `precio_unitario` | REAL | Precio por unidad |
| `calidad` | TEXT | Grado de calidad |
| `fecha_disponible` | TEXT | Cuándo está disponible |
| `ubicacion` | TEXT | Dónde retirar |
| `activa` | INTEGER | Estado de la oferta (0=inactiva, 1=activa) |
| `fecha_publicacion` | TEXT | Cuándo se publicó |

### `transacciones`
Compra-venta de productos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | Clave primaria autoincrement |
| `marketplace_id` | INTEGER | FK hacia marketplace |
| `comprador_id` | INTEGER | FK hacia usuarios (comprador) |
| `cantidad` | REAL | Cantidad transada |
| `precio_total` | REAL | Precio total acordado |
| `fecha_transaccion` | TEXT | Fecha del acuerdo |
| `fecha_entrega` | TEXT | Fecha de entrega |
| `estado` | TEXT | 'pendiente', 'entregado', 'cancelado' |
| `metodo_pago` | TEXT | Método de pago |
| `calificacion` | INTEGER | Calificación (1-5) |

## Relaciones
- **usuarios** es el centro de la plataforma - todos los sectores se conectan aquí
- **embarcaciones** pertenecen a usuarios y se usan en navegación y capturas  
- **productos** se relacionan con capturas, producción y marketplace
- **marketplace** conecta vendedores con compradores
- **transacciones** completan el ciclo comercial
- **navegacion**, **capturas_pesca**, **produccion_acuicultura** son las bitácoras operativas por sector

## Funcionalidades Innovadoras

### 🔄 Trazabilidad Completa
Del mar al plato - cada producto tiene historial completo desde captura/cosecha hasta venta final.

### 🛒 Marketplace Directo
Pescadores y acuicultores venden directamente sin intermediarios. Compradores encuentran productos frescos.

### 📊 Cumplimiento Regulatorio
Bitácoras digitales automáticas para cumplir con SERNAPESCA y autoridades marítimas.

### 🌊 Datos en Tiempo Real
Integración con datos oceanográficos, meteorológicos y de mercado.

### 👥 Red Colaborativa
Compartir información sobre zonas de pesca, condiciones, precios, y oportunidades de negocio.

### 📱 Siempre Conectados
La app se vuelve esencial porque:
- Es la bitácora oficial digital
- Es el marketplace principal del sector  
- Es la red social profesional marítima
- Es la fuente de datos operativos críticos

## Inicialización
La base de datos se inicializa automáticamente en `src/database/db.js` con el método `initDb()`.