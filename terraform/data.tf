data "archive_file" "ip_checker_archive" {
  type        = "zip"
  source_file = "../lambdas/ip_checker.js"
  output_path = "../lambdas/ip_checker.zip"
}
data "archive_file" "ip_scraper_archive" {
  type        = "zip"
  source_file = "../lambdas/ip_scraper_and_parser.js"
  output_path = "../lambdas/ip_scraper_and_parser.zip"
}