"use client";
import React from "react";
import { useSchedule } from "./hooks/useSchedule";
import ScheduleHeader from "./components/ScheduleHeader";
import ScheduleView from "./components/ScheduleView";
import EventModal from "./components/EventModal";
import CategoryModal from "./components/CategoryModal";
import { notifier } from "@/lib/notifier";

export default function SchedulePage() {
  const { events, categories, popups, setPopups, form, setForm, sync } =
    useSchedule();

  const handleSave = () => {
    // 1. Kiểm tra tên công việc
    if (!form.title.trim()) {
      notifier.error("Thiếu thông tin!", "Bạn ơi, nhập tên hoạt động đã nhé.");
      return;
    }

    // Lỗi 2: Xóa 1 trong 2 hoặc xóa cả 2 thời điểm
    if (!form.start || !form.end) {
      notifier.warn("Bạn chọn ngày bắt đầu/kết thúc đã nhé.");
      return;
    }

    const startTime = new Date(form.start).getTime();
    const endTime = new Date(form.end).getTime();

    // Lỗi 1: Thời điểm bắt đầu và kết thúc trùng nhau
    if (startTime === endTime) {
      notifier.warn("Thời điểm bắt đầu và kết thúc trùng nhau!");
      return;
    }

    // Tính năng bảo vệ thêm: Thời gian kết thúc không được trước thời gian bắt đầu
    if (startTime > endTime) {
      notifier.warn("Thời điểm kết thúc không thể trước thời điểm bắt đầu!");
      return;
    }

    const cate = categories.find((c) => c.id === form.categoryId);
    const baseData = { ...form, backgroundColor: cate?.color || "#16a34a" };

    if (popups.add) {
      if (form.days && form.days.length > 0) {
        const recurringEvents: any[] = [];
        const startBase = new Date(form.start);
        const endBase = new Date(form.end);
        const duration = endBase.getTime() - startBase.getTime();

        for (let i = 0; i < 7; i++) {
          const current = new Date(startBase);
          current.setDate(startBase.getDate() + i);

          if (form.days.includes(current.getDay())) {
            const newStart = new Date(current);
            const newEnd = new Date(newStart.getTime() + duration);

            recurringEvents.push({
              ...baseData,
              id: crypto.randomUUID(),
              start: newStart.toISOString(),
              end: newEnd.toISOString(),
            });
          }
        }
        sync([...events, ...recurringEvents]);
        notifier.success(
          "Thành công!",
          `Đã lặp lại ${recurringEvents.length} hoạt động trong tuần.`,
        );
      } else {
        sync([...events, { ...baseData, id: crypto.randomUUID() }]);
        notifier.success("Tuyệt vời!", "Đã thêm lịch học mới.");
      }
    } else {
      sync(events.map((e) => (e.id === form.id ? baseData : e)));
      notifier.success("Cập nhật thành công!");
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
          notifier.success("Đã dời lịch!", "Thời gian đã thay đổi.");
        }}
        onDateSelect={(info: any) => {
          if (info.view.type === "dayGridMonth") {
            notifier.warn(
              "Để lịch trình chính xác, hãy chuyển sang chế độ xem Tuần hoặc Ngày để thêm hoạt động nhé! ",
            );
            return;
          }

          setForm({
            id: "",
            title: "",
            start: info.startStr.slice(0, 16),
            end: info.endStr.slice(0, 16),
            note: "",
            categoryId: "1",
            days: [],
          });
          setPopups({ ...popups, add: true });
        }}
        onEventClick={(info: any) => {
          const found = events.find((e) => e.id === info.event.id);
          if (found) {
            setForm({ ...found, days: [] });
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
