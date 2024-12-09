#!/bin/bash

echo "Waiting for Elasticsearch to be ready..."
while true; do
    if curl -s elasticsearch:9200 >/dev/null; then
        break
    fi
    sleep 5
done

echo "Setting up kibana_system user..."
echo "${ELASTIC_PASSWORD} ${KIBANA_PASSWORD}"
curl -X POST -u elastic:${ELASTIC_PASSWORD} "elasticsearch:9200/_security/user/kibana_system/_password" -H "Content-Type: application/json" -d"
{
  \"password\": \"${KIBANA_PASSWORD}\"
}"