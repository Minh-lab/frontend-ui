// src/data/facultyData/index.js

// Export từ topicData
export { 
  MOCK_TOPICS,
  SPECIALIZATIONS as TOPIC_SPECIALIZATIONS,  // Đổi tên để tránh xung đột
  getTopicById,
  filterTopics,
  paginateTopics
} from './topicData';

// Export từ planData  
export {
  PHASE_NAMES,
  MOCK_SEMESTERS,
  MOCK_MILESTONE_TYPES,
  MOCK_MILESTONES,
  MOCK_PLANS,
  getPhaseNamesByType,
  getDefaultPhaseName,
  getAllPhaseNames,
  getAllPlans,
  getPlanById,
  getPlanByYearAndSemester,
  getUniqueYears,
  getSemestersByYear,
  getAllMilestones,
  getMilestoneById,
  getMilestonesBySemester,
  getMilestonesByType,
  filterPlans,
  paginatePlans
} from './planData';

// Export từ capstoneData
export {
  CAPSTONE_STATUS,
  MOCK_CAPSTONES,
  MOCK_COUNCILS,
  COUNCIL_MEMBERS,
  MOCK_LECTURERS as CAPSTONE_LECTURERS,  // Đổi tên để tránh xung đột
  MOCK_REGISTRATIONS,
  CAPSTONE_STATISTICS,
  filterCapstones,
  filterRegistrations,
  getCouncilById,
  getCouncilMembers,
  getLecturerById,  // Đổi tên để tránh xung đột
  paginateData,
  calculateCapstoneStatistics,
  handleCancelCapstone
} from './capstoneData';

// Export từ lecturerData
export {
  SPECIALIZATIONS as LECTURER_SPECIALIZATIONS,  // Đổi tên để tránh xung đột
  STATUS_OPTIONS,
  DEGREES,
  MOCK_LECTURERS,
  MOCK_LECTURER_DETAILS,
  filterLecturers,
  getLecturerDetail,
  processLeaveRequest,
  paginateLecturers,
  getLecturerStatistics
} from './lecturerData';

// Export từ internshipData
export {
  internshipsData,
  enterprisesData,
  lecturersData
} from './internshipData';

// Export riêng hàm simulateApiDelay (chỉ 1 lần)
export const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 500));