resource "aws_sns_topic" "alerts" {
  count = var.enable_cloudwatch && var.alarm_email != "" ? 1 : 0

  name = "${local.name_prefix}-alerts"

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-alerts"
  })
}

resource "aws_sns_topic_subscription" "alerts_email" {
  count = var.enable_cloudwatch && var.alarm_email != "" ? 1 : 0

  topic_arn = aws_sns_topic.alerts[0].arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

locals {
  alarm_sns_arn = var.enable_cloudwatch && var.alarm_email != "" ? aws_sns_topic.alerts[0].arn : var.alarm_sns_arn
}
