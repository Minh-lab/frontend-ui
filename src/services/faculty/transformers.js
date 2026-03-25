/**
 * 🔄 TRANSFORMER FUNCTIONS
 * Dùng để convert backend real data thành format frontend mong muốn
 * 
 * File này sẽ thay thế việc dùng mock data
 */

// ============================================================
// 0️⃣ CAPSTONE TRANSFORMERS
// ============================================================

/**
 * Transform backend capstone data to frontend display format
 * Maps nested objects to flat structure for easier component display
 * 
 * @param {Object} backendData - Capstone object from backend
 * @returns {Object} Flat capstone object for frontend display
 */
export const transformCapstone = (backendData) => ({
  id: backendData.capstone_id,
  name: backendData.student?.full_name,
  class: backendData.student?.studentClass?.class_name,
  topic: backendData.topic?.title,
  status: backendData.status,
  gvhd: backendData.lecturer?.full_name || "",
  gvpb: backendData.reviewers?.map(r => r.lecturer?.full_name).filter(Boolean).join(", ") || "",
  council: backendData.council?.name || "",
  score: backendData.instructor_grade || "",
  major: backendData.topic?.expertise?.name,
  description: backendData.topic?.description,
  registration_date: backendData.created_at,
  has_pending_cancel_request: backendData.has_pending_cancel_request,
  pending_cancel_request: backendData.pending_cancel_request
});

/**
 * Transform council data for display
 */
export const transformCouncil = (backendData) => ({
  id: backendData.council_id,
  name: backendData.name,
  members: backendData.members || []
});

/**
 * Transform lecturer data for reviewer selection
 */
export const transformLecturer = (backendData) => ({
  id: backendData.lecturer_id,
  name: backendData.full_name,
  specialization: backendData.expertises?.map(e => e.name).join(", ") || ""
});

// ============================================================
// 1️⃣ CONVERT SINGLE LECTURER ITEM (Danh sách)
// ============================================================

/**
 * Map backend lecturer object to frontend format
 * @param {Object} backendLecturer - Backend Lecturer model  
 * @returns {Object} Frontend lecturer format
 */
export function mapLecturerFromBackend(backendLecturer) {
  return {
    // ID: Convert number to string để match frontend format
    id: String(backendLecturer.lecturer_id),
    
    // Name: Rename field
    name: backendLecturer.full_name,
    
    // Specialization: Join tất cả expertises (nếu có nhiều)
    specialization: backendLecturer.expertises?.length > 0
      ? backendLecturer.expertises.map(e => e.name).join(", ")
      : "Chưa xác định",
    
    // Status: Convert boolean is_active + check leave requests
    status: getStatusFromBackend(backendLecturer),
    
    // Keep other useful fields
    email: backendLecturer.email,
    phone_number: backendLecturer.phone_number,
    degree: backendLecturer.degree,
    department: backendLecturer.department,
  };
}

// ============================================================
// 2️⃣ CONVERT STATUS (Wrapper function)
// ============================================================

/**
 * Determine lecturer status from backend data
 * Rules:
 * - If has active LEAVE record (APPROVED_PENDING or LEAVE_ACTIVE) → "Nghỉ phép"
 * - If has pending LEAVE_REQ → "Yêu cầu nghỉ phép"
 * - If is_active = 0 → "Ngưng công tác"  
 * - If is_active = 1 → "Hoạt động"
 * 
 * @param {Object} lecturer - Lecturer object với is_active + requests + leaves
 * @returns {String} Status text: "Hoạt động" | "Yêu cầu nghỉ phép" | "Ngưng công tác" | "Nghỉ phép"
 */
export function getStatusFromBackend(lecturer) {
  // Priority 1: Check for active leave records (APPROVED_PENDING or LEAVE_ACTIVE)
  if (lecturer.leaves && Array.isArray(lecturer.leaves)) {
    const hasActiveLeave = lecturer.leaves.some(
      leave => leave.status === 'LEAVE_ACTIVE' || leave.status === 'APPROVED_PENDING'
    );
    if (hasActiveLeave) {
      return "Nghỉ phép";
    }
  }
  
  // Priority 2: Check for pending leave requests
  if (lecturer.requests && Array.isArray(lecturer.requests)) {
    const hasPendingLeave = lecturer.requests.some(
      req => req.type === 'LEAVE_REQ' && req.status === 'PENDING'
    );
    if (hasPendingLeave) {
      return "Yêu cầu nghỉ phép";
    }
  }
  
  // Priority 3: Check is_active status
  if (lecturer.is_active === 0 || lecturer.is_active === false) {
    return "Ngưng công tác";
  }
  
  // Default: Active
  return "Hoạt động";
}

// ============================================================
// 3️⃣ CONVERT DETAILED LECTURER (Chi tiết + Leave request)
// ============================================================

/**
 * Map backend lecturer detail to frontend format
 * Dùng cho ViewLecturer component
 * 
 * @param {Object} backendLecturer - Full lecturer object từ GET /v1/vpk/lecturers/{id}
 * @returns {Object} Frontend lecturer detail format
 */
export function mapLecturerDetailFromBackend(backendLecturer) {
  // Get base fields từ danh sách
  const baseLecturer = mapLecturerFromBackend(backendLecturer);
  
  // Add additional fields
  baseLecturer.gender = backendLecturer.gender;
  baseLecturer.dob = backendLecturer.dob;
  
  // Map leave request nếu có
  baseLecturer.leave_request = null;
  if (backendLecturer.requests && Array.isArray(backendLecturer.requests)) {
    const pendingLeave = backendLecturer.requests.find(
      req => req.type === 'LEAVE_REQ' && req.status === 'PENDING'
    );
    
    if (pendingLeave) {
      baseLecturer.leave_request = {
        request_id: pendingLeave.request_id,  // Add này để dùng trong approve/reject
        title: pendingLeave.title,
        description: pendingLeave.description,
        file_path: pendingLeave.file_path,
        start_date: pendingLeave.start_date,
        end_date: pendingLeave.end_date,
        status: pendingLeave.status,
        type: pendingLeave.type,
      };
    }
  }
  
  return baseLecturer;
}

// ============================================================
// 4️⃣ TRANSFORM API RESPONSE (Danh sách từ /faculty/lecturers)
// ============================================================

/**
 * Transform response từ GET /v1/faculty/lecturers
 * Backend trả về { success, message, data: [], total }
 * 
 * @param {Object} response - Raw response từ API
 * @returns {Object} Formatted response cho frontend
 */
export function transformFacultyLecturersResponse(response) {
  return {
    success: response.success ?? true,
    message: response.message ?? "Lấy danh sách giảng viên thành công",
    data: {
      lecturers: (response.data || []).map(mapLecturerFromBackend),
      pagination: {
        current_page: 1,  // Backend không return, phải manual
        total_pages: Math.ceil((response.total || 0) / 5),  // Giả sử 5 items/page
        total_items: response.total || 0,
        items_per_page: 5
      }
    }
  };
}

// ============================================================
// 5️⃣ TRANSFORM DETAIL RESPONSE (Chi tiết từ /vpk/lecturers/{id})
// ============================================================

/**
 * Transform response từ GET /v1/vpk/lecturers/{id}
 * Backend trả về lecturer object directly (không wrap trong data)
 * 
 * @param {Object} response - Raw response từ API
 * @returns {Object} Formatted response cho frontend
 */
export function transformLecturerDetailResponse(response) {
  // Response có thể là direct lecturer object hoặc {success, data, message}
  const lecturer = response.data || response;
  
  return {
    success: response.success ?? true,
    message: response.message ?? "Lấy thông tin giảng viên thành công",
    data: mapLecturerDetailFromBackend(lecturer)
  };
}

// ============================================================
// 6️⃣ CONVERT EXPERTISES TO STRING
// ============================================================

/**
 * Join multiple expertises into single string
 * @param {Array} expertises - Array of expertise objects
 * @returns {String} Comma-separated expertise names
 */
export function formatExpertises(expertises) {
  if (!Array.isArray(expertises) || expertises.length === 0) {
    return "Chưa xác định";
  }
  return expertises.map(e => e.name).join(", ");
}

// ============================================================
// 7️⃣ UTILITIES: Status Color Mapping
// ============================================================

/**
 * Get CSS class for status badge based on status text
 * Reuse logic từ frontend original code
 * 
 * @param {String} status - Status text ("Hoạt động", "Yêu cầu nghỉ phép", etc)
 * @returns {String} CSS classes
 */
export function getStatusColorClass(status) {
  switch(status) {
    case "Hoạt động":
      return "text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold";
    case "Yêu cầu nghỉ phép":
      return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-bold";
    case "Ngưng công tác":
      return "text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-bold";
    default:
      return "text-slate-600";
  }
}

// ============================================================
// 8️⃣ FORMAT DATE
// ============================================================

/**
 * Format date string to Vietnamese format
 * @param {String} dateString - ISO date string (2024-03-15)
 * @returns {String} Formatted date (15/03/2024)
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  } catch {
    return dateString;
  }
}

// ============================================================
// USAGE EXAMPLES
// ============================================================

/*
// Example 1: Transform danh sách giảng viên
const response = await api.get('/v1/faculty/lecturers');
const formatted = transformFacultyLecturersResponse(response.data);
setLecturers(formatted.data.lecturers);

// Example 2: Transform chi tiết giảng viên
const detailResponse = await api.get('/v1/vpk/lecturers/1');
const formatted = transformLecturerDetailResponse(detailResponse.data);
setLecturer(formatted.data);

// Example 3: Display formatters
const lecturer = { full_name: "Nguyễn An", is_active: 1, requests: [] };
const status = getStatusFromBackend(lecturer); // "Hoạt động"
const classes = getStatusColorClass(status);   // "text-green-600 bg-green-50..."
*/
