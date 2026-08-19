output "vpc_id" { value = module.vpc.vpc_id }
output "alb_dns_name" { value = aws_lb.internal.dns_name }
output "api_gateway_url" { value = aws_apigatewayv2_stage.prod.invoke_url }
output "websocket_url" { value = aws_apigatewayv2_stage.ws_prod.invoke_url }
output "rds_endpoint" { value = module.rds.db_instance_address }
output "rds_replica_endpoint" { value = module.rds.db_replica_addresses[0] }
output "redis_endpoint" { value = aws_elasticache_replication_group.redis.primary_endpoint_address }
output "s3_bucket_name" { value = aws_s3_bucket.assets.bucket }
output "sqs_queue_url" { value = aws_sqs_queue.event_bus.id }
output "ecr_repository_urls" { value = { for k, v in aws_ecr_repository.service : k => v.repository_url } }