# Quick Start Guide - Deploy EduVault in 10 Minutes

## TL;DR (The Short Version)

```bash
# 1. Clone & Enter
git clone https://github.com/Asingh-2430/edu-vault.git
cd edu-vault/infra

# 2. Setup AWS
aws configure

# 3. Setup Secrets
cd ansible
cp secrets.yml.example secrets.yml
# Edit secrets.yml with your passwords

# 4. Deploy Infra
cd ../terraform
terraform init
terraform apply   # Type 'yes'

# 5. Deploy App
cd ../ansible
# Edit inventory/hosts.ini with your server IP
nano inventory/hosts.ini
ansible-playbook playbooks/deploy.yml

# 6. Access
# Open: http://SERVER_IP:5173
```

---

## What Each Step Does

| Step | Command | What Happens |
|------|---------|-------------|
| 1 | `git clone` | Downloads the code |
| 2 | `aws configure` | Connects to your AWS account |
| 3 | Create secrets.yml | Sets passwords (keep this private!) |
| 4 | `terraform apply` | Creates server on AWS |
| 5 | `ansible-playbook` | Installs Docker & starts the app |
| 6 | Access URL | Open in browser |

---

## Need Help?

- **Detailed Guide**: See [README.md](./README.md)
- **Troubleshooting**: See [README.md](./README.md#troubleshooting)

---

## Costs

- **AWS EC2 t3.micro**: ~$10/month
- **Storage**: ~$3/month
- **Total**: ~$15/month

---

## Don't Forget

- ✅ Never commit `secrets.yml` to git
- ✅ Keep your AWS credentials safe
- ✅ Delete resources when done to save money: `terraform destroy`
