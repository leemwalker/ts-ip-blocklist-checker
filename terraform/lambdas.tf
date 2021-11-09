resource "aws_lambda_function" "ip_checker" {
  filename      = data.archive_file.ip_checker_archive.output_path
  function_name = "ip_checker"
  role          = aws_iam_role.lambda_s3_role.arn
  handler       = "ip_checker.handler"

  source_code_hash = filebase64sha256(data.archive_file.ip_checker_archive.output_path)

  runtime = "nodejs14.x"

}

resource "aws_lambda_function" "ip_scraper_and_parser" {
  filename      = data.archive_file.ip_scraper_archive.output_path
  function_name = "ip_scraper_and_parser"
  role          = aws_iam_role.lambda_s3_role.arn
  handler       = "ip_scraper_and_parser.myHandler"

  source_code_hash = filebase64sha256(data.archive_file.ip_scraper_archive.output_path)

  runtime = "nodejs14.x"

}