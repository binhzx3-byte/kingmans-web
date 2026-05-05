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
const articleCancelEdit = document.querySelector("#articleCancelEdit");
const articleSubmitButton = articleForm?.querySelector("button[type='submit']");
const projectForm = document.querySelector("#projectForm");
const projectNote = document.querySelector("#projectNote");
const projectCancelEdit = document.querySelector("#projectCancelEdit");
const projectSubmitButton = projectForm?.querySelector("button[type='submit']");
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
  const id = String(formData.get("id") || "").trim();
  const payload = Object.fromEntries(formData.entries());
  delete payload.id;

  try {
    const result = await requestJson(id ? `/api/admin/articles/${encodeURIComponent(id)}` : "/api/admin/articles", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    setNote(articleNote, id ? `Đã cập nhật bài viết. Link public: /bai-viet/${result.slug}` : `Đã lưu bài viết. Link public: /bai-viet/${result.slug}`);
    resetArticleEditor();
    await loadArticles();
    openTab("contentPane");
  } catch (error) {
    setNote(articleNote, error.message, true);
  }
});

projectForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(projectForm);
  const id = String(formData.get("id") || "").trim();
  const payload = Object.fromEntries(formData.entries());
  delete payload.id;
  payload.stats = String(payload.stats || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  try {
    const result = await requestJson(id ? `/api/admin/projects/${encodeURIComponent(id)}` : "/api/admin/projects", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    setNote(projectNote, id ? `Đã cập nhật dự án. Link public: /du-an/${result.slug}` : `Đã lưu dự án. Link public: /du-an/${result.slug}`);
    resetProjectEditor();
    await loadProjects();
    openTab("contentPane");
  } catch (error) {
    setNote(projectNote, error.message, true);
  }
});

articleCancelEdit?.addEventListener("click", () => {
  resetArticleEditor();
  setNote(articleNote, "Đã hủy chế độ sửa bài viết.");
});

projectCancelEdit?.addEventListener("click", () => {
  resetProjectEditor();
  setNote(projectNote, "Đã hủy chế độ sửa dự án.");
});

refreshButton?.addEventListener("click", () => {
  loadDashboard().catch((error) => {
    alert(error.message);
  });
});

document.addEventListener("click", async (event) => {
  const copyButton = event.target.closest("[data-copy-url]");
  if (copyButton) {
    const url = copyButton.dataset.copyUrl;
    try {
      await navigator.clipboard.writeText(url);
      copyButton.textContent = "Đã copy";
      setTimeout(() => {
        copyButton.textContent = "Copy link";
      }, 1300);
    } catch {
      prompt("Copy link ảnh:", url);
    }
    return;
  }

  const editArticleButton = event.target.closest("[data-edit-article]");
  if (editArticleButton) {
    await editArticle(editArticleButton.dataset.editArticle);
    return;
  }

  const deleteArticleButton = event.target.closest("[data-delete-article]");
  if (deleteArticleButton) {
    await deleteArticle(deleteArticleButton.dataset.deleteArticle, deleteArticleButton.dataset.title);
    return;
  }

  const editProjectButton = event.target.closest("[data-edit-project]");
  if (editProjectButton) {
    await editProject(editProjectButton.dataset.editProject);
    return;
  }

  const deleteProjectButton = event.target.closest("[data-delete-project]");
  if (deleteProjectButton) {
    await deleteProject(deleteProjectButton.dataset.deleteProject, deleteProjectButton.dataset.title);
  }
});

async function loadMedia() {
  const payload = await requestJson("/api/admin/media?limit=20", { method: "GET" });
  const items = payload.items || [];
  mediaList.innerHTML = items.length
    ? items
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
  const payload = await requestJson("/api/admin/articles?limit=50", { method: "GET" });
  const items = payload.items || [];
  articleList.innerHTML = items.length
    ? items
        .map((item) => {
          const publicUrl = `/bai-viet/${item.slug}`;
          return `
            <article class="item-row">
              <div>
                <strong>${escapeHtml(item.title)}</strong>
                <small>${escapeHtml(readableStatus(item.status))} · ${escapeHtml(publicUrl)}</small>
                <code>Cập nhật: ${escapeHtml(formatDate(item.updated_at || item.created_at))}</code>
              </div>
              <div class="row-actions">
                <a class="copy-button" href="${escapeHtml(publicUrl)}" target="_blank" rel="noreferrer">Xem</a>
                <button class="copy-button" type="button" data-edit-article="${escapeHtml(item.id)}">Sửa</button>
                <button class="copy-button danger-action" type="button" data-delete-article="${escapeHtml(item.id)}" data-title="${escapeHtml(item.title)}">Xóa</button>
              </div>
            </article>
          `;
        })
        .join("")
    : '<p class="note">Chưa có bài viết nào trong CMS.</p>';
}

async function loadProjects() {
  const payload = await requestJson("/api/admin/projects?limit=50", { method: "GET" });
  const items = payload.items || [];
  projectList.innerHTML = items.length
    ? items
        .map((item) => {
          const publicUrl = `/du-an/${item.slug}`;
          return `
            <article class="item-row">
              <div>
                <strong>${escapeHtml(item.name)}</strong>
                <small>${escapeHtml(readableStatus(item.status))} · ${escapeHtml(publicUrl)}</small>
                <code>Cập nhật: ${escapeHtml(formatDate(item.updated_at || item.created_at))}</code>
              </div>
              <div class="row-actions">
                <a class="copy-button" href="${escapeHtml(publicUrl)}" target="_blank" rel="noreferrer">Xem</a>
                <button class="copy-button" type="button" data-edit-project="${escapeHtml(item.id)}">Sửa</button>
                <button class="copy-button danger-action" type="button" data-delete-project="${escapeHtml(item.id)}" data-title="${escapeHtml(item.name)}">Xóa</button>
              </div>
            </article>
          `;
        })
        .join("")
    : '<p class="note">Chưa có dự án nào trong CMS.</p>';
}

async function loadDashboard() {
  await Promise.all([loadMedia(), loadArticles(), loadProjects()]);
}

async function editArticle(id) {
  try {
    setNote(articleNote, "Đang tải dữ liệu bài viết...");
    const payload = await requestJson(`/api/admin/articles/${encodeURIComponent(id)}`, { method: "GET" });
    const item = payload.item;
    fillField(articleForm, "id", item.id);
    fillField(articleForm, "slug", item.slug);
    fillField(articleForm, "category", item.category);
    fillField(articleForm, "title", item.title);
    fillField(articleForm, "excerpt", item.excerpt);
    fillField(articleForm, "cover_image_url", item.cover_image_url);
    fillField(articleForm, "seo_title", item.seo_title);
    fillField(articleForm, "seo_description", item.seo_description);
    fillField(articleForm, "status", item.status);
    fillField(articleForm, "content_html", item.content_html);
    fillField(articleForm, "content_markdown", item.content_markdown);
    if (articleSubmitButton) articleSubmitButton.textContent = "Cập nhật bài viết";
    if (articleCancelEdit) articleCancelEdit.hidden = false;
    openTab("articlePane");
    articleForm.scrollIntoView({ behavior: "smooth", block: "start" });
    setNote(articleNote, "Đang ở chế độ sửa. Kiểm tra nội dung rồi bấm Cập nhật bài viết.");
  } catch (error) {
    setNote(articleNote, error.message, true);
  }
}

async function deleteArticle(id, title) {
  if (!confirm(`Xóa bài viết "${title || "này"}"? Thao tác này sẽ gỡ bài khỏi website.`)) {
    return;
  }

  try {
    await requestJson(`/api/admin/articles/${encodeURIComponent(id)}`, { method: "DELETE" });
    resetArticleEditor();
    await loadArticles();
    setNote(articleNote, "Đã xóa bài viết khỏi CMS.");
  } catch (error) {
    setNote(articleNote, error.message, true);
  }
}

async function editProject(id) {
  try {
    setNote(projectNote, "Đang tải dữ liệu dự án...");
    const payload = await requestJson(`/api/admin/projects/${encodeURIComponent(id)}`, { method: "GET" });
    const item = payload.item;
    fillField(projectForm, "id", item.id);
    fillField(projectForm, "slug", item.slug);
    fillField(projectForm, "project_type", item.project_type);
    fillField(projectForm, "name", item.name);
    fillField(projectForm, "location", item.location);
    fillField(projectForm, "summary", item.summary);
    fillField(projectForm, "cover_image_url", item.cover_image_url);
    fillField(projectForm, "cta_url", item.cta_url);
    fillField(projectForm, "stats", (item.stats || []).join("\n"));
    fillField(projectForm, "seo_title", item.seo_title);
    fillField(projectForm, "seo_description", item.seo_description);
    fillField(projectForm, "status", item.status);
    fillField(projectForm, "content_html", item.content_html);
    fillField(projectForm, "content_markdown", item.content_markdown);
    if (projectSubmitButton) projectSubmitButton.textContent = "Cập nhật dự án";
    if (projectCancelEdit) projectCancelEdit.hidden = false;
    openTab("projectPane");
    projectForm.scrollIntoView({ behavior: "smooth", block: "start" });
    setNote(projectNote, "Đang ở chế độ sửa. Kiểm tra nội dung rồi bấm Cập nhật dự án.");
  } catch (error) {
    setNote(projectNote, error.message, true);
  }
}

async function deleteProject(id, title) {
  if (!confirm(`Xóa dự án "${title || "này"}"? Trang dự án sẽ không còn hiển thị.`)) {
    return;
  }

  try {
    await requestJson(`/api/admin/projects/${encodeURIComponent(id)}`, { method: "DELETE" });
    resetProjectEditor();
    await loadProjects();
    setNote(projectNote, "Đã xóa dự án khỏi CMS.");
  } catch (error) {
    setNote(projectNote, error.message, true);
  }
}

function resetArticleEditor() {
  articleForm?.reset();
  fillField(articleForm, "id", "");
  if (articleSubmitButton) articleSubmitButton.textContent = "Lưu bài viết";
  if (articleCancelEdit) articleCancelEdit.hidden = true;
}

function resetProjectEditor() {
  projectForm?.reset();
  fillField(projectForm, "id", "");
  if (projectSubmitButton) projectSubmitButton.textContent = "Lưu dự án";
  if (projectCancelEdit) projectCancelEdit.hidden = true;
}

function fillField(form, name, value) {
  const field = form?.elements?.namedItem(name);
  if (!field) return;
  field.value = value ?? "";
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
