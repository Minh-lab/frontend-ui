// src/services/faculty/lecturerService.js
import api from "../apiConfig";
import { 
  MOCK_LECTURERS,
  MOCK_LECTURER_DETAILS,
  LECTURER_SPECIALIZATIONS,
  STATUS_OPTIONS,
  DEGREES,
  simulateApiDelay,
  filterLecturers,
  getLecturerDetail,
  processLeaveRequest,
  paginateLecturers,
  getLecturerStatistics
} from "@/data/facultyData";
import { USE_MOCK } from './index';

const lecturerService = {
  // ===== LECTURER (GIẢNG VIÊN) =====
  
  // Lấy danh sách giảng viên (có phân trang và lọc)
  getLecturers: async ({ 
    page = 1, 
    itemsPerPage = 5, 
    search = "", 
    status = "", 
    specialization = "" 
  } = {}) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        // Lọc dữ liệu
        const filteredLecturers = filterLecturers(search, status, specialization);
        
        // Phân trang
        const paginatedResult = paginateLecturers(filteredLecturers, page, itemsPerPage);
        
        return {
          success: true,
          data: {
            lecturers: paginatedResult.data,
            pagination: {
              current_page: paginatedResult.currentPage,
              total_pages: paginatedResult.totalPages,
              total_items: paginatedResult.total,
              items_per_page: paginatedResult.itemsPerPage
            }
          },
          message: "Lấy danh sách giảng viên thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách giảng viên"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/lecturers", {
          params: { page, itemsPerPage, search, status, specialization }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách giảng viên" };
      }
    }
  },

  // Lấy chi tiết giảng viên theo ID
  getLecturerById: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        const lecturer = getLecturerDetail(id);
        
        if (lecturer) {
          return {
            success: true,
            data: lecturer,
            message: "Lấy thông tin giảng viên thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy giảng viên"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy thông tin giảng viên"
        };
      }
    } else {
      try {
        const response = await api.get(`/faculty/lecturers/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải thông tin giảng viên" };
      }
    }
  },

  // Thêm giảng viên mới
  addLecturer: async (lecturerData) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        // Tạo ID mới
        const newId = `gv${String(MOCK_LECTURERS.length + 1).padStart(3, '0')}`;
        
        const newLecturer = {
          id: newId,
          name: lecturerData.full_name,
          specialization: lecturerData.specialization,
          status: lecturerData.status || "Hoạt động"
        };
        
        // Thêm vào danh sách
        MOCK_LECTURERS.push(newLecturer);
        
        // Thêm vào chi tiết
        MOCK_LECTURER_DETAILS[newId] = {
          id: newId,
          ...lecturerData,
          status: lecturerData.status || "Hoạt động",
          leave_request: null
        };
        
        return {
          success: true,
          data: MOCK_LECTURER_DETAILS[newId],
          message: "Thêm giảng viên thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi thêm giảng viên"
        };
      }
    } else {
      try {
        const response = await api.post("/faculty/lecturers", lecturerData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi thêm giảng viên" };
      }
    }
  },

  // Cập nhật thông tin giảng viên
  updateLecturer: async (id, lecturerData) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        // Cập nhật trong danh sách
        const lecturerIndex = MOCK_LECTURERS.findIndex(l => l.id === id);
        if (lecturerIndex !== -1) {
          MOCK_LECTURERS[lecturerIndex] = {
            ...MOCK_LECTURERS[lecturerIndex],
            name: lecturerData.full_name || MOCK_LECTURERS[lecturerIndex].name,
            specialization: lecturerData.specialization || MOCK_LECTURERS[lecturerIndex].specialization,
            status: lecturerData.status || MOCK_LECTURERS[lecturerIndex].status
          };
        }
        
        // Cập nhật chi tiết
        if (MOCK_LECTURER_DETAILS[id]) {
          MOCK_LECTURER_DETAILS[id] = {
            ...MOCK_LECTURER_DETAILS[id],
            ...lecturerData
          };
        }
        
        return {
          success: true,
          data: MOCK_LECTURER_DETAILS[id],
          message: "Cập nhật thông tin giảng viên thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi cập nhật giảng viên"
        };
      }
    } else {
      try {
        const response = await api.put(`/faculty/lecturers/${id}`, lecturerData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi cập nhật giảng viên" };
      }
    }
  },

  // Xóa giảng viên
  deleteLecturer: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        // Xóa khỏi danh sách
        const lecturerIndex = MOCK_LECTURERS.findIndex(l => l.id === id);
        if (lecturerIndex !== -1) {
          MOCK_LECTURERS.splice(lecturerIndex, 1);
        }
        
        // Xóa khỏi chi tiết
        delete MOCK_LECTURER_DETAILS[id];
        
        return {
          success: true,
          message: "Xóa giảng viên thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi xóa giảng viên"
        };
      }
    } else {
      try {
        const response = await api.delete(`/faculty/lecturers/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi xóa giảng viên" };
      }
    }
  },

  // ===== LEAVE REQUEST (ĐƠN NGHỈ PHÉP) =====
  
  // Lấy danh sách đơn nghỉ phép
  getLeaveRequests: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const leaveRequests = Object.values(MOCK_LECTURER_DETAILS)
          .filter(lecturer => lecturer.status === "Yêu cầu nghỉ phép" && lecturer.leave_request)
          .map(lecturer => ({
            lecturer_id: lecturer.id,
            lecturer_name: lecturer.full_name,
            ...lecturer.leave_request
          }));
        
        return {
          success: true,
          data: leaveRequests,
          message: "Lấy danh sách đơn nghỉ phép thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách đơn nghỉ phép"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/leave-requests");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách đơn nghỉ phép" };
      }
    }
  },

  // Xử lý đơn nghỉ phép (duyệt/từ chối)
  processLeaveRequest: async (lecturerId, action) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const result = processLeaveRequest(lecturerId, action);
        
        if (result.success) {
          return {
            success: true,
            data: result.data,
            message: result.message
          };
        } else {
          return {
            success: false,
            message: result.message
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi xử lý đơn nghỉ phép"
        };
      }
    } else {
      try {
        const response = await api.post(`/faculty/leave-requests/${lecturerId}`, { action });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi xử lý đơn nghỉ phép" };
      }
    }
  },

  // Gửi đơn nghỉ phép (cho giảng viên)
  submitLeaveRequest: async (lecturerId, requestData) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        if (MOCK_LECTURER_DETAILS[lecturerId]) {
          MOCK_LECTURER_DETAILS[lecturerId].status = "Yêu cầu nghỉ phép";
          MOCK_LECTURER_DETAILS[lecturerId].leave_request = {
            description: requestData.description,
            file_path: requestData.file_path,
            start_date: requestData.start_date,
            end_date: requestData.end_date
          };
          
          // Cập nhật trong danh sách
          const lecturerIndex = MOCK_LECTURERS.findIndex(l => l.id === lecturerId);
          if (lecturerIndex !== -1) {
            MOCK_LECTURERS[lecturerIndex].status = "Yêu cầu nghỉ phép";
          }
          
          return {
            success: true,
            data: MOCK_LECTURER_DETAILS[lecturerId].leave_request,
            message: "Gửi đơn nghỉ phép thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy giảng viên"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi gửi đơn nghỉ phép"
        };
      }
    } else {
      try {
        const response = await api.post(`/faculty/lecturers/${lecturerId}/leave-request`, requestData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi gửi đơn nghỉ phép" };
      }
    }
  },

  // ===== UTILITY =====
  
  // Lấy danh sách chuyên môn
  getSpecializations: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        return {
          success: true,
          data: LECTURER_SPECIALIZATIONS.filter(s => s !== "Tất cả"),
          message: "Lấy danh sách chuyên môn thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách chuyên môn"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/lecturer-specializations");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách chuyên môn" };
      }
    }
  },

  // Lấy danh sách trạng thái
  getStatusOptions: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        return {
          success: true,
          data: STATUS_OPTIONS.filter(s => s !== "Tất cả"),
          message: "Lấy danh sách trạng thái thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách trạng thái"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/lecturer-statuses");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách trạng thái" };
      }
    }
  },

  // Lấy danh sách học vị
  getDegrees: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        return {
          success: true,
          data: DEGREES,
          message: "Lấy danh sách học vị thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách học vị"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/degrees");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách học vị" };
      }
    }
  },

  // Lấy thống kê giảng viên
  getLecturerStatistics: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        return {
          success: true,
          data: getLecturerStatistics(),
          message: "Lấy thống kê giảng viên thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy thống kê giảng viên"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/lecturer-statistics");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải thống kê giảng viên" };
      }
    }
  }
};

export default lecturerService;