// src/services/faculty/capstoneService.js
import api from "../apiConfig";
import { 
  MOCK_CAPSTONES,
  MOCK_COUNCILS,
  COUNCIL_MEMBERS,
  CAPSTONE_LECTURERS as MOCK_LECTURERS,
  MOCK_REGISTRATIONS,
  CAPSTONE_STATUS,
  CAPSTONE_STATISTICS,
  simulateApiDelay,
  filterCapstones,
  filterRegistrations,
  getCouncilById,
  getCouncilMembers,
  getLecturerById,
  paginateData,
  calculateCapstoneStatistics,
  handleCancelCapstone
} from "@/data/facultyData";
import { USE_MOCK } from './index';

const capstoneService = {
  // ===== CAPSTONE (ĐỒ ÁN) =====
  
  // Lấy danh sách đồ án (có phân trang và lọc)
  getCapstones: async ({ 
    page = 1, 
    itemsPerPage = 10, 
    search = "", 
    status = "", 
    major = "", 
    lecturer = "" 
  } = {}) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        // Lọc dữ liệu
        const filteredCapstones = filterCapstones(search, status, major, lecturer);
        
        // Phân trang
        const paginatedResult = paginateData(filteredCapstones, page, itemsPerPage);
        
        return {
          success: true,
          data: {
            capstones: paginatedResult.data,
            pagination: {
              current_page: paginatedResult.currentPage,
              total_pages: paginatedResult.totalPages,
              total_items: paginatedResult.total,
              items_per_page: paginatedResult.itemsPerPage
            }
          },
          message: "Lấy danh sách đồ án thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách đồ án"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/capstones", {
          params: { page, itemsPerPage, search, status, major, lecturer }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách đồ án" };
      }
    }
  },

  // Lấy chi tiết đồ án theo ID
  getCapstoneById: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        const capstone = MOCK_CAPSTONES.find(c => c.id === id);
        
        if (capstone) {
          return {
            success: true,
            data: capstone,
            message: "Lấy thông tin đồ án thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy đồ án"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy thông tin đồ án"
        };
      }
    } else {
      try {
        const response = await api.get(`/faculty/capstones/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải thông tin đồ án" };
      }
    }
  },

  // Cập nhật thông tin đồ án (phân công GVHD, phản biện, hội đồng)
  updateCapstone: async (id, capstoneData) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const index = MOCK_CAPSTONES.findIndex(c => c.id === id);
        
        if (index !== -1) {
          MOCK_CAPSTONES[index] = {
            ...MOCK_CAPSTONES[index],
            ...capstoneData
          };
          
          return {
            success: true,
            data: MOCK_CAPSTONES[index],
            message: "Cập nhật đồ án thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy đồ án"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi cập nhật đồ án"
        };
      }
    } else {
      try {
        const response = await api.put(`/faculty/capstones/${id}`, capstoneData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi cập nhật đồ án" };
      }
    }
  },

  // Xóa đồ án
  deleteCapstone: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const index = MOCK_CAPSTONES.findIndex(c => c.id === id);
        
        if (index !== -1) {
          MOCK_CAPSTONES.splice(index, 1);
          
          return {
            success: true,
            message: "Xóa đồ án thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy đồ án"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi xóa đồ án"
        };
      }
    } else {
      try {
        const response = await api.delete(`/faculty/capstones/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi xóa đồ án" };
      }
    }
  },

  // ===== COUNCIL (HỘI ĐỒNG) =====
  
  // Lấy danh sách hội đồng
  getCouncils: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        return {
          success: true,
          data: MOCK_COUNCILS,
          message: "Lấy danh sách hội đồng thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách hội đồng"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/councils");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách hội đồng" };
      }
    }
  },

  // Lấy chi tiết hội đồng
  getCouncilById: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        const council = getCouncilById(id);
        
        if (council) {
          return {
            success: true,
            data: council,
            message: "Lấy thông tin hội đồng thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy hội đồng"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy thông tin hội đồng"
        };
      }
    } else {
      try {
        const response = await api.get(`/faculty/councils/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải thông tin hội đồng" };
      }
    }
  },

  // Lấy danh sách thành viên hội đồng
  getCouncilMembers: async (councilId) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        const members = getCouncilMembers(councilId);
        
        return {
          success: true,
          data: members,
          message: "Lấy danh sách thành viên hội đồng thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách thành viên hội đồng"
        };
      }
    } else {
      try {
        const response = await api.get(`/faculty/councils/${councilId}/members`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách thành viên hội đồng" };
      }
    }
  },

  // Thêm hội đồng mới
  addCouncil: async (councilData) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const newId = `hd${MOCK_COUNCILS.length + 1}`;
        const newCouncil = {
          id: newId,
          ...councilData,
          color: "bg-[#65d68d]"
        };
        
        MOCK_COUNCILS.push(newCouncil);
        
        return {
          success: true,
          data: newCouncil,
          message: "Thêm hội đồng thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi thêm hội đồng"
        };
      }
    } else {
      try {
        const response = await api.post("/faculty/councils", councilData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi thêm hội đồng" };
      }
    }
  },

  // Cập nhật hội đồng
  updateCouncil: async (id, councilData) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const index = MOCK_COUNCILS.findIndex(c => c.id === id);
        
        if (index !== -1) {
          MOCK_COUNCILS[index] = {
            ...MOCK_COUNCILS[index],
            ...councilData
          };
          
          return {
            success: true,
            data: MOCK_COUNCILS[index],
            message: "Cập nhật hội đồng thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy hội đồng"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi cập nhật hội đồng"
        };
      }
    } else {
      try {
        const response = await api.put(`/faculty/councils/${id}`, councilData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi cập nhật hội đồng" };
      }
    }
  },

  // Xóa hội đồng
  deleteCouncil: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const index = MOCK_COUNCILS.findIndex(c => c.id === id);
        
        if (index !== -1) {
          MOCK_COUNCILS.splice(index, 1);
          
          return {
            success: true,
            message: "Xóa hội đồng thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy hội đồng"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi xóa hội đồng"
        };
      }
    } else {
      try {
        const response = await api.delete(`/faculty/councils/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi xóa hội đồng" };
      }
    }
  },

  // ===== LECTURER (GIẢNG VIÊN) =====
  
  // Lấy danh sách giảng viên
  getLecturers: async ({ search = "", major = "" } = {}) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        let filtered = MOCK_LECTURERS;
        
        if (search) {
          filtered = filtered.filter(l => 
            l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.id.includes(search)
          );
        }
        
        if (major) {
          filtered = filtered.filter(l => l.major === major);
        }
        
        return {
          success: true,
          data: filtered,
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
          params: { search, major }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách giảng viên" };
      }
    }
  },

  // Lấy chi tiết giảng viên
  getLecturerById: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        const lecturer = getLecturerById(id);
        
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

  // Cập nhật số lượng sinh viên hướng dẫn
  updateLecturerQuota: async (id, current, max) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const index = MOCK_LECTURERS.findIndex(l => l.id === id);
        
        if (index !== -1) {
          MOCK_LECTURERS[index].current = current;
          MOCK_LECTURERS[index].max = max;
          
          return {
            success: true,
            data: MOCK_LECTURERS[index],
            message: "Cập nhật quota giảng viên thành công"
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
          message: error.message || "Lỗi khi cập nhật quota giảng viên"
        };
      }
    } else {
      try {
        const response = await api.put(`/faculty/lecturers/${id}/quota`, { current, max });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi cập nhật quota giảng viên" };
      }
    }
  },

  // ===== REGISTRATION (ĐĂNG KÝ ĐỒ ÁN) =====
  // src/services/faculty/capstoneService.js (phần cập nhật)

  
  // Lấy danh sách đăng ký đồ án (chờ duyệt)
  getRegistrations: async ({ 
    page = 1, 
    itemsPerPage = 10, 
    search = "", 
    status = "Chờ duyệt", 
    major = "" 
  } = {}) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        // Lọc dữ liệu
        const filtered = filterRegistrations(search, status, major);
        
        // Phân trang
        const paginatedResult = paginateData(filtered, page, itemsPerPage);
        
        return {
          success: true,
          data: {
            registrations: paginatedResult.data,
            pagination: {
              current_page: paginatedResult.currentPage,
              total_pages: paginatedResult.totalPages,
              total_items: paginatedResult.total,
              items_per_page: paginatedResult.itemsPerPage
            }
          },
          message: "Lấy danh sách đăng ký thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách đăng ký"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/registrations", {
          params: { page, itemsPerPage, search, status, major }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách đăng ký" };
      }
    }
  },

  // Duyệt đăng ký đồ án
  approveRegistration: async (id) => {
  if (USE_MOCK) {
    try {
      await simulateApiDelay();
      
      const regIndex = MOCK_REGISTRATIONS.findIndex(r => r.id === id);
      
      if (regIndex !== -1) {
        const registration = MOCK_REGISTRATIONS[regIndex];
        
        // Xóa khỏi danh sách đăng ký
        MOCK_REGISTRATIONS.splice(regIndex, 1);
        
        // Thêm vào danh sách đồ án chính (chưa có GVHD)
        const newCapstone = {
          id: registration.id,
          name: registration.name,
          class: registration.class,
          topic: registration.topic,
          status: "Đã duyệt",
          gvhd: "",
          gvpb: "",
          council: "",
          score: "",
          major: registration.major,
          description: registration.description,
          registration_date: registration.registration_date || new Date().toISOString().split('T')[0]
        };
        
        MOCK_CAPSTONES.push(newCapstone);
        
        return {
          success: true,
          data: newCapstone,
          message: "Duyệt đồ án thành công"
        };
      } else {
        return {
          success: false,
          message: "Không tìm thấy đăng ký"
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "Lỗi khi duyệt đồ án"
      };
    }
  } else {
    try {
      const response = await api.post(`/faculty/registrations/${id}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi duyệt đồ án" };
    }
  }
},

  // Từ chối đăng ký đồ án (không cần lý do)
  rejectRegistration: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const index = MOCK_REGISTRATIONS.findIndex(r => r.id === id);
        
        if (index !== -1) {
          // Xóa khỏi danh sách đăng ký hoặc đánh dấu là đã từ chối
          MOCK_REGISTRATIONS.splice(index, 1);
          
          return {
            success: true,
            message: "Từ chối đồ án thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy đăng ký"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi từ chối đồ án"
        };
      }
    } else {
      try {
        const response = await api.post(`/faculty/registrations/${id}/reject`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi từ chối đồ án" };
      }
    }
  },

  // ===== UTILITY =====
  
  // Lấy danh sách trạng thái đồ án
  getCapstoneStatuses: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        return {
          success: true,
          data: CAPSTONE_STATUS,
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
        const response = await api.get("/faculty/capstone-statuses");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách trạng thái" };
      }
    }
  },

  // Lấy danh sách chuyên ngành từ đồ án
  getCapstoneMajors: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        const majors = [...new Set(MOCK_CAPSTONES.map(c => c.major))];
        return {
          success: true,
          data: majors,
          message: "Lấy danh sách chuyên ngành thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách chuyên ngành"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/capstone-majors");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách chuyên ngành" };
      }
    }
  },
  // ===== STATISTICS (THỐNG KÊ) =====
  
  // Lấy thống kê đồ án
  // eslint-disable-next-line no-dupe-keys
  getCapstoneStatistics: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        // Sử dụng hàm calculateCapstoneStatistics để tính toán real-time
        const stats = calculateCapstoneStatistics();
        
        return {
          success: true,
          data: stats,
          message: "Lấy thống kê đồ án thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy thống kê đồ án"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/capstone-statistics");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải thống kê đồ án" };
      }
    }
  },

  // Lấy thống kê theo hội đồng
  getCouncilStatistics: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const councilStats = MOCK_COUNCILS.map(council => {
          const members = COUNCIL_MEMBERS.filter(m => m.council === council.id);
          const capstonesInCouncil = MOCK_CAPSTONES.filter(c => c.council === council.name);
          
          return {
            council_id: council.id,
            council_name: council.name,
            total_members: members.length,
            total_capstones: capstonesInCouncil.length,
            completed_capstones: capstonesInCouncil.filter(c => c.status === "Đã hoàn thành").length,
            avg_score: capstonesInCouncil.filter(c => c.score && c.score !== "---").reduce((acc, c) => acc + parseFloat(c.score), 0) / capstonesInCouncil.filter(c => c.score && c.score !== "---").length || 0,
            dates: council.dates,
            location: council.location
          };
        });
        
        return {
          success: true,
          data: councilStats,
          message: "Lấy thống kê theo hội đồng thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy thống kê theo hội đồng"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/council-statistics");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải thống kê theo hội đồng" };
      }
    }
  },

  // Lấy thống kê theo giảng viên
  getLecturerStatistics: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const lecturerStats = MOCK_LECTURERS.map(lecturer => {
          const capstonesByLecturer = MOCK_CAPSTONES.filter(c => c.gvhd === lecturer.name);
          
          return {
            lecturer_id: lecturer.id,
            lecturer_name: lecturer.name,
            major: lecturer.major,
            current_students: capstonesByLecturer.length,
            max_students: lecturer.max,
            completed_students: capstonesByLecturer.filter(c => c.status === "Đã hoàn thành").length,
            available_slots: lecturer.max - capstonesByLecturer.length
          };
        });
        
        return {
          success: true,
          data: lecturerStats,
          message: "Lấy thống kê theo giảng viên thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy thống kê theo giảng viên"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/lecturer-statistics");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải thống kê theo giảng viên" };
      }
    }
  },

  // Xuất báo cáo thống kê
  exportStatisticsReport: async (format = "excel", filters = {}) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        // Trong mock, chỉ trả về thành công
        return {
          success: true,
          data: {
            download_url: "/mock-reports/capstone-statistics.xlsx",
            format: format,
            generated_at: new Date().toISOString()
          },
          message: "Xuất báo cáo thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi xuất báo cáo"
        };
      }
    } else {
      try {
        const response = await api.post("/faculty/export-statistics", {
          format,
          ...filters
        }, {
          responseType: 'blob' // Nếu API trả về file
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi xuất báo cáo" };
      }
    }
  },

  processCancelRequest: async (id, action) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const result = handleCancelCapstone(id, action);
        
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
          message: error.message || "Lỗi khi xử lý yêu cầu hủy đồ án"
        };
      }
    } else {
      try {
        const response = await api.post(`/faculty/capstones/${id}/cancel-request`, { action });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi xử lý yêu cầu hủy đồ án" };
      }
    }
  },

};



export default capstoneService;