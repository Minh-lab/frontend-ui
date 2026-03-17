/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Minus, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { councilService } from "@/services/faculty";

export default function UpdateCouncil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [councilMembers, setCouncilMembers] = useState([]);
  const [availableLecturers, setAvailableLecturers] = useState([]);

  // Lấy danh sách giảng viên và dữ liệu hội đồn (nếu edit)
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Luôn lấy danh sách giảng viên
        const lecturersResponse = await councilService.getLecturers({ per_page: 100 });
        
        if (isMounted && lecturersResponse.success) {
          // API returns data directly as array
          let lecturers = lecturersResponse.data || [];
          
          // Normalize lecturer data structure (full_name -> name)
          lecturers = lecturers.map(l => ({
            lecturer_id: l.lecturer_id,
            name: l.full_name || l.name || 'Giảng viên'
          }));
          
          // Nếu là edit, lấy members của council
          if (isEdit) {
            const councilResponse = await councilService.getCouncilMembers(id);
            
            if (isMounted && councilResponse.success) {
              const members = councilResponse.data?.members || [];
              
              // Setup members
              const selectedIds = members.map(m => m.lecturer_id);
              const selected = lecturers.filter(l => selectedIds.includes(l.lecturer_id));
              setCouncilMembers(selected);
              
              // Setup available (những không được select)
              const available = lecturers.filter(l => !selectedIds.includes(l.lecturer_id));
              setAvailableLecturers(available);
            }
          } else {
            // Mode tạo mới - tất cả giảng viên đều available
            setAvailableLecturers(lecturers);
          }
        } else {
          console.error('Lỗi khi tải danh sách giảng viên:', lecturersResponse.message);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching data:', error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, isEdit]);

  // Thêm giảng viên vào hội đồn (tối đa 5)
  const addMember = (lecturer) => {
    if (councilMembers.length >= 5) {
      toast.error("Hội đồng chỉ được tối đa 5 thành viên");
      return;
    }
    setCouncilMembers((prev) => [...prev, lecturer]);
    setAvailableLecturers((prev) => prev.filter((l) => l.lecturer_id !== lecturer.lecturer_id));
  };

  // Loại bỏ giảng viên khỏi hội đồn
  const removeMember = (member) => {
    setAvailableLecturers((prev) => [...prev, member]);
    setCouncilMembers((prev) => prev.filter((m) => m.lecturer_id !== member.lecturer_id));
  };

  const handleSave = async () => {
    if (councilMembers.length === 0) {
      toast.error("Vui lòng chọn ít nhất một thành viên hội đồn");
      return;
    }

    if (councilMembers.length !== 5) {
      toast.error("Hội đồng phải có đúng 5 thành viên");
      return;
    }

    setSubmitting(true);
    try {
      const lecturerIds = councilMembers.map(m => m.lecturer_id);

      if (isEdit) {
        const response = await councilService.updateCouncil(id, {
          lecturer_ids: lecturerIds
        });

        if (response.success) {
          toast.success("Cập nhật hội đồng thành công!");
          navigate("/faculty_staff/councils");
        } else {
          const errorMsg = response.error || response.message || "Lỗi cập nhật hội đồn";
          toast.error(errorMsg);
          console.error("Update council error:", response);
        }
      } else {
        const response = await councilService.createCouncil({
          lecturer_ids: lecturerIds
        });

        if (response.success) {
          toast.success("Lập hội đồng mới thành công!");
          navigate("/faculty_staff/councils");
        } else {
          const errorMsg = response.error || response.message || "Lỗi tạo hội đồn";
          toast.error(errorMsg);
          console.error("Create council error:", response);
        }
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi lưu dữ liệu");
      console.error(error);
    } finally {
      setSubmitting(false);
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
              <div key={member.lecturer_id} className="flex items-center gap-4 animate-in slide-in-from-left-2 duration-300">
                <button 
                  onClick={() => removeMember(member)}
                  disabled={submitting}
                  className="bg-slate-300 hover:bg-red-500 hover:text-white text-slate-700 size-8 flex items-center justify-center rounded shadow-sm transition-all disabled:opacity-50"
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
              <div key={lecturer.lecturer_id} className="flex items-center gap-4 animate-in slide-in-from-right-2 duration-300">
                <button 
                  onClick={() => addMember(lecturer)}
                  disabled={submitting || councilMembers.length >= 5}
                  className="bg-slate-300 hover:bg-indigo-600 hover:text-white text-slate-700 size-8 flex items-center justify-center rounded shadow-sm transition-all disabled:opacity-50"
                >
                  <Plus className="size-4" />
                </button>
                <div className="bg-white flex-1 py-3 px-6 rounded-xl shadow-sm font-bold text-slate-700 text-center border border-slate-50">
                  {lecturer.name}
                </div>
              </div>
            ))}
            {availableLecturers.length === 0 && (
              <p className="text-slate-400 text-sm italic text-center pt-20">Tất cả giảng viên đã được chọn</p>
            )}
          </div>
        </div>
      </div>

      {/* CỤM NÚT ĐIỀU KHIỂN */}
      <div className="flex justify-end gap-4 pt-4">
        <Button 
          variant="cancel"
          onClick={() => navigate("/faculty/council")}
          disabled={submitting}
          className="rounded-xl px-12 h-12 font-bold shadow-lg"
        >
          Hủy bỏ
        </Button>
        <Button 
          variant="submit"
          onClick={handleSave}
          disabled={councilMembers.length !== 5 || submitting}
          className="rounded-xl px-12 h-12 font-bold shadow-lg flex items-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            isEdit ? "Cập nhật ngay" : "Lưu hội đồng"
          )}
        </Button>
      </div>
    </div>
  );
}
