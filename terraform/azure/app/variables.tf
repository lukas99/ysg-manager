# Pass the Okta values as environment variables:
# export TF_VAR_okta_domain="<OKTA_DOMAIN>"
# export TF_VAR_okta_client_id="<OKTA_CLIENT_ID>"
# export TF_VAR_okta_client_secret="<OKTA_CLIENT_SECRET>"
variable "okta_domain" {
  description = "The Okta domain"
  type        = string
  sensitive   = true
}
variable "okta_client_id" {
  description = "The Okta client id"
  type        = string
  sensitive   = true
}
variable "okta_client_secret" {
  description = "The Okta client secret"
  type        = string
  sensitive   = true
}