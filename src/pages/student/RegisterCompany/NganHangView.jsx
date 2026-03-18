/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// import internshipService from "@/services/internship"; // Assuming this service exists or will be created

export default function NganHangView({ onBack, onDangKy }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([
    { id: 1, name: "FPT Software", tax_code: "0100111000", address: "Duy Tân, Cầu Giấy, Hà Nội", industry: "IT", slots: 20 },
    { id: 2, name: "Viettel Solutions", tax_code: "0100109106", address: "Giang Văn Minh, Ba Đình, Hà Nội", industry: "Telecom", slots: 15 },
    { id: 3, name: "NashTech Vietnam", tax_code: "0106820579", address: "Trần Duy Hưng, Cầu Giấy, Hà Nội", industry: "IT", slots: 10 },
    { id: 5, name: "Sun* Inc. Vietnam", tax_code: "0105678901", address: "Tôn Đức Thắng, Đống Đa, Hà Nội", industry: "IT", slots: 12 },
  ]);

  // Mock fetch
  useEffect(() => {
    // fetchData();
  }, []);

  const handleDangKy = (company) => {
    onDangKy({
      tenCongTy: company.name,
      maSoThue: company.tax_code,
      email: "hr@" + company.name.toLowerCase().replace(/\s/g, '') + ".com",
      diaChi: company.address,
      type: "OFFICIAL"
    });
    toast.success(`Đã chọn doanh nghiệp ${company.name} thành công`);
  };

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.tax_code.includes(search)
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-[#5c60c0] text-white px-5 py-3 flex items-center gap-3">
        <button onClick={onBack} className="hover:bg-white/10 rounded p-0.5 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold">Ngân hàng doanh nghiệp đã liên kết</span>
      </div>

      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="relative max-w-md mx-auto">
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
          </svg>
          <Input
            className="pl-9 bg-white border-gray-300"
            placeholder="Tìm theo tên công ty hoặc mã số thuế..."
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
              <th className="text-left px-4 py-3 font-bold text-gray-500 text-xs uppercase">Địa chỉ</th>
              <th className="text-center px-4 py-3 font-bold text-gray-500 text-xs uppercase">Chỉ tiêu</th>
              <th className="text-center px-4 py-3 font-bold text-gray-500 text-xs uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">Không tìm thấy doanh nghiệp nào phù hợp.</td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-800">{c.name}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">{c.industry}</div>
                  </td>
                  <td className="px-4 py-4 text-gray-600 font-mono text-xs">{c.tax_code}</td>
                  <td className="px-4 py-4 text-gray-500 text-xs max-w-[200px] truncate">{c.address}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {c.slots}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Button 
                      onClick={() => handleDangKy(c)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white shadow-sm"
                    >
                      Chọn nhanh
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
