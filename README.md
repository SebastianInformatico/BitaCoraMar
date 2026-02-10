# BitaCoraMar

**Plataforma integral para la industria marítima**

App innovadora que conecta a pescadores, acuicultores, capitanes y toda la gente de mar en una plataforma única para gestión, comercio y cumplimiento regulatorio.

## 🌊 Características Principales

- **Bitácora Digital**: Registros obligatorios para cumplimiento regulatorio
- **Marketplace Marítimo**: Venta directa de productos del mar
- **Trazabilidad Completa**: Del mar al consumidor
- **Red de Colaboración**: Conecta toda la cadena marítima  
- **Datos en Tiempo Real**: Clima, mareas, precios, zonas productivas

## 📱 Sectores Soportados

- **Pesca Artesanal**: Registros de capturas, zonas, especies
- **Acuicultura**: Salmón, choritos, ostras, algas marinas
- **Navegación**: Bitácoras de viaje, tripulación, carga

## 🚀 ¿Por qué es Innovadora?

### Para Pescadores:
- 📋 **Bitácora automática** que cumple con SERNAPESCA
- 💰 **Venta directa** sin intermediarios
- 🎯 **Información colaborativa** de zonas productivas
- 📊 **Trazabilidad exigida** para mercados premium

### Para Acuicultores:
- 🔄 **Monitoreo de ciclos** completos de cultivo
- 🏷️ **Certificaciones** para exportación
- 📈 **Marketplace B2B** con distribuidores
- 🌊 **Datos oceanográficos** para optimización

### Para Capitanes:
- ⚓ **Bitácora digital** reemplaza libros físicos
- ⛽ **Optimización de rutas** y combustible  
- 📦 **Registro de carga** con trazabilidad
- 👥 **Network profesional** marítimo

## 🔬 Tecnología

### Base de Datos Expandida
- Multi-sector: pesca, acuicultura, navegación
- Trazabilidad completa de productos
- Marketplace P2P integrado
- Estadísticas y analytics avanzados

### Módulos Especializados
- `sectores.js` - Operaciones por industria
- `marketplace.js` - Comercio directo  
- `productos.js` - Catálogo y trazabilidad
- `embarcaciones.js` - Gestión de flota

## 🛠️ Instalación

```bash
npm install
```

## 🎮 Uso

```bash
npm run start
```

Luego:
- Android: `npm run android`
- iOS: `npm run ios`  
- Web: `npm run web`

Para limpiar cache:

```bash
npm run start:clear
```

## 📂 Estructura del Proyecto

```
src/
├── database/           # Módulos de base de datos
│   ├── db.js          # Core y configuración
│   ├── usuarios.js    # Gestión multi-sector de usuarios
│   ├── sectores.js    # Pesca, acuicultura, navegación
│   ├── marketplace.js # Comercio P2P
│   ├── productos.js   # Catálogo y trazabilidad
│   ├── embarcaciones.js # Gestión de flota
│   ├── gastos.js      # Control financiero
│   └── ventas.js      # Historial de ventas
├── screens/           # Pantallas de la aplicación
└── services/          # Servicios de soporte

docs/                  # Documentación técnica
├── database.md        # Esquema completo de BD
└── innovaciones.md    # Features técnicas detalladas
```

## 📋 Scripts Útiles

- `npm run doctor` - Valida el entorno de Expo
- `npm run lint` - Validación de código
- `npm run format` - Formateo automático

## 📖 Documentación

- [Esquema de Base de Datos](docs/database.md)
- [Características Innovadoras](docs/innovaciones.md)

---

**BitaCoraMar**: *La app que la gente de mar siempre necesitará usar* 🌊⚓
