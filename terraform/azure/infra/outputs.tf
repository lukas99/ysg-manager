output "ysg_group_name" {
  value = azurerm_resource_group.ysg_group.name
}

output "ysg_group_location" {
  value = azurerm_resource_group.ysg_group.location
}

output "ysg_subnet_apps_id" {
  value = azurerm_subnet.ysg_subnet_apps.id
}

output "ysg_registry_admin_username" {
  value     = azurerm_container_registry.ysg_registry.admin_username
  sensitive = true
}

output "ysg_registry_admin_password" {
  value     = azurerm_container_registry.ysg_registry.admin_password
  sensitive = true
}

output "ysg_postgresql_server_fqdn" {
  value = azurerm_postgresql_flexible_server.ysg_postgresql.fqdn
}

output "ysg_postgresql_server_administrator_login" {
  value     = azurerm_postgresql_flexible_server.ysg_postgresql.administrator_login
  sensitive = true
}

output "ysg_postgresql_server_administrator_password" {
  value     = azurerm_postgresql_flexible_server.ysg_postgresql.administrator_password
  sensitive = true
}

output "ysg_db_name" {
  value = azurerm_postgresql_flexible_server_database.ysg-database.name
}