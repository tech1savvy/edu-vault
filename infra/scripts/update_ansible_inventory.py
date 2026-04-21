#!/usr/bin/env python3
"""
Update Ansible inventory with Terraform output.

Usage:
    cd infra && python scripts/update_ansible_inventory.py [--deploy]
"""

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

TERRAFORM_DIR = Path(__file__).parent.parent / "terraform"
ANSIBLE_INVENTORY = Path(__file__).parent.parent / "ansible" / "inventory" / "hosts.ini"


def get_terraform_output():
    """Get outputs from Terraform as JSON."""
    result = subprocess.run(
        ["terraform", "output", "-json"],
        cwd=TERRAFORM_DIR,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"Error running terraform output: {result.stderr}", file=sys.stderr)
        sys.exit(1)
    return json.loads(result.stdout)


def get_public_ip():
    """Extract public IP from Terraform output."""
    outputs = get_terraform_output()
    try:
        return outputs["instance"]["value"]["public_ip"]
    except KeyError:
        print(
            "Error: 'instance.public_ip' not found in Terraform output", file=sys.stderr
        )
        sys.exit(1)


def get_ssh_connection():
    """Get SSH connection string from Terraform output."""
    outputs = get_terraform_output()
    try:
        return outputs["ssh_connection"]["value"]
    except KeyError:
        return None


def get_open_ports():
    """Get open ports from Terraform output."""
    outputs = get_terraform_output()
    try:
        return outputs["ports_open"]["value"]
    except KeyError:
        return {}


def update_inventory_ip(ip):
    """Update Ansible inventory with new IP address."""
    if not ANSIBLE_INVENTORY.exists():
        print(
            f"Error: Inventory file not found at {ANSIBLE_INVENTORY}", file=sys.stderr
        )
        sys.exit(1)

    content = ANSIBLE_INVENTORY.read_text()

    pattern = r"(ansible_host=)(\d+\.\d+\.\d+\.\d+)"
    replacement = rf"\g<1>{ip}"
    new_content = re.sub(pattern, replacement, content)

    if content == new_content:
        print(f"IP {ip} already configured in inventory")
        return False

    ANSIBLE_INVENTORY.write_text(new_content)
    print(f"Updated inventory: {ANSIBLE_INVENTORY}")
    print(f"  ansible_host={ip}")
    return True


def main():
    parser = argparse.ArgumentParser(
        description="Update Ansible inventory from Terraform output"
    )
    parser.add_argument(
        "--deploy",
        action="store_true",
        help="Also run Ansible deployment after update",
    )
    args = parser.parse_args()

    project_root = Path(__file__).parent.parent
    os.chdir(project_root)

    print("Getting Terraform output...")
    public_ip = get_public_ip()
    print(f"Public IP: {public_ip}")

    print("\nUpdating Ansible inventory...")
    updated = update_inventory_ip(public_ip)

    ssh_conn = get_ssh_connection()
    ports = get_open_ports()

    print("\n" + "=" * 60)
    print("DEPLOYMENT READY")
    print("=" * 60)
    print(f"\nSSH to server:")
    print(f"  ssh -i ~/.ssh/id_ed25519 ec2-user@{public_ip}")
    print(f"\nAnsible deployment:")
    print(f"  cd infra/ansible")
    print(f"  ansible-playbook -i inventory/hosts.ini playbooks/deploy.yml")
    print(f"\nOpen ports:")
    for port, svc in sorted(ports.items()):
        print(f"  {port}: {svc}")

    if args.deploy:
        print("\nRunning Ansible deployment...")
        result = subprocess.run(
            [
                "ansible-playbook",
                "-i",
                "infra/ansible/inventory/hosts.ini",
                "infra/ansible/playbooks/deploy.yml",
            ],
            cwd=project_root,
        )
        sys.exit(result.returncode)


if __name__ == "__main__":
    main()
