import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'
import { Users ,AlertCircle} from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
const HomePageBusiness = () => {
  const soSVthuctap = 20, soSVchuaNX = 5;
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-full bg-white flex justify-center items-start p-6">
        <div className='flex flex-col gap-4 pt-[30px] w-[500px]'>
         <Card className="bg-[#FCFCFC] shadow-md w-full p-4 cursor-pointer transition hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]">
           <button onClick={() => navigate("/company/confirm-intern")} className='flex gap-5 items-center text-left w-full'>
              <Users className="text-indigo-600 w-7 h-7"/>
              <div className='flex flex-col'>
                <span className='text-[20px] text-[#1C2F8E]'>Số sinh viên đang thực tập</span>
                <span className='text-[30px] text-[#1C2F8E]'>{soSVthuctap}</span>
              </div>
            </button>
          </Card>
          <Card className="bg-[#FFF2D2E3] shadow-md w-full p-4 cursor-pointer transition hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]">
            <button onClick={() => navigate("/company/manage-interns")} className='flex gap-5 items-center text-left w-full'>
              <AlertCircle className="text-indigo-600 w-7 h-7"/>
              <div className='flex flex-col'>
                <span className='text-[20px] text-[#DA5C02]'>Số sinh viên chưa được đánh giá</span>
                <span className='text-[30px] text-[#DA5C02]'>{soSVchuaNX}</span>
              </div>
            </button>
          </Card>
        </div>
    </div>
  )
}

export default HomePageBusiness
