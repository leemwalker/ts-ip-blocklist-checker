resource "aws_iam_role" "lambda_s3_role" {
  name = "lambda_s3_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_instance_profile" "lambda_s3_profile" {
  name = "lambda_s3_profile"
  role = aws_iam_role.lambda_s3_role.name
}

resource "aws_iam_role_policy" "lambda_s3_policy" {
  name = "lambda_s3_policy"
  role = aws_iam_role.lambda_s3_role.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:*"
      ],
      "Effect": "Allow",
      "Resource": [
                "arn:aws:s3:::${var.s3_bucket_name}",
                "arn:aws:s3:::${var.s3_bucket_name}/*"
            ]
    }
  ]
}
EOF
}

resource "aws_iam_role" "apig_lambda_role" {
  name = "apig_lambda_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_instance_profile" "apig_lambda_profile" {
  name = "apig_lambda_profile"
  role = aws_iam_role.apig_lambda_role.name
}

resource "aws_iam_role_policy" "apig_lambda_policy" {
  name = "apig_lambda_policy"
  role = aws_iam_role.apig_lambda_role.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "lambda:*"
      ],
      "Effect": "Allow",
      "Resource": [
                "${aws_lambda_function.ip_checker.arn}"
            ]
    }
  ]
}
EOF
}

// An EventBridge IAM policy would need to be included here to kick off the parser as well.