import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Search, Plus, Eye, Trash2, Edit, 
  ChevronLeft, ChevronRight, AlertCircle 
} from "lucide-react";
import { 
  Table, TableHeader, TableBody, 
  TableHead, TableRow, TableCell 
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";

// 1. Cập nhật Mock Data với trường description (Mô tả)
const MOCK_TOPICS = [
  { 
    id: 1, 
    topic: "Hệ thống quản lý đồ án", 
    technology: "React, Node.js", 
    description: "Xây dựng quy trình quản lý đồ án tốt nghiệp cho khoa CNTT.", 
    specialization: "WEB" 
  },
  { 
    id: 2, 
    topic: "Dự báo xâm nhập mặn", 
    technology: "Python, LSTM", 
    description: "Sử dụng mạng thần kinh để dự báo độ mặn vùng ĐBSCL.", 
    specialization: "AI" 
  },
  { 
    id: 3, 
    topic: "App quản lý thực tập", 
    technology: "Flutter, Firebase", 
    description: "Ứng dụng di động giúp sinh viên đăng ký và báo cáo thực tập.", 
    specialization: "Mobile" 
  },
  { 
    id: 4, 
    topic: "Phân loại rác thải", 
    technology: "Computer Vision", 
    description: "Hệ thống nhận diện và phân loại rác qua camera.", 
    specialization: "AI" 
  },
  { 
    id: 5, 
    topic: "Website bán hoa tươi", 
    technology: "PHP, Laravel", 
    description: "Xây dựng sàn thương mại điện tử cho cửa hàng hoa.", 
    specialization: "WEB" 
  },
];

const SPECIALIZATIONS = ["Tất cả", "AI", "WEB", "Mobile", "Bảo mật", "Cấp nước"];

export default function ManageTopics() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const itemsPerPage = 5;

  // Logic lọc dữ liệu
  const filteredTopics = MOCK_TOPICS.filter((t) => {
    const matchesSearch = t.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = selectedSpec === "Tất cả" || t.specialization === selectedSpec;
    return matchesSearch && matchesSpec;
  });

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);

  const currentData = filteredTopics.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Find topic to delete
  const topicToDelete = MOCK_TOPICS.find(t => t.id === deleteId);

  // Handle delete
  const handleDelete = () => {
    console.log("Deleting topic:", deleteId);
    // Here you would make an API call to delete the topic
    setDeleteId(null);
    // Refresh data if needed
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Tiêu đề căn giữa như mẫu */}
      <h1 className="text-2xl font-bold text-center text-slate-800 uppercase tracking-widest">
        Quản lý ngân hàng đề tài
      </h1>

      {/* Thanh tìm kiếm và lọc */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tên đề tài"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="w-full md:w-48">
            <Select 
                onValueChange={(value) => {
                setSelectedSpec(value);
                setCurrentPage(1);
                }} 
                defaultValue={selectedSpec}
            >
                {/* Thêm bg-slate-50 để không bị trong suốt và focus:bg-white để làm nổi bật khi chọn */}
                <SelectTrigger className="rounded-lg bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all">
                <SelectValue placeholder="Chuyên môn" />
                </SelectTrigger>
                
                {/* Đảm bảo SelectContent cũng có màu nền đặc để không bị xuyên thấu */}
                <SelectContent className="bg-white border-slate-200 shadow-xl">
                {SPECIALIZATIONS.map(s => (
                    <SelectItem key={s} value={s}>
                    {s}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>

        <Button className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white px-10 rounded-full font-bold shadow-md">
          Tìm kiếm
        </Button>
      </div>

      {/* Nút thêm đề tài bên phải */}
      <div className="flex justify-end">
        <Button 
          onClick={() => navigate("/faculty/topics/add")}
          className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold px-6 rounded-lg"
        >
          <Plus className="mr-2 size-5" /> Thêm đề tài
        </Button>
      </div>

      {/* Bảng hiển thị: Tên đề tài, Công nghệ, Mô tả, Chuyên môn */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e3f2fd]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-slate-800 h-14">Tên đề tài</TableHead>
              <TableHead className="font-bold text-slate-800 h-14">Công nghệ</TableHead>
              <TableHead className="font-bold text-slate-800 h-14">Mô tả</TableHead>
              <TableHead className="font-bold text-slate-800 h-14">Chuyên môn</TableHead>
              <TableHead className="font-bold text-slate-800 h-14 text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((topic) => (
              <TableRow key={topic.id} className="group transition-colors">
                <TableCell className="font-bold text-slate-700">{topic.topic}</TableCell>
                <TableCell className="text-slate-600 font-medium">{topic.technology}</TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-slate-500 text-sm line-clamp-2 italic leading-relaxed">
                    {topic.description}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                    {topic.specialization}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => navigate(`/faculty/topics/view/${topic.id}`)}
                      className="px-4 py-1.5 bg-[#7786d1] hover:bg-[#5c6bb2] text-white text-[10px] font-bold rounded-full uppercase transition-all"
                    >
                      Xem chi tiết
                    </button>
                    <button 
                      onClick={() => setDeleteId(topic.id)}
                      className="px-4 py-1.5 bg-[#ff4d4d] hover:bg-[#e60000] text-white text-[10px] font-bold rounded-full uppercase transition-all"
                    >
                      Xóa
                    </button>
                    <button 
                      onClick={() => navigate(`/faculty/topics/edit/${topic.id}`)}
                      className="px-4 py-1.5 bg-[#4fd1c5] hover:bg-[#38b2ac] text-white text-[10px] font-bold rounded-full uppercase transition-all"
                    >
                      Sửa
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Phân trang */}
      <div className="flex items-center justify-center gap-4 pt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="rounded-lg h-9"
        >
          <ChevronLeft className="mr-2 size-4" /> Previous
        </Button>
        <span className="text-sm font-bold text-slate-400">{currentPage} / {totalPages || 1}</span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="rounded-lg h-9"
        >
          Next <ChevronRight className="ml-2 size-4" />
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Icon and Title */}
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="size-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 text-center">
                Xác nhận xóa
              </h2>
            </div>

            {/* Message */}
            <div className="space-y-2 text-center">
              <p className="text-slate-600">
                Bạn có chắc chắn muốn xóa đề tài:
              </p>
              <p className="text-lg font-bold text-slate-800">
                "{topicToDelete?.topic}"
              </p>
              <p className="text-sm text-slate-500 italic">
                Hành động này không thể hoàn tác.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}