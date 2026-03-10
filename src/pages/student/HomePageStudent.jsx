import StatusBadge from "@/components/StatusBadge";
import { doAn, thucTap } from "../../data/studentData";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const steps = [
  { label: "Dang ky", done: true },
  { label: "Cho duyet", done: true },
  { label: "Bao cao", done: false, failed: true },
  { label: "Bao ve", done: false, num: 4 },
];

function StepIcon({ done, failed, num }) {
  if (done) return <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center text-green-600">✓</div>;
  if (failed) return <div className="w-8 h-8 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center text-red-500">x</div>;
  return <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center text-gray-500 text-sm font-bold">{num}</div>;
}


export default function HomePageStudent() {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap gap-3 justify-end">
        <Button className="bg-gray-400 hover:bg-gray-500">Dang ky dot do an</Button>
        <Button className="bg-[#5c60c0] hover:bg-[#4a4ea8] ">Dang ky dot thuc tap</Button>
        <Button className="bg-red-400 hover:bg-red-500 ">Yeu cau huy do an</Button>
        <Button className="bg-gray-400 hover:bg-gray-500 ">Yeu cau huy thuc tap</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#5c60c0] text-white px-4 py-2.5 flex items-center justify-between">
            <div className="text-sm font-semibold">Thong tin thuc tap</div>
            <StatusBadge status={thucTap.trangThai} />
          </div>
          <div className="p-4 space-y-1">
            <p className="font-bold text-gray-800 text-base">{thucTap.tenDN}</p>
            <p className="text-sm text-gray-500">Vi tri: {thucTap.viTri}</p>
            <p className="text-sm text-gray-500">GVHD thuc tap: {thucTap.gvhd}</p>
            <button onClick={() => navigate("/student/intern-reports")} className="bg-[#e6ecff] mt-3 w-full border border-indigo-300 text-[#5c60c0] text-sm font-medium py-2 rounded-lg hover:bg-indigo-50 transition">Truy cap =&gt;</button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#5c60c0] text-white px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm font-semibold">Tien do do an</span>
            <button onClick={() => navigate("/student/project-reports")} className="text-xs text-blue-200 hover:text-white underline">Xem chi tiet</button>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between relative mb-4">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0 mx-6" />
              {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1 z-10">
                  <StepIcon done={s.done} failed={s.failed} num={s.num} />
                  <span className="text-xs text-gray-500 mt-1">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="text-sm space-y-1 border-t border-gray-100 pt-3">
              <p className="text-gray-700 text-center font-bold">Ten de tai: {doAn.tenDeTai}</p>
              <p className="text-gray-500">Trang thai: <span className="text-orange-500 font-medium">{doAn.trangThai}</span></p>
              <p className="text-gray-500">GVHDDA : {doAn.gvhd}</p>
              <p className="text-gray-500">GVPB : {doAn.gvpb}</p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => navigate("/student/register-topic")} className="w-full bg-[#ecf9ff] border border-[#ecf9ff] rounded-xl p-6 flex flex-col items-center gap-2 hover:border-indigo-400 transition group">
        <p className="text-base font-semibold text-gray-700 group-hover:text-[#5c60c0] transition">Ngan hang de tai</p>
        <p className="text-sm text-gray-400">Tham khao 200+ de tai co san</p>
      </button>
    </div>
  );
}
