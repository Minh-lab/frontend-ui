import Modal from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { projectReportData } from '@/data/lecturerData'
import { visibleTaskLimit } from '@/lib/data'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'

function ReportStatusBadge({ status }) {
  const isApproved = status === 'da duyet'

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${isApproved
          ? 'border-[#93c5fd] bg-[#dbeafe] text-[#2563eb]'
          : 'border-[#d8b4fe] bg-[#faf5ff] text-[#7c3aed]'
        }`}
    >
      {isApproved ? 'Da duyet' : 'Chua duyet'}
    </span>
  )
}

function ReportDetailModal({ item, onClose, onApprove, onReject }) {
  const [comment, setComment] = useState(item.nhanXet ?? '')
  const isApproved = item.trangthai === 'da duyet'

  return (
    <Modal
      size="xl"
      title=""
      onClose={onClose}
      className="overflow-hidden p-0"
    >
      <div className="-m-6">
        <div className="flex items-center justify-between bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] px-5 py-3 text-white">
          <h2 className="text-sm font-bold uppercase tracking-wide">Xem chi tiết báo cáo đồ án</h2>
          <button type="button" onClick={onClose} className="rounded p-1 hover:bg-white/10">
            <X className="size-4" />
          </button>
        </div>

        <div className="grid min-h-[540px] gap-0 lg:grid-cols-[1.45fr_0.95fr]">
          <div className="bg-[#555a60] p-3 text-white">
            <p className="text-[11px] text-slate-200">{item.fileName}</p>
            <div className="mt-2 flex h-[430px] items-center justify-center rounded-sm bg-[#4b5056] text-sm italic text-slate-300">
              Preview
            </div>
          </div>

          <div className="bg-white p-4">
            <Card className="border-none bg-slate-50 shadow-none">
              <div className="space-y-2 p-4 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">Sinh viên:</span> {item.hoTen} - {item.maSV}
                </p>
                <p>
                  <span className="font-semibold">Đề tài:</span> {item.tenDeTai}
                </p>
                <p>
                  <span className="font-semibold">Ngày nộp:</span> {item.ngayNop}
                </p>
              </div>
            </Card>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-bold uppercase text-slate-500">
                Nhận xét chuyên môn
              </label>
              <textarea
                value={comment}
                disabled={isApproved}
                onChange={(event) => setComment(event.target.value)}
                className="min-h-[130px] w-full rounded-lg border border-slate-200 p-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="Nhap nhan xet chi tiet..."
              />
            </div>

            <div className="mt-5 flex gap-3">
              <Button
                variant="outline"
                onClick={() => onReject(item.id, comment)}
                disabled={isApproved}
                className="border-red-300 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Từ chối báo cáo
              </Button>
              <Button
                onClick={() => onApprove(item.id, comment)}
                disabled={isApproved}
                className="bg-[#7c3aed] text-white hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Duyệt
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const ProjectReports = () => {
  const [reports, setReports] = useState(projectReportData)
  const [selectedReport, setSelectedReport] = useState(null)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusKeyword, setStatusKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [topicKeyword, setTopicKeyword] = useState('')
  const [topicFilter, setTopicFilter] = useState('')

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const matchesKeyword =
        !searchTerm ||
        item.maSV.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hoTen.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !statusFilter || item.trangthai === statusFilter
      const matchesTopic = !topicFilter || item.tenDeTai.toLowerCase().includes(topicFilter.toLowerCase())

      return matchesKeyword && matchesStatus && matchesTopic
    })
  }, [reports, searchTerm, statusFilter, topicFilter])

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / visibleTaskLimit))
  const currentPage = Math.min(page, totalPages)
  const visibleReports = filteredReports.slice(
    (currentPage - 1) * visibleTaskLimit,
    currentPage * visibleTaskLimit
  )

  const pageItems = useMemo(() => {
    const pages = []
    for (let i = 1; i <= totalPages; i += 1) pages.push(i)
    return pages
  }, [totalPages])

  const handleApprove = (reportId, comment) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId
          ? { ...report, trangthai: 'da duyet', nhanXet: comment }
          : report
      )
    )
    toast.success('Da duyet bao cao do an', {
      className: '!bg-[#dcfce7] !text-[#047857]',
    })
    setSelectedReport(null)
  }

  const handleReject = (reportId, comment) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId
          ? { ...report, trangthai: 'chua duyet', nhanXet: comment }
          : report
      )
    )
    toast.error('Da tu choi bao cao do an', {
      className: '!bg-[#fee2e2] !text-[#b91c1c]',
    })
    setSelectedReport(null)
  }

  return (
    <Card className="bg-white">
      <div className="p-5">
        <h2 className="text-center text-xl font-bold text-slate-800 md:text-2xl">QUAN LY BAO CAO DO AN</h2>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row">
          <div className="relative lg:w-[320px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="pl-9"
              placeholder="Tim kiem theo ten sinh vien"
            />
          </div>

          <select
            value={statusKeyword}
            onChange={(event) => setStatusKeyword(event.target.value)}
            className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20 lg:w-[160px]"
          >
            <option value="">Trạng thái</option>
            <option value="chua duyet">Chưa duyệt</option>
            <option value="da duyet">Đã duyệt</option>
          </select>

          <select
            value={topicKeyword}
            onChange={(event) => setTopicKeyword(event.target.value)}
            className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20 lg:w-[160px]"
          >
            <option value="">Đợt</option>
            <option value="khuon mat">Ứng dụng AI nhận diện khuôn mặt</option>
            <option value="chay rung">Ứng dụng AI nhận diện cháy rừng</option>
          </select>

          <Button
            onClick={() => {
              setSearchTerm(keyword)
              setStatusFilter(statusKeyword)
              setTopicFilter(topicKeyword)
              setPage(1)
            }}
            className="lg:w-[110px]"
          >
            Tim kiem
          </Button>
        </div>

        <div className="mt-4">
          <span className="inline-flex rounded-full border border-[#8b5cf6] bg-[#eef2ff] px-4 py-1 text-xs font-medium text-[#6d28d9]">
            Đang hướng dẫn: 10/20
          </span>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>MSV</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Tên đề tài</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Điểm</TableHead>
                <TableHead>Hanh dong</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleReports.map((item) => {
                const isApproved = item.trangthai === 'da duyet'

                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.maSV}</TableCell>
                    <TableCell className="font-medium text-slate-800">{item.hoTen}</TableCell>
                    <TableCell className="max-w-[260px] truncate">{item.tenDeTai}</TableCell>
                    <TableCell>
                      <ReportStatusBadge status={item.trangthai} />
                    </TableCell>
                    <TableCell>{item.diem}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedReport(item)}
                          disabled={isApproved}
                          className="rounded-full border-[#d8b4fe] bg-[#faf5ff] text-[#7c3aed] hover:bg-[#f3e8ff] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedReport(item)}
                          disabled={!isApproved}
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

      {selectedReport && (
        <ReportDetailModal
          item={selectedReport}
          onClose={() => setSelectedReport(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </Card>
  )
}

export default ProjectReports
