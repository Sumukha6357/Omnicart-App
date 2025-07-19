// src/api/categoryApi.js
import axios from "axios"

const BASE_URL = "http://localhost:8080/api/categories"

export const fetchCategories = async (token) => {
  const response = await axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const createCategory = async (categoryData, token) => {
  const response = await axios.post(BASE_URL, categoryData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const updateCategory = async (categoryId, updatedData, token) => {
  const response = await axios.put(`${BASE_URL}/${categoryId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const deleteCategory = async (categoryId, token) => {
  const response = await axios.delete(`${BASE_URL}/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
