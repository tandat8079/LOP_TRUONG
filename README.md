# EventPulse

## Giới thiệu dự án

EventPulse là một dự án Frontend mô phỏng hệ thống quản lý và trải nghiệm sự kiện nhiều phiên trong lĩnh vực EventTech. Dự án hướng đến việc xây dựng giao diện web cho các vai trò khác nhau trong một sự kiện lớn, từ người tham dự, diễn giả, ban tổ chức đến quản trị viên.

Mục tiêu của EventPulse là tạo ra một giao diện có tính thực tế, dễ sử dụng và có luồng nghiệp vụ rõ ràng. Thay vì chỉ là một trang web đơn lẻ, hệ thống được thiết kế như một nền tảng đa màn hình, giúp người dùng dễ dàng tìm kiếm session, lên lịch trình cá nhân, quản lý phòng, theo dõi thông báo và đánh giá hiệu quả sự kiện.

## Vấn đề dự án giải quyết

Sự kiện nhiều phiên thường gây ra các khó khăn sau:
- lịch trình quá dài và khó định hướng;
- nhiều session diễn ra cùng thời điểm, gây xung đột;
- người tham dự khó lựa chọn nội dung phù hợp;
- ban tổ chức thiếu công cụ để theo dõi phòng và cảnh báo kịp thời;
- quản trị viên thiếu dữ liệu phân tích để đánh giá hiệu quả sự kiện.

EventPulse giải quyết những vấn đề này bằng cách xây dựng trải nghiệm người dùng rõ ràng, dữ liệu giả lập và các tính năng hỗ trợ như tìm kiếm, lọc, AI gợi ý và báo cáo thống kê.

## Các vai trò chính

### 1. Người tham dự
- xem danh sách session;
- tìm kiếm, lọc và lưu vào agenda cá nhân;
- gửi phản hồi sau khi tham dự;
- nhận gợi ý session phù hợp nhờ AI.

### 2. Diễn giả
- quản lý hồ sơ cá nhân;
- theo dõi session của mình;
- cập nhật tài liệu và nội dung trình bày;
- quản lý trạng thái bài thuyết trình.

### 3. Ban tổ chức
- quản lý session và phòng tổ chức;
- cập nhật cảnh báo và thông báo sự kiện;
- phát hiện xung đột lịch trình;
- điều phối hoạt động của sự kiện.

### 4. Quản trị viên
- quản lý người dùng và ticket;
- theo dõi báo cáo thống kê sự kiện;
- giám sát hiệu suất và xu hướng tham gia;
- dự báo session hot nhờ dữ liệu giả lập.

## Tính năng chính

- giao diện frontend cho nhiều vai trò khác nhau;
- danh sách session và bộ lọc tìm kiếm;
- agenda cá nhân cho người tham dự;
- quản lý session, phòng, thông báo và phản hồi;
- biểu đồ / dashboard thống kê cho quản trị viên;
- responsive trên desktop, tablet và mobile;
- dữ liệu giả lập bằng JSON / LocalStorage / mock data;
- 4 tính năng AI mô phỏng ở frontend.

## Tính năng AI mô phỏng

### AI-1: Agenda Recommender
Gợi ý session phù hợp với sở thích và lịch trình cá nhân của người tham dự.

### AI-2: Conflict Resolver
Phát hiện lịch trình trùng lặp và đề xuất session thay thế hoặc bố trí tối ưu hơn.

### AI-3: Capacity Forecast
Dự đoán session nào có khả năng thu hút nhiều người dựa trên dữ liệu giả lập.

### AI-4: Feedback Summary
Tổng hợp phản hồi ẩn danh theo từ khóa, loại bản trùng, hiển thị nguồn; cho phép chấp nhận, sửa hoặc từ chối và nhập tóm tắt thủ công.

## Công nghệ sử dụng

- HTML5
- CSS3
- JavaScript
- Responsive Web Design
- Mock data / JSON / LocalStorage
- Git + GitHub
- Trello / Jira / Notion

## Mục tiêu học tập

Dự án giúp nhóm rèn luyện các kỹ năng:
- thiết kế UX/UI;
- lập trình web cơ bản;
- xử lý dữ liệu giả lập và tương tác JS;
- xây dựng luồng nghiệp vụ thực tế;
- quản lý tiến độ dự án và làm việc nhóm bằng GitHub.

## Kết luận

EventPulse là một dự án Frontend thực hành về thiết kế trải nghiệm sự kiện nhiều phiên, với trọng tâm là giao diện, luồng người dùng và tương tác thực tế. Dự án không chỉ mang tính thẩm mỹ mà còn tập trung vào việc mô phỏng các nghiệp vụ quản lý sự kiện theo hướng ứng dụng thực tế cho người dùng.

Thông qua dự án này, nhóm mong muốn xây dựng một sản phẩm có tính thực tế, rõ logic và hoàn thiện về trải nghiệm người dùng, đồng thời đáp ứng yêu cầu bài tập lớn của môn học.

## Tài liệu liên quan

- Tên dự án: EventPulse
- Môn học: Phát triển ứng dụng web cơ bản
- Đề xuất chi tiết dự án: [docs/project-proposal.md](docs/project-proposal.md)
- Mô tả vai trò và tính năng: [docs/roles-and-features.md](docs/roles-and-features.md)
- Danh sách màn hình: [docs/screen-list.md](docs/screen-list.md)
- Báo cáo sử dụng AI: [docs/ai-usage-report.md](docs/ai-usage-report.md)


## Chạy demo đã triển khai

Không cần npm hoặc backend. Chạy HTTP server từ thư mục dự án để dùng LocalStorage và IndexedDB trên cùng origin:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Truy cập **http://127.0.0.1:8080**. Nhấn Ctrl+C trong Terminal để dừng server.
Dùng menu **Chuyển vai trò demo** ở cuối sidebar để truy cập bốn vai trò.

### Cấu trúc triển khai

- `index.html`: trang chủ sự kiện riêng theo trang 1 PDF, điểm vào bốn workspace.
- `pages/`: 16 màn hình workspace (4 trang mỗi vai trò), ngoài trang chủ; tương ứng bản `figma-eventpulse2.pdf`.
- `css/style.css`, `css/responsive.css`: giao diện và responsive.
- `js/api.js`: kho dữ liệu giả lập, LocalStorage, xuất CSV.
- `js/modules/ai.js`: quy tắc mô phỏng bốn tính năng AI.
- `js/main.js`: render giao diện, điều hướng, validation và tương tác.
- `assets/data/mock-data.json`: bản dữ liệu mẫu tham khảo. `js/api.js` chứa cùng dữ liệu để mở trực tiếp HTML mà không cần fetch. Khi thay seed, cập nhật cả hai file.
- `assets/images/`: ba ảnh session trích xuất từ PDF Figma được cung cấp.

### Kịch bản demo

1. Người tham dự: tìm/lọc session → xem chi tiết → thêm agenda → tham gia/hủy danh sách chờ khi hết chỗ → gửi/sửa/xóa phản hồi.
2. AI Agenda Recommender: chọn “Xem gợi ý”, nhập `Product`, xem lý do rồi chấp nhận hoặc bỏ qua.
3. Conflict Resolver: thêm hai phiên 13:30 và 13:45 (cần tăng sức chứa phiên Fintech trước, vì seed đã đầy) → vào Agenda → xem/áp dụng đề xuất.
4. Diễn giả: sửa hồ sơ → xem session → chọn tài liệu → xem phản hồi trong Phân tích session.
5. Ban tổ chức: thêm/sửa/lưu trữ session, quản lý phòng → tạo nháp/phát hành thông báo → chạy dự báo → chấp nhận phương án đổi phòng phù hợp.
6. Quản trị viên: sửa giá/quota/cửa sổ bán vé → khóa/mở khóa người dùng → xem analytics → sửa cấu hình và nhật ký. Vé đã bán và doanh thu lịch sử được giữ nguyên.
7. AI Summary: gửi phản hồi session AI đã hoàn thành → Diễn giả / Phân tích session → tạo tóm tắt → xem nguồn → chấp nhận hoặc chỉnh sửa.
8. Dữ liệu giữ lại sau reload trên cùng origin. Khôi phục ở **Quản trị viên → Cấu hình & Audit → Khôi phục dữ liệu mẫu**.

### Giới hạn demo

- Vai trò là bộ chuyển giao diện, không phải đăng nhập hay phân quyền bảo mật.
- AI chạy bằng quy tắc JavaScript, không gọi mô hình hoặc API bên ngoài.
- Tệp mới được lưu cục bộ bằng IndexedDB (PDF/PPT/PPTX/DOCX/MP4, tối đa 200 MB). Metadata nằm trong LocalStorage. Tài liệu mẫu trong PDF không có nội dung tệp để tải.
- Vé chỉ quản lý loại vé, không xử lý thanh toán. Thông báo được mô phỏng trong trình duyệt.
- Nếu LocalStorage không khả dụng hoặc hết dung lượng, ứng dụng báo lỗi và giữ dữ liệu trong phiên hiện tại.
- Git/PR, phân công thực tế và video OBS cần nhóm thực hiện; demo không tạo bằng chứng giả.

## Bản thiết kế mới (06/10/2026)

Nguồn: [figma-eventpulse2.pdf](figma-eventpulse2.pdf), 17 trang. Đối chiếu chi tiết và giới hạn: [docs/pdf-update.md](docs/pdf-update.md). Dữ liệu demo dùng 9 session, 5 phòng, 5 tài khoản và 4 loại vé; các số đếm lấy từ dữ liệu hiện tại, không gắn cứng 48 session/1.482 tài khoản của bản mẫu. Nếu trình duyệt đang có dữ liệu v1, ứng dụng chuyển dữ liệu sang v2 và giữ thay đổi; dùng Khôi phục dữ liệu mẫu để xem seed mới.
