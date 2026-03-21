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

const gradeSchema = yup.object({
    score: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .typeError('Vui long nhap diem la so')
        .required('Vui long nhap diem')
        .min(0, 'Diem khong duoc nho hon 0')
        .max(10, 'Diem khong duoc lon hon 10'),
    comment: yup.string().nullable(),
});

const statusLabel = (item) => (item.diemThi === '' || item.diemThi === null ? 'chua cham' : 'da cham');

const mapIntern = (item) => ({
    id: item.internship_id,
    maSV: item.student_code ?? 'N/A',
    hoTen: item.student_name ?? 'N/A',
    lop: item.class_name ?? 'N/A',
    diemQuaTrinh: item.company_grade ?? '',
    diemThi: item.university_grade ?? '',
    diemTong: item.final_grade ?? '',
    nhanXet: item.university_feedback ?? '',
    fileUrl: item.report_preview ? `http://localhost:8000/storage/${item.report_preview}` : null,
    trangthai: statusLabel({
        diemThi: item.university_grade,
    }),
    rawStatus: item.status,
});

function InternStatusBadge({ status }) {
    const isGraded = status === 'da cham';
    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                isGraded ? 'border-[#10b981] bg-[#dcfce7] text-[#10b981]' : 'border-[#d8b4fe] bg-[#faf5ff] text-[#7c3aed]'
            }`}
        >
            {isGraded ? 'Da cham' : 'Chua cham'}
        </span>
    );
}

function InternGradeDetail({ item, onBack, onSave, submitting }) {
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
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                <Button onClick={onBack} variant="ghost" className="border border-gray-200">
                    <ChevronLeft className="size-4" />
                    Quay lai
                </Button>
                <h2 className="text-lg font-bold text-slate-800 md:text-xl">Cham diem thuc tap</h2>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
                <Card className="overflow-hidden border border-slate-200 bg-[#f6f0df] p-4">
                    <div className="flex h-[620px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-center text-slate-500">
                        <FileText className="mb-4 size-14 text-slate-500" />
                        {item.fileUrl ? (
                            <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 underline">
                                Mo file bao cao
                            </a>
                        ) : (
                            <p className="text-base font-medium md:text-lg">Chua co file bao cao</p>
                        )}
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold text-slate-800 md:text-xl">Thong tin sinh vien</h3>
                            <InternStatusBadge status={item.trangthai} />
                        </div>
                        <div className="my-4 h-px bg-slate-200" />
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="mb-1 text-slate-500">Sinh vien thuc hien:</p>
                                <p className="text-base font-semibold text-slate-800">
                                    {item.hoTen} <span className="font-normal">({item.maSV})</span>
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-slate-500">Lop:</p>
                                <p className="font-medium text-slate-800">{item.lop}</p>
                            </div>
                            <div>
                                <p className="mb-1 text-slate-500">Diem qua trinh:</p>
                                <p className="font-medium text-slate-800">{item.diemQuaTrinh === '' ? '--' : item.diemQuaTrinh}</p>
                            </div>
                            <div>
                                <p className="mb-1 text-slate-500">Diem tong:</p>
                                <p className="font-medium text-slate-800">{item.diemTong === '' ? '--' : item.diemTong}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 md:text-xl">Ket qua danh gia</h3>
                        <form onSubmit={handleSubmit((data) => onSave(item.id, data.score, data.comment))} className="mt-6 space-y-5">
                            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                <label className="text-sm font-semibold text-slate-700 md:text-base">Diem tong</label>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <Input {...register('score')} type="number" step="0.1" className={`h-10 w-28 text-center ${errors.score ? 'border-red-500' : ''}`} />
                                        <span className="text-sm text-slate-500">/10</span>
                                    </div>
                                    {errors.score && <p className="text-xs text-red-500">{errors.score.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Nhan xet</label>
                                <textarea
                                    {...register('comment')}
                                    className={`min-h-[140px] w-full rounded-xl border p-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.comment ? 'border-red-500' : 'border-slate-300'}`}
                                    placeholder="Nhap nhan xet chi tiet..."
                                />
                            </div>

                            <div className="border-t border-slate-200 pt-5 text-right">
                                <Button type="submit" disabled={submitting} className="h-11 rounded-xl bg-[#10b981] px-6 text-white hover:bg-[#059669]">
                                    {submitting ? 'Dang luu...' : 'Hoan tat cham diem'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function InternGradeList({ items, onOpen, loading }) {
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        const normalizedKeyword = searchTerm.trim().toLowerCase();
        if (!normalizedKeyword) return items;

        return items.filter(
            (item) =>
                item.maSV.toLowerCase().includes(normalizedKeyword) ||
                item.hoTen.toLowerCase().includes(normalizedKeyword) ||
                item.lop.toLowerCase().includes(normalizedKeyword)
        );
    }, [items, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / visibleTaskLimit));
    const currentPage = Math.min(page, totalPages);
    const visibleItems = filteredItems.slice((currentPage - 1) * visibleTaskLimit, currentPage * visibleTaskLimit);
    const pageItems = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

    return (
        <Card className="bg-white">
            <div className="p-5">
                <h2 className="text-center text-2xl font-bold text-slate-800 md:text-3xl">CHAM DIEM THUC TAP</h2>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <div className="relative sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="pl-9" placeholder="Tim theo MSV, ten, lop" />
                    </div>
                    <Button
                        onClick={() => {
                            setSearchTerm(keyword);
                            setPage(1);
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
                                <TableHead>Lop</TableHead>
                                <TableHead>Trang thai</TableHead>
                                <TableHead>Diem qua trinh</TableHead>
                                <TableHead>Diem thi</TableHead>
                                <TableHead>Hanh dong</TableHead>
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
                            {!loading &&
                                visibleItems.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{(currentPage - 1) * visibleTaskLimit + index + 1}</TableCell>
                                        <TableCell>{item.maSV}</TableCell>
                                        <TableCell className="font-medium text-slate-800">{item.hoTen}</TableCell>
                                        <TableCell>{item.lop}</TableCell>
                                        <TableCell>
                                            <InternStatusBadge status={item.trangthai} />
                                        </TableCell>
                                        <TableCell>{item.diemQuaTrinh === '' ? '--' : item.diemQuaTrinh}</TableCell>
                                        <TableCell>{item.diemThi === '' ? '--' : item.diemThi}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                                <Button size="sm" variant="outline" onClick={() => onOpen(item)}>
                                                    Cham diem
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => onOpen(item)}>
                                                    Xem chi tiet
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            {!loading && visibleItems.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-slate-500">
                                        Khong co sinh vien nao can cham diem
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                    <Button variant="outline" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                        <ChevronLeft className="size-4" />
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        {pageItems.map((item) => (
                            <Button key={item} size="sm" variant={item === currentPage ? 'default' : 'ghost'} onClick={() => setPage(item)} className="h-9 min-w-9 px-2">
                                {item}
                            </Button>
                        ))}
                    </div>
                    <Button variant="outline" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                        Next
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

export default function InterGradeApi() {
    const [interns, setInterns] = useState([]);
    const [selectedIntern, setSelectedIntern] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchInterns = async () => {
            try {
                setLoading(true);
                const response = await lecturerApi.getInternshipGradingList();
                setInterns((Array.isArray(response?.data) ? response.data : []).map(mapIntern));
            } catch (error) {
                toast.error(error?.message || 'Khong the tai danh sach cham diem');
                setInterns([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInterns();
    }, []);

    const handleSaveGrade = async (internId, score, comment) => {
        try {
            setSubmitting(true);
            await lecturerApi.submitInternshipGrade(internId, {
                university_grade: score,
                feedback: comment,
            });
            setInterns((prev) =>
                prev.map((intern) =>
                    intern.id === internId ? { ...intern, diemThi: score, nhanXet: comment, trangthai: 'da cham' } : intern
                )
            );
            toast.success('Cham diem thuc tap thanh cong');
            setSelectedIntern(null);
        } catch (error) {
            toast.error(error?.message || 'Khong the cham diem thuc tap');
        } finally {
            setSubmitting(false);
        }
    };

    return selectedIntern ? (
        <InternGradeDetail item={selectedIntern} onBack={() => setSelectedIntern(null)} onSave={handleSaveGrade} submitting={submitting} />
    ) : (
        <InternGradeList items={interns} onOpen={setSelectedIntern} loading={loading} />
    );
}
