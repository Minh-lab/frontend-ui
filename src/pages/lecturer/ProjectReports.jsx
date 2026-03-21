import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { visibleTaskLimit } from '@/lib/data';
import lecturerApi from '@/services/lecturerApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronLeft, ChevronRight, FileText, Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

const reportSchema = yup.object({
    comment: yup.string().required('Vui long nhap nhan xet'),
});

const statusLabelMap = {
    PENDING: 'chua duyet',
    APPROVED: 'da duyet',
    REJECTED: 'tu choi',
};

const mapReport = (item) => ({
    id: item.report_id,
    maSV: item.student_code ?? 'N/A',
    hoTen: item.student_name ?? 'N/A',
    tenDeTai: item.topic_title ?? 'N/A',
    dotBaoCao: item.phase_name ?? 'N/A',
    ngayNop: item.submission_date ?? '',
    nhanXet: item.lecturer_feedback ?? '',
    fileUrl: item.file_preview_url ?? null,
    trangthai: statusLabelMap[item.status] ?? 'chua duyet',
});

function ReviewPanel({ item, onBack, onApprove, onReject, submitting }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(reportSchema),
        defaultValues: {
            comment: item.nhanXet ?? '',
        },
    });

    return (
        <div>
            <div className="flex items-center justify-center gap-2">
                <Button onClick={onBack} variant="ghost" className="border border-gray-200">
                    <ChevronLeft />
                    Quay lai
                </Button>
                <span className="text-lg font-bold">Bao cao do an</span>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Card className="overflow-hidden border border-slate-200 bg-[#f7f2ff] p-5 lg:w-2/3">
                    <div className="flex h-[600px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-center text-slate-500">
                        <FileText className="mb-4 size-14 text-slate-300" />
                        {item.fileUrl ? (
                            <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 underline">
                                Mo file bao cao
                            </a>
                        ) : (
                            <p className="text-lg font-medium">Chua co file preview</p>
                        )}
                    </div>
                </Card>

                <div className="flex flex-1 flex-col gap-4">
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sinh vien thuc hien</span>
                                <p className="text-[15px] font-bold text-slate-800">
                                    {item.hoTen} - {item.maSV}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ten de tai</span>
                                <p className="text-[15px] font-bold text-[#2563eb]">{item.tenDeTai}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dot bao cao</span>
                                <p className="text-[15px] font-bold text-slate-800">{item.dotBaoCao}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ngay nop</span>
                                <p className="text-sm text-slate-600">{item.ngayNop || 'N/A'}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Nhan xet <span className="text-red-500">*</span>
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

function ReportTable({ reports, loading, onSelect }) {
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [statusKeyword, setStatusKeyword] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredReports = useMemo(() => {
        return reports.filter((item) => {
            const matchesKeyword =
                !searchTerm ||
                item.maSV.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tenDeTai.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = !statusFilter || item.trangthai === statusFilter;
            return matchesKeyword && matchesStatus;
        });
    }, [reports, searchTerm, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredReports.length / visibleTaskLimit));
    const currentPage = Math.min(page, totalPages);
    const visibleReports = filteredReports.slice((currentPage - 1) * visibleTaskLimit, currentPage * visibleTaskLimit);
    const pageItems = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    return (
        <Card className="bg-[#ffffff]">
            <div className="p-5">
                <h2 className="text-center text-xl font-bold text-slate-800 md:text-2xl">QUAN LY BAO CAO DO AN</h2>

                <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                    <div className="relative lg:w-[320px]">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            className="pl-9"
                            placeholder="Tim theo ma SV, ten SV, ten de tai"
                        />
                    </div>

                    <select
                        value={statusKeyword}
                        onChange={(event) => setStatusKeyword(event.target.value)}
                        className="h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20 lg:w-[180px]"
                    >
                        <option value="">Trang thai</option>
                        <option value="chua duyet">Chua duyet</option>
                        <option value="da duyet">Da duyet</option>
                        <option value="tu choi">Tu choi</option>
                    </select>

                    <Button
                        onClick={() => {
                            setSearchTerm(keyword);
                            setStatusFilter(statusKeyword);
                            setPage(1);
                        }}
                        className="lg:w-[110px]"
                    >
                        Tim kiem
                    </Button>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>STT</TableHead>
                                <TableHead>MSV</TableHead>
                                <TableHead>Ho va ten</TableHead>
                                <TableHead>Ten de tai</TableHead>
                                <TableHead>Dot bao cao</TableHead>
                                <TableHead>Trang thai</TableHead>
                                <TableHead>Hanh dong</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-slate-500">
                                        Dang tai du lieu...
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && visibleReports.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{(currentPage - 1) * visibleTaskLimit + index + 1}</TableCell>
                                    <TableCell>{item.maSV}</TableCell>
                                    <TableCell className="font-medium text-slate-800">{item.hoTen}</TableCell>
                                    <TableCell className="max-w-[260px] truncate">{item.tenDeTai}</TableCell>
                                    <TableCell>{item.dotBaoCao}</TableCell>
                                    <TableCell>{item.trangthai}</TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="outline" onClick={() => onSelect(item)}>
                                            Xem chi tiet
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && visibleReports.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-slate-500">
                                        Khong co bao cao nao cho duyet
                                    </TableCell>
                                </TableRow>
                            )}
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
    );
}

export default function ProjectReportsApi() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const response = await lecturerApi.getPendingCapstoneReports();
                setReports((Array.isArray(response?.data) ? response.data : []).map(mapReport));
            } catch (error) {
                toast.error(error?.message || 'Khong the tai danh sach bao cao do an');
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
            await lecturerApi.reviewCapstoneReport(reportId, { status: 'APPROVED', feedback: comment });
            setReports((prev) => prev.filter((report) => report.id !== reportId));
            toast.success('Da duyet bao cao do an');
            setSelectedReport(null);
        } catch (error) {
            toast.error(error?.message || 'Khong the duyet bao cao do an');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async (reportId, comment) => {
        try {
            setSubmitting(true);
            await lecturerApi.reviewCapstoneReport(reportId, { status: 'REJECTED', feedback: comment });
            setReports((prev) => prev.filter((report) => report.id !== reportId));
            toast.error('Da tu choi bao cao do an');
            setSelectedReport(null);
        } catch (error) {
            toast.error(error?.message || 'Khong the tu choi bao cao do an');
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
        <ReportTable reports={reports} loading={loading} onSelect={setSelectedReport} />
    );
}
