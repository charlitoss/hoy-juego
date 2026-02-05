# ⚽ Soccer Organizer App

Aplicación para organizar partidos de fútbol con amigos.

## 🚀 Características

### Fase 1 (Actual)
- ✅ Crear partidos con nombre, fecha, horario y ubicación
- ✅ Sistema de inscripción de jugadores
- ✅ Estados físicos (Cansado, Normal, Excelente)
- ✅ Perfiles de jugadores con atributos
- ✅ Barra de progreso de inscripción
- ✅ Persistencia en localStorage

### Fase 2 (Próxima)
- 🔄 Armado visual de equipos en cancha
- 🔄 Asignación a Equipo Oscuro / Equipo Blanco
- 🔄 Drag & drop de jugadores
- 🔄 Sistema de roles (Arquero, Defensor, Medio, Delantero)
- 🔄 Generación automática de equipos balanceados

### Fase 3 (Futura)
- 📋 Sistema de comentarios y feedback
- 🔗 Links compartibles
- 🔔 Notificaciones

## 🛠️ Tecnologías

- React 18
- Vite
- Lucide React (iconos)
- LocalStorage para persistencia

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
soccer-organizer-app/
├── src/
│   ├── components/          # Componentes React
│   │   ├── common/         # Componentes reutilizables
│   │   ├── match/          # Componentes de partido
│   │   └── player/         # Componentes de jugador
│   ├── utils/              # Utilidades y helpers
│   │   ├── storage.js      # LocalStorage management
│   │   └── constants.js    # Constantes de la app
│   ├── styles/             # Estilos CSS
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Punto de entrada
├── public/                 # Archivos estáticos
├── index.html             # HTML principal
├── package.json
└── vite.config.js
```

## 🔄 Git Workflow

```bash
# Ver estado
git status

# Hacer commit
git add .
git commit -m "descripción del cambio"

# Ver historial
git log --oneline

# Volver a una versión anterior
git checkout <commit-hash>

# Crear branch para nueva feature
git checkout -b feature/nombre-feature
```

## 📝 Changelog

### v0.1.0 (Fase 1)
- Configuración inicial del proyecto
- Sistema de creación de partidos
- Sistema de inscripción de jugadores
- Modales de información
- Persistencia de datos

## 🤝 Contribuir

Este es un proyecto personal. Para contribuir:
1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de uso personal.
