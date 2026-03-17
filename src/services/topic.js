import api from "./apiConfig";

const topicService = {
    // UC13: Tìm kiếm đề tài
    searchTopics: async (params) => {
        try {
            const response = await api.get("/topics", { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi tìm kiếm đề tài" };
        }
    },

    // UC14: Thêm đề tài
    createTopic: async (topicData) => {
        try {
            const response = await api.post("/topics", topicData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi thêm đề tài" };
        }
    },

    // UC15: Sửa đề tài
    updateTopic: async (topicId, topicData) => {
        try {
            const response = await api.put(`/topics/${topicId}`, topicData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi cập nhật đề tài" };
        }
    },

    // UC16: Xoá đề tài
    deleteTopic: async (topicId) => {
        try {
            const response = await api.delete(`/topics/${topicId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi xoá đề tài" };
        }
    },
};

export default topicService;