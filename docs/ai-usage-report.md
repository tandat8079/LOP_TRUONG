# Báo cáo sử dụng AI

## AI hỗ trợ phát triển

Codex hỗ trợ đọc README/đề xuất/PDF, tạo HTML/CSS/JavaScript, nối luồng dữ liệu, viết tài liệu và kiểm tra. Nhóm cần tự đọc, giải thích, điều chỉnh và ghi nhận đóng góp thực tế; tài liệu này không xác nhận phân công hay lịch sử Git của thành viên.

## Ba tính năng AI mô phỏng

| Tính năng | Đầu vào | Quy tắc | Hành động sau kết quả |
|---|---|---|---|
| Agenda Recommender | Chủ đề/mục tiêu, agenda, sức chứa | Tách từ khóa; đếm so khớp tiêu đề/chủ đề; loại hết chỗ, đã lưu hoặc trùng giờ | Chấp nhận vào agenda, bỏ qua, sửa từ khóa/chạy lại |
| Conflict Resolver | Session trong agenda | Sắp theo giờ bắt đầu, giữ phiên đầu tiên không giao với các phiên đã giữ | Xem danh sách bỏ rồi áp dụng hoặc bỏ qua và sửa thủ công |
| Interest Forecast | Lượt đặt, quan tâm, số phản hồi | round(đặt × 0,7 + quan tâm × 0,4 + phản hồi × 0,3), xếp theo tỷ lệ/sức chứa | Đề xuất phòng đủ sức chứa không trùng giờ; người dùng chấp nhận hoặc bỏ qua |

Mã: `js/modules/ai.js`, giao diện: `js/main.js`.

## Trạng thái và giải thích

- Recommender kiểm tra tối thiểu 2 ký tự, hiển thị đang xử lý, lý do phù hợp; không có kết quả hướng dẫn sửa từ khóa/agenda.
- Conflict Resolver báo không trùng nếu lịch hợp lệ; kết quả giải thích ưu tiên giờ bắt đầu sớm, xác nhận trước khi áp dụng.
- Forecast hiển thị xử lý, công thức và mức tin cậy; ít hơn 10 phản hồi là độ tin cậy thấp. Không có phòng phù hợp hướng dẫn sửa phòng/lịch thủ công.
- Đây là quy tắc cố định, chưa hiệu chỉnh sai số bằng dữ liệu thực, không sử dụng ML/API. Không đánh giá thời gian di chuyển, thanh toán hoặc sở thích dài hạn.
- Không gửi dữ liệu cá nhân ra ngoài trình duyệt.
