# Kargoru API — Sistema de Registro de Envíos de Paquetes

**Prueba Técnica — Kargoru SAS**

## 1. Descripción del proyecto

Este proyecto permite registrar el envío de un paquete entre dos puntos, consultar su estado, actualizarlo a lo largo de su ciclo de vida (pendiente → en tránsito → entregado, o cancelado), y eliminarlo del sistema.

El proyecto está compuesto por dos partes independientes que se comunican entre sí:

- Un **backend** que expone una API REST, encargado de la lógica de negocio y la persistencia de los datos.
- Un **frontend** que consume esa API y ofrece una interfaz visual para interactuar con los envíos sin necesidad de herramientas técnicas como Postman o Swagger.

## 2. Tecnologías utilizadas

| Componente | Tecnología | Propósito |
|---|---|---|
| Backend | Python 3 + FastAPI | Framework para construir la API REST |
| ORM | SQLAlchemy | Mapeo entre objetos de Python y tablas de la base de datos |
| Validación | Pydantic | Validación y serialización de datos de entrada/salida |
| Base de datos | SQLite | Almacenamiento persistente, sin necesidad de servidor externo |
| Servidor | Uvicorn | Servidor ASGI que ejecuta la aplicación FastAPI |
| Frontend | HTML5, CSS3, JavaScript (Vanilla) | Interfaz de usuario, sin frameworks ni dependencias de build |

## 3. Estructura del proyecto

```
apishipments/
├── app/
│   ├── __init__.py
│   ├── main.py              # Punto de entrada: instancia la app, registra rutas y CORS
│   ├── database.py          # Configuración de la conexión y sesión de base de datos
│   ├── models.py            # Definición de la tabla shipments (SQLAlchemy)
│   ├── schemas.py           # Validación de datos de entrada/salida (Pydantic)
│   └── routers/
│       ├── __init__.py
│       └── shipments.py     # Definición de los 5 endpoints de la API
├── frontend/
│   ├── index.html           # Estructura de la interfaz (formulario, listado, detalle)
│   ├── style.css             # Estilos visuales
│   └── script.js             # Lógica de consumo de la API (fetch)
├── requirements.txt         # Dependencias de Python del proyecto
├── .gitignore
└── README.md
```

## 4. Requisitos previos

Antes de instalar el proyecto, verifica tener disponible en tu equipo:

- **Python 3.10 o superior** instalado y accesible desde la terminal.
  Verifica con:
  ```bash
  python --version
  ```
- **pip** (gestor de paquetes de Python, normalmente viene incluido con Python).
- **Git**, para clonar el repositorio.
- Un **navegador web moderno** (Chrome, Firefox, Edge) para el frontend.

No se requiere instalar ningún motor de base de datos por separado: el proyecto usa SQLite, que funciona como un archivo local y no necesita configuración adicional.

## 5. Instalación paso a paso

### 5.1. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd apishipments
```

### 5.2. Crear un entorno virtual

Un entorno virtual aísla las dependencias de este proyecto del resto de tu sistema, evitando conflictos con otras versiones de librerías que puedas tener instaladas.

```bash
python -m venv venv
```

### 5.3. Activar el entorno virtual

**En Windows (PowerShell o CMD):**
```bash
venv\Scripts\activate
```

**En Linux o macOS:**
```bash
source venv/bin/activate
```

Sabrás que el entorno está activo porque el nombre `(venv)` aparecerá al inicio de la línea de tu terminal.

### 5.4. Instalar las dependencias

Con el entorno virtual activo, instala todas las librerías necesarias:

```bash
pip install -r requirements.txt
```

Esto instalará, entre otras: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`.

### 5.5. Ejecutar el backend

Desde la carpeta raíz del proyecto (`apishipments/`, donde está la carpeta `app/`), ejecuta:

```bash
uvicorn app.main:app --reload
```

Si todo está correctamente configurado, verás en la terminal un mensaje similar a:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

En este punto, el servidor ya está corriendo y disponible en `http://127.0.0.1:8000`. Además, se generará automáticamente un archivo `kargoru.db` en la raíz del proyecto — esa es la base de datos SQLite, creada la primera vez que se levanta la aplicación.

> El flag `--reload` reinicia el servidor automáticamente cada vez que se detecta un cambio en el código, útil durante el desarrollo.

### 5.6. Verificar que el backend funciona

Abre en tu navegador:
```
http://127.0.0.1:8000
```
Deberías ver una respuesta JSON: `{"status":"ok","service":"Kargoru API"}`.

Para acceder a la documentación interactiva de la API (generada automáticamente por FastAPI):
```
http://127.0.0.1:8000/docs
```
Desde ahí puedes probar cada uno de los endpoints directamente, sin necesidad de herramientas externas.

### 5.7. Ejecutar el frontend

Con el backend corriendo, abre el archivo `frontend/index.html` directamente en tu navegador (doble clic sobre el archivo, o arrastrándolo a una pestaña nueva).

> **Importante:** el backend debe estar corriendo antes de abrir el frontend, ya que este último realiza peticiones HTTP hacia `http://127.0.0.1:8000` para funcionar.

## 6. Variables de entorno

Este proyecto no requiere configuración de variables de entorno para funcionar en modo local. La conexión a la base de datos está definida directamente en `app/database.py` apuntando a un archivo SQLite (`kargoru.db`), que se crea automáticamente si no existe.

Si en el futuro se desea migrar a otro motor de base de datos (PostgreSQL o MySQL), bastaría con ajustar la variable `DATABASE_URL` en ese mismo archivo.

## 7. Documentación de la API

### 7.1. Endpoints disponibles

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/shipments` | Registra un nuevo envío. El estado inicial siempre es `pendiente`. |
| `GET` | `/shipments` | Lista todos los envíos registrados. |
| `GET` | `/shipments/{id}` | Consulta el detalle de un envío específico por su ID. |
| `PATCH` | `/shipments/{id}` | Actualiza parcialmente los datos de un envío (incluyendo su estado). |
| `DELETE` | `/shipments/{id}` | Elimina un envío del sistema. |

### 7.2. Modelo de datos

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | UUID (string) | Generado automáticamente | Identificador único del envío |
| `origen` | string | Sí | Ciudad o dirección de origen |
| `destino` | string | Sí | Ciudad o dirección de destino |
| `remitente` | string | Sí | Nombre de quien envía el paquete |
| `destinatario` | string | Sí | Nombre de quien recibe el paquete |
| `peso_kg` | number | Sí | Peso del paquete en kilogramos (debe ser mayor a 0) |
| `descripcion` | string | No | Detalle adicional del contenido del paquete |
| `estado` | enum | Generado automáticamente | `pendiente`, `en_transito`, `entregado` o `cancelado` |
| `fecha_creacion` | datetime | Generado automáticamente | Fecha y hora de registro del envío |
| `fecha_actualizacion` | datetime | Generado automáticamente | Fecha y hora de la última modificación |

### 7.3. Ejemplo de solicitud — Registrar un envío

```json
POST /shipments
Content-Type: application/json

{
    "origen": "Bogotá",
    "destino": "Medellín",
    "remitente": "Juan Pablo",
    "destinatario": "Juanita Gómez",
    "peso_kg": 10.3,
    "descripcion": "Delicado"
}
```

### 7.4. Ejemplo de solicitud — Actualizar estado

```json
PATCH /shipments/{id}
Content-Type: application/json

{
    "estado": "en_transito"
}
```

## 8. Funcionalidades del frontend

| Sección | Descripción |
|---|---|
| Registrar envío | Formulario que envía los datos a `POST /shipments` |
| Ver envíos | Tabla con todos los envíos registrados, consumiendo `GET /shipments` |
| Buscar por ID | Campo de búsqueda que consulta directamente `GET /shipments/{id}` |
| Detalle del envío | Vista con la información completa de un envío específico |
| Actualizar estado | Selector desplegable en el detalle que consume `PATCH /shipments/{id}` |
| Eliminar envío | Acción disponible desde el listado, con confirmación previa del usuario |

La navegación entre secciones ocurre sin recargar la página (patrón de página única), controlada mediante JavaScript.

## 9. Decisiones técnicas

- **FastAPI** fue seleccionado sobre las demás opciones aceptadas por el enunciado (Flask, Spring Boot) debido a su integración nativa con Pydantic para validación de datos, la generación automática de documentación Swagger sin configuración adicional, y su curva de aprendizaje más directa para el alcance de esta prueba.

- **SQLite** se eligió como motor de base de datos por no requerir instalación ni configuración de un servidor externo, permitiendo que cualquier evaluador clone el repositorio y lo ejecute de inmediato sin pasos adicionales de infraestructura.

- **Separación entre modelos y schemas**: los modelos de SQLAlchemy (`models.py`) representan la estructura de la base de datos, mientras que los schemas de Pydantic (`schemas.py`) representan los datos que entran y salen por la API. Esta separación permite, por ejemplo, que el endpoint de actualización (`PATCH`) acepte modificaciones parciales sin exigir todos los campos del envío.

- **Identificadores UUID**: se utilizó `uuid4()` en lugar de un identificador numérico autoincremental, evitando IDs predecibles y facilitando una eventual migración a un sistema distribuido.

- **Frontend sin framework**: dado que el enunciado de la prueba indica explícitamente que no se evalúa diseño gráfico avanzado, se optó por HTML, CSS y JavaScript sin dependencias externas, priorizando una integración clara y directa con la API mediante `fetch()`.

- **Fechas en UTC con conversión en el cliente**: la base de datos almacena las fechas en UTC (estándar para evitar ambigüedades entre zonas horarias); la conversión a la hora local del usuario se realiza en el frontend al momento de mostrar la información.

## 10. Posibles mejoras futuras

- Filtros por estado y fecha en el listado de envíos (mencionados como plus en el enunciado).
- Autenticación de usuarios para restringir el acceso a la API.
- Exportación de la colección de endpoints a Postman.
- Paginación en el listado para manejar grandes volúmenes de envíos.

## 11. Autor

Proyecto desarrollado como parte del proceso de selección de Kargoru SAS.