/**
 * Transform utilities để chuyển đổi dữ liệu từ backend format sang frontend format
 * Tập trung các transformer functions từ các pages vào một file duy nhất
 */

/**
 * Dịch status đồ án từ tiếng Anh sang tiếng Việt
 * @param {string} status - Trạng thái từ backend (tiếng Anh)
 * @returns {string} Trạng thái tiếng Việt
 */
export const translateCapstoneStatus = (status) => {
  const statusMap = {
    'INITIALIZED': 'Chưa khởi tạo',
    'LECTURER_APPROVED': 'GVHD đã phê duyệt',
    'TOPIC_APPROVED': 'Đề tài đã duyệt',
    'REPORTING': 'Đang nộp báo cáo',
    'OFFICIAL_SUBMITTED': 'Nộp báo cáo cuối cùng',
    'REVIEW_ELIGIBLE': 'Chờ phản biện',
    'DEFENSE_ELIGIBLE': 'Chờ bảo vệ',
    'CANCEL': 'Đã hủy',
    'FAILED': 'Đã trượt',
    'COMPLETED': 'Hoàn tất'
  };
  return statusMap[status] || status;
};

/**
 * Transform Capstone data từ backend sang frontend format
 * @param {Object} backendData - Dữ liệu từ backend (từ CapstoneController)
 * @returns {Object} Dữ liệu đã transform cho hiển thị UI
 */
export const transformCapstone = (backendData) => ({
  id: backendData.capstone_id,
  student_id: backendData.student?.student_id,
  name: backendData.student?.full_name || "---",
  class: backendData.student?.studentClass?.class_name || "---",
  topic: backendData.topic?.title || "---",
  major: backendData.topic?.expertise?.name || "---",
  status: translateCapstoneStatus(backendData.status),
  status_raw: backendData.status,
  gvhd: backendData.lecturer?.full_name || "",
  gvpb: backendData.reviewers?.map(r => r.lecturer?.full_name).filter(Boolean).join(", ") || "",
  council: backendData.council?.name || "",
  score: (backendData.instructor_grade && typeof backendData.instructor_grade === 'number') ? parseFloat(backendData.instructor_grade).toFixed(2) : "",
  description: backendData.topic?.description,
  registration_date: backendData.created_at,
  has_pending_cancel_request: backendData.has_pending_cancel_request,
  pending_cancel_request: backendData.pending_cancel_request,
  instructor_grade: (backendData.instructor_grade && typeof backendData.instructor_grade === 'number') ? parseFloat(backendData.instructor_grade).toFixed(2) : null,
  council_grade: (backendData.council_grade && typeof backendData.council_grade === 'number') ? parseFloat(backendData.council_grade).toFixed(2) : null,
  defense_order: backendData.defense_order,
  semester_id: backendData.semester_id,
});

/**
 * Transform Lecturer data cho hiển thị
 * @param {Object} backendData - Dữ liệu lecturer từ backend
 * @returns {Object} Dữ liệu đã transform
 */
export const transformLecturer = (backendData) => ({
  id: backendData.lecturer_id,
  usercode: backendData.usercode,
  full_name: backendData.full_name,
  email: backendData.email,
  degree: backendData.degree,
  department: backendData.department,
  students_enabled: backendData.students_enabled || 0,
  students_max: backendData.students_max || 0,
});

/**
 * Transform Council data cho hiển thị
 * @param {Object} backendData - Dữ liệu council từ backend
 * @returns {Object} Dữ liệu đã transform
 */
export const transformCouncil = (backendData) => ({
  id: backendData.council_id,
  name: backendData.name,
  semester_id: backendData.semester_id,
  buildings: backendData.buildings,
  rooms: backendData.rooms,
  start_date: backendData.start_date,
  end_date: backendData.end_date,
  members: backendData.council_members || []
});

/**
 * Transform Topic data cho hiển thị
 * @param {Object} backendData - Dữ liệu topic từ backend
 * @returns {Object} Dữ liệu đã transform
 */
export const transformTopic = (backendData) => ({
  id: backendData.topic_id,
  title: backendData.title,
  description: backendData.description,
  expertise: backendData.expertise?.name || "",
  technologies: backendData.technologies,
  lecturer_id: backendData.lecturer_id,
  lecturer_name: backendData.lecturer?.full_name || ""
});

/**
 * Transform Capstone Request (Đơn đăng ký/yêu cầu đồ án) data
 * @param {Object} backendData - Dữ liệu từ backend
 * @returns {Object} Dữ liệu đã transform
 */
export const transformCapstoneRequest = (backendData) => ({
  request_id: backendData.capstone_request_id,
  capstone_id: backendData.capstone_id,
  type: backendData.type, // LECTURER_REG, TOPIC_PROP, TOPIC_BANK, CANCEL_REQ
  status: backendData.status, // PENDING_TEACHER, PENDING_FACULTY, APPROVED, REJECTED
  student_message: backendData.student_message,
  lecturer_feedback: backendData.lecturer_feedback,
  topic_id: backendData.topic_id,
  lecturer_id: backendData.lecturer_id,
  file_path: backendData.file_path,
  created_at: backendData.created_at,
  updated_at: backendData.updated_at
});

/**
 * Transform Pagination data
 * @param {Object} paginationData - Dữ liệu pagination từ backend
 * @returns {Object} Dữ liệu đã format
 */
export const transformPagination = (paginationData) => ({
  current_page: paginationData.current_page || 1,
  total_pages: paginationData.last_page || 1,
  total_items: paginationData.total || 0,
  items_per_page: paginationData.per_page || 10,
  has_next: paginationData.current_page < paginationData.last_page,
  has_prev: paginationData.current_page > 1
});
