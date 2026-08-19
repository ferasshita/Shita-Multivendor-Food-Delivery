resource "aws_lb" "internal" {
  name               = "${var.project_name}-internal"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.private_subnets

  enable_deletion_protection = false
  tags = local.common_tags
}

# Target groups for each service
locals {
  service_ports = {
    order        = 8080
    dispatch     = 8081
    notification = 8082
  }
  health_paths = {
    order        = "/health"
    dispatch     = "/health"
    notification = "/health"
  }
}

resource "aws_lb_target_group" "service" {
  for_each = local.service_ports

  name        = "${var.project_name}-${each.key}-tg"
  port        = each.value
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = local.health_paths[each.key]
  }

  tags = local.common_tags
}

# Listener on port 80 (no SSL internally because VPC Link keeps it within VPC)
resource "aws_lb_listener" "internal" {
  load_balancer_arn = aws_lb.internal.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Default response"
      status_code  = "404"
    }
  }
}

# Listener rules for path-based routing
resource "aws_lb_listener_rule" "order" {
  listener_arn = aws_lb_listener.internal.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service["order"].arn
  }

  condition {
    path_pattern {
      values = ["/orders/*", "/orders"]
    }
  }
}

resource "aws_lb_listener_rule" "dispatch" {
  listener_arn = aws_lb_listener.internal.arn
  priority     = 101

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service["dispatch"].arn
  }

  condition {
    path_pattern {
      values = ["/dispatch/*", "/dispatch"]
    }
  }
}

resource "aws_lb_listener_rule" "notification" {
  listener_arn = aws_lb_listener.internal.arn
  priority     = 102

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service["notification"].arn
  }

  condition {
    path_pattern {
      values = ["/notifications/*", "/notifications"]
    }
  }
}