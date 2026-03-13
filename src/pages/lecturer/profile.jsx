import React, { useState } from "react";
import { X, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lecturerProfileData } from "@/data/lecturerData";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";

export default function LecturerProfile() {
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);

    // Use data from external file
    const [lecturerInfo, setLecturerInfo] = useState(lecturerProfileData);

    // Specialization options for the modal

    const specOptions = [
        "An ninh mạng", "Trí tuệ nhân tạo (AI)", "Phát triển Web (Frontend/Backend)",
        "Phân tích dữ liệu (Big Data)", "Hệ thống nhúng & Robotics", "Điện toán đám mây"
    ];

    return (
        <div className="p-6 bg-white min-h-full">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Hồ sơ Giảng viên</h1>
                <div className="bg-[#E6F4EA] text-green-700 px-4 py-2 rounded-full font-semibold text-sm">
                    Trạng thái: Đang nhận hướng dẫn
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* Row 1: 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Identification */}
                    <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
                        <h2 className="text-purple-600 font-bold mb-5 uppercase text-[13px] tracking-wide">Thông tin định danh</h2>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Mã Giảng viên (usercode)</p>
                                <p className="font-bold text-gray-800">{lecturerInfo.usercode}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Tên đăng nhập (username)</p>
                                <p className="font-bold text-gray-800">{lecturerInfo.username}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Họ và tên (full_name)</p>
                                <p className="font-bold text-gray-800">{lecturerInfo.full_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Giới tính (gender)</p>
                                <p className="font-bold text-gray-800">{lecturerInfo.gender}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Academic */}
                    <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
                        <h2 className="text-purple-600 font-bold mb-5 uppercase text-[13px] tracking-wide">Học thuật & Liên hệ</h2>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Học vị (degree)</p>
                                <p className="font-bold text-gray-800">{lecturerInfo.degree}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Bộ môn (department)</p>
                                <p className="font-bold text-gray-800">{lecturerInfo.department}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Email</p>
                                <p className="font-bold text-gray-800">{lecturerInfo.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Số điện thoại (phone_number)</p>
                                <p className="font-bold text-gray-800">{lecturerInfo.phone_number}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: Load Management */}
                <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
                    <h2 className="text-purple-600 font-bold mb-6 uppercase text-[13px] tracking-wide">Quản lý tải trọng & Chuyên môn</h2>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 space-y-8">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-800 text-[15px]">Đồ án tốt nghiệp</span>
                                    <span className="font-bold text-gray-800 text-[15px]">{lecturerInfo.load.graduate.current} / {lecturerInfo.load.graduate.max} SV</span>
                                </div>
                                <div className="w-full bg-[#F3F4F6] rounded-full h-2.5">
                                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${(lecturerInfo.load.graduate.current / lecturerInfo.load.graduate.max) * 100}%` }}></div>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-2 font-medium">Giới hạn tối đa {lecturerInfo.load.graduate.max} sinh viên/đợt.</p>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-800 text-[15px]">Thực tập doanh nghiệp</span>
                                    <span className="font-bold text-gray-800 text-[15px]">{
                                        lecturerInfo.load.intern.current > 9 ? lecturerInfo.load.intern.current : `0${lecturerInfo.load.intern.current}`
                                    } SV</span>
                                </div>
                                <div className="w-full bg-[#F3F4F6] rounded-full h-2.5">
                                    <div className="bg-[#10B981] h-2.5 rounded-full" style={{ width: `${(lecturerInfo.load.intern.current / lecturerInfo.load.intern.max) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
                            <p className="text-[13px] font-bold text-gray-500 mb-4">Lĩnh vực chuyên môn:</p>
                            <div className="flex flex-wrap gap-2.5">
                                {lecturerInfo.specializations.map(spec => (
                                    <span key={spec} className="px-3.5 py-1.5 bg-purple-50 text-purple-600 rounded-md text-[13px] font-bold">
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-5 rounded-lg font-semibold shadow-md shadow-purple-200 transition-all active:scale-95"
                        onClick={() => setIsSpecModalOpen(true)}
                    >
                        Cập nhật chuyên môn
                    </Button>
                    <Button
                        className="bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#1E3A8A] px-8 py-5 rounded-lg font-semibold shadow-sm transition-all active:scale-95"
                        onClick={() => setIsLeaveModalOpen(true)}
                    >
                        Yêu cầu nghỉ phép dài hạn
                    </Button>
                </div>
            </div>

            {isLeaveModalOpen && (
                <LeaveModal onClose={() => setIsLeaveModalOpen(false)} />
            )}

            {isSpecModalOpen && (
                <SpecModal
                    options={specOptions}
                    currentSpecs={lecturerInfo.specializations}
                    onClose={() => setIsSpecModalOpen(false)}
                    onSave={(newSpecs) => {
                        setLecturerInfo(prev => ({
                            ...prev,
                            specializations: newSpecs
                        }));
                        setIsSpecModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}

// ----- Modals Components -----

const leaveSchema = yup.object().shape({
    title: yup.string().required("Vui lòng nhập tiêu đề yêu cầu"),
    description: yup.string().required("Vui lòng mô tả chi tiết lý do"),
    startDate: yup.string().required("Vui lòng chọn ngày bắt đầu"),
    endDate: yup
        .string()
        .required("Vui lòng chọn ngày kết thúc")
        .test("is-after", "Ngày kết thúc phải sau ngày bắt đầu", function (val) {
            const { startDate } = this.parent;
            return !startDate || !val || new Date(val) >= new Date(startDate);
        }),
    file: yup
        .mixed()
        .test("fileSize", "Dung lượng file không được vượt quá 3MB", (value) => {
            if (!value || (value instanceof FileList && value.length === 0)) return true;
            return value[0].size <= 3 * 1024 * 1024;
        }),
});

function LeaveModal({ onClose }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        resolver: yupResolver(leaveSchema),
        mode: "onChange",
    });

    const file = watch("file");
    const fileName = file && file[0] ? file[0].name : "No file chosen";

    const onSubmit = (data) => {
        console.log("Leave Request Data:", data);
        toast.success("Gửi yêu cầu nghỉ phép thành công", { className: "!bg-[#dcfce7] !text-[#047857]" });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div
                className="bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                style={{ animationFillMode: 'both' }}
            >
                {/* Header */}
                <div className="bg-[#7C3AED] flex justify-between items-center px-6 py-4">
                    <h3 className="text-white font-bold uppercase text-[15px] tracking-wide">Yêu cầu nghỉ phép dài hạn</h3>
                    <button
                        onClick={onClose}
                        className="text-white bg-[#EF4444] hover:bg-[#DC2626] transition-colors rounded p-1.5"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6 space-y-5">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                                Tiêu đề (TITLE) <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("title")}
                                type="text"
                                placeholder="Nhập tiêu đề yêu cầu..."
                                className={`w-full border ${errors.title ? "border-red-500" : "border-gray-200"} rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all placeholder:text-gray-400 text-gray-700`}
                            />
                            {errors.title && <p className="text-red-500 text-[10px] mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                                Mô tả lý do (DESCRIPTION) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register("description")}
                                rows={3}
                                placeholder="Mô tả chi tiết lý do nghỉ phép..."
                                className={`w-full border ${errors.description ? "border-red-500" : "border-gray-200"} rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent resize-none transition-all placeholder:text-gray-400 text-gray-700`}
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-[10px] mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                                    Ngày bắt đầu (START_DATE) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("startDate")}
                                    type="date"
                                    className={`w-full border ${errors.startDate ? "border-red-500" : "border-gray-200"} rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all text-gray-700 font-medium`}
                                />
                                {errors.startDate && <p className="text-red-500 text-[10px] mt-1">{errors.startDate.message}</p>}
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                                    Ngày kết thúc (END_DATE) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("endDate")}
                                    type="date"
                                    className={`w-full border ${errors.endDate ? "border-red-500" : "border-gray-200"} rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all text-gray-700 font-medium`}
                                />
                                {errors.endDate && <p className="text-red-500 text-[10px] mt-1">{errors.endDate.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Đơn nghỉ phép (FILE_PATH: ẢNH/PDF &lt; 3MB)</label>
                            <div className={`border ${errors.file ? "border-red-500" : "border-gray-200"} rounded-lg flex items-center bg-white p-1 hover:border-gray-300 transition-colors`}>
                                <label className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md border border-gray-300 text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                                    Choose File
                                    <input {...register("file")} type="file" className="hidden" accept=".pdf,image/*" />
                                </label>
                                <span className={`ml-3 text-sm font-medium ${errors.file ? "text-red-500" : "text-gray-500"}`}>
                                    {fileName}
                                </span>
                            </div>
                            {errors.file ? (
                                <p className="text-[#EF4444] text-xs mt-2 font-medium">{errors.file.message}</p>
                            ) : (
                                <p className="text-gray-400 text-[10px] mt-2 font-medium italic">Dung lượng file không vượt quá 3MB.</p>
                            )}
                        </div>
                    </div>

                    {/* Actons */}
                    <div className="bg-[#F9FAFB] px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                        <Button type="button" variant="outline" onClick={onClose} className="bg-[#E5E7EB] hover:bg-[#D1D5DB] text-gray-700 font-semibold border-0 rounded-lg px-6">
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-lg px-6 shadow-md shadow-purple-200">
                            Gửi yêu cầu
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function SpecModal({ options, currentSpecs, onClose, onSave }) {
    const [selected, setSelected] = React.useState(() => {
        const initialSelected = new Set();
        currentSpecs.forEach(spec => {
            const match = options.find(o => o.includes(spec) || spec.includes(o));
            if (match) initialSelected.add(match);
            else initialSelected.add(spec);
        });
        return initialSelected;
    });

    const [customSpec, setCustomSpec] = React.useState("");
    const [error, setError] = React.useState("");

    const toggleSelection = (option) => {
        const next = new Set(selected);
        let found = false;

        if (next.has(option)) {
            next.delete(option);
            found = true;
        } else {
            Array.from(next).forEach(item => {
                if (item.includes(option) || option.includes(item)) {
                    next.delete(item);
                    found = true;
                }
            });
        }

        if (!found) {
            next.add(option);
        }
        setSelected(next);
        if (next.size > 0 || customSpec.trim() !== "") setError("");
    };

    const handleSave = () => {
        let finalSpecs = Array.from(selected);
        const trimmedCustom = customSpec.trim();

        if (finalSpecs.length === 0 && trimmedCustom === "") {
            setError("Vui lòng chọn ít nhất một chuyên môn hoặc nhập chuyên môn mới.");
            return;
        }

        if (trimmedCustom !== "") {
            finalSpecs.push(trimmedCustom);
        }

        onSave(finalSpecs);
        toast.success("Cập nhật chuyên môn thành công", { className: "!bg-[#dcfce7] !text-[#047857]" });
        onClose(); // Added onClose here
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
                            // Here we match by text or partial. 
                            // E.g. option might be "Trí tuệ nhân tạo (AI)" but data has "Trí tuệ nhân tạo"
                            // Let's just track by exact `option` name selected for UI simplicity
                            const isSelected = selected.has(option);

                            return (
                                <div
                                    key={option}
                                    onClick={() => toggleSelection(option)}
                                    className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer transition-all ${isSelected ? 'border-purple-300 bg-purple-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-[#7C3AED] border-[#7C3AED]' : 'bg-white border-gray-300'}`}>
                                        {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                    </div>
                                    <span className={`text-[13px] font-bold ${isSelected ? 'text-[#7C3AED]' : 'text-gray-700'}`}>{option}</span>
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
