/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Minus, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function UpdateCouncil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Khởi tạo loading dựa trên chế độ: Nếu sửa thì chờ load, nếu tạo thì không cần [cite: 805]
  const [loading, setLoading] = useState(isEdit);
  const [councilMembers, setCouncilMembers] = useState([]);
  const [availableLecturers, setAvailableLecturers] = useState([
    { id: 1, name: "Nguyễn Văn G" },
    { id: 2, name: "Nguyễn Văn K" },
    { id: 3, name: "Lê Thị C" },
    { id: 4, name: "Trần Văn D" },
  ]);

  // Logic lấy dữ liệu an toàn để tránh lỗi render
  useEffect(() => {
    let isMounted = true; // Biến kiểm soát để không set state khi component đã unmount

    const fetchCouncilData = async () => {
      if (!isEdit) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setLoading(true);
        
        // Giả lập gọi API lấy dữ liệu hội đồng theo ID
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (isMounted) {
          setCouncilMembers([
            { id: 10, name: "Nguyễn Văn A" },
            { id: 11, name: "Nguyễn Văn H" },
          ]);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Không thể tải dữ liệu hội đồng");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCouncilData();

    return () => {
      isMounted = false; // Dọn dẹp khi component bị hủy
    };
  }, [id, isEdit]);

  // Thêm giảng viên vào danh sách hội đồng (Tối đa 5 người)
  const addMember = (lecturer) => {
    if (councilMembers.length >= 5) {
      toast.error("Hội đồng chỉ được tối đa 5 thành viên");
      return;
    }
    setCouncilMembers((prev) => [...prev, lecturer]);
    setAvailableLecturers((prev) => prev.filter((l) => l.id !== lecturer.id));
  };

  // Loại bỏ giảng viên khỏi hội đồng
  const removeMember = (member) => {
    setAvailableLecturers((prev) => [...prev, member]);
    setCouncilMembers((prev) => prev.filter((m) => m.id !== member.id));
  };

  const handleSave = async () => {
    if (councilMembers.length === 0) {
      toast.error("Vui lòng chọn thành viên hội đồng");
      return;
    }

    try {
      // Giả lập gọi API lưu hoặc cập nhật
      if (isEdit) {
        toast.success("Cập nhật hội đồng thành công!");
      } else {
        toast.success("Đã lập hội đồng mới thành công!");
      }
      navigate("/faculty_staff/councils");
    } catch (error) {
      toast.error("Lỗi khi lưu dữ liệu");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center gap-4">
        <Loader2 className="size-10 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-bold">Đang chuẩn bị dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 font-sans">
      
      {/* Tiêu đề thay đổi động dựa trên trạng thái */}
      <div className="relative text-center">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          QUAY LẠI
        </button>
        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-widest">
          {isEdit ? "Cập nhật hội đồng" : "Lập hội đồng"}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* PANEL TRÁI: THÀNH VIÊN HỘI ĐỒNG */}
        <div className="bg-[#E2F2FF] p-8 rounded-2xl min-h-[400px] flex flex-col items-center shadow-sm">
          <h3 className="font-bold text-slate-800 mb-8 uppercase text-xs tracking-[0.1em]">
            Thành viên hội đồng {councilMembers.length}/5
          </h3>
          <div className="w-full space-y-4">
            {councilMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-4 animate-in slide-in-from-left-2 duration-300">
                <button 
                  onClick={() => removeMember(member)}
                  className="bg-slate-300 hover:bg-red-500 hover:text-white text-slate-700 size-8 flex items-center justify-center rounded shadow-sm transition-all"
                >
                  <Minus className="size-4" />
                </button>
                <div className="bg-white flex-1 py-3 px-6 rounded-xl shadow-sm font-bold text-slate-700 text-center border border-slate-50">
                  {member.name}
                </div>
              </div>
            ))}
            {councilMembers.length === 0 && (
              <p className="text-slate-400 text-sm italic text-center pt-20">Hãy chọn giảng viên từ danh sách</p>
            )}
          </div>
        </div>

        {/* PANEL PHẢI: DANH SÁCH GIẢNG VIÊN */}
        <div className="bg-[#E2F2FF] p-8 rounded-2xl min-h-[400px] flex flex-col items-center shadow-sm">
          <h3 className="font-bold text-slate-800 mb-8 uppercase text-xs tracking-[0.1em]">
            Danh sách giảng viên khả dụng
          </h3>
          <div className="w-full space-y-4">
            {availableLecturers.map((lecturer) => (
              <div key={lecturer.id} className="flex items-center gap-4 animate-in slide-in-from-right-2 duration-300">
                <button 
                  onClick={() => addMember(lecturer)}
                  className="bg-slate-300 hover:bg-indigo-600 hover:text-white text-slate-700 size-8 flex items-center justify-center rounded shadow-sm transition-all"
                >
                  <Plus className="size-4" />
                </button>
                <div className="bg-white flex-1 py-3 px-6 rounded-xl shadow-sm font-bold text-slate-700 text-center border border-slate-50">
                  {lecturer.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CỤM NÚT ĐIỀU KHIỂN SỬ DỤNG VARIANT CHUẨN [cite: 926, 928] */}
      <div className="flex justify-end gap-4 pt-4">
        <Button 
          variant="cancel"
          onClick={() => navigate("/faculty_staff/councils")}
          className="rounded-xl px-12 h-12 font-bold shadow-lg"
        >
          Hủy bỏ
        </Button>
        <Button 
          variant="submit"
          onClick={handleSave}
          disabled={councilMembers.length === 0}
          className="rounded-xl px-12 h-12 font-bold shadow-lg"
        >
          {isEdit ? "Cập nhật ngay" : "Lưu hội đồng"}
        </Button>
      </div>
    </div>
  );
}