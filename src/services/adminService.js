import api from "./apiConfig";

const adminService = {
  /**
   * 1. Lấy thông tin hồ sơ cá nhân (Admin hiện tại)
   * API: GET /profile
   */
  getProfile: async () => {
    try {
      const response = await api.get("/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải thông tin cá nhân" };
    }
  },

  /**
   * 2. Tìm kiếm / Lấy danh sách tài khoản (UC9)
   * API: GET /admin/accounts?keyword=&status=&role=&page=&per_page=
   */
  getAccounts: async (params) => {
    try {
      const response = await api.get("/admin/accounts", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải danh sách tài khoản" };
    }
  },

  /**
   * 3. Lấy chi tiết tài khoản theo ID
   * API: GET /admin/accounts/{id}?role={role}
   */
  getAccountById: async (id, role) => {
    try {
      const response = await api.get(`/admin/accounts/${id}`, {
        params: { role },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Tài khoản không tồn tại." };
    }
  },

  /**
   * 4. Thêm tài khoản mới (UC10)
   * API: POST /admin/accounts
   * Dữ liệu gửi đi bao gồm username, email, role và các trường theo role
   */
  createAccount: async (data) => {
    try {
      // Map dữ liệu từ form sang định dạng backend cần
      const mappedData = {
        role: data.role,
        username: data.username,
        email: data.email,
        usercode: data.code,  // Map "code" thành "usercode"
        full_name: data.full_name,
        gender: data.gender === "Nam" ? "male" : "female",
        dob: data.dob,
        phone_number: data.phone_number,
        class_id: data.class,  // Map "class" thành "class_id"
        gpa: data.gpa,
        degree: data.degree,
        department: data.department,
      };

      // Xử lý theo từng role
      switch (data.role) {
        case 'student':
          // Student cần: usercode, username, email, full_name, gender, dob, phone_number, class_id, gpa (optional)
          // Đã có đủ trong mappedData
          break;

        case 'lecturer':
          // Lecturer cần: usercode, username, email, full_name, gender, dob, phone_number, degree, department
          // Xóa các field không cần
          delete mappedData.class_id;
          delete mappedData.gpa;
          break;

        case 'faculty_staff':
          // Faculty staff cần: usercode, username, email, full_name, gender, dob
          // Có thể có phone_number (optional)
          delete mappedData.class_id;
          delete mappedData.gpa;
          delete mappedData.degree;
          delete mappedData.department;
          break;

        case 'company':
          // Company cần: usercode (mã số thuế), username, email, name, address, website, is_partnered
          mappedData.name = data.company_name;  // Map "company_name" thành "name"
          mappedData.address = data.address;
          mappedData.website = data.website;
          mappedData.is_partnered = data.partner_status === "1"; // Convert string "0"/"1" sang boolean
          
          // Xóa các field không cần cho company
          delete mappedData.full_name;
          delete mappedData.gender;
          delete mappedData.dob;
          delete mappedData.phone_number;
          delete mappedData.class_id;
          delete mappedData.gpa;
          delete mappedData.degree;
          delete mappedData.department;
          break;

        case 'admin':
          // Admin cần: usercode, username, email, full_name, gender, dob
          delete mappedData.class_id;
          delete mappedData.gpa;
          delete mappedData.degree;
          delete mappedData.department;
          delete mappedData.phone_number;
          break;
      }

      // Log để debug (có thể xóa sau)
      console.log('Data gửi lên backend:', mappedData);

      const response = await api.post("/admin/accounts", mappedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể tạo tài khoản" };
    }
  },

  /**
   * 5. Cập nhật thông tin tài khoản (UC11)
   * API: PUT /admin/accounts/{id}?role={role}
   */
  updateAccount: async (id, role, data) => {
  try {
    // Map dữ liệu từ form sang định dạng backend cần
    const mappedData = {
      username: data.username,
      email: data.email,
      usercode: data.usercode || data.code, // Hỗ trợ cả 2 trường
      status: data.status, // 'active' hoặc 'inactive'
    };

    // Thêm các trường theo role
    if (role !== 'company') {
      if (data.full_name) mappedData.full_name = data.full_name;
      if (data.gender) {
        // Chuyển từ "Nam"/"Nữ" sang "male"/"female" cho backend
        mappedData.gender = data.gender === "Nam" ? "male" : "female";
      }
      if (data.dob) mappedData.dob = data.dob;
    }

    // Các trường riêng theo role
    if (role === 'student') {
      if (data.phone_number) mappedData.phone_number = data.phone_number;
      if (data.class_id) mappedData.class_id = data.class_id;
      if (data.gpa) mappedData.gpa = data.gpa;
    } else if (role === 'lecturer') {
      if (data.phone_number) mappedData.phone_number = data.phone_number;
      if (data.degree) mappedData.degree = data.degree;
      if (data.department) mappedData.department = data.department;
    } else if (role === 'faculty_staff') {
      if (data.phone_number) mappedData.phone_number = data.phone_number;
    } else if (role === 'company') {
      if (data.name) mappedData.name = data.name;
      if (data.address) mappedData.address = data.address;
      if (data.website) mappedData.website = data.website;
      if (data.is_partnered !== undefined) {
        // CHUYỂN ĐỔI: từ string "1"/"0" sang number 1/0
        mappedData.is_partnered = Number(data.is_partnered); // Hoặc: data.is_partnered === "1" ? 1 : 0
      }
    }

    console.log('Update payload:', mappedData);

    const response = await api.put(`/admin/accounts/${id}`, mappedData, {
      params: { role },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Cập nhật tài khoản thất bại" };
  }
},

  /**
   * 7. Vô hiệu hóa tài khoản (UC12)
   * API: DELETE /admin/accounts/{id}?role={role}
   */
  deleteAccount: async (id, role) => {
    try {
      const response = await api.delete(`/admin/accounts/${id}`, {
        params: { role },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể vô hiệu hóa tài khoản" };
    }
  },
};

export default adminService;