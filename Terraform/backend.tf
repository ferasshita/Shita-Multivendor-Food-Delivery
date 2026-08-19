terraform {
  backend "s3" {
    bucket         = "your-terraform-state-bucket"   # CHANGE ME
    key            = "shita-food-delivery/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-locks"
    encrypt        = true
  }
}