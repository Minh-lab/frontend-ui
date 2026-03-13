import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null, // Lưu object user từ backend
      token: null,
      role: null, // 'student', 'lecturer', 'company', 'faculty', 'admin'
      isAuthenticated: false,

      // Actions
      setAuth: (userData, token, role) => {
        // Chuẩn hóa tên hiển thị vì database của bạn đặt tên khác nhau
        const displayName = userData.full_name || userData.name;
        
        set({
          user: { ...userData, displayName },
          token,
          role,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('auth-storage'); // Xóa sạch bộ nhớ
      },

      // Kiểm tra xem có phải lần đầu đăng nhập không (dựa trên database của bạn)
      isFirstLogin: () => {
        return get().user?.first_login === 1;
      },

      updateUser: (newUserData) => {
        set((state) => ({
          user: { ...state.user, ...newUserData },
        }));
      },
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;