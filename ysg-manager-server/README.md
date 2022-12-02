# ysg-manager server

## Prepare Development Environment

### Code Style

Use [Google Code Style for Java](https://github.com/google/styleguide/blob/gh-pages/eclipse-java-google-style.xml)

### Install Docker
Install Docker e.g. for Windows: https://hub.docker.com/editions/community/docker-ce-desktop-windows

### Prepare PostgreSQL
Execute the following commands to create the databases:

`docker pull postgres:14.6`

`docker run --name ysg-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ysg-server -d -p 5432:5432 postgres:14.6`

Also see: 
* https://docs.docker.com/samples/library/postgres/
* https://hackernoon.com/dont-install-postgres-docker-pull-postgres-bee20e200198

### Set Okta Environment Variables
Set the following environment variables for [Okta](www.okta.com) cloud service (see application.properties file):
* ${OKTA_DOMAIN}
* ${OKTA_CLIENT_ID}
* ${OKTA_CLIENT_SECRET}

E.g. in IntelliJ: Edit Run Configurations -> Spring Boot Application -> Environment variables.

# Systems Overview

## Local Development
* ysg-server: localhost:8080
* Okta cloud service for identity and access management
