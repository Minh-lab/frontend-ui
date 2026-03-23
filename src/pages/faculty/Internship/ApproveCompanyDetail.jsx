import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChevronLeft, Check, X, Edit, Building2, Users, Save } from "lucide-react";
import { toast } from "sonner";

// Import các UI components từ thư mục ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, FormItem, FormLabel, 
  FormControl, FormMessage, FormField 
} from "@/components/ui/form";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import internshipService from "@/services/faculty/internshipService";
import api from "@/services/apiConfig";

/**
 * 1. Định nghĩa Schema Validation với Yup
 */
const companySchema = yup.object().shape({
  name: yup.string().required("Tên doanh nghiệp không được để trống"),
  tax_code: yup.string().required("Mã số thuế không được để trống"),
  address: yup.string().required("Địa chỉ không được để trống"),
  email: yup.string().required("Email không được để trống").email("Email không hợp lệ"),
  website: yup.string().required("Website không được để trống"),
});

export default function ApproveCompanyDetail() {
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State quản lý chế độ chỉnh sửa thông tin DN
  const [isEditing, setIsEditing] = useState(false);
  // State lưu danh sách ID sinh viên ĐƯỢC CHỌN ĐỂ DUYỆT
  const [selectedStudents, setSelectedStudents] = useState([]);
  // State tải dữ liệu
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State dữ liệu công ty và sinh viên
  const [companyData, setCompanyData] = useState(null);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  // State lưu request type và proposed_company_id
  const [requestType, setRequestType] = useState(null);
  const [proposedCompanyId, setProposedCompanyId] = useState(null);

  // Mock data hồ sơ doanh nghiệp ban đầu (fallback)
  const initialData = useMemo(() => companyData ? {
    name: companyData.name || "",
    tax_code: companyData.tax_code || "",
    address: companyData.address || "",
    email: companyData.email || "",
    website: companyData.website || "",
  } : {
    name: "",
    tax_code: "",
    address: "",
    email: "",
    website: "",
  }, [companyData]);

  // 2. Khởi tạo React Hook Form
  const form = useForm({
    resolver: yupResolver(companySchema),
    values: initialData, // Tự động điền dữ liệu vào form
  });

  // Load company detail when component mounts
  useEffect(() => {
    loadCompanyDetail();
  }, [id]);

  const loadCompanyDetail = async () => {
    try {
      setIsLoading(true);
      const response = await internshipService.getCompanyApprovalDetail(id);
      if (response.success && response.data) {
        setCompanyData(response.data.company || null);
        setRegisteredStudents(response.data.students || []);
        setRequestType(response.data.type || null);
        setProposedCompanyId(response.data.proposed_company_id || null);
        // Auto-select all students initially
        setSelectedStudents((response.data.students || []).map(s => s.id));
      } else {
        toast.error(response.message || "Lỗi tải chi tiết doanh nghiệp");
        console.error("Failed response:", response);
      }
    } catch (error) {
      toast.error("Lỗi tải chi tiết doanh nghiệp: " + (error.message || "Không xác định"));
      console.error("Error loading company detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedStudents(registeredStudents.map(s => s.id));
    else setSelectedStudents([]);
  };

  // Xử lý lưu thông tin DN sau khi sửa
  const onSaveCompanyInfo = async (data) => {
    if (!proposedCompanyId) {
      toast.error("Không thể cập nhật: doanh nghiệp không phải loại đề xuất");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await internshipService.updateProposedCompany(proposedCompanyId, data);
      if (response.success) {
        toast.success(response.message || "Đã cập nhật thông tin doanh nghiệp thành công!");
        setIsEditing(false);
        // Update local state with new company data
        setCompanyData({
          ...data,
          name: data.name,
          tax_code: data.tax_code,
          address: data.address,
          email: data.email,
          website: data.website,
        });
      } else {
        toast.error(response.message || "Lỗi cập nhật thông tin doanh nghiệp");
      }
    } catch (error) {
      toast.error("Lỗi cập nhật: " + error.message);
      console.error("Error updating company:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý Duyệt/Từ chối tổng thể
  const handleFinalAction = async (type) => {
    if (type === "approve") {
      if (selectedStudents.length === 0) {
        toast.error("Vui lòng chọn ít nhất một sinh viên để duyệt");
        return;
      }

      try {
        setIsSubmitting(true);
        const response = await internshipService.approveCompanyWithStudents(
          id,
          selectedStudents,
          {
            company_name: form.getValues('name'),
            company_email: form.getValues('email'),
            company_address: form.getValues('address'),
          }
        );

        if (response.success) {
          toast.success(response.message || "Phê duyệt thành công");
          setTimeout(() => navigate(-1), 1000);
        } else {
          toast.error(response.message || "Lỗi phê duyệt doanh nghiệp");
        }
      } catch (error) {
        toast.error("Lỗi phê duyệt: " + error.message);
        console.error("Error approving company:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Từ chối toàn bộ
      try {
        setIsSubmitting(true);
        const response = await api.post(`/faculty_staff/internships/approve/${id}`, {
          status: 'REJECTED',
          feedback: "Từ chối yêu cầu đăng ký doanh nghiệp"
        });

        if (response.data?.success) {
          toast.success("Đã từ chối yêu cầu của doanh nghiệp này");
          setTimeout(() => navigate(-1), 1000);
        } else {
          toast.error(response.data?.message || "Lỗi từ chối");
        }
      } catch (error) {
        toast.error("Lỗi từ chối: " + error.message);
        console.error("Error rejecting company:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-semibold">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      {!isLoading && !companyData && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-600 font-semibold mb-4">Không thể tải chi tiết yêu cầu</p>
          <Button 
            onClick={() => navigate(-1)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <ChevronLeft className="mr-2 size-4" /> Quay lại
          </Button>
        </div>
      )}

      {!isLoading && companyData && (
        <>
          <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition">
          <ChevronLeft className="size-5" /> QUAY LẠI
        </button>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest">Chi tiết yêu cầu đăng ký DN</h2>
      </div>

      {/* KHỐI THÔNG TIN DOANH NGHIỆP (Dạng Form) */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Building2 className="text-indigo-600 size-6" />
            <h3 className="font-bold text-slate-700 uppercase text-sm">Thông tin doanh nghiệp đề xuất</h3>
          </div>
          
          {!isEditing ? (
            requestType === "COMPANY_REG" && proposedCompanyId ? (
              <Button 
                  type="button"
                  onClick={() => setIsEditing(true)}
                  variant="outline" 
                  className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-bold text-xs h-9 px-5 transition-colors"
                  >
                  <Edit className="size-3.5 mr-2" /> Chỉnh sửa thông tin dn
              </Button>
            ) : null
          ) : (
            <div className="flex gap-2">
              <Button 
                type="button"
                onClick={() => { setIsEditing(false); form.reset(); }}
                variant="ghost"
                disabled={isSubmitting}
                className="rounded-full text-slate-400 font-bold text-xs h-9 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </Button>
              <Button 
                onClick={form.handleSubmit(onSaveCompanyInfo)}
                disabled={isSubmitting}
                className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 px-5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="size-3.5 mr-2" /> {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          )}
        </div>

        <Form {...form}>
          <form className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase ml-1">Tên doanh nghiệp</FormLabel>
                <FormControl>
                  <Input {...field} readOnly={!isEditing} className={`${!isEditing ? "bg-slate-50 border-none font-bold text-slate-700" : "bg-white border-slate-200"}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="tax_code" render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase ml-1">Mã số thuế</FormLabel>
                <FormControl>
                  <Input {...field} readOnly={!isEditing} className={`${!isEditing ? "bg-slate-50 border-none font-bold" : "bg-white border-slate-200"}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem className="space-y-1 md:col-span-2">
                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase ml-1">Địa chỉ trụ sở</FormLabel>
                <FormControl>
                  <Input {...field} readOnly={!isEditing} className={`${!isEditing ? "bg-slate-50 border-none" : "bg-white border-slate-200"}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email liên hệ</FormLabel>
                <FormControl>
                  <Input {...field} type="email" readOnly={!isEditing} className={`${!isEditing ? "bg-slate-50 border-none" : "bg-white border-slate-200"}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="website" render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-[10px] font-bold text-slate-400 uppercase ml-1">Website</FormLabel>
                <FormControl>
                  <Input {...field} readOnly={!isEditing} className={`${!isEditing ? "bg-slate-50 border-none text-blue-600 underline" : "bg-white border-slate-200"}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </form>
        </Form>
      </div>

      {/* DANH SÁCH SINH VIÊN ĐĂNG KÝ (Giữ nguyên logic checkbox) */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50 flex items-center gap-3">
          <Users className="text-indigo-600 size-6" />
          <h3 className="font-bold text-slate-700 uppercase text-sm">Danh sách sinh viên đăng ký</h3>
          <span className="ml-auto text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">
            Duyệt: {selectedStudents.length} / {registeredStudents.length}
          </span>
        </div>
        <Table>
          <TableHeader className="bg-[#eef2ff]">
            <TableRow>
              <TableHead className="w-[80px] text-center font-bold text-slate-700 uppercase text-[11px]">
                Duyệt?
                <div className="mt-1 flex justify-center">
                   <input type="checkbox" onChange={toggleSelectAll} checked={selectedStudents.length === registeredStudents.length} className="accent-indigo-600 size-4" />
                </div>
              </TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[11px]">Mã SV</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[11px]">Họ tên sinh viên</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[11px] text-center">Lớp</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase text-[11px] text-center">GPA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registeredStudents.map(s => (
              <TableRow key={s.id} className={`border-b border-slate-50 transition-colors ${selectedStudents.includes(s.id) ? "bg-green-50/30" : "bg-red-50/10"}`}>
                <TableCell className="text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedStudents.includes(s.id)}
                    onChange={() => setSelectedStudents(prev => prev.includes(s.id) ? prev.filter(i => i !== s.id) : [...prev, s.id])}
                    className="accent-indigo-600 size-4"
                  />
                </TableCell>
                <TableCell className="text-slate-500 font-medium text-xs uppercase">{s.id}</TableCell>
                <TableCell className="font-bold text-slate-700">{s.name}</TableCell>
                <TableCell className="text-center text-slate-600 text-xs">{s.class}</TableCell>
                <TableCell className="text-center font-bold text-indigo-600">{s.gpa}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* NÚT HÀNH ĐỘNG CUỐI TRANG */}
      <div className="flex justify-center items-center gap-4 pt-4 pb-10">
        <Button 
          onClick={() => handleFinalAction("approve")} 
          disabled={isSubmitting || isLoading}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-12 rounded-full shadow-lg py-6 text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="mr-2 size-5" /> DUYỆT ĐĂNG KÝ
        </Button>
        <Button 
          onClick={() => handleFinalAction("reject")} 
          disabled={isSubmitting || isLoading}
          variant="outline" 
          className="border-red-200 text-red-600 hover:bg-red-50 font-bold px-12 rounded-full py-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="mr-2 size-5" /> KHÔNG DUYỆT
        </Button>
      </div>
        </>
      )}
    </div>
  );
}