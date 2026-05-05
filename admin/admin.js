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
    const error = payload.error || payload.message || "Request failed";
    throw new Error(error);
  }
  return payload;
}

function setNote(target, message, isError = false) {
  target.textContent = message;
  target.style.color = isError ? "#ff9b9b" : "#8ee6af";
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
    // no-op
  }
  loginCard.hidden = false;
  adminPanel.hidden = true;
}

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
    setNote(loginNote, "Dang nhap thanh cong.");
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
  } catch (error) {
    alert(error.message);
  }
});

uploadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = uploadFileInput.files?.[0];
  if (!file) {
    setNote(uploadNote, "Chon file truoc khi upload.", true);
    return;
  }

  try {
    const form = new FormData();
    form.append("file", file);

    const response = await fetch("/api/admin/media", {
      method: "POST",
      body: form,
      credentials: "same-origin"
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Upload failed");
    }
    setNote(uploadNote, `Upload thanh cong: ${payload.item.url}`);
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
    setNote(articleNote, `Da luu bai viet: /bai-viet/${result.slug}`);
    articleForm.reset();
    await loadArticles();
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
    setNote(projectNote, `Da luu du an: /du-an/${result.slug}`);
    projectForm.reset();
    await loadProjects();
  } catch (error) {
    setNote(projectNote, error.message, true);
  }
});

refreshButton?.addEventListener("click", () => {
  loadDashboard().catch((error) => {
    alert(error.message);
  });
});

async function loadMedia() {
  const payload = await requestJson("/api/admin/media?limit=20", { method: "GET" });
  mediaList.innerHTML = payload.items.length
    ? payload.items
        .map(
          (item) => `
          <article class="media-item">
            <strong>${escapeHtml(item.mime_type)}</strong>
            <code>${escapeHtml(item.url)}</code>
            <small>${escapeHtml(item.created_at || "")}</small>
          </article>
        `
        )
        .join("")
    : "<p>Chua co file nao.</p>";
}

async function loadArticles() {
  const payload = await requestJson("/api/admin/articles?limit=20", { method: "GET" });
  articleList.innerHTML = payload.items.length
    ? payload.items
        .map(
          (item) => `
          <article class="item-row">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.status)} • /bai-viet/${escapeHtml(item.slug)}</small>
            <code>${escapeHtml(item.updated_at || item.created_at || "")}</code>
          </article>
        `
        )
        .join("")
    : "<p>Chua co bai viet nao.</p>";
}

async function loadProjects() {
  const payload = await requestJson("/api/admin/projects?limit=20", { method: "GET" });
  projectList.innerHTML = payload.items.length
    ? payload.items
        .map(
          (item) => `
          <article class="item-row">
            <strong>${escapeHtml(item.name)}</strong>
            <small>${escapeHtml(item.status)} • /du-an/${escapeHtml(item.slug)}</small>
            <code>${escapeHtml(item.updated_at || item.created_at || "")}</code>
          </article>
        `
        )
        .join("")
    : "<p>Chua co du an nao.</p>";
}

async function loadDashboard() {
  await Promise.all([loadMedia(), loadArticles(), loadProjects()]);
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
