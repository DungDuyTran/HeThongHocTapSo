import { toast } from "sonner";

export const notifier = {
  // 1. Thông báo thành công
  success: (message: string, description?: string) => {
    toast.success(message, {
      description: description,
      className:
        "rounded-3xl border-2 border-slate-50 font-bold italic shadow-lg bg-green-700 text-white p-4",
    });
  },

  // 2. Thông báo lỗi
  error: (message: string, description?: string) => {
    toast.error(message, {
      description: description,
      className:
        "rounded-3xl border-2 border-slate-50 font-bold italic shadow-lg bg-red-600 text-white p-4",
    });
  },

  // 3. Thông báo cảnh báo
  warn: (message: string) => {
    toast.warning(message, {
      className:
        "rounded-3xl border-2 border-slate-50 font-bold italic shadow-lg bg-yellow-600 text-white p-4",
    });
  },

  // 4. Thông báo dạng chờ (Promise - Dùng khi gọi API hoặc tải file)
  promise: <T>(promise: Promise<T>, loadingMsg: string, successMsg: string) => {
    return toast.promise(promise, {
      loading: loadingMsg,
      success: successMsg,
      error: (err: unknown) => {
        if (err instanceof Error) {
          return `Lỗi: ${err.message}`;
        }
        if (typeof err === "string") {
          return `Lỗi: ${err}`;
        }
        return "Thao tác thất bại";
      },
      className:
        "rounded-3xl border-2 border-slate-50 font-bold italic shadow-lg bg-blue-600 text-white p-4",
    });
  },
};
