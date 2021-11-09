resource "aws_s3_bucket" "ip_bucket" {
    bucket        = var.s3_bucket_name
    acl           = "private"
}