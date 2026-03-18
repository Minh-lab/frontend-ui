import api from "../apiConfig";

const profileCompany = {
    getProfile: async () => {
        try {
            const response = await api.get("/profile");
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi tải thông tin cá nhân" };
        }
    },
};

export default profileCompany;