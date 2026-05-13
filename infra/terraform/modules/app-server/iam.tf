data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ec2_monitoring" {
  count = var.create_monitoring_role ? 1 : 0

  name               = "${local.name_prefix}-ec2-monitoring-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-ec2-monitoring-role"
  })
}

resource "aws_iam_role_policy_attachment" "cloudwatch_agent" {
  count = var.create_monitoring_role ? 1 : 0

  role       = aws_iam_role.ec2_monitoring[0].name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_role_policy" "cloudwatch_custom" {
  count = var.create_monitoring_role ? 1 : 0

  name = "${local.name_prefix}-cloudwatch-custom"
  role = aws_iam_role.ec2_monitoring[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams",
          "cloudwatch:PutMetricData",
          "cloudwatch:ListMetrics"
        ]
        Resource = ["*"]
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2_monitoring" {
  count = var.create_monitoring_role ? 1 : 0

  name = "${local.name_prefix}-ec2-monitoring-profile"
  role = aws_iam_role.ec2_monitoring[0].name

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-ec2-monitoring-profile"
  })
}
