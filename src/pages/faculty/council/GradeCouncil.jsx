import React, { useState } from "react";
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

export default function GradeCouncil() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State điều khiển Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Dữ liệu mẫu sinh viên trong hội đồng
  const [students, setStudents] = useState([
    { id: 1, code: "sv001", name: "Nguyễn an", order: 3, topic: "Dự án giá vàng", grade: "8.8" },
    { id: 2, code: "sv002", name: "nguyễn minh", order: 33, topic: "Web tài xỉu", grade: "" },
    { id: 3, code: "sv077", name: "hoàng lân", order: 12, topic: "App dự báo thời tiết", grade: "" },
  ]);

  const handleOpenModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

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
            {students.map((student) => (
              <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                <TableCell className="font-medium text-slate-700">{student.code}</TableCell>
                <TableCell className="font-bold text-slate-700">{student.name}</TableCell>
                <TableCell className="text-center font-medium text-slate-600">{student.order}</TableCell>
                <TableCell className="text-slate-600 font-medium">{student.topic}</TableCell>
                <TableCell className="text-center font-black text-slate-800">{student.grade}</TableCell>
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
            ))}
          </TableBody>
        </Table>

        {/* Phân trang */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-center relative">
          <div className="absolute left-8">
             <button className="flex items-center gap-2 text-xs font-bold text-slate-500 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50">
                <ChevronLeft className="size-4" /> Previous
             </button>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", 8, 9, 10].map((p, i) => (
              <button key={i} className={`size-8 rounded-lg text-xs font-bold ${p === 1 ? "bg-slate-100 text-indigo-600" : "text-slate-400"}`}>
                {p}
              </button>
            ))}
          </div>
          <div className="absolute right-8">
             <button className="flex items-center gap-2 text-xs font-bold text-slate-500 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50">
                Next <ChevronRight className="size-4" />
             </button>
          </div>
        </div>
      </div>

      {/* Modal cập nhật điểm */}
      <UpdateGradeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        student={selectedStudent}
      />
    </div>
  );
}

/**
 * Component Modal Cập nhật điểm
 */
function UpdateGradeModal({ isOpen, onClose, student }) {
  const form = useForm({
    values: {
      grade: student?.grade || "",
    }
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    console.log(`Cập nhật điểm cho ${student.name}:`, data.grade);
    toast.success("Cập nhật điểm thành công!");
    onClose();
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
                className="bg-[#ff4d4d] hover:bg-[#e60000] text-white rounded-xl px-12 h-12 font-bold text-lg shadow-lg shadow-red-100 transition-all active:scale-95"
              >
                Hủy
              </Button>
              <Button 
                type="submit"
                className="bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-xl px-10 h-12 font-bold text-lg shadow-lg shadow-green-100 transition-all active:scale-95"
              >
                Cập nhật điểm
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}