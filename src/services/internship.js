import axiosInstance from "./apiConfig";

const internshipService = {
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
