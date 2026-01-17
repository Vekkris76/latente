# LATENTUM Production Operations Guide

## Table of Contents

- [Context](#context)  
- [Services](#services)  
- [Docker Compose](#docker-compose)  
- [Nginx and TLS](#nginx-and-tls)  
- [Environment Variables](#environment-variables)  
- [Auto-Deploy](#auto-deploy)  
- [Health Watchdog](#health-watchdog)  
- [Logs and Rotation](#logs-and-rotation)  
- [Firewall and Hardening](#firewall-and-hardening)  
- [Operations](#operations)  
- [Incidents](#incidents)  
- [Next Steps](#next-steps)  

---

## Context

LATENTUM is a modern AI-powered platform designed for scalable and secure deployment of latent space models. This document outlines the production operations setup to ensure high availability, security, and maintainability.

---

## Services

LATENTUM consists of the following core services:

- **API Gateway:** Handles incoming requests and routes them to appropriate backend services.
- **Model Server:** Hosts the latent space models and manages inference requests.
- **Database:** Stores user data, model metadata, and operational logs.
- **Cache:** Improves performance by caching frequent requests.
- **Worker Queue:** Processes asynchronous tasks such as model training and batch inference.

---

## Docker Compose

All services are containerized and orchestrated using Docker Compose. The `docker-compose.yml` file defines the following:

- Service definitions with appropriate images, environment variables, volumes, and networks.
- Persistent volumes for database and logs.
- Network configuration enabling service communication.
- Health checks for critical services.

Example snippet:

```yaml
version: '3.8'

services:
  api-gateway:
    image: latentum/api-gateway:latest
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
    depends_on:
      - model-server
      - cache
    networks:
      - latentum-net

  model-server:
    image: latentum/model-server:latest
    environment:
      - MODEL_PATH=/models
    volumes:
      - models-data:/models
    networks:
      - latentum-net

  database:
    image: postgres:13
    environment:
      - POSTGRES_USER=latentum
      - POSTGRES_PASSWORD=securepassword
      - POSTGRES_DB=latentumdb
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - latentum-net

  cache:
    image: redis:6
    networks:
      - latentum-net

volumes:
  models-data:
  db-data:

networks:
  latentum-net:
    driver: bridge
```

---

## Nginx and TLS

Nginx serves as a reverse proxy in front of the API Gateway to handle TLS termination and HTTP/2 support.

- TLS certificates are managed using Let's Encrypt with automatic renewal via Certbot.
- Nginx configuration enforces strong cipher suites and redirects HTTP traffic to HTTPS.
- HTTP/2 is enabled for improved performance.

Example Nginx server block:

```nginx
server {
    listen 80;
    server_name latentum.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name latentum.example.com;

    ssl_certificate /etc/letsencrypt/live/latentum.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/latentum.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://api-gateway:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Environment Variables

Environment variables are used to configure service behavior securely and flexibly.

- Secrets such as database passwords and API keys are stored in `.env` files excluded from version control.
- Variables include:

  - `DATABASE_URL`
  - `REDIS_URL`
  - `API_KEY`
  - `MODEL_PATH`
  - `NODE_ENV=production`

Example `.env` file snippet:

```
DATABASE_URL=postgres://latentum:securepassword@database:5432/latentumdb
REDIS_URL=redis://cache:6379
API_KEY=your-secure-api-key
MODEL_PATH=/models
NODE_ENV=production
```

---

## Auto-Deploy

Continuous deployment is configured to automatically update services on new commits to the main branch.

- A CI/CD pipeline builds Docker images and pushes them to a private registry.
- On the production server, a webhook triggers a pull of new images and restarts services using Docker Compose.
- Deployment scripts include health checks post-deployment.

---

## Health Watchdog

A health watchdog monitors the status of all services.

- Periodic health checks are performed via HTTP endpoints or container health status.
- Alerts are sent to the operations team via email or messaging platforms on failures.
- Automatic restarts of failed containers are configured in the Docker Compose file.

Example health check configuration in `docker-compose.yml`:

```yaml
healthcheck:
  test: ["CMD-SHELL", "curl -f http://localhost/health || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 3
```

---

## Logs and Rotation

Logs are collected and rotated to prevent disk exhaustion.

- Docker logging drivers are configured to limit log size and number of files.
- Centralized logging via ELK stack or similar solutions is recommended for large deployments.
- Log files are stored on persistent volumes and rotated daily.

Example Docker logging configuration:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "5"
```

---

## Firewall and Hardening

Security hardening includes:

- UFW firewall configured to allow only necessary ports (80, 443, and SSH).
- Fail2ban installed to prevent brute force attacks.
- SSH hardened with key-based authentication and disabled password login.
- Regular system updates and patches applied.

Example UFW rules:

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## Operations

Routine operations include:

- Monitoring resource usage and scaling services as needed.
- Backing up databases and model data regularly.
- Reviewing logs and alerts daily.
- Applying security patches promptly.
- Managing user access and credentials.

---

## Incidents

In case of incidents:

- Follow the incident response plan to identify, contain, and mitigate issues.
- Use health watchdog alerts and logs to diagnose problems.
- Communicate status updates to stakeholders.
- Document incidents and corrective actions for future reference.

---

## Next Steps

- Implement centralized monitoring and alerting with Prometheus and Grafana.
- Automate backup verification and disaster recovery drills.
- Enhance security with vulnerability scanning and penetration testing.
- Optimize auto-scaling policies based on workload patterns.
- Expand documentation and training for operations staff.

---

*End of LATENTUM Production Operations Guide*
