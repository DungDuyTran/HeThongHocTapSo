"use client";
import React from "react";
import { format } from "date-fns";
import { useProfile } from "./hook/useProfile";
import { ProfileCard } from "./components/ProfileCard";
import { ProfileForm } from "./components/ProfileForm";

export default function ProfilePage() {
  const {
    user,
    formData,
    setFormData,
    isLoading,
    isSaving,
    handleUpdate,
    calculateAge,
  } = useProfile();

  if (isLoading && !user) {
    return (
      <div className="h-full flex items-center justify-center font-black italic text-green-600 animate-pulse text-2xl uppercase">
        Hệ thống đang quét dữ liệu...
      </div>
    );
  }

  const hoTenDisplay = formData.hoTen || user?.hoTen || "Người dùng Duy Tân";
  const lastUpdate = user?.ngayCapNhat
    ? format(new Date(user.ngayCapNhat), "dd/MM/yyyy HH:mm")
    : "N/A";

  return (
    <div className="flex flex-col h-full p-4 lg:p-6 animate-in fade-in duration-500 space-y-4 overflow-hidden">
      <header className="pb-3 flex-shrink-0">
        <h1 className="flex justify-center text-6xl font-black uppercase italic tracking-tighter text-black">
          Thông tin cá nhân
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-0 flex-grow">
        <ProfileCard user={user} hoTenDisplay={hoTenDisplay} />
        <ProfileForm
          formData={formData}
          setFormData={setFormData}
          isSaving={isSaving}
          handleUpdate={handleUpdate}
          age={calculateAge(user?.ngaySinh)}
          lastUpdate={lastUpdate}
        />
      </div>
    </div>
  );
}
