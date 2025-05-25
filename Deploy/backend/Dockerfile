FROM python:3.9

# 复制后端内容到镜像中
COPY . /app/
WORKDIR /app

# 更新pip并安装依赖
RUN pip install --upgrade pip -i https://pypi.tuna.tsinghua.edu.cn/simple \
    && pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install python-multipart

# 生成数据库文件
RUN python -m app.db.models

# 暴露端口
EXPOSE 8000

# 设置启动命令
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--reload"]