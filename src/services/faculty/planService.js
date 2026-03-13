// src/services/faculty/planService.js
import api from "../apiConfig";
import { 
  MOCK_PLANS,
  MOCK_SEMESTERS,
  MOCK_MILESTONES,
  MOCK_MILESTONE_TYPES,
  PHASE_NAMES,
  simulateApiDelay,
  getPlanById,
  getMilestoneById,
  getMilestonesBySemester,
  getPhaseNamesByType,
  getDefaultPhaseName,
  getAllPhaseNames,
  filterPlans,
  paginatePlans,
  getUniqueYears,
  getSemestersByYear,
  // eslint-disable-next-line no-unused-vars
  getAllMilestones
} from "@/data/facultyData";
import { USE_MOCK } from './index';

const planService = {
  // ===== PLAN (KẾ HOẠCH HỌC KỲ) =====
  
  // Lấy danh sách kế hoạch (có phân trang và lọc)
  getPlans: async ({ page = 1, itemsPerPage = 5, search = "", year = "", semester = "" } = {}) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        // Lọc dữ liệu
        const filteredPlans = filterPlans(search, year, semester);
        
        // Phân trang
        const paginatedResult = paginatePlans(filteredPlans, page, itemsPerPage);
        
        return {
          success: true,
          data: {
            plans: paginatedResult.data,
            pagination: {
              current_page: paginatedResult.currentPage,
              total_pages: paginatedResult.totalPages,
              total_items: paginatedResult.total,
              items_per_page: paginatedResult.itemsPerPage
            }
          },
          message: "Lấy danh sách kế hoạch thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách kế hoạch"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/plans", {
          params: { page, itemsPerPage, search, year, semester }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách kế hoạch" };
      }
    }
  },

  // Lấy chi tiết kế hoạch theo ID
  getPlanById: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        const plan = getPlanById(id);
        
        if (plan) {
          return {
            success: true,
            data: plan,
            message: "Lấy thông tin kế hoạch thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy kế hoạch"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy thông tin kế hoạch"
        };
      }
    } else {
      try {
        const response = await api.get(`/faculty/plans/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải thông tin kế hoạch" };
      }
    }
  },

  // Thêm kế hoạch mới (học kỳ mới)
  addPlan: async (planData) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        // Tạo ID mới
        const newId = Math.max(...MOCK_SEMESTERS.map(s => s.id)) + 1;
        
        const newSemester = {
          id: newId,
          year: planData.year,
          semester: planData.semester,
          start_date: planData.start_date,
          end_date: planData.end_date
        };
        
        // Thêm vào mảng semester
        MOCK_SEMESTERS.push(newSemester);
        
        // Tạo plan mới
        const newPlan = {
          id: newId,
          year: planData.year,
          semester: planData.semester,
          start_date: planData.start_date,
          end_date: planData.end_date,
          milestones: []
        };
        
        // Thêm vào mảng plans
        MOCK_PLANS.push(newPlan);
        
        return {
          success: true,
          data: newPlan,
          message: "Thêm kế hoạch thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi thêm kế hoạch"
        };
      }
    } else {
      try {
        const response = await api.post("/faculty/plans", planData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi thêm kế hoạch" };
      }
    }
  },

  // Cập nhật kế hoạch
  updatePlan: async (id, planData) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const index = MOCK_SEMESTERS.findIndex(s => s.id === Number(id));
        
        if (index !== -1) {
          // Cập nhật semester
          MOCK_SEMESTERS[index] = {
            ...MOCK_SEMESTERS[index],
            year: planData.year || MOCK_SEMESTERS[index].year,
            semester: planData.semester || MOCK_SEMESTERS[index].semester,
            start_date: planData.start_date || MOCK_SEMESTERS[index].start_date,
            end_date: planData.end_date || MOCK_SEMESTERS[index].end_date
          };
          
          // Cập nhật plan
          const planIndex = MOCK_PLANS.findIndex(p => p.id === Number(id));
          if (planIndex !== -1) {
            MOCK_PLANS[planIndex] = {
              ...MOCK_PLANS[planIndex],
              ...planData
            };
          }
          
          return {
            success: true,
            data: MOCK_SEMESTERS[index],
            message: "Cập nhật kế hoạch thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy kế hoạch"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi cập nhật kế hoạch"
        };
      }
    } else {
      try {
        const response = await api.put(`/faculty/plans/${id}`, planData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi cập nhật kế hoạch" };
      }
    }
  },

  // Xóa kế hoạch
  deletePlan: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const semesterIndex = MOCK_SEMESTERS.findIndex(s => s.id === Number(id));
        const planIndex = MOCK_PLANS.findIndex(p => p.id === Number(id));
        const milestonesToDelete = MOCK_MILESTONES.filter(m => m.semester_id === Number(id));
        
        if (semesterIndex !== -1) {
          // Xóa semester
          MOCK_SEMESTERS.splice(semesterIndex, 1);
          
          // Xóa plan
          if (planIndex !== -1) {
            MOCK_PLANS.splice(planIndex, 1);
          }
          
          // Xóa các milestone liên quan
          milestonesToDelete.forEach(m => {
            const milestoneIndex = MOCK_MILESTONES.findIndex(ms => ms.id === m.id);
            if (milestoneIndex !== -1) {
              MOCK_MILESTONES.splice(milestoneIndex, 1);
            }
          });
          
          return {
            success: true,
            message: "Xóa kế hoạch thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy kế hoạch"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi xóa kế hoạch"
        };
      }
    } else {
      try {
        const response = await api.delete(`/faculty/plans/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi xóa kế hoạch" };
      }
    }
  },

  // ===== MILESTONE (CÁC MỐC) =====
  
  // Lấy danh sách milestone theo kế hoạch (có phân trang)
  getMilestonesByPlanId: async (planId, { page = 1, itemsPerPage = 5 } = {}) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        const result = getMilestonesBySemester(planId, page, itemsPerPage);
        
        return {
          success: true,
          data: result.data,
          pagination: result.pagination,
          message: "Lấy danh sách mốc thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách mốc"
        };
      }
    } else {
      try {
        const response = await api.get(`/faculty/plans/${planId}/milestones`, {
          params: { page, itemsPerPage }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách mốc" };
      }
    }
  },

  // Lấy chi tiết milestone
  getMilestoneById: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        const milestone = getMilestoneById(id);
        
        if (milestone) {
          return {
            success: true,
            data: milestone,
            message: "Lấy thông tin mốc thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy mốc"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy thông tin mốc"
        };
      }
    } else {
      try {
        const response = await api.get(`/faculty/milestones/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải thông tin mốc" };
      }
    }
  },

  // Thêm milestone mới
  addMilestone: async (planId, milestoneData) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        // Tạo ID mới
        const newId = Math.max(...MOCK_MILESTONES.map(m => m.id)) + 1;
        
        const newMilestone = {
          id: newId,
          semester_id: Number(planId),
          phase_name: milestoneData.phase_name,
          description: milestoneData.description,
          type: milestoneData.type,
          start_date: milestoneData.start_date,
          end_date: milestoneData.end_date
        };
        
        // Thêm vào mảng milestones
        MOCK_MILESTONES.push(newMilestone);
        
        return {
          success: true,
          data: newMilestone,
          message: "Thêm mốc thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi thêm mốc"
        };
      }
    } else {
      try {
        const response = await api.post(`/faculty/plans/${planId}/milestones`, milestoneData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi thêm mốc" };
      }
    }
  },

  // Cập nhật milestone
  updateMilestone: async (id, milestoneData) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const index = MOCK_MILESTONES.findIndex(m => m.id === Number(id));
        
        if (index !== -1) {
          MOCK_MILESTONES[index] = {
            ...MOCK_MILESTONES[index],
            ...milestoneData
          };
          
          return {
            success: true,
            data: MOCK_MILESTONES[index],
            message: "Cập nhật mốc thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy mốc"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi cập nhật mốc"
        };
      }
    } else {
      try {
        const response = await api.put(`/faculty/milestones/${id}`, milestoneData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi cập nhật mốc" };
      }
    }
  },

  // Xóa milestone
  deleteMilestone: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const index = MOCK_MILESTONES.findIndex(m => m.id === Number(id));
        
        if (index !== -1) {
          MOCK_MILESTONES.splice(index, 1);
          
          return {
            success: true,
            message: "Xóa mốc thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy mốc"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi xóa mốc"
        };
      }
    } else {
      try {
        const response = await api.delete(`/faculty/milestones/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi xóa mốc" };
      }
    }
  },

  // ===== PHASE NAME (TÊN GIAI ĐOẠN CỐ ĐỊNH) =====
  
  // Lấy danh sách phase names theo loại
  getPhaseNamesByType: async (type = null) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        return {
          success: true,
          data: getPhaseNamesByType(type),
          message: "Lấy danh sách tên giai đoạn thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách tên giai đoạn"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/phase-names", {
          params: { type }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách tên giai đoạn" };
      }
    }
  },

  // Lấy phase name mặc định theo loại
  getDefaultPhaseName: async (type) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        return {
          success: true,
          data: getDefaultPhaseName(type),
          message: "Lấy tên giai đoạn mặc định thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy tên giai đoạn mặc định"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/phase-names/default", {
          params: { type }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải tên giai đoạn mặc định" };
      }
    }
  },

  // Lấy tất cả phase names (dạng string)
  getAllPhaseNames: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        return {
          success: true,
          data: getAllPhaseNames(),
          message: "Lấy danh sách tên giai đoạn thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách tên giai đoạn"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/phase-names/all");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách tên giai đoạn" };
      }
    }
  },

  // ===== UTILITY =====
  
  // Lấy danh sách năm học unique
  getUniqueYears: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        return {
          success: true,
          data: getUniqueYears(),
          message: "Lấy danh sách năm học thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách năm học"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/years");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách năm học" };
      }
    }
  },

  // Lấy danh sách học kỳ theo năm
  getSemestersByYear: async (year) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        return {
          success: true,
          data: getSemestersByYear(year),
          message: "Lấy danh sách học kỳ thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách học kỳ"
        };
      }
    } else {
      try {
        const response = await api.get(`/faculty/years/${year}/semesters`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách học kỳ" };
      }
    }
  },

  // Lấy danh sách loại mốc
  getMilestoneTypes: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        return {
          success: true,
          data: MOCK_MILESTONE_TYPES,
          message: "Lấy danh sách loại mốc thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách loại mốc"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/milestone-types");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách loại mốc" };
      }
    }
  }
};

export default planService;