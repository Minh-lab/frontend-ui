/* eslint-disable no-unused-vars */
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { internGradeData } from '@/data/lecturerData'
import { visibleTaskLimit } from '@/lib/data'
import { ChevronLeft, ChevronRight, FileText, Search } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const gradeSchema = yup.object().shape({
  score: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError('Vui lòng nhập điểm là số')
    .required('Vui lòng nhập điểm')
    .min(0, 'Điểm không được nhỏ hơn 0')
    .max(10, 'Điểm không được lớn hơn 10'),
  comment: yup.string().required('Vui lòng nhập nhận xét'),
})

function InternStatusBadge({ status }) {
  const isGraded = status === 'da cham'
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
        isGraded
          ? 'border-[#10b981] bg-[#dcfce7] text-[#10b981]'
          : 'border-[#d8b4fe] bg-[#faf5ff] text-[#7c3aed]'
      }`}
    >
      {isGraded ? 'Đã chấm' : 'Chưa chấm'}
    </span>
  )
}

function PositionBadge({ position }) {
  return (
    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
      {position}
    </span>
  )
}

function InternGradeDetail({ item, onBack, onSave }) {
  const isGraded = item.trangthai === 'da cham'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(gradeSchema),
    defaultValues: {
      score: item.diemThi ?? '',
      comment: item.nhanXet ?? '',
    },
  })

  const onSubmit = (data) => {
    onSave(item.id, data.score, data.comment)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onBack} variant="ghost" className="border border-gray-200">
          <ChevronLeft className="size-4" />
          Quay lại
        </Button>
        <h2 className="text-lg font-bold text-slate-800 md:text-xl">Báo cáo thực tập</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
        <Card className="overflow-hidden border border-slate-200 bg-[#f6f0df] p-4">
          <div className="flex h-[620px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-center text-slate-500">
            <FileText className="mb-4 size-14 text-slate-500" />
            <p className="text-base font-medium md:text-lg">Bản xem trước tài liệu PDF sẽ hiện thị tại đây</p>
            <p className="mt-2 text-sm">{item.fileName}</p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-800 md:text-xl">Thông tin Báo cáo thực tập</h3>
              <InternStatusBadge status={item.trangthai} />
            </div>
            <div className="my-4 h-px bg-slate-200" />
            <div className="space-y-4 text-sm">
              <div>
                <p className="mb-1 text-slate-500">Sinh viên thực hiện:</p>
                <p className="text-base font-semibold text-slate-800">
                  {item.hoTen} <span className="font-normal">({item.maSV})</span>
                </p>
              </div>
              <div>
                <p className="mb-1 text-slate-500">Công ty:</p>
                <p className="font-medium text-[#2563eb]">{item.congty}</p>
              </div>
              <div>
                <p className="mb-1 text-slate-500">Vị trí đăng ký</p>
                <div>
                  <PositionBadge position={item.vitri} />
                </div>
              </div>
              <div>
                <p className="mb-1 text-slate-500">Điểm quá trình</p>
                <p className="font-medium text-slate-800">
                  {item.diemQuaTrinh === '' ? '--' : item.diemQuaTrinh}
                </p>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 md:text-xl">Kết quả đánh giá</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <label className="text-sm font-semibold text-slate-700 md:text-base">Điểm tổng</label>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Input
                      {...register('score')}
                      type="number"
                      step="0.1"
                      
                      className={`h-10 w-28 text-center ${errors.score ? 'border-red-500' : ''}`}
                    />
                    <span className="text-sm text-slate-500">/10</span>
                  </div>
                  {errors.score && <p className="text-xs text-red-500">{errors.score.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Nhận xét</label>
                <textarea
                  {...register('comment')}
                  
                  className={`min-h-[140px] w-full rounded-xl border ${errors.comment ? 'border-red-500' : 'border-slate-300'} p-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100`}
                  placeholder="Nhap nhan xet chi tiet..."
                />
                {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment.message}</p>}
              </div>

              <div className="border-t border-slate-200 pt-5 text-right">
                <Button
                  type="submit"
                  
                  className="h-11 rounded-xl bg-[#10b981] px-6 text-white hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Hoàn tất chấm điểm
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InternGradeList({ items, onGrade, onView }) {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = useMemo(() => {
    const normalizedKeyword = searchTerm.trim().toLowerCase()
    if (!normalizedKeyword) return items

    return items.filter(
      (item) =>
        item.maSV.toLowerCase().includes(normalizedKeyword) ||
        item.hoTen.toLowerCase().includes(normalizedKeyword) ||
        item.vitri.toLowerCase().includes(normalizedKeyword) ||
        item.congty.toLowerCase().includes(normalizedKeyword)
    )
  }, [items, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / visibleTaskLimit))
  const currentPage = Math.min(page, totalPages)
  const visibleItems = filteredItems.slice(
    (currentPage - 1) * visibleTaskLimit,
    currentPage * visibleTaskLimit
  )

  const pageItems = useMemo(() => {
    const pages = []
    for (let i = 1; i <= totalPages; i += 1) pages.push(i)
    return pages
  }, [totalPages])

  return (
    <Card className="bg-white">
      <div className="p-5">
        <h2 className="text-center text-2xl font-bold text-slate-800 md:text-3xl">CHẤM ĐIỂM THỰC TẬP</h2>

        <div className="mt-6">
          <span className="inline-flex rounded-full border border-[#8b5cf6] bg-[#eef2ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
            Đang hướng dẫn: 10/20
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="pl-9"
              placeholder="Tim theo MSV, ten, vi tri, cong ty"
            />
          </div>
          <Button
            onClick={() => {
              setSearchTerm(keyword)
              setPage(1)
            }}
            className="sm:w-fit"
          >
            Tìm kiếm
          </Button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>MSV</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Vị trí đăng ký</TableHead>
                <TableHead>Công ty</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Điểm quá trình</TableHead>
                <TableHead>Điểm thi</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleItems.map((item) => {
                const isGraded = item.trangthai === 'da cham'

                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.maSV}</TableCell>
                    <TableCell className="font-medium text-slate-800">{item.hoTen}</TableCell>
                    <TableCell>
                      <PositionBadge position={item.vitri} />
                    </TableCell>
                    <TableCell>{item.congty}</TableCell>
                    <TableCell>
                      <InternStatusBadge status={item.trangthai} />
                    </TableCell>
                    <TableCell>{item.diemQuaTrinh === '' ? '' : item.diemQuaTrinh}</TableCell>
                    <TableCell>{item.diemThi === '' ? '' : item.diemThi}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onGrade(item)}
                          
                          className="rounded-full border-[#d8b4fe] bg-[#faf5ff] text-[#7c3aed] hover:bg-[#f3e8ff] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Chấm điểm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onView(item)}
                          
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
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {pageItems.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={item === currentPage ? 'default' : 'ghost'}
                onClick={() => setPage(item)}
                className="h-9 min-w-9 px-2"
              >
                {item}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

const InterGrade = () => {
  const [interns, setInterns] = useState(internGradeData)
  const [selectedIntern, setSelectedIntern] = useState(null)

  const handleSaveGrade = (internId, score, comment) => {
    setInterns((prevInterns) =>
      prevInterns.map((intern) =>
        intern.id === internId
          ? {
            ...intern,
            diemThi: score,
            nhanXet: comment,
            trangthai: 'da cham',
          }
          : intern
      )
    )

    toast.success('Cham diem thuc tap thanh cong', {
      className: '!bg-[#dcfce7] !text-[#047857]',
    })

    setSelectedIntern(null)
  }

  const handleOpenIntern = (intern) => {
    setSelectedIntern(intern)
  }

  return selectedIntern ? (
    <InternGradeDetail
      item={selectedIntern}
      onBack={() => setSelectedIntern(null)}
      onSave={handleSaveGrade}
    />
  ) : (
    <InternGradeList
      items={interns}
      onGrade={handleOpenIntern}
      onView={handleOpenIntern}
    />
  )
}

export default InterGrade
