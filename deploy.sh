#!/bin/bash
set -e

echo "Creating Key Pair..."
aws ec2 create-key-pair --key-name sih-key --query 'KeyMaterial' --output text > sih-key.pem
chmod 400 sih-key.pem

echo "Creating Security Group..."
VPC_ID=$(aws ec2 describe-vpcs --query 'Vpcs[0].VpcId' --output text)
SG_ID=$(aws ec2 create-security-group --group-name sih-sg --description "SG for SIH App" --vpc-id $VPC_ID --query 'GroupId' --output text)

echo "Adding Inbound Rules to Security Group..."
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 3000 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 8000 --cidr 0.0.0.0/0

echo "Launching EC2 Instance..."
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id ami-025d99823a4caad37 \
    --count 1 \
    --instance-type t2.micro \
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
