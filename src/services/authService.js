import api from "./apiConfig";

const authService = {
  /**
   * Đăng nhập hệ thống
   */
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi kết nối server" };
    }
  },

  /**
   * Đăng xuất khỏi hệ thống
   */
  logout: async () => {
    try {
      const response = await api.delete("/auth/logout");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi khi đăng xuất" };
    }
  },

  /**
   * QUÊN MẬT KHẨU - BƯỚC 1: Yêu cầu gửi mã OTP về Email
   * @param {string} email - Email tài khoản cần khôi phục
   */
  requestOTP: async (email) => {
    try {
      const response = await api.post("/password/otp-requests", { email });
      return response.data; // Trả về { success: true, message: "Mã OTP đã được gửi..." }
    } catch (error) {
      throw error.response?.data || { message: "Không thể gửi mã OTP" };
    }
  },

  /**
   * QUÊN MẬT KHẨU - BƯỚC 2: Xác thực mã OTP người dùng nhập
   * @param {Object} data - { email, otp }
   */
  verifyOTP: async (data) => {
    try {
      const response = await api.post("/password/otp/verifications", data);
      return response.data; // Trả về { success: true, data: { verified: true, ... } }
    } catch (error) {
      throw error.response?.data || { message: "Mã OTP không chính xác" };
    }
  },

  /**
   * QUÊN MẬT KHẨU - BƯỚC 3: Đặt lại mật khẩu mới sau khi xác thực thành công
   * @param {Object} data - { email, otp, password, password_confirmation }
   */
  resetPassword: async (data) => {
    try {
      const response = await api.put("/password/reset", data);
      return response.data; // Trả về { success: true, message: "Mật khẩu đã được đặt lại..." }
    } catch (error) {
      throw error.response?.data || { message: "Đặt lại mật khẩu thất bại" };
    }
  },

  /**
   * Đổi mật khẩu (dành cho người dùng đã đăng nhập)
   * @param {Object} data - { current_password, password, password_confirmation }
   */
  changePassword: async (data) => {
    try {
      // Gửi đúng theo ChangePasswordRequest
      const response = await api.put("/profile/password", {
        current_password: data.current_password,
        password: data.password,
        password_confirmation: data.password_confirmation
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Đổi mật khẩu thất bại" };
    }
  }
};

export default authService;