import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { topicService } from "@/services/faculty";

export default function ViewTopic() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchTopic();
  }, [id]);

  const fetchTopic = async () => {
    try {
      setLoading(true);
      const response = await topicService.getTopicById(id);
      
      if (response.success) {
        setTopic(response.data);
      } else {
        setNotFound(true);
        toast.error(response.message || "Không tìm thấy đề tài");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải thông tin đề tài");
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-medium">Đang tải thông tin đề tài...</p>
        </div>
      </div>
    );
  }

  if (notFound || !topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😢</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Không tìm thấy đề tài</h2>
          <p className="text-slate-500 mb-8">Đề tài bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate("/faculty_staff/topics")}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition transform hover:-translate-y-1"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-in fade-in duration-500">
      <button
        onClick={() => navigate("/faculty_staff/topics")}
        className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition mb-6 group"
      >
        <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
        Quay lại
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-4xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-12 py-8">
          <h1 className="text-2xl font-bold uppercase tracking-wider">Chi tiết đề tài</h1>
          <p className="text-purple-100 text-xs mt-1 opacity-80 uppercase tracking-widest font-medium">
            Khoa Công nghệ thông tin - TLU
          </p>
        </div>

        <div className="bg-[#fcfcff] px-12 py-12 space-y-8">
          {/* Mã đề tài (nếu có) */}
          {topic.id && (
            <div className="flex justify-between items-center gap-8">
              <label className="text-sm font-bold text-slate-600 whitespace-nowrap">
                Mã đề tài
              </label>
              <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3">
                <p className="text-slate-700 text-sm font-mono">#{topic.id}</p>
              </div>
            </div>
          )}

          {/* Tên Đề Tài */}
          <div className="flex justify-between items-center gap-8">
            <label className="text-sm font-bold text-slate-600 whitespace-nowrap">
              Tên đề tài
            </label>
            <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3">
              <p className="text-slate-700 text-sm font-medium">{topic.topicName || topic.topic}</p>
            </div>
          </div>

          {/* Công Nghệ */}
          <div className="flex justify-between items-center gap-8">
            <label className="text-sm font-bold text-slate-600 whitespace-nowrap">
              Công nghệ
            </label>
            <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3">
              <p className="text-slate-700 text-sm">{topic.technology}</p>
            </div>
          </div>

          {/* Chuyên môn */}
          <div className="flex justify-between items-center gap-8">
            <label className="text-sm font-bold text-slate-600 whitespace-nowrap">
              Chuyên môn
            </label>
            <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-3">
              <p className="text-slate-700 text-sm">
                {topic.expertise?.name || topic.specialization || 'Chưa cập nhật'}
              </p>
            </div>
          </div>

          {/* Trạng thái (nếu có) */}
          {topic.status && (
            <div className="flex justify-between items-center gap-8">
              <label className="text-sm font-bold text-slate-600 whitespace-nowrap">
                Trạng thái
              </label>
              <div className="flex-1">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                  topic.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : topic.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {topic.status === 'active' ? 'Đang hoạt động' : 
                   topic.status === 'pending' ? 'Chờ duyệt' : 'Ngừng hoạt động'}
                </span>
              </div>
            </div>
          )}

          {/* Mô Tả Chi Tiết */}
          <div className="flex justify-between items-start gap-8">
            <label className="text-sm font-bold text-slate-600 whitespace-nowrap mt-3">
              Mô tả chi tiết
            </label>
            <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 py-4">
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {topic.description}
              </p>
            </div>
          </div>

          {/* Thời gian tạo/cập nhật (nếu có) */}
          {(topic.created_at || topic.updated_at) && (
            <div className="border-t border-slate-100 pt-6 mt-4">
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
                {topic.created_at && (
                  <div>
                    <span className="font-medium">Ngày tạo: </span>
                    {new Date(topic.created_at).toLocaleDateString('vi-VN')}
                  </div>
                )}
                {topic.updated_at && (
                  <div>
                    <span className="font-medium">Cập nhật lần cuối: </span>
                    {new Date(topic.updated_at).toLocaleDateString('vi-VN')}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end items-center gap-6 pt-6 border-t border-slate-100">
            <button
              onClick={() => navigate("/faculty_staff/topics")}
              className="px-8 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
            >
              Đóng
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}