import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ChangePasswordModal from '@/components/ChangePasswordModal'
import { business } from '@/data/businessData'
import { User } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
function Field({ label = "sd", value }) {
  return (
    <div className='flex items-center gap-6 px-10 flex-col sm:flex-row'>
      <span className="w-44  text-left text-sm font-semibold text-[#5c60c0] shrink-0">
        {label}
      </span>

      <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">
        {value}
      </div>
    </div> 
  )
}

const ProfilePageBusiness = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)

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
        <div className="p-6 space-y-4 bg-[#FCFCFC]">

          <Field label="Mã số thuế:" value={business.maST} />
          <Field label="Tên doanh nghiệp:" value={business.tenDN} />
          <Field label="Địa chỉ:" value={business.diachi} />
          <Field label="Email:" value={business.email} />
          <Field label="Website:" value={business.website} />
          <div className = "flex items-center justify-center">
            <Button onClick = {() => setShowPasswordModal(true)}>Đổi mật khẩu</Button>
          </div>
        </div>
      </Card>

      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  )
}

export default ProfilePageBusiness