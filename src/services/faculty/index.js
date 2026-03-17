// src/services/faculty/index.js
import topicService from './topicService';
import planService from './planService';
import profileService from './profileService';
import lecturerService from './lecturerService';
// import internshipService from './internshipService';
import capstoneService from './capstoneService';

// Flag để chuyển đổi giữa mock và real API cho tất cả faculty services
export const USE_MOCK = true; // false khi backend đã sẵn sàng

export {
  topicService,
  planService,
  profileService,
  lecturerService,
  // internshipService,
  capstoneService
};

// Export mặc định tất cả services
const facultyServices = {
  topic: topicService,
  plan: planService,
  profile: profileService,
  lecturer: lecturerService,
  // internship: internshipService,
  capstone: capstoneService
};

export default facultyServices;