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
      email: "hr@" + (company.name || "company").toLowerCase().replace(/\s/g, '') + ".com",
      diaChi: company.address || "Liên hệ doanh nghiệp để biết chi tiết",
      type: "OFFICIAL"
    });
    // Lưu ý: Đây mới là cập nhật UI, bạn cần gọi API register-company để lưu vào DB giống như bên DeXuatMoiForm
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
        <span className="font-semibold">Ngân hàng doanh nghiệp đối tác</span>
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
              <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs uppercase">Doanh nghiệp</th>
              <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs uppercase">Mã số thuế</th>
              <th className="text-center px-4 py-3 font-bold text-gray-500 text-xs uppercase">Còn trống</th>
              <th className="text-center px-4 py-3 font-bold text-gray-500 text-xs uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#5c60c0] border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải danh sách...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-gray-400">Không có dữ liệu phù hợp.</td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.company_id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-800">{c.name}</div>
                  </td>
                  <td className="px-4 py-4 text-gray-600 font-mono text-xs">{c.tax_code}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.available > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {c.available} / {c.max_slots}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Button
                      onClick={() => handleDangKy(c)}
                      disabled={c.available <= 0}
                      size="sm"
                      className={`${c.available > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300'} text-white shadow-sm`}
                    >
                      {c.available > 0 ? 'Đăng ký nhanh' : 'Hết chỗ'}
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
