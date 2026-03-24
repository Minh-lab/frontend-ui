import api from "./apiConfig";

const studentService = {
  getProfile: async () => {
    try {
      const response = await api.get("/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Loi tai thong tin ca nhan" };
    }
  },

  registerCapstoneTopic: async (payload) => {
    try {
      const response = await api.post("/capstones/register-topic", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Khong the dang ky de tai" };
    }
  },

  registerCapstonePhase: async (payload = { topic_id: 1, student_id: 1 }) => {
    try {
      const response = await api.post("/capstonerequest/register-capstone", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Khong the dang ky dot do an" };
    }
  },

  proposeCapstoneTopic: async (payload) => {
    try {
      const response = await api.post("/capstones/propose-topic", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Khong the de xuat de tai" };
    }
  },

  getExpertises: async () => {
    try {
      const response = await api.get("/expertises");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Khong the tai danh sach linh vuc" };
    }
  },

  getMyCapstoneStatus: async () => {
    try {
      const response = await api.get("/capstones/my-status");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Khong the tai trang thai de tai" };
    }
  },

  cancelCapstone: async () => {
    try {
      const response = await api.post("/student/capstones/request-cancel");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Khong the yeu cau huy do an" };
    }
  },

  registerLecturer: async (payload) => {
    try {
      // payload expects capstone_id, lecturer_id, student_message (optional), file (optional)
      const response = await api.post("/capstonerequest/register-lecturer", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Khong the dang ky GVHD" };
    }
  },

  getCapstoneMilestones: async () => {
    try {
      const response = await api.get("/capstones/milestones");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể lấy danh sách đợt đồ án" };
    }
  },

  getCapstoneReportHistory: async () => {
    try {
      const response = await api.get("/capstones/reports/history");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể lấy lịch sử báo cáo đồ án" };
    }
  },

  submitCapstoneReport: async (payload) => {
    try {
      // payload expects capstone_id, milestone_id, link, report_file
      const response = await api.post("/capstones/reports/submit", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể nộp báo cáo đồ án" };
    }
  },
};

export default studentService;
