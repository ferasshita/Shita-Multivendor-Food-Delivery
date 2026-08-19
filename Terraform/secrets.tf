resource "random_password" "rds_password" {
  length  = 20
  special = false
}

resource "aws_secretsmanager_secret" "rds_password" {
  name = "${var.project_name}/rds/password"
  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "rds_password" {
  secret_id     = aws_secretsmanager_secret.rds_password.id
  secret_string = random_password.rds_password.result
}

# Placeholders for external services – you must update the secret_string manually or via CI/CD
resource "aws_secretsmanager_secret" "stripe" {
  name = "${var.project_name}/stripe/api_key"
  tags = local.common_tags
}
resource "aws_secretsmanager_secret" "twilio_sid" {
  name = "${var.project_name}/twilio/account_sid"
  tags = local.common_tags
}
resource "aws_secretsmanager_secret" "twilio_token" {
  name = "${var.project_name}/twilio/auth_token"
  tags = local.common_tags
}
resource "aws_secretsmanager_secret" "fcm" {
  name = "${var.project_name}/fcm/api_key"
  tags = local.common_tags
}
resource "aws_secretsmanager_secret" "apns" {
  name = "${var.project_name}/apns/p8_key"
  tags = local.common_tags
}