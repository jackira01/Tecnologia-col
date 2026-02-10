# Guía de Deployment en Dokploy

Esta guía te ayudará a desplegar el backend de Tecnologia-col en Dokploy.

## Prerrequisitos

- Cuenta en Dokploy
- Repositorio Git con el código
- Base de datos MongoDB (puedes usar MongoDB Atlas o desplegar MongoDB en Dokploy)

## Paso 1: Preparar MongoDB

### Opción A: MongoDB Atlas (Recomendado)
1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Configura el acceso de red (permite todas las IPs: `0.0.0.0/0`)
4. Crea un usuario de base de datos
5. Obtén tu connection string (formato: `mongodb+srv://username:password@cluster.mongodb.net/database`)

### Opción B: MongoDB en Dokploy
1. En Dokploy, crea un nuevo servicio de MongoDB
2. Anota las credenciales y el host interno
3. Usa el connection string interno de Dokploy

## Paso 2: Configurar el Proyecto en Dokploy

### 2.1 Crear Nueva Aplicación
1. Inicia sesión en Dokploy
2. Crea un nuevo proyecto o selecciona uno existente
3. Haz clic en "New Application"
4. Selecciona "Docker" como tipo de aplicación

### 2.2 Configurar el Repositorio
1. Conecta tu repositorio Git
2. Selecciona la rama (ej: `main` o `master`)
3. Establece el **Build Context**: `/api`
4. Establece el **Dockerfile Path**: `./Dockerfile`

### 2.3 Configurar Variables de Entorno

En la sección de Environment Variables, agrega las siguientes variables:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tecnologia-col

# Server Configuration
PORT=5000

# CORS Configuration (JSON array de dominios permitidos)
ORIGIN_ALLOWED=["https://tu-dominio.com","https://www.tu-dominio.com"]

# Environment
ENVIROMENT=production

# JWT Secret (genera uno seguro)
JWT_SECRET=tu-secreto-jwt-super-seguro-y-aleatorio-aqui
```

> **⚠️ IMPORTANTE**: 
> - Cambia `JWT_SECRET` por una cadena aleatoria y segura
> - Actualiza `ORIGIN_ALLOWED` con tus dominios reales
> - Usa tu connection string real de MongoDB

### 2.4 Configurar el Puerto
1. En la configuración de la aplicación, establece el **Port** en `5000`
2. Dokploy automáticamente expondrá este puerto

### 2.5 Configurar el Dominio (Opcional)
1. En la sección de Domains, agrega tu dominio personalizado
2. Dokploy generará automáticamente un certificado SSL

## Paso 3: Desplegar

1. Haz clic en "Deploy"
2. Dokploy construirá la imagen Docker y desplegará el contenedor
3. Monitorea los logs para verificar que no haya errores

## Paso 4: Verificar el Deployment

### Verificar que la API está funcionando:
```bash
curl https://tu-dominio.com/welcome
```

Deberías recibir:
```json
{
  "message": "Welcome to the API",
  "status": "success"
}
```

## Comandos Útiles

### Build Local (Testing)
```bash
cd api
docker build -t tecnologia-col-api:test .
```

### Run Local con Docker Compose
```bash
cd api
docker-compose up -d
```

### Ver Logs
En Dokploy, ve a la sección "Logs" de tu aplicación para ver los logs en tiempo real.

### Rebuild y Redeploy
Si haces cambios en el código:
1. Haz push a tu repositorio Git
2. En Dokploy, haz clic en "Redeploy"

## Troubleshooting

### Error: "Cannot connect to MongoDB"
- Verifica que `MONGODB_URI` esté correctamente configurado
- Si usas MongoDB Atlas, asegúrate de que la IP `0.0.0.0/0` esté permitida
- Verifica que el usuario y contraseña sean correctos

### Error: "Not allowed by CORS"
- Verifica que `ORIGIN_ALLOWED` contenga el dominio de tu frontend
- Asegúrate de que sea un JSON array válido: `["https://domain.com"]`
- Verifica que `ENVIROMENT=production`

### Error: "Application crashed"
- Revisa los logs en Dokploy
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que el puerto `5000` esté correctamente expuesto

### Health Check Failing
- El health check verifica el endpoint `/welcome`
- Si falla, revisa los logs para ver errores de inicio
- Verifica la conexión a MongoDB

## Configuración Avanzada

### Variables de Entorno Adicionales

Si necesitas agregar más variables (ej: para servicios externos):

```bash
# Ejemplo: Servicios de terceros
STRIPE_SECRET_KEY=sk_live_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

### Escalado

Dokploy permite escalar tu aplicación:
1. Ve a la configuración de la aplicación
2. Ajusta el número de réplicas
3. Configura recursos (CPU/RAM) según necesites

### Monitoreo

Dokploy proporciona:
- Logs en tiempo real
- Métricas de CPU y memoria
- Health checks automáticos
- Alertas (configurable)

## Seguridad

### Mejores Prácticas:
1. ✅ Usa HTTPS (Dokploy lo configura automáticamente)
2. ✅ Mantén `JWT_SECRET` seguro y aleatorio
3. ✅ Configura `ORIGIN_ALLOWED` solo con tus dominios
4. ✅ Usa MongoDB Atlas con autenticación
5. ✅ Mantén las dependencias actualizadas
6. ✅ Revisa los logs regularmente

## Soporte

Si encuentras problemas:
1. Revisa los logs en Dokploy
2. Verifica la [documentación de Dokploy](https://docs.dokploy.com)
3. Revisa este archivo para troubleshooting común
