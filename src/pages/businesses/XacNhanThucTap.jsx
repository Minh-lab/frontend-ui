import { Card } from '@/components/ui/card'
import { sinhvienTT } from '../../data/businessData'
import React from 'react'
import { Button } from '@/components/ui/button'


const XacNhanThucTap = () => {
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
                      <td className='px-4 py-3'>
                          <div className='flex gap-5'>
                            <Button className="bg-[#24AD47] hover:bg-[#1f933d] text-white w-9 h-9 p-0">
                              ✔
                            </Button>

                            <Button className="bg-[#FF0000] hover:bg-[#cc0000] text-white w-9 h-9 p-0">
                              ✕
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

export default XacNhanThucTap
