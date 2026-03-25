// src/services/faculty/capstoneService.js
import api from "../apiConfig";

const capstoneService = {
  // ===== CAPSTONE (ĐỒ ÁN) =====
  
  // Lấy danh sách đồ án (có phân trang và lọc)
  getCapstones: async ({ 
    page = 1, 
    itemsPerPage = 10, 
    search = "", 
    status = "", 
    major = "", 
    lecturer = "",
    council = ""
  } = {}) => {
    try {
      // Chỉ gửi params không rỗng
      const params = { page, itemsPerPage };
      if (search) params.search = search;
      if (status) params.status = status;
      if (major) params.major = major;
      if (lecturer) params.lecturer = lecturer;
      if (council) params.council = council;
      
      const response = await api.get("/faculty_staff/capstones", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách đồ án" };
    }
  },

  // Lấy chi tiết đồ án theo ID
  getCapstoneById: async (id) => {
    try {
      const response = await api.get(`/faculty_staff/capstones/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải thông tin đồ án" };
    }
  },

  // Cập nhật thông tin đồ án (phân công GVHD, phản biện, hội đồng)
  updateCapstone: async (id, capstoneData) => {
    try {
      const response = await api.put(`/faculty/capstones/${id}`, capstoneData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi cập nhật đồ án" };
    }
  },

  // Xóa đồ án
  deleteCapstone: async (id) => {
    try {
      const response = await api.delete(`/faculty/capstones/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi xóa đồ án" };
    }
  },

  // ===== COUNCIL (HỘI ĐỒNG) =====
  
  // Lấy danh sách hội đồng
  getCouncils: async () => {
    try {
      const response = await api.get("/faculty/councils");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách hội đồng" };
    }
  },

  // Lấy chi tiết hội đồng
  getCouncilById: async (id) => {
    try {
      const response = await api.get(`/faculty/councils/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải thông tin hội đồng" };
    }
  },

  // Lấy danh sách thành viên hội đồng
  getCouncilMembers: async (councilId) => {
    try {
      const response = await api.get(`/faculty/councils/${councilId}/members`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách thành viên hội đồng" };
    }
  },

  // Thêm hội đồng mới
  addCouncil: async (councilData) => {
    try {
      const response = await api.post("/faculty/councils", councilData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi thêm hội đồng" };
    }
  },

  // Cập nhật hội đồng
  updateCouncil: async (id, councilData) => {
    try {
      const response = await api.put(`/faculty/councils/${id}`, councilData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi cập nhật hội đồng" };
    }
  },

  // Xóa hội đồng
  deleteCouncil: async (id) => {
    try {
      const response = await api.delete(`/faculty/councils/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi xóa hội đồng" };
    }
  },

  // ===== LECTURER (GIẢNG VIÊN) =====
  
  // Lấy danh sách giảng viên
  getLecturers: async ({ search = "", major = "" } = {}) => {
    try {
      const response = await api.get("/faculty/lecturers", {
        params: { search, major }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách giảng viên" };
    }
  },

  // Lấy danh sách giảng viên hướng dẫn với thông tin slot (cho dialog phân công)
  getAdvisorsForAssignment: async ({ page = 1, itemsPerPage = 10, search = "", major = "" } = {}) => {
    try {
      const response = await api.get("/faculty_staff/capstones/advisors", {
        params: { page, itemsPerPage, search, major }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách giảng viên hướng dẫn" };
    }
  },

  // Lấy chi tiết giảng viên
  getLecturerById: async (id) => {
    try {
      const response = await api.get(`/faculty/lecturers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải thông tin giảng viên" };
    }
  },

  // Cập nhật số lượng sinh viên hướng dẫn
  updateLecturerQuota: async (id, current, max) => {
    try {
      const response = await api.put(`/faculty/lecturers/${id}/quota`, { current, max });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi cập nhật quota giảng viên" };
    }
  },

  // ===== REGISTRATION (ĐĂNG KÝ ĐỒ ÁN) =====
  
  // Lấy danh sách đăng ký đồ án (chờ duyệt) - dành cho VPK
  getRegistrations: async ({ 
    page = 1, 
    itemsPerPage = 10, 
    search = "", 
    status = "PENDING_FACULTY", 
    major = "" 
  } = {}) => {
    try {
      const response = await api.get("/faculty_staff/capstones/registrations", {
        params: { page, itemsPerPage, search, status, major }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách đăng ký" };
    }
  },

  // Lấy danh sách chuyên ngành
  getMajors: async () => {
    try {
      const response = await api.get("/expertises");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách chuyên ngành" };
    }
  },

  // Alias getCapstoneMajors để tương thích
  getCapstoneMajors: async function() {
    return this.getMajors();
  },

  // Duyệt đề tài đồ án (UC 24.2 - VPK duyệt cuối cùng)
  // Endpoint: POST /faculty_staff/capstones/topics/{requestId}/confirm
  approveRegistration: async (requestId) => {
    try {
      const response = await api.post(`/faculty_staff/capstones/topics/${requestId}/confirm`, {
        status: 'APPROVED'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi duyệt đề tài" };
    }
  },

  // Từ chối đề tài đồ án
  rejectRegistration: async (requestId, feedback = '') => {
    try {
      const response = await api.post(`/faculty_staff/capstones/topics/${requestId}/confirm`, {
        status: 'REJECTED',
        feedback: feedback
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi từ chối đề tài" };
    }
  },

  // ===== SUPERVISOR ASSIGNMENT (PHÂN CÔNG GVHD - GIẢNG VIÊN HƯỚNG DẪN) =====
  
  // Phân công giảng viên hướng dẫn cho nhiều sinh viên
  assignSupervisor: async (lecturerId, studentIds) => {
    try {
      const response = await api.post("/faculty_staff/capstones/assign-supervisor", {
        lecturer_id: lecturerId,
        student_ids: studentIds
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi phân công giảng viên hướng dẫn" };
    }
  },

  // ===== COUNCIL ASSIGNMENT (PHÂN CÔNG HỘI ĐỘNG + GV PHẢN BIỆN) =====
  
  // Phân công hội đống và 2 giáng viên phản biện cho nhiều sinh viên
  assignCouncilAndReviewers: async (councilId, reviewerIds, studentIds) => {
    try {
      const response = await api.post("/faculty_staff/capstones/assign-council", {
        council_id: councilId,
        reviewer_ids: reviewerIds,
        student_ids: studentIds
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi phân công hội đống" };
    }
  },

  // ===== UTILITY =====
  
  // Lấy danh sách các trạng thái đồ án
  getCapstoneStatuses: async () => {
    try {
      // Danh sách trạng thái từ backend là các giá trị hằng số từ Capstone model
      const statuses = [
        { id: 'INITIALIZED', name: 'Chưa khởi tạo' },
        { id: 'LECTURER_APPROVED', name: 'GVHD đã phê duyệt' },
        { id: 'TOPIC_APPROVED', name: 'Đề tài đã duyệt' },
        { id: 'REPORTING', name: 'Đang nộp báo cáo' },
        { id: 'OFFICIAL_SUBMITTED', name: 'Nộp báo cáo cuối cùng' },
        { id: 'REVIEW_ELIGIBLE', name: 'Chờ phản biện' },
        { id: 'DEFENSE_ELIGIBLE', name: 'Chờ bảo vệ' },
        { id: 'CANCEL', name: 'Đã hủy' },
        { id: 'FAILED', name: 'Đã trượt' },
        { id: 'COMPLETED', name: 'Hoàn tất' }
      ];
      
      return {
        success: true,
        data: statuses
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách trạng thái đồ án" };
    }
  },

  // ===== STATISTICS (THỐNG KÊ) =====
  
  // Lấy danh sách học kỳ (cho dropdown filter)
  getSemesters: async () => {
    try {
      const response = await api.get("/faculty_staff/capstones/filter/semesters");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách học kỳ" };
    }
  },

  // Lấy danh sách giảng viên (cho dropdown filter)
  getLecturersForFilter: async () => {
    try {
      const response = await api.get("/faculty_staff/capstones/filter/lecturers");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách giảng viên" };
    }
  },

  // Lấy danh sách hội đồng (cho dropdown filter)
  getCouncilsForFilter: async () => {
    try {
      const response = await api.get("/faculty_staff/capstones/filter/councils");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách hội đồng" };
    }
  },
  
  // Lấy danh sách capstones cho trang thống kê (với filter và pagination)
  getCapstonesByStatistics: async ({
    page = 1,
    itemsPerPage = 10,
    semester_id = "",
    status = "",
    lecturer_id = "",
    council_id = ""
  } = {}) => {
    try {
      const params = { page, itemsPerPage };
      if (semester_id && semester_id !== "all") params.semester_id = semester_id;
      if (status && status !== "all") params.status = status;
      if (lecturer_id && lecturer_id !== "all") params.lecturer_id = lecturer_id;
      if (council_id && council_id !== "all") params.council_id = council_id;
      
      const response = await api.get("/faculty_staff/capstones/statistics", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách đồ án" };
    }
  },
  
  // Lấy thống kê đồ án (gọi endpoint statistics với page=1 để lấy stats)
  getCapstoneStatistics: async () => {
    try {
      const response = await api.get("/faculty_staff/capstones/statistics", {
        params: { page: 1, itemsPerPage: 1 } // Chỉ lấy stats, không cần tất cả records
      });
      // Trả về format tương thích với component
      if (response.data?.data?.statistics) {
        return {
          success: true,
          data: response.data.data.statistics
        };
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải thống kê đồ án" };
    }
  },

  // Xuất báo cáo thống kê
  exportStatisticsReport: async (format = "excel", filters = {}) => {
    try {
      const params = {
        format,
        ...filters
      };
      const response = await api.get("/faculty_staff/capstones/statistics/export", {
        params,
        responseType: 'blob' // Nếu API trả về file
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi xuất báo cáo" };
    }
  },

  // ===== CANCELLATION REQUEST (YÊU CẦU HỦY ĐỒ ÁN) =====

  // Lấy danh sách yêu cầu hủy chờ duyệt (VPK)
  getPendingCancelRequests: async () => {
    try {
      const response = await api.get("/faculty_staff/capstones/cancellations");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách yêu cầu hủy" };
    }
  },

  // Phê duyệt hoặc từ chối yêu cầu hủy đồ án (VPK) - API riêng cho faculty_staff
  processCancelRequest: async (capstone_request_id, actionType, feedback = "") => {
    try {
      const action = actionType === "approve" ? "APPROVE" : "REJECT";
      // Sử dụng API mới riêng cho VPK (tránh conflict với lecturer)
      const response = await api.post(
        `/faculty_staff/capstones/cancel-requests/${capstone_request_id}/process`,
        {
          action,
          feedback
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi xử lý yêu cầu hủy" };
    }
  },
};

export default capstoneService;
