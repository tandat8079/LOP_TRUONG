# Project Proposal - EventPulse

## 1. Thông tin dự án

- Tên đề tài: EventPulse – Thiết kế trải nghiệm sự kiện nhiều phiên
- Học phần: Phát triển ứng dụng web cơ bản
- Loại dự án: Frontend prototype, nhiều vai trò, nhiều màn hình, dữ liệu giả lập
- Lĩnh vực: EventTech / Giải trí & sự kiện
- Nhóm thực hiện: 4 sinh viên
  - Đỗ Xuân Lộc (ID: 2451170920)
  - Nguyễn Văn Cường (ID: 2451170869)
  - Tạ Hoàng Thương (ID: 2451170948)
  - Nguyễn Xuân Trường
- Mục tiêu: xây dựng một hệ thống web mô phỏng trải nghiệm quản lý và theo dõi sự kiện nhiều phiên với các vai trò khác nhau.

## 2. Tóm tắt dự án

EventPulse là một sản phẩm frontend mô phỏng hệ thống quản lý sự kiện nhiều phiên, giúp người dùng từ nhiều vai trò khác nhau tương tác với hệ thống một cách trực quan và dễ hiểu. Dự án tập trung vào việc thiết kế một nền tảng web cho người tham dự, diễn giả, ban tổ chức và quản trị viên, trong đó mỗi vai trò có các chức năng nghiệp vụ riêng biệt nhưng cùng hướng tới mục tiêu tối ưu hóa trải nghiệm sự kiện.

Sản phẩm không chỉ tập trung vào UI đẹp mà còn đánh giá khả năng hiểu nghiệp vụ, xây dựng luồng người dùng, xử lý dữ liệu giả lập, tương tác JavaScript và mô phỏng trải nghiệm AI. EventPulse nhằm giải quyết các vấn đề thực tế như xung đột lịch trình, khó quản lý phòng, thiếu thông tin theo dõi và khó lên kế hoạch cá nhân cho người tham dự.

## 3. Bối cảnh và vấn đề thực tế

Trong các sự kiện lớn, đặc biệt là sự kiện nhiều phiên với nhiều chủ đề và lịch trình đồng thời, người tham dự thường gặp phải các khó khăn sau:

- Lịch trình của sự kiện quá dài và khó tìm session phù hợp.
- Nhiều session diễn ra cùng thời điểm, gây xung đột và khó lựa chọn.
- Người tham dự không biết session nào đáng tham dự dựa trên sở thích cá nhân.
- Ban tổ chức khó theo dõi phòng, lịch trình và mức độ quan tâm của người tham dự.
- Diễn giả cần quản lý thông tin cá nhân, tài liệu và session của mình một cách rõ ràng.
- Quản trị viên thiếu dữ liệu phân tích để xác định xu hướng tham gia và mức hiệu quả của sự kiện.

Vì vậy, cần có một hệ thống hỗ trợ cho tất cả các bên liên quan, từ việc khám phá sự kiện, lên agenda cá nhân, quản lý phòng, theo dõi session đến phân tích dữ liệu và dự báo xu hướng.

## 4. Mục tiêu của dự án

### 4.1 Mục tiêu tổng quát
- Xây dựng giao diện web cho nhiều vai trò trong một sự kiện nhiều phiên.
- Mô phỏng quy trình thực tế của người tham dự, diễn giả, ban tổ chức và quản trị viên.
- Tạo trải nghiệm người dùng rõ ràng, thân thiện và có tính tương tác cao.
- Sử dụng dữ liệu giả lập để mô phỏng các nghiệp vụ CRUD và trạng thái của hệ thống.
- Tích hợp ít nhất 3 tính năng AI mô phỏng trên frontend.
- Thiết kế responsive trên desktop, tablet và mobile.
- Phát triển theo quy trình làm việc nhóm rõ ràng bằng GitHub, nhánh, commit và pull request.

### 4.2 Mục tiêu cụ thể
- Thiết kế tối thiểu 3 màn hình cho mỗi vai trò chính.
- Tạo luồng nghiệp vụ end-to-end từ khám phá đến xử lý kết quả.
- Cho phép người dùng tìm kiếm, lọc, xem chi tiết và hành động trên dữ liệu.
- Tối ưu hóa trải nghiệm AI như gợi ý agenda, phát hiện xung đột lịch và dự báo quan tâm.
- Thiết kế trạng thái đầy đủ: bình thường, đang tải, rỗng, lỗi, thành công, chờ xử lý, từ chối, hủy và hoàn thành.

## 5. Vai trò người dùng

### 5.1 Người tham dự
Người tham dự muốn khám phá các session, tìm session phù hợp với sở thích, lưu lịch trình cá nhân và cung cấp phản hồi. Họ cần các chức năng như:

- Xem danh sách session và chi tiết session.
- Tìm kiếm, lọc theo chủ đề, ngày, thời gian, diễn giả.
- Lưu session vào lịch trình cá nhân.
- Gửi đánh giá và phản hồi.
- Nhận đề xuất session phù hợp bằng AI.

### 5.2 Diễn giả
Diễn giả muốn quản lý hồ sơ cá nhân, session của mình và tài liệu trình bày. Họ cần:

- Quản lý hồ sơ cá nhân.
- Theo dõi danh sách session đang tham gia.
- Upload và cập nhật tài liệu, slide, nội dung liên quan.
- Cập nhật trạng thái bài thuyết trình.

### 5.3 Ban tổ chức
Ban tổ chức cần quản lý hiệu quả sự kiện, điều phối lịch trình và phòng học. Họ cần:

- Quản lý session và phòng.
- Theo dõi trạng thái sự kiện.
- Cập nhật thông báo và cảnh báo.
- Phát hiện xung đột giữa các session.
- Điều chỉnh lịch trình khi cần thiết.

### 5.4 Quản trị viên
Quản trị viên chịu trách nhiệm quản lý hệ thống chung và phân tích hiệu quả sự kiện. Họ cần:

- Quản lý người dùng và ticket.
- Theo dõi báo cáo thống kê và tỷ lệ tham gia.
- Dự báo xu hướng quan tâm của người tham dự.
- Giám sát hiệu suất và tình trạng hệ thống sự kiện.

## 6. Lợi ích mà dự án mang lại

- Giảm thời gian người dùng tìm kiếm và lựa chọn session phù hợp.
- Giảm nhầm lẫn trong quản lý lịch trình và phòng tổ chức.
- Tăng trải nghiệm cá nhân hóa cho từng đối tượng tham gia.
- Tạo nền tảng mô phỏng hệ thống sự kiện thực tế cho các bài tập thực hành web.
- Rèn luyện kỹ năng thiết kế UX/UI, lập trình frontend và quản lý dự án.

## 7. Các màn hình chính của hệ thống

Dự án sẽ xây dựng các giao diện theo vai trò, tối thiểu như sau:

### 7.1 Người tham dự
- Session catalog
- My agenda
- Session feedback

### 7.2 Diễn giả
- Speaker profile
- My session
- Session materials

### 7.3 Ban tổ chức
- Session management
- Room management
- Event alerts

### 7.4 Quản trị viên
- Ticket type management
- User management
- Event analytics

Bên cạnh đó, các màn hình dùng chung có thể được bổ sung như: đăng nhập, đăng ký, quên mật khẩu, hồ sơ cá nhân, thông báo, 404, 403 và cài đặt tài khoản.

## 8. Tính năng nghiệp vụ chính

### 8.1 Tính năng cho người tham dự
- Xem danh sách session và lọc theo chủ đề, ngôn ngữ, ngày hoặc diễn giả.
- Đánh dấu favorite hoặc lưu vào agenda cá nhân.
- Tạo lịch trình cá nhân dựa trên sở thích và thời gian rảnh.
- Chia sẻ phản hồi sau khi tham dự session.
- Nhận gợi ý session theo AI.

### 8.2 Tính năng cho diễn giả
- Cập nhật thông tin cá nhân và chuyên môn.
- Quản lý session đã đăng ký và hiện đang diễn ra.
- Upload tài liệu, slide hoặc hình ảnh minh họa.
- Cập nhật trạng thái bài trình bày và thời lượng.

### 8.3 Tính năng cho ban tổ chức
- Tạo, chỉnh sửa, xóa hoặc lưu trữ session.
- Quản lý phòng và lịch sử hoạt động.
- Cập nhật thông báo sự kiện và cảnh báo.
- Kiểm tra xung đột lịch trình và thay đổi của từng session.

### 8.4 Tính năng cho quản trị viên
- Xem số lượng người tham gia theo từng session.
- Quản lý ticket, quyền truy cập và người dùng.
- Theo dõi hiệu suất sự kiện qua báo cáo thống kê.
- Dự đoán session nào sẽ thu hút người tham gia nhiều nhất.

## 9. Tính năng AI bắt buộc

### AI-1: Agenda Recommender
AI đề xuất các session phù hợp với sở thích, chủ đề quan tâm và thời gian của người tham dự. Trải nghiệm người dùng cần gồm các bước:

- Người dùng nhập sở thích hoặc mục tiêu tham dự.
- Hệ thống xử lý và đưa ra danh sách đề xuất.
- Hiển thị lý do vì sao session đó phù hợp.
- Người dùng có thể chấp nhận, chỉnh sửa, lưu hoặc từ chối đề xuất.

### AI-2: Conflict Resolver
Khi có xung đột về thời gian hoặc phòng, AI gợi ý session thay thế hoặc sắp xếp lại lịch trình tối ưu hơn. Mục tiêu là giúp ban tổ chức và người tham dự giảm rủi ro thiếu thông tin hoặc trùng lịch.

### AI-3: Interest Forecast
AI phân tích dữ liệu giả lập như lượng lưu session, số lượng phản hồi và mức độ quan tâm để dự đoán session nào sẽ hot hơn. Kết quả này hỗ trợ ban tổ chức và quản trị viên lên kế hoạch tài nguyên, phòng và nhân sự.

## 10. Nguyên tắc thiết kế trải nghiệm AI

AI không được chỉ là một ô chat trang trí. Mỗi tính năng AI phải có quy trình rõ ràng:

- Người dùng nhập dữ liệu.
- Hệ thống kiểm tra dữ liệu đầu vào.
- AI đang xử lý.
- Kết quả hiển thị.
- Giải thích lý do kết quả.
- Người dùng có thể chấp nhận, sửa, thử lại hoặc bỏ qua.
- Kết quả được lưu vào hệ thống hoặc chuyển sang trạng thái tiếp theo.

Ngoài ra, mỗi AI feature cần có trạng thái thất bại hoặc không chắc chắn để phản ánh môi trường thực tế, ví dụ:

- Không đủ dữ liệu.
- AI không chắc chắn về kết quả.
- Không thể xử lý yêu cầu lúc này.

## 11. Kỹ thuật và công nghệ đề xuất

- HTML5
- CSS3
- JavaScript
- Responsive Web Design
- Mock data / JSON / LocalStorage
- Git + GitHub
- Trello / Jira / Notion
- Tùy chọn: API giả lập, JSON server hoặc mockapi

## 12. Phạm vi MVP

### Bắt buộc phải có
- Đủ vai trò và màn hình theo bảng kiểm kê đã được duyệt.
- Navigation xuyên suốt và thân thiện với người dùng.
- Responsive trên nhiều kích thước màn hình.
- CRUD mô phỏng có ý nghĩa.
- Tìm kiếm, lọc, validation biểu mẫu.
- Dữ liệu giả lập hoặc API mẫu.
- Tối thiểu 3 tính năng AI mô phỏng.
- Lịch sử Git, nhánh, commit và pull request rõ ràng.
- Video OBS chứng minh từng màn hình.

### Nên có
- Bảng điều khiển thống kê.
- Thông báo nổi.
- Trạng thái đang tải, rỗng và lỗi.
- Thiết kế component tái sử dụng.
- Giao diện tối ưu cho khả năng tiếp cận.

## 13. Kế hoạch triển khai và phân công

### Nhóm 3 sinh viên
- SV1: phụ trách vai trò người tham dự, cùng với một phần giao diện dùng chung và responsive.
- SV2: phụ trách vai trò diễn giả, dữ liệu giả lập và tương tác JavaScript.
- SV3: phụ trách vai trò ban tổ chức và quản trị viên, điều hướng tổng thể, dashboard và tích hợp dự án.

Mỗi thành viên đều phải tham gia vào ít nhất một luồng end-to-end từ thiết kế, HTML, CSS, JavaScript, dữ liệu, responsive, Git và OBS. Điều này giúp tránh tình trạng mỗi người chỉ làm một phần rời rạc.

### Giai đoạn thực hiện
1. Nghiên cứu đề tài và xác định mục tiêu.
2. Phân tích vai trò và màn hình cần thiết.
3. Thiết kế khung dây và bản mô phỏng.
4. Xây dựng layout và style chuẩn.
5. Thiết kế JS tương tác và xử lý dữ liệu.
6. Triển khai AI mock-up và trạng thái xử lý.
7. Kiểm tra responsive và validation.
8. Tổng hợp tài liệu và chuẩn bị video OBS.

## 14. Tiêu chí đánh giá

Dự án sẽ được đánh giá dựa trên các tiêu chí sau:

- Độ đầy đủ nghiệp vụ của từng vai trò.
- Tính logic của luồng người dùng.
- Chất lượng UI/UX và responsive.
- Tính tương tác và độ ổn định của JavaScript.
- Sự rõ ràng của dữ liệu giả lập và trạng thái hệ thống.
- Chất lượng của tính năng AI mô phỏng.
- Quy trình làm việc nhóm và cách quản lý GitHub.
- Độ hoàn thiện của tài liệu và video minh chứng.

## 15. Kết luận

EventPulse là một dự án frontend phù hợp với yêu cầu của BTL-32, kết hợp giữa UX/UI, logic nghiệp vụ, tương tác JavaScript và trải nghiệm AI. Dự án không chỉ tập trung vào việc tạo giao diện đẹp mà còn yêu cầu người thực hiện hiểu rõ vấn đề của hệ thống sự kiện nhiều phiên, thiết kế luồng hoạt động hợp lý và xử lý các trạng thái người dùng một cách thực tế.

Thay vì xây dựng một web đơn lẻ, nhóm sẽ xây dựng một hệ thống mô phỏng sự kiện lớn với nhiều vai trò, nhiều màn hình và nhiều chức năng liên quan. Đây là cơ hội để mỗi thành viên rèn luyện kỹ năng phân tích nghiệp vụ, làm việc nhóm, lập trình web cơ bản và quản lý dự án theo đúng chuẩn của môn học.

## 16. Tài liệu liên quan

- BTL-32 – EventPulse – Thiết kế trải nghiệm sự kiện nhiều phiên
- README.md
- Roles and features
- Screen list
- AI usage report

## 17. Lời cam kết của nhóm

Nhóm cam kết thực hiện dự án với tinh thần nghiêm túc, tuân thủ quy định của học phần, xây dựng sản phẩm có tính thực tế, rõ ràng, có logic nghiệp vụ và có đủ minh chứng trong quá trình làm việc để đáp ứng các yêu cầu của giảng viên.
