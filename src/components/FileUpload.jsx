import { useState, useRef } from "react";

export default function FileUpload({ value, onChange, placeholder = "Kéo thả file vào đây hoặc click để chọn" }) {
  const [drag, setDrag] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file) {
      onChange(file);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Hiển thị tên file nếu value là đối tượng File
  const displayValue = value instanceof File ? value.name : (typeof value === "string" ? value : placeholder);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`cursor-pointer border-2 border-dashed rounded-lg flex flex-col items-center justify-center py-8 gap-2 transition ${drag ? "border-indigo-400 bg-indigo-50" : "border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50"}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
      />
      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      <div className="text-center px-4">
        <p className="text-sm text-indigo-500 font-semibold truncate max-w-xs">{displayValue}</p>
        <p className="text-[10px] text-gray-400 mt-1">Hỗ trợ PDF, PNG, JPG (Tối đa 3MB)</p>
      </div>
    </div>
  );
}
