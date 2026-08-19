# Custom parameter group enabling PostGIS
resource "aws_db_parameter_group" "postgis" {
  name        = "${var.project_name}-postgis-pg"
  family      = "postgres${split(".", var.rds_engine_version)[0]}"
  description = "Parameter group with PostGIS extension"

  parameter {
    name  = "shared_preload_libraries"
    value = "postgis"
  }

  tags = local.common_tags
}

module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  identifier = "${var.project_name}-db"

  engine               = "postgres"
  engine_version       = var.rds_engine_version
  instance_class       = var.rds_instance_class
  allocated_storage    = var.rds_allocated_storage
  storage_encrypted    = true
  parameter_group_name = aws_db_parameter_group.postgis.name

  db_name  = var.rds_db_name
  username = var.rds_db_username
  password = random_password.rds_password.result

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = module.vpc.database_subnet_group_name

  multi_az               = var.rds_multi_az
  backup_retention_period = var.rds_backup_retention
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  create_db_option_group    = false
  create_db_parameter_group = false
  create_db_subnet_group    = false

  replica_count = 1
  replica_scale = {
    "0" = {
      instance_class = var.rds_replica_instance_class
      availability_zone = data.aws_availability_zones.available.names[1]
      parameter_group_name = aws_db_parameter_group.postgis.name
    }
  }

  tags = local.common_tags
}