import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, GraduationCap, User } from "lucide-react"

function App() {
  const [studentId, setStudentId] = useState('')

  return (
    // Container chính sử dụng Tailwind v4
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Hệ thống Quản lý Đồ án
          </CardTitle>
          <CardDescription>
            Khoa Công nghệ Thông tin - Thủy Lợi
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Nhập mã sinh viên..." 
                className="pl-10"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
          </div>
          
          <Button className="w-full gap-2" size="lg">
            <Search className="w-4 h-4" /> Tra cứu thông tin
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <div className="flex w-full gap-2">
            {/* Test các Variant khác nhau của Button */}
            <Button variant="outline" className="flex-1">Hỗ trợ</Button>
            <Button variant="ghost" className="flex-1">Đăng nhập</Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Phiên bản thử nghiệm React 19 + Tailwind v4
          </p>
        </CardFooter>
      </Card>

    </div>
  )
}

export default App