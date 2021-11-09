resource "aws_api_gateway_rest_api" "ip_parser_gateway" {
  name = "ip_parser_gateway"
}

resource "aws_api_gateway_resource" "ip_parser_resource" {
  parent_id   = aws_api_gateway_rest_api.ip_parser_gateway.root_resource_id
  path_part   = "ip_checker"
  rest_api_id = aws_api_gateway_rest_api.ip_parser_gateway.id
}

resource "aws_api_gateway_method" "ip_parser_method" {
  authorization = "NONE"
  http_method   = "POST"
  resource_id   = aws_api_gateway_resource.ip_parser_resource.id
  rest_api_id   = aws_api_gateway_rest_api.ip_parser_gateway.id
}

resource "aws_api_gateway_integration" "ip_parser_integration" {
  http_method = aws_api_gateway_method.ip_parser_method.http_method
  resource_id = aws_api_gateway_resource.ip_parser_resource.id
  rest_api_id = aws_api_gateway_rest_api.ip_parser_gateway.id
  type        = "MOCK"
}

resource "aws_api_gateway_deployment" "ip_parser_deployment" {
  rest_api_id = aws_api_gateway_rest_api.ip_parser_gateway.id

  depends_on = [
    aws_lambda_function.ip_checker
  ]
  
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "ip_parser" {
  deployment_id = aws_api_gateway_deployment.ip_parser_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.ip_parser_gateway.id
  stage_name    = "dev"
}