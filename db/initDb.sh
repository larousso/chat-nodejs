echo "CREATE ROLE \"alex\" WITH LOGIN ENCRYPTED PASSWORD 'password' CREATEDB;CREATE DATABASE \"chat\" WITH OWNER \"alex\" TEMPLATE template0 ENCODING 'UTF8';GRANT ALL PRIVILEGES ON DATABASE \"chat\" TO \"alex\"; ALTER USER alex WITH SUPERUSER;" | docker run \
  --rm \
  --interactive \
  --link postgres:postgres \
  stackbrew/postgres:latest \
  bash -c 'exec psql -h "$POSTGRES_PORT_5432_TCP_ADDR" -p "$POSTGRES_PORT_5432_TCP_PORT" -U postgres'



