# ysg-manager
Young Star Games Management System.

Look at the [software architecture documentation](./documentation/architecture.md).

Hint: [Markdown cheat sheet]().

# ysg-manager server

## Prepare Development Environment

### Code Style

Use [Google Code Style for Java](https://github.com/google/styleguide/blob/gh-pages/eclipse-java-google-style.xml)

### Install Docker
Install Docker e.g. for Windows: https://hub.docker.com/editions/community/docker-ce-desktop-windows

### Prepare PostgreSQL
execute the following commands

`docker pull postgres:11.4`

`docker run --name ysg-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ysg-server -d -p 5432:5432 postgres:11.4`

also see 
* https://docs.docker.com/samples/library/postgres/
* https://hackernoon.com/dont-install-postgres-docker-pull-postgres-bee20e200198

### Prepare Keycloak
execute the following commands

`docker network create keycloak-network`

`docker pull postgres:11.4`

`docker run --name ysg-keycloak-db --net keycloak-network -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=keycloak -d -p 5433:5432 postgres:11.4`

`docker pull jboss/keycloak:6.0.1`

`docker run --name ysg-keycloak --net keycloak-network -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin -e DB_USER=postgres -e DB_PASSWORD=postgres -e DB_ADDR=ysg-keycloak-db -e DB_PORT=5433 -d -p 8081:8080 jboss/keycloak:6.0.1`