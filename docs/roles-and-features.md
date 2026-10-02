# Vai trò và tính năng

| Vai trò | Chức năng đã triển khai | Dữ liệu |
|---|---|---|
| Người tham dự | Tìm/lọc, xem chi tiết, thêm/bỏ agenda, danh sách chờ, phản hồi nháp/gửi/sửa/xóa | sessions, agenda, waitlist, feedback |
| Diễn giả | Cập nhật hồ sơ, sửa nội dung session, lưu/xóa metadata tài liệu, xem phản hồi ẩn danh | profile, sessions, materials, feedback |
| Ban tổ chức | CRUD session/phòng, kiểm tra trùng phòng/diễn giả, nháp/phát hành/xóa thông báo, dự báo và đổi phòng | sessions, rooms, alerts |
| Quản trị viên | CRUD loại vé/người dùng, analytics, cấu hình sự kiện, audit, khôi phục seed | tickets, users, settings, audit |

## Quy tắc nghiệp vụ

- Chỉ thêm agenda nếu session còn chỗ; thêm/bỏ lịch cập nhật lượt đặt và quan tâm.
- Session đầy cho phép tham gia hoặc hủy danh sách chờ; demo không tự động chuyển danh sách chờ thành vé.
- Thời gian xung đột: cùng ngày và khoảng giờ giao nhau; giờ kết thúc bằng giờ bắt đầu phiên sau không tính trùng.
- Session mới/sửa phải kết thúc sau bắt đầu, phòng đủ sức chứa và không trùng phòng hoặc diễn giả.
- Hủy session loại nó khỏi danh mục, agenda và danh sách chờ; giữ bản ghi trong quản lý.
- Không xóa phòng đang được session sử dụng; đổi tên/sức chứa phòng cập nhật session liên quan.
- Không giảm sức chứa xuống dưới số người đã đặt. Không cho email người dùng hoặc tên phòng trùng.
- Phản hồi gửi yêu cầu ít nhất 20 ký tự có nội dung; nháp không yêu cầu đủ độ dài.
- Metadata tài liệu chỉ nhận PDF/PPT/PPTX, dung lượng 1 byte đến 10 MB.

Các vai trò trong demo không phải ranh giới bảo mật. Dữ liệu nằm trên cùng trình duyệt/origin.
