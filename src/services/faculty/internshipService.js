import { internshipsData, enterprisesData, lecturersData } from "@/data/facultyData/internshipData";

/**
 * Fake API Service untuk Faculty Internship Management
 */

/**
 * Get all internships for faculty
 */
const getInternships = async () => {
  try {
    return {
      success: true,
      data: internshipsData,
      message: "Lấy danh sách thực tập thành công"
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi lấy danh sách thực tập",
      error: error.message
    };
  }
};

/**
 * Get all enterprises available for internship assignment
 */
const getEnterprises = async (searchQuery = "") => {
  try {
    let data = enterprisesData;
    
    // Simulate search functionality
    if (searchQuery) {
      data = data.filter(e => 
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return {
      success: true,
      data: data,
      message: "Lấy danh sách doanh nghiệp thành công"
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi lấy danh sách doanh nghiệp",
      error: error.message
    };
  }
};

/**
 * Get all lecturers available for internship mentoring
 */
const getLecturers = async (searchQuery = "") => {
  try {
    let data = lecturersData;
    
    // Simulate search functionality
    if (searchQuery) {
      data = data.filter(l => 
        l.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return {
      success: true,
      data: data,
      message: "Lấy danh sách giảng viên thành công"
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi lấy danh sách giảng viên",
      error: error.message
    };
  }
};

/**
 * Assign enterprise to multiple students
 * @param {string[]} studentIds - Array of student IDs
 * @param {number} enterpriseId - Enterprise ID to assign
 */
const assignEnterprise = async (studentIds, enterpriseId) => {
  try {
    // Validate input
    if (!studentIds || studentIds.length === 0) {
      throw new Error("Vui lòng chọn ít nhất một sinh viên");
    }
    
    if (!enterpriseId) {
      throw new Error("Vui lòng chọn doanh nghiệp");
    }
    
    // Simulate assignment
    const enterprise = enterprisesData.find(e => e.id === enterpriseId);
    if (!enterprise) {
      throw new Error("Doanh nghiệp không tồn tại");
    }
    
    // Check available slots (simulation)
    if (enterprise.current_slots + studentIds.length > enterprise.max_slots) {
      throw new Error(`Doanh nghiệp ${enterprise.name} không đủ slot`);
    }
    
    // Update internship data (in real app, this would be persisted in DB)
    studentIds.forEach(studentId => {
      const intern = internshipsData.find(i => i.id === studentId);
      if (intern) {
        intern.enterprise = enterprise.name;
        intern.status = "Đã có DN";
      }
    });
    
    return {
      success: true,
      data: {
        enterprise_id: enterpriseId,
        student_ids: studentIds,
        assigned_count: studentIds.length
      },
      message: `Đã gán ${studentIds.length} sinh viên cho doanh nghiệp ${enterprise.name}`
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Lỗi gán doanh nghiệp",
      error: error.message
    };
  }
};

/**
 * Assign lecturer to multiple students
 * @param {string[]} studentIds - Array of student IDs
 * @param {string} lecturerId - Lecturer ID to assign
 */
const assignLecturer = async (studentIds, lecturerId) => {
  try {
    // Validate input
    if (!studentIds || studentIds.length === 0) {
      throw new Error("Vui lòng chọn ít nhất một sinh viên");
    }
    
    if (!lecturerId) {
      throw new Error("Vui lòng chọn giảng viên");
    }
    
    // Simulate assignment
    const lecturer = lecturersData.find(l => l.id === lecturerId);
    if (!lecturer) {
      throw new Error("Giảng viên không tồn tại");
    }
    
    // Check available slots (simulation)
    if (lecturer.current_slots + studentIds.length > lecturer.max_slots) {
      throw new Error(`Giảng viên ${lecturer.name} không đủ slot`);
    }
    
    // Update internship data (in real app, this would be persisted in DB)
    studentIds.forEach(studentId => {
      const intern = internshipsData.find(i => i.id === studentId);
      if (intern) {
        intern.lecturer = lecturer.name;
        intern.status = "Đã có GVHD";
      }
    });
    
    return {
      success: true,
      data: {
        lecturer_id: lecturerId,
        student_ids: studentIds,
        assigned_count: studentIds.length
      },
      message: `Đã gán ${studentIds.length} sinh viên cho giảng viên ${lecturer.name}`
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Lỗi gán giảng viên",
      error: error.message
    };
  }
};

/**
 * Approve cancel request for internship
 * @param {string} studentId - Student ID
 * @param {boolean} approved - Whether to approve or reject
 */
const approveCancelRequest = async (studentId, approved = true) => {
  try {
    const intern = internshipsData.find(i => i.id === studentId);
    if (!intern) {
      throw new Error("Sinh viên không tồn tại");
    }
    
    if (approved) {
      intern.status = "Bị hủy";
      intern.enterprise = "---";
      intern.lecturer = "";
      
      return {
        success: true,
        data: { student_id: studentId, status: "Bị hủy" },
        message: `Đã duyệt hủy thực tập cho sinh viên ${intern.name}`
      };
    } else {
      // Reject cancel request - revert back to previous status
      intern.status = "Đang thực tập";
      
      return {
        success: true,
        data: { student_id: studentId, status: "Đang thực tập" },
        message: `Đã từ chối hủy thực tập cho sinh viên ${intern.name}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || "Lỗi xử lý yêu cầu hủy",
      error: error.message
    };
  }
};

/**
 * Search internships by student name
 * @param {string} query - Search query
 */
const searchInternships = async (query) => {
  try {
    const results = internshipsData.filter(i => 
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      i.id.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      success: true,
      data: results,
      message: `Tìm thấy ${results.length} kết quả`
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi tìm kiếm",
      error: error.message
    };
  }
};

/**
 * Get internship detail by student ID
 * @param {string} studentId - Student ID
 */
const getInternshipDetail = async (studentId) => {
  try {
    const intern = internshipsData.find(i => i.id === studentId);
    if (!intern) {
      throw new Error("Không tìm thấy thông tin thực tập");
    }
    
    return {
      success: true,
      data: intern,
      message: "Lấy chi tiết thực tập thành công"
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Lỗi lấy chi tiết thực tập",
      error: error.message
    };
  }
};

// Export all API functions
const internshipService = {
  getInternships,
  getEnterprises,
  getLecturers,
  assignEnterprise,
  assignLecturer,
  approveCancelRequest,
  searchInternships,
  getInternshipDetail,
};

export default internshipService;
