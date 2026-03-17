import React from "react";
import { X, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SpecModal({ options, currentSpecs, onClose, onSave }) {
    const [selected, setSelected] = React.useState(() => {
        const initialSelected = new Set();
        currentSpecs.forEach(spec => {
            // Find by expertise_id or name
            const match = options.find(o => o.expertise_id === spec.expertise_id || o.name === spec.name);
            if (match) initialSelected.add(match.expertise_id);
        });
        return initialSelected;
    });

    const [customSpec, setCustomSpec] = React.useState("");
    const [error, setError] = React.useState("");

    const toggleSelection = (optionId) => {
        const next = new Set(selected);
        if (next.has(optionId)) {
            next.delete(optionId);
        } else {
            next.add(optionId);
        }
        setSelected(next);
        if (next.size > 0 || customSpec.trim() !== "") setError("");
    };

    const handleSave = async () => {
        let finalSpecs = Array.from(selected);
        const trimmedCustom = customSpec.trim();

        if (finalSpecs.length === 0 && trimmedCustom === "") {
            setError("Vui lòng chọn ít nhất một chuyên môn hoặc nhập chuyên môn mới.");
            return;
        }

        if (trimmedCustom !== "") {
            finalSpecs.push(trimmedCustom);
        }

        await onSave(finalSpecs);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div
                className="bg-white w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                style={{ animationFillMode: 'both' }}
            >
                {/* Header */}
                <div className="bg-[#7C3AED] flex justify-between items-center px-6 py-4">
                    <h3 className="text-white font-bold uppercase text-[15px] tracking-wide">Cập nhật chuyên môn giảng viên</h3>
                    <button
                        onClick={onClose}
                        className="text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors rounded p-1.5"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-7">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                        {options.map(option => {
                            const isSelected = selected.has(option.expertise_id);

                            return (
                                <div
                                    key={option.expertise_id}
                                    onClick={() => toggleSelection(option.expertise_id)}
                                    className={`flex items-start gap-3 border rounded-xl px-4 py-3.5 cursor-pointer transition-all ${isSelected ? 'border-purple-300 bg-purple-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                >
                                    <div className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${isSelected ? 'bg-[#7C3AED] border-[#7C3AED]' : 'bg-white border-gray-300'}`}>
                                        {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                    </div>
                                    <div className="flex flex-col">
                                         <span className={`text-[13px] font-bold ${isSelected ? 'text-[#7C3AED]' : 'text-gray-700'}`}>{option.name}</span>
                                         <span className="text-[11px] text-gray-500 mt-0.5 leading-snug">{option.description}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Chuyên môn khác (nếu có):</label>
                        <input
                            type="text"
                            value={customSpec}
                            onChange={(e) => {
                                setCustomSpec(e.target.value);
                                if (e.target.value.trim() !== "" || selected.size > 0) setError("");
                            }}
                            placeholder="Nhập chuyên môn không có trong danh sách..."
                            className={`w-full border ${error ? "border-red-500" : "border-gray-200"} rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all placeholder:text-gray-400 text-gray-700`}
                        />
                        {error && (
                            <div className="flex items-center gap-1.5 mt-2 text-red-500">
                                <TriangleAlert size={14} strokeWidth={2.5} />
                                <p className="text-[11px] font-bold uppercase tracking-wider">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-[#F9FAFB] px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                    <Button variant="outline" onClick={onClose} className="bg-[#E5E7EB] hover:bg-[#D1D5DB] text-gray-700 font-semibold border-0 rounded-lg px-6">
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-lg px-6 shadow-md shadow-purple-200"
                    >
                        Lưu thay đổi
                    </Button>
                </div>
            </div>
        </div>
    );
}
