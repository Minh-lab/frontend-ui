import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { sinhvienTT } from '@/data/businessData'
import React from 'react'

const QuanLyThucTap = () => {
  return (
      <div className='p-6'>
        <Card className="bg-[#ECF9FF]">
          <span className = "text-center text-[25px] font-inter text-[#445298] font-bold">Xác nhận thực tập</span>
          <div className='px-6'>
            <span className='font-inter'>Danh sách sinh viên đăng ký thực tập</span>
          </div>
          <Card className="mx-6 overflow-hidden p-0">
            <table className='text-x font-normal'>
              <thead >
                <tr className='bg-gray-50 border-b border-gray-100'>
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
                      <tr key = {sv.id} className='bg-white border-b border-gray-50 hover:bg-gray-50/50 transition'>
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
                                : "bg-[#BCFFC2] text-green-700 border border-[#24AD47]"
                            }`}
                          >
                            {sv.trangthai}
                          </span>
                        </td>
                        <td className='px-4 py-3'>
                            <div className='flex gap-5'>
                              <Button className="">
                                Xem chi tiết
                              </Button>
  
                              
                            </div>
                        </td>
                      </tr>
                  ))}
              </tbody>
            </table>
          </Card>
        </Card>
      </div>
    )
}

export default QuanLyThucTap
