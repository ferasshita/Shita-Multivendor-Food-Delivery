# Shita Multivendor Food Delivery – AWS Infrastructure

This folder contains the Terraform code for the Shita Food Delivery platform.

## Architecture

![](./assets/Architecture_Diagram.png) 

## Prerequisites
- Terraform >= 1.0
- AWS CLI configured with appropriate credentials
- An S3 bucket and DynamoDB table for remote state (update `backend.tf`)

## Usage
1. Clone the repo.
2. Copy `terraform.tfvars.example` to `terraform.tfvars` and fill in your values.
3. Run:
   ```bash
   terraform init
   terraform plan
   terraform apply