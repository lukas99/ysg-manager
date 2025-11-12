terraform {
  backend "local" {
    path = "../states/app.tfstate"
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.50.0"
    }
  }

  required_version = ">= 1.6.0"
}

data "terraform_remote_state" "ysg_infra" {
  backend = "local"
  config = {
    path = "../states/infra.tfstate"
  }
}

provider "azurerm" {
  features {}
}

# provision together with Container App (when container App is deleted, Environment will also be deleted)
resource "azurerm_container_app_environment" "ysg_manager_environment" {
  name                           = "ysg-manager-environment"
  resource_group_name            = data.terraform_remote_state.ysg_infra.outputs.ysg_group_name
  location                       = data.terraform_remote_state.ysg_infra.outputs.ysg_group_location
  infrastructure_subnet_id       = data.terraform_remote_state.ysg_infra.outputs.ysg_subnet_apps_id
  internal_load_balancer_enabled = false # make it not private-only
  # without workload_profile, there is the following error
  # 'ManagedEnvironmentSubnetIsDelegated': ysg-subnet-apps cannot be used as it's a delegated subnet
  workload_profile {
    name                  = "Consumption" # name must be 'Consumption' when type is 'Consumption'
    workload_profile_type = "Consumption"
    maximum_count         = 5
    minimum_count         = 0
  }
}

resource "azurerm_container_app" "ysg_manager" {
  name                         = "ysg-manager"
  resource_group_name          = data.terraform_remote_state.ysg_infra.outputs.ysg_group_name
  container_app_environment_id = azurerm_container_app_environment.ysg_manager_environment.id
  revision_mode                = "Single"

  template {
    container {
      name  = "ysg-manager"
      image = "ysgcontainers.azurecr.io/ysg-manager/ysgmanager-server:latest" # image pushed to container registry
      # Possible CPU - Memory combinations:
      # [cpu: 0.25, memory: 0.5Gi]; [cpu: 0.5, memory: 1.0Gi]; [cpu: 0.75, memory: 1.5Gi]; │ [cpu: 1.0, memory: 2.0Gi];
      # [cpu: 1.25, memory: 2.5Gi]; [cpu: 1.5, memory: 3.0Gi]; [cpu: 1.75, memory: 3.5Gi]; [cpu: 2.0, memory: 4.0Gi]
      cpu    = 1.0
      memory = "2Gi"

      env {
        name  = "SPRING_DATASOURCE_URL"
        value = "jdbc:postgresql://${data.terraform_remote_state.ysg_infra.outputs.ysg_postgresql_server_fqdn}:5432/${data.terraform_remote_state.ysg_infra.outputs.ysg_db_name}"
      }
      env {
        name  = "SPRING_DATASOURCE_USERNAME"
        value = data.terraform_remote_state.ysg_infra.outputs.ysg_postgresql_server_administrator_login
      }
      env {
        name        = "SPRING_DATASOURCE_PASSWORD"
        secret_name = "ysg-postgresql-admin-password"
      }
      env {
        name  = "OKTA_DOMAIN"
        value = var.okta_domain
      }
      env {
        name  = "OKTA_CLIENT_ID"
        value = var.okta_client_id
      }
      env {
        name  = "OKTA_CLIENT_SECRET"
        value = var.okta_client_secret
      }
    }
    max_replicas = 1
  }

  ingress {
    # set the port of the Spring Boot application to target_port
    # don't need to set exposed_port because Azure handles TLS termination when external_enabled=true
    external_enabled           = true
    target_port                = 8080
    allow_insecure_connections = false
    traffic_weight { # doesn't apply because revision_mode is set to 'Single' (and not to 'Multiple')
      latest_revision = true
      percentage      = 100
    }
  }

  registry {
    server               = "ysgcontainers.azurecr.io"
    username             = data.terraform_remote_state.ysg_infra.outputs.ysg_registry_admin_username
    password_secret_name = "ysg-registry-password"
  }

  secret {
    name  = "ysg-registry-password"
    value = data.terraform_remote_state.ysg_infra.outputs.ysg_registry_admin_password
  }
  secret {
    name  = "ysg-postgresql-admin-password"
    value = data.terraform_remote_state.ysg_infra.outputs.ysg_postgresql_server_administrator_password
  }
}
