// src/services/faculty/lecturerService.js
import api from "../apiConfig";
import {
  mapLecturerFromBackend,
  mapLecturerDetailFromBackend
} from "./transformers";

const lecturerService = {
  // ===== LECTURER (GIẢNG VIÊN) =====
  
  // Lấy danh sách giảng viên (có phân trang và lọc)
  // Backend API: GET /faculty/lecturers
  getLecturers: async ({ 
    page = 1, 
    itemsPerPage = 5, 
    search = "", 
    status = "", 
    specialization = "" 
  } = {}) => {
    try {
      // Gọi real API backend (baseURL đã chứa v1)
      const response = await api.get("/faculty/lecturers");

      if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error("Invalid API response format");
      }

      // Transform data từ backend sang frontend format
      let transformedLecturers = response.data.data.map(mapLecturerFromBackend);

      // Manual filtering (client-side) vì backend không hỗ trợ params
      if (search) {
        transformedLecturers = transformedLecturers.filter(lec =>
          lec.name.toLowerCase().includes(search.toLowerCase()) ||
          lec.email.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (status && status !== "Tất cả") {
        transformedLecturers = transformedLecturers.filter(
          lec => lec.status === status
        );
      }

      if (specialization && specialization !== "Tất cả") {
        transformedLecturers = transformedLecturers.filter(
          lec => lec.specialization === specialization
        );
      }

      // Manual pagination
      const startIdx = (page - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const paginatedLecturers = transformedLecturers.slice(startIdx, endIdx);
      const totalPages = Math.ceil(transformedLecturers.length / itemsPerPage);

      return {
        success: true,
        data: {
          lecturers: paginatedLecturers,
          pagination: {
            current_page: page,
            total_pages: totalPages,
            total_items: transformedLecturers.length,
            items_per_page: itemsPerPage
          }
        },
        message: "Lấy danh sách giảng viên thành công"
      };
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Lỗi khi tải danh sách giảng viên",
        data: { lecturers: [], pagination: {} }
      };
    }
  },

  // Lấy chi tiết giảng viên theo ID
  // Backend API: GET /faculty_staff/lecturers/{id}
  getLecturerById: async (id) => {
    try {
      const response = await api.get(`/faculty_staff/lecturers/${id}`);
      const lecturerData = response.data.data || response.data;
      const transformedLecturer = mapLecturerDetailFromBackend(lecturerData);
      
      return {
        success: true,
        data: transformedLecturer,
        message: "Lấy thông tin giảng viên thành công"
      };
    } catch (error) {
      console.error(`Error fetching lecturer ${id}:`, error);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Không tìm thấy giảng viên"
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi tải thông tin giảng viên"
      };
    }
  },

  // Phê duyệt yêu cầu nghỉ phép
  // Backend API: POST /faculty_staff/lecturers/{id}/approve
  approveLeave: async (lecturerId) => {
    try {
      const response = await api.post(`/faculty_staff/lecturers/${lecturerId}/approve`);
      
      return {
        success: response.data.success ?? true,
        message: response.data.message || "Phê duyệt nghỉ phép thành công",
        data: response.data.data || {}
      };
    } catch (error) {
      console.error(`Error approving leave for lecturer ${lecturerId}:`, error);
      
      if (error.response?.status === 403) {
        return {
          success: false,
          message: "Bạn không có quyền duyệt yêu cầu này (cần role faculty_staff)"
        };
      }

      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Không tìm thấy yêu cầu nghỉ phép"
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi phê duyệt yêu cầu"
      };
    }
  },

  // Từ chối yêu cầu nghỉ phép
  // Backend API: POST /faculty_staff/lecturers/{id}/reject
  rejectLeave: async (lecturerId, feedback = "") => {
    try {
      const response = await api.post(`/faculty_staff/lecturers/${lecturerId}/reject`, {
        feedback: feedback || "Yêu cầu nghỉ phép bị từ chối"
      });
      
      return {
        success: response.data.success ?? true,
        message: response.data.message || "Từ chối yêu cầu nghỉ phép thành công",
        data: response.data.data || {}
      };
    } catch (error) {
      console.error(`Error rejecting leave for lecturer ${lecturerId}:`, error);
      
      if (error.response?.status === 403) {
        return {
          success: false,
          message: "Bạn không có quyền từ chối yêu cầu này (cần role faculty_staff)"
        };
      }

      if (error.response?.status === 404) {
        return {
          success: false,
          message: "Không tìm thấy yêu cầu nghỉ phép"
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || "Lỗi khi từ chối yêu cầu"
      };
    }
  },

  // Xử lý yêu cầu nghỉ phép (phương thức wrapper)
  processLeaveRequest: async (lecturerId, action = "approve", feedback = "") => {
    if (action === "approve") {
      return lecturerService.approveLeave(lecturerId);
    } else if (action === "reject") {
      return lecturerService.rejectLeave(lecturerId, feedback);
    } else {
      return {
        success: false,
        message: "Hanhđộng không hợp lệ"
      };
    }
  },
};

export default lecturerService;