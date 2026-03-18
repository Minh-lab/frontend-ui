import api from "../apiConfig";

const internCompany = {
    getIntern: async () => {
        try {
            const response = await api.get("/business/internships/interns");
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi tải danh sách thực tập" };
        }
    },

    evaluateIntern: async (internshipId, evaluationData) => {
        try {
            const response = await api.post(`/business/internships/${internshipId}/evaluate`, evaluationData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi khi lưu đánh giá" };
        }
    },
    waitingListIntern: async () => {
        try {
            const response = await api.get("/business/internships/waiting-list");
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi tải danh sách chờ" };
        }
    },

    confirmIntern: async (internshipId, status) => {
        try {
            const response = await api.post(`/business/internships/${internshipId}/confirm`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi khi xác nhận thực tập" };
        }
    },
};

export default internCompany;