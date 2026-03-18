import api from "../apiConfig";

const topicService = {
    // UC13: Tìm kiếm đề tài (Lecturer dùng GET /topics - route chung)
    searchTopics: async (params) => {
        try {
            const response = await api.get("/topics", { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi tìm kiếm đề tài" };
        }
    },

    // UC14: Thêm đề tài (Lecturer only) - POST /lecturer/topics
    createTopic: async (topicData) => {
        try {
            const response = await api.post("/lecturer/topics", topicData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi thêm đề tài" };
        }
    },

    // UC15: Sửa đề tài (Lecturer only) - PUT /lecturer/topics/{id}
    updateTopic: async (topicId, topicData) => {
        try {
            const response = await api.put(`/lecturer/topics/${topicId}`, topicData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi cập nhật đề tài" };
        }
    },

    // UC16: Xoá đề tài (Lecturer only) - DELETE /lecturer/topics/{id}
    deleteTopic: async (topicId) => {
        try {
            const response = await api.delete(`/lecturer/topics/${topicId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi xoá đề tài" };
        }
    },
};

export default topicService;
