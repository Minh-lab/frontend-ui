// services/notificationService.js
import api from "./apiConfig";

const notificationService = {
  /**
   * Lấy danh sách thông báo
   * GET /notifications
   */
  getNotifications: async () => {
    try {
      const response = await api.get("/notifications");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể lấy thông báo" };
    }
  },

  /**
   * Đánh dấu đã đọc
   * PUT /notifications/{id}/read
   */
  markAsRead: async (id) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể đánh dấu" };
    }
  }
};

export default notificationService;