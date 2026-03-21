import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowLeft, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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

const mapReview = (item) => ({
    id: item.capstone_id,
    msv: item.student_code ?? 'N/A',
    name: item.student_name ?? 'N/A',
    className: item.class_name ?? 'N/A',
    topicName: item.topic_title ?? 'N/A',
    expertise: item.expertise ?? 'N/A',
    score: item.my_grade ?? null,
    comment: item.feedback ?? '',
    status: item.my_grade !== null && item.my_grade !== undefined ? 'Da cham' : 'Dang cho cham',
    fileUrl: item.preview_url ?? null,
});

function GradeStatusBadge({ graded }) {
    return (
        <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold border ${graded ? 'bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]' : 'bg-[#e0e7ff] text-[#6366f1] border-[#c7d2fe]'}`}>
            {graded ? 'Da cham' : 'Dang cho cham'}
        </span>
    );
}

function ReviewDetail({ selectedStudent, viewMode, onBack, onSubmitGrade, submitting }) {
    const isViewOnly = viewMode === 'view';

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(gradeSchema),
        defaultValues: {
            score: selectedStudent.score ?? '',
            comment: selectedStudent.comment ?? '',
        },
    });

    useEffect(() => {
        reset({
            score: selectedStudent.score ?? '',
            comment: selectedStudent.comment ?? '',
        });
    }, [reset, selectedStudent]);

    return (
        <Card className="bg-[#f8fafc] m-0 border-0 shadow-sm rounded-none md:rounded-2xl relative min-h-[600px] flex flex-col">
            <div className="p-4 md:px-6 md:py-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm sticky top-0 z-10 w-full mb-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack} className="text-slate-600 border-slate-200 hover:bg-slate-50 font-semibold px-4 h-9 rounded-lg">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lai
                    </Button>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800">Cham diem phan bien</h2>
                </div>
            </div>

            <div className="flex-1 px-4 pb-6 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="border border-dashed border-slate-300 rounded-2xl bg-white flex flex-col items-center justify-center min-h-[500px] lg:h-[calc(100vh-200px)] text-slate-400 shadow-sm">
                    <FileText className="w-16 h-16 mb-4 text-slate-300 opacity-80" />
                    {selectedStudent.fileUrl ? (
                        <a href={selectedStudent.fileUrl} target="_blank" rel="noreferrer" className="text-[15px] font-medium text-blue-600 underline">
                            Mo file bao cao
                        </a>
                    ) : (
                        <p className="text-[15px] font-medium text-slate-400/80">Chua co file preview</p>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-6">
                        <div className="flex items-start justify-between mb-5 pb-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800 text-[15px]">Thong tin do an</h3>
                            <GradeStatusBadge graded={selectedStudent.score !== null && selectedStudent.score !== undefined} />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Sinh vien thuc hien:</p>
                                <p className="font-bold text-slate-800 text-[15px]">
                                    {selectedStudent.name} <span className="text-slate-500 font-medium ml-1">({selectedStudent.msv})</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Lop:</p>
                                <p className="font-semibold text-slate-700 text-sm">{selectedStudent.className}</p>
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">De tai:</p>
                                <p className="font-semibold text-[#2563eb] text-sm leading-relaxed">{selectedStudent.topicName}</p>
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Linh vuc:</p>
                                <p className="font-semibold text-slate-700 text-sm">{selectedStudent.expertise}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-6">
                        <h3 className="font-bold text-slate-800 text-[15px] mb-5 pb-4 border-b border-slate-100">Ket qua danh gia</h3>

                        <form onSubmit={handleSubmit((data) => onSubmitGrade(selectedStudent.id, data.score, data.comment))}>
                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-700 block mb-2 px-1">Diem tong</label>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <input
                                            {...register('score')}
                                            type="number"
                                            disabled={isViewOnly || submitting}
                                            placeholder="0.0"
                                            className={`w-24 px-4 py-2 border ${errors.score ? 'border-red-500' : 'border-slate-200'} rounded-xl text-center font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] disabled:bg-slate-50 disabled:text-slate-500`}
                                            step="0.1"
                                        />
                                        <span className="text-slate-400 font-bold text-[15px]">/10</span>
                                    </div>
                                    {errors.score && <p className="text-xs text-red-500 mt-1">{errors.score.message}</p>}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-700 block mb-2 px-1">Nhan xet</label>
                                <textarea
                                    {...register('comment')}
                                    disabled={isViewOnly || submitting}
                                    placeholder="Nhan xet de gui kem neu can..."
                                    className="w-full min-h-[140px] px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] disabled:bg-slate-50 disabled:text-slate-500 resize-y"
                                />
                            </div>

                            {!isViewOnly && (
                                <div className="flex justify-end mt-6 pt-5 border-t border-slate-100">
                                    <Button type="submit" disabled={submitting} className="bg-[#10b981] hover:bg-[#059669] text-white px-6 font-bold h-10 rounded-xl">
                                        {submitting ? 'Dang xu ly...' : 'Hoan tat cham diem'}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default function ReviewGrade() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState('list');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchReviewingList = async () => {
            try {
                setLoading(true);
                const response = await lecturerApi.getCapstoneReviewingList();
                setData((Array.isArray(response?.data) ? response.data : []).map(mapReview));
            } catch (error) {
                toast.error(error?.message || 'Khong the tai danh sach phan bien');
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviewingList();
    }, []);

    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
    const currentPage = Math.min(page, totalPages);
    const visibleData = useMemo(
        () => data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
        [data, currentPage]
    );

    const handleGoToGrade = (student) => {
        setSelectedStudent(student);
        setViewMode('grade');
    };

    const handleGoToView = (student) => {
        setSelectedStudent(student);
        setViewMode('view');
    };

    const handleBack = () => {
        setViewMode('list');
        setSelectedStudent(null);
    };

    const handleSubmitGrade = async (capstoneId, score, comment) => {
        try {
            setSubmitting(true);
            const response = await lecturerApi.submitCapstoneReviewGrade(capstoneId, {
                grade: score,
                feedback: comment,
            });

            setData((prev) =>
                prev.map((item) =>
                    item.id === capstoneId
                        ? { ...item, score, comment: comment ?? '', status: 'Da cham' }
                        : item
                )
            );

            toast.success(response?.message || 'Da cham diem phan bien thanh cong');
            handleBack();
        } catch (error) {
            toast.error(error?.message || 'Khong the cham diem phan bien');
        } finally {
            setSubmitting(false);
        }
    };

    if (viewMode !== 'list' && selectedStudent) {
        return (
            <ReviewDetail
                selectedStudent={selectedStudent}
                viewMode={viewMode}
                onBack={handleBack}
                onSubmitGrade={handleSubmitGrade}
                submitting={submitting}
            />
        );
    }

    return (
        <Card className="bg-white m-0 border-0 shadow-sm rounded-none md:rounded-2xl">
            <div className="p-5 md:p-8">
                <h2 className="text-center text-xl font-bold uppercase text-slate-800 md:text-2xl mb-8 tracking-wider">
                    CHAM DIEM PHAN BIEN
                </h2>

                <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-bold text-slate-600">STT</TableHead>
                                <TableHead className="font-bold text-slate-600">MSV</TableHead>
                                <TableHead className="font-bold text-slate-600">Ho va ten</TableHead>
                                <TableHead className="font-bold text-slate-600">Ten de tai</TableHead>
                                <TableHead className="font-bold text-slate-600 text-center">Trang thai</TableHead>
                                <TableHead className="font-bold text-slate-600 text-center">Diem</TableHead>
                                <TableHead className="font-bold text-slate-600 text-center">Hanh dong</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-slate-500 font-medium">
                                        Dang tai du lieu...
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && visibleData.map((item, index) => {
                                const isGraded = item.score !== null && item.score !== undefined;

                                return (
                                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-medium text-slate-600">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </TableCell>
                                        <TableCell className="text-slate-600">{item.msv}</TableCell>
                                        <TableCell className="font-semibold text-slate-800">{item.name}</TableCell>
                                        <TableCell className="text-slate-600 max-w-[200px] truncate" title={item.topicName}>
                                            {item.topicName}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <GradeStatusBadge graded={isGraded} />
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-slate-700">
                                            {item.score !== null && item.score !== undefined ? item.score : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleGoToGrade(item)}
                                                    className={`h-7 px-3 text-[11px] rounded-full font-bold ${!isGraded ? 'border-[#e879f9] text-[#c026d3] bg-[#fdf4ff] hover:bg-[#fae8ff]' : 'border-slate-200 text-slate-400 bg-slate-50'}`}
                                                >
                                                    Cham diem
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleGoToView(item)}
                                                    className={`h-7 px-3 text-[11px] rounded-full font-bold ${isGraded ? 'border-[#93c5fd] text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe]' : 'border-slate-200 text-slate-400 bg-slate-50'}`}
                                                >
                                                    Xem chi tiet
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {!loading && visibleData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-slate-500 font-medium">
                                        Khong co du lieu de tai
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-3">
                    <Button
                        variant="outline"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="w-full sm:w-auto text-slate-600 border-slate-200 h-9 font-medium"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </Button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <Button
                                key={idx}
                                size="sm"
                                variant={idx + 1 === currentPage ? 'default' : 'ghost'}
                                onClick={() => setPage(idx + 1)}
                                className={`h-9 min-w-9 px-2 font-bold ${idx + 1 === currentPage ? 'bg-slate-800 text-white hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                {idx + 1}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="w-full sm:w-auto text-slate-600 border-slate-200 h-9 font-medium"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
