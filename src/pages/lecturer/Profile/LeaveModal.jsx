import React from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import profileLecturer from "@/services/lecturer/profileLecturer";

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

export default function LeaveModal({ onClose }) {
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

    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("start_date", data.startDate); // Map frontend name to backend name
            formData.append("end_date", data.endDate);

            if (data.file && data.file.length > 0) {
                formData.append("file", data.file[0]);
            }

            const response = await profileLecturer.submitLeaveRequest(formData);

            if (response.success) {
                toast.success("Gửi yêu cầu nghỉ phép thành công", { className: "!bg-[#dcfce7] !text-[#047857]" });
                onClose();
            }
        } catch (error) {
            console.error("Submit leave request error:", error);
            toast.error(error.message || "Đã xảy ra lỗi khi gửi yêu cầu.");
        } finally {
            setIsLoading(false);
        }
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
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="bg-[#E5E7EB] hover:bg-[#D1D5DB] text-gray-700 font-semibold border-0 rounded-lg px-6">
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-lg px-6 shadow-md shadow-purple-200">
                            {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
