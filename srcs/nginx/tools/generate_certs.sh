#!/bin/sh

CERT_DIR="/etc/nginx/certs"
CERT_KEY="$CERT_DIR/nginx.key"
CERT_CRT="$CERT_DIR/nginx.crt"
NGX_CONF="/etc/nginx/nginx.conf"
LOAD_MODULE="load_module /usr/lib/nginx/modules/ngx_http_modsecurity_module.so;"

mkdir -p "$CERT_DIR"

if [ ! -f "$CERT_KEY" ] || [ ! -f "$CERT_CRT" ]; then
    echo "Generating the SSL certificates..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout $CERT_KEY -out $CERT_CRT \
        -subj "/CN=localhost"
    echo "Certificates generated at $CERT_DIR"
else
    echo "SSL certificates already exist."
fi

if ! grep -q "$LOAD_MODULE" "$NGX_CONF"; then
    sed -i "1s|^|$LOAD_MODULE\n\n|" "$NGX_CONF"
    echo "Injecting [load_module] directive to $NGX_CONF"
else
    echo "load_module directive already present in  [$NGX_CONF]"
fi

exec nginx -g "daemon off;"
