import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const confirmSchema = yup.object().shape({
    comment: yup.string().required('Vui lòng nhập lời nhắn cho sinh viên'),
});

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
    const [selectedStudent, setSelectedStudent] = useState(null);
    const itemsPerPage = 5;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(confirmSchema),
    });

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

    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        reset({ comment: '' });
    };

    const onApproveSubmit = (dataInput) => {
        setData((prev) => prev.filter((item) => item.id !== selectedStudent.id));
        toast.success(`Đã chấp nhận sinh viên ${selectedStudent.name}`, {
            className: '!bg-[#dcfce7] !text-[#047857]',
        });
        setSelectedStudent(null);
    };

    const onRejectSubmit = (dataInput) => {
        setData((prev) => prev.filter((item) => item.id !== selectedStudent.id));
        toast.error(`Đã từ chối sinh viên ${selectedStudent.name}`, {
            className: '!bg-[#fee2e2] !text-[#b91c1c]',
        });
        setSelectedStudent(null);
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
                                        <div className="flex items-center justify-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-[#3b82f6] hover:text-[#2563eb] hover:bg-blue-50 font-medium h-8"
                                                onClick={() => handleOpenModal(item)}
                                            >
                                                <span className="mr-1 inline-block w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
                                                Xem chi tiết
                                            </Button>
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

            {/* View Detail Modal Overlay */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-[500px] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-[#9333ea] flex items-center justify-between p-4">
                            <h3 className="text-white font-bold uppercase tracking-wider text-base md:text-lg">
                                CHI TIẾT ĐĂNG KÝ HƯỚNG DẪN
                            </h3>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                            MÃ SINH VIÊN
                                        </label>
                                        <p className="font-bold text-slate-800">{selectedStudent.msv}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                            LỚP
                                        </label>
                                        <p className="font-bold text-slate-800">{selectedStudent.class}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                        HỌ TÊN SINH VIÊN
                                    </label>
                                    <p className="font-bold text-slate-800 text-lg">{selectedStudent.name}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                        THỜI GIAN ĐĂNG KÝ
                                    </label>
                                    <p className="font-medium text-slate-600">{selectedStudent.date}</p>
                                </div>

                                <div className="mt-6">
                                    <label className="text-xs font-bold text-slate-600 block mb-2">
                                        Lời nhắn cho sinh viên: <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register('comment')}
                                        placeholder="Nhập lời nhắn hoặc lý do từ chối..."
                                        className={`w-full min-h-[100px] p-3 text-sm border ${errors.comment ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9333ea] focus:border-transparent resize-y`}
                                    ></textarea>
                                    {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
                            <Button
                                variant="outline"
                                onClick={handleSubmit(onRejectSubmit)}
                                className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 px-6 font-semibold"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Từ chối
                            </Button>
                            <Button
                                onClick={handleSubmit(onApproveSubmit)}
                                className="bg-[#9333ea] hover:bg-[#7e22ce] text-white px-6 font-semibold"
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Chấp nhận
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default ConfirmProject;