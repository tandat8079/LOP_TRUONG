# Kiểm tra demo — 02/10/2026

Kiểm tra bằng Chrome headless / Playwright với server localhost, sau đó khôi phục dữ liệu mẫu trong browser kiểm thử.

- 16 màn hình tải thành công; không ghi nhận JavaScript page error hoặc HTTP lỗi.
- Cả 16 trang kiểm tra ở 390, 768 và 1440 px: không tràn ngang toàn trang.
- Đã xem ảnh chụp danh mục desktop và mobile.
- Gợi ý Product → chấp nhận session → lưu agenda.
- Thêm/bỏ agenda, tham gia danh sách chờ; tạo lịch trùng và áp dụng Conflict Resolver.
- Gửi phản hồi → hiển thị trong speaker insights.
- Tạo session: chặn trùng phòng, cho phép khung giờ khác; reload vẫn giữ dữ liệu.
- Tạo người dùng: chặn email trùng; tạo rồi xóa có xác nhận.
- Interest Forecast → xem phòng phù hợp → áp dụng đổi phòng.
- Lưu metadata tài liệu PDF.
- Tạo nháp thông báo → phát hành → hiển thị trong hộp thông báo người tham dự.
- Mở sidebar trên mobile.
- `node --check` thành công với ba file JavaScript.

Giới hạn: chưa kiểm tra trên Safari/Firefox hoặc thiết bị thật; chưa có video OBS, backend hay xác minh Git/PR của nhóm. Kiểm tra responsive đo tràn toàn trang, không thay thế việc rà soát mọi nội dung trên mọi thiết bị.
