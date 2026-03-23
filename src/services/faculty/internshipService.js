import api from "../apiConfig";

const internshipService = {
  // ===== STUDENT INTERNSHIP (SINH VIÊN) =====
  
  /**
   * UC 33: Lấy trạng thái thực tập hiện tại
   * GET /internships/status
   */
  getStatus: async () => {
    try {
      const response = await api.get("/internships/status");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải trạng thái thực tập" };
    }
  },

  /**
   * UC 34: Lấy danh sách doanh nghiệp có sẵn
   * GET /internships/available-companies  
   */
  getAvailableCompanies: async () => {
    try {
      const response = await api.get("/internships/available-companies");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách doanh nghiệp" };
    }
  },

  // ===== FACULTY STAFF - COMPANY APPROVAL (DUYỆT DOANH NGHIỆP) =====
  
  /**
   * UC 42: Lấy danh sách yêu cầu doanh nghiệp chờ duyệt
   * GET /faculty_staff/internships/pending
   */
  getPendingCompanyRequests: async () => {
    try {
      const response = await api.get("/faculty_staff/internships/pending");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách yêu cầu doanh nghiệp" };
    }
  },

  /**
   * UC 42: Duyệt yêu cầu doanh nghiệp
   * POST /faculty_staff/internships/approve/{id}
   */
  approveCompanyRequest: async (id) => {
    try {
      const response = await api.post(`/faculty_staff/internships/approve/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi duyệt yêu cầu doanh nghiệp" };
    }
  },

  /**
   * UC 42: Lấy chi tiết yêu cầu doanh nghiệp (công ty + danh sách sinh viên)
   * GET /faculty_staff/internships/pending/{id}
   */
  getCompanyApprovalDetail: async (id) => {
    try {
      const response = await api.get(`/faculty_staff/internships/pending/${id}`);
      return {
        success: true,
        data: response.data?.data || response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi tải chi tiết yêu cầu doanh nghiệp"
      };
    }
  },

  /**
   * UC 42: Cập nhật thông tin doanh nghiệp đề xuất
   * PUT /faculty_staff/internships/proposed-companies/{proposedCompanyId}
   */
  updateProposedCompany: async (proposedCompanyId, companyInfo) => {
    try {
      const response = await api.put(`/faculty_staff/internships/proposed-companies/${proposedCompanyId}`, {
        name: companyInfo.name,
        tax_code: companyInfo.tax_code,
        address: companyInfo.address,
        contact_email: companyInfo.email,
        website: companyInfo.website,
      });
      return {
        success: true,
        message: response.data?.message || "Cập nhật thông tin doanh nghiệp thành công",
        data: response.data?.data || {}
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi cập nhật thông tin doanh nghiệp"
      };
    }
  },

  /**
   * UC 42: Phê duyệt danh sách sinh viên cho doanh nghiệp
   * POST /faculty_staff/internships/approve/{id}
   */
  approveCompanyWithStudents: async (requestId, studentIds, companyInfo = {}) => {
    try {
      const response = await api.post(`/faculty_staff/internships/approve/${requestId}`, {
        status: 'APPROVED',
        student_ids: studentIds,
        ...companyInfo
      });
      return {
        success: true,
        message: response.data?.message || "Phê duyệt thành công",
        data: response.data?.data || {}
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi phê duyệt doanh nghiệp"
      };
    }
  },

  // ===== FACULTY STAFF - COMPANY ASSIGNMENT (PHÂN CÔNG DOANH NGHIỆP) =====
  
  /**
   * UC 37: Lấy danh sách doanh nghiệp cho phân công
   * GET /faculty_staff/internships/available-companies
   */
  getCompaniesForAssignment: async (search = "", page = 1) => {
    try {
      const response = await api.get("/faculty_staff/internships/available-companies", {
        params: {
          search: search,
          page: page,
          perPage: 5
        }
      });
      // Handle both {data: [...]} and {success, data} formats
      const data = response.data?.data || response.data;
      return {
        success: true,
        data: Array.isArray(data) ? data : [],
        pagination: response.data?.meta || {}
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi tải danh sách doanh nghiệp",
        data: []
      };
    }
  },

  /**
   * UC 37: Phân công doanh nghiệp cho sinh viên
   * POST /faculty_staff/internships/assign-company
   */
  assignCompany: async (companyId, studentIds) => {
    try {
      const response = await api.post("/faculty_staff/internships/assign-company", {
        company_id: companyId,
        internship_ids: studentIds
      });
      return {
        success: true,
        message: response.data?.message || "Phân công thành công",
        data: response.data?.data || {}
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi phân công doanh nghiệp"
      };
    }
  },

  // ===== FACULTY STAFF - LECTURER ASSIGNMENT (PHÂN CÔNG GIẢNG VIÊN) =====
  
  /**
   * UC 43: Lấy danh sách giảng viên để phân công
   * GET /faculty_staff/internships/lecturer-slots
   */
  getLecturerSlots: async (search = "", page = 1) => {
    try {
      const response = await api.get("/faculty_staff/internships/lecturer-slots", {
        params: {
          search: search,
          page: page,
          perPage: 5
        }
      });
      // Handle both {data: [...]} and paginated formats
      const data = response.data?.data || response.data;
      return {
        success: true,
        data: Array.isArray(data) ? data : [],
        pagination: response.data?.meta || {
          current_page: page,
          total: Array.isArray(data) ? data.length : 0,
          per_page: 5,
          last_page: 1
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi tải danh sách giảng viên",
        data: []
      };
    }
  },

  /**
   * UC 43: Phân công giảng viên cho sinh viên
   * POST /faculty_staff/internships/assign-lecturer
   */
  assignLecturer: async (lecturerId, studentIds) => {
    try {
      const response = await api.post("/faculty_staff/internships/assign-lecturer", {
        lecturer_id: lecturerId,
        internship_ids: studentIds
      });
      return {
        success: true,
        message: response.data?.message || "Phân công thành công",
        data: response.data?.data || {}
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi phân công giảng viên"
      };
    }
  },

  // ===== FACULTY STAFF - FILTER OPTIONS (TÙYỌN BỘ LỌC) =====
  
  /**
   * UC 44: Lấy danh sách học kỳ để lọc
   * GET /faculty_staff/internships/semesters
   */
  getSemesters: async () => {
    try {
      const response = await api.get("/faculty_staff/internships/semesters");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách học kỳ" };
    }
  },

  /**
   * UC 44: Lấy danh sách giảng viên để lọc
   * GET /faculty_staff/internships/filter/lecturers
   */
  getLecturersForFilter: async () => {
    try {
      const response = await api.get("/faculty_staff/internships/filter/lecturers");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách giảng viên" };
    }
  },

  /**
   * UC 44: Lấy danh sách doanh nghiệp để lọc
   * GET /faculty_staff/internships/filter/companies
   */
  getCompaniesForFilter: async () => {
    try {
      const response = await api.get("/faculty_staff/internships/filter/companies");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách doanh nghiệp" };
    }
  },

  // ===== FACULTY STAFF - SEARCH =====
  
  /**
   * UC 36: Tìm kiếm sinh viên thực tập toàn hệ thống
   * GET /faculty_staff/internships/search
   */
  search: async (query = "", filters = {}) => {
    try {
      const response = await api.get("/faculty_staff/internships/search", {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tìm kiếm thực tập" };
    }
  },

  // ===== LECTURER - GRADING (CHẤM ĐIỂM) =====
  
  /**
   * UC 40: Lấy danh sách sinh viên để chấm điểm
   * GET /internships/grading-list
   */
  getStudentsForGrading: async () => {
    try {
      const response = await api.get("/internships/grading-list");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách sinh viên chấm điểm" };
    }
  },

  /**
   * UC 40: Nộp điểm chấm thực tập
   * POST /internships/submit-grade/{id}
   */
  submitGrade: async (studentId, grade, feedback = "") => {
    try {
      const response = await api.post(`/internships/submit-grade/${studentId}`, {
        grade,
        feedback
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi nộp điểm" };
    }
  },

  // ===== LECTURER - REPORT REVIEW (DUYỆT BÁO CÁO) =====
  
  /**
   * UC 41: Lấy danh sách báo cáo để duyệt
   * GET /internships/reports-to-review
   */
  getReportsToReview: async () => {
    try {
      const response = await api.get("/internships/reports-to-review");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách báo cáo" };
    }
  },

  /**
   * UC 41: Duyệt báo cáo thực tập
   * POST /internships/reports/{id}/review
   */
  reviewReport: async (reportId, status = "approved", feedback = "") => {
    try {
      const response = await api.post(`/internships/reports/${reportId}/review`, {
        status,
        feedback
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi duyệt báo cáo" };
    }
  },

  // ===== LECTURER - CANCELLATION REVIEW (DUYỆT HỦY) =====
  
  /**
   * UC 39.1: Lấy danh sách yêu cầu hủy chờ duyệt
   * GET /internships/pending-cancellations
   */
  getPendingCancellations: async () => {
    try {
      const response = await api.get("/internships/pending-cancellations");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách yêu cầu hủy" };
    }
  },

  /**
   * UC 39.1: Duyệt yêu cầu hủy thực tập
   * POST /internships/cancellations/{id}/review
   */
  reviewCancellation: async (id, status = "approved", feedback = "") => {
    try {
      const response = await api.post(`/internships/cancellations/${id}/review`, {
        status,
        feedback
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi duyệt yêu cầu hủy" };
    }
  },

  // ===== FACULTY STAFF - CANCELLATION (HỦY THỰC TẬP) =====
  
  /**
   * UC 39.2: Lấy danh sách yêu cầu hủy chờ confirm cuối
   * GET /faculty_staff/internships/pending-cancels
   */
  getPendingCancellationsForVPK: async () => {
    try {
      const response = await api.get("/faculty_staff/internships/pending-cancels");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách yêu cầu hủy" };
    }
  },

  /**
   * UC 39.2: Confirm/Reject yêu cầu hủy cuối cùng
   * POST /faculty_staff/internships/review-cancel/{id}
   */
  reviewCancellationVPK: async (id, status = "approved", feedback = "") => {
    try {
      const response = await api.post(`/faculty_staff/internships/review-cancel/${id}`, {
        status,
        feedback
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi xử lý yêu cầu hủy" };
    }
  },

  // ===== FACULTY STAFF - STATISTICS (THỐNG KÊ) =====

  /**
   * UC 44: Lấy thống kê quản lý thực tập
   * GET /faculty_staff/internships/statistics
   */
  getStatistics: async (filters = {}) => {
    try {
      const response = await api.get("/faculty_staff/internships/statistics", {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải thống kê thực tập" };
    }
  },

  /**
   * UC 44: Xuất báo cáo thực tập (CSV/Excel)
   * GET /faculty_staff/internships/export
   */
  exportReport: async (filters = {}) => {
    try {
      const response = await api.get("/faculty_staff/internships/export", {
        params: filters,
        responseType: "blob"
      });
      // Tạo link download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `internship_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { success: true };
    } catch (error) {
      throw error.response?.data || { message: "Lỗi xuất báo cáo" };
    }
  },

  // ===== DETAIL (CHI TIẾT) =====

  /**
   * Lấy chi tiết thông tin thực tập
   * GET /internships/{id}
   */
  getInternshipDetail: async (id) => {
    try {
      const response = await api.get(`/internships/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải chi tiết thực tập" };
    }
  },

  /**
   * Lấy danh sách thực tập (cho ManageInternships)
   * GET /faculty_staff/internships/search
   * Response là Laravel pagination, cần transform dữ liệu
   */
  getInternships: async (filters = {}) => {
    try {
      const response = await api.get("/faculty_staff/internships/search", {
        params: { 
          page: filters.page || 1,
          perPage: filters.perPage || 100,
          keyword: filters.keyword,
          semester_id: filters.semester_id,
          status: filters.status,
          lecturer_id: filters.lecturer_id,
          company_id: filters.company_id,
          current_role: "faculty_staff"
        }
      });

      // Transform response từ Laravel pagination format
      const data = response.data?.data || [];
      const transformedData = data.map(item => ({
        id: item.internship_id,
        name: item.full_name || item.name || 'N/A',
        class: item.class_name || item.class || 'N/A',
        status: item.status || 'INITIALIZED',
        company_id: item.company_id,
        enterprise: item.company_name && item.company_name !== 'N/A' ? item.company_name : '---',
        lecturer_id: item.lecturer_id,
        lecturer: item.lecturer_name && item.lecturer_name !== 'N/A' ? item.lecturer_name : '---',
        process_score: parseFloat(item.process_score || item.company_grade || 0),
        exam_score: item.exam_score ? parseFloat(item.exam_score) : null,
        final_grade: item.final_grade ? parseFloat(item.final_grade) : null
      }));

      return {
        success: true,
        data: transformedData,
        pagination: {
          current_page: response.data?.meta?.current_page || 1,
          total: response.data?.meta?.total || 0,
          per_page: response.data?.meta?.per_page || 10,
          last_page: response.data?.meta?.last_page || 1
        }
      };
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi tải danh sách thực tập: " + (error.message || "Unknown"),
        data: []
      };
    }
  },

  // Legacy fake method names for backward compatibility
  getEnterprises: async (search = "", page = 1) => internshipService.getCompaniesForAssignment(search, page),
  getLecturers: async (search = "", page = 1) => internshipService.getLecturerSlots(search, page),
  assignEnterprise: async (studentIds, companyId) => 
    internshipService.assignCompany(companyId, studentIds),
};

export default internshipService;
