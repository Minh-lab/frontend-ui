import api from "./apiConfig";

const topicService = {
    // UC13: Tìm kiếm đề tài (All authenticated users - Student, Lecturer, FacultyStaff)
    // For CREATE/UPDATE/DELETE: Use lecturer/topicService.js or faculty/topicService.js
    searchTopics: async (params) => {
        try {
            const response = await api.get("/topics", { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi tìm kiếm đề tài" };
        }
    },
};

export default topicService;