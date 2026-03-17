// src/data/facultyData/capstoneData.js

// Danh sách trạng thái đồ án
export const CAPSTONE_STATUS = [
  "Chờ duyệt",
  "Đã duyệt", 
  "Chờ phản biện",
  "Đang phản biện",
  "Chờ bảo vệ",
  "Đã bảo vệ",
  "Đã hoàn thành",
  "Không đạt",
  "Yêu cầu hủy đồ án"
];

// Danh sách đồ án sinh viên (Quản lý đồ án)
export const MOCK_CAPSTONES = [
  { 
    id: "sv001", 
    name: "Nguyễn Văn An", 
    class: "65KTPM1", 
    topic: "Dự đoán giá vàng sử dụng học máy", 
    status: "Chờ phản biện", 
    gvhd: "Hoàng Anh", 
    gvpb: "", 
    council: "", 
    score: "",
    major: "Học máy",
    description: "Sử dụng các thuật toán học máy để dự báo biến động giá vàng trên thị trường.",
    registration_date: "2024-02-15"
  },
  { 
    id: "sv002", 
    name: "Trần Thị Bình", 
    class: "65KTPM2", 
    topic: "Xây dựng hệ thống gợi ý sản phẩm", 
    status: "Đã duyệt", 
    gvhd: "Phạm Văn Long", 
    gvpb: "", 
    council: "", 
    score: "",
    major: "Web",
    description: "Xây dựng hệ thống gợi ý sản phẩm dựa trên lịch sử mua hàng.",
    registration_date: "2024-02-10"
  },
  { 
    id: "sv003", 
    name: "Lê Văn Cường", 
    class: "65KTPM3", 
    topic: "Ứng dụng di động quản lý chi tiêu", 
    status: "Đang phản biện", 
    gvhd: "Nguyễn Thị Hoa", 
    gvpb: "Trần Văn Minh", 
    council: "Hội đồng 1", 
    score: "",
    major: "Mobile",
    description: "Phát triển ứng dụng di động giúp người dùng quản lý chi tiêu cá nhân.",
    registration_date: "2024-02-05"
  },
  { 
    id: "sv004", 
    name: "Phạm Thị Dung", 
    class: "65KTPM1", 
    topic: "Phân tích cảm xúc từ đánh giá sản phẩm", 
    status: "Chờ bảo vệ", 
    gvhd: "Hoàng Anh", 
    gvpb: "Lê Thị Hương", 
    council: "Hội đồng 2", 
    score: "",
    major: "Học máy",
    description: "Sử dụng NLP để phân tích cảm xúc từ các đánh giá sản phẩm trên e-commerce.",
    registration_date: "2024-01-28"
  },
  { 
    id: "sv005", 
    name: "Hoàng Văn Em", 
    class: "65KTPM2", 
    topic: "Hệ thống quản lý kho thông minh", 
    status: "Đã bảo vệ", 
    gvhd: "Phạm Văn Long", 
    gvpb: "Nguyễn Văn Nam", 
    council: "Hội đồng 3", 
    score: "8.0",
    major: "Web",
    description: "Xây dựng hệ thống quản lý kho hàng sử dụng IoT và web real-time.",
    registration_date: "2024-01-20"
  },
  { 
    id: "sv006", 
    name: "Đặng Thị Phương", 
    class: "65KTPM3", 
    topic: "Ứng dụng học tiếng Anh qua game", 
    status: "Đã hoàn thành", 
    gvhd: "Nguyễn Thị Hoa", 
    gvpb: "Trần Văn Minh", 
    council: "Hội đồng 1", 
    score: "8.5",
    major: "Mobile",
    description: "Phát triển ứng dụng mobile học tiếng Anh thông qua các trò chơi tương tác.",
    registration_date: "2024-01-15"
  },
  { 
    id: "sv007", 
    name: "Vũ Văn Giang", 
    class: "65KTPM1", 
    topic: "Hệ thống nhận diện khuôn mặt", 
    status: "Không đạt", 
    gvhd: "Hoàng Anh", 
    gvpb: "Phạm Minh", 
    council: "Hội đồng 4", 
    score: "4.5",
    major: "Học máy",
    description: "Xây dựng hệ thống nhận diện khuôn mặt sử dụng deep learning.",
    registration_date: "2024-01-10"
  },
  { 
    id: "sv008", 
    name: "Nguyễn Thị Hạnh", 
    class: "65KTPM2", 
    topic: "Website bán hàng thời trang", 
    status: "Yêu cầu hủy đồ án", 
    gvhd: "", 
    gvpb: "", 
    council: "", 
    score: "",
    major: "Web",
    description: "Xây dựng website thương mại điện tử bán hàng thời trang.",
    registration_date: "2024-03-01"
  },
];

// Danh sách hội đồng (Phân công phản biện)
export const MOCK_COUNCILS = [
  { 
    id: "hd1", 
    name: "Hội đồng 1", 
    count: 25, 
    color: "bg-[#8ac9db]", 
    dates: ["2024-09-02", "2024-09-03"],
    location: "Phòng A1.101",
    president: "GS.TS Nguyễn Văn A",
    secretary: "TS. Trần Thị B"
  },
  { 
    id: "hd2", 
    name: "Hội đồng 2", 
    count: 34, 
    color: "bg-[#65d68d]", 
    dates: ["2024-09-05"],
    location: "Phòng A1.102",
    president: "PGS.TS Lê Văn C",
    secretary: "TS. Phạm Thị D"
  },
  { 
    id: "hd3", 
    name: "Hội đồng 3", 
    count: 30, 
    color: "bg-[#65d68d]", 
    dates: ["2024-09-10"],
    location: "Phòng A1.103",
    president: "GS.TS Hoàng Văn E",
    secretary: "TS. Nguyễn Thị F"
  },
  { 
    id: "hd4", 
    name: "Hội đồng 4", 
    count: 24, 
    color: "bg-[#65d68d]", 
    dates: ["2024-09-12"],
    location: "Phòng A1.104",
    president: "PGS.TS Trần Văn G",
    secretary: "TS. Lê Thị H"
  },
  { 
    id: "hd6", 
    name: "Hội đồng 4", 
    count: 24, 
    color: "bg-[#65d68d]", 
    dates: ["2024-09-12"],
    location: "Phòng A1.104",
    president: "PGS.TS Trần Văn G",
    secretary: "TS. Lê Thị H"
  },
];

// Danh sách thành viên hội đồng (mỗi hội đồng 5 giảng viên)
export const COUNCIL_MEMBERS = [
  // Hội đồng 1
  { id: "gv1", name: "PGS.TS Nguyễn Văn A", council: "hd1", role: "Chủ tịch", count: 8, color: "bg-[#8ac9db]" },
  { id: "gv2", name: "TS. Trần Thị B", council: "hd1", role: "Thư ký", count: 8, color: "bg-[#dbb08a]" },
  { id: "gv3", name: "TS. Lê Văn C", council: "hd1", role: "Ủy viên", count: 8, color: "bg-[#8a9adb]" },
  { id: "gv4", name: "PGS.TS Phạm Thị D", council: "hd1", role: "Ủy viên", count: 8, color: "bg-[#9a8adb]" },
  { id: "gv5", name: "TS. Hoàng Văn E", council: "hd1", role: "Ủy viên", count: 8, color: "bg-[#a6db8a]" },
  
  // Hội đồng 2
  { id: "gv6", name: "GS.TS Nguyễn Thị F", council: "hd2", role: "Chủ tịch", count: 8, color: "bg-[#8ac9db]" },
  { id: "gv7", name: "PGS.TS Trần Văn G", council: "hd2", role: "Thư ký", count: 8, color: "bg-[#dbb08a]" },
  { id: "gv8", name: "TS. Lê Thị H", council: "hd2", role: "Ủy viên", count: 8, color: "bg-[#8a9adb]" },
  { id: "gv9", name: "TS. Phạm Văn I", council: "hd2", role: "Ủy viên", count: 8, color: "bg-[#9a8adb]" },
  { id: "gv10", name: "PGS.TS Hoàng Thị K", council: "hd2", role: "Ủy viên", count: 8, color: "bg-[#a6db8a]" },
  
  // Hội đồng 3
  { id: "gv11", name: "TS. Nguyễn Văn L", council: "hd3", role: "Chủ tịch", count: 8, color: "bg-[#8ac9db]" },
  { id: "gv12", name: "PGS.TS Trần Thị M", council: "hd3", role: "Thư ký", count: 8, color: "bg-[#dbb08a]" },
  { id: "gv13", name: "TS. Lê Văn N", council: "hd3", role: "Ủy viên", count: 8, color: "bg-[#8a9adb]" },
  { id: "gv14", name: "TS. Phạm Thị O", council: "hd3", role: "Ủy viên", count: 8, color: "bg-[#9a8adb]" },
  { id: "gv15", name: "GS.TS Hoàng Văn P", council: "hd3", role: "Ủy viên", count: 8, color: "bg-[#a6db8a]" },
  
  // Hội đồng 4
  { id: "gv16", name: "PGS.TS Nguyễn Thị Q", council: "hd4", role: "Chủ tịch", count: 8, color: "bg-[#8ac9db]" },
  { id: "gv17", name: "TS. Trần Văn R", council: "hd4", role: "Thư ký", count: 8, color: "bg-[#dbb08a]" },
  { id: "gv18", name: "TS. Lê Thị S", council: "hd4", role: "Ủy viên", count: 8, color: "bg-[#8a9adb]" },
  { id: "gv19", name: "PGS.TS Phạm Văn T", council: "hd4", role: "Ủy viên", count: 8, color: "bg-[#9a8adb]" },
  { id: "gv20", name: "TS. Hoàng Thị U", council: "hd4", role: "Ủy viên", count: 8, color: "bg-[#a6db8a]" },
];

// Danh sách giảng viên (Phân công GVHD)
export const MOCK_LECTURERS = [
  { 
    id: "2351170101", 
    name: "Nguyễn Thị Hải Anh", 
    major: "Học máy", 
    current: 20, 
    max: 20,
    email: "anh.nth@tlu.edu.vn",
    phone: "0912345678"
  },
  { 
    id: "2351170102", 
    name: "Trần Thị Kiều Anh", 
    major: "Học máy", 
    current: 18, 
    max: 20,
    email: "anh.ttk@tlu.edu.vn",
    phone: "0912345679"
  },
  { 
    id: "2351170674", 
    name: "Lê Văn Bình", 
    major: "Học máy", 
    current: 5, 
    max: 15,
    email: "binh.lv@tlu.edu.vn",
    phone: "0912345680"
  },
  { 
    id: "2351170123", 
    name: "Phạm Văn Long", 
    major: "Web", 
    current: 12, 
    max: 20,
    email: "long.pv@tlu.edu.vn",
    phone: "0912345681"
  },
  { 
    id: "2351170456", 
    name: "Nguyễn Thị Hoa", 
    major: "Mobile", 
    current: 15, 
    max: 20,
    email: "hoa.nt@tlu.edu.vn",
    phone: "0912345682"
  },
  { 
    id: "2351170789", 
    name: "Trần Văn Minh", 
    major: "Bảo mật", 
    current: 8, 
    max: 15,
    email: "minh.tv@tlu.edu.vn",
    phone: "0912345683"
  },
];

// Danh sách đăng ký đồ án (Duyệt đồ án)
export const MOCK_REGISTRATIONS = [
  { 
    id: "sv100", 
    name: "Nguyễn Văn An", 
    class: "65KTPM1", 
    topic: "Dự đoán giá vàng sử dụng học máy", 
    status: "Chờ duyệt", 
    description: "Sử dụng các thuật toán học máy để dự báo biến động giá vàng trên thị trường.", 
    major: "Học máy",
    registration_date: "2024-03-01",
    expected_gvhd: "Nguyễn Thị Hải Anh"
  },
  { 
    id: "sv102", 
    name: "Nguyễn Văn Minh", 
    class: "63KH1", 
    topic: "Xây dựng website thương mại điện tử", 
    status: "Chờ duyệt", 
    description: "Xây dựng hệ thống web bán hàng thời gian thực với công nghệ mới.", 
    major: "Web",
    registration_date: "2024-03-02",
    expected_gvhd: "Phạm Văn Long"
  },
  { 
    id: "sv107", 
    name: "Hoàng Văn Lân", 
    class: "55HT1", 
    topic: "App dự báo thời tiết cho nông nghiệp", 
    status: "Chờ duyệt", 
    description: "Ứng dụng di động dự báo thời tiết phục vụ sản xuất nông nghiệp.", 
    major: "Mobile",
    registration_date: "2024-03-03",
    expected_gvhd: "Nguyễn Thị Hoa"
  },
  { 
    id: "sv108", 
    name: "Trần Thị Lan", 
    class: "65KTPM2", 
    topic: "Phân tích dữ liệu thị trường chứng khoán", 
    status: "Chờ duyệt", 
    description: "Sử dụng machine learning để phân tích và dự đoán xu hướng thị trường.", 
    major: "Học máy",
    registration_date: "2024-03-04",
    expected_gvhd: "Lê Văn Bình"
  },
  { 
    id: "sv109", 
    name: "Lê Thị Hương", 
    class: "63KH2", 
    topic: "Hệ thống quản lý nhân sự trực tuyến", 
    status: "Chờ duyệt", 
    description: "Xây dựng hệ thống quản lý nhân sự, chấm công, tính lương.", 
    major: "Web",
    registration_date: "2024-03-05",
    expected_gvhd: "Phạm Văn Long"
  },
];

// Thống kê tổng quan đồ án
export const CAPSTONE_STATISTICS = {
  total_capstones: MOCK_CAPSTONES.length,
  by_status: {
    "Chờ duyệt": MOCK_CAPSTONES.filter(c => c.status === "Chờ duyệt").length,
    "Đã duyệt": MOCK_CAPSTONES.filter(c => c.status === "Đã duyệt").length,
    "Chờ phản biện": MOCK_CAPSTONES.filter(c => c.status === "Chờ phản biện").length,
    "Đang phản biện": MOCK_CAPSTONES.filter(c => c.status === "Đang phản biện").length,
    "Chờ bảo vệ": MOCK_CAPSTONES.filter(c => c.status === "Chờ bảo vệ").length,
    "Đã bảo vệ": MOCK_CAPSTONES.filter(c => c.status === "Đã bảo vệ").length,
    "Đã hoàn thành": MOCK_CAPSTONES.filter(c => c.status === "Đã hoàn thành").length,
    "Không đạt": MOCK_CAPSTONES.filter(c => c.status === "Không đạt").length,
  },
  by_major: {
    "Học máy": MOCK_CAPSTONES.filter(c => c.major === "Học máy").length,
    "Web": MOCK_CAPSTONES.filter(c => c.major === "Web").length,
    "Mobile": MOCK_CAPSTONES.filter(c => c.major === "Mobile").length,
    "Bảo mật": MOCK_CAPSTONES.filter(c => c.major === "Bảo mật").length,
  },
  avg_score: (MOCK_CAPSTONES.filter(c => c.score).reduce((acc, c) => acc + parseFloat(c.score), 0) / 
              MOCK_CAPSTONES.filter(c => c.score).length).toFixed(1) || 0,
  total_councils: MOCK_COUNCILS.length,
  total_lecturers: MOCK_LECTURERS.length,
};

// Helper functions
export const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

// Lọc đồ án theo trạng thái, chuyên ngành, giảng viên
export const filterCapstones = (searchTerm = "", status = "", major = "", lecturer = "") => {
  return MOCK_CAPSTONES.filter((capstone) => {
    const matchesSearch = 
      capstone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      capstone.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      capstone.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = status === "" || capstone.status === status;
    const matchesMajor = major === "" || capstone.major === major;
    const matchesLecturer = lecturer === "" || capstone.gvhd === lecturer;
    
    return matchesSearch && matchesStatus && matchesMajor && matchesLecturer;
  });
};

// Lọc đăng ký đồ án
export const filterRegistrations = (searchTerm = "", status = "", major = "") => {
  return MOCK_REGISTRATIONS.filter((reg) => {
    const matchesSearch = 
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = status === "" || reg.status === status;
    const matchesMajor = major === "" || reg.major === major;
    
    return matchesSearch && matchesStatus && matchesMajor;
  });
};

// Lấy hội đồng theo ID
export const getCouncilById = (id) => {
  return MOCK_COUNCILS.find(c => c.id === id);
};

// Lấy thành viên theo hội đồng
export const getCouncilMembers = (councilId) => {
  return COUNCIL_MEMBERS.filter(m => m.council === councilId);
};

// Lấy giảng viên theo ID
export const getLecturerById = (id) => {
  return MOCK_LECTURERS.find(l => l.id === id);
};

// Phân trang
export const paginateData = (data, page = 1, itemsPerPage = 10) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return {
    data: data.slice(start, end),
    total: data.length,
    currentPage: page,
    totalPages: Math.ceil(data.length / itemsPerPage),
    itemsPerPage
  };
};

export const calculateCapstoneStatistics = () => {
  const total_capstones = MOCK_CAPSTONES.length;
  
  // Đếm số sinh viên đã hoàn thành
  const completed = MOCK_CAPSTONES.filter(c => 
    c.status === "Đã hoàn thành" || c.status === "Đã bảo vệ"
  ).length;
  
  // Đếm số sinh viên chưa có GVHD
  const no_gvhd = MOCK_CAPSTONES.filter(c => !c.gvhd || c.gvhd === "").length;
  
  // Đếm số sinh viên chưa có GVPB
  const no_gvpb = MOCK_CAPSTONES.filter(c => !c.gvpb || c.gvpb === "").length;
  
  // Đếm số sinh viên chưa có hội đồng
  const no_council = MOCK_CAPSTONES.filter(c => !c.council || c.council === "").length;
  
  // Đếm theo trạng thái
  const by_status = {
    "Chờ duyệt": MOCK_CAPSTONES.filter(c => c.status === "Chờ duyệt").length,
    "Đã duyệt": MOCK_CAPSTONES.filter(c => c.status === "Đã duyệt").length,
    "Chờ phản biện": MOCK_CAPSTONES.filter(c => c.status === "Chờ phản biện").length,
    "Đang phản biện": MOCK_CAPSTONES.filter(c => c.status === "Đang phản biện").length,
    "Chờ bảo vệ": MOCK_CAPSTONES.filter(c => c.status === "Chờ bảo vệ").length,
    "Đã bảo vệ": MOCK_CAPSTONES.filter(c => c.status === "Đã bảo vệ").length,
    "Đã hoàn thành": MOCK_CAPSTONES.filter(c => c.status === "Đã hoàn thành").length,
    "Không đạt": MOCK_CAPSTONES.filter(c => c.status === "Không đạt").length,
    "Yêu cầu hủy": MOCK_CAPSTONES.filter(c => c.status === "Yêu cầu hủy đồ án").length,
    "Đã hủy": MOCK_CAPSTONES.filter(c => c.status === "Đã hủy").length,
  };
  
  // Tính điểm trung bình
  const scored_capstones = MOCK_CAPSTONES.filter(c => c.score && c.score !== "" && c.score !== "---");
  const avg_score = scored_capstones.length > 0 
    ? (scored_capstones.reduce((acc, c) => acc + parseFloat(c.score), 0) / scored_capstones.length).toFixed(1)
    : 0;
  
  return {
    total_capstones,
    completed,
    no_gvhd,
    no_gvpb,
    no_council,
    by_status,
    avg_score,
    // Thêm các chỉ số khác nếu cần
    in_progress: MOCK_CAPSTONES.filter(c => 
      c.status === "Đang thực hiện" || 
      c.status === "Đang phản biện" || 
      c.status === "Chờ phản biện"
    ).length,
    waiting_approval: MOCK_CAPSTONES.filter(c => c.status === "Chờ duyệt").length,
  };
  

  
};
export const handleCancelCapstone = (capstoneId, action) => {
  const index = MOCK_CAPSTONES.findIndex(c => c.id === capstoneId);
  
  if (index !== -1) {
    if (action === 'approve') {
      // Duyệt hủy - xóa khỏi danh sách hoặc đánh dấu là đã hủy
      MOCK_CAPSTONES[index].status = "Đã hủy";
      // Hoặc có thể xóa hẳn: MOCK_CAPSTONES.splice(index, 1);
      return {
        success: true,
        message: `Đã duyệt hủy đồ án cho sinh viên ${MOCK_CAPSTONES[index].name}`,
        data: MOCK_CAPSTONES[index]
      };
    } else {
      // Không duyệt hủy - cập nhật trạng thái về bình thường
      MOCK_CAPSTONES[index].status = "Đang thực hiện";
      return {
        success: true,
        message: `Đã từ chối hủy đồ án cho sinh viên ${MOCK_CAPSTONES[index].name}`,
        data: MOCK_CAPSTONES[index]
      };
    }
  }
  
  return {
    success: false,
    message: "Không tìm thấy đồ án"
  };
};