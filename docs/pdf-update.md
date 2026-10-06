# Cập nhật theo PDF ngày 06/10/2026

Nguồn thiết kế: `figma-eventpulse2.pdf`, 17 trang. Giữ HTML/CSS/JavaScript thuần, một trang chung và bốn workspace, mỗi workspace bốn trang. Giao diện triển khai các trạng thái khi người dùng thao tác; không hiển thị đồng thời mọi ví dụ lỗi/thành công của bản thiết kế.

| Trang PDF | Màn hình | Nội dung cập nhật |
|---|---|---|
| 1 | Trang chủ | Hero, session nổi bật, lịch ba ngày, diễn giả, sơ đồ phòng, bốn AI, chọn workspace, cập nhật và FAQ |
| 2 | Khám phá session | Tìm/lọc, lưới/danh sách, sở thích, ngày/khung giờ, Recommender kiểm tra khoảng đệm 8 phút |
| 3 | Chi tiết session | Hồ sơ cùng nguồn, sức chứa, giữ/gỡ chỗ có xác nhận, tài liệu xuất bản theo quyền truy cập |
| 4 | Agenda | Lịch từ session hiện tại, thông báo phòng, ghi chú, lịch `.ics`, gỡ/chuyển bản ghi/giữ lịch khi có xung đột |
| 5 | Phản hồi | Session đã hoàn thành trong agenda, đánh giá tổng thể và ba tiêu chí, 20–1.000 ký tự, nháp/gửi/xóa, nguồn ẩn danh |
| 6 | Hồ sơ diễn giả | Tổ chức, chuyên môn, LinkedIn/website/X, tiểu sử 50–300 ký tự, ảnh JPG/PNG ≥600×600 và ≤5 MB, đồng bộ tên/tiểu sử |
| 7 | Session của tôi | Bộ lọc, tạo/sửa nháp, ba takeaway, gửi/rút duyệt, khôi phục bản nháp; diễn giả không gán lịch/phòng |
| 8 | Tài liệu | Lưu tệp thật trong IndexedDB, tối đa 200 MB, link HTTPS, phiên bản, nháp/xuất bản/lưu trữ/khôi phục/xóa |
| 9 | Phân tích session | Chọn session, phản hồi và câu hỏi, trả lời, AI tóm tắt có số nguồn, xác nhận/chỉnh sửa/từ chối hoặc nhập thủ công |
| 10 | Quản lý session | Duyệt và gán lịch/phòng, chặn trùng phòng/diễn giả, chặn phòng thiếu chỗ, đổi phòng tạo nháp thông báo, lưu trữ |
| 11 | Phòng & thiết bị | Thiết bị, lịch phòng, chặn giảm dưới lượt đặt, lưu trữ/khôi phục phòng; chặn lưu trữ phòng còn session công khai |
| 12 | Thông báo | Nhóm nhận/kênh, xem trước, nháp/lên lịch/gửi có xác nhận, hủy lịch, kết quả gửi demo; không sửa thông báo đã gửi |
| 13 | Capacity Forecast | Heatmap ngày 19/10, nguồn/công thức/mức tin cậy, bỏ session ít dữ liệu, bản lưu, chọn phòng đủ chỗ và không trùng lịch |
| 14 | Loại vé | Giá, quota, cửa sổ bán, vé đã bán, doanh thu lịch sử; vô hiệu hóa thay cho xóa vé đã bán |
| 15 | Người dùng | Tìm/lọc vai trò/trạng thái, khóa/mở khóa có lý do, giữ tài khoản và lịch sử, mô tả phạm vi quyền |
| 16 | Analytics | Cùng nguồn vé/người dùng/session, lọc vé/ngày, tỷ lệ đặt chỗ, doanh thu đã ghi nhận, xuất CSV hoặc in/lưu PDF |
| 17 | Cấu hình & Audit | Ngày/địa điểm/tên đồng bộ, khôi phục bản trước, trạng thái tích hợp demo, giữ dữ liệu gần nhất, lọc/xuất audit |

## Dữ liệu và giới hạn

- Seed gồm 9 session (6 công khai), 5 phòng, 5 tài khoản, 4 loại vé và 1.205 vé mẫu đã bán. Số liệu hiển thị từ dữ liệu dùng chung; không gắn cứng toàn bộ số đếm 48 session/1.482 tài khoản của PDF.
- Vé mẫu có doanh thu ghi nhận 832.450.000 VND. Sửa giá mới không tính lại các giao dịch cũ.
- Bộ chọn workspace chỉ đổi giao diện. Đăng nhập, MFA, quyền thực và tích hợp CRM/Check-in/Email/SMS cần backend; không triển khai bảo mật bằng LocalStorage.
- AI là mô phỏng có quy tắc, không gọi mô hình. Không gán phần trăm phù hợp/độ tin cậy học máy khi không có cơ sở. Recommender dùng từ khóa và khoảng đệm cố định; Summary nhóm từ khóa và hiển thị số nguồn thực có trong demo.
- Lên lịch thông báo chỉ lưu lịch dự kiến, không có tiến trình gửi tự động. Kết quả nhận là mô phỏng. Đổi phòng tạo nháp để Ban tổ chức xem và xác nhận phát hành.
- Tệp mới chỉ tồn tại trong IndexedDB của trình duyệt/origin hiện tại. Các tài liệu có tên trong PDF không kèm nội dung; nút tải bản mẫu thông báo rõ giới hạn này. Link HTTPS kiểm tra định dạng; không xác minh website bên ngoài tồn tại.
- Tùy chọn xem bản ghi chỉ ghi nhận lựa chọn và nhường chỗ trực tiếp; chưa cung cấp video. Sơ đồ phòng là minh họa từ danh sách phòng, không phải bản đồ địa điểm chính thức.
- Xuất PDF dùng hộp thoại in của trình duyệt, có CSS in; CSV tải trực tiếp. Không tạo file báo cáo PDF trên server.
- Audit được giữ trong thiết bị (50 mục gần nhất), chưa có lưu trữ tối thiểu 180 ngày như yêu cầu cho hệ thống thật.
- Dữ liệu v1 được chuyển sang v2 và giữ thay đổi cũ. Nếu cần xem đủ mẫu mới, chọn **Quản trị viên → Cấu hình & Audit → Khôi phục dữ liệu mẫu**. Tệp đã tải trước đó trong IndexedDB không tự xóa khi khôi phục seed.
