import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { projectGradeData } from '@/data/lecturerData'
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

function ProjectStatusBadge({ status }) {
  const isGraded = status === 'da cham'

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${isGraded
          ? 'border-[#10b981] bg-[#dcfce7] text-[#10b981]'
          : 'border-[#93c5fd] bg-[#dbeafe] text-[#2563eb]'
        }`}
    >
      {isGraded ? 'Da cham' : 'Da duyet'}
    </span>
  )
}

function ProjectGradeDetail({ item, onBack, onSave }) {
  const isGraded = item.trangthai === 'da cham'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(gradeSchema),
    defaultValues: {
      score: item.diem ?? '',
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
        <h2 className="text-lg font-bold text-slate-800 md:text-xl">Chấm Báo cáo đồ án {item.id}</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
        <Card className="overflow-hidden border border-slate-200 bg-[#f6f0df] p-5">
          <div className="flex h-[620px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-center text-slate-500">
            <FileText className="mb-4 size-14 text-slate-500" />
            <p className="text-xl font-medium">Bản xem trước tài liệu PDF sẽ hiện thị tại đây</p>
            <p className="mt-2 text-sm">{item.fileName}</p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-800 md:text-xl">Thông tin Đồ án</h3>
              <ProjectStatusBadge status={item.trangthai} />
            </div>
            <div className="my-5 h-px bg-slate-200" />
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm text-slate-500">Sinh viên thực hiện:</p>
                <p className="text-base font-semibold text-slate-800 md:text-lg">
                  {item.hoTen} <span className="font-normal">({item.maSV})</span>
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-slate-500">Đề tài:</p>
                <p className="text-base leading-relaxed text-[#2563eb] md:text-lg">{item.tenDeTai}</p>
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
                      
                      className={`h-11 w-32 text-center ${errors.score ? 'border-red-500' : ''}`}
                    />
                    <span className="text-sm text-slate-500 md:text-base">/10</span>
                  </div>
                  {errors.score && <p className="text-xs text-red-500">{errors.score.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 md:text-base">
                  Nhận xét chi tiết của phản biện
                </label>
                <textarea
                  {...register('comment')}
                  
                  className={`min-h-[140px] w-full rounded-xl border ${errors.comment ? 'border-red-500' : 'border-slate-300'} p-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100`}
                  placeholder="Ghi chu cac diem manh, diem yeu va cau hoi goi y cho hoi dong..."
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

function ProjectGradeList({ items, onGrade, onView }) {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return items

    return items.filter(
      (item) =>
        item.maSV.toLowerCase().includes(keyword) ||
        item.hoTen.toLowerCase().includes(keyword) ||
        item.tenDeTai.toLowerCase().includes(keyword)
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
        <h2 className="text-center text-2xl font-bold text-slate-800 md:text-3xl">CHẤM ĐIỂM ĐỒ ÁN</h2>

        <div className="mt-6">
          <span className="inline-flex rounded-full border border-[#8b5cf6] bg-[#eef2ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
            Đang hướng dẫn: 11/20
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="pl-9"
              placeholder="Tim theo MSV, ten, de tai"
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
                <TableHead>Tên đề tài</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Điểm</TableHead>
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
                    <TableCell className="max-w-[280px] truncate">{item.tenDeTai}</TableCell>
                    <TableCell>
                      <ProjectStatusBadge status={item.trangthai} />
                    </TableCell>
                    <TableCell>{item.diem === '' ? '' : item.diem}</TableCell>
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

const ProjectGrade = () => {
  const [projects, setProjects] = useState(projectGradeData)
  const [selectedProject, setSelectedProject] = useState(null)

  const handleSaveGrade = (projectId, score, comment) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
            ...project,
            diem: score,
            nhanXet: comment,
            trangthai: 'da cham',
          }
          : project
      )
    )

    setSelectedProject((prevSelected) =>
      prevSelected
        ? {
          ...prevSelected,
          diem: score,
          nhanXet: comment,
          trangthai: 'da cham',
        }
        : null
    )

    toast.success('Cham diem do an thanh cong', {
      className: '!bg-[#dcfce7] !text-[#047857]',
    })

    setSelectedProject(null)
  }

  const handleOpenProject = (project) => {
    setSelectedProject(project)
  }

  return selectedProject ? (
    <ProjectGradeDetail
      item={selectedProject}
      onBack={() => setSelectedProject(null)}
      onSave={handleSaveGrade}
    />
  ) : (
    <ProjectGradeList
      items={projects}
      onGrade={handleOpenProject}
      onView={handleOpenProject}
    />
  )
}

export default ProjectGrade
