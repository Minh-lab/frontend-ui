// src/services/faculty/index.js
import topicService from './topicService';
import planService from './planService';
import profileService from './profileService';
import lecturerService from './lecturerService';
// import internshipService from './internshipService';
import capstoneService from './capstoneService';
import councilService from './councilService';

// Flag để chuyển đổi giữa mock và real API cho tất cả faculty services
// ✅ UPDATED: Sử dụng REAL API từ backend (backend lecturer đã hoàn thiện)
export const USE_MOCK = false;

export {
  topicService,
  planService,
  profileService,
  lecturerService,
  // internshipService,
  capstoneService,
  councilService
};

// Export mặc định tất cả services
const facultyServices = {
  topic: topicService,
  plan: planService,
  profile: profileService,
  lecturer: lecturerService,
  // internship: internshipService,
  capstone: capstoneService,
  council: councilService
};

export default facultyServices;