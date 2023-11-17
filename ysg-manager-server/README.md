# ysg-manager server

## Prepare Development Environment

### Code Style

Use [Google Code Style for Java](https://github.com/google/styleguide/blob/gh-pages/eclipse-java-google-style.xml)

### Install Docker
Install Docker e.g. for Windows: https://hub.docker.com/editions/community/docker-ce-desktop-windows

### Prepare PostgreSQL
Execute the following commands to create the databases:

```
docker pull postgres:14.6
docker run --name ysg-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ysg-server -d -p 5432:5432 postgres:14.6
```

Also see: 
* https://docs.docker.com/samples/library/postgres/
* https://hackernoon.com/dont-install-postgres-docker-pull-postgres-bee20e200198

### Set Environment Variables
In IntelliJ: Edit Run Configurations -> Spring Boot Application -> Environment variables.

Or when running the container image via Docker:
```
docker run -d --name ysg-server -p 443:443 -e OKTA_CLIENT_ID='<client-id>' -e OKTA_CLIENT_SECRET='<client-secret>' -e OKTA_DOMAIN='<okta-domain>'
```

#### Environment Variables for Okta
Set the following environment variables for [Okta](www.okta.com) cloud service (see file `application.properties`):
* OKTA_DOMAIN
* OKTA_CLIENT_ID
* OKTA_CLIENT_SECRET

#### Environment Variables for Google Cloud
Add the following environment variables to run the application using the Google Cloud SQL (see files `application-gcloud.properties` and `application-gcloudsql.properties`):
* CLOUD_SQL_INSTANCE_CONNECTION_NAME
* CLOUD_SQL_INSTANCE_USERNAME
* CLOUD_SQL_INSTANCE_PASSWORD

#### Environment Variables for SSL
To run the application locally with an SSL certificate, set the following environment variable (see file `application-ssl.properties`)
* SSL_KEY_STORE_PASSWORD

Hint: When running the application in Google Cloud, it's not needed to configure SSL explicitly, Google Cloud Run automatically configures SSL.
So, we don't need to set this environment variable in Google Cloud Run. 

### Spring Profiles
The following Spring profiles are available:
* local: use a local PostgreSQL DB
* h2: use H2 DB
* ssl: run the application with SSL (not needed for Google Cloud Run)
* gcloud: to run the application in Google Cloud (contains general properties)
* gcloudsql: to run the application in Google Cloud (contains Cloud SQL properties)

# Systems Overview

## Local Development
* ysg-server: localhost:8080
* Okta cloud service for identity and access management

## Google Cloud Deployment
YSG Manager is currently deployed to the Google Cloud, the following services are in use:
* Cloud SQL for PostgreSQL
* Cloud Run

### Cloud SQL Configuration
original-advice-370409:europe-west4:ysg-db

* Region: europe-west4 (Niederlande)
* DB-Version: PostgreSQL 14.9
* vCPUs: 1 vCPU
* Speicher: 628,74 MB
* Daten-Cache: Deaktiviert
* Speicher: 10 GB
* Verbindungen: Öffentliche IP-Adresse
* Back-up: Automatisiert
* Verfügbarkeit: Einzelne Zone
* Wiederherstellung zu einem bestimmten Zeitpunkt: Aktiviert
* Netzwerkdurchsatz (MB/s): 125 von 125
* Laufwerkdurchsatz (MB/s): Lesevorgänge: 1,2 von 125,0 / Schreibvorgänge: 1,2 von 107,8
* IOPS: Lesevorgänge: 7,5 von 1.000 / Schreibvorgang: 15 von 10.000

Manually added database flag:
* max_connections: 100 (needed by YSG Manager server component respectively by Spring Boot)

### Cloud Run Configuration
* Container image: From Artifact Registry 'us-east1-docker.pkg.dev/original-advice-370409/ysg-manager', subfolder 'ysg-manager-server'
* Containerport: 8080
* Ressourcen:
    * Speicher: 1 GiB
    * CPU: 1
* Systemdiagnose: Startup probe
    * Anfängliche Verzögerung: 0s
    * Zeitlimit: 240s
    * Fehlerschwellenwert: 1
* Anfragen
    * Zeitüberschreitung bei Anfrage: 300 seconds
    * Maximale Anzahl gleichzeitiger Anfragen pro Instanz: 80
* CPU-Zuweisungen und -Preise: CPU wird nur während der Anfrageverarbeitung zugewiesen
* Ausführungsumgebung: Standard
* Autoscaling
    * Mindestanzahl von Instanzen: 0
    * Maximale Anzahl von Instanzen: 100
* Cloud SQL-Verbindung: Cloud SQL-Instanz 1 / original-advice-370409:europe-west4:ysg-db
* Umgebungsvariablen
    * SPRING_PROFILES_ACTIVE: gcloud,gcloudsql
    * CLOUD_SQL_INSTANCE_USERNAME (aus Secret Manager)
    * OKTA_CLIENT_SECRET (aus Secret Manager)
    * OKTA_CLIENT_ID (aus Secret Manager)
    * OKTA_DOMAIN (aus Secret Manager)
    * CLOUD_SQL_INSTANCE_CONNECTION_NAME (aus Secret Manager)
    * CLOUD_SQL_INSTANCE_PASSWORD (aus Secret Manager)

## Build Container Image and Deploy it to the Google Cloud

With a **command line tool**, change to the folder where the Git repository is cloned:
```
cd C:\Development\git\ysg-manager
```
**Build** the container image:
```
.\mvnw spring-boot:build-image -Pskip-tests --file .\ysg-manager-server\pom.xml
```
Alternative: Build the container image using **native** compilation (Spring profile needs to be set):
```
.\mvnw spring-boot:build-image -Pnative -Pspring-profile-gcloud-gcloudsql -Pskip-tests --file .\ysg-manager-server\pom.xml
```
**Tag** the image:
```
docker tag google.com/lukas99/ysg-manager/ysgmanager-server:latest us-east1-docker.pkg.dev/original-advice-370409/ysg-manager/ysg-manager-server:latest
```
Then, in the **Google Cloud Shell**, login to the Google Cloud:
```
gcloud auth login
gcloud auth print-access-token
docker login -u oauth2accesstoken -p "<access-token>" https://us-east1-docker.pkg.dev
docker push us-east1-docker.pkg.dev/original-advice-370409/ysg-manager/ysg-manager-server:latest
```
Then, in the [Google Cloud Console](https://console.cloud.google.com), change to "Cloud Run", create
a new deployment and select the previously uploaded container image from the artifact registry. 
