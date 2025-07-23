// src/api/s3Api.js
import api from "./axios"
import axios from "axios" // still needed for raw S3 upload

// 🔧 Auth headers helper
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return {
    Authorization: `Bearer ${token}`,
    "X-User-Role": role,
    "Content-Type": "application/json",
  };
};

const BASE_URL = "/api/s3";

// 🎯 Get presigned URL for S3 upload
export const getPresignedUrl = async (file) => {
  const response = await api.get(`${BASE_URL}/upload-url`, {
    params: {
      fileName: file.name,
      contentType: file.type,
    },
    headers: getAuthHeaders(),
  });
  return response.data.url;
};

// 🚀 Upload file to S3 directly via signed URL
export const uploadToS3 = async (file, signedUrl) => {
  await axios.put(signedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
};
