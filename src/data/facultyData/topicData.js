// src/data/facultyData/topicData.js

// Mock data cho đề tài
export const MOCK_TOPICS = [
  { 
    id: 1, 
    topic: "Hệ thống quản lý đồ án", 
    technology: "React, Node.js", 
    description: "Xây dựng quy trình quản lý đồ án tốt nghiệp cho khoa CNTT.", 
    specialization: "WEB",
    status: "active",
    created_at: "2024-01-15",
    updated_at: "2024-02-20"
  },
  { 
    id: 2, 
    topic: "Dự báo xâm nhập mặn", 
    technology: "Python, LSTM", 
    description: "Sử dụng mạng thần kinh để dự báo độ mặn vùng ĐBSCL.", 
    specialization: "AI",
    status: "active",
    created_at: "2024-01-20",
    updated_at: "2024-02-18"
  },
  { 
    id: 3, 
    topic: "App quản lý thực tập", 
    technology: "Flutter, Firebase", 
    description: "Ứng dụng di động giúp sinh viên đăng ký và báo cáo thực tập.", 
    specialization: "Mobile",
    status: "pending",
    created_at: "2024-02-01",
    updated_at: "2024-02-15"
  },
  { 
    id: 4, 
    topic: "Phân loại rác thải", 
    technology: "Computer Vision", 
    description: "Hệ thống nhận diện và phân loại rác qua camera.", 
    specialization: "AI",
    status: "active",
    created_at: "2024-02-05",
    updated_at: "2024-02-10"
  },
  { 
    id: 5, 
    topic: "Website bán hoa tươi", 
    technology: "PHP, Laravel", 
    description: "Xây dựng sàn thương mại điện tử cho cửa hàng hoa.", 
    specialization: "WEB",
    status: "inactive",
    created_at: "2024-01-10",
    updated_at: "2024-02-01"
  },
  { 
    id: 6, 
    topic: "Hệ thống IoT giám sát chất lượng nước", 
    technology: "Arduino, Python", 
    description: "Xây dựng hệ thống IoT để giám sát chất lượng nước tự động.", 
    specialization: "Cấp nước",
    status: "active",
    created_at: "2024-02-12",
    updated_at: "2024-02-14"
  },
  { 
    id: 7, 
    topic: "Phát hiện xâm nhập mạng", 
    technology: "Machine Learning", 
    description: "Sử dụng AI để phát hiện các hành vi xâm nhập mạng bất thường.", 
    specialization: "Bảo mật",
    status: "pending",
    created_at: "2024-02-18",
    updated_at: "2024-02-19"
  },
  { 
    id: 8, 
    topic: "Ứng dụng quản lý tòa nhà", 
    technology: "React Native, Node.js", 
    description: "Xây dựng app quản lý vận hành tòa nhà thông minh.", 
    specialization: "Mobile",
    status: "active",
    created_at: "2024-01-25",
    updated_at: "2024-02-22"
  },
];

// Các chuyên môn có sẵn
export const SPECIALIZATIONS = [
  "Tất cả",
  "AI", 
  "WEB", 
  "Mobile", 
  "Bảo mật", 
  "Cấp nước",
  "Thủy lợi",
  "Môi trường"
];

// Hàm mô phỏng API delay
export const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));

// Các hàm helper
export const getTopicById = (id) => {
  return MOCK_TOPICS.find(topic => topic.id === Number(id));
};

export const filterTopics = (searchTerm = "", specialization = "Tất cả") => {
  return MOCK_TOPICS.filter((topic) => {
    const matchesSearch = topic.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = specialization === "Tất cả" || topic.specialization === specialization;
    return matchesSearch && matchesSpec;
  });
};

export const paginateTopics = (topics, page = 1, itemsPerPage = 5) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return {
    data: topics.slice(start, end),
    total: topics.length,
    currentPage: page,
    totalPages: Math.ceil(topics.length / itemsPerPage),
    itemsPerPage
  };
};