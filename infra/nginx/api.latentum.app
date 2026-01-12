server {
  listen 80;
  server_name api.latentum.app;

  # Certbot gestionará el redirect/ACME. Mantener simple.
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name api.latentum.app;

  # Certbot ya habrá creado estos paths; si no existen, certbot los añadirá
  ssl_certificate     /etc/letsencrypt/live/api.latentum.app/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.latentum.app/privkey.pem;

  # Seguridad básica (sin inventar nada raro)
  add_header X-Content-Type-Options nosniff always;
  add_header X-Frame-Options DENY always;
  add_header Referrer-Policy no-referrer always;

  # Healthcheck (sin pasar al backend)
  location = /health {
    return 200 "ok\n";
    add_header Content-Type text/plain;
  }

  # Reverse proxy a Fastify (docker publicará 127.0.0.1:3000)
  location / {
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_connect_timeout 5s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;

    client_max_body_size 32k;

    proxy_pass http://127.0.0.1:3000;
  }
}
