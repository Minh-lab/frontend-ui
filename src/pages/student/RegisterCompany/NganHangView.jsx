


import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import internshipService from "@/services/internship";

export default function NganHangView({ onBack, onDangKy }) {
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await internshipService.getAvailableCompanies();
      // Backend returns CompanySlotResource collection
      if (response && response.data) {
        setCompanies(response.data);
      }
    } catch (error) {
      console.error("Fetch companies error:", error);
      toast.error("Không thể tải danh sách doanh nghiệp đối tác");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleDangKy = (company) => {
    onDangKy({
      tenCongTy: company.name,
      maSoThue: company.tax_code,
      email: company.email,
      diaChi: company.address || "Liên hệ doanh nghiệp để biết chi tiết",
      type: "OFFICIAL"
    });
  };

  const filtered = companies.filter(c =>
    (c.name?.toLowerCase().includes(search.toLowerCase())) ||
    (c.tax_code?.includes(search))
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-[#5c60c0] text-white px-5 py-3 flex items-center gap-3">
        <button onClick={onBack} className="hover:bg-white/10 rounded p-0.5 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold text-sm sm:text-base">Ngân hàng doanh nghiệp đối tác</span>
      </div>

      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="relative max-w-md mx-auto">
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
          <Input
            className="pl-9 bg-white border-gray-300"
            placeholder="Tìm tên công ty hoặc mã số thuế..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-bold text-gray-500 text-[10px] uppercase whitespace-nowrap">Doanh nghiệp</th>
              <th className="text-left px-4 py-3 font-bold text-gray-500 text-[10px] uppercase whitespace-nowrap">Email & Địa chỉ</th>
              <th className="text-left px-4 py-3 font-bold text-gray-500 text-[10px] uppercase whitespace-nowrap">Website</th>
              <th className="text-center px-4 py-3 font-bold text-gray-500 text-[10px] uppercase whitespace-nowrap">Còn trống</th>
              <th className="text-center px-4 py-3 font-bold text-gray-500 text-[10px] uppercase whitespace-nowrap">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#5c60c0] border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải danh sách...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">Không có dữ liệu phù hợp.</td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.company_id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-4 min-w-[200px]">
                    <div className="font-bold text-gray-800 leading-tight">{c.name}</div>
                    <div className="text-[10px] font-mono text-gray-400 mt-1">MST: {c.tax_code}</div>
                  </td>
                  <td className="px-4 py-4 min-w-[250px] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {c.email}
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-relaxed capitalize">
                      <svg className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {c.address || "Chưa cập nhật"}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {c.website ? (
                      <a
                        href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#5c60c0] hover:underline text-xs flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {c.website.replace(/^https?:\/\//, '').split('/')[0]}
                      </a>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${c.available > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {c.available} / {c.max_slots}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Button
                      onClick={() => handleDangKy(c)}
                      disabled={c.available <= 0}
                      size="sm"
                      className={`h-8 px-4 text-xs font-bold transition-all ${c.available > 0 ? 'bg-[#5c60c0] hover:bg-[#4a4ea8] text-white' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {c.available > 0 ? 'Đăng ký' : 'Hết chỗ'}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
