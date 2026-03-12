/**
 * StatusBadge component - Hiển thị trạng thái với badge màu sắc
 * @param {string} status - Trạng thái cần hiển thị (ví dụ: "Đang thực hiện", "Đã hoàn thành", etc.)
 */
function StatusBadge({ status }) {
  if (!status) return null;

  // Map trạng thái sang màu sắc và CSS class
  const getStatusStyle = (status) => {
    const lowerStatus = status.toLowerCase();
    
    // Trạng thái hoàn thành
    if (lowerStatus.includes("hoan thanh") || lowerStatus.includes("xong") || lowerStatus.includes("success")) {
      return {
        className: "bg-green-100 text-green-700 border border-green-300",
        icon: "✓"
      };
    }
    
    // Trạng thái đang thực hiện
    if (lowerStatus.includes("dang") || lowerStatus.includes("in progress")) {
      return {
        className: "bg-blue-100 text-blue-700 border border-blue-300",
        icon: "○"
      };
    }
    
    // Trạng thái chờ duyệt
    if (lowerStatus.includes("cho") || lowerStatus.includes("pending") || lowerStatus.includes("xu ly")) {
      return {
        className: "bg-yellow-100 text-yellow-700 border border-yellow-300",
        icon: "⏳"
      };
    }
    
    // Trạng thái bị từ chối / lỗi
    if (lowerStatus.includes("tu choi") || lowerStatus.includes("error") || lowerStatus.includes("failed")) {
      return {
        className: "bg-red-100 text-red-700 border border-red-300",
        icon: "✗"
      };
    }
    
    // Mặc định
    return {
      className: "bg-gray-100 text-gray-700 border border-gray-300",
      icon: "•"
    };
  };

  const style = getStatusStyle(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${style.className}`}>
      <span>{style.icon}</span>
      <span>{status}</span>
    </span>
  );
}

export default StatusBadge;

// ============================================================
// components/StatusBadge.jsx
// Badge trạng thái – màu theo Figma
// ============================================================
const CONFIG = {
  "Đã hoàn thành":  "bg-green-100 text-green-700 border border-green-200",
  "Chờ duyệt":      "bg-purple-100 text-purple-700 border border-purple-200",
  "Chưa nộp":       "bg-orange-100 text-orange-600 border border-orange-200",
  "Đang xử lý":     "bg-orange-100 text-orange-600 border border-orange-200",
  "Đang thực hiện": "bg-indigo-100 text-indigo-700 border border-indigo-200",
  "Chưa đăng ký":   "bg-orange-100 text-orange-500 border border-orange-200",
  "Đã đăng ký":     "bg-orange-100 text-orange-500 border border-orange-200",
  "Còn nhận":       "bg-green-100 text-green-600 border border-green-200",
};

export default function StatusBadge({ status }) {
  const cls = CONFIG[status] || "bg-gray-100 text-gray-600 border border-gray-200";
  return (
    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}
