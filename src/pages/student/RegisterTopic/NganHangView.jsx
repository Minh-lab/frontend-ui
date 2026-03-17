import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import topicService from "@/services/lecturer/topic";

export default function NganHangView({ onBack, onDangKy }) {
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCongNghe, setFilterCongNghe] = useState("");
  const [filterLinhVuc, setFilterLinhVuc] = useState("");
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    per_page: 6,
    last_page: 1
  });

  const fetchTopics = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        keyword: search,
        page: page,
        per_page: 6,
        technology: filterCongNghe || undefined,
        expertise_id: filterLinhVuc || undefined,
      };

      const response = await topicService.searchTopics(params);
      if (response.success) {
        setTopics(response.data);
        setMeta(response.meta || {
          total: response.data.length,
          page: 1,
          per_page: 6,
          last_page: 1
        });
      }
    } catch (error) {
      console.error("Fetch topics error:", error);
      toast.error(error.message || "Không thể tải danh sách đề tài");
    } finally {
      setLoading(false);
    }
  }, [search, filterCongNghe, filterLinhVuc]);

  useEffect(() => {
    fetchTopics(1);
  }, []);

  const handleSearch = () => {
    fetchTopics(1);
  };

  // Derive options from current topics (or you might want a separate API for this)
  const congNgheOptions = Array.from(
    new Set(
      topics
        .flatMap((dt) => dt.technologies?.split(",") || [])
        .map((v) => v.trim())
        .filter(Boolean)
    )
  );


  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="bg-[#5c60c0] text-white px-5 py-3 rounded-t-xl flex items-center gap-3">
        <button onClick={onBack} className="hover:bg-white/10 rounded p-0.5 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold">Ngân hàng đề tài</span>
      </div>

      {/* Search bar */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
          <Input
            className="pl-9"
            placeholder="Tìm tên đề tài, mô tả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {search && (
            <button onClick={() => { setSearch(""); fetchTopics(); }} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Note: Backend current implementation only supports keyword. 
            If you want to filter by these, you need to update TopicController index method */}
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
          value={filterCongNghe}
          onChange={(e) => setFilterCongNghe(e.target.value)}
        >
          <option value="">Công nghệ ▾</option>
          {congNgheOptions.map((cn) => (
            <option key={cn} value={cn}>{cn}</option>
          ))}
        </select>



        <Button
          onClick={handleSearch}
          disabled={loading}
          className="bg-[#5c60c0] text-white hover:bg-[#4a4ea8]"
        >
          {loading ? "Đang tải..." : "Tìm kiếm"}
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["ID", "Tên đề tài", "Lĩnh vực", "Công nghệ", "Giảng viên", "Hành động"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500 text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#5c60c0] border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : topics.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                  Không tìm thấy đề tài nào.
                </td>
              </tr>
            ) : (
              topics.map((dt) => (
                <tr key={dt.topic_id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">#{dt.topic_id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px]">{dt.title}</td>
                  <td className="px-4 py-3 max-w-[150px]">
                    {dt.expertise?.name || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[140px]">{dt.technologies || "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <div className="font-medium text-gray-800">{dt.lecturer?.full_name || "Chưa phân công"}</div>
                    {dt.lecturer?.expertises && dt.lecturer.expertises.length > 0 && (
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {dt.lecturer.expertises.map(e => e.name).join(", ")}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      onClick={() => {
                        onDangKy(dt);
                        toast.success("Đã chọn đề tài thành công", {
                          className: "!bg-[#AAFAB8] !text-[#24AD47]",
                        });
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white"
                      size="sm"
                    >
                      Đăng ký
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchTopics(p)}
              className={`w-8 h-8 rounded text-sm transition ${p === meta.page
                ? "bg-[#5c60c0] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
