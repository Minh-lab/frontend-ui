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
