#!/bin/bash

CONF_FILE="/var/lib/postgresql/data/postgresql.conf"

until [ -f "$CONF_FILE" ]; do
    sleep 1
done

sed -i "s|#logging_collector = off|logging_collector = on|" "$CONF_FILE"
sed -i "s|#log_directory = 'log'|log_directory = '/var/log/postgresql'|" "$CONF_FILE"
sed -i "s|#log_filename = 'postgresql.log'|log_filename = 'postgresql.log'|" "$CONF_FILE"

mkdir -p /var/log/postgresql
chmod 777 /var/log/postgresql

exec docekr-entrypoint.sh "$@"
