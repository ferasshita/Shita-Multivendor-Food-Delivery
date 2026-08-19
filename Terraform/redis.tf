resource "aws_elasticache_replication_group" "redis" {
  replication_group_id          = "${var.project_name}-redis"
  description                   = "Redis cluster for geospatial and sessions"
  engine                        = "redis"
  engine_version                = var.redis_engine_version
  node_type                     = var.redis_node_type
  num_cache_clusters            = 2 # 1 primary + 1 replica
  automatic_failover_enabled    = true
  port                          = 6379
  parameter_group_name          = "default.redis${split(".", var.redis_engine_version)[0]}.x"
  subnet_group_name             = module.vpc.database_subnet_group_name
  security_group_ids            = [aws_security_group.redis.id]
  at_rest_encryption_enabled    = true
  transit_encryption_enabled    = true

  tags = local.common_tags
}