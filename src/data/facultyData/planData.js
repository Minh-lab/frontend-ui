// src/data/facultyData/planData.js

// Danh sách các phase name cố định (có thể dùng cho combobox)
export const PHASE_NAMES = [
  // Giai đoạn cho Đồ án (CAPSTONE)
  { id: 1, name: "Nộp đề cương chi tiết", type: "CAPSTONE", default: true },
  { id: 2, name: "Báo cáo tiến độ lần 1", type: "CAPSTONE" },
  { id: 3, name: "Báo cáo tiến độ lần 2", type: "CAPSTONE" },
  { id: 4, name: "Bảo vệ đồ án", type: "CAPSTONE" },
  { id: 5, name: "Nộp báo cáo cuối kỳ", type: "CAPSTONE" },
  
  // Giai đoạn cho Thực tập (INTERNSHIP)
  { id: 6, name: "Đăng ký doanh nghiệp", type: "INTERNSHIP", default: true },
  { id: 7, name: "Nộp giấy xác nhận thực tập", type: "INTERNSHIP" },
  { id: 8, name: "Báo cáo thực tập giữa kỳ", type: "INTERNSHIP" },
  { id: 9, name: "Nộp báo cáo thực tập", type: "INTERNSHIP" },
  { id: 10, name: "Bảo vệ kết quả thực tập", type: "INTERNSHIP" },
];

// Danh sách học kỳ (năm học)
export const MOCK_SEMESTERS = [
  { 
    id: 1, 
    year: "2023-2024", 
    semester: "1", 
    start_date: "2024-05-10", 
    end_date: "2024-06-10"
  },
  { 
    id: 2, 
    year: "2024-2025", 
    semester: "1", 
    start_date: "2025-05-10", 
    end_date: "2025-06-10"
  },
  { 
    id: 3, 
    year: "2024-2025", 
    semester: "2", 
    start_date: "2025-06-10", 
    end_date: "2025-07-10"
  },
  { 
    id: 4, 
    year: "2025-2026", 
    semester: "1", 
    start_date: "2026-05-10", 
    end_date: "2026-06-10"
  },
  { 
    id: 5, 
    year: "2025-2026", 
    semester: "2", 
    start_date: "2026-06-10", 
    end_date: "2026-07-10"
  },
];

// Danh sách các loại mốc
export const MOCK_MILESTONE_TYPES = [
  { id: 1, name: "CAPSTONE", label: "Đồ án tốt nghiệp" },
  { id: 2, name: "INTERNSHIP", label: "Thực tập tốt nghiệp" },
];

// Danh sách milestone cho từng học kỳ (lưu phase_name là string)
export const MOCK_MILESTONES = [
  // Học kỳ 1 năm 2023-2024 (id: 1)
  {
    id: 1,
    semester_id: 1,
    phase_name: "Nộp đề cương chi tiết", // Lưu dạng string
    description: "Sinh viên hoàn thiện đề cương nghiên cứu có xác nhận của Giảng viên hướng dẫn và nộp bản cứng tại Văn phòng khoa.",
    type: "CAPSTONE",
    start_date: "2024-05-10",
    end_date: "2024-05-20"
  },
  {
    id: 2,
    semester_id: 1,
    phase_name: "Báo cáo tiến độ lần 1",
    description: "Sinh viên báo cáo tiến độ thực hiện đồ án trước hội đồng khoa.",
    type: "CAPSTONE",
    start_date: "2024-05-21",
    end_date: "2024-05-30"
  },
  {
    id: 3,
    semester_id: 1,
    phase_name: "Báo cáo tiến độ lần 2",
    description: "Sinh viên báo cáo tiến độ lần 2 và nhận góp ý từ giảng viên hướng dẫn.",
    type: "CAPSTONE",
    start_date: "2024-05-31",
    end_date: "2024-06-05"
  },
  {
    id: 4,
    semester_id: 1,
    phase_name: "Bảo vệ đồ án",
    description: "Sinh viên trình bày và bảo vệ kết quả đồ án trước hội đồng chấm thi.",
    type: "CAPSTONE",
    start_date: "2024-06-06",
    end_date: "2024-06-10"
  },

  // Học kỳ 1 năm 2024-2025 (id: 2)
  {
    id: 5,
    semester_id: 2,
    phase_name: "Nộp đề cương chi tiết",
    description: "Sinh viên nộp đề cương chi tiết cho giảng viên hướng dẫn và khoa.",
    type: "CAPSTONE",
    start_date: "2025-05-10",
    end_date: "2025-05-20"
  },
  {
    id: 6,
    semester_id: 2,
    phase_name: "Đăng ký doanh nghiệp",
    description: "Sinh viên đăng ký đề tài thực tập và xác nhận với doanh nghiệp.",
    type: "INTERNSHIP",
    start_date: "2025-05-10",
    end_date: "2025-05-25"
  },
  {
    id: 7,
    semester_id: 2,
    phase_name: "Báo cáo tiến độ lần 1",
    description: "Báo cáo tiến độ thực hiện đồ án/thực tập trước giảng viên hướng dẫn.",
    type: "CAPSTONE",
    start_date: "2025-05-21",
    end_date: "2025-05-30"
  },
  {
    id: 8,
    semester_id: 2,
    phase_name: "Nộp báo cáo thực tập giữa kỳ",
    description: "Sinh viên nộp báo cáo thực tập giữa kỳ có xác nhận của doanh nghiệp.",
    type: "INTERNSHIP",
    start_date: "2025-05-26",
    end_date: "2025-06-05"
  },

  // Học kỳ 2 năm 2024-2025 (id: 3)
  {
    id: 9,
    semester_id: 3,
    phase_name: "Nộp đề cương đồ án",
    description: "Sinh viên nộp đề cương đồ án tốt nghiệp.",
    type: "CAPSTONE",
    start_date: "2025-06-10",
    end_date: "2025-06-20"
  },
  {
    id: 10,
    semester_id: 3,
    phase_name: "Đăng ký doanh nghiệp",
    description: "Sinh viên đăng ký địa điểm thực tập và xác nhận với doanh nghiệp.",
    type: "INTERNSHIP",
    start_date: "2025-06-10",
    end_date: "2025-06-25"
  },
];

// Danh sách kế hoạch tổng hợp (Plan)
export const MOCK_PLANS = MOCK_SEMESTERS.map(semester => {
  const milestones = MOCK_MILESTONES.filter(m => m.semester_id === semester.id);
  
  return {
    id: semester.id,
    year: semester.year,
    semester: semester.semester,
    start_date: semester.start_date,
    end_date: semester.end_date,
    milestones: milestones
  };
});

// Helper functions
export const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

// Lấy danh sách phase names theo loại
export const getPhaseNamesByType = (type = null) => {
  if (type) {
    return PHASE_NAMES.filter(p => p.type === type);
  }
  return PHASE_NAMES;
};

// Lấy phase name mặc định theo loại
export const getDefaultPhaseName = (type) => {
  const defaultPhase = PHASE_NAMES.find(p => p.type === type && p.default);
  return defaultPhase ? defaultPhase.name : "";
};

// Lấy tất cả phase names (không phân loại)
export const getAllPhaseNames = () => {
  return PHASE_NAMES.map(p => p.name);
};

// Lấy danh sách tất cả kế hoạch
export const getAllPlans = () => {
  return MOCK_PLANS;
};

// Lấy kế hoạch theo ID
export const getPlanById = (id) => {
  return MOCK_PLANS.find(plan => plan.id === Number(id));
};

// Lấy kế hoạch theo năm học và học kỳ
export const getPlanByYearAndSemester = (year, semester) => {
  return MOCK_PLANS.find(plan => plan.year === year && plan.semester === semester);
};

// Lấy danh sách năm học (unique)
export const getUniqueYears = () => {
  return [...new Set(MOCK_SEMESTERS.map(s => s.year))];
};

// Lấy danh sách học kỳ theo năm
export const getSemestersByYear = (year) => {
  return MOCK_SEMESTERS.filter(s => s.year === year);
};

// Lấy tất cả milestone
export const getAllMilestones = () => {
  return MOCK_MILESTONES;
};

// Lấy milestone theo ID
export const getMilestoneById = (id) => {
  return MOCK_MILESTONES.find(m => m.id === Number(id));
};

// Lấy milestone theo học kỳ (có phân trang)
export const getMilestonesBySemester = (semesterId, page = 1, itemsPerPage = 5) => {
  let milestones = MOCK_MILESTONES.filter(m => m.semester_id === Number(semesterId));
  
  // Phân trang
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = milestones.slice(start, end);
  
  return {
    data: paginatedData,
    pagination: {
      current_page: page,
      total_pages: Math.ceil(milestones.length / itemsPerPage),
      total_items: milestones.length,
      items_per_page: itemsPerPage
    }
  };
};

// Lấy milestone theo loại (CAPSTONE/INTERNSHIP)
export const getMilestonesByType = (type) => {
  return MOCK_MILESTONES.filter(m => m.type === type);
};

// Lọc và phân trang kế hoạch
export const filterPlans = (searchTerm = "", year = "", semester = "") => {
  return MOCK_PLANS.filter((plan) => {
    const matchesSearch = 
      plan.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `Học kỳ ${plan.semester}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = year === "" || plan.year === year;
    const matchesSemester = semester === "" || plan.semester === semester;
    
    return matchesSearch && matchesYear && matchesSemester;
  });
};

// Phân trang kế hoạch
export const paginatePlans = (plans, page = 1, itemsPerPage = 5) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return {
    data: plans.slice(start, end),
    total: plans.length,
    currentPage: page,
    totalPages: Math.ceil(plans.length / itemsPerPage),
    itemsPerPage
  };
};