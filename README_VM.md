# LATENTUM – Production VM Runbook

Este documento describe cómo está desplegado LATENTUM en producción y cómo operarlo de forma segura.

---

## 1. Infraestructura

- Proveedor: OVH
- VM: latentum-prod-01
- OS: Ubuntu
- Dominio API: https://api.latentum.app
- Reverse proxy: Nginx
- Runtime: Docker + Docker Compose
- Base de datos: PostgreSQL (contenedor local)

---

## 2. Estructura en la VM

Todo vive bajo:

/opt/latentum
├── app/                 # docker-compose.yml
├── db/                  # init.sql
├── scripts/             # auto_deploy.sh, health_check.sh, backups
├── logs/                # health.log, auto_deploy.log (rotados)
├── backups/             # dumps PostgreSQL
├── .env                 # variables de entorno (NO en git)
└── .state/              # estado watchdog (cooldowns)

---

## 3. Servicios activos

### Contenedores

docker ps

Esperado:
- latentum-api → healthy
- latentum-db → healthy

### Nginx

systemctl status nginx

### Health endpoint

curl -I https://api.latentum.app/health

Debe devolver HTTP/1.1 200 OK.

---

## 4. Arranque / Parada

Desde /opt/latentum/app:

docker compose up -d
docker compose down

---

## 5. Despliegue automático

- La imagen se construye en GitHub Actions
- Se publica en GHCR: ghcr.io/vekkris76/latentum-api:latest
- En la VM, un job periódico ejecuta:

/opt/latentum/scripts/auto_deploy.sh

Este script:
- hace docker pull
- recrea el contenedor API solo si hay cambios
- valida /health

Logs:

tail -n 100 /opt/latentum/logs/auto_deploy.log

---

## 6. Watchdog / Alertas

Script:

/opt/latentum/scripts/health_check.sh

Comprueba:
- nginx activo
- docker activo
- postgres healthy
- /health accesible
- espacio en disco

Frecuencia:
- cada 5 minutos (cron)

Logs:

tail -n 100 /opt/latentum/logs/health.log

Alertas por email:
- alerts@latentum.app
- con cooldown anti-spam (30 min)

---

## 7. Incidencias comunes

### API no responde

1) Ver contenedores:
docker ps

2) Logs API:
docker logs --tail 200 latentum-api

3) Probar health directo contra el contenedor:
curl -i http://127.0.0.1:3000/health

4) Logs del watchdog:
tail -n 200 /opt/latentum/logs/health.log

### Base de datos KO

docker logs --tail 200 latentum-db
docker inspect latentum-db --format '{{json .State.Health}}'

### Certificado TLS

sudo certbot renew --dry-run

---

## 8. Seguridad

- Firewall: UFW activo (22, 80, 443)
- Fail2ban: sshd + nginx
- Logs rotados (logrotate)
- Sin puertos Docker expuestos públicamente
- DB solo accesible desde localhost / red Docker

---

## 9. NO HACER

- No editar .env desde Git
- No exponer PostgreSQL a Internet
- No ejecutar "docker system prune -a" sin revisar impacto
