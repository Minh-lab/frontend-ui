import { useState } from "react";

export default function FileUpload({ value, onChange, placeholder = "Keo tha file vao day" }) {
  const [drag, setDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) onChange(file.name);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => {
        const names = ["bao_cao_doan3.pdf", "de_cuong.pdf", "bao_cao_thuc_tap3.pdf"];
        onChange(names[Math.floor(Math.random() * names.length)]);
      }}
      className={`cursor-pointer border-2 rounded-lg flex flex-col items-center justify-center py-6 gap-2 transition ${drag ? "border-indigo-400 bg-indigo-50" : "border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50"}`}
    >
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      <span className="text-sm text-indigo-500 font-medium">{value || placeholder}</span>
    </div>
  );
}
