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

const gradeSchema = yup.object({
    score: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .typeError('Vui lòng nhập điểm là số')
        .required('Vui lòng nhập điểm')
        .min(0, 'Điểm không được nhỏ hơn 0')
        .max(10, 'Điểm không được lớn hơn 10'),
});

const statusLabelMap = {
    COMPLETED: 'đã chấm',
    FAILED: 'đã chấm',
    DEFENSE_ELIGIBLE: 'đã duyệt',
    REPORTING: 'đã duyệt',
    LECTURER_APPROVED: 'đã duyệt',
};

const mapProject = (item) => ({
    id: item.capstone_id,
    maSV: item.student_code ?? 'N/A',
    hoTen: item.student_name ?? 'N/A',
    lop: item.class_name ?? 'N/A',
    tenDeTai: item.topic_title ?? 'N/A',
    linhVuc: item.expertise ?? 'N/A',
    diem: item.current_grade ?? '',
    nhanXet: item.feedback ?? '',
    fileUrl: item.preview_url ?? null,
    trangthai: item.current_grade !== null && item.current_grade !== undefined
        ? 'đã chấm'
        : (statusLabelMap[item.status] ?? 'đã duyệt'),
});

function ProjectStatusBadge({ status }) {
    const isGraded = status === 'đã chấm';

    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${isGraded
                ? 'border-[#10b981] bg-[#dcfce7] text-[#10b981]'
                : 'border-[#93c5fd] bg-[#dbeafe] text-[#2563eb]'
                }`}
        >
            {isGraded ? 'Đã chấm' : 'Đã duyệt'}
        </span>
    );
}

function ProjectGradeDetail({ item, onBack, onSave, submitting }) {
    const isGraded = item.trangthai === 'đã chấm';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(gradeSchema),
        defaultValues: {
            score: item.diem ?? '',
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                <Button onClick={onBack} variant="ghost" className="border border-gray-200">
                    <ChevronLeft className="size-4" />
                    Quay lại
                </Button>
                <h2 className="text-lg font-bold text-slate-800 md:text-xl">Chấm điểm đồ án {item.id}</h2>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
                <Card className="overflow-hidden border border-slate-200 bg-[#f6f0df] p-5">
                    <div className="flex h-[620px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-center text-slate-500">
                        <FileText className="mb-4 size-14 text-slate-500" />
                        {item.fileUrl ? (
                            <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 underline">
                                Mở file báo cáo
                            </a>
                        ) : (
                            <p className="text-lg font-medium">Chưa có file preview</p>
                        )}
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="rounded-2xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold text-slate-800 md:text-xl">Thong tin do an</h3>
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
                                <p className="mb-2 text-sm text-slate-500">Lớp:</p>
                                <p className="text-base text-slate-800 md:text-lg">{item.lop}</p>
                            </div>
                            <div>
                                <p className="mb-2 text-sm text-slate-500">Đề tài:</p>
                                <p className="text-base leading-relaxed text-[#2563eb] md:text-lg">{item.tenDeTai}</p>
                            </div>
                            <div>
                                <p className="mb-2 text-sm text-slate-500">Lĩnh vực:</p>
                                <p className="text-base text-slate-800 md:text-lg">{item.linhVuc}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 md:text-xl">Kết quả đánh giá</h3>
                        <form onSubmit={handleSubmit((data) => onSave(item.id, data.score))} className="mt-6 space-y-5">
                            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                <label className="text-sm font-semibold text-slate-700 md:text-base">Điểm tổng</label>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            {...register('score')}
                                            type="number"
                                            step="0.1"
                                            disabled={isGraded || submitting}
                                            className={`h-11 w-32 text-center ${errors.score ? 'border-red-500' : ''}`}
                                        />
                                        <span className="text-sm text-slate-500 md:text-base">/10</span>
                                    </div>
                                    {errors.score && <p className="text-xs text-red-500">{errors.score.message}</p>}
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-5 text-right">
                                <Button
                                    type="submit"
                                    disabled={isGraded || submitting}
                                    className="h-11 rounded-xl bg-[#10b981] px-6 text-white hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting ? 'Đang xử lý...' : 'Hoàn tất chấm điểm'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ProjectGradeList({ items, loading, onOpen }) {
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        const currentKeyword = searchTerm.trim().toLowerCase();
        if (!currentKeyword) return items;

        return items.filter((item) =>
            item.maSV.toLowerCase().includes(currentKeyword) ||
            item.hoTen.toLowerCase().includes(currentKeyword) ||
            item.tenDeTai.toLowerCase().includes(currentKeyword)
        );
    }, [items, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / visibleTaskLimit));
    const currentPage = Math.min(page, totalPages);
    const visibleItems = filteredItems.slice((currentPage - 1) * visibleTaskLimit, currentPage * visibleTaskLimit);
    const pageItems = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    return (
        <Card className="bg-white">
            <div className="p-5">
                <h2 className="text-center text-2xl font-bold text-slate-800 md:text-3xl">CHẤM ĐIỂM ĐỒ ÁN</h2>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <div className="relative sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            className="pl-9"
                            placeholder="Tìm theo MSV, tên, đề tài"
                        />
                    </div>
                    <Button
                        onClick={() => {
                            setSearchTerm(keyword);
                            setPage(1);
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
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-slate-500">
                                        Đang tải dữ liệu...
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading && visibleItems.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{(currentPage - 1) * visibleTaskLimit + index + 1}</TableCell>
                                    <TableCell>{item.maSV}</TableCell>
                                    <TableCell className="font-medium text-slate-800">{item.hoTen}</TableCell>
                                    <TableCell className="max-w-[280px] truncate">{item.tenDeTai}</TableCell>
                                    <TableCell>
                                        <ProjectStatusBadge status={item.trangthai} />
                                    </TableCell>
                                    <TableCell>{item.diem === '' ? '' : item.diem}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-2">
                                            <Button size="sm" variant="outline" onClick={() => onOpen(item)}>
                                                {item.trangthai === 'da cham' ? 'Xem chi tiet' : 'Cham diem'}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && visibleItems.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-slate-500">
                                        Không có đồ án nào để chấm
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

export default function ProjectGrade() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await lecturerApi.getCapstoneGradingList();
                setProjects((Array.isArray(response?.data) ? response.data : []).map(mapProject));
            } catch (error) {
                toast.error(error?.message || 'Không thể tải danh sách chấm điểm đồ án');
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleSaveGrade = async (projectId, score) => {
        try {
            setSubmitting(true);
            const response = await lecturerApi.submitCapstoneGrade(projectId, {
                grade: score,
            });

            const updatedStatus = response?.data?.status;
            const updatedGrade = response?.data?.grade ?? score;

            setProjects((prev) =>
                prev.map((project) =>
                    project.id === projectId
                        ? {
                            ...project,
                            diem: updatedGrade,
                            trangthai: updatedStatus ? 'đã chấm' : project.trangthai,
                        }
                        : project
                )
            );

            setSelectedProject((prevSelected) =>
                prevSelected && prevSelected.id === projectId
                    ? {
                        ...prevSelected,
                        diem: updatedGrade,
                        trangthai: 'đã chấm',
                    }
                    : null
            );

            toast.success(response?.message || 'Chấm điểm đồ án thành công');
            setSelectedProject(null);
        } catch (error) {
            toast.error(error?.message || 'Không thể chấm điểm đồ án');
        } finally {
            setSubmitting(false);
        }
    };

    return selectedProject ? (
        <ProjectGradeDetail
            item={selectedProject}
            onBack={() => setSelectedProject(null)}
            onSave={handleSaveGrade}
            submitting={submitting}
        />
    ) : (
        <ProjectGradeList items={projects} loading={loading} onOpen={setSelectedProject} />
    );
}
