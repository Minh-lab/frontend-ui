import api from "./apiConfig";
import { 
  MOCK_TOPICS, 
  SPECIALIZATIONS, 
  simulateApiDelay,
  getTopicById,
  filterTopics,
  paginateTopics 
} from "@/data/facultyData";

// Flag để chuyển đổi giữa mock và real API
const USE_MOCK = true; // Set false khi backend đã sẵn sàng

const facultyService = {
  // Profile methods
  getProfile: async () => {
    try {
      const response = await api.get("/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Lỗi tải thông tin cá nhân" };
    }
  },

  // ===== TOPIC MANAGEMENT =====
  // Lấy danh sách đề tài (có phân trang và lọc)
  getTopics: async ({ page = 1, itemsPerPage = 5, search = "", specialization = "Tất cả" } = {}) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        // Lọc dữ liệu
        const filteredTopics = filterTopics(search, specialization);
        
        // Phân trang
        const paginatedResult = paginateTopics(filteredTopics, page, itemsPerPage);
        
        return {
          success: true,
          data: {
            topics: paginatedResult.data,
            pagination: {
              current_page: paginatedResult.currentPage,
              total_pages: paginatedResult.totalPages,
              total_items: paginatedResult.total,
              items_per_page: paginatedResult.itemsPerPage
            }
          },
          message: "Lấy danh sách đề tài thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách đề tài"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/topics", {
          params: { page, itemsPerPage, search, specialization }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách đề tài" };
      }
    }
  },

  // Lấy chi tiết đề tài theo ID
  getTopicById: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        const topic = getTopicById(id);
        
        if (topic) {
          return {
            success: true,
            data: topic,
            message: "Lấy thông tin đề tài thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy đề tài"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy thông tin đề tài"
        };
      }
    } else {
      try {
        const response = await api.get(`/faculty/topics/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải thông tin đề tài" };
      }
    }
  },

  // Thêm đề tài mới
  addTopic: async (topicData) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        // Tạo ID mới
        const newId = Math.max(...MOCK_TOPICS.map(t => t.id)) + 1;
        
        const newTopic = {
          id: newId,
          ...topicData,
          created_at: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString().split('T')[0],
          status: 'active'
        };
        
        // Thêm vào mảng (trong thực tế sẽ thêm vào database)
        MOCK_TOPICS.push(newTopic);
        
        return {
          success: true,
          data: newTopic,
          message: "Thêm đề tài thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi thêm đề tài"
        };
      }
    } else {
      try {
        const response = await api.post("/faculty/topics", topicData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi thêm đề tài" };
      }
    }
  },

  // Cập nhật đề tài
  updateTopic: async (id, topicData) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const index = MOCK_TOPICS.findIndex(t => t.id === Number(id));
        
        if (index !== -1) {
          MOCK_TOPICS[index] = {
            ...MOCK_TOPICS[index],
            ...topicData,
            updated_at: new Date().toISOString().split('T')[0]
          };
          
          return {
            success: true,
            data: MOCK_TOPICS[index],
            message: "Cập nhật đề tài thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy đề tài"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi cập nhật đề tài"
        };
      }
    } else {
      try {
        const response = await api.put(`/faculty/topics/${id}`, topicData);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi cập nhật đề tài" };
      }
    }
  },

  // Xóa đề tài
  deleteTopic: async (id) => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        
        const index = MOCK_TOPICS.findIndex(t => t.id === Number(id));
        
        if (index !== -1) {
          const deletedTopic = MOCK_TOPICS.splice(index, 1)[0];
          
          return {
            success: true,
            data: deletedTopic,
            message: "Xóa đề tài thành công"
          };
        } else {
          return {
            success: false,
            message: "Không tìm thấy đề tài"
          };
        }
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi xóa đề tài"
        };
      }
    } else {
      try {
        const response = await api.delete(`/faculty/topics/${id}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi xóa đề tài" };
      }
    }
  },

  // Lấy danh sách chuyên môn
  getSpecializations: async () => {
    if (USE_MOCK) {
      try {
        await simulateApiDelay();
        return {
          success: true,
          data: SPECIALIZATIONS.filter(s => s !== "Tất cả"),
          message: "Lấy danh sách chuyên môn thành công"
        };
      } catch (error) {
        return {
          success: false,
          message: error.message || "Lỗi khi lấy danh sách chuyên môn"
        };
      }
    } else {
      try {
        const response = await api.get("/faculty/specializations");
        return response.data;
      } catch (error) {
        throw error.response?.data || { message: "Lỗi tải danh sách chuyên môn" };
      }
    }
  },
};

export default facultyService;