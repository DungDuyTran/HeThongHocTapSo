# Hệ Thống Học Tập Số Thông Minh (Smart Digital Learning Platform)

**Đồ án Tốt nghiệp - Chuyên ngành Kỹ thuật Phần mềm - Đại học Duy Tân (DTU)**

---

## Giới thiệu dự án

Dự án là một hệ sinh thái học tập "All-in-one" được thiết kế nhằm hỗ trợ sinh viên tối ưu hóa lộ trình học tập, quản lý thời gian và tài liệu khoa học. Ứng dụng tập trung vào trải nghiệm người dùng hiện đại với phong cách thiết kế **Neo-Brutalism** (viền đen đậm, đổ bóng cứng) đầy cá tính và mạnh mẽ.

## Chức năng chính

### 1. Thời gian biểu (Schedule)

- Tích hợp **FullCalendar** hỗ trợ kéo thả, thay đổi kích thước sự kiện và hiển thị đa chế độ (Tháng, Tuần, Ngày).
- Logic được tách biệt vào Custom Hook và đồng bộ nhanh với LocalStorage giúp ứng dụng hoạt động mượt mà kể cả khi offline.

### 2. Danh sách việc cần làm (Todo List)

- Thuật toán sắp xếp thông minh dựa trên trọng số độ ưu tiên.
- Áp dụng **Optimistic UI** qua SWR, giúp giao diện phản hồi tức thì mà không cần đợi phản hồi từ server.

### 3. Kho tài liệu số (Document Storage)

- Sử dụng **UploadThing** để tải và lưu trữ tài liệu trực tiếp trên Cloud.
- Tích hợp **Office Web Viewer API** cho phép xem trực tiếp các file Word, Excel, PowerPoint ngay trên trình duyệt.

### 4. Flashcard & Quiz

- Hệ thống ôn tập thẻ bài sử dụng thuật toán xáo trộn đảm bảo tính ngẫu nhiên tuyệt đối.
- Tính năng trắc nghiệm thông minh tự động tạo các phương án nhiễu (Distractors) từ dữ liệu sẵn có.
- Có thể xem lại bài kiểm tra đã hoàn thành cùng các đáp án mà bạn chọn.

### 5. Thống kê năng suất (Statistics)

- Biểu đồ hóa tiến độ học tập bằng thư viện **Recharts**.
- Thuật toán gom nhóm dữ liệu (Aggregation) ở Backend giúp dữ liệu hiển thị liên tục và chính xác trên biểu đồ đường và cột.

## Công nghệ sử dụng

- **Frontend:** Next.js 15+ (App Router), Tailwind CSS, Lucide React.
- **State Management:** Zustand, SWR.
- **Backend:** Node.js, Route Handlers.
- **Database & ORM:** MySQL, Prisma ORM.
- **Dịch vụ:** UploadThing (Cloud Storage), Gemini AI (Smart AI features).

## Kiến trúc hệ thống

Ứng dụng được xây dựng theo mô hình kiến trúc phân lớp nhằm đảm bảo nguyên lý **Single Responsibility** (Trách nhiệm đơn nhất):

- **Repository Layer:** Giao tiếp Database.
- **Service Layer:** Xử lý logic nghiệp vụ và thuật toán.
- **Controller:** Điều hướng yêu cầu API.
