import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { projectGradeData } from '@/data/lecturerData'
import { visibleTaskLimit } from '@/lib/data'
import { ChevronLeft, ChevronRight, FileText, Search } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

function ProjectStatusBadge({ status }) {
  const isGraded = status === 'da cham'

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
        isGraded
          ? 'border-[#10b981] bg-[#dcfce7] text-[#10b981]'
          : 'border-[#93c5fd] bg-[#dbeafe] text-[#2563eb]'
      }`}
    >
      {isGraded ? 'Da cham' : 'Da duyet'}
    </span>
  )
}

function ProjectGradeDetail({ item, onBack, onSave }) {
  const [score, setScore] = useState(item.diem?.toString() ?? '')
  const [comment, setComment] = useState(item.nhanXet ?? '')
  const isGraded = item.trangthai === 'da cham'

  const handleSubmit = () => {
    const numericScore = Number(score)

    if (score === '' || Number.isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
      toast.error('Vui long nhap diem tu 0 den 10')
      return
    }

    onSave(item.id, numericScore, comment)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onBack} variant="ghost" className="border border-gray-200">
          <ChevronLeft className="size-4" />
          Quay lai
        </Button>
        <h2 className="text-lg font-bold text-slate-800 md:text-xl">Cham Bao cao do an {item.id}</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
        <Card className="overflow-hidden border border-slate-200 bg-[#f6f0df] p-5">
          <div className="flex h-[620px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-center text-slate-500">
            <FileText className="mb-4 size-14 text-slate-500" />
            <p className="text-xl font-medium">Ban xem truoc tai lieu PDF se hien thi tai day</p>
            <p className="mt-2 text-sm">{item.fileName}</p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-800 md:text-xl">Thong tin Do an</h3>
              <ProjectStatusBadge status={item.trangthai} />
            </div>
            <div className="my-5 h-px bg-slate-200" />
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm text-slate-500">Sinh vien thuc hien:</p>
                <p className="text-base font-semibold text-slate-800 md:text-lg">
                  {item.hoTen} <span className="font-normal">({item.maSV})</span>
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-slate-500">De tai:</p>
                <p className="text-base leading-relaxed text-[#2563eb] md:text-lg">{item.tenDeTai}</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 md:text-xl">Ket qua danh gia</h3>
            <div className="mt-6 space-y-5">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <label className="text-sm font-semibold text-slate-700 md:text-base">Diem tong</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={score}
                    disabled={isGraded}
                    onChange={(event) => setScore(event.target.value)}
                    className="h-11 w-32 text-center"
                  />
                  <span className="text-sm text-slate-500 md:text-base">/10</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 md:text-base">
                  Nhan xet chi tiet cua phan bien
                </label>
                <textarea
                  value={comment}
                  disabled={isGraded}
                  onChange={(event) => setComment(event.target.value)}
                  className="min-h-[140px] w-full rounded-xl border border-slate-300 p-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                  placeholder="Ghi chu cac diem manh, diem yeu va cau hoi goi y cho hoi dong..."
                />
              </div>

              <div className="border-t border-slate-200 pt-5 text-right">
                <Button
                  onClick={handleSubmit}
                  disabled={isGraded}
                  className="h-11 rounded-xl bg-[#10b981] px-6 text-white hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Hoan tat cham diem
                </Button>
              </div>
            </div>
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
        <h2 className="text-center text-2xl font-bold text-slate-800 md:text-3xl">CHAM DIEM DO AN</h2>

        <div className="mt-6">
          <span className="inline-flex rounded-full border border-[#8b5cf6] bg-[#eef2ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
            Dang huong dan: 11/20
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
            Tim kiem
          </Button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>MSV</TableHead>
                <TableHead>Ho va ten</TableHead>
                <TableHead>Ten de tai</TableHead>
                <TableHead>Trang thai</TableHead>
                <TableHead>Diem</TableHead>
                <TableHead>Hanh dong</TableHead>
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
                          disabled={isGraded}
                          className="rounded-full border-[#d8b4fe] bg-[#faf5ff] text-[#7c3aed] hover:bg-[#f3e8ff] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cham diem
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onView(item)}
                          disabled={!isGraded}
                          className="rounded-full border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Xem chi tiet
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
