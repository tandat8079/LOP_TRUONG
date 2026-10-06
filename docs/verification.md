# Kiểm tra demo — 06/10/2026

Đối chiếu `figma-eventpulse2.pdf` (17 trang). Kiểm tra bằng Chrome headless / Playwright trên HTTP server localhost, với dữ liệu kiểm thử tách khỏi trình duyệt người dùng.

- Trang chủ và 16 trang workspace tải thành công, không có lỗi JavaScript hoặc HTTP trong bộ kiểm tra chính.
- Cả 17 trang ở 390, 768, 1440 px không tràn ngang toàn trang. Bảng rộng có vùng cuộn riêng.
- Đã xem ảnh trang chủ desktop/mobile, catalog, analytics, speaker insights và forecast; sửa bố cục heatmap để bảng nằm trong cột chính.
- Recommender: nhập Product → xem gợi ý → chấp nhận vào agenda.
- Diễn giả: tạo session → gửi duyệt → không xuất hiện công khai; Ban tổ chức duyệt → xuất hiện trong catalog.
- Feedback: gửi nhận xét → hiển thị ở insights → tạo AI Summary có nguồn → chấp nhận tóm tắt.
- Tệp: tải PDF thử lên IndexedDB → xuất bản → hiển thị ở Chi tiết session → tải lại đúng tên; bản lưu trữ bị ẩn khỏi người tham dự.
- Phòng: chặn giảm dưới số chỗ đã đặt; xem lịch; lưu trữ/khôi phục phòng trống.
- Forecast: phân tích → chọn phòng đủ sức chứa/không trùng giờ → cập nhật session → tạo nháp thông báo.
- Conflict Resolver: chuyển PMF sang bản ghi → bỏ chỗ trực tiếp; xuất lịch `.ics`.
- Vé: chặn quota nhỏ hơn số đã bán; đổi giá không làm thay đổi doanh thu đã ghi nhận.
- Tài khoản: khóa có lý do và giữ bản ghi.
- Thông báo: gửi có xác nhận → hiển thị ở người tham dự.
- Hồ sơ và cấu hình: đổi tên diễn giả/tên sự kiện → trang chủ nhận cùng dữ liệu.
- Migration: dữ liệu v1 giữ agenda/tên sự kiện và chuyển id phản hồi cá nhân sang định dạng theo session.
- Mobile: mở sidebar thành công. `node --check` đạt cho cả ba file JavaScript; `git diff --check` đạt.

Ảnh hiện tại: [desktop](../design/mockups/desktop.png), [mobile](../design/mockups/mobile.png).

Giới hạn xác minh: Chrome headless, chưa Safari/Firefox hoặc thiết bị thật. Chưa kiểm thử giới hạn file 200 MB, toàn bộ loại file, ảnh avatar 5 MB, mọi nhánh lịch gửi và mọi quyền tài liệu. Xuất PDF có CSS in, chưa xác minh bản PDF lưu bằng hộp thoại in. Chưa có backend, đăng nhập/MFA, gửi thông báo thật, video OBS hoặc deploy. Đối chiếu đầy đủ và giới hạn demo: [pdf-update.md](pdf-update.md).
