module "ecs_cluster" {
  source  = "terraform-aws-modules/ecs/aws"
  version = "~> 5.0"

  cluster_name = "${var.project_name}-cluster"

  fargate_capacity_providers = {
    FARGATE = {
      default_capacity_provider_strategy = {
        weight = 50
      }
    }
    FARGATE_SPOT = {
      default_capacity_provider_strategy = {
        weight = 50
      }
    }
  }

  tags = local.common_tags
}

# CloudWatch Log Group for all services
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/aws/ecs/${var.project_name}"
  retention_in_days = var.log_retention_days
  tags = local.common_tags
}

# Task Definitions & Services (DRY using for_each)
locals {
  service_image_tags = {
    order        = var.order_image_tag
    dispatch     = var.dispatch_image_tag
    notification = var.notification_image_tag
  }
}

resource "aws_ecs_task_definition" "service" {
  for_each = local.service_ports

  family                   = each.key
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = each.key
      image = "${aws_ecr_repository.service[each.key].repository_url}:${local.service_image_tags[each.key]}"
      essential = true
      portMappings = [
        {
          containerPort = each.value
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "DB_HOST", value = module.rds.db_instance_address },
        { name = "DB_READ_HOST", value = module.rds.db_replica_addresses[0] },
        { name = "DB_NAME", value = var.rds_db_name },
        { name = "DB_USER", value = var.rds_db_username },
        { name = "REDIS_HOST", value = aws_elasticache_replication_group.redis.primary_endpoint_address },
        { name = "SQS_QUEUE_URL", value = aws_sqs_queue.event_bus.id },
        { name = "AWS_REGION", value = var.aws_region },
        { name = "SERVICE_NAME", value = each.key }
      ]
      secrets = [
        { name = "DB_PASSWORD", valueFrom = aws_secretsmanager_secret.rds_password.arn },
        { name = "STRIPE_API_KEY", valueFrom = aws_secretsmanager_secret.stripe.arn },
        { name = "TWILIO_ACCOUNT_SID", valueFrom = aws_secretsmanager_secret.twilio_sid.arn },
        { name = "TWILIO_AUTH_TOKEN", valueFrom = aws_secretsmanager_secret.twilio_token.arn },
        { name = "FCM_API_KEY", valueFrom = aws_secretsmanager_secret.fcm.arn },
        { name = "APNS_P8_KEY", valueFrom = aws_secretsmanager_secret.apns.arn }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = each.key
        }
      }
      healthCheck = {
        command = ["CMD-SHELL", "curl -f http://localhost:${each.value}/health || exit 1"]
        interval = 30
        timeout  = 5
        retries  = 3
      }
    }
  ])

  tags = local.common_tags
}

resource "aws_ecs_service" "service" {
  for_each = local.service_ports

  name            = each.key
  cluster         = module.ecs_cluster.cluster_id
  task_definition = aws_ecs_task_definition.service[each.key].arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.service[each.key].arn
    container_name   = each.key
    container_port   = each.value
  }

  depends_on = [aws_lb_listener.internal]

  tags = local.common_tags
}