#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." &> /dev/null && pwd )"

# 进入项目根目录
cd "$PROJECT_ROOT"
echo "当前工作目录：$(pwd)"

# 设置国内源
echo "--------STEP 1/6: 更新 APT 源--------"
sudo apt-get update
sudo apt-get install -y curl gnupg ca-certificates lsb-release git apt-transport-https software-properties-common

# 添加 Docker
echo "--------STEP 2/6: 添加 Docker --------"
sudo apt-get install -y docker.io docker-compose 
sudo systemctl start docker

# 设置 Docker 国内镜像源
echo "--------STEP 3/6: 配置 Docker 加速镜像--------"
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.xuanyuan.me"
  ]
}
EOF

sudo systemctl daemon-reexec
sudo systemctl restart docker

# 检查版本
echo "初始化完成，版本信息如下："
docker --version
docker-compose version

mkdir -p Deploy/build

echo "--------STEP 4/6: 构建前端镜像并保存...-------"
docker build -t deploy-frontend -f ./Deploy/frontend/Dockerfile ./FrontEnd
docker save deploy-frontend -o ./Deploy/build/deploy-frontend.tar

echo "--------STEP 5/6: 构建后端镜像并保存...-------"
docker build -t deploy-backend -f ./Deploy/backend/Dockerfile ./BackEnd
docker save deploy-backend -o ./Deploy/build/deploy-backend.tar

echo "--------STEP 6/6: 启动 Docker Compose 服务...-------"
docker-compose -f 'Deploy/docker-compose.yml' --project-name 'deploy' down
docker-compose -f 'Deploy/docker-compose.yml' --project-name 'deploy' up -d

