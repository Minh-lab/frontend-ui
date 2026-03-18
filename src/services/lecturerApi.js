import axiosInstance from "./apiConfig";

const lecturerApi = {
    getLecturers: async () => {
        try {
            const response = await axiosInstance.get(`/lecturers/search`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default lecturerApi;