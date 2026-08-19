variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "shita-food-delivery"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# --- VPC ---
variable "vpc_cidr" {
  description = "CIDR for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "private_subnet_cidrs" {
  description = "CIDRs for private subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDRs for public subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "single_nat_gateway" {
  description = "Use single NAT gateway to reduce costs"
  type        = bool
  default     = true
}

# --- ECS ---
variable "ecs_task_cpu" {
  description = "Default CPU for ECS tasks"
  type        = string
  default     = "256"
}

variable "ecs_task_memory" {
  description = "Default memory for ECS tasks"
  type        = string
  default     = "512"
}

variable "desired_count" {
  description = "Default desired count per service"
  type        = number
  default     = 2
}

# Container images (will be set to ECR URLs after creation)
variable "order_image_tag" {
  description = "Image tag for order service"
  type        = string
  default     = "latest"
}
variable "dispatch_image_tag" {
  description = "Image tag for dispatch service"
  type        = string
  default     = "latest"
}
variable "notification_image_tag" {
  description = "Image tag for notification service"
  type        = string
  default     = "latest"
}

# --- RDS ---
variable "rds_engine_version" {
  description = "PostgreSQL engine version (supports PostGIS)"
  type        = string
  default     = "15.4"
}

variable "rds_instance_class" {
  description = "RDS instance class for primary"
  type        = string
  default     = "db.t3.medium"
}

variable "rds_replica_instance_class" {
  description = "RDS instance class for read replica"
  type        = string
  default     = "db.t3.medium"
}

variable "rds_allocated_storage" {
  description = "Allocated storage for RDS (GB)"
  type        = number
  default     = 20
}

variable "rds_db_name" {
  description = "Database name"
  type        = string
  default     = "food_delivery"
}

variable "rds_db_username" {
  description = "Database username"
  type        = string
  default     = "app_user"
}

variable "rds_multi_az" {
  description = "Enable Multi-AZ for primary"
  type        = bool
  default     = true
}

variable "rds_backup_retention" {
  description = "Backup retention days"
  type        = number
  default     = 7
}

# --- Redis ---
variable "redis_engine_version" {
  description = "Redis engine version"
  type        = string
  default     = "6.x"
}

variable "redis_node_type" {
  description = "Redis node type"
  type        = string
  default     = "cache.t3.micro"
}

# --- S3 ---
variable "force_destroy_bucket" {
  description = "Force destroy S3 bucket (dev only)"
  type        = bool
  default     = false
}

# --- Logs ---
variable "log_retention_days" {
  description = "Retention days for CloudWatch logs"
  type        = number
  default     = 30
}