"""
app/api/upload_endpoints.py

上传文件相关路由。
"""
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import os
import random
import string

# 配置上传文件夹
VIDEO_UPLOAD_FOLDER = 'uploads/videos'
IMAGE_UPLOAD_FOLDER = 'uploads/images'
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv'}
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

os.makedirs(VIDEO_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(IMAGE_UPLOAD_FOLDER, exist_ok=True)

upload_router = APIRouter()

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def generate_random_filename(filename):
    extension = filename.rsplit('.', 1)[1].lower()
    random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
    return f"{random_str}.{extension}"

@upload_router.post("/upload_video")
async def upload_video(video: UploadFile = File(...)):
    if video.filename == '':
        raise HTTPException(status_code=400, detail="No selected video file")

    if allowed_file(video.filename, ALLOWED_VIDEO_EXTENSIONS):
        video_filename = generate_random_filename(video.filename)
        video_filepath = os.path.join(VIDEO_UPLOAD_FOLDER, video_filename)
        try:
            with open(video_filepath, "wb") as file:
                content = await video.read()
                file.write(content)

            video_url = f"http://127.0.0.1:8000/uploads/videos/{video_filename}"
            return JSONResponse(status_code=200, content={"errno": 0, "data": {"url": video_url}})
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"视频文件保存失败: {str(e)}")

    raise HTTPException(status_code=400, detail='Invalid video file format')

@upload_router.post("/upload_image")
async def upload_image(image: UploadFile = File(...)):
    if image.filename == '':
        raise HTTPException(status_code=400, detail="No selected image file")

    if allowed_file(image.filename, ALLOWED_IMAGE_EXTENSIONS):
        image_filename = generate_random_filename(image.filename)
        image_filepath = os.path.join(IMAGE_UPLOAD_FOLDER, image_filename)
        try:
            with open(image_filepath, "wb") as file:
                content = await image.read()
                file.write(content)

            image_url = f"http://127.0.0.1:8000/uploads/images/{image_filename}"
            return JSONResponse(status_code=200, content={"errno": 0, "data": {"url": image_url}})
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"图像文件保存失败: {str(e)}")

    raise HTTPException(status_code=400, detail='Invalid image file format')
