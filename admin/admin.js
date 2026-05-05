const loginCard = document.querySelector("#loginCard");
const adminPanel = document.querySelector("#adminPanel");
const loginForm = document.querySelector("#loginForm");
const loginNote = document.querySelector("#loginNote");
const logoutButton = document.querySelector("#logoutButton");
const uploadForm = document.querySelector("#uploadForm");
const uploadFileInput = document.querySelector("#uploadFile");
const uploadNote = document.querySelector("#uploadNote");
const mediaList = document.querySelector("#mediaList");
const articleForm = document.querySelector("#articleForm");
const articleNote = document.querySelector("#articleNote");
const projectForm = document.querySelector("#projectForm");
const projectNote = document.querySelector("#projectNote");
const articleList = document.querySelector("#articleList");
const projectList = document.querySelector("#projectList");
const refreshButton = document.querySelector("#refreshButton");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanes = document.querySelectorAll(".tab-pane");

async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = payload.error || payload.message || "Yêu cầu chưa thực hiện được.";
    throw new Error(error);
  }
  return payload;
}

function setNote(target, message, isError = false) {
  if (!target) return;
  target.textContent = message;
  target.style.color = isError ? "var(--danger)" : "var(--success)";
}

function openTab(tabId) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabId);
  });

  tabPanes.forEach((pane) => {
    pane.classList.toggle("active", pane.id === tabId);
  });
}

async function checkSession() {
  try {
    const payload = await requestJson("/api/admin/session", { method: "GET" });
    if (payload.authenticated) {
      loginCard.hidden = true;
      adminPanel.hidden = false;
      await loadDashboard();
      return;
    }
  } catch {
    // Giữ màn hình đăng nhập nếu phiên hết hạn hoặc chưa đăng nhập.
  }

  loginCard.hidden = false;
  adminPanel.hidden = true;
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openTab(button.dataset.tab);
  });
});

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const payload = {
    username: String(formData.get("username") || "").trim(),
    password: String(formData.get("password") || "")
  };

  try {
    await requestJson("/api/admin/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    setNote(loginNote, "Đăng nhập thành công. Đang mở bảng điều khiển...");
    loginForm.reset();
    await checkSession();
  } catch (error) {
    setNote(loginNote, error.message, true);
  }
});

logoutButton?.addEventListener("click", async () => {
  try {
    await requestJson("/api/admin/logout", { method: "POST" });
    adminPanel.hidden = true;
    loginCard.hidden = false;
    setNote(loginNote, "Bạn đã đăng xuất.");
  } catch (error) {
    alert(error.message);
  }
});

uploadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = uploadFileInput.files?.[0];
  if (!file) {
    setNote(uploadNote, "Vui lòng chọn ảnh trước khi upload.", true);
    return;
  }

  try {
    setNote(uploadNote, "Đang upload ảnh lên R2...");
    const form = new FormData();
    form.append("file", file);

    const response = await fetch("/api/admin/media", {
      method: "POST",
      body: form,
      credentials: "same-origin"
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Upload chưa thành công.");
    }
    setNote(uploadNote, `Upload thành công. Link ảnh: ${payload.item.url}`);
    uploadForm.reset();
    await loadMedia();
  } catch (error) {
    setNote(uploadNote, error.message, true);
  }
});

articleForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(articleForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const result = await requestJson("/api/admin/articles", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    setNote(articleNote, `Đã lưu bài viết. Link public: /bai-viet/${result.slug}`);
    articleForm.reset();
    await loadArticles();
    openTab("contentPane");
  } catch (error) {
    setNote(articleNote, error.message, true);
  }
});

projectForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(projectForm);
  const payload = Object.fromEntries(formData.entries());
  payload.stats = String(payload.stats || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  try {
    const result = await requestJson("/api/admin/projects", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    setNote(projectNote, `Đã lưu dự án. Link public: /du-an/${result.slug}`);
    projectForm.reset();
    await loadProjects();
    openTab("contentPane");
  } catch (error) {
    setNote(projectNote, error.message, true);
  }
});

refreshButton?.addEventListener("click", () => {
  loadDashboard().catch((error) => {
    alert(error.message);
  });
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy-url]");
  if (!button) return;

  const url = button.dataset.copyUrl;
  try {
    await navigator.clipboard.writeText(url);
    button.textContent = "Đã copy";
    setTimeout(() => {
      button.textContent = "Copy link";
    }, 1300);
  } catch {
    prompt("Copy link ảnh:", url);
  }
});

async function loadMedia() {
  const payload = await requestJson("/api/admin/media?limit=20", { method: "GET" });
  mediaList.innerHTML = payload.items.length
    ? payload.items
        .map(
          (item) => `
          <article class="media-item">
            <div>
              <strong>${escapeHtml(readableMime(item.mime_type))}</strong>
              <code>${escapeHtml(item.url)}</code>
              <small>${escapeHtml(formatDate(item.created_at))}</small>
            </div>
            <button class="copy-button" type="button" data-copy-url="${escapeHtml(item.url)}">Copy link</button>
          </article>
        `
        )
        .join("")
    : '<p class="note">Chưa có ảnh nào. Upload ảnh đầu tiên để dùng cho bài viết hoặc dự án.</p>';
}

async function loadArticles() {
  const payload = await requestJson("/api/admin/articles?limit=20", { method: "GET" });
  articleList.innerHTML = payload.items.length
    ? payload.items
        .map(
          (item) => `
          <article class="item-row">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(readableStatus(item.status))} · /bai-viet/${escapeHtml(item.slug)}</small>
            <code>Cập nhật: ${escapeHtml(formatDate(item.updated_at || item.created_at))}</code>
          </article>
        `
        )
        .join("")
    : '<p class="note">Chưa có bài viết nào trong CMS.</p>';
}

async function loadProjects() {
  const payload = await requestJson("/api/admin/projects?limit=20", { method: "GET" });
  projectList.innerHTML = payload.items.length
    ? payload.items
        .map(
          (item) => `
          <article class="item-row">
            <strong>${escapeHtml(item.name)}</strong>
            <small>${escapeHtml(readableStatus(item.status))} · /du-an/${escapeHtml(item.slug)}</small>
            <code>Cập nhật: ${escapeHtml(formatDate(item.updated_at || item.created_at))}</code>
          </article>
        `
        )
        .join("")
    : '<p class="note">Chưa có dự án nào trong CMS.</p>';
}

async function loadDashboard() {
  await Promise.all([loadMedia(), loadArticles(), loadProjects()]);
}

function readableStatus(status) {
  return status === "published" ? "Đã xuất bản" : "Bản nháp";
}

function readableMime(mimeType) {
  if (!mimeType) return "Ảnh đã upload";
  return mimeType.replace("image/", "Ảnh ");
}

function formatDate(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

checkSession();
