import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowLeft, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const gradeSchema = yup.object().shape({
    score: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .typeError('Vui lòng nhập điểm là số')
        .required('Vui lòng nhập điểm')
        .min(0, 'Điểm không được nhỏ hơn 0')
        .max(10, 'Điểm không được lớn hơn 10'),
    comment: yup.string().required('Vui lòng nhập nhận xét'),
});

const initialData = [
    { id: 1, msv: '2351170101', name: 'Nguyễn Thị Hải Anh', topicName: 'Ứng dụng AI nhận diện...', status: 'Đã duyệt', score: null },
    { id: 2, msv: '2351170102', name: 'Trần Thị Kiều Anh', topicName: 'Ứng dụng AI nhận diện...', status: 'Đã duyệt', score: null },
    { id: 3, msv: '2351170674', name: 'Lê Văn Bình', topicName: 'Ứng dụng AI nhận diện...', status: 'Đã duyệt', score: null },
    { id: 4, msv: '2351170675', name: 'Đào Văn Hùng', topicName: 'Ứng dụng AI nhận diện...', status: 'Đã duyệt', score: null },
    { id: 5, msv: '2351170712', name: 'Trần Thị Thu Huyền', topicName: 'Ứng dụng AI nhận diện...', status: 'Đã duyệt', score: null },
    { id: 6, msv: '2351170782', name: 'Lê Thị Kiều', topicName: 'Ứng dụng AI nhận diện...', status: 'Đã chấm', score: 6, comment: 'Đã làm tốt phần AI' },
];

const ReviewGrade = () => {
    const [data, setData] = useState(initialData);
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'grade' | 'view'
    const [selectedStudent, setSelectedStudent] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(gradeSchema),
    });

    const itemsPerPage = 5;
    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
    const currentPage = Math.min(page, totalPages);
    const visibleData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleGoToGrade = (student) => {
        setSelectedStudent(student);
        reset({
            score: student.score || '',
            comment: student.comment || '',
        });
        setViewMode('grade');
    };

    const handleGoToView = (student) => {
        setSelectedStudent(student);
        reset({
            score: student.score || '',
            comment: student.comment || '',
        });
        setViewMode('view');
    };

    const handleBack = () => {
        setViewMode('list');
        setSelectedStudent(null);
    };

    const onSubmit = (dataInput) => {
        setData((prev) => prev.map((item) => {
            if (item.id === selectedStudent.id) {
                return { ...item, status: 'Đã chấm', score: dataInput.score, comment: dataInput.comment };
            }
            return item;
        }));

        toast.success(`Đã chấm điểm thành công cho sinh viên ${selectedStudent.name}`, {
            className: '!bg-[#dcfce7] !text-[#047857]',
        });
        
        handleBack();
    };

    if (viewMode !== 'list' && selectedStudent) {
        return (
            <Card className="bg-[#f8fafc] m-0 border-0 shadow-sm rounded-none md:rounded-2xl relative min-h-[600px] flex flex-col">
                <div className="p-4 md:px-6 md:py-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm sticky top-0 z-10 w-full mb-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={handleBack} className="text-slate-600 border-slate-200 hover:bg-slate-50 font-semibold px-4 h-9 shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-lg">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại
                        </Button>
                        <h2 className="text-lg md:text-xl font-bold text-slate-800">
                            Chấm Điểm Phản Biện
                        </h2>
                    </div>
                </div>

                <div className="flex-1 px-4 pb-6 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Left side PDF placeholder */}
                    <div className="border border-dashed border-slate-300 rounded-2xl bg-white flex flex-col items-center justify-center min-h-[500px] lg:h-[calc(100vh-200px)] text-slate-400 shadow-sm">
                        <FileText className="w-16 h-16 mb-4 text-slate-300 opacity-80" />
                        <p className="text-[15px] font-medium text-slate-400/80">Bản xem trước tài liệu PDF sẽ hiển thị tại đây</p>
                    </div>

                    {/* Right side form */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-6">
                            <div className="flex items-start justify-between mb-5 pb-4 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800 text-[15px]">Thông tin Đồ án</h3>
                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${selectedStudent.status === 'Đã chấm' ? 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]' : 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]'}`}>
                                    {selectedStudent.status === 'Đã chấm' ? 'Đã chấm' : 'Đang chờ chấm'}
                                </span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Sinh viên thực hiện:</p>
                                    <p className="font-bold text-slate-800 text-[15px]">
                                        {selectedStudent.name} <span className="text-slate-500 font-medium ml-1">({selectedStudent.msv})</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1.5 mt-4">Đề tài:</p>
                                    <p className="font-semibold text-[#2563eb] text-sm leading-relaxed">
                                        Ứng dụng AI nhận diện khuôn mặt cho hệ thống điểm danh
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-6">
                            <h3 className="font-bold text-slate-800 text-[15px] mb-5 pb-4 border-b border-slate-100">Kết quả đánh giá</h3>
                            
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-6">
                                    <label className="text-xs font-bold text-slate-700 block mb-2 px-1">Điểm tổng <span className="text-red-500">*</span></label>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <input 
                                                {...register('score')}
                                                type="number" 
                                                disabled={viewMode === 'view'}
                                                placeholder="0.0"
                                                className={`w-24 px-4 py-2 border ${errors.score ? 'border-red-500' : 'border-slate-200'} rounded-xl text-center font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] disabled:bg-slate-50 disabled:text-slate-500 transition-all placeholder:font-medium placeholder:text-slate-400`}
                                                step="0.1"
                                            />
                                            <span className="text-slate-400 font-bold text-[15px]">/10</span>
                                        </div>
                                        {errors.score && <p className="text-xs text-red-500 mt-1">{errors.score.message}</p>}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="text-xs font-bold text-slate-700 block mb-2 px-1">Nhận xét</label>
                                    <textarea 
                                        {...register('comment')}
                                        disabled={viewMode === 'view'}
                                        placeholder="Ghi chú các điểm mạnh, điểm yếu và câu hỏi gợi ý cho hội đồng..."
                                        className={`w-full min-h-[140px] px-4 py-3 border ${errors.comment ? 'border-red-500' : 'border-slate-200'} rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] disabled:bg-slate-50 disabled:text-slate-500 resize-y transition-all placeholder:font-normal placeholder:text-slate-400`}
                                    ></textarea>
                                    {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment.message}</p>}
                                </div>

                                {viewMode === 'grade' && (
                                    <div className="flex justify-end mt-6 pt-5 border-t border-slate-100">
                                        <Button type="submit" className="bg-[#10b981] hover:bg-[#059669] text-white px-6 font-bold h-10 rounded-xl shadow-[0_1px_2px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02]">
                                            Hoàn tất chấm điểm
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

    return (
        <Card className="bg-white m-0 border-0 shadow-sm rounded-none md:rounded-2xl">
            <div className="p-5 md:p-8">
                <h2 className="text-center text-xl font-bold uppercase text-slate-800 md:text-2xl mb-8 tracking-wider">
                    CHẤM ĐIỂM PHẢN BIỆN
                </h2>

                <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-bold text-slate-600">STT</TableHead>
                                <TableHead className="font-bold text-slate-600">MSV</TableHead>
                                <TableHead className="font-bold text-slate-600">Họ và tên</TableHead>
                                <TableHead className="font-bold text-slate-600">Tên đề tài</TableHead>
                                <TableHead className="font-bold text-slate-600 text-center">Trạng thái</TableHead>
                                <TableHead className="font-bold text-slate-600 text-center">Điểm</TableHead>
                                <TableHead className="font-bold text-slate-600 text-center">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleData.map((item, index) => {
                                const isGraded = item.status === 'Đã chấm';
                                
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
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold border ${
                                                isGraded ? 'bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]' : 'bg-[#e0e7ff] text-[#6366f1] border-[#c7d2fe]'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-slate-700">
                                            {item.score !== null ? item.score : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={isGraded}
                                                    onClick={() => handleGoToGrade(item)}
                                                    className={`h-7 px-3 text-[11px] rounded-full font-bold transition-all ${
                                                        !isGraded 
                                                            ? 'border-[#e879f9] text-[#c026d3] bg-[#fdf4ff] hover:bg-[#fae8ff] hover:text-[#a21caf] shadow-sm' 
                                                            : 'border-slate-200 text-slate-400 bg-slate-50'
                                                    }`}
                                                >
                                                    Chấm điểm
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={!isGraded}
                                                    onClick={() => handleGoToView(item)}
                                                    className={`h-7 px-3 text-[11px] rounded-full font-bold transition-all ${
                                                        isGraded 
                                                            ? 'border-[#93c5fd] text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] hover:text-[#1d4ed8] shadow-sm' 
                                                            : 'border-slate-200 text-slate-400 bg-slate-50'
                                                    }`}
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {visibleData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-slate-500 font-medium">
                                        Không có dữ liệu đề tài
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
                                className={`h-9 min-w-9 px-2 font-bold transition-colors ${idx + 1 === currentPage
                                        ? 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
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
};

export default ReviewGrade;