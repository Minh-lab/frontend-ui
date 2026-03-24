import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';
import lecturerApi from '@/services/lecturerApi';

const ITEMS_PER_PAGE = 5;

const mapCapstoneCancel = (item) => ({
    id: item.request_id ?? item.capstone_id,
    type: 'capstone',
    msv: item.student_code ?? 'N/A',
    name: item.student_name ?? 'N/A',
    className: item.class_name ?? 'N/A',
    date: item.created_at ?? '',
    status: item.status ?? '',
    topicTitle: item.topic_title ?? item.topic?.title ?? 'N/A',
    description: item.topic?.description ?? '',
    technologies: item.topic?.technologies ?? '',
    reason: item.reason ?? '',
});

const mapInternshipCancel = (item) => ({
    id: item.request_id,
    type: 'internship',
    msv: item.student_code ?? 'N/A',
    name: item.student_name ?? 'N/A',
    className: item.class ?? 'N/A',
    date: item.created_at ?? '',
    status: item.current_status ?? '',
    topicTitle: 'Yêu cầu hủy thực tập',
    description: '',
    technologies: '',
    reason: item.reason ?? '',
});

const statusLabel = (status) => {
    switch (status) {
        case 'PENDING_CANCEL':
        case 'PENDING_TEACHER':
            return 'Chờ GV duyệt';
        case 'PENDING_FACULTY_CANCEL':
        case 'PENDING_FACULTY':
            return 'Chờ VPK duyệt';
        case 'REJECTED':
            return 'Đã từ chối';
        case 'APPROVED':
            return 'Đã duyệt';
        default:
            return status || 'Đang xử lý';
    }
};

const statusClass = (status) => {
    switch (status) {
        case 'PENDING_CANCEL':
        case 'PENDING_TEACHER':
            return 'bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]';
        case 'PENDING_FACULTY_CANCEL':
        case 'PENDING_FACULTY':
            return 'bg-[#eef2ff] text-[#4f46e5] border-[#c7d2fe]';
        case 'REJECTED':
            return 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]';
        case 'APPROVED':
            return 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]';
        default:
            return 'bg-slate-100 text-slate-600 border-slate-200';
    }
};

function ReviewModal({ item, submitting, onClose, onSubmit }) {
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        setFeedback('');
    }, [item]);

    if (!item) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-[640px] flex-col overflow-hidden rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between bg-[#4f5ca8] p-4">
                    <h3 className="text-base font-bold uppercase tracking-wider text-white md:text-lg">Chi tiết yêu cầu hủy</h3>
                    <button onClick={onClose} className="rounded bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Mã sinh viên</p>
                            <p className="text-sm font-bold text-slate-800">{item.msv}</p>
                        </div>
                        <div>
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Họ và tên</p>
                            <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        </div>
                        <div>
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Lớp</p>
                            <p className="text-sm font-bold text-slate-800">{item.className}</p>
                        </div>
                        <div>
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Ngày gửi</p>
                            <p className="text-sm font-bold text-slate-800">{item.date || 'N/A'}</p>
                        </div>
                    </div>

                    <div>
                        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            {item.type === 'capstone' ? 'Ten de tai' : 'Loai yeu cau'}
                        </p>
                        <p className="text-sm font-bold text-slate-800">{item.topicTitle}</p>
                    </div>

                    {item.description ? (
                        <div>
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Mô tả</p>
                            <p className="text-sm text-slate-700">{item.description}</p>
                        </div>
                    ) : null}

                    {item.technologies ? (
                        <div>
                            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Công nghệ</p>
                            <p className="text-sm text-slate-700">{item.technologies}</p>
                        </div>
                    ) : null}

                    <div>
                        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Lý do sinh viên gửi</p>
                        <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                            {item.reason || 'Chưa có nội dung'}
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600">Nhận xét / Lý do từ chối</label>
                        <textarea
                            value={feedback}
                            onChange={(event) => setFeedback(event.target.value)}
                            placeholder="Nhập nhận xét nếu cần..."
                            className="min-h-[110px] w-full resize-y rounded-lg border border-slate-200 p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#4f5ca8]"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 p-4">
                    <Button
                        variant="outline"
                        disabled={submitting}
                        onClick={() => onSubmit('REJECTED', feedback)}
                        className="border-red-200 px-6 font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                        {submitting ? 'Dang xu ly...' : 'Tu choi'}
                    </Button>
                    <Button
                        disabled={submitting}
                        onClick={() => onSubmit('APPROVED', feedback)}
                        className="bg-[#4f5ca8] px-6 font-semibold text-white hover:bg-[#404b8c]"
                    >
                        {submitting ? 'Dang xu ly...' : 'Duyet'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function CancelRequests() {
    const [activeTab, setActiveTab] = useState('capstone');
    const [capstoneData, setCapstoneData] = useState([]);
    const [internshipData, setInternshipData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [capstoneResponse, internshipResponse] = await Promise.all([
                    lecturerApi.getPendingCapstoneCancellations(),
                    lecturerApi.getPendingInternshipCancellations(),
                ]);

                setCapstoneData((Array.isArray(capstoneResponse?.data) ? capstoneResponse.data : []).map(mapCapstoneCancel));
                setInternshipData((Array.isArray(internshipResponse?.data) ? internshipResponse.data : []).map(mapInternshipCancel));
            } catch (error) {
                toast.error(error?.message || 'Không thể tải danh sách yêu cầu hủy');
                setCapstoneData([]);
                setInternshipData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    const currentData = activeTab === 'capstone' ? capstoneData : internshipData;
    const totalPages = Math.max(1, Math.ceil(currentData.length / ITEMS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const visibleData = useMemo(
        () => currentData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
        [currentData, currentPage]
    );

    const handleReview = async (status, feedback) => {
        if (!selectedItem) {
            return;
        }

        try {
            setSubmitting(true);

            if (selectedItem.type === 'capstone') {
                const response = await lecturerApi.reviewCapstoneCancellation(selectedItem.id, { status, feedback });
                setCapstoneData((prev) => prev.filter((item) => item.id !== selectedItem.id));
                toast.success(response?.message || 'Đã xử lý yêu cầu hủy đồ án');
            } else {
                const response = await lecturerApi.reviewInternshipCancellation(selectedItem.id, { status, feedback });
                setInternshipData((prev) => prev.filter((item) => item.id !== selectedItem.id));
                toast.success(response?.message || 'Đã xử lý yêu cầu hủy thực tập');
            }

            setSelectedItem(null);
        } catch (error) {
            toast.error(error?.message || 'Không thể xử lý yêu cầu hủy');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="relative m-0 rounded-none border-0 bg-white shadow-sm md:rounded-2xl">
            <div className="p-5 md:p-8">
                <h2 className="mb-8 text-center text-xl font-bold uppercase tracking-wider text-slate-800 md:text-2xl">
                    QUẢN LÝ YÊU CẦU HỦY
                </h2>

                <div className="mb-4 flex items-center gap-6 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('capstone')}
                        className={`border-b-2 px-1 pb-3 text-sm font-bold ${activeTab === 'capstone' ? 'border-[#4f46e5] text-[#4f46e5]' : 'border-transparent text-slate-600'}`}
                    >
                        Yêu cầu hủy đồ án
                    </button>
                    <button
                        onClick={() => setActiveTab('internship')}
                        className={`border-b-2 px-1 pb-3 text-sm font-bold ${activeTab === 'internship' ? 'border-[#4f46e5] text-[#4f46e5]' : 'border-transparent text-slate-600'}`}
                    >
                        Yêu cầu hủy thực tập
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-bold text-slate-600">STT</TableHead>
                                <TableHead className="font-bold text-slate-600">MSV</TableHead>
                                <TableHead className="font-bold text-slate-600">Họ và tên</TableHead>
                                <TableHead className="font-bold text-slate-600">Lớp</TableHead>
                                <TableHead className="font-bold text-slate-600">Ngày gửi</TableHead>
                                <TableHead className="font-bold text-slate-600">Trạng thái</TableHead>
                                <TableHead className="text-center font-bold text-slate-600">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                                        Đang tải dữ liệu...
                                    </TableCell>
                                </TableRow>
                            ) : visibleData.length > 0 ? (
                                visibleData.map((item, index) => (
                                    <TableRow key={`${item.type}-${item.id}`} className="transition-colors hover:bg-slate-50/50">
                                        <TableCell className="font-medium text-slate-600">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                                        <TableCell className="text-slate-600">{item.msv}</TableCell>
                                        <TableCell className="font-semibold text-slate-800">{item.name}</TableCell>
                                        <TableCell className="font-medium text-slate-600">{item.className}</TableCell>
                                        <TableCell className="text-slate-600">{item.date || 'N/A'}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                                                {statusLabel(item.status)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 font-medium text-[#ef4444] hover:bg-red-50 hover:text-[#dc2626]"
                                                    onClick={() => setSelectedItem(item)}
                                                >
                                                    Xử lý
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                                        {activeTab === 'capstone' ? 'Chua co yeu cau huy do an nao.' : 'Chua co yeu cau huy thuc tap nao.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-3 sm:flex-row">
                    <Button
                        variant="outline"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="w-full border-slate-200 text-slate-600 sm:w-auto"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                    </Button>

                    <span className="text-sm font-medium text-slate-500">
                        Trang {currentPage} / {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="w-full border-slate-200 text-slate-600 sm:w-auto"
                    >
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <ReviewModal
                item={selectedItem}
                submitting={submitting}
                onClose={() => setSelectedItem(null)}
                onSubmit={handleReview}
            />
        </Card>
    );
}
