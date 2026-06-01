# Proyecto Mesa de ayuda

## Descripción del proyecto
Aplicación web para la gestión de tickets de soporte técnico.  
Permite registrar, visualizar, actualizar y eliminar solicitudes realizadas por usuarios.  

El sistema incluye un **algoritmo automático de priorización**, que calcula la importancia de cada ticket según impacto, urgencia, categoría y tiempo estimado, permitiendo ordenar la atención de los casos de forma eficiente.

---

## Tecnologías utilizadas

- Node.js  
- Express.js  
- MySQL  
- express-session  
- CORS  
- HTML5 / CSS3 / JavaScript  
- MySQL2  

---

## Instalación

1. Clonar el repositorio:
```bash
git clone <URL_DEL_REPOSITORIO>
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo .env:  
DB_HOST=localhost  
DB_USER=root  
DB_PASSWORD=tu_password  
DB_NAME=miBase  
DB_PORT=3306  

SESSION_SECRET=clave_secreta_demo  

4. Crear la base de datos en MySQL:  
CREATE DATABASE miBase;

---

## Ejecución

Iniciar el servidor:  
node src/app.js

El servidor se ejecuta en:  
http://localhost:3000

---

## Endpoints

Autenticación  
POST /api/auth/login  
POST /api/auth/logout  
GET /api/auth/perfil  

Tickets  
GET /api/tickets  
GET /api/tickets/:id  
POST /api/tickets  
PUT /api/tickets/:id  
DELETE /api/tickets/:id  

---

## Ejemplos de uso

POST /api/tickets
Content-Type: application/json

{  
  "nombreSolicitante": "Juan Pérez",  
  "correo": "juan@correo.com",  
  "categoria": "red",  
  "descripcion": "No hay internet",  
  "impacto": "alto",  
  "urgencia": "alta",  
  "tiempoEstimado": 5,  
  "estado": "pendiente"  
}

Respuesta esperada  
{  
  "ok": true,  
  "mensaje": "Ticket registrado correctamente.",  
  "data": {  
    "id": 1  
  }  
}

---

## Algoritmo de prioridad (resumen)

La prioridad se calcula así:

puntajeTotal = impacto + urgencia + bonusCategoria + bonusTiempo  
Impacto: bajo=1, medio=2, alto=3  
Urgencia: baja=1, media=2, alta=3  
Categoría (red/cuenta): +1  
Tiempo > 4 horas: +1  

Resultado:

1–3 → Baja  
4–5 → Media  
6 → Alta  
7+ → Crítica  

---

## Seguridad (HTTPS y sesiones)

El sistema utiliza express-session, lo que permite autenticación basada en cookies.

Características de seguridad:  
httpOnly  
sameSite  
Sesión almacenada en servidor  
HTTPS  
