import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'
import { Users ,AlertCircle} from 'lucide-react';
import React from 'react'

const HomePageBusiness = () => {
  const soSVthuctap = 20, soSVchuaNX = 5;

  return (
    <div className="w-full min-h-full bg-white flex justify-center items-start p-6">
        <div className='flex flex-col gap-4 pt-[30px] w-[500px]'>
         <Card className="bg-[#FCFCFC] shadow-md w-full p-4 cursor-pointer transition hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]">
           <button className='flex gap-5 items-center text-left w-full'>
              <Users className="text-indigo-600 w-7 h-7"/>
              <div className='flex flex-col'>
                <span className='text-[20px]'>So sinh vien tham gia thuc tap</span>
                <span className='text-[30px]'>{soSVthuctap}</span>
              </div>
            </button>
          </Card>
          <Card className="bg-[#FFF2D2E3] shadow-md w-full p-4 cursor-pointer transition hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]">
            <div className='flex gap-5 items-center'>
              <AlertCircle className="text-indigo-600 w-7 h-7"/>
              <div className='flex flex-col'>
                <span className='text-[20px]'>So sinh vien chua duoc danh gia</span>
                <span className='text-[30px]'>{soSVchuaNX}</span>
              </div>
            </div>
          </Card>
        </div>
    </div>
  )
}

export default HomePageBusiness
