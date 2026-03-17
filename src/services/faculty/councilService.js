// src/services/faculty/councilService.js
import api from "../apiConfig";

const councilService = {
  // ===== DANH SÁCH HỘI ĐỒN =====
  
  /**
   * Lấy danh sách hội đồng (có phân trang)
   * GET /faculty/councils
   */
  getCouncils: async ({ page = 1, per_page = 15 } = {}) => {
    try {
      const response = await api.get("/faculty/councils", {
        params: { page, per_page }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        success: false, 
        message: "Lỗi khi tải danh sách hội đồng" 
      };
    }
  },

  /**
   * Lấy danh sách thành viên hội đồng
   * GET /faculty/councils/{councilId}/members
   */
  getCouncilMembers: async (councilId) => {
    try {
      const response = await api.get(`/faculty/councils/${councilId}/members`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        success: false, 
        message: "Lỗi khi tải danh sách thành viên" 
      };
    }
  },

  // ===== TẠO & CẬP NHẬT HỘI ĐỒN =====

  /**
   * Tạo hội đồng mới
   * POST /faculty/councils
   */
  createCouncil: async (data) => {
    try {
      const response = await api.post("/faculty/councils", {
        lecturer_ids: data.lecturer_ids || []
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        success: false, 
        message: "Lỗi khi tạo hội đồng" 
      };
    }
  },

  /**
   * Cập nhật thành viên hội đồng
   * PUT /faculty/councils/{councilId}
   */
  updateCouncil: async (councilId, data) => {
    try {
      const response = await api.put(`/faculty/councils/${councilId}`, {
        lecturer_ids: data.lecturer_ids || []
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        success: false, 
        message: "Lỗi khi cập nhật hội đồng" 
      };
    }
  },

  // ===== CHẤM ĐIỂM =====

  /**
   * Lấy danh sách sinh viên cần chấm điểm trong hội đồng
   * GET /faculty/councils/{councilId}/capstones
   */
  getCouncilCapstones: async (councilId) => {
    try {
      const response = await api.get(`/faculty/councils/${councilId}/capstones`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        success: false, 
        message: "Lỗi khi tải danh sách sinh viên" 
      };
    }
  },

  /**
   * Cập nhật điểm hội đồng cho sinh viên
   * PUT /faculty/councils/{councilId}/capstones/{capstoneId}/council-grade
   */
  updateGrade: async (councilId, capstoneId, grade) => {
    try {
      const response = await api.put(
        `/faculty/councils/${councilId}/capstones/${capstoneId}/council-grade`,
        {
          council_grade: parseFloat(grade)
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        success: false, 
        message: "Lỗi khi cập nhật điểm" 
      };
    }
  },

  // ===== XẾP LỊCH BẢO VỆ =====

  /**
   * Xếp lịch bảo vệ đồ án
   * PUT /faculty/councils/{councilId}/schedule
   */
  scheduleDefense: async (councilId, data) => {
    try {
      const response = await api.put(
        `/faculty/councils/${councilId}/schedule`,
        {
          start_date: data.startDate,
          end_date: data.endDate,
          buildings: data.buildings,
          rooms: data.rooms
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        success: false, 
        message: "Lỗi khi xếp lịch bảo vệ" 
      };
    }
  },

  // ===== DANH SÁCH GIẢNG VIÊN =====

  /**
   * Lấy danh sách giảng viên khả dụng
   * GET /faculty/lecturers
   */
  getLecturers: async ({ page = 1, per_page = 100 } = {}) => {
    try {
      const response = await api.get("/faculty/lecturers", {
        params: { page, per_page }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { 
        success: false, 
        message: "Lỗi khi tải danh sách giảng viên" 
      };
    }
  }
};

export default councilService;
