#!/bin/sh
# Initialize pgAdmin with pre-configured server connections

echo "root:password" > /var/lib/pgadmin/.pgpass
chmod 600 /var/lib/pgadmin/.pgpass

if [ -f /servers.json ]; then
  cp /servers.json /var/lib/pgadmin/servers.json
  echo "pgAdmin servers.json imported successfully"
fi
