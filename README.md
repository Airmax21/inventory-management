# Magis

# Prerequisites

1. NodeJS v22
2. Yarn
3. Proxy Server (e.g Nginx)
4. PostgreSQL v14
5. PM2 Process Manager

# Installations

1. Cloning repository dari magis.
2. Install semua dependency.

```bash
yarn install
```

## Dev

### API

1. Copy env.example ke .env.
2. Atur config sesuai kebutuhan.
    
    ```bash
    APP_PORT=3000
    MODE=dev
    
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=postgres
    DB_NAME=inventory
    
    JWT_SECRET=superrahasia_dan_unik
    ```
    

### Web

1. Atur proxy pada vite.config.ts ke arah port API

```jsx
...
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
...
```

## Production

1. Build app.

```bash
yarn build
```

1. Copy env.example & package.json ke dist/api/
2. Pindahkan semua isi folder dist ke server.

### API

1. Install semua dependensi dari API

```bash
# Pastikan active directory di API
yarn install
```

1. Copy env.example ke .env.
2. Atur config sesuai kebutuhan.

```bash
APP_PORT=3000
MODE=prod

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=inventory

JWT_SECRET=superrahasia_dan_unik
```

1. Migrasi semua database.

```bash
yarn migration:run
```

1. Jalankan service API

```bash
pm2 start dist/main.js --name api
pm2 save
```

### Nginx

1. Setup nginx agar mengarah ke API & Web pada file /etc/nginx/sites-enabled/default.

```bash
server {
    listen 80;
    server_name magis.com; #Domain jika punya

    client_max_body_size 100M;
    root /home/test/Services/magis/web; # Path Website
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
       proxy_pass http://127.0.0.1:3000/api; # Arahkan ke API
       proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    }
}
```

1. Test config nginx

```bash
sudo nginx -t
```

1. Reload nginx

```bash
sudo nginx -s reload
```