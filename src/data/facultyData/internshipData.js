// Dữ liệu sinh viên thực tập
export const internshipsData = [
  { 
    id: "sv001", 
    name: "Nguyễn An", 
    class: "65KTPM1", 
    enterprise: "FPT Software", 
    status: "Đang thực tập", 
    lecturer: "Nguyễn Minh", 
    score: 8.5 
  },
  { 
    id: "sv002", 
    name: "Nguyễn Minh", 
    class: "63KH1", 
    enterprise: "Viettel", 
    status: "Yêu cầu hủy", 
    lecturer: "Trần Hùng", 
    score: null 
  },
  { 
    id: "sv077", 
    name: "Hoàng Lân", 
    class: "55HT1", 
    enterprise: "---", 
    status: "Chưa có dữ liệu", 
    lecturer: "", 
    score: null 
  },
  { 
    id: "sv088", 
    name: "Lê Thu", 
    class: "64CNTT2", 
    enterprise: "---", 
    status: "Chưa có dữ liệu", 
    lecturer: "", 
    score: null 
  },
  { 
    id: "sv103", 
    name: "Tạ Tuấn Anh", 
    class: "65KTPM1", 
    enterprise: "---", 
    status: "Yêu cầu đăng ký công ty", 
    lecturer: "", 
    score: null 
  },
  { 
    id: "sv104", 
    name: "Đặng Hải Yến", 
    class: "63KHMT1", 
    enterprise: "FPT IS", 
    status: "Đã có GVHD", 
    lecturer: "", 
    score: null 
  },
  { 
    id: "sv105", 
    name: "Phạm Quốc Huy", 
    class: "64CNTT2", 
    enterprise: "Sendo", 
    status: "Đã có DN", 
    lecturer: "Trần Thanh Tuyên", 
    score: 7.8 
  },
  { 
    id: "sv106", 
    name: "Ngô Thanh Tâm", 
    class: "65KTPM2", 
    enterprise: "Axon", 
    status: "Hoàn thành", 
    lecturer: "Lê Quốc Đạt", 
    score: 9.2 
  },
];

// Dữ liệu doanh nghiệp thực tập
export const enterprisesData = [
  { 
    id: 1, 
    name: "CTY TNHH CJJ", 
    tax_code: "902482", 
    current_slots: 5, 
    max_slots: 20,
    address: "123 Nguyễn Hữu Cảnh, Q.Bình Thạnh, HCM",
    email: "cjj@company.com",
    phone: "028.1234.5678"
  },
  { 
    id: 2, 
    name: "WWC", 
    tax_code: "034yr232", 
    current_slots: 3, 
    max_slots: 15,
    address: "456 Hoàng Văn Thụ, Q.Phú Nhuận, HCM",
    email: "hr@wwc.com",
    phone: "028.9876.5432"
  },
  { 
    id: 3, 
    name: "WORKS JJ", 
    tax_code: "3274983", 
    current_slots: 12, 
    max_slots: 12,
    address: "789 Trần Hưng Đạo, Q.1, HCM",
    email: "recruitment@worksjj.com",
    phone: "028.1111.2222"
  },
  { 
    id: 4, 
    name: "FPT Software", 
    tax_code: "0102027315", 
    current_slots: 8, 
    max_slots: 25,
    address: "Lot A, Road 1A, Zone 1, Saigon High Tech Park, District 9, HCMC",
    email: "hr@fpt.com.vn",
    phone: "028.6290.0666"
  },
  { 
    id: 5, 
    name: "Viettel", 
    tax_code: "0100170999", 
    current_slots: 10, 
    max_slots: 30,
    address: "1980 Dường 3/2, Ward 10, District 10, HCMC",
    email: "tuyendung@viettel.com.vn",
    phone: "028.7106.6999"
  },
];

// Dữ liệu giảng viên hướng dẫn
export const lecturersData = [
  { 
    id: "gv991", 
    name: "Hoàng Lan", 
    major: "AI", 
    current_slots: 5, 
    max_slots: 20,
    specialization: ["Machine Learning", "Deep Learning"],
    email: "hoang.lan@university.edu.vn",
    phone: "0901.234.567"
  },
  { 
    id: "gv0082", 
    name: "Nguyễn Linh", 
    major: "AI", 
    current_slots: 3, 
    max_slots: 15,
    specialization: ["NLP", "Data Science"],
    email: "nguyen.linh@university.edu.vn",
    phone: "0902.345.678"
  },
  { 
    id: "gv003", 
    name: "Anh Thảo", 
    major: "KHMT", 
    current_slots: 12, 
    max_slots: 12,
    specialization: ["Web Development", "Software Architecture"],
    email: "anh.thao@university.edu.vn",
    phone: "0903.456.789"
  },
  { 
    id: "gv004", 
    name: "Nguyễn Minh", 
    major: "AI", 
    current_slots: 7, 
    max_slots: 18,
    specialization: ["AI", "Blockchain"],
    email: "nguyen.minh@university.edu.vn",
    phone: "0904.567.890"
  },
  { 
    id: "gv005", 
    name: "Trần Hùng", 
    major: "CNTT", 
    current_slots: 9, 
    max_slots: 20,
    specialization: ["Mobile Development", "Cloud Computing"],
    email: "tran.hung@university.edu.vn",
    phone: "0905.678.901"
  },
  { 
    id: "gv006", 
    name: "Lê Quốc Đạt", 
    major: "KHMT", 
    current_slots: 6, 
    max_slots: 15,
    specialization: ["Database", "System Design"],
    email: "le.quoc.dat@university.edu.vn",
    phone: "0906.789.012"
  },
];
