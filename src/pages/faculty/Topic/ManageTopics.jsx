import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Search, Plus, Eye, Trash2, Edit, 
  ChevronLeft, ChevronRight, AlertCircle, Loader2
} from "lucide-react";
import { 
  Table, TableHeader, TableBody, 
  TableHead, TableRow, TableCell 
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { topicService } from "@/services/faculty";

export default function ManageTopics() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 5
  });
  
  const itemsPerPage = 5;

  // Fetch topics từ service
  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await topicService.getTopics({
        page: currentPage,
        itemsPerPage,
        search: searchTerm,
        specialization: selectedSpec
      });

      if (response.success) {
        setTopics(response.data.topics);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải danh sách đề tài");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi các dependency thay đổi
  useEffect(() => {
    fetchTopics();
  }, [currentPage, searchTerm, selectedSpec]);

  // Xử lý xóa đề tài
  const handleDelete = async () => {
    try {
      const response = await topicService.deleteTopic(deleteId);
      
      if (response.success) {
        toast.success(response.message);
        setDeleteId(null);
        // Refresh lại danh sách
        fetchTopics();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi xóa đề tài");
    }
  };

  // Tìm topic để xóa
  const topicToDelete = topics.find(t => t.id === deleteId);

  if (loading && topics.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
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
            value={selectedSpec}
          >
            <SelectTrigger className="rounded-lg bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all">
              <SelectValue placeholder="Chuyên môn" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-xl">
              <SelectItem value="Tất cả">Tất cả</SelectItem>
              {Array.isArray(topics) && [...new Set(topics.map(t => t.specialization))].map(spec => (
                <SelectItem key={spec} value={spec}>
                  {spec}
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
          onClick={() => navigate("/faculty_staff/topics/add")}
          className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#4f46e5] font-bold px-6 rounded-lg"
        >
          <Plus className="mr-2 size-5" /> Thêm đề tài
        </Button>
      </div>

      {/* Bảng hiển thị */}
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
            {topics.map((topic) => (
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
                      onClick={() => navigate(`/faculty_staff/topics/view/${topic.id}`)}
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
                      onClick={() => navigate(`/faculty_staff/topics/edit/${topic.id}`)}
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
      {pagination.total_pages > 0 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-lg h-9"
          >
            <ChevronLeft className="mr-2 size-4" /> Previous
          </Button>
          <span className="text-sm font-bold text-slate-400">
            {currentPage} / {pagination.total_pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
            disabled={currentPage === pagination.total_pages}
            className="rounded-lg h-9"
          >
            Next <ChevronRight className="ml-2 size-4" />
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="size-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 text-center">
                Xác nhận xóa
              </h2>
            </div>

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