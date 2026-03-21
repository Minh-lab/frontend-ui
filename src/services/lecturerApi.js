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

    getStudentRegister: async () => {
        try {
            const respone = await axiosInstance.get(`/capstones/pending-requests`);
            return respone.data
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    confirmStudentRegister: async (requestId, payload) => {
        try {
            const response = await axiosInstance.post(`/capstones/requests/${requestId}/confirm`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getPendingInternReports: async () => {
        try {
            const response = await axiosInstance.get(`/lecturer/internships/pending-reports`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    reviewInternReport: async (reportId, payload) => {
        try {
            const response = await axiosInstance.post(`/lecturer/internships/reports/${reportId}/review`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getInternshipGradingList: async () => {
        try {
            const response = await axiosInstance.get(`/lecturer/internships/grading-list`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    submitInternshipGrade: async (internshipId, payload) => {
        try {
            const response = await axiosInstance.post(`/lecturer/internships/${internshipId}/grade`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getPendingInternshipCancellations: async () => {
        try {
            const response = await axiosInstance.get(`/lecturer/internships/pending-cancels`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    reviewInternshipCancellation: async (requestId, payload) => {
        try {
            const response = await axiosInstance.post(`/lecturer/internships/review-cancel/${requestId}`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getPendingCapstoneTopics: async () => {
        try {
            const response = await axiosInstance.get(`/lecturer/capstones/pending-topics`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    reviewCapstoneTopic: async (requestId, payload) => {
        try {
            const response = await axiosInstance.post(`/lecturer/capstones/topics/${requestId}/review`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getPendingCapstoneReports: async () => {
        try {
            const response = await axiosInstance.get(`/lecturer/capstones/pending-reports`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    reviewCapstoneReport: async (reportId, payload) => {
        try {
            const response = await axiosInstance.post(`/lecturer/capstones/reports/${reportId}/approve`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getPendingCapstoneCancellations: async () => {
        try {
            const response = await axiosInstance.get(`/lecturer/capstones/cancellations`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    reviewCapstoneCancellation: async (capstoneId, payload) => {
        try {
            const response = await axiosInstance.post(`/lecturer/capstones/cancellations/${capstoneId}/review`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getCapstoneGradingList: async () => {
        try {
            const response = await axiosInstance.get(`/lecturer/capstones/grading`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    submitCapstoneGrade: async (capstoneId, payload) => {
        try {
            const response = await axiosInstance.post(`/lecturer/capstones/grading/${capstoneId}/submit`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getCapstoneReviewingList: async () => {
        try {
            const response = await axiosInstance.get(`/lecturer/capstones/reviewing`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    submitCapstoneReviewGrade: async (capstoneId, payload) => {
        try {
            const response = await axiosInstance.post(`/lecturer/capstones/reviewing/${capstoneId}/submit`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default lecturerApi;
