import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ChangePasswordModal from '@/components/ChangePasswordModal'
import { User } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import adminService from '@/services/adminService'

function Field({ label = "", value }) {
  return (
    <div className='flex items-center gap-6 px-10 flex-col sm:flex-row'>
      <span className="w-44 text-left text-sm font-semibold text-[#5c60c0] shrink-0">
        {label}
      </span>

      <div className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">
        {value}
      </div>
    </div> 
  )
}

/**
 * Consolidated Profile Component for Admin, Faculty, and Student
 * Uses same UI as Business Profile
 */
const Profile = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState(null)
  const [role, setRole] = useState(null)

  // Fetch profile data từ API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if token exists before fetching
        const authData = JSON.parse(localStorage.getItem("auth-storage"))
        const token = authData?.state?.token
        
        if (!token) {
          toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại")
          setLoading(false)
          return
        }
        
        const response = await adminService.getProfile()
        
        if (response.success) {
          const userData = response.data.user
          const userRole = response.data.role
          
          setProfileData(userData)
          setRole(userRole)
        }
      } catch (error) {
        console.error("Fetch Profile Error:", error)
        toast.error(error.message || "Không thể tải thông tin cá nhân")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Determine role-specific title
  const getTitleByRole = () => {
    switch (role) {
      case "admin":
        return "Thông tin Quản trị viên"
      case "faculty_staff":
        return "Thông tin cán bộ khoa"
      case "student":
        return "Thông tin sinh viên"
      case "company":
        return "Thông tin doanh nghiệp"
      default:
        return "Thông tin cá nhân"
    }
  }

  // Determine role-specific fields to display
  const getFieldsByRole = () => {
    if (!profileData) return []
    
    // Format labels based on role
    const getCodeLabel = () => {
      switch (role) {
        case "admin":
          return "Mã quản trị viên:"
        case "faculty_staff":
          return "Mã nhân viên:"
        case "student":
          return "Mã sinh viên:"
        case "company":
          return "Mã số thuế:"
        default:
          return "Mã định danh:"
      }
    }

    // Format dob if it's an ISO timestamp
    const formatDob = (dob) => {
      if (!dob) return ""
      if (typeof dob === "string" && dob.includes("T")) {
        return dob.split("T")[0]
      }
      return dob
    }

    // For company/business role
    if (role === "company") {
      return [
        { label: getCodeLabel(), value: profileData.usercode || "" },
        { label: "Tên doanh nghiệp:", value: profileData.name || "" },
        { label: "Địa chỉ:", value: profileData.address || "" },
        { label: "Email:", value: profileData.email || "" },
        { label: "Website:", value: profileData.website || "" },
      ]
    }

    // For admin, faculty, student
    const baseFields = [
      { label: getCodeLabel(), value: profileData.usercode || "" },
      { label: "Họ và tên:", value: profileData.full_name || "" },
      { label: "Ngày sinh:", value: formatDob(profileData.dob) || "" },
      { label: "Giới tính:", value: profileData.gender || "" },
      { label: "Email:", value: profileData.email || "" },
    ]

    // Add additional fields for student
    if (role === "student") {
      // Add class field - backend returns "class" not "studentClass.class_name"
      if (profileData.class) {
        baseFields.push({
          label: "Lớp:",
          value: profileData.class
        })
      }
      // Add GPA field
      if (profileData.gpa) {
        baseFields.push({
          label: "GPA:",
          value: profileData.gpa
        })
      }
    }
    
    return baseFields
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5c60c0] mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  const fields = getFieldsByRole()
  const title = getTitleByRole()

  return (
    <div className='p-6'>
      <Card className="p-0">

        {/* Header */}
        <div className="bg-[#5c60c0] text-white px-3 py-2 rounded-t-lg flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>

          <span className="font-semibold text-base">
            {title}
          </span>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 bg-[#FCFCFC]">

          {fields.map((field, index) => (
            <Field key={index} label={field.label} value={field.value} />
          ))}

          <div className="flex items-center justify-center pt-4">
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

export default Profile
