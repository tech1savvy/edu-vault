resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  count = var.enable_cloudwatch ? 1 : 0

  alarm_name          = "${local.name_prefix}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "CPU utilization above 80%"
  alarm_actions       = var.alarm_sns_arn != "" ? [var.alarm_sns_arn] : []

  dimensions = {
    InstanceId = aws_instance.app_server.id
  }

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-high-cpu-alarm"
  })
}

resource "aws_cloudwatch_metric_alarm" "status_check" {
  count = var.enable_cloudwatch ? 1 : 0

  alarm_name          = "${local.name_prefix}-status-check-failed"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "StatusCheckFailed"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 0
  alarm_description   = "EC2 status check failed"
  alarm_actions       = var.alarm_sns_arn != "" ? [var.alarm_sns_arn] : []

  dimensions = {
    InstanceId = aws_instance.app_server.id
  }

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-status-check-alarm"
  })
}

resource "aws_cloudwatch_dashboard" "main" {
  count = var.enable_cloudwatch ? 1 : 0

  dashboard_name = "${local.name_prefix}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/EC2", "CPUUtilization", { stat = "Average" }]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "CPU Utilization"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/EC2", "NetworkIn", { stat = "Average" }],
            ["AWS/EC2", "NetworkOut", { stat = "Average" }]
          ]
          period = 300
          stat   = "Average"
          region = var.aws_region
          title  = "Network Traffic"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 24
        height = 6
        properties = {
          metrics = [
            ["AWS/EC2", "StatusCheckFailed", { stat = "Sum" }]
          ]
          period = 300
          stat   = "Sum"
          region = var.aws_region
          title  = "Status Check Failures"
        }
      }
    ]
  })
}
