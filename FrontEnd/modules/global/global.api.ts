import {API_BASE_URL} from "@/CONFIG";
import {parseJwtToken} from "@/lib/token-utils";
import {Result} from "@/lib/result";
import {throwError} from "@/lib/utils";

export async function fetchMyRole(): Promise<Result<string, Error>> {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return {
      ok: false,
      value: Error("token已失效！")
    }
  }
  const payload = parseJwtToken(token);
  const uid = payload?.sub;
  if (!uid) {
    return {
      ok: false,
      value: Error("token的payload-uid部分异常！")
    }
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/info/${uid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      return {
        ok: true,
        value: (await response.json()).role
      }
    }
    else {
      throwError("角色获取失败！");
    }
  }
  catch (error) {
    return {
      ok: false,
      value: error as Error
    };
  }
}

export async function uploadImage(file: File): Promise<Result<string, Error>> {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload_image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("access_token") : ''}`,
      },
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      return {
        ok: true,
        value: result.data.url
      };
    }
    else {
      const errorData = await response.json();
      throwError(errorData.detail || "上传图片失败！");
    }
  } catch (error) {
    return {
      ok: false,
      value: error as Error
    };
  }
}