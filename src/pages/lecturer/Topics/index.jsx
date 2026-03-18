import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import topicService from "@/services/topic";
import api from "@/services/apiConfig"; // For fetching expertise list

import TopicTable from "./TopicTable";
import TopicFormModal from "./TopicFormModal";
import DeleteTopicModal from "./DeleteTopicModal";

const ITEMS_PER_PAGE = 6;

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    per_page: ITEMS_PER_PAGE,
    last_page: 1
  });

  const [expertises, setExpertises] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [expertiseInput, setExpertiseInput] = useState("all");
  const [statusInput, setStatusInput] = useState("all");

  const [keyword, setKeyword] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchExpertises = useCallback(async () => {
    try {
      const response = await api.get("/expertises");
      if (response.data?.success) {
        setExpertises(response.data.data);
      }
    } catch (error) {
      console.error("Fetch expertises error:", error);
    }
  }, []);

  const fetchTopics = useCallback(async (targetPage = 1) => {
    setLoading(true);
    try {
      const params = {
        keyword: keyword,
        expertise_id: specialization === "all" ? undefined : specialization,
        page: targetPage,
        per_page: ITEMS_PER_PAGE,
      };

      const response = await topicService.searchTopics(params);
      if (response.success) {
        setTopics(response.data);
        setMeta(response.meta || {
          total: response.data.length,
          page: targetPage,
          per_page: ITEMS_PER_PAGE,
          last_page: Math.ceil(response.data.length / ITEMS_PER_PAGE)
        });
        setPage(targetPage);
      }
    } catch (error) {
      console.error("Fetch topics error:", error);
      toast.error(error.message || "Không thể tải danh sách đề tài");
    } finally {
      setLoading(false);
    }
  }, [keyword, specialization]);

  useEffect(() => {
    fetchExpertises();
  }, [fetchExpertises]);

  useEffect(() => {
    fetchTopics(1);
  }, [fetchTopics]);

  const handleSearch = () => {
    setKeyword(keywordInput);
    setSpecialization(expertiseInput);
    setStatus(statusInput);
  };

  const handleOpenAddForm = () => {
    setEditingTopic(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (topic) => {
    setEditingTopic(topic);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTopic(null);
  };

  const handleSaveTopic = async (data) => {
    try {
      let response;
      if (editingTopic) {
        response = await topicService.updateTopic(editingTopic.topic_id, data);
        if (response.success) {
          toast.success("Cập nhật đề tài thành công", { className: "!bg-[#dcfce7] !text-[#047857]" });
        }
      } else {
        response = await topicService.createTopic(data);
        if (response.success) {
          toast.success("Thêm đề tài thành công", { className: "!bg-[#dcfce7] !text-[#047857]" });
        }
      }
      fetchTopics(page);
      handleCloseForm();
    } catch (error) {
      toast.error(error.message || "Lỗi khi lưu đề tài");
    }
  };

  const handleDeleteTopic = async () => {
    if (deletingId === null) return;
    try {
      const response = await topicService.deleteTopic(deletingId);
      if (response.success) {
        toast.success("Xóa đề tài thành công", { className: "!bg-[#dcfce7] !text-[#047857]" });
        fetchTopics(page);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi xóa đề tài");
    } finally {
      setDeletingId(null);
    }
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

            <div className="md:col-span-3">
              <select
                value={expertiseInput}
                onChange={(event) => setExpertiseInput(event.target.value)}
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20"
              >
                <option value="all">Tất cả chuyên môn</option>
                {expertises.map((item) => (
                  <option key={item.expertise_id} value={item.expertise_id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={statusInput}
                onChange={(event) => setStatusInput(event.target.value)}
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="available">Khả dụng</option>
                <option value="registered">Đã đăng ký</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Button className="w-full rounded-full" onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </div>
          </div>

          <TopicTable
            topics={topics}
            safePage={meta.page}
            totalPages={meta.last_page}
            onPageChange={fetchTopics}
            onEdit={handleOpenEditForm}
            onDelete={setDeletingId}
            expertises={expertises}
          />
        </CardContent>
      </Card>

      <TopicFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveTopic}
        editingTopic={editingTopic}
        specializations={expertises}
      />

      <DeleteTopicModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteTopic}
      />

      {loading && (
        <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-[#6d28d9] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Topics;
