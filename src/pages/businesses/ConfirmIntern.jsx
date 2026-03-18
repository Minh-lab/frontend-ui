import { Card } from '@/components/ui/card'
import { sinhvienTT } from '../../data/businessData'
import React from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import internCompany from '@/services/company/intern'


const ConfirmIntern = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWaitingList = async () => {
    setLoading(true);
    try {
      const response = await internCompany.waitingListIntern();
      setWaitingList(response.data);
    } catch (error) {
      console.error("Error fetching waiting list:", error);
      toast.error(error.message || "Lỗi tải danh sách chờ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitingList();
  }, []);

  const handleConfirm = async (id, status) => {
    try {
      await internCompany.confirmIntern(id, status);
      toast.success(status === 'ACCEPT' ? "Đã tiếp nhận sinh viên" : "Đã từ chối sinh viên", {
        className: status === 'ACCEPT' ? "!bg-[#AAFAB8] !text-[#24AD47]" : "!bg-[#FFF2D2] !text-[#DA5C02]"
      });
      fetchWaitingList();
    } catch (error) {
      console.error("Error confirming student:", error);
      toast.error(error.message || "Lỗi khi xử lý xác nhận");
    }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <div className='p-6'>
      <Card className="bg-[#ECF9FF]">
        <span className="text-center text-[25px] font-inter text-[#445298] font-bold">Xác nhận thực tập</span>
        <div className='px-6'>
          <span className='font-inter'>Danh sách sinh viên đăng ký thực tập</span>
        </div>
        <Card className="mx-6 overflow-x-auto p-0 mb-6">
          <table className='w-full border-collapse text-x font-normal'>
            <thead >
              <tr className='bg-gray-50 border-b border-gray-200'>
                <th className="px-4 py-2.5 text-left font-normal font-inter text-gray-600">
                  STT
                </th >
                <th className="px-4 py-2.5 text-left font-normal font-inter text-gray-600">
                  MSV
                </th>
                <th className="px-4 py-2.5 text-left font-normal font-inter text-gray-600">
                  Họ và tên
                </th>
                <th className="px-4 py-2.5 text-left font-normal font-inter text-gray-600">
                  Vị trí đăng ký
                </th>
                <th className="px-4 py-2.5 text-left font-normal font-inter text-gray-600">
                  Thời gian đăng ký
                </th>
                <th className="px-4 py-2.5 text-left font-normal font-inter text-gray-600">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {waitingList?.length > 0 ? (
                waitingList.map((sv, index) => (
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
                        {sv?.position || 'N/A'}
                      </span>
                    </td >
                    <td className='px-4 py-3 font-inter text-gray-700'>
                      {sv?.created_at}
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex gap-3'>
                        <Button 
                          onClick={() => handleConfirm(sv.internship_id, 'ACCEPT')} 
                          className="bg-[#24AD47] hover:bg-[#1f933d] text-white w-9 h-9 p-0 rounded-lg shadow-sm"
                          title="Chấp nhận"
                        >
                          ✔
                        </Button>

                        <Button 
                          onClick={() => handleConfirm(sv.internship_id, 'REJECT')} 
                          className="bg-[#FF0000] hover:bg-[#cc0000] text-white w-9 h-9 p-0 rounded-lg shadow-sm"
                          title="Từ chối"
                        >
                          ✕
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500 italic bg-white">
                    Không có sinh viên nào đang chờ xác nhận.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </Card>
    </div>
  );
}

export default ConfirmIntern
