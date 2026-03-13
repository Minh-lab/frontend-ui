import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ConfirmAction } from "@/components/ui/ConfirmAction";
import { TOPICS } from "@/data/lecturerData";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 6;
const EMPTY_FORM = {
  code: "",
  name: "",
  specialization: "",
  technology: "",
  description: "",
  status: "Khả dụng",
};

const Topics = () => {
  const [topicsData, setTopicsData] = useState(TOPICS);

  const [keywordInput, setKeywordInput] = useState("");
  const [specializationInput, setSpecializationInput] = useState("all");
  const [technologyInput, setTechnologyInput] = useState("all");
  const [statusInput, setStatusInput] = useState("all");

  const [keyword, setKeyword] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [technology, setTechnology] = useState("all");
  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const specializations = useMemo(
    () => [...new Set(topicsData.map((item) => item.specialization))],
    [topicsData]
  );

  const technologies = useMemo(
    () => [...new Set(topicsData.map((item) => item.technology))],
    [topicsData]
  );

  const filteredTopics = useMemo(() => {
    return topicsData.filter((item) => {
      const matchKeyword =
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.code.toLowerCase().includes(keyword.toLowerCase());
      const matchSpecialization =
        specialization === "all" || item.specialization === specialization;
      const matchTechnology = technology === "all" || item.technology === technology;
      const matchStatus = status === "all" || item.status === status;
      return matchKeyword && matchSpecialization && matchTechnology && matchStatus;
    });
  }, [topicsData, keyword, specialization, technology, status]);

  const totalPages = Math.max(1, Math.ceil(filteredTopics.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const paginatedTopics = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredTopics.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTopics, safePage]);

  const pageItems = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    return pages;
  }, [totalPages]);

  const handleSearch = () => {
    setKeyword(keywordInput);
    setSpecialization(specializationInput);
    setTechnology(technologyInput);
    setStatus(statusInput);
    setPage(1);
  };

  const handleOpenAddForm = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (topic) => {
    setEditingId(topic.id);
    setFormData({
      code: topic.code,
      name: topic.name,
      specialization: topic.specialization,
      technology: topic.technology,
      description: topic.description,
      status: topic.status,
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveTopic = () => {
    if (
      !formData.code.trim() ||
      !formData.name.trim() ||
      !formData.specialization.trim() ||
      !formData.technology.trim() ||
      !formData.description.trim()
    ) {
      window.alert("Vui lòng nhập đầy đủ thông tin đề tài.");
      return;
    }

    if (editingId) {
      setTopicsData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
              ...item,
              ...formData,
              code: formData.code.trim(),
              name: formData.name.trim(),
              specialization: formData.specialization.trim(),
              technology: formData.technology.trim(),
              description: formData.description.trim(),
            }
            : item
        )
      );
      toast.success("Cập nhật đề tài thành công", { className: "!bg-[#dcfce7] !text-[#047857]" });
    } else {
      const nextId = topicsData.length
        ? Math.max(...topicsData.map((item) => item.id)) + 1
        : 1;

      setTopicsData((prev) => [
        ...prev,
        {
          id: nextId,
          code: formData.code.trim(),
          name: formData.name.trim(),
          specialization: formData.specialization.trim(),
          technology: formData.technology.trim(),
          description: formData.description.trim(),
          status: formData.status,
        },
      ]);
      toast.success("Thêm đề tài thành công", { className: "!bg-[#dcfce7] !text-[#047857]" });
    }

    handleCloseForm();
  };

  const handleDeleteTopic = () => {
    if (deletingId === null) return;
    setTopicsData((prev) => prev.filter((item) => item.id !== deletingId));
    if (editingId === deletingId) handleCloseForm();
    setDeletingId(null);
    toast.success("Xóa đề tài thành công", { className: "!bg-[#dcfce7] !text-[#047857]" });
  };

  return (
    <div className="p-4 md:p-6">
      <Card className="gap-4">
        <CardHeader className="pb-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg font-bold">Quản lý ngân hàng đề tài</CardTitle>
            <Button variant="submit" className="h-10 rounded-full px-5" onClick={handleOpenAddForm}>
              <Plus className="size-4" />
              Thêm đề tài
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="relative md:col-span-4">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={keywordInput}
                onChange={(event) => setKeywordInput(event.target.value)}
                placeholder="Tìm kiếm tên đề tài"
                className="pl-9"
              />
            </div>

            <div className="md:col-span-2">
              <select
                value={technologyInput}
                onChange={(event) => {
                  setTechnologyInput(event.target.value);
                }}
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20"
              >
                <option value="all">Công nghệ</option>
                {technologies.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={specializationInput}
                onChange={(event) => {
                  setSpecializationInput(event.target.value);
                }}
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20"
              >
                <option value="all">Chuyên môn</option>
                {specializations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={statusInput}
                onChange={(event) => {
                  setStatusInput(event.target.value);
                }}
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20"
              >
                <option value="all">Trạng thái</option>
                <option value="Đã được đăng ký">Đã được đăng ký</option>
                <option value="Khả dụng">Khả dụng</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Button className="w-full rounded-full" onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14">STT</TableHead>
                  <TableHead>Mã đề tài</TableHead>
                  <TableHead>Tên đề tài</TableHead>
                  <TableHead>Chuyên môn</TableHead>
                  <TableHead>Công nghệ</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-center">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTopics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-slate-500">
                      Không tìm thấy đề tài.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTopics.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{(safePage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.specialization}</TableCell>
                      <TableCell>{item.technology}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <span
                          className={
                            item.status === "Khả dụng"
                              ? "rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
                              : "rounded-full bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700"
                          }
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Xóa đề tài"
                            onClick={() => setDeletingId(item.id)}
                          >
                            <Trash2 className="size-4 text-slate-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Sửa đề tài"
                            onClick={() => handleOpenEditForm(item)}
                          >
                            <Pencil className="size-4 text-slate-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage === 1}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {pageItems.map((item) => (
                <Button
                  key={item}
                  size="sm"
                  variant={item === safePage ? "default" : "ghost"}
                  onClick={() => setPage(item)}
                  className="h-8 min-w-8 px-2"
                >
                  {item}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={safePage === totalPages}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (open) setIsFormOpen(true);
          else handleCloseForm();
        }}
      >
        <AlertDialogContent className="max-w-[500px] p-0 overflow-hidden border-0 shadow-xl rounded-2xl">
          <div className="bg-[#6d28d9] px-6 py-4 flex flex-col items-center">
            <h2 className="text-white text-[15px] font-bold uppercase tracking-wider w-full text-left">
              {editingId ? "CHỈNH SỬA ĐỀ TÀI" : "THÊM ĐỀ TÀI MỚI"}
            </h2>
          </div>
          <div className="px-6 py-6 pb-4 bg-white max-h-[80vh] overflow-y-auto">
            {editingId && (
              <p className="text-xs text-slate-500 font-medium mb-4">
                Đang chỉnh sửa: <span className="font-bold text-slate-700">{formData.code}</span>
              </p>
            )}
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    MÃ ĐỀ TÀI {editingId ? "" : "*"}
                  </label>
                  <Input
                    value={formData.code}
                    onChange={(event) => handleFormChange("code", event.target.value)}
                    placeholder="Mã đề tài"
                    className="h-10 rounded-lg border-slate-200 focus:border-[#6d28d9] focus:ring-[#6d28d9]/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    TRẠNG THÁI {editingId ? "" : "*"}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(event) => handleFormChange("status", event.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-[#6d28d9] focus:ring-[3px] focus:ring-[#6d28d9]/20"
                  >
                    <option value="">Trạng thái</option>
                    <option value="Khả dụng">Khả dụng</option>
                    <option value="Đã được đăng ký">Đã được đăng ký</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  TÊN ĐỀ TÀI {editingId ? "" : "*"}
                </label>
                <Input
                  value={formData.name}
                  onChange={(event) => handleFormChange("name", event.target.value)}
                  placeholder="Nhập tên đề tài (Không ký tự đặc biệt)"
                  className="h-10 rounded-lg border-slate-200 focus:border-[#6d28d9] focus:ring-[#6d28d9]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    CHUYÊN MÔN {editingId ? "" : "*"}
                  </label>
                  <select
                    value={formData.specialization}
                    onChange={(event) => handleFormChange("specialization", event.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-[#6d28d9] focus:ring-[3px] focus:ring-[#6d28d9]/20"
                  >
                    <option value="">Chuyên môn</option>
                    {specializations.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    CÔNG NGHỆ {editingId ? "" : "*"}
                  </label>
                  <select
                    value={formData.technology}
                    onChange={(event) => handleFormChange("technology", event.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-[#6d28d9] focus:ring-[3px] focus:ring-[#6d28d9]/20"
                  >
                    <option value="">Công nghệ</option>
                    {technologies.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  MÔ TẢ CHI TIẾT
                </label>
                <textarea
                  value={formData.description}
                  onChange={(event) => handleFormChange("description", event.target.value)}
                  placeholder={editingId ? "Mô tả cũ của đề tài được đổ vào đây để chỉnh sửa..." : "Mô tả mục tiêu và yêu cầu đề tài..."}
                  className="w-full min-h-[100px] p-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6d28d9]/20 focus:border-[#6d28d9] resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={handleCloseForm}
                className="rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 px-6 font-semibold"
              >
                {editingId ? "Hủy bỏ" : "Hủy"}
              </Button>
              <Button 
                onClick={handleSaveTopic}
                className="rounded-lg bg-[#6d28d9] hover:bg-[#5b21b6] text-white px-6 font-semibold"
              >
                {editingId ? "Cập nhật" : "Lưu đề tài"}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
      >
        <AlertDialogContent className="max-w-[400px] p-0 overflow-hidden border-0 shadow-xl rounded-2xl">
          <div className="bg-[#ef4444] px-6 py-4">
            <h2 className="text-white text-[15px] font-bold uppercase tracking-wider text-left">
              XÁC NHẬN XÓA ĐỀ TÀI
            </h2>
          </div>
          <div className="px-6 py-6 pb-5 bg-white flex flex-col items-center text-center">
            <TriangleAlert className="w-16 h-16 text-black mb-4" strokeWidth={2.5} />
            <p className="text-base font-bold text-slate-800 mb-2">
              Bạn có chắc chắn muốn xóa đề tài này khỏi ngân hàng cá nhân?
            </p>
            <p className="text-xs text-[#ef4444] font-medium mb-6">
              Lưu ý: Đề tài đã có sinh viên đăng ký sẽ không thể xóa.
            </p>
            <div className="flex justify-center gap-3 w-full">
              <Button 
                variant="outline" 
                onClick={() => setDeletingId(null)}
                className="w-full rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold h-10"
              >
                Quay lại
              </Button>
              <Button 
                onClick={handleDeleteTopic}
                className="w-full rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold h-10"
              >
                Xóa vĩnh viễn
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Topics;
