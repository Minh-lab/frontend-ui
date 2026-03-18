import StatusBadge from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { sinhvienTT } from '@/data/lecturerData'
import { ChevronLeft, ChevronRight, FileText, Search } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { visibleTaskLimit } from '@/lib/data'
import Modal from '@/components/Modal'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const reportSchema = yup.object().shape({
    comment: yup.string().required('Vui lòng nhập nhận xét'),
})


function PheDuyetBaoCao({ item, onBack, onApprove, onReject }) {
    const isGraded = item.trangthai === 'da duyet' || item.trangthai === 'tu choi'

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(reportSchema),
        defaultValues: {
            comment: item.nhanXet ?? "",
        }
    })

    const onApproveSubmit = (data) => {
        onApprove(item.id, data.comment)
    }

    const onRejectSubmit = (data) => {
        if (onReject) {
            onReject(item.id, data.comment)
        } else {
            toast.error('Chức năng từ chối chưa được cấu hình')
        }
    }

    return (
        <div>
            <div className='flex gap-2 items-center justify-center'>
                <Button onClick={onBack}
                    variant='ghost'
                    className="border border-gray-200">
                    <ChevronLeft></ChevronLeft>
                    Quay lại
                </Button>
                <span className="text-lg font-bold">Báo cáo thực tập</span>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                <Card className="overflow-hidden border border-slate-200 bg-[#f6f0df] p-5 lg:w-2/3">
                    <div className="flex h-[600px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-center text-slate-500">
                        <FileText className="mb-4 size-14 text-slate-300" />
                        <p className="text-lg font-medium">Bản xem trước tài liệu PDF sẽ hiện thị tại đây</p>
                    </div>
                </Card>
                <div className='flex flex-col gap-4 flex-1'>
                    <Card className="p-6">
                        <div className='flex flex-col gap-4'>
                            <div className='flex justify-between items-center'>
                                <span className="text-base font-bold text-slate-800">Thông tin báo cáo thực tập</span>
                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${item.trangthai === 'da duyet' ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]' : item.trangthai === 'tu choi' ? 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]' : 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]'}`}>
                                    {item.trangthai}
                                </span>
                            </div>
                            <div className="space-y-4 pt-2">
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sinh viên thực hiện</span>
                                    <p className="text-[15px] font-bold text-slate-800">{item.hoTen}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Công ty</span>
                                    <p className="text-[15px] font-bold text-[#2563eb]">{item.congty}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vị trí đăng ký</span>
                                    <p className="text-[15px] font-bold text-[#2563eb]">{item.vitri}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className='space-y-4'>
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-2">Nhận xét <span className="text-red-500">*</span></label>
                                <textarea
                                    {...register('comment')}
                                    
                                    className={`w-full border ${errors.comment ? 'border-red-500' : 'border-gray-200'} rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 focus:border-[#7c3aed] transition resize-none min-h-[150px]`}
                                    placeholder="Nhập nội dung nhận xét..."
                                ></textarea>
                                {errors.comment && <p className="text-xs text-red-500 mt-1 font-medium">{errors.comment.message}</p>}
                            </div>
                            <div className='flex gap-4 pt-2'>
                                <Button 
                                    type="button"
                                     
                                    onClick={handleSubmit(onRejectSubmit)} 
                                    className="flex-1 bg-white border border-red-200 text-red-500 hover:bg-red-50 font-bold rounded-xl"
                                >
                                    Từ chối
                                </Button>
                                <Button 
                                    type="button"
                                     
                                    onClick={handleSubmit(onApproveSubmit)}
                                    className="flex-1 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl shadow-md shadow-purple-100"
                                >
                                    Duyệt
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function BaoCaoThucTap({ onChon, report }) {
    const [page, setPage] = useState(1);
    const [show, setShow] = useState(false);
    const [keyword, setKeyword] = useState('')
    const [statusKeyword, setStatusKeyword] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [searchTerm, setSearchTerm] = useState('')



    const filteredReports = useMemo(() => {
        return report.filter((item) => {
            const matchesKeyword =
                !searchTerm ||
                item.maSV.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.hoTen.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = !statusFilter || item.trangthai === statusFilter

            return matchesKeyword && matchesStatus
        })
    }, [report, searchTerm, statusFilter,])
    const visibleTask = filteredReports.slice(
        (page - 1) * visibleTaskLimit,
        page * visibleTaskLimit
    );
    const totalPages = Math.ceil(filteredReports.length / visibleTaskLimit)
    const pageItems = useMemo(() => {
        const pages = [];
        for (let i = 1; i <= totalPages; i += 1) pages.push(i);
        return pages;
    }, [totalPages]);
    return (

        <Card className="bg-[#ffffff]">
            <div className='p-3'>
                <span>QUẢN LÝ BÁO CÁO THỰC TẬP</span>
                <div className='flex flex-col sm:flex-row gap-2'>
                    <div className='flex-2 relative'>
                        <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400' />
                        <Input
                            className="pl-9"
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                        />
                    </div>
                    <div className='flex-1'>
                        <select
                            value={statusKeyword}
                            onChange={(event) => setStatusKeyword(event.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20" name="" id="">
                            <option value="">Trạng thái</option>
                            <option value="chua duyet">Chưa duyệt</option>
                            <option value="da duyet">Đã duyệt</option>
                        </select>
                    </div>
                    <Button className='flex-1'
                        onClick={() => {
                            setSearchTerm(keyword)
                            setStatusFilter(statusKeyword)
                            setPage(1)
                        }}>
                        Tìm kiếm
                    </Button>
                </div>

                <div className='pt-8'>
                    <span className='bg-[#eef4ff] border border-[#4f46e5] text-[#6d28d9] rounded-xl'>Đang hướng dẫn: 10/20 </span>
                    <div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>STT</TableHead>
                                    <TableHead>MSV</TableHead>
                                    <TableHead>Họ và tên</TableHead>
                                    <TableHead>Vị trí đăng ký</TableHead>
                                    <TableHead>Công ty</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Điểm</TableHead>
                                    <TableHead>Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visibleTask.map((item, index) => {
                                    const isGraded = item.trangthai === 'da duyet'
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.maSV}</TableCell>
                                            <TableCell>{item.hoTen}</TableCell>
                                            <TableCell>{item.vitri}</TableCell>
                                            <TableCell>{item.congty}</TableCell>
                                            <TableCell>{item.trangthai}</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>
                                                <div className='flex gap-2'>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => onChon(item)}
                                                        
                                                        className="rounded-full border-[#d8b4fe] bg-[#faf5ff] text-[#7c3aed] hover:bg-[#f3e8ff] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Duyệt
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => onChon(item)}
                                                        
                                                        className="rounded-full border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Xem chi tiết
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                        {show && <PheDuyetBaoCao />}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <Button
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            disabled={page === 1}
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
                            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
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
    const [ttSV, setTtSV] = useState(null)
    const [reports, setReports] = useState(sinhvienTT)

    const handleApprove = (reportId, comment) => {
        setReports((prev) =>
            prev.map((report) =>
                report.id === reportId
                    ? { ...report, trangthai: "da duyet", nhanXet: comment }
                    : report
            )
        )

        toast.success('Đã duyệt báo cáo thực tập', {
            className: '!bg-[#dcfce7] !text-[#047857]',
        })

        setTtSV(null)
    }

    const handleReject = (reportId, comment) => {
        setReports((prev) =>
            prev.map((report) =>
                report.id === reportId
                    ? { ...report, trangthai: "tu choi", nhanXet: comment }
                    : report
            )
        )

        toast.error('Đã từ chối báo cáo thực tập', {
            className: '!bg-[#fef2f2] !text-[#991b1b]',
        })

        setTtSV(null)
    }

    return (
        <div>
            {ttSV ? (
                <PheDuyetBaoCao 
                    onApprove={handleApprove} 
                    onReject={handleReject}
                    item={ttSV} 
                    onBack={() => setTtSV(null)} 
                />
            ) : (
                <BaoCaoThucTap report={reports} onChon={(item) => setTtSV(item)} />
            )}
        </div>
    )
}

export default InternReports
