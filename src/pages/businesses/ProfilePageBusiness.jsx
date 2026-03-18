import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ChangePasswordModal from '@/components/ChangePasswordModal'
import { business } from '@/data/businessData'
import { User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import profileCompany from '@/services/company/profileCompany'
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
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileCompany.getProfile();
        setProfile(data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);
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

          <Field label="Mã số thuế:" value={profile?.user?.usercode} />
          <Field label="Tên doanh nghiệp:" value={profile?.user?.name} />
          <Field label="Địa chỉ:" value={profile?.user?.address} />
          <Field label="Email:" value={profile?.user?.email} />
          <Field label="Website:" value={profile?.user?.website} />
          <div className="flex items-center justify-center">
            <Button onClick={() => setShowPasswordModal(true)}>Đổi mật khẩu</Button>
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