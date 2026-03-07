import Modal from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { business } from '@/data/businessData'
import { User } from 'lucide-react'
import React, { useState } from 'react'

function Field({ label = "sd", value }) {
  return (
    <div className='flex items-center gap-6 px-[40px] flex-col sm:flex-row'>
      <span className="w-44  text-left text-sm font-semibold text-[#5c60c0] flex-shrink-0">
        {label}
      </span>

      <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">
        {value}
      </div>
    </div> 
  )
}

const ProfilePageBusiness = () => {
  const [showPwC,setShowPwC] = useState(false)
  const [pwd, setPwd] = useState({ current: "", new1: "", new2: "" });

  const handleChangePassword = () => {
  if (pwd.new1 !== pwd.new2) {
    alert("Mat khau moi khong trung");
    return;
  }

  console.log("Gui len server:", pwd);

  // goi API doi mat khau
};

  return (
    <div className='p-6'>
      <Card className="p-0">

        {/* Header */}
        <div className="bg-[#5c60c0] text-white px-3 py-2 rounded-t-lg flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>

          <span className="font-semibold text-base">
            Thông tin doanh nghiệp
          </span>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          <Field label="Mã số thuế:" value={business.maST} />
          <Field label="Tên doanh nghiệp:" value={business.tenDN} />
          <Field label="Địa chỉ:" value={business.diachi} />
          <Field label="Email:" value={business.email} />
          <Field label="Website:" value={business.website} />
          <div className = "flex items-center justify-center">
            <Button onClick = {() => setShowPwC(true)}>Đổi mật khẩu</Button>
          </div>
        </div>  


        {showPwC && (
                <Modal title="Doi mat khau" onClose={() => setShowPwC(false)} size="sm">
                          <div className="space-y-4">
                            {[ ["Mat khau hien tai", "current"], ["Mat khau moi", "new1"], ["Xac nhan mat khau moi", "new2"] ].map(([lbl, key]) => (
                              <div key={key}>
                                <label className="text-sm font-medium text-gray-700 block mb-1.5">{lbl}</label>
                                <input type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={pwd[key]} onChange={(e) => setPwd({ ...pwd, [key]: e.target.value })} />
                              </div>
                            ))}
                            <div className="flex justify-end gap-3 pt-2">
                              <button onClick={() => setShowPwC(false)} className="px-5 py-2.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">Huy</button>
                              <button onClick={handleChangePassword} className="px-5 py-2.5 text-sm bg-[#5c60c0] text-white rounded-lg hover:bg-[#4a4ea8] font-medium transition">Xac nhan</button>
                            </div>
                          </div>
                        </Modal>
              )}

        

      </Card>
    </div>
  )
}

export default ProfilePageBusiness