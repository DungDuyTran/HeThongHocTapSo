import { create } from 'zustand';

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string | Date;
  isRead: boolean;
}

interface NotificationState {
  notifications: Notification[];
  totalUnread: number;
  fetchNotifications: (userId: number) => Promise<void>;
  markAsRead: (id: string, userId: number) => Promise<void>;
  unreadCount: () => number;
  addNotification: (title: string, message: string) => void; 
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  totalUnread: 0,
  
  fetchNotifications: async (userId: number) => {
    try {
      const res = await fetch(`/api/notifications?page=1`, {
        headers: { "x-user-id": userId.toString() }
      });
      if (!res.ok) return;
      const result = await res.json();
      set({ 
        notifications: result.data || [], 
        totalUnread: result.unreadCount || 0 
      });
    } catch (error) {
      console.error("Lỗi fetch notification:", error);
    }
  },

  markAsRead: async (id: string, userId: number) => {
    // Update UI nhanh
    set((state) => ({
      notifications: state.notifications.map((n) => 
        n.id === id ? { ...n, isRead: true } : n
      ),
      totalUnread: Math.max(0, state.totalUnread - 1)
    }));

    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "x-user-id": userId.toString() }
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái đọc:", error);
    }
  },

  addNotification: (title, message) => {
    console.log("Thông báo hệ thống:", title, message);
    
    const newNoti = {
      id: Math.random().toString(),
      title,
      message,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    set((state) => ({
      notifications: [newNoti, ...state.notifications].slice(0, 20),
    }));
  },

  unreadCount: () => get().totalUnread,
}));