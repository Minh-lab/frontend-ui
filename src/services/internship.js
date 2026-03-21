import axiosInstance from "./apiConfig";

const internshipService = {
  // UC 33: Lấy trạng thái thực tập hiện tại
  getStatus: async () => {
    try {
      const response = await axiosInstance.get(`/internships/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // UC 33: Lấy đợt đăng ký thực tập đang mở
  getMilestone: async () => {
    try {
      const response = await axiosInstance.get(`/internships/milestone`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // UC 33: Đăng ký tham gia đợt thực tập
  registerInternship: async (milestoneId) => {
    try {
      const response = await axiosInstance.post(`/internships/register`, { milestone_id: milestoneId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // UC 34: Kiểm tra doanh nghiệp qua MST
  checkCompany: async (taxCode) => {
    try {
      const response = await axiosInstance.get(`/internships/check-company`, {
        params: { tax_code: taxCode }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // UC 34: Đăng ký doanh nghiệp
  registerCompany: async (formData) => {
    try {
      const response = await axiosInstance.post(`/internships/register-company`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // UC 37: Lấy danh sách doanh nghiệp đối tác
  getAvailableCompanies: async () => {
    try {
      const response = await axiosInstance.get(`/internships/available-companies`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default internshipService;
