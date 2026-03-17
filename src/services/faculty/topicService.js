/* eslint-disable no-unused-vars */
// services/faculty/topicService.js
import api from "../apiConfig";

// Helper: Transform API response to FE format
const transformTopicFromAPI = (apiTopic) => {
  return {
    id: apiTopic.topic_id,
    topic: apiTopic.title,
    topicName: apiTopic.title,
    technology: apiTopic.technologies,
    description: apiTopic.description,
    specialization: apiTopic.expertise?.name || "",
    expertise_id: apiTopic.expertise?.expertise_id,
    is_available: apiTopic.is_available,
    is_bank_topic: apiTopic.is_bank_topic,
    lecturer: apiTopic.lecturer,
    faculty_staff: apiTopic.faculty_staff
  };
};

// Helper: Transform FE form data to API format
const transformTopicToAPI = (formData, expertise_id = null) => {
  return {
    title: formData.topicName,
    technologies: formData.technology,
    description: formData.description,
    expertise_id: expertise_id || formData.expertise_id,
    is_available: formData.is_available !== undefined ? formData.is_available : true,
    is_bank_topic: formData.is_bank_topic !== undefined ? formData.is_bank_topic : false,
    lecturer_id: formData.lecturer_id || null,
    faculty_staff_id: formData.faculty_staff_id || null
  };
};

const topicService = {
  // Lấy danh sách đề tài (có phân trang và lọc)
  // API: GET /api/v1/faculty_staff/topics?keyword=&page=&per_page=
  getTopics: async ({ page = 1, itemsPerPage = 5, search = "", specialization = "Tất cả", expertise_id = null } = {}) => {
    const response = await api.get("/faculty_staff/topics", {
      params: { 
        keyword: search,
        page,
        per_page: itemsPerPage,
        ...(expertise_id && { expertise_id })
      }
    });
    
    // Transform API response to match expected format
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      const transformedTopics = response.data.data.map(transformTopicFromAPI);
      
      return {
        success: true,
        data: {
          topics: transformedTopics,
          pagination: {
            current_page: response.data.meta?.page || page,
            total_pages: response.data.meta?.last_page || 1,
            total_items: response.data.meta?.total || 0,
            items_per_page: response.data.meta?.per_page || itemsPerPage
          }
        },
        message: "Lấy danh sách đề tài thành công"
      };
    }
    
    return response.data;
  },

  // Lấy chi tiết đề tài theo ID từ danh sách
  // API: GET /api/v1/faculty_staff/topics?page=1&per_page=100 (sử dụng index như yêu cầu)
  getTopicById: async (id) => {
    const response = await api.get("/faculty_staff/topics", {
      params: { 
        page: 1,
        per_page: 100
      }
    });
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      const topic = response.data.data.find(t => t.topic_id == id);
      if (topic) {
        return {
          success: true,
          data: transformTopicFromAPI(topic)
        };
      }
    }
    
    return {
      success: false,
      message: "Không tìm thấy đề tài"
    };
  },

  // Thêm đề tài mới
  // API: POST /api/v1/faculty_staff/topics
  addTopic: async (topicData, expertise_id = null) => {
    const apiData = transformTopicToAPI(topicData, expertise_id);
    const response = await api.post("/faculty_staff/topics", apiData);
    
    if (response.data && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message || "Thêm đề tài thành công",
        data: transformTopicFromAPI(response.data.data)
      };
    }
    return response.data;
  },

  // Cập nhật đề tài
  // API: PUT /api/v1/faculty_staff/topics/{id}
  updateTopic: async (id, topicData, expertise_id = null) => {
    const apiData = transformTopicToAPI(topicData, expertise_id);
    const response = await api.put(`/faculty_staff/topics/${id}`, apiData);
    
    if (response.data && response.data.data) {
      return {
        success: response.data.success,
        message: response.data.message || "Cập nhật đề tài thành công",
        data: transformTopicFromAPI(response.data.data)
      };
    }
    return response.data;
  },

  // Xóa đề tài
  // API: DELETE /api/v1/faculty_staff/topics/{id}
  deleteTopic: async (id) => {
    const response = await api.delete(`/faculty_staff/topics/${id}`);
    return response.data;
  },

  // Lấy danh sách specializations (chuyên môn) từ API
  // API: GET /api/v1/expertises
  getSpecializations: async () => {
    const response = await api.get("/expertises");
    
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // Transform expertises to format with id and name
      const specializations = response.data.data.map(expertise => ({
        id: expertise.expertise_id,
        name: expertise.name || expertise.expertise_name
      }));
      
      return {
        success: true,
        data: specializations,
        message: "Lấy danh sách chuyên môn thành công"
      };
    }
    
    return response.data;
  }
};

export default topicService;