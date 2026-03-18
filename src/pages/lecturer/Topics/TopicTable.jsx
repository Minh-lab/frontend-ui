import React, { useMemo } from "react";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ITEMS_PER_PAGE = 6;

const TopicTable = ({ topics, expertises, safePage, totalPages, onPageChange, onEdit, onDelete }) => {
  const pageItems = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    return pages;
  }, [totalPages]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">STT</TableHead>
              <TableHead>Mã đề tài</TableHead>
              <TableHead>Tên đề tài</TableHead>
              <TableHead>Chuyên môn</TableHead>
              <TableHead>Công nghệ</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-slate-500">
                  Không tìm thấy đề tài.
                </TableCell>
              </TableRow>
            ) : (
              topics.map((item, index) => (
                <TableRow key={item.topic_id}>
                  <TableCell>{(safePage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                  <TableCell>#{item.topic_id}</TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    {item.expertise?.name || expertises?.find((e) => e.expertise_id === item.expertise_id)?.name || "—"}
                  </TableCell>
                  <TableCell className="text-xs">{item.technologies || "—"}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.description}</TableCell>
                  <TableCell>
                    <span
                      className={
                        item.is_available
                          ? "rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
                          : "rounded-full bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700"
                      }
                    >
                      {item.is_available ? "Khả dụng" : "Đã đăng ký"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Xóa đề tài"
                        onClick={() => onDelete(item.topic_id)}
                      >
                        <Trash2 className="size-4 text-slate-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Sửa đề tài"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="size-4 text-slate-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          disabled={safePage === 1}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {pageItems.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={item === safePage ? "default" : "ghost"}
              onClick={() => onPageChange(item)}
              className="h-8 min-w-8 px-2"
            >
              {item}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
          disabled={safePage === totalPages}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default TopicTable;
