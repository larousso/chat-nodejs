docker stop postgres
docker rm postgres
docker run \
  --detach \
  --name postgres \
  --publish 0.0.0.0:5432:5432 \
  stackbrew/postgres:latest
