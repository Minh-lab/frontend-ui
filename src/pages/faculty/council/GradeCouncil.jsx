/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

// Import Council Service
import { councilService } from "@/services/faculty";

export default function GradeCouncil() {
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  
  // State điều khiển Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Data states
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [councilInfo, setCouncilInfo] = useState(null);

  // Lấy danh sách sinh viên trong hội đồn
  useEffect(() => {
    fetchCouncilCapstones();
  }, [id]);

  const fetchCouncilCapstones = async () => {
    setLoading(true);
    try {
      const response = await councilService.getCouncilCapstones(id);
      
      if (response.success) {
        setCouncilInfo(response.data.council);
        setStudents(response.data.capstones || []);
      } else {
        toast.error(response.message || "Lỗi khi tải danh sách sinh viên");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải danh sách sinh viên");
      console.error("Error fetching capstones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-10 animate-in fade-in duration-700 font-sans">
      
      <h1 className="text-xl font-bold text-center text-slate-800 uppercase tracking-widest">
        Chấm điểm hội đồng bảo vệ đồ án
      </h1>

      {/* Bảng danh sách sinh viên */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#E2F2FF]">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-bold text-slate-700">Mã sv</TableHead>
              <TableHead className="font-bold text-slate-700">Tên sinh viên</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Thứ tự</TableHead>
              <TableHead className="font-bold text-slate-700">Đề tài</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Điểm hội đồng</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students && students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.capstone_id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                  <TableCell className="font-medium text-slate-700">{student.student_code}</TableCell>
                  <TableCell className="font-bold text-slate-700">{student.student_name}</TableCell>
                  <TableCell className="text-center font-medium text-slate-600">{student.defense_order}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{student.topic_name}</TableCell>
                  <TableCell className="text-center font-black text-slate-800">{student.council_grade || '-'}</TableCell>
                  <TableCell className="text-center">
                    <Button 
                      size="sm"
                      onClick={() => handleOpenModal(student)}
                      className="bg-[#6D83CD] hover:bg-[#5C72BC] text-white rounded-full px-6 h-8 text-xs font-bold shadow-sm"
                    >
                      Cập nhật điểm
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="6" className="text-center py-8 text-slate-500">
                  Không có sinh viên cần chấm điểm
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal cập nhật điểm */}
      <UpdateGradeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        student={selectedStudent}
        councilId={id}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchCouncilCapstones(); // Refresh danh sách
        }}
      />
    </div>
  );
}

/**
 * Component Modal Cập nhật điểm
 */
function UpdateGradeModal({ isOpen, onClose, student, councilId, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      grade: student?.council_grade?.toString() || "",
    }
  });

  // Update form values khi student thay đổi
  React.useEffect(() => {
    if (student) {
      form.reset({
        grade: student?.council_grade?.toString() || ""
      });
    }
  }, [student, form]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    if (!student?.capstone_id || !councilId) {
      toast.error("Thông tin sinh viên không hợp lệ");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await councilService.updateGrade(
        councilId,
        student.capstone_id,
        data.grade
      );

      if (response.success) {
        toast.success("Cập nhật điểm thành công!");
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.message || "Lỗi khi cập nhật điểm");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi cập nhật điểm");
      console.error("Error updating grade:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 animate-in fade-in duration-200">
      <div className="bg-[#eef4ff] rounded-[2rem] p-10 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 relative border border-white">
        
        <h2 className="text-xl font-bold text-center text-slate-800 mb-8 uppercase tracking-tight">
          Cập nhật điểm hội đồng
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem className="flex items-center justify-center gap-6 space-y-0">
                  <FormLabel className="text-2xl font-bold text-[#4a5568]">Điểm</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      disabled={isSubmitting}
                      className="bg-white rounded-xl border-slate-200 h-14 w-64 text-center text-2xl font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-200" 
                      placeholder="0.0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-center gap-6">
              <Button 
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="bg-[#ff4d4d] hover:bg-[#e60000] text-white rounded-xl px-12 h-12 font-bold text-lg shadow-lg shadow-red-100 transition-all active:scale-95 disabled:opacity-50"
              >
                Hủy
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-xl px-10 h-12 font-bold text-lg shadow-lg shadow-green-100 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Cập nhật điểm"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
