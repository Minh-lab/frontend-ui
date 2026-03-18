import Modal from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { sinhvienTT } from '@/data/businessData'
import React, { useEffect, useState } from 'react'
import tlu from "../../assets/logo-tlu.png"
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import internCompany from '@/services/company/intern'
function PreviewBaoCao() {
  return (
    <Card className=" bg-white text-center ">
      <p className="text-xs font-semibold tracking-wide">BỘ GIÁO DỤC VÀ ĐÀO TẠO &nbsp;&nbsp;&nbsp; BỘ NÔNG NGHIỆP VÀ PTNT</p>
      <p className="text-xs font-semibold  tracking-wide">TRƯỜNG ĐẠI HỌC THỦY LỢI</p>
      <div className="w-20 h-20 flex items-center justify-center mx-auto w-[150px]">
        <img src={tlu} alt="" />
      </div>
      <p className="text-xs font-semibold text-blue-700 tracking-widest mt-1">BÁO CÁO THỰC TẬP</p>
    </Card>
  );
}




const reviewSchema = yup.object().shape({
  diem: yup
    .number()
    .typeError("Điểm phải là một số")
    .required("Vui lòng nhập điểm")
    .min(0, "Điểm không được nhỏ hơn 0")
    .max(10, "Điểm không được lớn hơn 10"),
  comment: yup.string().required("Vui lòng nhập nhận xét chi tiết"),
});

const ManageInterns = () => {
  const [interns, setInterns] = useState()
  const [selectedSv, setSelectedSv] = useState(null)
  const [isGra, setIsGra] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reviewSchema),
    mode: "onChange",
    defaultValues: {
      diem: "",
      comment: "",
    },
  });


  const fetchInterns = async () => {
    try {
      const response = await internCompany.getIntern();
      setInterns(response.data);
    } catch (error) {
      console.error("Error fetching interns:", error);
    }
  }

  useEffect(() => {
    fetchInterns();
  }, []);

  const handleSave = async (data) => {
    if (!selectedSv) return;
    
    setIsSubmitting(true);
    try {
      await internCompany.evaluateIntern(selectedSv.internship_id, {
        company_grade: data.diem,
        company_feedback: data.comment,
      });
      
      toast.success("Hành động đã được ghi nhận", {
        className: "!bg-[#AAFAB8] !text-[#24AD47]",
      });
      setSelectedSv(null);
      fetchInterns();
    } catch (error) {
      console.error("Error saving review:", error);
      toast.error(error.message || "Lỗi khi lưu đánh giá", {
        className: "!bg-[#FFD1D1] !text-[#FF0000]",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (selectedSv) {
      reset({
        diem: selectedSv.company_grade ?? "",
        comment: selectedSv.company_feedback ?? "",
      });
    }
  }, [selectedSv, reset]);

  const handleSaveReview = (data) => {
    if (!selectedSv) return

    setInterns((prevInterns) =>
      prevInterns.map((sv) =>
        sv.id === selectedSv.id ? { ...sv, trangthai: "da danh gia", diem: Number(data.diem), nhanXet: data.comment } : sv
      )
    )
    setSelectedSv(null)
    toast.success("Hạnh động đã được ghi nhận", {
      className: "!bg-[#AAFAB8] !text-[#24AD47]",
    })
  }

  return (
    <div className='p-6'>
      <Card className="bg-[#ECF9FF]">
        <span className="text-center text-[25px] font-inter text-[#445298] font-bold">Chấm điểm và đánh giá</span>
        <div className='px-6'>
          <span className='font-inter'>Danh sách sinh viên đăng ký thực tập</span>
        </div>
        <Card className="mx-6  p-0">
          <div className="overflow-x-auto ">
            <table className='text-x font-normal w-full'>
              <thead >
                <tr className='bg-gray-50 border-b border-gray-200'>
                  <th className="px-4 py-2.5 text-left font-normal font-inter">
                    STT
                  </th >
                  <th className="px-4 py-2.5 text-left font-normal font-inter">
                    MSV
                  </th>
                  <th className="px-4 py-2.5 text-left font-normal font-inter">
                    Họ và tên
                  </th>
                  <th className="px-4 py-2.5 text-left font-normal font-inter">
                    Vị trí đăng ký
                  </th>
                  <th className="px-4 py-2.5 text-left font-normal font-inter">
                    Điểm
                  </th>
                  <th className="px-4 py-2.5 text-left font-normal font-inter">
                    Trạng thái
                  </th>
                  <th className="px-4 py-2.5 text-left font-normal font-inter">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {interns?.map((sv, index) => (
                  <tr key={sv?.internship_id} className='bg-white border-b border-gray-200 hover:bg-gray-50/50 transition'>
                    <td className='px-4 py-3  font-inter text-gray-700'>
                      {index + 1}
                    </td>
                    <td className='px-4 py-3  font-inter text-gray-700'>
                      {sv?.student_code}
                    </td>
                    <td className='px-4 py-3  font-inter text-gray-700'>
                      {sv?.full_name}
                    </td>
                    <td className='px-4 py-3 font-inter text-gray-700'>
                      <span className='px-3 py-1 text-xs font-medium text-purple-600 bg-purple-100 border border-purple-300 rounded-full '>
                        {sv?.position}
                      </span>
                    </td >
                    <td className='px-4 py-3 font-inter text-gray-700'>
                      {sv?.company_grade ?? "--"}
                    </td>
                    <td className='px-4 py-3 font-inter text-gray-700'>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${!sv?.company_grade
                          ? "bg-[#FFF2D2] text-[#DA5C02] border border-[#DA5C02]"
                          : "bg-[#BCFFC2] text-[#24AD47] border border-[#24AD47]"
                          }`}
                      >
                        {sv?.company_grade ? "Đã đánh giá" : "Chưa đánh giá"}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex gap-5'>
                        <Button
                          onClick={() => { setSelectedSv(sv); setIsGra(sv.trangthai === "da danh gia") }}
                          className="disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Xem chi tiết
                        </Button>


                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        {selectedSv && (
          <Modal size='xl' className="" title={"Chấm điểm và đánh giá"} onClose={() => setSelectedSv(null)}>
            <div className='bg-[#ECF9FF] -m-6 p-6 min-h-full'>
              <span>Thông tin sinh viên: </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2">
                <p><span className="font-semibold">Mã sinh viên:</span> {selectedSv.student_code}</p>
                <p><span className="font-semibold">Họ và tên:</span> {selectedSv.full_name}</p>
                <p><span className="font-semibold">Vị trí thực tập:</span> {selectedSv.position}</p>

                <p><span className="font-semibold">Lớp:</span> {selectedSv.class_name}</p>
                <p><span className="font-semibold">Trạng thái:</span> {selectedSv.status}</p>
                <p><span className="font-semibold">Trường:</span> Đại học Thủy Lợi</p>
              </div><br />

              <span>Preview báo cáo:</span>

              {selectedSv.latest_report ? (
                <div className="mt-2">
                  <a
                    href={selectedSv.latest_report}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    📄 Xem báo cáo thực tập mới nhất
                  </a>
                </div>
              ) : (
                <p className="text-gray-500 italic mt-2">Chưa nộp báo cáo</p>
              )} <br />

              <div className='flex gap-3 items-center'>
                <span className='font-bold p-1'>Điểm doanh nghiệp chấm: </span>
                <div className="flex-1">
                  <input
                    type="number"
                    step="0.25"
                    {...register("diem")}
                    className={`bg-[#DBF7E4] text-[#0FB245] w-full border p-1 h-[50px] ${errors.diem ? "border-red-500" : "border-gray-400"}`}
                  />
                  {errors.diem && <p className="text-red-500 text-xs mt-1">{errors.diem.message}</p>}
                </div>
              </div><br />

              <span className='font-bold'>Nhận xét chi tiết:</span>
              <div className='flex flex-col'>
                <textarea
                  {...register("comment")}
                  className={`flex-1 bg-[#FCFCFC] border p-1 h-[80px] ${errors.comment ? "border-red-500" : "border-gray-500"}`}
                />
                {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>}
              </div>

              <div className='flex gap-4 pt-4 justify-end'>
                <Button 
                  onClick={() => setSelectedSv(null)} 
                  disabled={isSubmitting}
                  className="bg-[#FF0000] hover:bg-[#cc0000] text-white w-[60px] h-9 p-0"
                >
                  Hủy
                </Button>
                <Button 
                  onClick={handleSubmit(handleSave)} 
                  disabled={isSubmitting}
                  className="bg-[#24AD47] hover:bg-[#1f933d] text-white w-[80px] h-9 p-0"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>

            </div>
          </Modal>
        )}
      </Card>
    </div>
  )
}

export default ManageInterns

