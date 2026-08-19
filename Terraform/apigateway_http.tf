# VPC Link to connect API Gateway to our internal ALB
resource "aws_apigatewayv2_vpc_link" "main" {
  name        = "${var.project_name}-vpc-link"
  security_group_ids = [aws_security_group.alb.id]
  subnet_ids = module.vpc.private_subnets

  tags = local.common_tags
}

# HTTP API
resource "aws_apigatewayv2_api" "http" {
  name          = "${var.project_name}-http-api"
  protocol_type = "HTTP"
  description   = "HTTP API for food delivery"

  tags = local.common_tags
}

# Integration for each service (pointing to the private ALB via VPC Link)
resource "aws_apigatewayv2_integration" "service" {
  for_each = local.service_ports

  api_id           = aws_apigatewayv2_api.http.id
  integration_type = "HTTP_PROXY"
  integration_uri  = "http://${aws_lb.internal.dns_name}/${each.key}"
  connection_type  = "VPC_LINK"
  connection_id    = aws_apigatewayv2_vpc_link.main.id
  integration_method = "ANY"
}

# Routes
resource "aws_apigatewayv2_route" "service" {
  for_each = local.service_ports

  api_id    = aws_apigatewayv2_api.http.id
  route_key = "ANY /${each.key}/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.service[each.key].id}"
}

# Deployment & Stage
resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "prod"
  auto_deploy = true

  tags = local.common_tags
}