import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';
import lecturerApi from '@/services/lecturerApi';

const approveSchema = yup.object({
    comment: yup.string().required('Vui long nhap nhan xet hoac ly do tu choi'),
});

const mapTopic = (item) => ({
    id: item.request_id,
    msv: item.student_code ?? 'N/A',
    name: item.student_name ?? 'N/A',
    className: item.class_name ?? 'N/A',
    topicName: item.topic_title ?? 'N/A',
    tech: item.technologies ?? 'Chua cap nhat',
    desc: item.description ?? 'N/A',
    createdAt: item.created_at ?? '',
});

export default function ApproveTopicApi() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const itemsPerPage = 5;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(approveSchema),
    });

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await lecturerApi.getPendingCapstoneTopics();
                setData((Array.isArray(response?.data) ? response.data : []).map(mapTopic));
            } catch (error) {
                toast.error(error?.message || 'Khong the tai danh sach de tai');
                setData([]);
            }
        };

        fetchTopics();
    }, []);

    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
    const currentPage = Math.min(page, totalPages);
    const visibleData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const pageItems = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

    const handleOpenTopic = (topic) => {
        setSelectedTopic(topic);
        reset({ comment: '' });
    };

    const handleApprove = async (formData) => {
        try {
            setSubmitting(true);
            const response = await lecturerApi.reviewCapstoneTopic(selectedTopic.id, {
                status: 'APPROVED',
                feedback: formData.comment,
            });
            setData((prev) => prev.filter((item) => item.id !== selectedTopic.id));
            toast.success(response?.message || `Da duyet de tai cho sinh vien ${selectedTopic.name}`);
            setSelectedTopic(null);
        } catch (error) {
            toast.error(error?.message || 'Khong the duyet de tai');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async (formData) => {
        try {
            setSubmitting(true);
            const response = await lecturerApi.reviewCapstoneTopic(selectedTopic.id, {
                status: 'REJECTED',
                feedback: formData.comment,
            });
            setData((prev) => prev.filter((item) => item.id !== selectedTopic.id));
            toast.error(response?.message || `Da tu choi de tai cua sinh vien ${selectedTopic.name}`);
            setSelectedTopic(null);
        } catch (error) {
            toast.error(error?.message || 'Khong the tu choi de tai');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="relative m-0 rounded-none border-0 bg-white shadow-sm md:rounded-2xl">
            <div className="p-5 md:p-8">
                <h2 className="mb-8 text-center text-xl font-bold uppercase tracking-wider text-slate-800 md:text-2xl">
                    XAC NHAN DUYET DE TAI
                </h2>

                <div className="mb-6 flex flex-wrap items-center gap-4">
                    <span className="inline-flex rounded-full border border-[#fbd38d] px-4 py-1.5 text-xs font-semibold text-[#dd6b20]">
                        Danh sach de tai cho duyet
                    </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-bold text-slate-600">STT</TableHead>
                                <TableHead className="font-bold text-slate-600">MSV</TableHead>
                                <TableHead className="font-bold text-slate-600">Ho va ten</TableHead>
                                <TableHead className="font-bold text-slate-600">Lop</TableHead>
                                <TableHead className="font-bold text-slate-600">Ten de tai de xuat</TableHead>
                                <TableHead className="text-center font-bold text-slate-600">Hanh dong</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleData.map((item, index) => (
                                <TableRow key={item.id} className="transition-colors hover:bg-slate-50/50">
                                    <TableCell className="font-medium text-slate-600">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                    <TableCell className="text-slate-600">{item.msv}</TableCell>
                                    <TableCell className="font-semibold text-slate-800">{item.name}</TableCell>
                                    <TableCell className="font-medium text-slate-600">{item.className}</TableCell>
                                    <TableCell className="max-w-[200px] truncate text-slate-600" title={item.topicName}>
                                        {item.topicName}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center">
                                            <Button variant="ghost" size="sm" className="h-8 font-medium text-[#3b82f6] hover:bg-blue-50 hover:text-[#2563eb]" onClick={() => handleOpenTopic(item)}>
                                                Xem chi tiet
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {visibleData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                        Khong co de tai nao cho duyet
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-3 sm:flex-row">
                    <Button variant="outline" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-full border-slate-200 text-slate-600 sm:w-auto">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                    </Button>

                    <div className="flex items-center gap-1">
                        {pageItems.map((item) => (
                            <Button
                                key={item}
                                size="sm"
                                variant={item === currentPage ? 'default' : 'ghost'}
                                onClick={() => setPage(item)}
                                className={`h-9 min-w-9 px-2 font-medium ${item === currentPage ? 'bg-slate-800 text-white hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                {item}
                            </Button>
                        ))}
                    </div>

                    <Button variant="outline" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-full border-slate-200 text-slate-600 sm:w-auto">
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            </div>

            {selectedTopic && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-[600px] flex-col overflow-hidden rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between bg-[#6d28d9] p-4">
                            <h3 className="text-base font-bold uppercase tracking-wider text-white md:text-lg">CHI TIET DE TAI DE XUAT</h3>
                            <button onClick={() => setSelectedTopic(null)} className="rounded bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6">
                            <div className="mb-6 grid grid-cols-2 gap-6">
                                <div>
                                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">Ma sinh vien</label>
                                    <p className="text-sm font-bold text-slate-800 sm:text-base">{selectedTopic.msv}</p>
                                </div>
                                <div className="text-right sm:text-left">
                                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">Ho ten va lop</label>
                                    <p className="text-sm font-bold text-slate-800 sm:text-base">
                                        {selectedTopic.name} <span className="hidden sm:inline">- </span> {selectedTopic.className}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">Ten de tai</label>
                                    <p className="text-sm font-bold text-slate-800">{selectedTopic.topicName}</p>
                                </div>

                                <div>
                                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">Cong nghe du kien</label>
                                    <p className="text-sm font-bold text-slate-800">{selectedTopic.tech}</p>
                                </div>

                                <div>
                                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">Mo ta</label>
                                    <p className="text-sm font-bold text-slate-800">{selectedTopic.desc}</p>
                                </div>

                                <div className="mt-6">
                                    <label className="mb-2 block text-xs font-bold text-slate-600">
                                        Nhan xet / Ly do tu choi: <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register('comment')}
                                        placeholder="Nhap nhan xet chi tiet cho sinh vien tai day..."
                                        className={`min-h-[100px] w-full resize-y rounded-lg border p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#6d28d9] ${errors.comment ? 'border-red-500' : 'border-slate-200'}`}
                                    />
                                    {errors.comment && <p className="mt-1 text-xs text-red-500">{errors.comment.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 p-4">
                            <Button variant="outline" disabled={submitting} onClick={handleSubmit(handleReject)} className="border-red-200 px-6 font-semibold text-red-500 hover:bg-red-50 hover:text-red-600">
                                {submitting ? 'Dang xu ly...' : 'Tu choi'}
                            </Button>
                            <Button disabled={submitting} onClick={handleSubmit(handleApprove)} className="bg-[#6d28d9] px-6 font-semibold text-white hover:bg-[#5b21b6]">
                                {submitting ? 'Dang xu ly...' : 'Duyet de tai'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
