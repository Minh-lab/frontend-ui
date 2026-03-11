import Modal from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { sinhvienTT } from '@/data/businessData'
import React, { useState } from 'react'
import tlu from "../../assets/logo-tlu.png"
import { toast } from 'sonner'
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

const QuanLyThucTap = () => {
  const [selectedSv, setSelectedSv] = useState(null)

  return (
      <div className='p-6'>
        <Card className="bg-[#ECF9FF]">
          <span className = "text-center text-[25px] font-inter text-[#445298] font-bold">Chấm điểm và đánh giá</span>
          <div className='px-6'>
            <span className='font-inter'>Danh sách sinh viên đăng ký thực tập</span>
          </div>
          <Card className="mx-6 overflow-hidden p-0">
            <table className='text-x font-normal'>
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
                    Thời gian đăng ký
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
                  {sinhvienTT.map((sv) => (
                      <tr key = {sv.id} className='bg-white border-b border-gray-200 hover:bg-gray-50/50 transition'>
                        <td className='px-4 py-3  font-inter text-gray-700'>
                          {sv.id}
                        </td>
                        <td className='px-4 py-3  font-inter text-gray-700'>
                          {sv.maSV}
                        </td>
                        <td className='px-4 py-3  font-inter text-gray-700'>
                          {sv.hoTen}
                        </td>
                        <td className='px-4 py-3 font-inter text-gray-700'>
                          <span className='px-3 py-1 text-xs font-medium text-purple-600 bg-purple-100 border border-purple-300 rounded-full '>
                            {sv.vitri}
                          </span>
                        </td >
                        <td className='px-4 py-3 font-inter text-gray-700'>
                          {sv.thoigianDki}
                        </td>
                        <td className='px-4 py-3 font-inter text-gray-700'>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              sv.trangthai === "chua danh gia"
                                ? "bg-[#FFF2D2] text-[#DA5C02] border border-[#DA5C02]"
                                : "bg-[#BCFFC2] text-[#24AD47]border border-[#24AD47]"
                            }`}
                          >
                            {sv.trangthai}
                          </span>
                        </td>
                        <td className='px-4 py-3'>
                            <div className='flex gap-5'>
                              <Button onClick = {() => setSelectedSv(sv)} className="">
                                Xem chi tiết
                              </Button>
  
                              
                            </div>
                        </td>
                      </tr>
                  ))}
              </tbody>
            </table>
          </Card>
          {selectedSv  && (
            <Modal size = 'xl' className = "" title = {"Chấm điểm và đánh giá"} onClose={() => setSelectedSv(null)}>
                <div className='bg-[#ECF9FF] -m-6 p-6 min-h-full'>
                  <span>Thông tin sinh viên: </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2">
                    <p><span className="font-semibold">Mã sinh viên:</span> {selectedSv.maSV}</p>
                    <p><span className="font-semibold">Họ và tên:</span> {selectedSv.hoTen}</p>
                    <p><span className="font-semibold">Vị trí thực tập:</span> {selectedSv.vitri}</p>

                    <p><span className="font-semibold">Email:</span> {selectedSv.email}</p>
                    <p><span className="font-semibold">SDT:</span> {selectedSv.soDT}</p>
                    <p><span className="font-semibold">Trường:</span> Đại học Thủy Lợi</p>
                  </div><br />
          
                  <span>Preview báo cáo:</span>

                  <PreviewBaoCao /> <br />
                  
                  <div className='flex gap-3 items-center'>
                    <span className='font-bold p-1'>Điểm doanh nghiệp chấm: </span>
                    <input type="number" step= "0.25" className='bg-[#DBF7E4] text-[#0FB245] flex-1 border border-gray-400 p-1 h-[50px]'/>
                  </div><br />

                  <span className='font-bold'>Nhận xét chi tiết:</span>
                  <div className='flex'>
                    <textarea className='flex-1 bg-[#FCFCFC] border border-gray-500 p-1 h-[80px]'/>
                  </div>
                  
                    <div className='flex gap-4 pt-4 justify-end'>
                      <Button onClick = {() => setSelectedSv(null) } className="bg-[#FF0000] hover:bg-[#cc0000] text-white w-[60px] h-9 p-0">Hủy</Button>
                      <Button onClick = {() => {setSelectedSv(null); toast.success("Hành động của bạn đã được ghi nhận",{className: "!bg-[#AAFAB8] !text-[#24AD47]"})}} className="bg-[#24AD47] hover:bg-[#1f933d] text-white w-[80px] h-9 p-0">Lưu</Button>
                    </div>
                  
                </div>
            </Modal>
          )}
        </Card>
      </div>
    )
}

export default QuanLyThucTap
