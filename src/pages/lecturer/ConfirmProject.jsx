import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const initialData = [
    { id: 1, msv: '2351170101', name: 'Nguyễn Thị Hải Anh', class: '65KTPM', date: '19/02/2026' },
    { id: 2, msv: '2351170102', name: 'Trần Thị Kiều Anh', class: '65CNPM', date: '20/02/2026' },
    { id: 3, msv: '2351170674', name: 'Lê Văn Bình', class: '65CNTT', date: '20/02/2026' },
    { id: 4, msv: '2351170675', name: 'Đào Văn Hùng', class: '65KTPM', date: '20/02/2026' },
    { id: 5, msv: '2351170712', name: 'Trần Thị Thu Huyền', class: '65KTPM', date: '21/02/2026' },
    { id: 6, msv: '2351170782', name: 'Lê Thị Kiều', class: '65KTPM', date: '21/02/2026' },
    { id: 7, msv: '2351170782', name: 'Lê Thị Kiều', class: '65KTPM', date: '21/02/2026' },
    { id: 8, msv: '2351170782', name: 'Lê Thị Kiều', class: '65KTPM', date: '21/02/2026' },
];

const ConfirmProject = () => {
    const [data, setData] = useState(initialData);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
    const currentPage = Math.min(page, totalPages);

    const visibleData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const pageItems = [];
    for (let i = 1; i <= totalPages; i++) {
        pageItems.push(i);
    }

    const handleApprove = (id, name) => {
        setData((prev) => prev.filter((item) => item.id !== id));
        toast.success(`Đã chấp nhận sinh viên ${name}`, {
            className: '!bg-[#dcfce7] !text-[#047857]',
        });
    };

    const handleReject = (id, name) => {
        setData((prev) => prev.filter((item) => item.id !== id));
        toast.error(`Đã từ chối sinh viên ${name}`, {
            className: '!bg-[#fee2e2] !text-[#b91c1c]',
        });
    };

    return (
        <Card className="bg-white m-0 border-0 shadow-sm rounded-none md:rounded-2xl">
            <div className="p-5 md:p-8">
                <h2 className="text-center text-xl font-bold uppercase text-slate-800 md:text-2xl mb-8 tracking-wider">
                    XÁC NHẬN HƯỚNG DẪN ĐỒ ÁN
                </h2>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="inline-flex rounded-full border border-[#c084fc] px-4 py-1.5 text-xs font-semibold text-[#9333ea]">
                        Đang hướng dẫn: 10/20
                    </span>
                    <span className="inline-flex rounded-full border border-[#fbd38d] px-4 py-1.5 text-xs font-semibold text-[#dd6b20]">
                        Hạn chót duyệt: 20/05/2026
                    </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-bold text-slate-600">STT</TableHead>
                                <TableHead className="font-bold text-slate-600">MSV</TableHead>
                                <TableHead className="font-bold text-slate-600">Họ và tên</TableHead>
                                <TableHead className="font-bold text-slate-600">Lớp</TableHead>
                                <TableHead className="font-bold text-slate-600">Thời gian đăng ký</TableHead>
                                <TableHead className="font-bold text-slate-600 text-center">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleData.map((item, index) => (
                                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-medium text-slate-600">
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell className="text-slate-600">{item.msv}</TableCell>
                                    <TableCell className="font-semibold text-slate-800">{item.name}</TableCell>
                                    <TableCell className="font-medium text-slate-600">{item.class}</TableCell>
                                    <TableCell className="text-slate-500">{item.date}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => handleApprove(item.id, item.name)}
                                                className="text-[#22c55e] hover:text-[#16a34a] hover:scale-110 transition-transform focus:outline-none"
                                                title="Chấp nhận"
                                            >
                                                <CheckCircle2 className="w-6 h-6 fill-[#22c55e] text-white" />
                                            </button>
                                            <button
                                                onClick={() => handleReject(item.id, item.name)}
                                                className="text-[#ef4444] hover:text-[#dc2626] hover:scale-110 transition-transform focus:outline-none"
                                                title="Từ chối"
                                            >
                                                <XCircle className="w-6 h-6 fill-[#ef4444] text-white" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {visibleData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                        Không có sinh viên đăng ký
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
                        className="w-full sm:w-auto text-slate-600 border-slate-200"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </Button>

                    <div className="flex items-center gap-1">
                        {pageItems.map((item) => (
                            <Button
                                key={item}
                                size="sm"
                                variant={item === currentPage ? 'default' : 'ghost'}
                                onClick={() => setPage(item)}
                                className={`h-9 min-w-9 px-2 font-medium ${item === currentPage
                                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                                    : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                {item}
                            </Button>
                        ))}
                        {totalPages > 5 && <span className="px-2 text-slate-400">...</span>}
                        {totalPages > 5 && (
                            <>
                                <Button size="sm" variant="ghost" className="h-9 min-w-9 px-2 text-slate-600 font-medium">8</Button>
                                <Button size="sm" variant="ghost" className="h-9 min-w-9 px-2 text-slate-600 font-medium">9</Button>
                                <Button size="sm" variant="ghost" className="h-9 min-w-9 px-2 text-slate-600 font-medium">10</Button>
                            </>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="w-full sm:w-auto text-slate-600 border-slate-200"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ConfirmProject;