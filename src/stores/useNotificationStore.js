// Store notification riêng (tạo file mới: store/useNotificationStore.js)
import { create } from 'zustand';

// eslint-disable-next-line no-unused-vars
const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  total: 0,
  loading: false,
  
  // Actions
  setNotifications: (data) => set({
    notifications: data.data || [],
    unreadCount: data.unread_count || 0,
    total: data.total || 0
  }),
  
  markAsRead: (notificationId) => set((state) => {
    const updated = state.notifications.map(n => 
      n.id === notificationId ? { ...n, is_read: true } : n
    );
    return {
      notifications: updated,
      unreadCount: updated.filter(n => !n.is_read).length
    };
  }),
  
  clearStore: () => set({
    notifications: [],
    unreadCount: 0,
    total: 0
  })
}));

export default useNotificationStore;