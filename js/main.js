(() => {
  "use strict";
  const $ = (s) => document.querySelector(s),
    state = () => EP.state;
  const inPages = location.pathname.includes("/pages/"),
    base = inPages ? "../" : "";
  const page =
    location.pathname.split("/").pop().replace(".html", "") || "index";
  const route = page === "index" ? "home" : page;
  const groups = {
    attendee: [
      "Người tham dự",
      [
        ["session-catalog", "Khám phá session", "▦"],
        ["session-detail", "Chi tiết session", "◎"],
        ["my-agenda", "Agenda của tôi", "◷"],
        ["session-feedback", "Phản hồi session", "▤"],
      ],
    ],
    speaker: [
      "Diễn giả",
      [
        ["profile", "Hồ sơ diễn giả", "◎"],
        ["my-session", "Session của tôi", "▦"],
        ["session-materials", "Tài liệu session", "▤"],
        ["session-insights", "Phân tích session", "↗"],
      ],
    ],
    organizer: [
      "Ban tổ chức",
      [
        ["session-management", "Quản lý session", "▦"],
        ["room-management", "Phòng & thiết bị", "▣"],
        ["event-alerts", "Thông báo sự kiện", "♧"],
        ["interest-forecast", "Dự báo mức quan tâm", "↗"],
      ],
    ],
    admin: [
      "Quản trị viên",
      [
        ["ticket-type-management", "Loại vé", "▤"],
        ["user-management", "Người dùng", "◎"],
        ["event-analytics", "Phân tích sự kiện", "↗"],
        ["system-settings", "Cấu hình & Audit", "⚙"],
      ],
    ],
  };
  const role = route.split("-")[0] in groups ? route.split("-")[0] : "attendee";
  const e = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const url = (r, query = "") => `${base}pages/${r}.html${query}`;
  const link = (r, label, cls = "", query = "") =>
    /* HTML */ `<a class="button ${cls}" href="${url(r, query)}">${label}</a>`;
  const btn = (action, label, id = "", cls = "") =>
    /* HTML */ `<button
      type="button"
      class="${cls}"
      data-action="${action}"
      data-id="${id}"
      ${action === "notifications"
        ? 'aria-label="Thông báo"'
        : action === "close"
          ? 'aria-label="Đóng hộp thoại"'
          : ""}
    >
      ${label}
    </button>`;
  const badge = (text, bad = false) =>
    /* HTML */ `<span class="status ${bad ? "bad" : ""}">${e(text)}</span>`;
  const empty = (text) =>
    /* HTML */ `<div class="empty">
      <strong>${text}</strong>Thử thay đổi bộ lọc hoặc thêm dữ liệu mới.
    </div>`;
  const money = (n) => Number(n).toLocaleString("vi-VN") + " ₫";
  const sessions = () =>
    state().sessions.filter(
      (s) =>
        s.status !== "Đã hủy" &&
        (s.public ?? ["Đã duyệt", "Hoàn thành"].includes(s.status)),
    );
  const agenda = () => sessions().filter((s) => state().agenda.includes(s.id));
  const table = (headers, rows) =>
    /* HTML */ `<div class="table-wrap">
      <table>
        <thead>
          <tr>
            ${headers.map((h) => /* HTML */ `<th>${h}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.join("") ||
          /* HTML */ `<tr>
            <td colspan="${headers.length}">${empty("Chưa có dữ liệu")}</td>
          </tr>`}
        </tbody>
      </table>
    </div>`;
  const field = (name, label, value = "", type = "text", extra = "") =>
    /* HTML */ `<label
      >${label}<input
        name="${name}"
        type="${type}"
        value="${e(value)}"
        ${extra}
    /></label>`;
  const select = (name, label, options, value = "") =>
    /* HTML */ `<label
      >${label}<select name="${name}">
        ${options
          .map(
            (o) =>
              /* HTML */ `<option
                value="${e(o)}"
                ${o === value ? "selected" : ""}
              >
                ${e(o)}
              </option>`,
          )
          .join("")}
      </select></label
    >`;
  let toastTimer;
  function toast(message) {
    $("#toast").textContent = message;
    $("#toast").classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 3500);
  }
  let storageFailed = false;
  window.addEventListener("storage-error", () => {
    storageFailed = true;
    toast("Không thể lưu LocalStorage. Thay đổi chỉ giữ trong phiên hiện tại.");
  });
  function persist(message) {
    storageFailed = false;
    EP.save(message);
    if (!storageFailed) toast(message);
  }
  function modal(title, html) {
    $("#modal").innerHTML = /* HTML */ `<div class="modal-head">
        <h2>${title}</h2>
        ${btn("close", "✕")}
      </div>
      ${html}`;
    $("#modal").showModal();
  }
  function heading(title, description, action = "") {
    return /* HTML */ `<span class="eyebrow workspace-kicker"
        >${e(state().settings.event)} / WORKSPACE</span
      >
      <div class="page-heading">
        <div>
          <h1>${title}</h1>
          <p>${description}</p>
        </div>
        ${action}
      </div>`;
  }
  function shell() {
    const title =
      route === "attendee-session-detail"
        ? "Chi tiết session"
        : groups[role][1].find(([p]) => route === role + "-" + p)?.[1] ||
          "Không tìm thấy";
    $("#app").innerHTML = /* HTML */ `<div class="reference-strip">
        CSE122 / EventPulse / ${groups[role][0]} · 4 trang
        <span>${e(route)}.html</span>
      </div>
      <aside class="sidebar" id="sidebar">
        <a href="${base}index.html" class="brand"
          ><img src="${base}assets/icons/pulse.svg" alt="" />EventPulse</a
        ><a class="back-home" href="${base}index.html">← Trang chủ sự kiện</a>
        <div class="event-box">
          <span class="eyebrow">Sự kiện hiện tại</span
          ><strong>${e(state().settings.event)}</strong
          ><small>${e(eventDates())} · ${e(state().settings.location)}</small>
        </div>
        <nav class="nav" aria-label="Điều hướng chính">
          ${groups[role][1]
            .map(
              ([p, t, i]) =>
                /* HTML */ `<a
                  href="${url(role + "-" + p)}"
                  class="${route === role + "-" + p ? "active" : ""}"
                  ${route === role + "-" + p ? 'aria-current="page"' : ""}
                  ><span class="nav-icon" aria-hidden="true">${i}</span>${t}</a
                >`,
            )
            .join("")}${role === "attendee"
            ? /* HTML */ `<a href="#" data-action="notifications"
                ><span class="nav-icon">♧</span>Thông báo</a
              >`
            : ""}
        </nav>
        <div class="sidebar-bottom">
          <div class="help">
            <strong>ⓘ Workspace demo · CSE122</strong>
            <p>Khám phá, lên lịch và kết nối tại Vietnam Tech Summit.</p>
            ${btn("help", "Hướng dẫn demo", "", "link")}
          </div>
          <label class="role-label" for="role">Chuyển vai trò demo</label
          ><select id="role">
            ${Object.entries(groups)
              .map(
                ([k, [t]]) =>
                  /* HTML */ `<option
                    value="${k}"
                    ${role === k ? "selected" : ""}
                  >
                    ${t}
                  </option>`,
              )
              .join("")}
          </select>
        </div>
      </aside>
      <div class="shell">
        <header class="topbar">
          <div class="top-actions">
            <button
              class="menu-toggle"
              data-action="menu"
              aria-label="Mở điều hướng"
              aria-expanded="false"
            >
              ☰
            </button>
            <div class="breadcrumb">
              ⌂ &nbsp; ${groups[role][0]} / <strong>${title}</strong>
            </div>
          </div>
          <div class="top-actions">
            <span class="demo-label">DEMO</span>${btn(
              "notifications",
              "♧",
            )}<span class="avatar"
              >${role === "attendee"
                ? "NA"
                : role === "speaker"
                  ? "MA"
                  : role === "organizer"
                    ? "BT"
                    : "AD"}</span
            >
          </div>
        </header>
        <main id="content" tabindex="-1"></main>
        <footer class="workspace-footer">
          <span
            >Dữ liệu mô phỏng · Asia/Ho_Chi_Minh (GMT+7) · Đồng bộ cùng sự
            kiện</span
          ><a href="${base}index.html">Về Trang chủ →</a>
        </footer>
      </div>`;
    $("#role").addEventListener(
      "change",
      (ev) =>
        (location.href = url(
          ev.target.value + "-" + groups[ev.target.value][1][0][0],
        )),
    );
  }
  function card(s) {
    const saved = state().agenda.includes(s.id),
      wait = state().waitlist.includes(s.id),
      full = s.booked >= s.capacity;
    return /* HTML */ `<article class="session-card">
      <div class="cover">
        <img
          src="${base}assets/images/${s.image}-session.jpg"
          alt="Diễn giả và khán giả tại hội thảo"
          loading="lazy"
        /><span class="tag">${e(s.topic)}</span
        ><span
          class="status ${full
            ? "bad"
            : s.booked / s.capacity > 0.9
              ? "warn"
              : ""}"
          >${full
            ? "Đã đầy"
            : s.booked / s.capacity > 0.9
              ? "Sắp đầy"
              : "Còn chỗ"}</span
        >
      </div>
      <h3>${e(s.title)}</h3>
      <div class="speaker-line">
        <span class="avatar"
          >${e(
            s.speaker
              .split(" ")
              .slice(-2)
              .map((n) => n[0])
              .join(""),
          )}</span
        >${e(s.speaker)}
      </div>
      <div class="meta">
        <span>◷ ${e(s.start)}–${e(s.end)} · ${e(s.room)}</span
        ><strong
          class="${full
            ? "capacity-full"
            : s.booked / s.capacity > 0.9
              ? "capacity-warn"
              : ""}"
          >${s.booked}/${s.capacity} chỗ ·
          ${full
            ? "Đã đầy"
            : s.booked / s.capacity > 0.9
              ? "Sắp đầy"
              : "Còn chỗ"}</strong
        >
      </div>
      <progress
        class="${s.booked >= s.capacity
          ? "capacity-full"
          : s.booked / s.capacity > 0.9
            ? "capacity-warn"
            : ""}"
        value="${s.booked}"
        max="${s.capacity}"
        aria-label="Số chỗ đã đặt"
      ></progress>
      <div class="card-actions">
        ${link(
          "attendee-session-detail",
          "Xem chi tiết",
          "",
          `?id=${s.id}`,
        )}${btn(
          saved ? "remove-agenda" : full ? "waitlist" : "add-agenda",
          saved
            ? "✓ Đã thêm"
            : full
              ? wait
                ? "✓ Đang chờ"
                : "+ Tham gia chờ"
              : "+ Thêm lịch",
          s.id,
          "primary",
        )}
      </div>
    </article>`;
  }
  function filterCatalog() {
    const q = $("#search").value.trim().toLocaleLowerCase("vi");
    const rows = sessions().filter(
      (s) =>
        (s.title + " " + s.speaker).toLocaleLowerCase("vi").includes(q) &&
        (!$("#date").value || s.date === $("#date").value) &&
        (!$("#topic").value || s.topic === $("#topic").value) &&
        (!$("#speaker").value || s.speaker === $("#speaker").value) &&
        (!$("#availability").value ||
          ($("#availability").value === "full"
            ? s.booked >= s.capacity
            : s.booked < s.capacity)),
    );
    $("#count").textContent =
      `${rows.length} session · Vietnam Tech Summit 2026`;
    $("#catalog").innerHTML =
      rows.map(card).join("") || empty("Không tìm thấy session");
  }
  function detail() {
    const s = sessions().find(
      (s) =>
        s.id === Number(new URLSearchParams(location.search).get("id") || 1),
    );
    if (!s) {
      $("#content").innerHTML =
        empty("Session không tồn tại hoặc đã hủy") +
        link("attendee-session-catalog", "Về danh mục");
      return;
    }
    $("#content").innerHTML =
      heading(
        "Chi tiết session",
        "Thông tin đầy đủ trước khi thêm vào agenda cá nhân.",
        link("attendee-session-catalog", "← Quay lại danh mục"),
      ) +
      /* HTML */ `<div class="two-col">
        <section class="panel">
          <img
            class="detail-cover"
            src="${base}assets/images/${s.image}-session.jpg"
            alt="Hội thảo công nghệ"
          />
          <p><span class="tag">${e(s.topic)}</span></p>
          <h2 style="font-size:27px">${e(s.title)}</h2>
          <div class="facts">
            <span>▦ ${e(s.date)}</span><span>◷ ${e(s.start)}–${e(s.end)}</span
            ><span>⌖ ${e(s.room)}</span
            ><span>${s.booked}/${s.capacity} chỗ</span>
          </div>
          <h2>Về session</h2>
          <p>${e(s.description)}</p>
          <hr />
          <h2>Diễn giả</h2>
          <div class="speaker-line">
            <span class="avatar">${e(s.speaker.split(" ").pop()[0])}</span
            ><strong>${e(s.speaker)}</strong>
          </div>
          ${s.speaker === state().profile.name
            ? /* HTML */ `<p>
                  ${e(state().profile.position)} ·
                  ${e(state().profile.organization)}
                </p>
                <p>${e(state().profile.bio)}</p>`
            : ""}
          <hr />
          <h2>Tài liệu từ diễn giả</h2>
          ${table(
            ["Tài liệu", "Phiên bản", "Truy cập"],
            state()
              .materials.filter(
                (m) => m.sessionId === s.id && materialVisible(m),
              )
              .map(
                (m) =>
                  /* HTML */ `<tr>
                    <td>${e(m.name)}</td>
                    <td>v${m.version}</td>
                    <td>
                      ${m.url && safeHttps(m.url)
                        ? /* HTML */ `<a
                            href="${e(m.url)}"
                            target="_blank"
                            rel="noopener"
                            >Mở liên kết ↗</a
                          >`
                        : btn("download-material", "Tải tệp", m.id)}
                    </td>
                  </tr>`,
              ),
          )}
          <p class="ai-note">
            Bản nháp và bản lưu trữ không hiển thị. Tài liệu mẫu chỉ có
            metadata.
          </p>
        </section>
        <aside class="stack">
          <section class="panel">
            <h2>Giữ chỗ của bạn</h2>
            <p>
              ${Math.max(0, s.capacity - s.booked)} chỗ còn lại ·
              ${Math.round((s.booked / s.capacity) * 100)}% đã đặt
            </p>
            <progress
              class="${s.booked >= s.capacity
                ? "capacity-full"
                : s.booked / s.capacity > 0.9
                  ? "capacity-warn"
                  : ""}"
              value="${s.booked}"
              max="${s.capacity}"
              aria-label="Sức chứa"
            ></progress>
            <hr />
            ${state().agenda.includes(s.id)
              ? btn("remove-agenda", "Bỏ khỏi agenda", s.id)
              : btn(
                  s.booked >= s.capacity ? "waitlist" : "add-agenda",
                  s.booked >= s.capacity
                    ? state().waitlist.includes(s.id)
                      ? "Hủy chờ"
                      : "Tham gia chờ"
                    : "Thêm vào agenda",
                  s.id,
                  "primary",
                )}
            <p class="muted">
              ${agenda().some((a) => a.id !== s.id && EventAI.overlap(a, s))
                ? "⚠ Trùng lịch với session trong agenda."
                : "✓ Không trùng với lịch hiện tại."}
            </p>
          </section>
          <section class="panel">
            <h2>Thông tin phòng</h2>
            <p>${e(s.room)} · Khu Conference</p>
            <small>♿ Lối đi thang máy · Hỗ trợ tiếp cận</small>
          </section>
        </aside>
      </div>`;
  }
  function myAgenda() {
    const items = agenda().sort((a, b) =>
      (a.date + a.start).localeCompare(b.date + b.start),
    );
    const conflicts = EventAI.conflicts(items);
    $("#content").innerHTML =
      heading(
        "Agenda của tôi",
        `Lịch cá nhân · ${items.length} session · GMT+7`,
        link("attendee-session-catalog", "+ Thêm session"),
      ) +
      (conflicts.length
        ? /* HTML */ `<div class="banner warning">
            <div>
              <strong>⚠ Phát hiện ${conflicts.length} xung đột</strong>
              <p>Hai session trùng thời gian. Xem đề xuất để điều chỉnh.</p>
            </div>
            ${btn("resolve", "Giải quyết ngay", "", "primary")}
          </div>`
        : "") +
      /* HTML */ `<div class="two-col">
        <section class="panel">
          <div class="section-line">
            <h2>Lịch của bạn · Toàn sự kiện</h2>
            ${btn("calendar-export", "Xuất lịch .ics")}
          </div>
          ${items
            .map(
              (s) =>
                /* HTML */ `<article class="timeline-item">
                  <time>${e(s.start)}</time>
                  <div class="body">
                    <h3>${e(s.title)}</h3>
                    <small
                      >${shortDate(s.date)} · ${e(s.start)}–${e(s.end)} ·
                      ${e(s.room)} · ${e(s.speaker)}</small
                    >
                  </div>
                  <div class="timeline-actions">
                    ${link(
                      "attendee-session-detail",
                      "Chi tiết",
                      "link",
                      "?id=" + s.id,
                    )}${s.status === "Hoàn thành"
                      ? link(
                          "attendee-session-feedback",
                          "Phản hồi →",
                          "link",
                          "?id=" + s.id,
                        )
                      : ""}${btn(
                      "note-session",
                      "Sửa ghi chú",
                      s.id,
                    )}${s.recording
                      ? btn("recording-session", "Đổi sang bản ghi", s.id)
                      : ""}${btn("remove-agenda", "Gỡ session", s.id)}
                  </div>
                  ${state().notes[s.id]
                    ? /* HTML */ `<p class="session-note">
                        ${e(state().notes[s.id])}
                      </p>`
                    : ""}
                </article>`,
            )
            .join("") || empty("Agenda của bạn đang trống")}
        </section>
        <aside class="stack">
          <section class="panel">
            <h2>✧ Conflict Resolver</h2>
            <p>
              Kiểm tra thời gian và ưu tiên giữ session bắt đầu sớm hơn. Bạn xem
              đề xuất trước khi áp dụng.
            </p>
            ${btn("resolve", "Kiểm tra lịch", "", "primary")}
            <p class="ai-note">
              AI mô phỏng · Không kiểm tra thời gian di chuyển giữa phòng.
            </p>
          </section>
          <section class="panel">
            <h2>Cập nhật từ Ban tổ chức</h2>
            ${state()
              .alerts.filter((a) => a.status === "Đã gửi")
              .slice(0, 2)
              .map(
                (a) =>
                  /* HTML */ `<p>
                    <strong>${e(a.title)}</strong><br />${e(a.message)}
                  </p>`,
              )
              .join("")}
            <h2>Bản ghi đã chọn</h2>
            ${state()
              .recordings.map((id) => state().sessions.find((s) => s.id === id))
              .filter(Boolean)
              .map(
                (s) =>
                  /* HTML */ `<p>
                    ${e(s.title)} · Xem sau session (mô phỏng)
                  </p>`,
              )
              .join("") || '<p class="muted">Chưa chọn bản ghi.</p>'}
            <h2>Danh sách chờ</h2>
            ${state()
              .waitlist.map((id) => {
                const s = sessions().find((s) => s.id === id);
                return s
                  ? /* HTML */ `<p>${e(s.title)}</p>
                      ${btn("waitlist", "Hủy chờ", id)}`
                  : "";
              })
              .join("") ||
            '<p class="muted">Bạn chưa tham gia danh sách chờ.</p>'}
          </section>
        </aside>
      </div>`;
  }
  function feedback() {
    const feedbackSession =
      Number(new URLSearchParams(location.search).get("id")) || 1;
    const draft =
      state().feedback.find((f) => f.id === "personal-" + feedbackSession) ||
      {};
    $("#content").innerHTML =
      heading(
        "Phản hồi session",
        "Phản hồi được tổng hợp ẩn danh để cải thiện trải nghiệm.",
      ) +
      /* HTML */ `<div class="two-col">
        <section class="panel">
          <form id="feedback-form" class="stack">
            ${select(
              "sessionId",
              "Session *",
              sessions()
                .filter(
                  (s) =>
                    s.status === "Hoàn thành" && state().agenda.includes(s.id),
                )
                .map((s) => s.id + " · " + s.title),
              draft.sessionId
                ? sessions().find((s) => s.id === draft.sessionId)?.id +
                    " · " +
                    sessions().find((s) => s.id === draft.sessionId)?.title
                : "",
            )}${select(
              "rating",
              "Mức độ hài lòng *",
              [
                "5 · Xuất sắc",
                "4 · Rất tốt",
                "3 · Tốt",
                "2 · Cần cải thiện",
                "1 · Chưa hài lòng",
              ],
              draft.rating
                ? draft.rating +
                    " · " +
                    [
                      "",
                      "Chưa hài lòng",
                      "Cần cải thiện",
                      "Tốt",
                      "Rất tốt",
                      "Xuất sắc",
                    ][draft.rating]
                : "",
            )}${select(
              "contentRating",
              "Nội dung hữu ích",
              ["5", "4", "3", "2", "1"],
              String(draft.contentRating || 5),
            )}${select(
              "speakerRating",
              "Diễn giả truyền đạt",
              ["5", "4", "3", "2", "1"],
              String(draft.speakerRating || 4),
            )}${select(
              "organizationRating",
              "Tổ chức & thời lượng",
              ["5", "4", "3", "2", "1"],
              String(draft.organizationRating || 4),
            )}${select(
              "recommend",
              "Tôi sẽ giới thiệu session",
              ["Có", "Không", "Chưa quyết định"],
              draft.recommend || "Có",
            )}<span class="tag">Ẩn danh mặc định · Không chia sẻ tên/email</span
            ><label
              >Điều bạn ấn tượng / góp ý *<textarea
                name="comment"
                required
                minlength="20"
                maxlength="1000"
                placeholder="Chia sẻ ít nhất 20 ký tự"
              >
${e(draft.comment || "")}</textarea
              >
            </label>
            <div class="form-actions">
              ${btn("draft-feedback", "Lưu nháp")}${btn(
                "delete-feedback",
                "Xóa phản hồi",
                "",
                "danger",
              )}<button class="primary" type="submit">Gửi phản hồi</button>
            </div>
          </form>
        </section>
        <aside class="panel">
          <h2>Trạng thái phản hồi</h2>
          ${badge(draft.status || "Chưa gửi")}
          <p>Nhận xét cần ít nhất 20 ký tự và tối đa 1.000 ký tự.</p>
          <p class="muted">
            Demo mô phỏng sau session. Chỉ session đã hoàn thành trong agenda
            nhận phản hồi. Bản nháp chưa dùng để tổng hợp.
          </p>
        </aside>
      </div>`;
    $("#feedback-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      saveFeedback("Đã gửi");
    });
  }
  function saveFeedback(status) {
    const form = $("#feedback-form");
    if (
      status === "Đã gửi" &&
      (!form.reportValidity() || form.elements.comment.value.trim().length < 20)
    ) {
      toast("Nhận xét cần ít nhất 20 ký tự có nội dung.");
      return;
    }
    const d = new FormData(form);
    const sessionId = parseInt(d.get("sessionId"));
    if (
      !sessions().some(
        (s) =>
          s.id === sessionId &&
          s.status === "Hoàn thành" &&
          state().agenda.includes(s.id),
      )
    )
      return toast(
        "Chỉ gửi phản hồi cho session đã hoàn thành và có trong agenda.",
      );
    const previous = state().feedback.find(
      (f) => f.id === "personal-" + sessionId,
    );
    if (previous?.status === "Đã gửi") {
      const old = state().sessions.find((s) => s.id === previous.sessionId);
      if (old) old.feedbackCount = Math.max(0, old.feedbackCount - 1);
    }
    state().feedback = state().feedback.filter(
      (f) => f.id !== "personal-" + sessionId,
    );
    state().feedback.push({
      id: "personal-" + sessionId,
      sessionId,
      rating: parseInt(d.get("rating")),
      contentRating: Number(d.get("contentRating")),
      speakerRating: Number(d.get("speakerRating")),
      organizationRating: Number(d.get("organizationRating")),
      recommend: d.get("recommend"),
      comment: d.get("comment").trim(),
      status,
    });
    if (status === "Đã gửi")
      state().sessions.find((s) => s.id === sessionId).feedbackCount++;
    persist(
      status === "Đã gửi" ? "Gửi phản hồi thành công · FB-2048" : "Đã lưu nháp",
    );
    render();
  }
  function profile() {
    const p = state().profile;
    $("#content").innerHTML =
      heading(
        "Hồ sơ diễn giả",
        "Thông tin hiển thị cho người tham dự tại sự kiện.",
      ) +
      /* HTML */ `<div class="two-col">
        <section class="panel">
          <h2>Thông tin cơ bản</h2>
          <form id="profile-form" class="form-grid">
            <label class="full"
              >Ảnh đại diện · JPG/PNG · tối đa 5 MB · ít nhất 600×600<input
                type="file"
                name="avatar"
                accept="image/jpeg,image/png" /></label
            >${field(
              "name",
              "Họ tên *",
              p.name,
              "text",
              'required maxlength="100"',
            )}${field("email", "Email *", p.email, "email", "required")}${field(
              "position",
              "Chức danh *",
              p.position,
              "text",
              'required maxlength="200"',
            )}${field(
              "organization",
              "Tổ chức *",
              p.organization,
              "text",
              "required",
            )}${field("expertise", "Lĩnh vực chuyên môn", p.expertise)}${field(
              "linkedin",
              "LinkedIn",
              p.linkedin,
              "url",
            )}${field("website", "Website", p.website, "url")}${field(
              "twitter",
              "X / Twitter",
              p.twitter,
              "url",
            )}<label class="full"
              >Giới thiệu *<textarea
                name="bio"
                required
                minlength="50"
                maxlength="300"
              >
${e(p.bio)}</textarea
              >
            </label>
            <div class="form-actions full">
              <button type="submit" class="primary">Lưu hồ sơ</button>
            </div>
          </form>
        </section>
        <aside class="panel">
          <span
            class="avatar profile-avatar"
            style="width:72px;height:72px;font-size:24px"
            >MA</span
          >
          <h2 style="margin-top:16px">${e(p.name)}</h2>
          <p>${e(p.position)} · ${e(p.organization)}</p>
          <p class="muted">${e(p.bio)}</p>
          <span class="tag">${e(p.expertise)}</span>
          <p>
            ${p.linkedin && safeHttps(p.linkedin)
              ? /* HTML */ `<a
                  href="${e(p.linkedin)}"
                  target="_blank"
                  rel="noopener"
                  >LinkedIn ↗</a
                >`
              : ""}
            ${p.website && safeHttps(p.website)
              ? /* HTML */ `<a
                  href="${e(p.website)}"
                  target="_blank"
                  rel="noopener"
                  >Website ↗</a
                >`
              : ""}
          </p>
        </aside>
      </div>`;
    $("#profile-form").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const data = Object.fromEntries(new FormData(ev.target));
      const avatar = data.avatar;
      delete data.avatar;
      if (!data.name.trim() || !data.position.trim() || !data.bio.trim()) {
        toast("Vui lòng nhập đủ thông tin có nội dung.");
        return;
      }
      if (data.bio.trim().length < 50)
        return toast("Tiểu sử cần ít nhất 50 ký tự.");
      for (const key of ["linkedin", "website", "twitter"])
        if (data[key] && !safeHttps(data[key]))
          return toast("Liên kết phải bắt đầu bằng https://.");
      if (
        data.twitter &&
        !/^https:\/\/(x\.com|twitter\.com)\//.test(data.twitter)
      )
        return toast(
          "Liên kết X phải dùng https://x.com/ hoặc https://twitter.com/.",
        );
      if (avatar?.size) {
        if (
          !["image/jpeg", "image/png"].includes(avatar.type) ||
          avatar.size > 5 * 1024 * 1024
        )
          return toast("Ảnh phải là JPG/PNG và không quá 5 MB.");
        try {
          const bitmap = await createImageBitmap(avatar);
          const valid = bitmap.width >= 600 && bitmap.height >= 600;
          bitmap.close();
          if (!valid) return toast("Ảnh cần ít nhất 600×600 pixel.");
          await EP.files.put("speaker-avatar", avatar);
          data.hasAvatar = true;
        } catch {
          return toast("Không thể lưu ảnh. Ảnh hiện tại được giữ nguyên.");
        }
      }
      const previous = state().profile.name;
      state().profile = { ...state().profile, ...data };
      state()
        .sessions.filter((s) => s.speaker === previous)
        .forEach((s) => (s.speaker = data.name));
      state()
        .users.filter((u) => u.name === previous)
        .forEach((u) => {
          u.name = data.name;
          u.email = data.email;
        });
      persist("Đã cập nhật hồ sơ");
      render();
    });
  }
  const ownSessions = () =>
    state().sessions.filter(
      (s) => s.speaker === state().profile.name && s.status !== "Đã hủy",
    );
  function stats(rows) {
    return /* HTML */ `<div class="stats">
      ${rows
        .map(
          ([title, value]) =>
            /* HTML */ `<div class="stat">
              <small>${title}</small><strong>${value}</strong
              ><small>${e(state().settings.event)}</small>
            </div>`,
        )
        .join("")}
    </div>`;
  }
  function management(kind) {
    const configs = {
      sessions: [
        "Quản lý session",
        "Tạo và điều phối các phiên trong sự kiện.",
        ["Session / Diễn giả", "Lịch trình / Phòng", "Trạng thái", "Thao tác"],
      ],
      rooms: [
        "Phòng & thiết bị",
        "Theo dõi sức chứa và lịch sử dụng phòng.",
        ["Phòng", "Sức chứa", "Vị trí", "Thao tác"],
      ],
      users: [
        "Quản lý người dùng",
        "Quản lý hồ sơ và vai trò trong bản demo.",
        ["Người dùng", "Email", "Vai trò / Trạng thái", "Thao tác"],
      ],
      tickets: [
        "Quản lý loại vé",
        "Thiết lập giá vé, số lượng và trạng thái bán.",
        ["Loại vé", "Giá vé", "Số lượng / Trạng thái", "Thao tác"],
      ],
    };
    const [title, desc, headers] = configs[kind];
    $("#content").innerHTML =
      heading(title, desc, btn("create-" + kind, "+ Thêm mới", "", "primary")) +
      /* HTML */ `<div class="panel">
        <div class="toolbar">
          <label class="search"
            >Tìm kiếm<input
              id="manage-search"
              type="search"
              placeholder="Tìm ${title.toLowerCase()}…" /></label
          >${btn("export-" + kind, "Xuất CSV")}
        </div>
        <hr />
        <div id="management-table"></div>
      </div>`;
    function update() {
      const q = $("#manage-search").value.toLocaleLowerCase("vi");
      const rows = state()[kind].filter((x) =>
        JSON.stringify(x).toLocaleLowerCase("vi").includes(q),
      );
      $("#management-table").innerHTML = table(
        headers,
        rows.map((x) => {
          let cells = [];
          if (kind === "sessions")
            cells = [
              /* HTML */ `<strong>${e(x.title)}</strong><br /><small
                  >${e(x.speaker)}</small
                >`,
              `${e(x.date)} · ${e(x.start)}–${e(x.end)}<br>${e(x.room)}`,
              badge(x.status, x.status === "Đã hủy"),
            ];
          if (kind === "rooms")
            cells = [e(x.name), x.capacity + " chỗ", e(x.location)];
          if (kind === "users")
            cells = [
              e(x.name),
              e(x.email),
              e(x.role) + "<br>" + badge(x.status, x.status === "Tạm khóa"),
            ];
          if (kind === "tickets")
            cells = [
              e(x.name),
              money(x.price),
              x.quantity + " vé<br>" + badge(x.status),
            ];
          return /* HTML */ `<tr>
            ${cells.map((c) => /* HTML */ `<td>${c}</td>`).join("")}
            <td>
              <div class="actions">
                ${btn("edit-" + kind, "Sửa", x.id)}${kind === "sessions" &&
                x.status === "Chờ duyệt"
                  ? btn("approve-session", "Duyệt", x.id)
                  : ""}${btn(
                  kind === "users" ? "lock-user" : "delete-" + kind,
                  kind === "sessions"
                    ? "Lưu trữ"
                    : kind === "users"
                      ? "Khóa / Mở khóa"
                      : "Xóa",
                  x.id,
                  "danger",
                )}
              </div>
            </td>
          </tr>`;
        }),
      );
    }
    $("#manage-search").addEventListener("input", update);
    update();
  }
  function alerts() {
    $("#content").innerHTML =
      heading(
        "Thông báo sự kiện",
        "Tạo thông báo, lưu nháp và mô phỏng phát hành.",
        role === "organizer"
          ? btn("new-alert", "+ Tạo thông báo", "", "primary")
          : "",
      ) +
      /* HTML */ `<div class="panel">
        ${state()
          .alerts.filter((a) => role === "organizer" || a.status === "Đã gửi")
          .map(
            (a) =>
              /* HTML */ `<article class="alert-item">
                ${badge(a.priority, a.priority === "Khẩn cấp")}
                ${badge(a.status)}
                <h3>${e(a.title)}</h3>
                <p>${e(a.message)}</p>
                ${role === "organizer"
                  ? `${a.status === "Nháp" ? btn("publish-alert", "Phát hành", a.id, "primary") : ""} ${btn("delete-alert", "Xóa", a.id, "danger")}`
                  : ""}
              </article>`,
          )
          .join("") || empty("Chưa có thông báo")}
      </div>`;
  }
  function forecast() {
    $("#content").innerHTML =
      heading(
        "Dự báo mức quan tâm",
        "Ước lượng nhu cầu từ lượt đặt, quan tâm và phản hồi giả lập.",
      ) +
      /* HTML */ `<div class="two-col">
        <section class="panel">
          <h2>✦ Capacity Forecast</h2>
          <form id="forecast-form" class="stack">
            ${select("topic", "Phạm vi", [
              "Tất cả chủ đề",
              "AI & Data",
              "Product",
              "Fintech",
            ])}<button class="primary" type="submit">Phân tích dữ liệu</button>
          </form>
          <p class="ai-note">
            AI mô phỏng · Không phải dự báo từ mô hình học máy. Độ tin cậy phụ
            thuộc số phản hồi.
          </p>
        </section>
        <section class="panel" id="forecast-results">
          <h2>Kết quả dự báo</h2>
          <p class="muted">Chọn phạm vi và bắt đầu phân tích.</p>
        </section>
      </div>`;
    $("#forecast-form").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const topic = ev.target.elements.topic.value;
      const b = ev.target.querySelector("button");
      b.disabled = true;
      $("#forecast-results").innerHTML =
        '<div class="loading">Đang phân tích dữ liệu…</div>';
      await new Promise((r) => setTimeout(r, 650));
      if (!$("#forecast-results")) return;
      const rows = EventAI.forecast(
        sessions().filter(
          (s) =>
            s.saves >= 20 && (topic === "Tất cả chủ đề" || s.topic === topic),
        ),
      );
      $("#forecast-results").innerHTML =
        "<h2>Kết quả dự báo</h2>" +
          rows
            .map(
              (r) =>
                /* HTML */ `<div class="result">
                  <strong>${e(r.session.title)}</strong>
                  <p>
                    Dự báo <b>${r.predicted}</b> người / ${r.session.capacity}
                    chỗ ·
                    ${badge(
                      r.ratio > 1 ? "Nguy cơ quá tải" : "Đủ sức chứa",
                      r.ratio > 1,
                    )}
                  </p>
                  <p>${e(r.reason)}</p>
                  <small
                    >Độ tin cậy: ${r.confidence}. Sai số chưa được kiểm
                    chứng.</small
                  >${r.ratio > 1
                    ? /* HTML */ `<p>
                        ${btn(
                          "forecast-room",
                          "Xem phương án đổi phòng",
                          r.session.id,
                        )}
                      </p>`
                    : ""}
                </div>`,
            )
            .join("") || empty("Không đủ dữ liệu để dự báo");
      b.disabled = false;
    });
  }
  const views = {
    "attendee-session-catalog": catalog,
    "attendee-session-detail": detail,
    "attendee-my-agenda": myAgenda,
    "attendee-session-feedback": feedback,
    "speaker-profile": profile,
    "speaker-my-session": speakerSessions,
    "speaker-session-materials": materials,
    "speaker-session-insights": insights,
    "organizer-session-management": () => management("sessions"),
    "organizer-room-management": roomManagement,
    "organizer-event-alerts": enhancedAlerts,
    "organizer-interest-forecast": newForecast,
    "admin-ticket-type-management": ticketManagement,
    "admin-user-management": userManagement,
    "admin-event-analytics": eventAnalytics,
    "admin-system-settings": newSettings,
  };
  function render() {
    if (route === "home") return home();
    (
      views[route] ||
      (() =>
        ($("#content").innerHTML = heading(
          "Không tìm thấy trang",
          "Hãy quay lại danh mục session.",
          link("attendee-session-catalog", "Trang chủ"),
        )))
    )();
    if (route === "speaker-profile") loadProfileAvatar();
  }
  function addAgenda(id) {
    const s = sessions().find((s) => s.id === id);
    if (!s) return;
    if (state().agenda.includes(id)) return;
    if (s.booked >= s.capacity) {
      toast("Session đã đầy. Vui lòng tham gia danh sách chờ.");
      return;
    }
    state().agenda.push(id);
    s.booked++;
    s.saves++;
    persist(
      EventAI.conflicts(agenda()).length
        ? "Đã thêm lịch · Có xung đột, kiểm tra Agenda."
        : "Đã thêm vào agenda",
    );
    render();
  }
  function removeAgenda(id) {
    const s = state().sessions.find((s) => s.id === id);
    if (state().agenda.includes(id) && s) {
      s.booked = Math.max(0, s.booked - 1);
      s.saves = Math.max(0, s.saves - 1);
    }
    state().agenda = state().agenda.filter((x) => x !== id);
    persist("Đã bỏ khỏi agenda");
    render();
  }
  function confirmAction(title, text, callback) {
    modal(
      title,
      /* HTML */ `<p>${e(text)}</p>
        <div class="form-actions">
          ${btn("close", "Quay lại")}<button
            type="button"
            id="confirm"
            class="danger"
          >
            Xác nhận
          </button>
        </div>`,
    );
    $("#confirm").addEventListener("click", () => {
      $("#modal").close();
      callback();
    });
  }
  function editEntity(kind, id, speakerOnly = false) {
    const item = state()[kind].find((x) => x.id === id) || {},
      isNew = !item.id;
    let fields = "";
    if (kind === "sessions")
      fields =
        field(
          "title",
          "Tên session *",
          item.title,
          "text",
          'required maxlength="200"',
        ) +
        select(
          "topic",
          "Chủ đề",
          ["AI & Data", "Product", "Fintech"],
          item.topic,
        ) +
        field(
          "speaker",
          "Diễn giả *",
          item.speaker || state().profile.name,
          "text",
          'required maxlength="100"',
        ) +
        field(
          "date",
          "Ngày *",
          item.date || "2026-10-19",
          "date",
          'required min="${state().settings.start.slice(0,10)}" max="${state().settings.end.slice(0,10)}"',
        ) +
        field("start", "Bắt đầu *", item.start || "09:00", "time", "required") +
        field("end", "Kết thúc *", item.end || "10:00", "time", "required") +
        select(
          "room",
          "Phòng",
          state()
            .rooms.filter((r) => r.status !== "Đã lưu trữ")
            .map((r) => r.name),
          item.room,
        ) +
        select(
          "status",
          "Trạng thái",
          [
            "Chờ duyệt",
            "Đã duyệt",
            "Hoàn thành",
            "Bị từ chối",
            "Đã hủy",
            "Bản nháp",
            "Đã lưu trữ",
          ],
          item.status || "Chờ duyệt",
        ) +
        /* HTML */ `<label class="full"
          >Mô tả<textarea name="description" maxlength="3000">
${e(item.description || "")}</textarea
          >
        </label>`;
    if (speakerOnly)
      fields =
        field(
          "title",
          "Tên session *",
          item.title,
          "text",
          'required maxlength="200"',
        ) +
        /* HTML */ `<label class="full"
          >Nội dung *<textarea name="description" required maxlength="3000">
${e(item.description)}</textarea
          >
        </label>`;
    if (kind === "rooms")
      fields =
        field(
          "equipment",
          "Thiết bị",
          item.equipment || "Máy chiếu · Mic · Ghi hình",
        ) +
        field(
          "name",
          "Tên phòng *",
          item.name,
          "text",
          'required maxlength="100"',
        ) +
        field(
          "capacity",
          "Sức chứa *",
          item.capacity || 120,
          "number",
          'required min="1" max="10000" step="1"',
        ) +
        field(
          "location",
          "Vị trí *",
          item.location,
          "text",
          'required maxlength="200"',
        );
    if (kind === "users")
      fields =
        field(
          "name",
          "Họ tên *",
          item.name,
          "text",
          'required maxlength="100"',
        ) +
        field("email", "Email *", item.email, "email", "required") +
        select(
          "role",
          "Vai trò",
          Object.values(groups).map((g) => g[0]),
          item.role,
        ) +
        select(
          "status",
          "Trạng thái",
          ["Hoạt động", "Chờ xác thực", "Đã khóa"],
          item.status,
        );
    if (kind === "tickets")
      fields =
        field(
          "start",
          "Bắt đầu bán *",
          item.start || "2026-09-01T00:00",
          "datetime-local",
          "required",
        ) +
        field(
          "end",
          "Kết thúc bán *",
          item.end || "2026-10-17T23:59",
          "datetime-local",
          "required",
        ) +
        field(
          "name",
          "Tên loại vé *",
          item.name,
          "text",
          'required maxlength="100"',
        ) +
        field(
          "price",
          "Giá vé (VNĐ) *",
          item.price ?? 299000,
          "number",
          'required min="0" max="100000000" step="1000"',
        ) +
        field(
          "quantity",
          "Số lượng *",
          item.quantity ?? 100,
          "number",
          'required min="0" max="100000" step="1"',
        ) +
        select(
          "status",
          "Trạng thái",
          ["Đang bán", "Tạm dừng", "Đã hết"],
          item.status,
        );
    modal(
      (isNew ? "Thêm mới" : "Chỉnh sửa") +
        " · " +
        {
          sessions: "Session",
          rooms: "Phòng",
          users: "Người dùng",
          tickets: "Loại vé",
        }[kind],
      /* HTML */ `<form id="entity-form" class="form-grid">
        ${fields}
        <p id="form-error" class="error full" role="alert"></p>
        <div class="form-actions full">
          ${btn("close", "Hủy")}<button type="submit" class="primary">
            Lưu thay đổi
          </button>
        </div>
      </form>`,
    );
    $("#entity-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const d = Object.fromEntries(new FormData(ev.target));
      for (const k in d) d[k] = d[k].trim();
      const error = (msg) => {
        $("#form-error").textContent = msg;
      };
      if (Object.entries(d).some(([k, v]) => !v && k !== "description"))
        return error("Vui lòng nhập đầy đủ nội dung.");
      for (const k of ["capacity", "price", "quantity"])
        if (k in d) d[k] = Number(d[k]);
      if (
        kind === "tickets" &&
        (d.quantity < (item.sold || 0) || d.end <= d.start)
      )
        return error(
          "Quota phải ≥ số vé đã bán; kết thúc bán phải sau bắt đầu.",
        );
      if (
        kind === "rooms" &&
        state().rooms.some(
          (r) => r.id !== id && r.name.toLowerCase() === d.name.toLowerCase(),
        )
      )
        return error("Tên phòng đã tồn tại.");
      if (
        kind === "rooms" &&
        sessions().some((s) => s.room === item.name && s.booked > d.capacity)
      )
        return error("Sức chứa mới nhỏ hơn số người đã đặt.");
      if (
        kind === "users" &&
        state().users.some(
          (u) => u.id !== id && u.email.toLowerCase() === d.email.toLowerCase(),
        )
      )
        return error("Email đã tồn tại.");
      if (kind === "sessions" && !speakerOnly) {
        if (d.start >= d.end)
          return error("Giờ kết thúc phải sau giờ bắt đầu.");
        const room = state().rooms.find((r) => r.name === d.room);
        if (!room) return error("Hãy tạo phòng trước khi tạo session.");
        if (
          d.date < state().settings.start.slice(0, 10) ||
          d.date > state().settings.end.slice(0, 10)
        )
          return error("Ngày session phải thuộc khoảng ngày sự kiện.");
        if (d.description.trim().length < 80)
          return error("Mô tả session cần ít nhất 80 ký tự.");
        if ((item.booked || 0) > room.capacity)
          return error("Phòng không đủ chỗ cho người đã đặt.");
        if (
          ["Đã duyệt", "Hoàn thành"].includes(d.status) &&
          sessions().some(
            (s) =>
              s.id !== id &&
              EventAI.overlap(s, d) &&
              (s.room === d.room || s.speaker === d.speaker),
          )
        )
          return error(
            "Trùng thời gian phòng hoặc diễn giả. Hãy chọn khung giờ khác.",
          );
        d.public = ["Đã duyệt", "Hoàn thành"].includes(d.status);
        d.capacity = room.capacity;
        d.image =
          d.topic === "Product"
            ? "product"
            : d.topic === "Fintech"
              ? "fintech"
              : "ai";
      }
      if (isNew)
        state()[kind].push({
          id: Date.now(),
          ...(kind === "sessions"
            ? { booked: 0, saves: 0, feedbackCount: 0 }
            : {}),
          ...d,
        });
      else {
        const oldName = item.name,
          oldRoom = item.room;
        Object.assign(item, d);
        if (kind === "sessions" && oldRoom !== d.room && item.public) {
          state().alerts.unshift({
            id: Date.now() + 1,
            title: "Thay đổi phòng · " + item.title,
            message: `Session ${item.title} chuyển từ ${oldRoom || "chưa gán"} sang ${item.room}, lúc ${item.start}. Agenda dùng lịch mới.`,
            priority: "Quan trọng",
            status: "Nháp",
            sessionId: id,
            channels: "Push + Email",
            recipients: item.booked,
          });
        }
        if (kind === "rooms")
          state()
            .sessions.filter((s) => s.room === oldName)
            .forEach((s) => {
              s.room = d.name;
              s.capacity = d.capacity;
            });
        if (
          kind === "sessions" &&
          ["Đã hủy", "Đã lưu trữ"].includes(d.status)
        ) {
          state().agenda = state().agenda.filter((x) => x !== id);
          state().waitlist = state().waitlist.filter((x) => x !== id);
        }
      }
      $("#modal").close();
      persist(
        "Đã lưu " +
          {
            sessions: "session",
            rooms: "phòng",
            users: "người dùng",
            tickets: "loại vé",
          }[kind],
      );
      render();
    });
  }
  function recommend() {
    modal(
      "✧ Agenda Recommender",
      /* HTML */ `<form id="recommend-form" class="stack">
          ${field(
            "interests",
            "Chủ đề hoặc mục tiêu *",
            state().preferences.interests,
            "text",
            'required minlength="2" maxlength="200" placeholder="Ví dụ: AI, Product, Fintech"',
          )}<button type="submit" class="primary">Tìm session phù hợp</button>
        </form>
        <div id="ai-results"></div>
        <p class="ai-note">
          AI mô phỏng: so khớp từ khóa trong tiêu đề / chủ đề, loại session hết
          chỗ, trùng agenda và thiếu 8 phút di chuyển.
        </p>`,
    );
    $("#recommend-form").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const terms = ev.target.elements.interests.value.trim();
      if (terms.length < 2) {
        toast("Nhập tối thiểu 2 ký tự.");
        return;
      }
      const b = ev.target.querySelector("button");
      b.disabled = true;
      $("#ai-results").innerHTML =
        '<div class="loading">Đang tìm nội dung phù hợp…</div>';
      await new Promise((r) => setTimeout(r, 650));
      if (!$("#ai-results")) return;
      const results = EventAI.recommend(
        sessions(),
        terms,
        agenda(),
        state().preferences,
      );
      state().aiDrafts.recommend = {
        interests: terms,
        sessionIds: results.map((r) => r.session.id),
      };
      $("#ai-results").innerHTML =
        results
          .map(
            (r) =>
              /* HTML */ `<div class="result">
                <strong>${e(r.session.title)}</strong>
                <p>
                  Phù hợp ${r.score} từ khóa; còn chỗ và không trùng lịch hiện
                  tại.
                </p>
                ${btn("accept-recommend", "Chấp nhận", r.session.id, "primary")}
                ${btn("dismiss-result", "Bỏ qua")}
              </div>`,
          )
          .join("") ||
        /* HTML */ `<div class="result">
          <strong>Chưa đủ cơ sở để gợi ý</strong>
          <p>
            Không có session phù hợp với từ khóa, sức chứa và lịch hiện tại. Đổi
            từ khóa hoặc chỉnh agenda rồi thử lại.
          </p>
        </div>`;
      b.disabled = false;
    });
  }
  function resolve() {
    const results = EventAI.resolve(agenda());
    if (!results.removed.length) {
      toast("Không có xung đột trong agenda hiện tại.");
      return;
    }
    modal(
      "✦ Đề xuất giải quyết xung đột",
      /* HTML */ `<p>
          Ưu tiên giữ phiên bắt đầu sớm hơn. Chọn cách xử lý từng session trùng
          lịch:
        </p>
        <form id="resolve-form" class="stack">
          ${results.removed
            .map(
              (item) =>
                /* HTML */ `<div class="result">
                  <strong>${e(item.title)}</strong>
                  <p>${e(item.start)}–${e(item.end)} · ${e(item.room)}</p>
                  <label
                    >Phương án<select name="resolve-${item.id}">
                      <option value="remove">Gỡ session, nhường chỗ</option>
                      ${item.recording
                        ? '<option value="recording">Xem bản ghi sau session</option>'
                        : ""}
                      <option value="keep">
                        Giữ lịch hiện tại, chỉnh thủ công
                      </option>
                    </select></label
                  >
                </div>`,
            )
            .join("")}
          <p class="ai-note">
            Quy tắc mô phỏng theo giờ. Bạn quyết định trước khi thay đổi agenda.
          </p>
          <div class="form-actions">
            ${btn("close", "Giữ lịch hiện tại")}<button
              type="submit"
              id="apply-resolve"
              class="primary"
            >
              Áp dụng phương án
            </button>
          </div>
        </form>`,
    );
    $("#resolve-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const d = new FormData(ev.target);
      for (const item of results.removed) {
        const mode = d.get("resolve-" + item.id);
        if (mode === "keep") continue;
        item.booked = Math.max(0, item.booked - 1);
        item.saves = Math.max(0, item.saves - 1);
        state().agenda = state().agenda.filter((id) => id !== item.id);
        if (mode === "recording" && !state().recordings.includes(item.id))
          state().recordings.push(item.id);
      }
      $("#modal").close();
      persist("Đã áp dụng phương án xử lý xung đột");
      render();
    });
  }

  function forecastRoom(id) {
    const s = sessions().find((s) => s.id === id);
    const prediction = EventAI.forecast([s])[0];
    const rooms = state().rooms.filter(
      (r) =>
        r.status !== "Đã lưu trữ" &&
        r.capacity >= prediction.predicted &&
        !sessions().some(
          (other) =>
            other.id !== id &&
            other.room === r.name &&
            EventAI.overlap(s, other),
        ),
    );
    modal(
      "Phương án đổi phòng",
      /* HTML */ `<p>
          Dự báo ${prediction.predicted} người. Chỉ đề xuất phòng đủ sức chứa và
          không trùng thời gian.
        </p>
        ${rooms
          .map(
            (r) =>
              /* HTML */ `<div class="result">
                <strong>${e(r.name)}</strong>
                <p>${r.capacity} chỗ · ${e(r.location)}</p>
                <button
                  type="button"
                  class="primary"
                  data-action="apply-room"
                  data-id="${s.id}"
                  data-room="${r.id}"
                >
                  Chấp nhận đổi phòng
                </button>
              </div>`,
          )
          .join("") ||
        '<p class="error">Không có phòng phù hợp. Hãy bổ sung phòng hoặc chỉnh lịch thủ công.</p>'}${btn(
          "close",
          "Bỏ qua",
        )}`,
    );
  }
  function home() {
    document.body.classList.add("home-page");
    $("#app").innerHTML = /* HTML */ `<div class="reference-strip">
        CSE122 · EventPulse · Trang chung <span>index.html</span>
      </div>
      <header class="home-header">
        <a class="brand" href="index.html"
          ><img src="assets/icons/pulse.svg" alt="" />EventPulse</a
        >
        <nav aria-label="Trang chủ">
          <a href="#overview">Tổng quan</a><a href="#program">Chương trình</a
          ><a href="#speakers">Diễn giả</a><a href="#venue">Địa điểm</a>
        </nav>
        <a href="#workspaces" class="button">Workspace demo ↓</a>${link(
          "attendee-session-catalog",
          "↗ Khám phá session",
          "primary",
        )}
      </header>
      <main id="content" tabindex="-1" class="home-content">
        <section class="hero" id="overview">
          <div>
            <span class="tag">${e(eventDates())} · HÀ NỘI</span>
            <h1>
              ${e(state().settings.event).replace("2026", "<span>2026.</span>")}
            </h1>
            <h2>Kết nối ý tưởng.<br />Kiến tạo tương lai.</h2>
            <p>
              Ba ngày cùng cộng đồng công nghệ Việt Nam: từ AI có trách nhiệm,
              thiết kế sản phẩm đến tương lai của fintech. Một sự kiện, mọi hành
              trình kết nối.
            </p>
            <div class="inline-actions">
              ${link(
                "attendee-session-catalog",
                "Khám phá session →",
                "primary",
              )}<a href="#program">Xem lịch chương trình</a>
            </div>
            <div class="hero-numbers">
              <div>
                <strong>${state().sessions.length}</strong>session trong demo
              </div>
              <div>
                <strong
                  >${new Set(sessions().map((s) => s.speaker)).size}</strong
                >diễn giả & chuyên gia
              </div>
              <div>
                <strong
                  >${state()
                    .tickets.reduce((n, t) => n + (t.sold || 0), 0)
                    .toLocaleString("vi-VN")}</strong
                >vé đã xác nhận
              </div>
            </div>
          </div>
          <a
            class="hero-visual"
            href="${url("attendee-session-detail", "?id=1")}"
            ><img
              src="assets/images/ai-session.jpg"
              alt="Diễn giả tại hội nghị công nghệ"
            />
            <div>
              <span class="eyebrow">TIÊU ĐIỂM · AI & DATA</span>
              <h2>Từ nguyên tắc đến<br />sản phẩm có trách nhiệm</h2>
              <p>${e(state().profile.name)} · 19/10 · 09:00</p>
              Xem chi tiết session →
            </div></a
          >
        </section>
        <section class="intro-band">
          <h2>Nơi những ý tưởng<br />trở thành tác động.</h2>
          <p>
            Học từ tình huống thực tế, gặp gỡ người đang xây dựng sản phẩm và
            thiết kế lịch tham dự theo cách của bạn. EventPulse kết nối người
            tham dự, diễn giả và đội ngũ vận hành trong cùng một hệ sinh thái.
          </p>
        </section>
        <section class="home-section">
          <div class="section-line">
            <div>
              <span class="eyebrow"
                >KHÁM PHÁ / ${sessions().length} SESSION CÔNG KHAI</span
              >
              <h2>Những cuộc trò chuyện đáng tham dự</h2>
              <p>Chuyên môn sâu. Góc nhìn mới. Giá trị mang về.</p>
            </div>
            ${link("attendee-session-catalog", "Tất cả session →")}
          </div>
          <div class="cards">${sessions().slice(0, 3).map(card).join("")}</div>
        </section>
        <section class="home-section" id="program">
          <div class="section-line">
            <div>
              <span class="eyebrow">CHƯƠNG TRÌNH / GMT+7</span>
              <h2>Ba ngày, một hành trình</h2>
            </div>
            ${link("attendee-my-agenda", "Tạo agenda của tôi →")}
          </div>
          <div class="date-tabs">
            ${["2026-10-18", "2026-10-19", "2026-10-20"]
              .map(
                (d) =>
                  /* HTML */ `<button
                    data-action="program-day"
                    data-date="${d}"
                    aria-pressed="${d === "2026-10-19"}"
                  >
                    ${shortDate(d)} ·
                    ${d.endsWith("18")
                      ? "Kết nối & khai mạc"
                      : d.endsWith("19")
                        ? "Chuyên sâu"
                        : "Ứng dụng & tương lai"}
                  </button>`,
              )
              .join("")}
          </div>
          <div id="program-table"></div>
          <div class="banner">
            <div>
              <strong>Cập nhật lịch · 19/10</strong>
              <p>
                Fintech ở ${e(state().sessions.find((s) => s.id === 3)?.room)}.
                Agenda và thông báo dùng cùng lịch mới.
              </p>
              ${link(
                "attendee-my-agenda",
                "Xem cập nhật trong Agenda →",
                "link",
              )}
            </div>
          </div>
        </section>
        <section class="home-section pale" id="speakers">
          <span class="eyebrow">NHỮNG NGƯỜI DẪN DẮT THAY ĐỔI</span>
          <h2>Gặp gỡ những góc nhìn tiên phong</h2>
          <div class="cards">
            ${sessions()
              .slice(0, 3)
              .map(
                (s) =>
                  /* HTML */ `<article class="panel">
                    <img
                      class="speaker-photo"
                      src="assets/images/${s.image}-session.jpg"
                      alt="Hội thảo ${e(s.topic)}"
                    />
                    <h3>${e(s.speaker)}</h3>
                    <p>
                      ${s.id === 1
                        ? e(state().profile.position)
                        : s.topic === "Product"
                          ? "Product Design Lead"
                          : "Chuyên gia công nghệ tài chính"}
                    </p>
                    <span class="tag">${e(s.topic)}</span>
                    <p>
                      ${link(
                        "attendee-session-catalog",
                        "Xem session của diễn giả →",
                        "link",
                        "?speaker=" + encodeURIComponent(s.speaker),
                      )}
                    </p>
                  </article>`,
              )
              .join("")}
          </div>
          <div class="grid-two venue" id="venue">
            <div class="venue-map" aria-label="Sơ đồ khu Conference">
              <strong>CONFERENCE VENUE MAP</strong>
              <div class="room-map">
                ${state()
                  .rooms.map(
                    (r) =>
                      /* HTML */ `<div>
                        ${e(r.name)}<small>${r.capacity} chỗ</small>
                      </div>`,
                  )
                  .join("")}
              </div>
              <small>Sơ đồ khu Conference · Minh họa demo</small>
            </div>
            <div>
              <span class="eyebrow">ĐỊA ĐIỂM / HÀ NỘI</span>
              <h2>Một điểm hẹn.<br />Vô vàn kết nối.</h2>
              <strong>${e(state().settings.location)}</strong>
              <p>
                Check-in tại sảnh chính từ 08:00 mỗi ngày; chuẩn bị mã QR trong
                vé và giấy tờ xác nhận.
              </p>
              <span class="tag">♿ Lối tiếp cận</span>
              <span class="tag">Wi-Fi sự kiện</span>
              <span class="tag">Phiên dịch</span>
              <p>${btn("checkin-help", "Hướng dẫn check-in", "", "link")}</p>
            </div>
          </div>
        </section>
        <section class="home-section intelligence">
          <span class="eyebrow">✦ EVENTPULSE INTELLIGENCE</span>
          <h2>Ít thao tác hơn. Quyết định tốt hơn.</h2>
          <div class="workspace-grid">
            ${[
              [
                "Agenda Recommender",
                "Chọn chủ đề và mục tiêu; nhận lịch phù hợp cùng lý do rõ ràng.",
                "attendee-session-catalog",
              ],
              [
                "Conflict Resolver",
                "So sánh session trùng lịch; giữ, thay thế hoặc tự điều chỉnh.",
                "attendee-my-agenda",
              ],
              [
                "Capacity Forecast",
                "Dự báo nhu cầu, phát hiện quá tải và đề xuất phòng phù hợp.",
                "organizer-interest-forecast",
              ],
              [
                "AI Summary",
                "Tóm tắt phản hồi ẩn danh, kiểm tra nguồn và chỉnh sửa kết quả.",
                "speaker-session-insights",
              ],
            ]
              .map(
                ([t, d, r]) =>
                  /* HTML */ `<article>
                    <span>✦</span>
                    <h3>${t}</h3>
                    <p>${d}</p>
                    ${link(r, "Khám phá →", "link")}
                  </article>`,
              )
              .join("")}
          </div>
          <p>
            AI luôn có giải thích, xác nhận trước khi lưu và lựa chọn thủ công
            khi không đủ dữ liệu.
          </p>
        </section>
        <section class="home-section" id="workspaces">
          <span class="eyebrow">MỘT SỰ KIỆN / BỐN VAI TRÒ</span>
          <h2>Chọn không gian của bạn</h2>
          <p>Dùng chung chương trình, phòng, tài liệu và dữ liệu sự kiện.</p>
          <div class="workspace-grid">
            ${Object.entries(groups)
              .map(
                ([k, [t, list]]) =>
                  /* HTML */ `<article class="panel">
                    <span class="workspace-icon">${list[0][2]}</span>
                    <h3>${t}</h3>
                    <p>${list.map((x) => x[1]).join(" → ")}</p>
                    ${link(k + "-" + list[0][0], "Mở workspace →", "primary")}
                  </article>`,
              )
              .join("")}
          </div>
          <div class="banner">
            <div>
              <strong>Chuyển vai trò chỉ dành cho demo</strong>
              <p>
                Truy cập thật cần đăng nhập và được cấp quyền. Bộ chọn này chỉ
                chuyển giao diện trong bản demo học phần CSE122.
              </p>
            </div>
          </div>
          <div class="grid-two">
            <section class="panel">
              <h2>Cập nhật sự kiện</h2>
              ${state()
                .alerts.filter((a) => a.status === "Đã gửi")
                .slice(0, 3)
                .map(
                  (a) =>
                    /* HTML */ `<article class="alert-item">
                      <h3>${e(a.title)}</h3>
                      <p>${e(a.message)}</p>
                      ${link(
                        "attendee-my-agenda",
                        "Xem Agenda của tôi →",
                        "link",
                      )}
                    </article>`,
                )
                .join("")}
            </section>
            <section class="panel" id="faq">
              <h2>Những điều bạn cần biết</h2>
              ${[
                [
                  "Lưu session có đồng nghĩa giữ chỗ?",
                  "Thêm vào agenda xác nhận chỗ theo sức chứa hiện tại. Session đầy cho phép vào danh sách chờ. Lưu gợi ý AI chưa giữ chỗ.",
                ],
                [
                  "Tôi có thể thay đổi lịch cá nhân?",
                  "Bạn có thể gỡ session, sửa ghi chú và chuyển sang bản ghi khi có hỗ trợ.",
                ],
                [
                  "Tài liệu mở khi nào?",
                  "Chỉ tài liệu đã xuất bản và phù hợp quyền truy cập mới hiển thị ở Chi tiết session.",
                ],
                [
                  "AI sử dụng dữ liệu nào?",
                  "Quy tắc JavaScript dùng sở thích, lịch, lượt quan tâm và phản hồi ẩn danh trong demo.",
                ],
              ]
                .map(
                  ([q, a]) =>
                    /* HTML */ `<details>
                      <summary>${q}</summary>
                      <p>${a}</p>
                    </details>`,
                )
                .join("")}
              <p>
                Cần hỗ trợ?
                <a href="mailto:support@eventpulse.vn">support@eventpulse.vn</a>
              </p>
            </section>
          </div>
        </section>
      </main>
      <footer class="home-footer">
        <div>
          <strong>ϟ EventPulse</strong>
          <p>Kết nối trọn vẹn trải nghiệm sự kiện.</p>
        </div>
        <div>
          <strong>SỰ KIỆN</strong>
          <p>
            <a href="#program">Chương trình</a> ·
            <a href="#speakers">Diễn giả</a> · <a href="#venue">Địa điểm</a>
          </p>
        </div>
        <div>
          <strong>HỖ TRỢ</strong>
          <p>
            <a href="#faq">FAQ</a> ·
            ${btn("privacy", "Quyền riêng tư", "", "link")}
          </p>
        </div>
        <div>
          <strong>LIÊN HỆ</strong>
          <p>
            <a href="mailto:support@eventpulse.vn">support@eventpulse.vn</a>
          </p>
        </div>
        <small
          >© 2026 EventPulse · Trang chung + 4 workspace × 4 trang · Dữ liệu
          demo</small
        >
      </footer>`;
    programDay("2026-10-19");
  }
  function shortDate(d) {
    return d ? d.slice(8, 10) + "/" + d.slice(5, 7) : "Chưa xếp lịch";
  }
  function eventDates() {
    const s = state().settings;
    return `${shortDate(s.start)}–${shortDate(s.end)}.${s.end.slice(0, 4)}`;
  }
  function programDay(date) {
    const rows = sessions().filter((s) => s.date === date);
    $("#program-table").innerHTML = table(
      ["Giờ", "Session", "Diễn giả", "Địa điểm", "Khám phá"],
      rows.map(
        (s) =>
          /* HTML */ `<tr>
            <td>${e(s.start)}–${e(s.end)}</td>
            <td>${e(s.title)}</td>
            <td>${e(s.speaker)}</td>
            <td>${e(s.room)} · ${s.capacity} chỗ</td>
            <td>
              ${link(
                "attendee-session-detail",
                "Chi tiết →",
                "link",
                "?id=" + s.id,
              )}
            </td>
          </tr>`,
      ),
    );
    document
      .querySelectorAll('[data-action="program-day"]')
      .forEach((b) => b.setAttribute("aria-pressed", b.dataset.date === date));
  }
  function sessionPicker(id = "session-picker") {
    return /* HTML */ `<label
      >Session đang chọn<select id="${id}">
        ${ownSessions()
          .map(
            (s) =>
              /* HTML */ `<option
                value="${s.id}"
                ${s.id === selectedSession() ? "selected" : ""}
              >
                S-${String(s.id).padStart(2, "0")} · ${e(s.title)}
              </option>`,
          )
          .join("")}
      </select></label
    >`;
  }
  function selectedSession() {
    const id = Number(new URLSearchParams(location.search).get("id"));
    return ownSessions().some((s) => s.id === id) ? id : ownSessions()[0]?.id;
  }
  function pickSession() {
    $("#session-picker")?.addEventListener("change", (ev) => {
      location.href = url(route, "?id=" + ev.target.value);
    });
  }
  function aiPanel(title, body) {
    return /* HTML */ `<section class="panel ai-panel">
      <h2>✦ ${title}</h2>
      <p class="muted">AI hỗ trợ quyết định, không thay thế bạn.</p>
      <div class="ai-steps">
        <span>Đầu vào</span><span>Xử lý</span><span>Kết quả</span>
      </div>
      ${body}
      <p class="ai-note">
        AI mô phỏng bằng quy tắc JavaScript. Không tự động thay đổi dữ liệu. Chỉ
        lưu sau khi bạn xác nhận.
      </p>
    </section>`;
  }
  function catalog() {
    const pref = state().preferences;
    $("#content").innerHTML =
      heading(
        "Khám phá session",
        "Khám phá chương trình và thiết kế hành trình theo sở thích của bạn.",
        link("attendee-my-agenda", "Agenda của tôi →", "primary"),
      ) +
      /* HTML */ `<div class="banner">
          <div>
            <strong>Chương trình cùng dữ liệu với Ban tổ chức</strong>
            <p>
              ${sessions().length} session công khai trong demo ·
              ${state().sessions.length} session toàn sự kiện.
            </p>
          </div>
        </div>
        <div class="panel toolbar">
          <label class="search"
            >Tìm kiếm<input
              id="search"
              placeholder="Tìm tên session hoặc diễn giả…"
              type="search" /></label
          ><label
            >Ngày<select id="date">
              <option value="">Toàn sự kiện</option>
              ${["2026-10-18", "2026-10-19", "2026-10-20"]
                .map(
                  (d) =>
                    /* HTML */ `<option value="${d}">
                      ${shortDate(d)}/2026
                    </option>`,
                )
                .join("")}
            </select></label
          ><label
            >Chủ đề<select id="topic">
              <option value="">Tất cả chủ đề</option>
              ${[...new Set(sessions().map((s) => s.topic))]
                .map((t) => /* HTML */ `<option>${e(t)}</option>`)
                .join("")}
            </select></label
          ><label
            >Diễn giả<select id="speaker">
              <option value="">Tất cả diễn giả</option>
              ${[...new Set(sessions().map((s) => s.speaker))]
                .map((t) => /* HTML */ `<option>${e(t)}</option>`)
                .join("")}
            </select></label
          ><label
            >Sức chứa<select id="availability">
              <option value="">Tất cả</option>
              <option value="available">Còn chỗ</option>
              <option value="full">Đã đầy</option>
            </select></label
          >
        </div>
        <div class="section-line">
          <strong id="count"></strong>
          <div>
            ${btn("grid", "Lưới")}${btn("list", "Danh sách")}${btn(
              "reset-filters",
              "Đặt lại bộ lọc",
            )}
          </div>
        </div>
        <div id="catalog" class="cards"></div>
        <div class="two-col preferences-layout">
          <section class="panel">
            <h2>Sở thích của bạn</h2>
            <form id="preferences-form" class="stack">
              ${field(
                "interests",
                "Chủ đề quan tâm",
                pref.interests,
                "text",
                "required",
              )}${field("goal", "Mục tiêu", pref.goal)}${field(
                "date",
                "Ngày tham dự",
                pref.date,
                "date",
              )}${field("start", "Bắt đầu", pref.start, "time")}${field(
                "end",
                "Kết thúc",
                pref.end,
                "time",
              )}${select(
                "level",
                "Mức độ",
                ["Cơ bản", "Trung cấp", "Chuyên sâu"],
                pref.level,
              )}<button class="primary" type="submit">Lưu sở thích</button
              >${btn("recommend", "Tạo gợi ý AI", "", "primary")}
            </form>
            <p class="ai-note">Chỉ dùng sở thích và lịch bạn đã lưu.</p>
          </section>
          ${aiPanel(
            "Agenda Recommender",
            /* HTML */ `<div class="result">
                <strong>Có giải thích · Bạn quyết định</strong>
                <p>
                  Chọn chủ đề, thời gian và mục tiêu. Gợi ý kiểm tra lịch, sức
                  chứa và thời gian di chuyển 8 phút trước khi đề xuất.
                </p>
                ${btn("recommend", "Xem gợi ý", "", "primary")}
              </div>
              ${btn("save-ai-draft", "Lưu bản gợi ý demo", "recommend")}
              <p>Bản gợi ý đã lưu chưa giữ chỗ.</p>`,
          )}
        </div>`;
    for (const id of ["search", "date", "topic", "speaker", "availability"])
      $("#" + id).addEventListener("input", filterCatalog);
    const speaker = new URLSearchParams(location.search).get("speaker");
    if (speaker) $("#speaker").value = speaker;
    filterCatalog();
    $("#preferences-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const d = Object.fromEntries(new FormData(ev.target));
      if (d.start >= d.end) return toast("Giờ kết thúc phải sau bắt đầu.");
      state().preferences = d;
      persist("Đã lưu sở thích");
    });
  }
  function materials() {
    const id = selectedSession(),
      rows = state().materials.filter((m) => m.sessionId === id);
    $("#content").innerHTML =
      heading(
        "Tài liệu session",
        "Quản lý tài liệu theo phiên bản; chỉ bản xuất bản xuất hiện trong Chi tiết session.",
      ) +
      /* HTML */ `<div class="banner">${sessionPicker()}</div>
        <div class="two-col">
          <div>
            <section class="panel">
              <h2>Thêm tài liệu</h2>
              <form id="material-form" class="stack">
                <label
                  >Chọn tệp PDF, PPTX, DOCX, MP4 (tối đa 200 MB)<input
                    type="file"
                    name="file"
                    accept=".pdf,.ppt,.pptx,.docx,.mp4"
                    required /></label
                >${select("access", "Quyền truy cập", [
                  "Người có vé",
                  "Công khai",
                  "Mở sau session",
                ])}<button
                  type="submit"
                  class="primary"
                  ${id ? "" : "disabled"}
                >
                  Lưu bản nháp tài liệu
                </button>
                <p id="upload-status" role="status"></p>
              </form>
              <p class="ai-note">
                Tệp của bạn được giữ trong IndexedDB trên trình duyệt này. Tài
                liệu mẫu chỉ có thông tin minh họa.
              </p>
            </section>
            <section class="panel">
              <h2>Thư viện · ${rows.length} tài liệu</h2>
              ${table(
                ["Tài liệu", "Phiên bản", "Trạng thái", "Thao tác"],
                rows.map(
                  (m) =>
                    /* HTML */ `<tr>
                      <td>
                        ${e(m.name)}<br /><small
                          >${m.url
                            ? e(m.url)
                            : (m.size / 1024 / 1024).toFixed(1) + " MB"}</small
                        >
                      </td>
                      <td>${m.url ? "Link" : "v" + m.version}</td>
                      <td>${badge(m.status, m.status === "Đã lưu trữ")}</td>
                      <td>
                        <div class="actions">
                          ${m.url && safeHttps(m.url)
                            ? /* HTML */ `<a
                                href="${e(m.url)}"
                                target="_blank"
                                rel="noopener"
                                >Mở ↗</a
                              >`
                            : btn("download-material", "Tải", m.id)}${btn(
                            "edit-material",
                            "Sửa",
                            m.id,
                          )}${m.status === "Bản nháp"
                            ? btn(
                                "publish-material",
                                "Xuất bản",
                                m.id,
                                "primary",
                              )
                            : m.status === "Đã lưu trữ"
                              ? btn("restore-material", "Khôi phục", m.id)
                              : btn("archive-material", "Lưu trữ", m.id)}${btn(
                            "delete-material",
                            "Xóa",
                            m.id,
                            "danger",
                          )}
                        </div>
                      </td>
                    </tr>`,
                ),
              )}
            </section>
          </div>
          <aside>
            <section class="panel">
              <h2>Thêm liên kết</h2>
              <form id="material-link-form" class="stack">
                ${field(
                  "name",
                  "Tên tài liệu *",
                  "",
                  "text",
                  "required",
                )}${field(
                  "url",
                  "URL HTTPS *",
                  "",
                  "url",
                  'required placeholder="https://…"',
                )}<label>Mô tả<textarea name="description"></textarea></label
                ><button type="submit" class="primary">Lưu liên kết</button>
              </form>
            </section>
            <section class="panel">
              <h2>Quyền truy cập</h2>
              <p>
                Bản nháp và bản lưu trữ không hiển thị cho người tham dự. Thư
                viện dùng chung với Chi tiết session.
              </p>
              ${link(
                "attendee-session-detail",
                "Xem Chi tiết session →",
                "",
                "?id=" + id,
              )}
            </section>
          </aside>
        </div>`;
    pickSession();
    $("#material-form").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const file = ev.target.elements.file.files[0];
      if (
        !file ||
        !/\.(pdf|ppt|pptx|docx|mp4)$/i.test(file.name) ||
        !file.size ||
        file.size > 200 * 1024 * 1024
      )
        return toast("Chọn đúng định dạng, dung lượng từ 1 byte đến 200 MB.");
      const button = ev.target.querySelector("button");
      button.disabled = true;
      $("#upload-status").textContent = "Đang lưu tệp trên thiết bị…";
      try {
        const key = Date.now();
        await EP.files.put(key, file);
        state().materials.push({
          id: key,
          name: file.name,
          size: file.size,
          sessionId: id,
          version: 1,
          status: "Bản nháp",
          access: ev.target.elements.access.value,
          source: "local",
        });
        persist("Đã lưu bản nháp tài liệu");
        render();
      } catch {
        button.disabled = false;
        $("#upload-status").textContent =
          "Không thể lưu tệp. Thử lại hoặc chọn tệp nhỏ hơn. Các tài liệu hiện có vẫn được giữ.";
      }
    });
    $("#material-link-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const d = Object.fromEntries(new FormData(ev.target));
      if (!safeHttps(d.url)) return toast("URL phải bắt đầu bằng https://.");
      if (!id) return toast("Hãy tạo session trước.");
      state().materials.push({
        id: Date.now(),
        sessionId: id,
        size: 0,
        version: 1,
        status: "Đã xuất bản",
        access: "Công khai",
        ...d,
      });
      persist("Đã lưu liên kết");
      render();
    });
  }
  function safeHttps(value) {
    try {
      const u = new URL(value);
      return u.protocol === "https:" && !u.username && !u.password;
    } catch {
      return false;
    }
  }
  function insights() {
    const id = selectedSession(),
      s = ownSessions().find((s) => s.id === id),
      replies = state().feedback.filter(
        (f) => f.status === "Đã gửi" && f.sessionId === id,
      );
    $("#content").innerHTML =
      heading(
        "Phân tích session",
        "Hiểu nhu cầu, câu hỏi và phản hồi sau phiên từ dữ liệu người tham dự.",
        btn("export-feedback", "Xuất phản hồi"),
      ) +
      /* HTML */ `<div class="banner">${sessionPicker()}</div>` +
      stats([
        ["Lượt quan tâm", s?.interest || s?.saves || 0],
        ["Đã tham dự", s?.checkin ?? "—"],
        ["Câu hỏi", state().questions.filter((q) => q.sessionId === id).length],
        [
          "Điểm phản hồi",
          replies.length
            ? (
                replies.reduce((n, f) => n + f.rating, 0) / replies.length
              ).toFixed(1) + "/5"
            : "—",
        ],
      ]) +
      /* HTML */ `<div class="two-col">
        <div>
          <section class="panel">
            <h2>Câu hỏi của người tham dự</h2>
            ${state()
              .questions.filter((q) => q.sessionId === id)
              .map(
                (q) =>
                  /* HTML */ `<article class="alert-item">
                    <strong>${e(q.text)}</strong>
                    <p>${q.votes} bình chọn</p>
                    ${q.answer
                      ? /* HTML */ `<p>${e(q.answer)}</p>`
                      : btn("answer-question", "Trả lời ngay", q.id)}
                  </article>`,
              )
              .join("") || empty("Chưa có câu hỏi")}
          </section>
          <section class="panel" id="original-feedback">
            <h2>Phản hồi sau session</h2>
            <span class="tag">Ẩn danh · Cập nhật từ Phản hồi session</span
            >${replies
              .map(
                (f) =>
                  /* HTML */ `<article class="alert-item">
                    <div class="stars">${"★".repeat(f.rating)}</div>
                    <small>${e(f.id)}</small>
                    <p>${e(f.comment)}</p>
                  </article>`,
              )
              .join("") || empty("Chưa có phản hồi")}
          </section>
        </div>
        <aside>
          ${aiPanel(
            "Tóm tắt phản hồi",
            /* HTML */ `<p>
                Đầu vào: ${replies.length} phản hồi đã gửi. Loại email, số điện
                thoại và URL trước khi tổng hợp.
              </p>
              <div id="summary-result"></div>
              ${btn("generate-summary", "Tạo lại đề xuất", id, "primary")}${btn(
                "save-ai-draft",
                "Lưu bản demo",
                "summary",
              )}
              <hr />
              <label
                >Tóm tắt thủ công<textarea id="manual-summary">
${e(state().summaries[id] || "")}</textarea
                ></label
              >${btn("save-manual-summary", "Lưu tóm tắt thủ công", id)}
              <p><a href="#original-feedback">Xem phản hồi gốc ↓</a></p>`,
          )}
        </aside>
      </div>`;
    pickSession();
  }
  function speakerSessions() {
    const rows = ownSessions();
    $("#content").innerHTML =
      heading(
        "Session của tôi",
        "Tạo nội dung, theo dõi phê duyệt và chuẩn bị tài liệu cho session đã chọn.",
        btn("speaker-new", "+ Tạo session mới", "", "primary"),
      ) +
      stats([
        ["Session của bạn", rows.length],
        ["Đã duyệt", rows.filter((s) => s.public).length],
        ["Chờ duyệt", rows.filter((s) => s.status === "Chờ duyệt").length],
        ["Cần chỉnh sửa", rows.filter((s) => s.status === "Bị từ chối").length],
      ]) +
      /* HTML */ `<div class="panel toolbar">
          <label
            >Tìm session<input
              id="speaker-search"
              type="search"
              placeholder="Tìm session của bạn…" /></label
          >${select("speaker-status", "Trạng thái", [
            "Tất cả",
            "Bản nháp",
            "Chờ duyệt",
            "Đã duyệt",
            "Hoàn thành",
            "Bị từ chối",
            "Đã lưu trữ",
          ])}
        </div>
        <div class="two-col">
          <div class="panel" id="speaker-list"></div>
          <aside class="panel">
            <h2>Quy trình phê duyệt</h2>
            <p>
              Lưu nháp → gửi duyệt → Ban tổ chức gán lịch và phòng → công khai.
            </p>
            <p>
              Tên 10–120 ký tự, mô tả ít nhất 80 ký tự, ba takeaway khi gửi
              duyệt. Diễn giả chỉ sửa nội dung của mình.
            </p>
            ${btn("speaker-new", "Tạo bản nháp", "", "primary")}
          </aside>
        </div>`;
    const update = () => {
      const q = $("#speaker-search").value.toLowerCase(),
        status = $('[name="speaker-status"]').value;
      $("#speaker-list").innerHTML =
        rows
          .filter(
            (s) =>
              s.title.toLowerCase().includes(q) &&
              (status === "Tất cả" || s.status === status),
          )
          .map(
            (s) =>
              /* HTML */ `<article class="alert-item">
                ${badge(s.status, s.status === "Bị từ chối")}
                <h3>${e(s.title)}</h3>
                <p>
                  S-${s.id} · ${shortDate(s.date)} · ${e(s.start)}–${e(s.end)} ·
                  ${e(s.room || "Chưa gán phòng")}
                </p>
                ${btn("speaker-content", "Chỉnh sửa", s.id)}
                ${link(
                  "speaker-session-materials",
                  "Tài liệu →",
                  "link",
                  "?id=" + s.id,
                )}
                ${link(
                  "speaker-session-insights",
                  "Phân tích →",
                  "link",
                  "?id=" + s.id,
                )}
                ${s.status === "Chờ duyệt"
                  ? btn("withdraw-session", "Rút đề xuất", s.id)
                  : s.status === "Đã lưu trữ"
                    ? btn("restore-session", "Khôi phục bản nháp", s.id)
                    : ""}
              </article>`,
          )
          .join("") || empty("Chưa có session ở bộ lọc này");
    };
    $("#speaker-search").addEventListener("input", update);
    $('[name="speaker-status"]').addEventListener("change", update);
    update();
  }
  function speakerContent(id) {
    const s = ownSessions().find((s) => s.id === id) || {};
    modal(
      "Tạo / chỉnh sửa session",
      /* HTML */ `<form id="speaker-content-form" class="stack">
        ${field(
          "title",
          "Tiêu đề *",
          s.title,
          "text",
          'required minlength="10" maxlength="120"',
        )}${select(
          "topic",
          "Chủ đề",
          ["AI & Data", "Product", "Fintech"],
          s.topic,
        )}<label
          >Mô tả *<textarea name="description" required>
${e(s.description || "")}</textarea
          ></label
        ><label
          >Ba takeaway (mỗi dòng một ý)<textarea name="takeaways">
${e(s.takeaways || "")}</textarea
          ></label
        >${select(
          "duration",
          "Thời lượng",
          ["30 phút", "45 phút", "60 phút"],
          s.duration,
        )}
        <p class="muted">
          Lịch và phòng chỉ được Ban tổ chức gán. Nội dung đã công khai khi sửa
          sẽ quay lại quy trình duyệt.
        </p>
        <p id="speaker-error" class="error" role="alert"></p>
        <div class="form-actions">
          <button type="submit" name="mode" value="draft">Lưu nháp</button
          ><button type="submit" name="mode" value="review" class="primary">
            Gửi duyệt
          </button>
        </div>
      </form>`,
    );
    $("#speaker-content-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const d = Object.fromEntries(new FormData(ev.target)),
        review = ev.submitter.value === "review";
      if (
        review &&
        (d.description.trim().length < 80 ||
          d.takeaways.split("\n").filter((x) => x.trim()).length < 3)
      ) {
        $("#speaker-error").textContent =
          "Mô tả cần ít nhất 80 ký tự và ba takeaway.";
        return;
      }
      const item = s.id
        ? s
        : {
            id: Date.now(),
            speaker: state().profile.name,
            date: "",
            start: "",
            end: "",
            room: "",
            capacity: 0,
            booked: 0,
            saves: 0,
            feedbackCount: 0,
            image: "ai",
          };
      Object.assign(item, d, {
        status: review ? "Chờ duyệt" : "Bản nháp",
        public: false,
      });
      if (!s.id) state().sessions.push(item);
      $("#modal").close();
      persist(
        review
          ? "Đã gửi session cho Ban tổ chức duyệt"
          : "Đã lưu bản nháp session",
      );
      render();
    });
  }
  function roomManagement() {
    management("rooms");
    $(".page-heading h1").textContent = "Phòng & thiết bị";
    const rooms = state().rooms;
    $(".page-heading").insertAdjacentHTML(
      "afterend",
      stats([
        ["Phòng trong demo", rooms.length],
        ["Tổng sức chứa", rooms.reduce((n, r) => n + r.capacity, 0)],
        ["Phòng có session", new Set(sessions().map((s) => s.room)).size],
        [
          "Xung đột công khai",
          EventAI.conflicts(sessions()).filter(([a, b]) => a.room === b.room)
            .length,
        ],
      ]),
    );
    const update = () => {
      const q = $("#manage-search").value.toLowerCase();
      $("#management-table").innerHTML =
        rooms
          .filter((r) => (r.name + " " + r.equipment).toLowerCase().includes(q))
          .map(
            (r) =>
              /* HTML */ `<article class="room-row">
                <div>
                  <h3>
                    ${e(r.name)} <span class="tag">${r.capacity} chỗ</span>
                  </h3>
                  <p>
                    ${e(r.location)} ·
                    ${e(r.equipment || "Chưa cập nhật thiết bị")}
                    ${r.accessible ? "· ♿" : ""}
                  </p>
                  ${btn("edit-rooms", "Sửa phòng", r.id)}
                  ${btn("room-schedule", "Xem lịch phòng", r.id)}
                  ${btn(
                    r.status === "Đã lưu trữ" ? "restore-room" : "archive-room",
                    r.status === "Đã lưu trữ" ? "Khôi phục" : "Lưu trữ",
                    r.id,
                    "danger",
                  )}
                  ${r.status === "Đã lưu trữ" ? badge("Đã lưu trữ") : ""}
                </div>
                <div>
                  ${sessions()
                    .filter((s) => s.room === r.name)
                    .map(
                      (s) =>
                        /* HTML */ `<p>
                          ${shortDate(s.date)} · ${e(s.start)} ·
                          ${s.booked}/${r.capacity}
                        </p>`,
                    )
                    .join("") || badge("Sẵn sàng")}
                </div>
              </article>`,
          )
          .join("") || empty("Không tìm thấy phòng");
    };
    $("#manage-search").addEventListener("input", update);
    update();
  }
  function ticketManagement() {
    management("tickets");
    const t = state().tickets;
    $(".page-heading").insertAdjacentHTML(
      "afterend",
      stats([
        ["Vé đã thanh toán", t.reduce((n, x) => n + (x.sold || 0), 0)],
        [
          "Quota đang mở",
          t
            .filter((x) => x.status !== "Tạm dừng")
            .reduce((n, x) => n + x.quantity, 0),
        ],
        ["Doanh thu vé", money(t.reduce((n, x) => n + (x.revenue || 0), 0))],
        ["Tạm dừng", t.filter((x) => x.status === "Tạm dừng").length],
      ]),
    );
    const update = () => {
      const q = $("#manage-search").value.toLowerCase();
      $("#management-table").innerHTML = /* HTML */ `<div class="grid-two">
        ${t
          .filter((x) => x.name.toLowerCase().includes(q))
          .map(
            (x) =>
              /* HTML */ `<article class="ticket-card">
                ${badge(x.status, x.status === "Tạm dừng")}
                <h2>${e(x.name)}</h2>
                <h3 class="ticket-price">${money(x.price)}</h3>
                <p>Đã bán ${x.sold || 0}/${x.quantity}</p>
                <progress
                  value="${x.sold || 0}"
                  max="${x.quantity || 1}"
                  aria-label="Quota vé"
                ></progress>
                <p>Thời gian bán: ${shortDate(x.start)}–${shortDate(x.end)}</p>
                <p>
                  ✓ Vào cửa 3 ngày<br />✓ Tài liệu & session<br />✓ Check-in QR
                </p>
                ${btn("edit-tickets", "Chỉnh sửa", x.id)}
                ${btn(
                  "toggle-ticket",
                  x.status === "Tạm dừng" ? "Kích hoạt lại" : "Vô hiệu hóa",
                  x.id,
                )}
              </article>`,
          )
          .join("")}
      </div>`;
    };
    $("#manage-search").addEventListener("input", update);
    update();
  }
  function eventAnalytics() {
    const t = state().tickets,
      users = state().users,
      s = sessions(),
      sold = t.reduce((n, x) => n + (x.sold || 0), 0),
      revenue = t.reduce((n, x) => n + (x.revenue || 0), 0);
    $("#content").innerHTML =
      heading(
        "Phân tích sự kiện",
        "Tổng quan đăng ký, doanh thu và hiệu quả nội dung — kết nối dữ liệu vé và người dùng.",
        btn("export-analytics", "Xuất báo cáo"),
      ) +
      /* HTML */ `<div class="panel toolbar">
          ${select("analytics-ticket", "Loại vé", [
            "Tất cả",
            ...t.map((x) => x.name),
          ])}${select("analytics-date", "Ngày tham dự", [
            "Toàn sự kiện",
            "2026-10-18",
            "2026-10-19",
            "2026-10-20",
          ])}<span class="tag">Demo · Sau sự kiện</span>
        </div>
        <div id="analytics-data"></div>`;
    const update = () => {
      const ticket = $('[name="analytics-ticket"]').value,
        date = $('[name="analytics-date"]').value,
        filtered = t.filter((x) => ticket === "Tất cả" || x.name === ticket),
        list = s.filter((x) => date === "Toàn sự kiện" || x.date === date);
      $("#analytics-data").innerHTML =
        stats([
          ["Tài khoản demo", users.length],
          ["Vé thanh toán", filtered.reduce((n, x) => n + (x.sold || 0), 0)],
          ["Check-in session", list.reduce((n, x) => n + (x.checkin || 0), 0)],
          [
            "Doanh thu vé",
            money(filtered.reduce((n, x) => n + (x.revenue || 0), 0)),
          ],
        ]) +
        /* HTML */ `<div class="two-col">
          <div>
            <section class="panel">
              <h2>Đặt chỗ & tham dự theo session</h2>
              <div class="bars">
                ${list
                  .map(
                    (x) =>
                      /* HTML */ `<div class="bar-row">
                        <span>${e(x.title)}</span>
                        <div class="bar">
                          <i
                            style="width:${Math.min(
                              100,
                              (x.booked / x.capacity) * 100,
                            )}%"
                          ></i>
                        </div>
                        <strong>${x.booked}</strong>
                      </div>`,
                  )
                  .join("")}
              </div>
              <p class="ai-note">
                Thanh biểu diễn tỷ lệ đặt chỗ / sức chứa. Số check-in được giữ
                riêng; một người có thể tham dự nhiều session.
              </p>
            </section>
            <section class="panel">
              <h2>Cơ cấu vé đã bán</h2>
              ${table(
                ["Loại vé", "Đã bán", "Tỷ trọng", "Doanh thu đã ghi nhận"],
                filtered.map(
                  (x) =>
                    /* HTML */ `<tr>
                      <td>${e(x.name)}</td>
                      <td>${x.sold || 0}</td>
                      <td>
                        ${sold ? (((x.sold || 0) / sold) * 100).toFixed(1) : 0}%
                      </td>
                      <td>${money(x.revenue || 0)}</td>
                    </tr>`,
                ),
              )}${link(
                "admin-ticket-type-management",
                "Quản lý loại vé →",
                "link",
              )}
            </section>
            <section class="panel">
              <h2>Trạng thái tài khoản</h2>
              ${table(
                ["Trạng thái", "Tài khoản"],
                [...new Set(users.map((u) => u.status))].map(
                  (status) =>
                    /* HTML */ `<tr>
                      <td>${e(status)}</td>
                      <td>
                        ${users.filter((u) => u.status === status).length}
                      </td>
                    </tr>`,
                ),
              )}${link("admin-user-management", "Quản lý người dùng →", "link")}
            </section>
          </div>
          <aside>
            <section class="panel">
              <h2>Session phổ biến</h2>
              ${list
                .sort(
                  (a, b) => (b.interest || b.saves) - (a.interest || a.saves),
                )
                .map(
                  (x) =>
                    /* HTML */ `<article class="alert-item">
                      <strong>${e(x.title)} · ${x.interest || x.saves}</strong>
                      <p>
                        ${x.booked} đặt chỗ trước ·
                        ${x.checkin ?? "Chưa có dữ liệu"} check-in
                      </p>
                    </article>`,
                )
                .join("") || empty("Khoảng ngày không có dữ liệu")}
              <p class="ai-note">
                Quan tâm không đồng nghĩa giữ chỗ. Check-in là dữ liệu mô phỏng
                sau sự kiện; không phải số thực tế hôm nay.
              </p>
            </section>
            <div class="banner warning">
              <div>
                <strong
                  >Dữ liệu đồng bộ · ${e(state().settings.integration)}</strong
                >
                <p>Giữ dữ liệu gần nhất khi kết nối gián đoạn.</p>
                ${link("admin-system-settings", "Cấu hình & Audit →", "link")}
              </div>
            </div>
          </aside>
        </div>`;
    };
    document
      .querySelectorAll('[name^="analytics-"]')
      .forEach((x) => x.addEventListener("change", update));
    update();
  }
  function newSettings() {
    const s = state().settings;
    $("#content").innerHTML =
      heading(
        "Cấu hình & Audit",
        "Cấu hình sự kiện, quyền truy cập, tích hợp dữ liệu và nhật ký hoạt động.",
      ) +
      /* HTML */ `<nav class="date-tabs" aria-label="Mục cấu hình">
          <a class="button" href="#event-settings">Cấu hình sự kiện</a
          ><a class="button" href="#permissions">Phân quyền</a
          ><a class="button" href="#integrations">Tích hợp dữ liệu</a
          ><a class="button" href="#audit">Nhật ký hoạt động</a>
        </nav>
        <div class="two-col">
          <div>
            <section class="panel" id="event-settings">
              <h2>Cấu hình sự kiện</h2>
              <form id="settings-form" class="form-grid">
                ${field(
                  "event",
                  "Tên sự kiện *",
                  s.event,
                  "text",
                  'required maxlength="120"',
                )}${field(
                  "location",
                  "Địa điểm *",
                  s.location,
                  "text",
                  'required maxlength="200"',
                )}${field(
                  "start",
                  "Bắt đầu *",
                  s.start,
                  "datetime-local",
                  "required",
                )}${field(
                  "end",
                  "Kết thúc *",
                  s.end,
                  "datetime-local",
                  "required",
                )}${select(
                  "timezone",
                  "Múi giờ",
                  ["Asia/Ho_Chi_Minh"],
                  s.timezone,
                )}${select(
                  "language",
                  "Ngôn ngữ",
                  ["Tiếng Việt"],
                  s.language,
                )}<label
                  ><span
                    ><input
                      type="checkbox"
                      name="notifications"
                      ${s.notifications ? "checked" : ""}
                    />
                    Bật thông báo demo</span
                  ></label
                >
                <p class="error full" id="settings-error" role="alert"></p>
                <div class="form-actions full">
                  <button class="primary" type="submit">Lưu sự kiện</button
                  >${btn("restore-settings", "Khôi phục bản trước")}
                </div>
              </form>
              <p class="ai-note">
                Tên, địa điểm và khoảng ngày đồng bộ sang Trang chủ, sidebar và
                lịch session.
              </p>
            </section>
            <section class="panel" id="integrations">
              <h2>Tích hợp dữ liệu</h2>
              ${table(
                ["Dịch vụ / Chức năng", "Trạng thái", "Thao tác"],
                [
                  ["CRM Nova", "Người dùng & vé", "Đã kết nối"],
                  ["MailFlow", "Email giao dịch", "Đã kết nối"],
                  ["Check-in API", "Thiết bị QR tại sảnh", s.integration],
                  ["Analytics Webhook", "Hành vi realtime", "126 tác vụ demo"],
                ].map(
                  ([name, description, status]) =>
                    /* HTML */ `<tr>
                      <td>${name}<br /><small>${description}</small></td>
                      <td>${badge(status, status.includes("Lỗi"))}</td>
                      <td>${btn("integration-info", "Cấu hình", name)}</td>
                    </tr>`,
                ),
              )}${btn("sync-demo", "Đồng bộ ngay")}
            </section>
            <section class="panel" id="permissions">
              <h2>Phân quyền workspace</h2>
              ${table(
                ["Vai trò", "Quyền chỉnh sửa", "Kiểm soát"],
                [
                  ["Người tham dự", "Agenda & phản hồi của mình", "Đăng nhập"],
                  [
                    "Diễn giả",
                    "Hồ sơ, session sở hữu, tài liệu",
                    "Theo session",
                  ],
                  [
                    "Ban tổ chức",
                    "Session, phòng, thông báo",
                    "Sự kiện được cấp",
                  ],
                  ["Quản trị viên", "Vé, tài khoản, cấu hình", "MFA bắt buộc"],
                ].map(
                  (row) =>
                    /* HTML */ `<tr>
                      ${row.map((x) => /* HTML */ `<td>${x}</td>`).join("")}
                    </tr>`,
                ),
              )}
              <p>✓ MFA quản trị · ✓ Audit · ✓ Ẩn danh phản hồi</p>
              <p class="ai-note">
                Đây là mô tả quyền của sản phẩm. Demo selector không thay đổi
                quyền tài khoản thật.
              </p>
              ${link("admin-user-management", "Quản lý người dùng →")}
            </section>
            <section class="panel" id="audit">
              <h2>Nhật ký hoạt động</h2>
              <label
                >Lọc nhật ký<input
                  type="search"
                  id="audit-filter"
                  placeholder="Tìm hành động…"
              /></label>
              <div id="audit-list"></div>
              ${btn("export-audit", "Xuất audit log")}
            </section>
            <section class="panel">
              <h2>Dữ liệu demo</h2>
              ${btn("reset-data", "Khôi phục dữ liệu mẫu", "", "danger")}
            </section>
          </div>
          <aside class="stack">
            <section class="panel">
              <h2>Check-in API</h2>
              ${badge(s.integration, s.integration.includes("Lỗi"))}
              <p>Mô phỏng kết nối, không gọi dịch vụ bên ngoài.</p>
              ${btn("test-integration", "Kiểm tra lại", "", "primary")}${btn(
                "disconnect-integration",
                "Ngắt kết nối",
                "",
                "danger",
              )}
              <p class="ai-note">
                Không nhập hoặc lưu API key thật trong bản demo.
              </p>
            </section>
            <section class="panel">
              <h2>Trạng thái hệ thống</h2>
              <p>● Web app · Ổn định</p>
              <p>● LocalStorage · Dữ liệu trên thiết bị</p>
              <p>● Check-in API · ${e(s.integration)}</p>
              <p>Dùng dữ liệu gần nhất; không xóa KPI khi mất kết nối.</p>
            </section>
          </aside>
        </div>`;
    $("#settings-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const d = Object.fromEntries(new FormData(ev.target));
      if (!d.event.trim() || !d.location.trim() || d.end <= d.start) {
        $("#settings-error").textContent =
          "Tên và địa điểm bắt buộc; kết thúc phải sau bắt đầu.";
        return;
      }
      if (
        state().sessions.some(
          (x) =>
            x.public &&
            (x.date < d.start.slice(0, 10) || x.date > d.end.slice(0, 10)),
        )
      ) {
        $("#settings-error").textContent =
          "Khoảng ngày phải bao gồm các session công khai hiện tại.";
        return;
      }
      state().previousSettings = { ...state().settings };
      Object.assign(s, d, { notifications: !!d.notifications });
      persist("Đã lưu cấu hình sự kiện");
      shell();
      render();
    });
    const update = () => {
      $("#audit-list").innerHTML =
        state()
          .audit.filter((a) =>
            a.message
              .toLowerCase()
              .includes($("#audit-filter").value.toLowerCase()),
          )
          .map(
            (a) =>
              /* HTML */ `<article class="alert-item">
                <strong>${e(a.message)}</strong><br /><small>${e(a.at)}</small>
              </article>`,
          )
          .join("") || empty("Chưa có hoạt động phù hợp");
    };
    $("#audit-filter").addEventListener("input", update);
    update();
  }
  function newForecast() {
    forecast();
    $(".page-heading").insertAdjacentHTML(
      "afterend",
      stats([
        ["Session có dữ liệu", sessions().filter((s) => s.saves >= 20).length],
        [
          "Nguy cơ quá tải",
          EventAI.forecast(sessions()).filter((r) => r.ratio > 1).length,
        ],
        ["Phòng", state().rooms.length],
        ["Bản dự báo đã lưu", state().forecasts.length],
      ]),
    );
    $("#forecast-form")
      .closest("section")
      .insertAdjacentHTML(
        "afterend",
        /* HTML */ `<section class="panel">
          <h2>Heatmap nhu cầu / sức chứa</h2>
          ${table(
            ["Phòng", ...["09:00", "10:30", "13:30", "14:30", "16:00"]],
            state().rooms.map(
              (room) =>
                /* HTML */ `<tr>
                  <td>${e(room.name)}</td>
                  ${["09:00", "10:30", "13:30", "14:30", "16:00"]
                    .map((time) => {
                      const x = sessions().find(
                        (s) =>
                          s.room === room.name &&
                          s.date === "2026-10-19" &&
                          s.start <= time &&
                          s.end > time,
                      );
                      const pred = x ? EventAI.forecast([x])[0] : null;
                      return /* HTML */ `<td>
                        ${pred
                          ? /* HTML */ `<span
                              class="heat ${pred.ratio > 1 ? "over" : ""}"
                              >${Math.round(pred.ratio * 100)}%</span
                            >`
                          : "—"}
                      </td>`;
                    })
                    .join("")}
                </tr>`,
            ),
          )}
          <p class="ai-note">
            “—” = không có session hoặc chưa có dữ liệu, không phải 0 người. Chỉ
            hiển thị chương trình 19/10.
          </p>
          ${btn("save-forecast", "Lưu bản demo", "", "primary")}
          ${btn("export-forecasts", "Xuất dự báo")}
          <div id="forecast-history">
            ${state()
              .forecasts.map(
                (f) =>
                  /* HTML */ `<p>${e(f.at)} · ${f.rows.length} session</p>`,
              )
              .join("")}
          </div>
        </section>`,
      );
    const container = $(".two-col"),
      input = $("#forecast-form").closest("section"),
      heat = $("#forecast-history").closest("section"),
      results = $("#forecast-results"),
      left = document.createElement("div");
    left.append(heat, results);
    container.replaceChildren(left, input);
  }
  function enhancedAlerts() {
    alerts();
    $(".page-heading").insertAdjacentHTML(
      "afterend",
      stats([
        ["Đã gửi", state().alerts.filter((a) => a.status === "Đã gửi").length],
        [
          "Đã lên lịch",
          state().alerts.filter((a) => a.status === "Đã lên lịch").length,
        ],
        ["Bản nháp", state().alerts.filter((a) => a.status === "Nháp").length],
        ["Đã hủy", state().alerts.filter((a) => a.status === "Đã hủy").length],
      ]),
    );
    document.querySelectorAll(".alert-item").forEach((el, i) => {
      const a = state().alerts[i];
      if (a) {
        el.insertAdjacentHTML(
          "beforeend",
          /* HTML */ `<p>
              <small
                >${e(a.channels || "Push")} · ${a.recipients || "Toàn sự kiện"}
                người nhận
                ${a.scheduledAt
                  ? "· " + e(a.scheduledAt.replace("T", " "))
                  : ""}</small
              >
            </p>
            ${a.status === "Đã lên lịch"
              ? btn("cancel-alert", "Hủy lịch", a.id)
              : ""}${a.status === "Nháp"
              ? btn("edit-alert", "Sửa nháp", a.id)
              : ""}${a.status === "Đã gửi"
              ? btn("alert-results", "Xem kết quả", a.id)
              : ""}`,
        );
      }
    });
  }
  function composeAlert(id = 0) {
    const item = state().alerts.find((a) => a.id === id) || {};
    modal(
      "Soạn / chỉnh sửa thông báo",
      /* HTML */ `<form id="alert-form" class="stack">
        ${field(
          "title",
          "Tiêu đề *",
          item.title,
          "text",
          'required maxlength="150"',
        )}<label
          >Nội dung *<textarea
            name="message"
            required
            minlength="10"
            maxlength="2000"
          >
${e(item.message || "")}</textarea
          ></label
        >${select(
          "priority",
          "Mức độ",
          ["Thông tin", "Quan trọng", "Khẩn cấp"],
          item.priority,
        )}${select(
          "sessionId",
          "Nhóm người nhận",
          ["Toàn sự kiện", ...sessions().map((s) => s.id + " · " + s.title)],
          item.sessionId
            ? item.sessionId +
                " · " +
                sessions().find((s) => s.id === item.sessionId)?.title
            : "Toàn sự kiện",
        )}${select(
          "channels",
          "Kênh",
          ["Push", "Push + Email", "Push + SMS"],
          item.channels,
        )}${field(
          "scheduledAt",
          "Thời điểm lên lịch",
          item.scheduledAt,
          "datetime-local",
        )}
        <p id="alert-error" class="error" role="alert"></p>
        <div class="form-actions">
          <button type="submit" value="draft">Lưu nháp</button
          ><button type="submit" value="preview">Xem trước</button
          ><button type="submit" value="schedule">Lên lịch</button
          ><button type="submit" value="send" class="primary">Gửi ngay</button>
        </div>
        <div id="alert-preview"></div>
      </form>`,
    );
    $("#alert-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const d = Object.fromEntries(new FormData(ev.target)),
        mode = ev.submitter.value;
      d.sessionId = parseInt(d.sessionId) || null;
      d.recipients = d.sessionId
        ? sessions().find((s) => s.id === d.sessionId)?.booked
        : state().users.length;
      if (!d.title.trim() || d.message.trim().length < 10)
        return ($("#alert-error").textContent =
          "Nhập tiêu đề và ít nhất 10 ký tự nội dung.");
      if (mode === "preview") {
        $("#alert-preview").innerHTML = /* HTML */ `<div class="result">
          <h3>${e(d.title)}</h3>
          <p>${e(d.message)}</p>
          <small>${d.recipients} người nhận · ${e(d.channels)}</small>${link(
            "attendee-my-agenda",
            "Mở Agenda của tôi →",
            "link",
          )}
        </div>`;
        return;
      }
      if (
        mode === "schedule" &&
        (!d.scheduledAt || new Date(d.scheduledAt) <= new Date())
      )
        return ($("#alert-error").textContent =
          "Thời điểm gửi phải ở tương lai.");
      const save = () => {
        Object.assign(item, d, {
          id: item.id || Date.now(),
          status:
            mode === "send"
              ? "Đã gửi"
              : mode === "schedule"
                ? "Đã lên lịch"
                : "Nháp",
          delivered: mode === "send" ? d.recipients : 0,
        });
        if (!id) state().alerts.unshift(item);
        persist("Đã lưu thông báo · " + item.status);
        render();
      };
      if (mode === "send")
        return confirmAction(
          "Xác nhận gửi",
          `Gửi ${d.channels} đến ${d.recipients} người nhận trong demo?`,
          save,
        );
      $("#modal").close();
      save();
    });
  }

  function userManagement() {
    management("users");
    $(".page-heading").insertAdjacentHTML(
      "afterend",
      stats([
        ["Tổng tài khoản demo", state().users.length],
        [
          "Hoạt động",
          state().users.filter((u) => u.status === "Hoạt động").length,
        ],
        [
          "Chờ xác thực",
          state().users.filter((u) => u.status === "Chờ xác thực").length,
        ],
        ["Đã khóa", state().users.filter((u) => u.status === "Đã khóa").length],
      ]),
    );
    $(".toolbar").insertAdjacentHTML(
      "beforeend",
      select("user-role", "Vai trò", [
        "Tất cả",
        ...Object.values(groups).map((g) => g[0]),
      ]) +
        select("user-status", "Trạng thái", [
          "Tất cả",
          "Hoạt động",
          "Chờ xác thực",
          "Đã khóa",
        ]),
    );
    const update = () => {
      const q = $("#manage-search").value.toLowerCase(),
        role = $('[name="user-role"]').value,
        status = $('[name="user-status"]').value;
      $("#management-table").innerHTML = table(
        ["Người dùng", "Email", "Vai trò / Trạng thái", "Thao tác"],
        state()
          .users.filter(
            (u) =>
              (u.name + " " + u.email).toLowerCase().includes(q) &&
              (role === "Tất cả" || u.role === role) &&
              (status === "Tất cả" || u.status === status),
          )
          .map(
            (u) =>
              /* HTML */ `<tr>
                <td>${e(u.name)}</td>
                <td>${e(u.email)}</td>
                <td>
                  ${e(u.role)}<br />${badge(u.status, u.status === "Đã khóa")}
                </td>
                <td>
                  ${btn("edit-users", "Sửa", u.id)}
                  ${btn(
                    "lock-user",
                    u.status === "Đã khóa" ? "Mở khóa" : "Khóa",
                    u.id,
                  )}
                </td>
              </tr>`,
          ),
      );
    };
    $("#manage-search").addEventListener("input", update);
    document
      .querySelectorAll('[name^="user-"]')
      .forEach((el) => el.addEventListener("change", update));
    update();
  }
  document.addEventListener("click", async (ev) => {
    const el = ev.target.closest("[data-action]");
    if (!el) return;
    const a = el.dataset.action,
      id = Number(el.dataset.id),
      s = state();
    if (a === "program-day") programDay(el.dataset.date);
    if (a === "checkin-help")
      modal(
        "Hướng dẫn check-in",
        "<p>Chuẩn bị vé QR và giấy tờ xác nhận. Đến sảnh chính từ 08:00; có lối tiếp cận và thang máy.</p>",
      );
    if (a === "privacy")
      modal(
        "Quyền riêng tư",
        "<p>Dữ liệu của bản demo chỉ được giữ trong trình duyệt. Phản hồi hiển thị ẩn danh; AI không dùng email và số điện thoại.</p>",
      );
    if (a === "speaker-new" || a === "speaker-content") speakerContent(id);
    if (a === "withdraw-session" || a === "restore-session") {
      const item = ownSessions().find((x) => x.id === id);
      if (item) {
        item.status = "Bản nháp";
        item.public = false;
        persist("Đã chuyển session về bản nháp");
        render();
      }
    }
    if (a === "archive-room" || a === "restore-room") {
      const room = s.rooms.find((r) => r.id === id);
      if (a === "archive-room" && sessions().some((x) => x.room === room.name))
        return toast(
          "Phòng còn session công khai. Chuyển các session sang phòng khác trước khi lưu trữ.",
        );
      confirmAction(
        a === "archive-room" ? "Lưu trữ phòng" : "Khôi phục phòng",
        "Cấu hình và lịch sử phòng được giữ lại.",
        () => {
          room.status = a === "archive-room" ? "Đã lưu trữ" : "Hoạt động";
          persist("Đã cập nhật trạng thái phòng");
          render();
        },
      );
    }
    if (a === "room-schedule") {
      const room = s.rooms.find((r) => r.id === id);
      modal(
        "Lịch sử dụng · " + e(room.name),
        table(
          ["Ngày", "Giờ", "Session"],
          sessions()
            .filter((x) => x.room === room.name)
            .map(
              (x) =>
                /* HTML */ `<tr>
                  <td>${shortDate(x.date)}</td>
                  <td>${e(x.start)}–${e(x.end)}</td>
                  <td>${e(x.title)}</td>
                </tr>`,
            ),
        ),
      );
    }
    if (
      ["publish-material", "archive-material", "restore-material"].includes(a)
    ) {
      const m = s.materials.find((m) => m.id === id);
      if (!ownSessions().some((x) => x.id === m?.sessionId)) return;
      m.status =
        a === "publish-material"
          ? "Đã xuất bản"
          : a === "archive-material"
            ? "Đã lưu trữ"
            : "Bản nháp";
      persist("Đã cập nhật tài liệu · " + m.status);
      render();
    }
    if (a === "edit-material") {
      const m = s.materials.find((m) => m.id === id);
      modal(
        "Chỉnh sửa tài liệu",
        /* HTML */ `<form id="edit-material-form" class="stack">
          ${field("name", "Tên tài liệu", m.name, "text", "required")}${select(
            "access",
            "Quyền truy cập",
            ["Người có vé", "Công khai", "Mở sau session"],
            m.access,
          )}${field(
            "opensAt",
            "Thời điểm mở (GMT+7)",
            m.opensAt || "2026-10-19T10:00",
            "datetime-local",
          )}<button type="submit" class="primary">Lưu phiên bản mới</button>
        </form>`,
      );
      $("#edit-material-form").addEventListener("submit", (ev) => {
        ev.preventDefault();
        Object.assign(m, Object.fromEntries(new FormData(ev.target)), {
          version: m.version + 1,
        });
        $("#modal").close();
        persist("Đã lưu phiên bản tài liệu v" + m.version);
        render();
      });
    }
    if (a === "download-material") {
      const m = s.materials.find((m) => m.id === id);
      if (!m) return;
      if (role === "attendee" && !materialVisible(m))
        return toast("Tài liệu chưa mở cho người tham dự.");
      if (m.source !== "local")
        return toast(
          "Tài liệu mẫu chỉ có metadata. Tải tệp của bạn ở workspace Diễn giả để kiểm tra tải xuống.",
        );
      try {
        const file = await EP.files.get(m.id);
        if (!file)
          return toast("Tệp không còn trên thiết bị này. Hãy tải lại.");
        const u = URL.createObjectURL(file),
          anchor = document.createElement("a");
        anchor.href = u;
        anchor.download = m.name;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(u), 1000);
      } catch {
        toast("Không thể mở kho tệp trên thiết bị.");
      }
    }
    if (a === "generate-summary") {
      const replies = s.feedback.filter(
        (f) => f.sessionId === id && f.status === "Đã gửi",
      );
      const result = EventAI.summary(replies);
      s.aiDrafts.summary = { sessionId: id, ...result };
      $("#summary-result").innerHTML = result.text
        ? /* HTML */ `<div class="result">
            <strong>Có giải thích · Bạn quyết định</strong>
            <p>${e(result.text)}</p>
            <p>${e(result.reason)}</p>
            <small>Nguồn: ${result.sources.map(e).join(", ")}</small>
            <div>
              ${btn("accept-summary", "Dùng tóm tắt", id, "primary")}
              ${btn("edit-summary", "Chỉnh sửa", id)}
              ${btn("reject-summary", "Từ chối", id)}
            </div>
          </div>`
        : "<p>Chưa đủ dữ liệu. Bạn có thể tóm tắt thủ công từ phản hồi gốc.</p>";
    }
    if (a === "accept-summary") {
      if (s.aiDrafts.summary?.sessionId !== id) return;
      s.summaries[id] = s.aiDrafts.summary.text;
      persist("Đã chấp nhận tóm tắt phản hồi");
      $("#manual-summary").value = s.summaries[id];
    }
    if (a === "edit-summary") {
      $("#manual-summary").value = s.aiDrafts.summary?.text || "";
      $("#manual-summary").focus();
    }
    if (a === "reject-summary") {
      $("#summary-result").innerHTML =
        "<p>Đã bỏ qua đề xuất. Tóm tắt đã lưu được giữ nguyên.</p>";
    }
    if (a === "save-manual-summary") {
      const text = $("#manual-summary").value.trim();
      if (!text) return toast("Nhập nội dung tóm tắt trước khi lưu.");
      s.summaries[id] = text;
      persist("Đã lưu tóm tắt thủ công");
    }
    if (a === "save-ai-draft") {
      if (!s.aiDrafts[el.dataset.id])
        return toast("Tạo gợi ý trước khi lưu bản demo.");
      persist("Đã lưu bản gợi ý demo · Chưa áp dụng thay đổi");
    }
    if (a === "answer-question") {
      const q = s.questions.find((q) => q.id === id);
      modal(
        "Trả lời câu hỏi",
        /* HTML */ `<p>${e(q.text)}</p>
          <form id="answer-form" class="stack">
            <label
              >Câu trả lời<textarea
                name="answer"
                required
                minlength="10"
              ></textarea></label
            ><button type="submit" class="primary">Gửi câu trả lời</button>
          </form>`,
      );
      $("#answer-form").addEventListener("submit", (ev) => {
        ev.preventDefault();
        q.answer = ev.target.elements.answer.value.trim();
        $("#modal").close();
        persist("Đã trả lời câu hỏi");
        render();
      });
    }
    if (a === "toggle-ticket") {
      const t = s.tickets.find((x) => x.id === id);
      confirmAction(
        "Thay đổi trạng thái vé",
        `${t.sold || 0} vé đã thanh toán vẫn giữ quyền lợi. Chỉ thay đổi việc bán mới.`,
        () => {
          t.status = t.status === "Tạm dừng" ? "Đang bán" : "Tạm dừng";
          persist("Đã cập nhật trạng thái loại vé");
          render();
        },
      );
    }
    if (a === "save-forecast") {
      s.forecasts.unshift({
        at: new Date().toLocaleString("vi-VN"),
        rows: EventAI.forecast(sessions()).map((r) => ({
          session: r.session.title,
          predicted: r.predicted,
          capacity: r.session.capacity,
          confidence: r.confidence,
        })),
      });
      persist("Đã lưu bản dự báo · Chưa đổi phòng");
      render();
    }
    if (a === "export-analytics")
      modal(
        "Xuất báo cáo",
        /* HTML */ `<p>
            Báo cáo theo dữ liệu hiện tại, không chứa tên/email người dùng.
          </p>
          <div class="form-actions">
            ${btn("analytics-csv", "Tải CSV", "", "primary")}${btn(
              "analytics-print",
              "Lưu PDF / In",
            )}
          </div>
          <p class="ai-note">
            Chọn Lưu PDF trong hộp thoại in của trình duyệt.
          </p>`,
      );
    if (a === "analytics-csv") {
      EP.export(
        "eventpulse-analytics",
        s.tickets.map((t) => ({
          type: t.name,
          sold: t.sold || 0,
          recordedRevenue: t.revenue || 0,
          quota: t.quantity,
        })),
      );
      toast("Đã xuất báo cáo CSV");
    }
    if (a === "analytics-print") {
      $("#modal").close();
      window.print();
    }
    if (a === "note-session") {
      modal(
        "Ghi chú session",
        /* HTML */ `<form id="note-form" class="stack">
          <label
            >Ghi chú<textarea name="note" maxlength="1000">
${e(s.notes[id] || "")}</textarea
            ></label
          ><button type="submit" class="primary">Lưu ghi chú</button>
        </form>`,
      );
      $("#note-form").addEventListener("submit", (ev) => {
        ev.preventDefault();
        s.notes[id] = ev.target.elements.note.value.trim();
        $("#modal").close();
        persist("Đã lưu ghi chú");
        render();
      });
    }
    if (a === "recording-session") {
      const item = s.sessions.find((x) => x.id === id);
      if (!item?.recording) return;
      s.recordings.push(id);
      removeAgenda(id);
      toast("Đã chuyển sang bản ghi · Chỗ trực tiếp được nhường lại");
    }
    if (a === "calendar-export") {
      const esc = (v) =>
        String(v)
          .replace(/\\/g, "\\\\")
          .replace(/\n/g, "\\n")
          .replace(/,/g, "\\,")
          .replace(/;/g, "\\;");
      const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//EventPulse//Demo//VI",
        ...agenda().flatMap((x) => [
          "BEGIN:VEVENT",
          "UID:" + x.id + "@eventpulse.demo",
          "DTSTAMP:" +
            new Date()
              .toISOString()
              .replace(/[-:]/g, "")
              .replace(/\.\d+Z/, "Z"),
          "DTSTART;TZID=Asia/Ho_Chi_Minh:" +
            x.date.replaceAll("-", "") +
            "T" +
            x.start.replace(":", "") +
            "00",
          "DTEND;TZID=Asia/Ho_Chi_Minh:" +
            x.date.replaceAll("-", "") +
            "T" +
            x.end.replace(":", "") +
            "00",
          "SUMMARY:" + esc(x.title),
          "LOCATION:" + esc(x.room),
          "DESCRIPTION:" + esc(s.notes[x.id] || ""),
          "END:VEVENT",
        ]),
        "END:VCALENDAR",
      ];
      const u = URL.createObjectURL(
          new Blob([lines.join("\r\n")], {
            type: "text/calendar;charset=utf-8",
          }),
        ),
        a = document.createElement("a");
      a.href = u;
      a.download = "eventpulse-agenda.ics";
      a.click();
      setTimeout(() => URL.revokeObjectURL(u), 1000);
    }
    if (a === "restore-settings") {
      if (!s.previousSettings) return toast("Chưa có bản cấu hình trước.");
      const prev = s.previousSettings;
      s.previousSettings = { ...s.settings };
      s.settings = prev;
      persist("Đã khôi phục cấu hình trước");
      shell();
      render();
    }
    if (a === "test-integration") {
      s.settings.integration = "Đã kết nối (mô phỏng)";
      persist("Kiểm tra kết nối demo thành công");
      render();
    }
    if (a === "disconnect-integration")
      confirmAction(
        "Ngắt kết nối demo",
        "Dừng đồng bộ Check-in API? Dữ liệu gần nhất vẫn được bảo toàn.",
        () => {
          s.settings.integration = "Đã ngắt kết nối";
          persist("Đã ngắt kết nối demo");
          render();
        },
      );
    if (a === "integration-info")
      modal(
        "Tích hợp dữ liệu",
        /* HTML */ `<p>
          ${e(el.dataset.id)} chỉ là trạng thái mô phỏng. Không có kết nối dịch
          vụ bên ngoài.
        </p>`,
      );
    if (a === "sync-demo") {
      persist("Đã mô phỏng đồng bộ dữ liệu · Giữ số liệu hiện tại");
    }
    if (a === "cancel-alert")
      confirmAction(
        "Hủy lịch gửi",
        "Thông báo chưa được gửi; có thể lên lịch lại.",
        () => {
          s.alerts.find((a) => a.id === id).status = "Đã hủy";
          persist("Đã hủy lịch gửi");
          render();
        },
      );
    if (a === "edit-alert") composeAlert(id);
    if (a === "alert-results") {
      const alert = s.alerts.find((a) => a.id === id);
      modal(
        "Kết quả gửi demo",
        /* HTML */ `<p>${e(alert.title)}</p>
          <p>
            ${alert.delivered ??
            alert.recipients ??
            s.users.length}/${alert.recipients ?? s.users.length}
            người nhận · ${e(alert.channels || "Push")}
          </p>
          <p>Số liệu mô phỏng; không gửi email, SMS hoặc push thật.</p>
          ${link("attendee-my-agenda", "Mở Agenda của tôi →")}`,
      );
    }
    if (a === "lock-user") {
      const user = s.users.find((x) => x.id === id);
      modal(
        user.status === "Đã khóa" ? "Mở khóa tài khoản" : "Khóa tài khoản",
        /* HTML */ `<p>Vé và phản hồi của ${e(user.name)} được bảo toàn.</p>
          <form id="lock-form" class="stack">
            ${field(
              "reason",
              "Lý do *",
              "",
              "text",
              'required minlength="5"',
            )}<button type="submit" class="danger">Xác nhận</button>
          </form>`,
      );
      $("#lock-form").addEventListener("submit", (ev) => {
        ev.preventDefault();
        user.status = user.status === "Đã khóa" ? "Hoạt động" : "Đã khóa";
        $("#modal").close();
        persist(
          "Đã cập nhật tài khoản " +
            user.name +
            " · " +
            ev.target.elements.reason.value.trim(),
        );
        render();
      });
    }
    if (a === "approve-session") {
      const item = s.sessions.find((x) => x.id === id);
      editEntity("sessions", id);
      $('[name="status"]').value = "Đã duyệt";
    }
  });
  async function loadProfileAvatar() {
    if (!state().profile.hasAvatar) return;
    try {
      const file = await EP.files.get("speaker-avatar");
      const target = $(".profile-avatar");
      if (file && target) {
        const u = URL.createObjectURL(file);
        const img = document.createElement("img");
        img.alt = "Ảnh đại diện diễn giả";
        img.src = u;
        img.onload = () => URL.revokeObjectURL(u);
        target.replaceChildren(img);
      }
    } catch {}
  }
  function materialVisible(m) {
    return (
      m.status === "Đã xuất bản" &&
      (m.access !== "Người có vé" || state().agenda.includes(m.sessionId)) &&
      (m.access !== "Mở sau session" ||
        new Date() >=
          new Date(
            m.opensAt ||
              `${state().sessions.find((s) => s.id === m.sessionId)?.date}T${state().sessions.find((s) => s.id === m.sessionId)?.end}:00+07:00`,
          ))
    );
  }

  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-action]");
    if (!el) return;
    ev.preventDefault();
    const a = el.dataset.action,
      id = Number(el.dataset.id);
    if (a === "close") return $("#modal").close();
    if (a === "menu") {
      $("#sidebar").classList.toggle("open");
      el.setAttribute(
        "aria-expanded",
        $("#sidebar").classList.contains("open"),
      );
      return;
    }
    if (a === "help")
      return modal(
        "Hướng dẫn demo",
        /* HTML */ `<p>
            Chọn vai trò ở cuối thanh bên để truy cập 16 màn hình. Dữ liệu dùng
            chung được lưu trong LocalStorage.
          </p>
          <p>
            Thử tìm và thêm session → kiểm tra Agenda → gửi phản hồi. Với ban tổ
            chức, tạo session / phòng và chạy dự báo để xem phương án đổi phòng.
          </p>
          <p>
            Bốn tính năng AI sử dụng quy tắc giả lập. Vai trò demo không phải cơ
            chế đăng nhập hay phân quyền bảo mật.
          </p>
          ${btn("close", "Đã hiểu", "", "primary")}`,
      );
    if (a === "notifications")
      return modal(
        "Thông báo",
        state().settings.notifications
          ? state()
              .alerts.filter((a) => a.status === "Đã gửi")
              .map(
                (a) =>
                  /* HTML */ `<div class="result">
                    <strong>${e(a.title)}</strong>
                    <p>${e(a.message)}</p>
                  </div>`,
              )
              .join("") || empty("Chưa có thông báo")
          : "<p>Bạn đã tắt thông báo trong cấu hình.</p>",
      );
    if (a === "add-agenda") return addAgenda(id);
    if (a === "remove-agenda")
      return confirmAction(
        "Gỡ session",
        "Chỗ trực tiếp sẽ được nhường lại. Bạn muốn gỡ session này?",
        () => removeAgenda(id),
      );
    if (a === "waitlist") {
      state().waitlist = state().waitlist.includes(id)
        ? state().waitlist.filter((x) => x !== id)
        : [...state().waitlist, id];
      persist("Đã cập nhật danh sách chờ");
      render();
      return;
    }
    if (a === "grid" || a === "list") {
      $("#catalog").classList.toggle("list", a === "list");
      return;
    }
    if (a === "reset-filters") {
      for (const n of ["search", "date", "topic", "speaker", "availability"])
        $("#" + n).value = "";
      filterCatalog();
      return;
    }
    if (a === "recommend") return recommend();
    if (a === "resolve") return resolve();
    if (a === "accept-recommend") {
      const s = sessions().find((s) => s.id === id);
      if (!s || agenda().some((x) => EventAI.overlap(x, s))) {
        toast("Agenda đã thay đổi. Hãy chạy lại gợi ý.");
        return;
      }
      addAgenda(id);
      el.closest(".result").remove();
      return;
    }
    if (a === "dismiss-result") {
      el.closest(".result").remove();
      return;
    }
    if (a === "draft-feedback") return saveFeedback("Nháp");
    if (a === "delete-feedback")
      return confirmAction(
        "Xóa phản hồi",
        "Bạn muốn xóa phản hồi và bản nháp?",
        () => {
          const sessionId = parseInt(
            $("#feedback-form").elements.sessionId.value,
          );
          const f = state().feedback.find(
            (f) => f.id === "personal-" + sessionId,
          );
          if (f?.status === "Đã gửi") {
            const s = state().sessions.find((s) => s.id === f.sessionId);
            if (s) s.feedbackCount = Math.max(0, s.feedbackCount - 1);
          }
          state().feedback = state().feedback.filter(
            (f) => f.id !== "personal-" + sessionId,
          );
          persist("Đã xóa phản hồi");
          render();
        },
      );
    if (a === "delete-material")
      return confirmAction(
        "Xóa tài liệu",
        "Xóa thông tin tài liệu khỏi demo?",
        () => {
          EP.files.remove(id).catch(() => {});
          state().materials = state().materials.filter((m) => m.id !== id);
          persist("Đã xóa thông tin tài liệu");
          render();
        },
      );
    if (a === "speaker-edit") return editEntity("sessions", id, true);
    if (a.startsWith("create-")) return editEntity(a.slice(7), 0);
    if (
      a.startsWith("edit-") &&
      ["sessions", "rooms", "users", "tickets"].includes(a.slice(5))
    )
      return editEntity(a.slice(5), id);
    if (a.startsWith("export-")) {
      const kind = a.slice(7);
      if (kind === "analytics") return;
      EP.export(
        "eventpulse-" + kind,
        kind === "agenda"
          ? agenda()
          : kind === "feedback"
            ? state()
                .feedback.filter(
                  (f) =>
                    f.status === "Đã gửi" && f.sessionId === selectedSession(),
                )
                .map((f) => ({
                  id: f.id,
                  rating: f.rating,
                  comment: f.comment,
                }))
            : state()[kind] || [],
      );
      toast("Đã xuất CSV");
      return;
    }
    if (a === "new-alert") return composeAlert();
    if (a === "publish-alert")
      return confirmAction(
        "Xác nhận phát hành",
        "Gửi thông báo đến nhóm người nhận trong demo?",
        () => {
          state().alerts.find((x) => x.id === id).status = "Đã gửi";
          persist("Đã phát hành thông báo demo");
          render();
        },
      );
    if (a === "delete-alert")
      return confirmAction(
        "Xóa thông báo",
        "Bạn muốn xóa thông báo này?",
        () => {
          state().alerts = state().alerts.filter((x) => x.id !== id);
          persist("Đã xóa thông báo");
          render();
        },
      );
    if (a === "forecast-room") return forecastRoom(id);
    if (a === "apply-room") {
      const s = sessions().find((s) => s.id === id),
        r = state().rooms.find((r) => r.id === Number(el.dataset.room));
      if (
        s.booked > r.capacity ||
        sessions().some(
          (x) => x.id !== id && x.room === r.name && EventAI.overlap(s, x),
        )
      )
        return toast("Phòng không còn phù hợp. Chạy lại dự báo.");
      const previous = s.room;
      s.room = r.name;
      s.capacity = r.capacity;
      state().alerts.unshift({
        id: Date.now(),
        title: "Đổi phòng · " + s.title,
        message: `${s.title} chuyển từ ${previous} sang ${r.name}, lúc ${s.start}.`,
        priority: "Quan trọng",
        status: "Nháp",
        sessionId: id,
        recipients: s.booked,
        channels: "Push + Email",
      });
      $("#modal").close();
      persist("Đã đổi phòng session sang " + r.name);
      render();
      return;
    }
    if (a === "reset-data")
      return confirmAction(
        "Khôi phục dữ liệu mẫu",
        "Mọi thay đổi trong demo sẽ được thay bằng dữ liệu mẫu. Tiếp tục?",
        () => {
          EP.reset();
          shell();
          render();
          toast("Đã khôi phục dữ liệu mẫu");
        },
      );
    if (
      a.startsWith("delete-") &&
      ["sessions", "rooms", "users", "tickets"].includes(a.slice(7))
    ) {
      const kind = a.slice(7);
      const item = state()[kind].find((x) => x.id === id);
      if (kind === "rooms" && sessions().some((s) => s.room === item.name)) {
        toast(
          "Phòng đang có session. Chuyển session sang phòng khác trước khi xóa.",
        );
        return;
      }
      return confirmAction(
        kind === "sessions" ? "Lưu trữ session" : "Xóa dữ liệu",
        "Bạn muốn " +
          (kind === "sessions"
            ? "lưu trữ session này và gỡ khỏi lịch công khai?"
            : "xóa mục này?"),
        () => {
          if (kind === "sessions") {
            item.status = "Đã lưu trữ";
            item.public = false;
            state().alerts.unshift({
              id: Date.now(),
              title: "Session được lưu trữ · " + item.title,
              message:
                "Session " +
                item.title +
                " đã được gỡ khỏi chương trình. Vui lòng kiểm tra agenda mới.",
              priority: "Quan trọng",
              status: "Nháp",
              sessionId: id,
              recipients: item.booked,
              channels: "Push + Email",
            });
            state().agenda = state().agenda.filter((x) => x !== id);
            state().waitlist = state().waitlist.filter((x) => x !== id);
          } else state()[kind] = state()[kind].filter((x) => x.id !== id);
          persist(
            kind === "sessions" ? "Đã lưu trữ session" : "Đã xóa dữ liệu",
          );
          render();
        },
      );
    }
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      $("#sidebar").classList.remove("open");
      $(".menu-toggle")?.setAttribute("aria-expanded", "false");
    }
  });
  if (route !== "home") shell();
  render();
  if (EP.warning) toast(EP.warning);
})();
