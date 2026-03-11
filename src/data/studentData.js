export const student = {
  maSV: "A123456",
  hoTen: "Nguyen Ngoc Tra My",
  ngaySinh: "2003-06-15",
  gioiTinh: "Nu",
  email: "tramynq@example.com",
  lop: "CNTT-K65",
  khoa: "Cong nghe thong tin",
  sdt: "0901234567",
  gpa: "3.45",
};

export const thucTap = {
  tenDN: "Cong ty A",
  viTri: "Fullstack intern",
  gvhd: "TS.Nguyen Thi Bich",
  trangThai: "Dang thuc hien",
};

export const doAn = {
  tenDeTai: "Chatbot ho tro tam ly",
  linhVuc: "Tri tue nhan tao (AI)",
  gvhd: "Ths.Nguyen Van A",
  gvpb: "Chua co",
  hoiDong: "Hoi dong 5",
  trangThai: "Dang xu ly",
};

export const registeredTopic = {
  ten: "Xay dung mo hinh du doan thien tai",
  linhVuc: "Tri tue nhan tao (AI)",
  gvhd: "Ths. Nguyen Thi Huong - CNTT",
  congNghe: "Python, FastAPI",
  moTa: "De tai mo phong mo hinh du doan theo du lieu lich su.",
  fileDeCuong: "de_cuong.pdf",
};

export const nganHangDeTai = [
  { ma: "DT.01.W", ten: "Xay dung mo hinh du doan thien tai", linhVuc: "AI", congNghe: "Python, TensorFlow", moTa: "Mo hinh du doan", daDangKy: false },
  { ma: "DT.02.W", ten: "Website ban do the thao ket hop chatbot", linhVuc: "Web, AI", congNghe: "React, Node.js", moTa: "Website ket hop chatbot", daDangKy: true },
  { ma: "DT.03.W", ten: "Machine learning du bao thoi tiet", linhVuc: "AI", congNghe: "Python", moTa: "Du bao thoi tiet", daDangKy: false },
];

export const giangVienList = [
  { id: 1, ten: "Ths. Nguyen Van A", initials: "NA", nganh: "CNTT", chuyenMon: ["Mang may tinh", "Lap trinh Web"], daDangKy: 7, max: 20, conNhan: true },
  { id: 2, ten: "TS. Dao Van B", initials: "DB", nganh: "ANM", chuyenMon: ["Mang may tinh", "An toan thong tin", "Quan tri Mang"], daDangKy: 19, max: 20, conNhan: true },
  { id: 3, ten: "Ths. Phan Thi C", initials: "PC", nganh: "HTTT", chuyenMon: ["He thong thong tin quan ly", "Phan tich du lieu lon"], daDangKy: 20, max: 20, conNhan: false },
  { id: 4, ten: "PGS.TS Hoang Thi D", initials: "HD", nganh: "KTPM", chuyenMon: ["DevOps", "Quan ly du an phan mem", "Phan tich thiet ke he thong"], daDangKy: 20, max: 20, conNhan: false },
];

export const baoCaoDoAnList = [
  { id: 1, ten: "Bao cao 1", thoiHanNop: "10-01-2026\n10:00", hanChot: "13-01-2026\n23:00", trangThai: "Da hoan thanh", ngayNop: "10-01-2026 11:00", nhanXetGV: "Bao cao trinh bay mach lac." },
  { id: 2, ten: "Bao cao 2", thoiHanNop: "20-01-2026\n10:00", hanChot: "23-01-2026\n23:00", trangThai: "Cho duyet", ngayNop: null, nhanXetGV: null },
  { id: 3, ten: "Bao cao 3", thoiHanNop: "11-02-2026\n10:00", hanChot: "14-02-2026\n23:00", trangThai: "Chua nop", ngayNop: null, nhanXetGV: null },
  { id: 4, ten: "Bao cao 4", thoiHanNop: "22-02-2026\n10:00", hanChot: "25-02-2026\n23:00", trangThai: "Chua nop", ngayNop: null, nhanXetGV: null },
];

export const baoCaoThucTapList = [
  { id: 1, ten: "De cuong thuc tap", thoiHanNop: "10-01-2026\n10:00", hanChot: "13-01-2026\n23:00", trangThai: "Da hoan thanh", ngayNop: "10-01-2026 11:00", nhanXetGV: "Bao cao dat yeu cau." },
  { id: 2, ten: "Bao cao thuc tap", thoiHanNop: "11-02-2026\n10:00", hanChot: "14-02-2026\n23:00", trangThai: "Chua nop", ngayNop: null, nhanXetGV: null },
];

export const notifications = [
  { id: 1, title: "Han nop bao cao sap den", time: "2 gio truoc", read: false },
  { id: 2, title: "De tai da duoc phe duyet", time: "1 ngay truoc", read: false },
  { id: 3, title: "Thong bao lich bao ve", time: "3 ngay truoc", read: true },
];
