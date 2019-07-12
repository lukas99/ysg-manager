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

### Prepare PostgreSQL Docker Container
execute the following commands

`docker pull postgres:11.4`

`docker run --rm --name ysg-db -e POSTGRES_USER=ysg -e POSTGRES_PASSWORD=ysg -e POSTGRES_DB=ysg-manager -d -p 5432:5432 postgres:11.4`

also see 
* https://docs.docker.com/samples/library/postgres/
* https://hackernoon.com/dont-install-postgres-docker-pull-postgres-bee20e200198

