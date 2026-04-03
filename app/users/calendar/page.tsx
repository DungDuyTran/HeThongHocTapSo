"use client";
import React from "react";
import { useSchedule } from "./hooks/useSchedule";
import ScheduleHeader from "./components/ScheduleHeader";
import ScheduleView from "./components/ScheduleView";
import EventModal from "./components/EventModal";
import CategoryModal from "./components/CategoryModal";
import { notifier } from "@/lib/notifier"; // Import notifier

export default function SchedulePage() {
  const { events, categories, popups, setPopups, form, setForm, sync } =
    useSchedule();

  // Logic xử lý lưu
  const handleSave = () => {
    if (!form.title.trim()) {
      notifier.error("Thiếu thông tin!", "Dũng ơi, nhập tên hoạt động đã nhé.");
      return;
    }

    const cate = categories.find((c) => c.id === form.categoryId);
    const data = { ...form, backgroundColor: cate?.color || "#16a34a" };

    if (popups.add) {
      sync([...events, { ...data, id: crypto.randomUUID() }]);
      notifier.success("Tuyệt vời!", "Đã thêm lịch học mới vào hệ thống.");
    } else {
      sync(events.map((e) => (e.id === form.id ? data : e)));
      notifier.success(
        "Cập nhật thành công!",
        "Thông tin lịch trình đã thay đổi.",
      );
    }

    setPopups({ ...popups, add: false, edit: false });
  };

  const handleDelete = () => {
    if (confirm("Bạn chắc chắn muốn xóa hoạt động này chứ?")) {
      sync(events.filter((e) => e.id !== form.id));
      notifier.warn("Hoạt động đã được gỡ khỏi lịch.");
      setPopups({ ...popups, edit: false });
    }
  };

  return (
    <div className="p-8 space-y-4 bg-white min-h-screen no-scrollbar">
      <ScheduleHeader onOpenCate={() => setPopups({ ...popups, cate: true })} />

      <ScheduleView
        events={events}
        onEventChange={(fc: any) => {
          sync(
            events.map((e) =>
              e.id === fc.id
                ? { ...e, start: fc.startStr, end: fc.endStr || fc.startStr }
                : e,
            ),
          );
          notifier.info(
            "Đã dời lịch!",
            "Thời gian hoạt động đã được thay đổi.",
          );
        }}
        onDateSelect={(info: any) => {
          setForm({
            id: "",
            title: "",
            start: info.startStr.slice(0, 16),
            end: info.endStr.slice(0, 16),
            note: "",
            categoryId: "1",
          });
          setPopups({ ...popups, add: true });
        }}
        onEventClick={(info: any) => {
          const found = events.find((e) => e.id === info.event.id);
          if (found) {
            setForm(found);
            setPopups({ ...popups, edit: true });
          }
        }}
      />

      {(popups.add || popups.edit) && (
        <EventModal
          type={popups.add ? "add" : "edit"}
          form={form}
          setForm={setForm}
          categories={categories}
          onClose={() => setPopups({ ...popups, add: false, edit: false })}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {popups.cate && (
        <CategoryModal
          categories={categories}
          onSync={(newCats: any) => sync(events, newCats)}
          onClose={() => setPopups({ ...popups, cate: false })}
        />
      )}
    </div>
  );
}
