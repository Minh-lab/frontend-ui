import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import profileLecturer from "@/services/lecturer/profileLecturer";
import LeaveModal from "./LeaveModal";
import SpecModal from "./SpecModal";
import { lecturerProfileData } from "@/data/lecturerData";

export default function LecturerProfile() {
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);

    // Use data from external file for fallback if needed
    const [lecturerInfo, setLecturerInfo] = useState(lecturerProfileData);
    const [profile, setProfile] = useState(null);
    const [expertisesList, setExpertisesList] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileLecturer.getProfile();
                setProfile(data.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        const fetchExpertises = async () => {
            try {
                const data = await profileLecturer.getExpertises();
                if (data.success && data.data) {
                    setExpertisesList(data.data);
                }
            } catch (error) {
                console.error("Error fetching expertises:", error);
            }
        };

        fetchProfile();
        fetchExpertises();
    }, []);

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
                                <p className="font-bold text-gray-800">{profile?.user?.usercode}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Tên đăng nhập (username)</p>
                                <p className="font-bold text-gray-800">{profile?.user?.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Họ và tên (full_name)</p>
                                <p className="font-bold text-gray-800">{profile?.user?.full_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Giới tính (gender)</p>
                                <p className="font-bold text-gray-800">{profile?.user?.gender}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Academic */}
                    <div className="border border-gray-100 rounded-xl p-6 shadow-sm">
                        <h2 className="text-purple-600 font-bold mb-5 uppercase text-[13px] tracking-wide">Học thuật & Liên hệ</h2>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Học vị (degree)</p>
                                <p className="font-bold text-gray-800">{profile?.user?.degree}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Bộ môn (department)</p>
                                <p className="font-bold text-gray-800">{profile?.user?.department}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Email</p>
                                <p className="font-bold text-gray-800">{profile?.user?.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Số điện thoại (phone_number)</p>
                                <p className="font-bold text-gray-800">{profile?.user?.phone_number}</p>
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
                                    <span className="font-bold text-gray-800 text-[15px]">{profile?.user?.capstone_count || 0} / 15 SV</span>
                                </div>
                                <div className="w-full bg-[#F3F4F6] rounded-full h-2.5">
                                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${((profile?.user?.capstone_count || 0) / 15) * 100}%` }}></div>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-2 font-medium">Giới hạn tối đa 15 sinh viên/đợt.</p>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-800 text-[15px]">Thực tập doanh nghiệp</span>
                                    <span className="font-bold text-gray-800 text-[15px]">{
                                        profile?.user?.internship_count > 9 ? profile?.user?.internship_count : `0${profile?.user?.internship_count || 0}`
                                    } SV / 10 SV</span>
                                </div>
                                <div className="w-full bg-[#F3F4F6] rounded-full h-2.5">
                                    <div className="bg-[#10B981] h-2.5 rounded-full" style={{ width: `${((profile?.user?.internship_count || 0) / 10) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
                            <p className="text-[13px] font-bold text-gray-500 mb-4">Lĩnh vực chuyên môn:</p>
                            <div className="flex flex-wrap gap-2.5">
                                {profile?.user?.expertises?.map(spec => (
                                    <span key={spec.expertise_id} className="px-3.5 py-1.5 bg-purple-50 text-purple-600 rounded-md text-[13px] font-bold">
                                        {spec.name}
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
                    options={expertisesList}
                    currentSpecs={profile?.user?.expertises || []}
                    onClose={() => setIsSpecModalOpen(false)}
                    onSave={async (newSpecs) => {
                        try {
                            const response = await profileLecturer.updateExpertises(newSpecs);
                            if (response.success && response.data) {
                                // response.data is the UserResource directly
                                setProfile(prev => ({
                                    ...prev,
                                    user: response.data
                                }));
                                toast.success("Cập nhật chuyên môn thành công", { className: "!bg-[#dcfce7] !text-[#047857]" });
                            }
                        } catch (error) {
                            console.error("Error updating expertises:", error);
                            toast.error(error.message || "Lỗi cập nhật chuyên môn");
                        } finally {
                            setIsSpecModalOpen(false);
                        }
                    }}
                />
            )}
        </div>
    );
}
