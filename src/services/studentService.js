import React from 'react'

const studentService = {

  getProfile: async () => {
    try {
      const response = await api.get("/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải thông tin cá nhân" };
    }
  },

}

export default studentService
