import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { visibleTaskLimit } from '@/lib/data';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronLeft, ChevronRight, FileText, Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';
import lecturerApi from '@/services/lecturerApi';

const reportSchema = yup.object({
    comment: yup.string().required('Vui long nhap nhan xet'),
});

const statusLabelMap = {
    PENDING: 'chua duyet',
    STATUS_PENDING: 'chua duyet',
    APPROVED: 'da duyet',
    REJECTED: 'tu choi',
};

const mapReport = (item) => ({
    id: item.report_id,
    maSV: item.student_code ?? 'N/A',
    hoTen: item.student_name ?? 'N/A',
    position: item.position ?? 'N/A',
    company_name: item.company_name ?? 'N/A',
    giaiDoan: item.phase_name ?? 'N/A',
    moTa: item.description ?? '',
    fileUrl: item.file_preview_url ?? null,
    trangthai: statusLabelMap[item.status] ?? (item.status || 'PENDING').toLowerCase(),
    nhanXet: item.lecturer_feedback ?? '',
});

function ReviewPanel({ item, onBack, onApprove, onReject, submitting }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(reportSchema),
        defaultValues: { comment: item.nhanXet ?? '' },
    });

    return (
        <div>
            <div className="flex items-center justify-center gap-2">
                <Button onClick={onBack} variant="ghost" className="border border-gray-200">
                    <ChevronLeft />
                    Quay lại
                </Button>
                <span className="text-lg font-bold">Báo cáo thực tập</span>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Card className="overflow-hidden border border-slate-200 bg-[#f6f0df] p-5 lg:w-2/3">
                    <div className="flex h-[600px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-center text-slate-500">
                        <FileText className="mb-4 size-14 text-slate-300" />
                        {item.fileUrl ? (
                            <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 underline">
                                Mở file báo cáo
                            </a>
                        ) : (
                            <p className="text-lg font-medium">Chưa có file preview</p>
                        )}
                    </div>
                </Card>

                <div className="flex flex-1 flex-col gap-4">
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sinh viên thực hiện</span>
                                <p className="text-[15px] font-bold text-slate-800">{item.hoTen}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Công ty</span>
                                <p className="text-[15px] font-bold text-[#2563eb]">{item.company_name}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vị trí đăng ký</span>
                                <p className="text-[15px] font-bold text-[#2563eb]">{item.position}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Giai đoạn</span>
                                <p className="text-[15px] font-bold text-slate-800">{item.giaiDoan}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mô tả</span>
                                <p className="text-sm text-slate-600">{item.moTa || 'Không có mô tả'}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Nhận xét <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    {...register('comment')}
                                    className={`min-h-[150px] w-full resize-none rounded-xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 ${errors.comment ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="Nhap noi dung nhan xet..."
                                />
                                {errors.comment && <p className="mt-1 text-xs text-red-500">{errors.comment.message}</p>}
                            </div>
                            <div className="flex gap-4 pt-2">
                                <Button
                                    type="button"
                                    disabled={submitting}
                                    onClick={handleSubmit((data) => onReject(item.id, data.comment))}
                                    className="flex-1 rounded-xl border border-red-200 bg-white text-red-500 hover:bg-red-50"
                                >
                                    {submitting ? 'Dang xu ly...' : 'Tu choi'}
                                </Button>
                                <Button
                                    type="button"
                                    disabled={submitting}
                                    onClick={handleSubmit((data) => onApprove(item.id, data.comment))}
                                    className="flex-1 rounded-xl bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
                                >
                                    {submitting ? 'Dang xu ly...' : 'Duyet'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ReportTable({ report, loading, onSelect }) {
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [statusKeyword, setStatusKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredReports = useMemo(() => {
        return report.filter((item) => {
            const matchesKeyword =
                !searchTerm ||
                item.maSV.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.hoTen.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = !statusFilter || item.trangthai === statusFilter;
            return matchesKeyword && matchesStatus;
        });
    }, [report, searchTerm, statusFilter]);

    const visibleTask = filteredReports.slice((page - 1) * visibleTaskLimit, page * visibleTaskLimit);
    const totalPages = Math.max(1, Math.ceil(filteredReports.length / visibleTaskLimit));
    const pageItems = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    return (
        <Card className="bg-[#ffffff]">
            <div className="p-3">
                <span>QUẢN LÝ BÁO CÁO THỰC TẬP</span>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input className="pl-9" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
                    </div>
                    <div className="flex-1">
                        <select
                            value={statusKeyword}
                            onChange={(event) => setStatusKeyword(event.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none"
                        >
                            <option value="">Trạng thái</option>
                            <option value="chua duyet">Chưa duyệt</option>
                            <option value="da duyet">Đã duyệt</option>
                            <option value="tu choi">Từ chối</option>
                        </select>
                    </div>
                    <Button
                        className="flex-1"
                        onClick={() => {
                            setSearchTerm(keyword);
                            setStatusFilter(statusKeyword);
                            setPage(1);
                        }}
                    >
                        Tìm kiếm
                    </Button>
                </div>

                <div className="pt-8">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>STT</TableHead>
                                <TableHead>MSV</TableHead>
                                <TableHead>Họ và tên</TableHead>
                                <TableHead>Vị trí đăng ký</TableHead>
                                <TableHead>Công ty</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Giai đoạn</TableHead>
                                <TableHead>Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-slate-500">
                                        Dang tai du lieu...
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && visibleTask.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{(page - 1) * visibleTaskLimit + index + 1}</TableCell>
                                    <TableCell>{item.maSV}</TableCell>
                                    <TableCell>{item.hoTen}</TableCell>
                                    <TableCell>{item.position}</TableCell>
                                    <TableCell>{item.company_name}</TableCell>
                                    <TableCell>{item.trangthai}</TableCell>
                                    <TableCell>{item.giaiDoan}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => onSelect(item)}>
                                                Duyệt
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => onSelect(item)}>
                                                Xem chi tiết
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && visibleTask.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-slate-500">
                                        Không có báo cáo nào
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-between gap-2">
                        <Button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
                            <ChevronLeft className="size-4" />
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {pageItems.map((item) => (
                                <Button key={item} size="sm" variant={item === page ? 'default' : 'ghost'} onClick={() => setPage(item)} className="h-8 min-w-8 px-2">
                                    {item}
                                </Button>
                            ))}
                        </div>
                        <Button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages}>
                            Next
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default function InternReportsApi() {
    const [selectedReport, setSelectedReport] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const response = await lecturerApi.getPendingInternReports();
                setReports((Array.isArray(response?.data) ? response.data : []).map(mapReport));
            } catch (error) {
                toast.error(error?.message || 'Khong the tai danh sach bao cao');
                setReports([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleApprove = async (reportId, comment) => {
        try {
            setSubmitting(true);
            await lecturerApi.reviewInternReport(reportId, { status: 'APPROVED', feedback: comment });
            setReports((prev) => prev.filter((report) => report.id !== reportId));
            toast.success('Da duyet bao cao thuc tap');
            setSelectedReport(null);
        } catch (error) {
            toast.error(error?.message || 'Khong the duyet bao cao');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async (reportId, comment) => {
        try {
            setSubmitting(true);
            await lecturerApi.reviewInternReport(reportId, { status: 'REJECTED', feedback: comment });
            setReports((prev) => prev.filter((report) => report.id !== reportId));
            toast.error('Da tu choi bao cao thuc tap');
            setSelectedReport(null);
        } catch (error) {
            toast.error(error?.message || 'Khong the tu choi bao cao');
        } finally {
            setSubmitting(false);
        }
    };

    return selectedReport ? (
        <ReviewPanel
            item={selectedReport}
            onBack={() => setSelectedReport(null)}
            onApprove={handleApprove}
            onReject={handleReject}
            submitting={submitting}
        />
    ) : (
        <ReportTable report={reports} loading={loading} onSelect={setSelectedReport} />
    );
}
