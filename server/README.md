# ysg-manager server

## Prepare Development Environment

### Code Style

Use [Google Code Style for Java](https://github.com/google/styleguide/blob/gh-pages/eclipse-java-google-style.xml)

### Install Docker
Install Docker e.g. for Windows: https://hub.docker.com/editions/community/docker-ce-desktop-windows

### Prepare PostgreSQL
Execute the following commands to create the databases:

`docker pull postgres:11.4`

`docker run --name ysg-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ysg-server -d -p 5432:5432 postgres:11.4`

Also see: 
* https://docs.docker.com/samples/library/postgres/
* https://hackernoon.com/dont-install-postgres-docker-pull-postgres-bee20e200198

### Prepare Keycloak
Execute the following commands:

`docker network create keycloak-network`

`docker pull postgres:11.4`

`docker run --name ysg-keycloak-db --net keycloak-network -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=keycloak -d -p 5433:5432 postgres:11.4`

`docker pull jboss/keycloak:6.0.1`

`docker run --name ysg-keycloak --net keycloak-network -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin -e DB_USER=postgres -e DB_PASSWORD=postgres -e DB_ADDR=ysg-keycloak-db -e DB_PORT=5433 -d -p 8081:8080 jboss/keycloak:6.0.1`

also see
* https://hub.docker.com/r/jboss/keycloak

Import realm configuration: Login to Keyclaok admin console (see below), click "Add realm", "Import", select file "ysg-realm-export-DEV-local.json" from folder "keycloak-configuration". Then click "Create".

# Systems Overview

## Local Development
* ysg-server: localhost:8080
* ysg-keycloak: localhost:8081

Predefined users (username / password (role))
* admin / admin (Keycloak administrator)
* ysg-admin / 1234 (YSG_ADMIN)