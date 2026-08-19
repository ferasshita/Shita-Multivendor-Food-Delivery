resource "aws_apigatewayv2_api" "websocket" {
  name                       = "${var.project_name}-ws-api"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"

  tags = local.common_tags
}

# VPC Link for WebSocket (uses the same VPC Link)
resource "aws_apigatewayv2_integration" "ws" {
  api_id           = aws_apigatewayv2_api.websocket.id
  integration_type = "HTTP_PROXY"
  integration_uri  = "http://${aws_lb.internal.dns_name}/websocket"
  connection_type  = "VPC_LINK"
  connection_id    = aws_apigatewayv2_vpc_link.main.id
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "ws_connect" {
  api_id    = aws_apigatewayv2_api.websocket.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.ws.id}"
}

resource "aws_apigatewayv2_route" "ws_disconnect" {
  api_id    = aws_apigatewayv2_api.websocket.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.ws.id}"
}

resource "aws_apigatewayv2_stage" "ws_prod" {
  api_id      = aws_apigatewayv2_api.websocket.id
  name        = "prod"
  auto_deploy = true

  tags = local.common_tags
}