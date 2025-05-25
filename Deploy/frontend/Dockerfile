FROM node:18

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建应用（如果需要）
RUN npm run build

# 暴露端口（根据您的应用配置，通常是3000）
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]