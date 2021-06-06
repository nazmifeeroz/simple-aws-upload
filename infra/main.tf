terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "3.44.0"
    }
  }
}

provider "aws" {
  profile                 = var.aws_profile 
  region                  = var.region
}

resource "aws_s3_bucket" "b" {
  bucket = var.s3_bucket
  acl    = "public-read"
  policy = templatefile("policy.json", {
    s3_bucket = var.s3_bucket
  })

  website {
    index_document = "index.html"
    error_document = "404.html"
  }

  force_destroy = true
}

locals {
  s3_origin_id = "myS3Origin"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.b.bucket_regional_domain_name
    origin_id   = "myS3Origin"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "allow-all"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  default_root_object = "index.html"
  enabled             = true
}

output "s3_url" {
  description = "The s3 website endpoint"
  value       = aws_s3_bucket.b.bucket_regional_domain_name
}

output "cloudfront_url" {
  description = "The cloudfront website endpoint"
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}
