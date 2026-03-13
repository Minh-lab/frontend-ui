// src/data/facultyData/lecturerData.js

// Danh sách chuyên môn
export const SPECIALIZATIONS = [
  "Tất cả",
  "Toán tin", 
  "Cơ sở dữ liệu", 
  "AI", 
  "An toàn thông tin",
  "Khoa học dữ liệu",
  "Mạng máy tính",
  "Công nghệ phần mềm"
];

// Danh sách trạng thái
export const STATUS_OPTIONS = [
  "Tất cả",
  "Hoạt động", 
  "Yêu cầu nghỉ phép", 
  "Ngưng công tác"
];

// Danh sách học vị
export const DEGREES = [
  "Cử nhân",
  "Thạc sĩ",
  "Tiến sĩ",
  "Phó Giáo sư",
  "Giáo sư"
];

// Mock data giảng viên cho danh sách
export const MOCK_LECTURERS = [
  { 
    id: "gv001", 
    name: "Nguyễn An", 
    specialization: "Toán tin", 
    status: "Yêu cầu nghỉ phép" 
  },
  { 
    id: "gv002", 
    name: "Nguyễn Minh", 
    specialization: "Cơ sở dữ liệu", 
    status: "Hoạt động" 
  },
  { 
    id: "gv003", 
    name: "Hoàng Lân", 
    specialization: "AI", 
    status: "Ngưng công tác" 
  },
  { 
    id: "gv004", 
    name: "Phạm Hùng", 
    specialization: "An toàn thông tin", 
    status: "Hoạt động" 
  },
  { 
    id: "gv005", 
    name: "Trần Thị Hương", 
    specialization: "Khoa học dữ liệu", 
    status: "Hoạt động" 
  },
  { 
    id: "gv006", 
    name: "Lê Văn Thành", 
    specialization: "Mạng máy tính", 
    status: "Hoạt động" 
  },
  { 
    id: "gv007", 
    name: "Nguyễn Thị Lan", 
    specialization: "Công nghệ phần mềm", 
    status: "Yêu cầu nghỉ phép" 
  },
];

// Mock data chi tiết giảng viên
export const MOCK_LECTURER_DETAILS = {
  gv001: {
    id: "gv001",
    full_name: "Nguyễn An",
    gender: "Nam",
    dob: "1985-05-20",
    phone_number: "0912345678",
    email: "an.nguyen@tlu.edu.vn",
    degree: "Tiến sĩ",
    department: "Toán tin",
    specialization: "Khoa học dữ liệu",
    status: "Yêu cầu nghỉ phép",
    leave_request: {
      description: "Nghỉ phép đi điều trị bệnh tại bệnh viện trung ương.",
      file_path: "/uploads/don_xin_nghi_phep_gv001.pdf",
      start_date: "2024-03-15",
      end_date: "2024-03-20"
    }
  },
  gv002: {
    id: "gv002",
    full_name: "Nguyễn Minh",
    gender: "Nam",
    dob: "1980-10-15",
    phone_number: "0987654321",
    email: "minh.nguyen@tlu.edu.vn",
    degree: "Phó Giáo sư",
    department: "Cơ sở dữ liệu",
    specialization: "Cơ sở dữ liệu phân tán",
    status: "Hoạt động",
    leave_request: null
  },
  gv003: {
    id: "gv003",
    full_name: "Hoàng Lân",
    gender: "Nam",
    dob: "1975-03-10",
    phone_number: "0977111222",
    email: "lan.hoang@tlu.edu.vn",
    degree: "Giáo sư",
    department: "AI",
    specialization: "Học máy và Trí tuệ nhân tạo",
    status: "Ngưng công tác",
    leave_request: null
  },
  gv004: {
    id: "gv004",
    full_name: "Phạm Hùng",
    gender: "Nam",
    dob: "1988-07-22",
    phone_number: "0966333444",
    email: "hung.pham@tlu.edu.vn",
    degree: "Thạc sĩ",
    department: "An toàn thông tin",
    specialization: "Mật mã học và Bảo mật mạng",
    status: "Hoạt động",
    leave_request: null
  },
  gv005: {
    id: "gv005",
    full_name: "Trần Thị Hương",
    gender: "Nữ",
    dob: "1982-11-05",
    phone_number: "0933555666",
    email: "huong.tran@tlu.edu.vn",
    degree: "Tiến sĩ",
    department: "Khoa học dữ liệu",
    specialization: "Phân tích dữ liệu lớn",
    status: "Hoạt động",
    leave_request: null
  },
  gv006: {
    id: "gv006",
    full_name: "Lê Văn Thành",
    gender: "Nam",
    dob: "1983-09-18",
    phone_number: "0944777888",
    email: "thanh.le@tlu.edu.vn",
    degree: "Thạc sĩ",
    department: "Mạng máy tính",
    specialization: "An ninh mạng",
    status: "Hoạt động",
    leave_request: null
  },
  gv007: {
    id: "gv007",
    full_name: "Nguyễn Thị Lan",
    gender: "Nữ",
    dob: "1990-12-25",
    phone_number: "0955999000",
    email: "lan.nguyen@tlu.edu.vn",
    degree: "Tiến sĩ",
    department: "Công nghệ phần mềm",
    specialization: "Phát triển ứng dụng di động",
    status: "Yêu cầu nghỉ phép",
    leave_request: {
      description: "Nghỉ phép theo chế độ thai sản.",
      file_path: "/uploads/don_xin_nghi_phep_gv007.pdf",
      start_date: "2024-04-01",
      end_date: "2024-06-30"
    }
  }
};

// Helper functions
export const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

// Lấy danh sách giảng viên (có lọc)
export const filterLecturers = (searchTerm = "", status = "", specialization = "") => {
  return MOCK_LECTURERS.filter((lecturer) => {
    const matchesSearch = 
      lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = status === "Tất cả" || status === "" || lecturer.status === status;
    const matchesSpecialization = specialization === "Tất cả" || specialization === "" || lecturer.specialization === specialization;
    
    return matchesSearch && matchesStatus && matchesSpecialization;
  });
};

// Lấy chi tiết giảng viên theo ID
export const getLecturerDetail = (id) => {
  return MOCK_LECTURER_DETAILS[id] || null;
};

// Xử lý duyệt/từ chối đơn nghỉ phép
export const processLeaveRequest = (lecturerId, action) => {
  const lecturer = MOCK_LECTURER_DETAILS[lecturerId];
  const lecturerInList = MOCK_LECTURERS.find(l => l.id === lecturerId);
  
  if (!lecturer || !lecturerInList) {
    return {
      success: false,
      message: "Không tìm thấy giảng viên"
    };
  }

  if (action === "approve") {
    // Duyệt đơn - cập nhật trạng thái
    lecturer.status = "Nghỉ phép";
    lecturerInList.status = "Nghỉ phép";
    return {
      success: true,
      message: `Đã duyệt đơn nghỉ phép cho giảng viên ${lecturer.full_name}`,
      data: lecturer
    };
  } else {
    // Từ chối đơn - đưa về trạng thái hoạt động
    lecturer.status = "Hoạt động";
    lecturerInList.status = "Hoạt động";
    lecturer.leave_request = null;
    return {
      success: true,
      message: `Đã từ chối đơn nghỉ phép cho giảng viên ${lecturer.full_name}`,
      data: lecturer
    };
  }
};

// Phân trang
export const paginateLecturers = (lecturers, page = 1, itemsPerPage = 5) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return {
    data: lecturers.slice(start, end),
    total: lecturers.length,
    currentPage: page,
    totalPages: Math.ceil(lecturers.length / itemsPerPage),
    itemsPerPage
  };
};

// Lấy thống kê giảng viên
export const getLecturerStatistics = () => {
  return {
    total: MOCK_LECTURERS.length,
    active: MOCK_LECTURERS.filter(l => l.status === "Hoạt động").length,
    onLeave: MOCK_LECTURERS.filter(l => l.status === "Yêu cầu nghỉ phép").length,
    inactive: MOCK_LECTURERS.filter(l => l.status === "Ngưng công tác").length,
    bySpecialization: SPECIALIZATIONS.slice(1).reduce((acc, spec) => {
      acc[spec] = MOCK_LECTURERS.filter(l => l.specialization === spec).length;
      return acc;
    }, {})
  };
};