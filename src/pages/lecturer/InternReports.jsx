import StatusBadge from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { sinhvienTT } from '@/data/lecturerData'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { visibleTaskLimit } from '@/lib/data'
import Modal from '@/components/Modal'


function PheDuyetBaoCao({item,onBack}) {
    return (
        <div>
            <div className='flex gap-2 items-center justify-center'>
                <Button onClick = {onBack}
                variant='ghost'
                className="border border-gray-200">
                    <ChevronLeft></ChevronLeft>
                    Quay lai
                </Button>
                <span>Bao cao thuc tap</span>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 pt-3'>
                <Card className="flex-1 -p-1">
                    <div className='bg-[#fffbeb] border border-[#cbd5e1] h-full m-2 flex justify-center items-center'>
                        <span>Ban xem truoc du lieu</span>
                    </div>
                </Card>
                <div className='flex flex-col gap-3 flex-1 '>
                    <Card>
                        <div className='p-1'>
                            <div className='flex flex-col sm:flex-row gap-3 items-center'>
                                <span class="text-[16px] font-semibold leading-[25.6px]">Thong tin bao cao thuc tap</span>
                                <span className='bg-[#f9f5ff] border border-[#e9d7fe] text[#6941b6] rounded-xl p-1'>{item.trangthai}</span>
                            </div> <hr />
                            <div>
                                <span  class="text-sm text-slate-500">Sinh vien thuc hien</span> <br />
                                <span class="text-[16px] font-semibold leading-[25.6px]">{item.hoTen}</span><br /> <br />
                                <span  class="text-sm text-slate-500">Cong ty</span> <br />
                                <span>{item.congty}</span><br /> <br />
                                <span  class="text-sm text-slate-500">Vi tri dang ky</span> <br />
                                <span>{item.vitri}</span>
    
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className='flex flex-col sm:flex-row gap-3 items-center'>
                            <span class="text-[16px] font-semibold leading-[25.6px]">Thong tin bao cao thuc tap</span>
                            <span className='bg-[#f9f5ff] border border-[#e9d7fe] text[#6941b6] rounded-xl p-1'>{item.trangthai}</span>
                        </div> <hr />
                        <div>
                            <span  class="text-sm text-slate-500">Sinh vien thuc hien</span> <br />
                            <span class="text-[16px] font-semibold leading-[25.6px]">{item.hoTen}</span><br /> <br />
                            <span  class="text-sm text-slate-500">Cong ty</span> <br />
 
                        </div>
                    </Card  >
                </div>
            </div>
        </div>
    )
}

function BaoCaoThucTap({onChon}){
    const [page,setPage] = useState(1);  
  const [show, setShow] = useState(false);
  const visibleTask = sinhvienTT.slice(
    (page-1) * visibleTaskLimit,
    page * visibleTaskLimit
);
const totalPages = Math.ceil(sinhvienTT.length / visibleTaskLimit )
const pageItems = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    return pages;
  }, [totalPages]);



return (
    
    <Card className="bg-[#ffffff]">
        <div className='p-3'> 
            <span>QUAN LY BAO CAO THUC TAP</span>
            <div className='flex flex-col sm:flex-row gap-2'>
                <div className='flex-2 relative'>
                    <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400'/>
                    <Input className = "pl-9"/>
                </div>
                <div className='flex-1'>
                    <select className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20" name="" id="">
                        <option value="">Trang thai</option>
                        <option value="">Chua duyet</option>
                        <option value="">Da Duyet</option>
                    </select>
                </div>
                <div className='flex-1'>
                    <select className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20" name="" id="">
                        <option value="">Trang thai</option>
                        <option value="">Chua duyet</option>
                        <option value="">Da Duyet</option>
                    </select>
                </div>
                <Button className='flex-1'>
                    Tim kiem
                </Button>
            </div>
           
           <div className='pt-8'>
            <span className='bg-[#eef4ff] border border-[#4f46e5] text-[#6d28d9] rounded-xl'>Dang huong dan: 10/20 </span>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>STT</TableHead>
                            <TableHead>MSV</TableHead>
                            <TableHead>Họ va ten</TableHead>
                            <TableHead>Vi tri dang ky</TableHead>
                            <TableHead>Cong ty</TableHead>
                            <TableHead>Trang thai</TableHead>
                            <TableHead>Diem</TableHead>
                            <TableHead>Hanh dong</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visibleTask.map((item,index) => (
                            <TableRow key= {item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.maSV}</TableCell>
                                <TableCell>{item.hoTen}</TableCell>
                                <TableCell>{item.vitri}</TableCell>
                                <TableCell>{item.congty}</TableCell>
                                <TableCell>{item.trangthai}</TableCell>
                                <TableCell></TableCell>
                                <TableCell>
                                    <span
                                    onClick={() => onChon(item)}
                                    className="cursor-pointer bg-[#eef4ff] border border-[#c7d7fe] text-[#3538CD] rounded-xl p-1"  
                                    >
                                        xem chi tiet
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {show && <PheDuyetBaoCao />}
            </div>
            <div className="flex items-center justify-between gap-2">
                <Button
                onClick = {() => setPage((prev) => Math.max(1, prev - 1))}
                disabled = {page === 1}
                >
                    <ChevronLeft className="size-4" />
                    Previous
                </Button>
                <div className="flex items-center gap-1">
                    {pageItems.map((item) => (
                        <Button
                            key={item}
                            size="sm"
                            variant={item === page ? "default" : "ghost"}
                            onClick={() => setPage(item)}
                            className="h-8 min-w-8 px-2"
                        >
                            {item}
                        </Button>
                    ))}
                </div>
                <Button
                onClick = {() => setPage((prev) => Math.min(totalPages,prev + 1))}
                disabled = {page === totalPages}
                >
                    Next
                    <ChevronRight className="size-4" />
                </Button>
            </div>
           </div>

        </div>
    </Card>
  )
}

const InternReports = () => {
    const [ttSV,setTtSV] =useState(null)
    return(
        <div>
            {ttSV? <PheDuyetBaoCao item={ttSV} onBack={() => setIsShow(null)}/> : <BaoCaoThucTap onChon = {(item) => setTtSV(item)}/>} 
        </div>
    )
}

export default InternReports
