terraform {
  backend "local" {
    path = "../states/infra.tfstate"
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.50.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.7.2"
    }
  }

  required_version = ">= 1.6.0"
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "ysg_group" {
  name     = "ysg-group"
  location = "northeurope" // PostgreSQL Flexible Server doesn't support 'westeurope'
}

resource "azurerm_virtual_network" "ysg_vnet" {
  name                = "ysg-vnet"
  location            = azurerm_resource_group.ysg_group.location
  resource_group_name = azurerm_resource_group.ysg_group.name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "ysg_subnet_apps" {
  name                 = "ysg-subnet-apps"
  resource_group_name  = azurerm_resource_group.ysg_group.name
  virtual_network_name = azurerm_virtual_network.ysg_vnet.name
  address_prefixes     = ["10.0.0.0/23"] # 512 addresses: 10.0.0.0 – 10.0.1.255 (/23 or larger needed for azurerm_container_app_environment)
  delegation {
    name = "Microsoft.App/environments"
    service_delegation {
      name = "Microsoft.App/environments"
    }
  }
}

resource "azurerm_subnet" "ysg_subnet_postgresql" {
  name                 = "ysg-subnet-postgresql"
  resource_group_name  = azurerm_resource_group.ysg_group.name
  virtual_network_name = azurerm_virtual_network.ysg_vnet.name
  address_prefixes     = ["10.0.2.0/24"] # 256 addresses: 10.0.2.0 – 10.0.2.255
  delegation {
    name = "Microsoft.DBforPostgreSQL/flexibleServers"
    service_delegation {
      name = "Microsoft.DBforPostgreSQL/flexibleServers"
    }
  }
}

resource "azurerm_private_dns_zone" "ysg_postgres_zone" {
  name                = "ysg.postgres.database.azure.com" # should end with suffix .postgres.database.azure.com
  resource_group_name = azurerm_resource_group.ysg_group.name
}

resource "azurerm_private_dns_zone_virtual_network_link" "ysg_postgres_zone_link" {
  name                  = "ysg-postgres-zone-link"
  private_dns_zone_name = azurerm_private_dns_zone.ysg_postgres_zone.name
  resource_group_name   = azurerm_resource_group.ysg_group.name
  virtual_network_id    = azurerm_virtual_network.ysg_vnet.id
}

resource "azurerm_container_registry" "ysg_registry" {
  name                = "ysgcontainers"
  location            = azurerm_resource_group.ysg_group.location
  resource_group_name = azurerm_resource_group.ysg_group.name
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_postgresql_flexible_server" "ysg_postgresql" {
  name                = "ysg-postgresql-server"
  resource_group_name = azurerm_resource_group.ysg_group.name
  location            = azurerm_resource_group.ysg_group.location
  version             = "17"
  create_mode         = "Default"

  sku_name          = "B_Standard_B1ms" # Burstable B1ms: 1 vCore, 2 GB RAM, 640 max iops
  storage_mb        = 32768             # 32 GB storage
  storage_tier      = "P4"
  auto_grow_enabled = false
  zone              = "1"

  backup_retention_days        = 7
  geo_redundant_backup_enabled = false

  administrator_login    = "postgres"
  administrator_password = random_password.ysg_postgresql_admin_password.result

  # configure private access
  delegated_subnet_id           = azurerm_subnet.ysg_subnet_postgresql.id
  private_dns_zone_id           = azurerm_private_dns_zone.ysg_postgres_zone.id
  public_network_access_enabled = false

  authentication {
    password_auth_enabled = true
  }
  lifecycle {
    prevent_destroy = true
  }
}

resource "azurerm_postgresql_flexible_server_database" "ysg-database" {
  name      = "ysg-db"
  server_id = azurerm_postgresql_flexible_server.ysg_postgresql.id

  lifecycle {
    prevent_destroy = true
  }
}

resource "random_password" "ysg_postgresql_admin_password" {
  length  = 20
  special = true
  lower   = true
  upper   = true
  numeric = true
}
