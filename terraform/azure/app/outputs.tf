output "ysg_manager_url" {
  value = azurerm_container_app.ysg_manager.latest_revision_fqdn
}