"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { format } from "date-fns";
import { notifier } from "@/lib/notifier";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useProfile() {
  const {
    data: user,
    mutate,
    isLoading,
  } = useSWR("/api/user/profile", fetcher);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    sdt: "",
    ngaySinh: "",
  });

  useEffect(() => {
    if (user && !user.error) {
      setFormData({
        hoTen: user.hoTen || "",
        email: user.email || "",
        sdt: user.sdt || "",
        ngaySinh: user.ngaySinh
          ? format(new Date(user.ngaySinh), "yyyy-MM-dd")
          : "",
      });
    }
  }, [user]);

  // Hàm tính tuổi
  const calculateAge = (birthDateString: string | null | undefined): string => {
    if (!birthDateString) return "---";
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age.toString();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // RÀNG BUỘC: Số điện thoại phải đúng 10 chữ số
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.sdt)) {
      notifier.warn(
        "Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số. ⚠️",
      );
      return;
    }

    setIsSaving(true);
    // Sử dụng notifier.promise để hiện trạng thái chờ
    const updatePromise = axios.put("/api/user/profile", {
      ...formData,
      email: user?.email, // Đảm bảo email gửi đi luôn là email gốc
    });

    notifier.promise(
      updatePromise,
      "Đang cập nhật hồ sơ...",
      "Lưu thông tin thành công! ✅",
    );

    try {
      await updatePromise;
      await mutate();
    } catch (error) {
      notifier.error("Lỗi cập nhật!", "Không thể lưu hồ sơ lúc này.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user,
    formData,
    setFormData,
    isLoading,
    isSaving,
    handleUpdate,
    calculateAge,
  };
}
