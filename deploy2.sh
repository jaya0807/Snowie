#!/bin/bash
set -e

SG_ID=$(aws ec2 describe-security-groups --group-names sih-sg --query 'SecurityGroups[0].GroupId' --output text)

echo "Launching EC2 Instance (t3.micro)..."
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id ami-025d99823a4caad37 \
    --count 1 \
    --instance-type t3.micro \
    --key-name sih-key \
    --security-group-ids $SG_ID \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=sih-server}]' \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "Instance $INSTANCE_ID launching. Waiting for it to be running..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID

PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)

echo "EC2 Instance is running! Public IP: $PUBLIC_IP"
echo "$PUBLIC_IP" > public_ip.txt
