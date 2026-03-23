import React, { useState, useEffect } from "react";
import { X, Search, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { capstoneService } from "@/services/faculty";

export default function AssignReviewerDialog({ isOpen, onClose, selectedCount, selectedIds, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [councils, setCouncils] = useState([]);
  const [councilMembers, setCouncilMembers] = useState([]);
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [selectedGVPB, setSelectedGVPB] = useState([]);
  const [protectionDate, setProtectionDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [processing, setProcessing] = useState(false);

  // Fetch danh sách hội đồng khi mở dialog
  useEffect(() => {
    if (isOpen) {
      fetchCouncils();
    }
  }, [isOpen]);

  // Fetch thành viên hội đồng khi chọn hội đồng
  useEffect(() => {
    if (selectedCouncil) {
      fetchCouncilMembers(selectedCouncil.council_id);
      // Đặt ngày bảo vệ mặc định là ngày bắt đầu của hội đồng
      if (selectedCouncil.start_date) {
        setProtectionDate(selectedCouncil.start_date);
      }
    }
  }, [selectedCouncil]);

  // Lọc thành viên theo search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = councilMembers.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(councilMembers);
    }
  }, [councilMembers, searchTerm]);

  const fetchCouncils = async () => {
    try {
      setLoading(true);
      const response = await capstoneService.getCouncils();
      
      if (response.success) {
        // Transform council data to match component expectations
        const transformedCouncils = response.data.map(council => {
          // Generate array of dates between start_date and end_date
          const defenseStartDate = new Date(council.start_date);
          const defenseEndDate = new Date(council.end_date);
          const defenseDates = [];
          
          for (let d = new Date(defenseStartDate); d <= defenseEndDate; d.setDate(d.getDate() + 1)) {
            defenseDates.push(new Date(d).toISOString().split('T')[0]);
          }
          
          return {
            id: council.council_id,
            council_id: council.council_id,
            name: council.name,
            color: 'bg-gradient-to-br from-indigo-50 to-purple-50',
            count: council.student_count || 0,
            dates: defenseDates.length > 0 ? defenseDates : [council.start_date],
            start_date: council.start_date,
            end_date: council.end_date
          };
        });
        
        setCouncils(transformedCouncils);
        if (transformedCouncils.length > 0) {
          setSelectedCouncil(transformedCouncils[0]);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải danh sách hội đồng");
    } finally {
      setLoading(false);
    }
  };

  const fetchCouncilMembers = async (councilId) => {
    try {
      const response = await capstoneService.getCouncilMembers(councilId);
      
      if (response.success) {
        // Extract members from response data
        const members = response.data.members || [];
        
        // Transform member data to match component expectations
        const transformedMembers = members.map(member => ({
          id: member.lecturer_id,
          lecturer_id: member.lecturer_id,
          name: member.name || member.full_name,
          color: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          count: member.review_count || 0, // Count of reviews this member has done from CapstoneReviewer table
          degree: member.degree,
          department: member.department
        }));
        
        setCouncilMembers(transformedMembers);
        setFilteredMembers(transformedMembers);
        // Reset selected GVPB khi đổi hội đồng
        setSelectedGVPB([]);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải danh sách giảng viên");
    }
  };

  const handleToggleLecturer = (id) => {
    setSelectedGVPB((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (!isValidSelection) return;
    
    try {
      setProcessing(true);
      
      // Gọi API phân công hàng loạt hội đồng và giảng viên phản biện
      const response = await capstoneService.assignCouncilAndReviewers(
        selectedCouncil.council_id,
        selectedGVPB,
        selectedIds
      );
      
      if (response.success) {
        toast.success(`Đã phân công phản biện cho ${selectedCount} sinh viên`);
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Lỗi khi phân công phản biện");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi phân công phản biện");
    } finally {
      setProcessing(false);
    }
  };

  const isValidSelection = selectedGVPB.length === 2 && selectedCouncil && protectionDate;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="bg-[#f0f4ff] w-full max-w-4xl rounded-[24px] shadow-2xl overflow-hidden border border-white">
        
        {/* Header */}
        <div className="bg-[#5c56be] p-4 flex justify-between items-center relative text-white">
          <h2 className="text-lg font-bold px-2 uppercase tracking-wide">Phân công phản biện</h2>
          <button 
            onClick={onClose} 
            className="absolute right-0 top-0 bottom-0 bg-[#ff0000] hover:bg-red-700 w-12 flex items-center justify-center font-bold transition-colors"
            disabled={processing}
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-bold text-slate-800">
              Đã chọn <span className="text-purple-600">{selectedCount}</span> sinh viên
            </h3>
            
            {!isValidSelection && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 animate-pulse">
                <AlertCircle className="size-3.5" />
                <span className="text-[11px] font-bold uppercase">
                  {selectedGVPB.length}/2 giảng viên
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              
              {/* CỘT TRÁI - Danh sách hội đồng */}
              <div className="p-5 border-r border-slate-100 space-y-4 bg-slate-50/30">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Chọn hội đồng</h4>
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2">
                  {councils.map(hd => (
                    <button 
                      key={hd.id} 
                      onClick={() => setSelectedCouncil(hd)}
                      className={`w-full flex justify-between items-center p-4 rounded-xl transition-all ${hd.color} ${selectedCouncil?.id === hd.id ? "ring-2 ring-indigo-400 scale-[1.02] shadow-md" : "opacity-60 hover:opacity-100"}`}
                    >
                      <span className="font-bold text-slate-800 text-sm">{hd.name}</span>
                      <span className="text-[11px] font-medium text-slate-600">SV chấm: {hd.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CỘT PHẢI - Danh sách giảng viên */}
              <div className="p-5 space-y-4 flex flex-col">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Giảng viên phản biện
                    {selectedCouncil && (
                      <span className="ml-2 text-[10px] font-normal text-slate-400">
                        (chọn 2)
                      </span>
                    )}
                  </h4>
                  <div className="relative w-36">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
                    <input 
                      placeholder="Tìm..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-7 pr-3 py-1 border border-slate-200 rounded-full text-[11px] bg-slate-50 focus:outline-none focus:ring-1 focus:ring-purple-500" 
                    />
                  </div>
                </div>

                {!selectedCouncil ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    Vui lòng chọn hội đồng trước
                  </div>
                ) : (
                  <div className="space-y-2 flex-1 max-h-[250px] overflow-y-auto pr-2">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map(gv => (
                        <label 
                          key={gv.id} 
                          className={`flex justify-between items-center p-3 rounded-xl transition-all cursor-pointer border ${gv.color} ${selectedGVPB.includes(gv.id) ? "border-indigo-500 shadow-sm" : "border-transparent opacity-80"}`}
                        >
                          <span className="font-bold text-slate-800 text-xs">{gv.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-600">PB: {gv.count}</span>
                            <input 
                              type="checkbox" 
                              checked={selectedGVPB.includes(gv.id)}
                              onChange={() => handleToggleLecturer(gv.id)}
                              disabled={!selectedGVPB.includes(gv.id) && selectedGVPB.length >= 2}
                              className="size-4 accent-indigo-600 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" 
                            />
                          </div>
                        </label>
                      ))
                    ) : (
                      <div className="text-center py-4 text-slate-400 text-xs">
                        Không tìm thấy giảng viên
                      </div>
                    )}
                  </div>
                )}

                {/* CHỌN NGÀY BẢO VỆ */}
                {selectedCouncil && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Ngày bảo vệ</span>
                    <select
                      value={protectionDate}
                      onChange={(e) => setProtectionDate(e.target.value)}
                      className="px-3 py-1.5 bg-slate-100 border-none rounded-lg text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Chọn ngày</option>
                      {selectedCouncil.dates?.map(date => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString('vi-VN')}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NÚT HÀNH ĐỘNG */}
          <div className="flex justify-center gap-4 pt-2">
            <Button 
              disabled={!isValidSelection || processing}
              onClick={handleAssign}
              className={`px-10 h-10 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 ${
                isValidSelection && !processing
                  ? "bg-[#c24238] hover:bg-red-800 text-white" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {processing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isValidSelection ? (
                "Phân công"
              ) : (
                `Chọn đủ 2 (${selectedGVPB.length}/2)`
              )}
            </Button>
            <Button 
              onClick={onClose}
              disabled={processing}
              className="bg-slate-400 hover:bg-slate-500 text-white px-10 h-10 rounded-xl text-sm font-bold disabled:opacity-50"
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}