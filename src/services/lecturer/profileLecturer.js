import api from "../apiConfig";

const profileLecturer = {
    getProfile: async () => {
        try {
            const response = await api.get("/profile");
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi tải thông tin cá nhân" };
        }
    },
    getExpertises: async () => {
        try {
            const response = await api.get("/lecturer/expertises");
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi tải danh sách chuyên môn" };
        }
    },
    updateExpertises: async (expertiseIds) => {
        try {
            const response = await api.put("/lecturer/expertises", { expertise_ids: expertiseIds });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi cập nhật chuyên môn" };
        }
    },
    submitLeaveRequest: async (formData) => {
        try {
            const response = await api.post("/lecturer/leave-requests", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi gửi yêu cầu nghỉ phép" };
        }
    }
};

export default profileLecturer;