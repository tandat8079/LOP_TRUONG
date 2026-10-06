# Vai trò và tính năng

| Vai trò | Chức năng | Dữ liệu |
|---|---|---|
| Trang chung | Giới thiệu sự kiện, lịch, diễn giả, phòng, AI, workspace, FAQ | settings, sessions, profile, rooms, tickets, alerts |
| Người tham dự | Tìm/lọc, giữ/gỡ chỗ, chờ, ghi chú, `.ics`, xử lý xung đột, phản hồi nháp/gửi/xóa | sessions, agenda, waitlist, notes, recordings, feedback |
| Diễn giả | Hồ sơ và ảnh, đề xuất session, tài liệu phiên bản, trả lời câu hỏi, AI tóm tắt có nguồn | profile, sessions, materials, feedback, questions, summaries |
| Ban tổ chức | Duyệt/lưu trữ session, phòng/thiết bị, lịch và validation, nháp/lên lịch/phát hành thông báo, dự báo/đổi phòng | sessions, rooms, alerts, forecasts |
| Quản trị viên | Giá/quota/cửa sổ bán vé, người dùng/khóa/mở khóa, analytics, cấu hình, audit | tickets, users, settings, audit |

## Quy tắc

- Chỉ session công khai được khám phá và thêm agenda; kiểm tra sức chứa khi xác nhận. Gỡ có xác nhận và giảm lượt đặt. Danh sách chờ chưa tự động chuyển thành vé.
- Nháp/chờ duyệt/từ chối/lưu trữ không xuất hiện trong catalog. Diễn giả gửi nội dung; Ban tổ chức gán lịch và phòng trước khi công khai.
- Session phải thuộc ngày sự kiện, kết thúc sau bắt đầu, mô tả ít nhất 80 ký tự, phòng đủ sức chứa, lịch không trùng phòng/diễn giả.
- Đổi tên/sức chứa phòng cập nhật session cùng nguồn. Không giảm dưới số đặt hoặc lưu trữ phòng còn session công khai.
- Đổi phòng tạo nháp thông báo; agenda lấy trực tiếp lịch mới. Phát hành thông báo yêu cầu xác nhận riêng.
- Phản hồi cho session đã hoàn thành và nằm trong agenda; mỗi session có phản hồi cá nhân riêng. Nháp không đưa vào AI Summary.
- Tài liệu chỉ hiển thị cho người tham dự khi xuất bản và phù hợp quyền. Tệp PDF/PPT/PPTX/DOCX/MP4 tối đa 200 MB được lưu bằng IndexedDB.
- Quota vé không thấp hơn đã bán. Đổi giá không thay doanh thu lịch sử. Vô hiệu hóa chỉ ngừng bán mới.
- Email người dùng và tên phòng không trùng. Khóa/mở khóa giữ tài khoản, vé và phản hồi.

Bản frontend mô phỏng luồng nghiệp vụ, không thực thi phân quyền bảo mật. Xem [đối chiếu PDF và giới hạn](pdf-update.md).
