/* eslint-disable no-unused-vars */
// src/services/faculty/planService.js
import api from "../apiConfig";

const planService = {
  // ===== PLAN (KẾ HOẠCH HỌC KỲ) =====
  
  // Lấy danh sách kế hoạch (có phân trang và lọc)
  getPlans: async ({ page = 1, itemsPerPage = 5, search = "", year = "", semester = "" } = {}) => {
    try {
      const response = await api.get("/faculty/semesters", {
        params: { page, per_page: itemsPerPage, search, year, semester }
      });
      
      // Extract data from response - Backend returns: { success: true, message: "...", data: [...], meta: {...} }
      const semestersData = response.data.data || response.data || [];
      const paginationMeta = response.data.meta || { page, per_page: itemsPerPage, last_page: 1, total: 0 };
      
      // Transform API response to match UI expectations
      const transformedData = semestersData.map(sem => ({
        id: sem.semester_id,
        year: sem.academicYear?.year_name || sem.year_name || "",
        semester: sem.semester_name,
        start_date: sem.start_date,
        end_date: sem.end_date
      }));
      
      return {
        success: true,
        data: {
          plans: transformedData,
          pagination: {
            current_page: paginationMeta.page || page,
            total_pages: paginationMeta.last_page || 1,
            total_items: paginationMeta.total || 0,
            items_per_page: paginationMeta.per_page || itemsPerPage
          }
        },
        message: "Lấy danh sách kế hoạch thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách kế hoạch" };
    }
  },

  // Lấy chi tiết kế hoạch theo ID
  getPlanById: async (id) => {
    try {
      const response = await api.get(`/faculty/semesters/${id}`);
      
      // Transform API response to match UI expectations
      const semesterData = response.data.data || response.data;
      const transformedData = {
        id: semesterData.semester_id,
        year: semesterData.year_name,
        semester: semesterData.semester_name,
        start_date: semesterData.start_date,
        end_date: semesterData.end_date
      };
      
      return {
        success: true,
        data: transformedData,
        message: "Lấy thông tin kế hoạch thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải thông tin kế hoạch" };
    }
  },

  // Thêm kế hoạch mới (học kỳ mới)
  addPlan: async (planData) => {
    try {
      const response = await api.post("/faculty/semesters", {
        year_name: planData.year,
        semester_name: planData.semester,
        start_date: planData.start_date,
        end_date: planData.end_date
      });
      
      // Backend returns: { success: true, message: "...", data: { academic_year: {...}, semester: {...} } }
      const semesterData = response.data.data?.semester || response.data.data;
      const transformedData = {
        id: semesterData.semester_id,
        year: planData.year,
        semester: planData.semester,
        start_date: planData.start_date,
        end_date: planData.end_date
      };
      
      return {
        success: true,
        data: transformedData,
        message: response.data.message || "Thêm kế hoạch thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi thêm kế hoạch" };
    }
  },

  // Cập nhật kế hoạch
  updatePlan: async (id, planData) => {
    try {
      const response = await api.put(`/faculty/semesters/${id}`, {
        year_name: planData.year,
        semester_name: planData.semester,
        start_date: planData.start_date,
        end_date: planData.end_date
      });
      
      // Transform API response to match UI expectations
      const transformedData = {
        id: response.data.semester_id || id,
        year: planData.year,
        semester: planData.semester,
        start_date: planData.start_date,
        end_date: planData.end_date
      };
      
      return {
        success: true,
        data: transformedData,
        message: response.data.message || "Cập nhật kế hoạch thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi cập nhật kế hoạch" };
    }
  },

  // Xóa kế hoạch
  deletePlan: async (id) => {
    try {
      const response = await api.delete(`/faculty/semesters/${id}`);
      return {
        success: true,
        message: response.data.message || "Xóa kế hoạch thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi xóa kế hoạch" };
    }
  },

  // ===== MILESTONE (CÁC MỐC) =====
  
  // Lấy danh sách milestone theo kế hoạch (có phân trang)
  getMilestonesByPlanId: async (planId, { page = 1, itemsPerPage = 5 } = {}) => {
    try {
      const response = await api.get(`/faculty/semesters/${planId}/milestones`, {
        params: { page, per_page: itemsPerPage }
      });
      
      // Backend returns: { success: true, data: [...], meta: {...} }
      const milestonesData = response.data.data || response.data || [];
      const paginationMeta = response.data.meta || { page, per_page: itemsPerPage, last_page: 1, total: 0 };
      
      // Ensure each milestone has both 'id' and 'milestone_id' for compatibility
      const enrichedMilestones = milestonesData.map(m => ({
        ...m,
        id: m.milestone_id, // Add id field for compatibility with ViewPlan button onClick
      }));
      
      return {
        success: true,
        data: enrichedMilestones,
        pagination: {
          current_page: paginationMeta.page || page,
          total_pages: paginationMeta.last_page || 1,
          total_items: paginationMeta.total || 0,
          items_per_page: paginationMeta.per_page || itemsPerPage
        },
        message: "Lấy danh sách mốc thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách mốc" };
    }
  },

  // Lấy chi tiết milestone - DEPRECATED
  // Backend requires both semester_id and milestone_id
  // Use milestone data passed through route state from parent (ViewPlan) instead
  getMilestoneById: async (id) => {
    // This endpoint is not directly available from backend
    // Milestone details should be retrieved through: GET /faculty/semesters/{semesterId}/milestones/{id}
    // which requires both IDs. Frontend should pass milestone data via route state.
    throw new Error("Sử dụng dữ liệu mốc được truyền từ trang cha (ViewPlan) thay vì gọi API");
  },

  // Thêm milestone mới
  addMilestone: async (planId, milestoneData) => {
    try {
      const response = await api.post(`/faculty/semesters/${planId}/milestones`, {
        phase_name: milestoneData.phase_name,
        description: milestoneData.description,
        type: milestoneData.type,
        start_date: milestoneData.start_date,
        end_date: milestoneData.end_date
      });
      
      // Backend returns: { success: true, message: "...", data: {...} }
      const createdMilestone = response.data.data || response.data;
      // Ensure both id and milestone_id are present
      const enrichedMilestone = {
        ...createdMilestone,
        id: createdMilestone.milestone_id,
      };
      
      return {
        success: true,
        data: enrichedMilestone,
        message: response.data.message || "Thêm mốc thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi thêm mốc" };
    }
  },

  // Cập nhật milestone
  updateMilestone: async (id, milestoneData) => {
    try {
      const response = await api.put(`/faculty/milestones/${id}`, {
        phase_name: milestoneData.phase_name,
        description: milestoneData.description,
        type: milestoneData.type,
        start_date: milestoneData.start_date,
        end_date: milestoneData.end_date
      });
      
      // Backend returns: { success: true, message: "...", data: {...} }
      const updatedMilestone = response.data.data || response.data;
      // Ensure both id and milestone_id are present
      const enrichedMilestone = {
        ...updatedMilestone,
        id: updatedMilestone.milestone_id,
      };
      
      return {
        success: true,
        data: enrichedMilestone,
        message: response.data.message || "Cập nhật mốc thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi cập nhật mốc" };
    }
  },

  // Xóa milestone - NOT IMPLEMENTED in backend
  deleteMilestone: async (id) => {
    // Backend does not have a DELETE /faculty/milestones/{id} endpoint
    throw new Error("Chức năng xóa mốc thời gian chưa được triển khai trên backend");
  },

  // ===== PHASE NAME (TÊN GIAI ĐOẠN CỐ ĐỊNH) =====
  
  // Lấy danh sách phase names theo loại
  getPhaseNamesByType: async (type = null) => {
    try {
      const response = await api.get("/faculty/phase-names", {
        params: { type }
      });
      
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách tên giai đoạn thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách tên giai đoạn" };
    }
  },

  // Lấy phase name mặc định theo loại
  getDefaultPhaseName: async (type) => {
    try {
      const response = await api.get("/faculty/phase-names/default", {
        params: { type }
      });
      
      return {
        success: true,
        data: response.data,
        message: "Lấy tên giai đoạn mặc định thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải tên giai đoạn mặc định" };
    }
  },

  // Lấy tất cả phase names (dạng string)
  getAllPhaseNames: async () => {
    try {
      const response = await api.get("/faculty/phase-names/all");
      
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách tên giai đoạn thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách tên giai đoạn" };
    }
  },

  // ===== UTILITY =====
  
  // Lấy danh sách năm học unique
  getUniqueYears: async () => {
    try {
      const response = await api.get("/faculty/years");
      
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách năm học thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách năm học" };
    }
  },

  // Lấy danh sách học kỳ theo năm
  getSemestersByYear: async (year) => {
    try {
      const response = await api.get(`/faculty/years/${year}/semesters`);
      
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách học kỳ thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách học kỳ" };
    }
  },

  // Lấy danh sách loại mốc
  getMilestoneTypes: async () => {
    try {
      const response = await api.get("/faculty/milestone-types");
      
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách loại mốc thành công"
      };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách loại mốc" };
    }
  }
};

export default planService;