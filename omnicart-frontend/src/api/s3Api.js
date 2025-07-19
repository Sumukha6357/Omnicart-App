// src/api/s3Api.js
import axios from "axios"

const BASE_URL = "http://localhost:8080/api/s3"

export const getPresignedUrl = async (file, token) => {
  const response = await axios.get(`${BASE_URL}/upload-url`, {
    params: {
      fileName: file.name,
      contentType: file.type,
    },
    headers: {
      Authorization: `Bearer ${token}`, // ✅ REQUIRED
    },
  })
  return response.data.url
}

export const uploadToS3 = async (file, signedUrl) => {
  await axios.put(signedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  })
}
