import api from "./axios";

// 🔧 Auth headers helper
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ✅ Fetch all categories
export const fetchCategories = async () => {
  const response = await api.get("/api/categories", {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Create new category
export const createCategory = async (categoryData) => {
  const response = await api.post("/api/categories", categoryData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Update existing category
export const updateCategory = async (categoryId, updatedData) => {
  const response = await api.put(`/api/categories/${categoryId}`, updatedData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ✅ Delete a category
export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/api/categories/${categoryId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
