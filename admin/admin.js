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
const articlePreviewButton = document.querySelector("#articlePreviewButton");
const articleSubmitButton = articleForm?.querySelector("button[type='submit']");
const projectForm = document.querySelector("#projectForm");
const projectNote = document.querySelector("#projectNote");
const projectCancelEdit = document.querySelector("#projectCancelEdit");
const projectPreviewButton = document.querySelector("#projectPreviewButton");
const projectSubmitButton = projectForm?.querySelector("button[type='submit']");
const autoNewsForm = document.querySelector("#autoNewsForm");
const autoNewsNote = document.querySelector("#autoNewsNote");
const autoNewsResult = document.querySelector("#autoNewsResult");
const autoNewsSources = document.querySelector("#autoNewsSources");
const autoNewsRefreshButton = document.querySelector("#autoNewsRefreshButton");
const seoChecklist = document.querySelector("#seoChecklist");
const seoResetChecklist = document.querySelector("#seoResetChecklist");
const seoChecklistNote = document.querySelector("#seoChecklistNote");
const backlinkForm = document.querySelector("#backlinkForm");
const backlinkList = document.querySelector("#backlinkList");
const backlinkNote = document.querySelector("#backlinkNote");
const backlinkSeedButton = document.querySelector("#backlinkSeedButton");
const articleList = document.querySelector("#articleList");
const projectList = document.querySelector("#projectList");
const refreshButton = document.querySelector("#refreshButton");
const previewModal = document.querySelector("#previewModal");
const previewTitle = document.querySelector("#previewTitle");
const previewBody = document.querySelector("#previewBody");
const previewCloseButton = document.querySelector("#previewCloseButton");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanes = document.querySelectorAll(".tab-pane");
const richEditors = {};
const savedSelections = {};
const seoCounterUpdaters = [];
const SEO_CHECKLIST_STORAGE = "kingmans-free-seo-checklist";
const BACKLINK_STORAGE = "kingmans-free-seo-backlinks";
const SEO_CHECKLIST_ITEMS = [
  "Đăng ít nhất 3 bài mới trong tuần, mỗi bài có ảnh, CTA và internal link.",
  "Mở Google Search Console, kiểm tra trang có impression nhưng CTR thấp.",
  "Gửi sitemap lại sau khi có bài hoặc landing page quan trọng.",
  "Chia sẻ 2 bài tốt nhất lên Facebook, LinkedIn, Zalo và Google Business Profile.",
  "Thêm 3 internal link trỏ về Opal Luxury, Gem Sky World hoặc Khải Hoàn Imperial.",
  "Kiểm tra 1 bài cũ: thêm FAQ, cập nhật ngày, bổ sung nguồn hoặc bảng so sánh.",
  "Tạo hoặc cập nhật 1 hồ sơ backlink sạch: profile, directory, đối tác hoặc cộng đồng."
];
const BACKLINK_SEED_ITEMS = [
  {
    site: "Google Business Profile",
    url: "https://www.google.com/business/",
    type: "Profile",
    status: "Cần làm"
  },
  {
    site: "LinkedIn cá nhân / Company Page",
    url: "https://www.linkedin.com/",
    type: "Social",
    status: "Cần làm"
  },
  {
    site: "Facebook Page KINGMANS Realty",
    url: "https://www.facebook.com/profile.php?id=61586688100723&locale=vi_VN",
    type: "Social",
    status: "Đã có link"
  },
  {
    site: "Zalo OA / Zalo cá nhân",
    url: "https://zalo.me/0396460442",
    type: "Social",
    status: "Cần làm"
  },
  {
    site: "Trang đối tác / chủ đầu tư / cộng đồng cư dân",
    url: "",
    type: "PR cộng đồng",
    status: "Cần làm"
  }
];
const DESIGN_BLOCKS = {
  "article-lede": `
    <p class="article-lede">Đặt vấn đề bằng một góc nhìn rõ ràng: thị trường đang thay đổi như thế nào, người mua cần thận trọng ở đâu và đâu là dữ liệu nên kiểm chứng trước khi xuống tiền.</p>
  `,
  "expert-quote": `
    <blockquote>Nhận định từ KINGMANS Realty: bất động sản không nên được đánh giá bằng cảm xúc nhất thời. Một quyết định tốt cần đi qua ba lớp kiểm chứng: vị trí thực, pháp lý thực và dòng tiền thực.</blockquote>
  `,
  callout: `
    <div class="article-callout">
      <strong>Điểm cần lưu ý</strong>
      <p>Nội dung này nên được đối chiếu với hồ sơ pháp lý, tiến độ công trường và bảng giá cập nhật tại thời điểm giao dịch.</p>
    </div>
  `,
  "image-figure": `
    <figure class="article-figure">
      <img src="/media/uploads/duong-dan-anh.webp" alt="Mô tả ảnh rõ ràng cho SEO">
      <figcaption>Chú thích ảnh ngắn gọn, có từ khóa dự án hoặc khu vực nếu phù hợp.</figcaption>
    </figure>
  `,
  "comparison-table": `
    <div class="article-table-wrap">
      <table class="article-table">
        <thead>
          <tr>
            <th>Tiêu chí</th>
            <th>Phương án A</th>
            <th>Phương án B</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Vị trí</td>
            <td>Gần trục kết nối chính, tiện di chuyển hằng ngày.</td>
            <td>Lợi thế giá vào tốt hơn nhưng cần kiểm tra thanh khoản.</td>
          </tr>
          <tr>
            <td>Pháp lý</td>
            <td>Cần đối chiếu giấy phép, 1/500 và điều kiện mở bán.</td>
            <td>Cần kiểm tra tiến độ sổ và nghĩa vụ tài chính.</td>
          </tr>
          <tr>
            <td>Dòng tiền</td>
            <td>Phù hợp khai thác thuê nếu có cộng đồng cư dân thực.</td>
            <td>Phù hợp nắm giữ trung hạn nếu hạ tầng đang hoàn thiện.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  checklist: `
    <div class="article-callout">
      <strong>Checklist kiểm tra nhanh</strong>
      <ul>
        <li>Quy hoạch 1/500 và giấy phép xây dựng.</li>
        <li>Văn bản đủ điều kiện bán nhà hình thành trong tương lai.</li>
        <li>Ngân hàng bảo lãnh và tiến độ thanh toán thực tế.</li>
        <li>Khả năng khai thác thuê hoặc bán lại trong 3-5 năm.</li>
      </ul>
    </div>
  `,
  faq: `
    <h2>Câu hỏi thường gặp</h2>
    <h3>Người mua nên kiểm tra gì đầu tiên?</h3>
    <p>Ưu tiên kiểm tra pháp lý nền tảng, tiến độ thực tế và tổng chi phí sở hữu thay vì chỉ nhìn giá niêm yết.</p>
    <h3>Khi nào nên dùng đòn bẩy tài chính?</h3>
    <p>Chỉ nên vay khi khoản trả hằng tháng sau ưu đãi vẫn nằm trong vùng an toàn của dòng tiền gia đình.</p>
  `,
  "consult-cta": `
    <div class="article-callout cta-callout">
      <strong>Cần kiểm tra dự án trước khi đặt cọc?</strong>
      <p>Gửi ngân sách, khu vực quan tâm và mục tiêu mua. KINGMANS Realty sẽ hỗ trợ bóc tách bảng giá, pháp lý, dòng tiền và rủi ro trước khi ra quyết định.</p>
      <p><a class="button primary" href="/#contact">Gửi nhu cầu tư vấn</a></p>
    </div>
  `,
  "project-overview": `
    <h2>Tổng quan dự án</h2>
    <p>Dự án được định vị cho nhóm khách hàng tìm kiếm không gian sống có kết nối thuận tiện, hệ tiện ích đủ sâu và khả năng nắm giữ tài sản trong trung hạn.</p>
    <div class="article-callout">
      <strong>Góc nhìn KINGMANS</strong>
      <p>Điểm quan trọng không nằm ở lời giới thiệu đẹp, mà nằm ở pháp lý, tiến độ, vị trí thật và khả năng tạo nhu cầu ở thực sau bàn giao.</p>
    </div>
  `,
  "project-highlights": `
    <h2>Ba điểm nổi bật cần quan tâm</h2>
    <ul>
      <li><strong>Vị trí:</strong> kết nối nhanh đến các trục giao thông và cụm tiện ích lớn.</li>
      <li><strong>Sản phẩm:</strong> cơ cấu căn hộ phù hợp nhu cầu ở thực và khai thác thuê.</li>
      <li><strong>Vận hành:</strong> tiện ích, quản lý và cộng đồng cư dân quyết định giá trị dài hạn.</li>
    </ul>
  `,
  "legal-status": `
    <h2>Cập nhật pháp lý cần kiểm tra</h2>
    <div class="article-callout">
      <strong>Danh mục hồ sơ nên đối chiếu</strong>
      <ul>
        <li>Quy hoạch chi tiết 1/500.</li>
        <li>Giấy phép xây dựng và tiến độ nghiệm thu.</li>
        <li>Điều kiện mở bán nhà ở hình thành trong tương lai.</li>
        <li>Bảo lãnh ngân hàng và nghĩa vụ tài chính của chủ đầu tư.</li>
      </ul>
    </div>
  `,
  "price-table": `
    <h2>Bài toán giá và dòng tiền</h2>
    <div class="article-table-wrap">
      <table class="article-table">
        <thead>
          <tr>
            <th>Hạng mục</th>
            <th>Nội dung cần kiểm tra</th>
            <th>Ý nghĩa với người mua</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Giá vào</td>
            <td>Giá/m2, tổng giá trị căn, chiết khấu, lịch thanh toán.</td>
            <td>Xác định sản phẩm có đang đúng mặt bằng khu vực hay không.</td>
          </tr>
          <tr>
            <td>Dòng tiền</td>
            <td>Khoản vay, lãi sau ưu đãi, phí quản lý, quỹ dự phòng.</td>
            <td>Đảm bảo khoản mua không tạo áp lực tài chính quá mức.</td>
          </tr>
          <tr>
            <td>Thanh khoản</td>
            <td>Nhu cầu ở thực, khả năng cho thuê, cộng đồng cư dân.</td>
            <td>Giúp đánh giá khả năng bán lại hoặc khai thác tài sản.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  "buyer-groups": `
    <h2>Có nên mua dự án này không?</h2>
    <h3>Nhóm mua ở</h3>
    <p>Phù hợp nếu vị trí đáp ứng lịch di chuyển hằng ngày, tiện ích đã đủ cho nhu cầu gia đình và tổng chi phí nằm trong vùng an toàn.</p>
    <h3>Nhóm đầu tư cho thuê</h3>
    <p>Cần kiểm tra tệp khách thuê thật, mức thuê của dự án lân cận và chi phí vận hành sau bàn giao.</p>
    <h3>Nhóm mua giữ tài sản</h3>
    <p>Nên ưu tiên sản phẩm có pháp lý rõ, vị trí khó thay thế và dư địa hạ tầng trong 3-5 năm tới.</p>
  `,
  "project-cta": `
    <div class="article-callout cta-callout">
      <strong>Nhận bảng giá và phân tích căn phù hợp</strong>
      <p>KINGMANS Realty có thể hỗ trợ lọc giỏ hàng theo ngân sách, tầng, view, phương án vay và mục tiêu mua ở hoặc đầu tư.</p>
      <p><a class="button primary" href="/#contact">Nhận tư vấn dự án</a></p>
    </div>
  `
};

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
  syncRichEditorsToFields();
  const formData = new FormData(articleForm);
  const id = String(formData.get("id") || "").trim();
  const payload = Object.fromEntries(formData.entries());
  delete payload.id;

  if (isEmptyRichHtml(payload.content_html)) {
    setNote(articleNote, "Vui lòng nhập nội dung bài viết trước khi lưu.", true);
    return;
  }

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
  syncRichEditorsToFields();
  const formData = new FormData(projectForm);
  const id = String(formData.get("id") || "").trim();
  const payload = Object.fromEntries(formData.entries());
  delete payload.id;
  payload.stats = String(payload.stats || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (isEmptyRichHtml(payload.content_html)) {
    setNote(projectNote, "Vui lòng nhập nội dung dự án trước khi lưu.", true);
    return;
  }

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

autoNewsForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(autoNewsForm);
  const sources = formData.getAll("sources").map((value) => String(value));
  if (!sources.length) {
    setNote(autoNewsNote, "Vui lòng chọn ít nhất một nguồn tin.", true);
    return;
  }

  const payload = {
    topic: String(formData.get("topic") || "market-pulse"),
    status: String(formData.get("status") || "draft"),
    keywords: String(formData.get("keywords") || ""),
    sources
  };

  try {
    setNote(autoNewsNote, "Đang thu thập nguồn tin và tạo bài nháp...");
    autoNewsResult.innerHTML = "";
    const result = await requestJson("/api/admin/auto-news/generate", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const publicUrl = `/bai-viet/${result.slug}`;
    setNote(
      autoNewsNote,
      result.status === "published"
        ? `Đã tạo và xuất bản bài viết: ${publicUrl}`
        : `Đã tạo bản nháp. Bạn có thể sửa lại trước khi xuất bản: ${publicUrl}`
    );
    autoNewsResult.innerHTML = `
      <article class="auto-result-card">
        <strong>${escapeHtml(result.status === "published" ? "Đã xuất bản" : "Đã tạo bản nháp")}</strong>
        <span>${escapeHtml(result.itemCount || 0)} nguồn tin đã được dùng để dựng bài.</span>
        ${
          result.failedSources?.length
            ? `<small>Nguồn chưa phản hồi: ${escapeHtml(result.failedSources.join(", "))}</small>`
            : ""
        }
        <div class="row-actions">
          <button class="copy-button" type="button" data-edit-article="${escapeHtml(result.id)}">Mở để chỉnh sửa</button>
          <a class="copy-button" href="${escapeHtml(publicUrl)}" target="_blank" rel="noreferrer">Xem link public</a>
        </div>
      </article>
    `;
    await loadArticles();
  } catch (error) {
    setNote(autoNewsNote, error.message, true);
  }
});

autoNewsRefreshButton?.addEventListener("click", async () => {
  await loadAutoNewsSources();
});

seoChecklist?.addEventListener("change", (event) => {
  const target = event.target instanceof HTMLInputElement ? event.target : null;
  if (!target || target.type !== "checkbox") return;
  const checked = readJsonStorage(SEO_CHECKLIST_STORAGE, {});
  checked[target.value] = target.checked;
  localStorage.setItem(SEO_CHECKLIST_STORAGE, JSON.stringify(checked));
});

seoResetChecklist?.addEventListener("click", () => {
  localStorage.removeItem(SEO_CHECKLIST_STORAGE);
  renderSeoChecklist();
  setNote(seoChecklistNote, "Đã reset checklist SEO cho tuần mới.");
});

backlinkSeedButton?.addEventListener("click", () => {
  const current = readBacklinks();
  const existingSites = new Set(current.map((item) => item.site.toLowerCase()));
  const additions = BACKLINK_SEED_ITEMS
    .filter((item) => !existingSites.has(item.site.toLowerCase()))
    .map((item) => ({ ...item, id: createLocalId(), created_at: new Date().toISOString() }));
  if (!additions.length) {
    setNote(backlinkNote, "Các mẫu backlink gợi ý đã có trong danh sách.");
    return;
  }
  writeBacklinks([...additions, ...current]);
  renderBacklinks();
  setNote(backlinkNote, `Đã thêm ${additions.length} mẫu backlink sạch để xử lý dần.`);
});

backlinkForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(backlinkForm);
  const item = {
    id: createLocalId(),
    site: String(formData.get("site") || "").trim(),
    url: String(formData.get("url") || "").trim(),
    type: String(formData.get("type") || "Profile"),
    status: String(formData.get("status") || "Cần làm"),
    created_at: new Date().toISOString()
  };
  if (!item.site) {
    setNote(backlinkNote, "Vui lòng nhập tên kênh hoặc website.", true);
    return;
  }
  writeBacklinks([item, ...readBacklinks()]);
  backlinkForm.reset();
  renderBacklinks();
  setNote(backlinkNote, "Đã thêm backlink vào danh sách theo dõi.");
});

articleCancelEdit?.addEventListener("click", () => {
  resetArticleEditor();
  setNote(articleNote, "Đã hủy chế độ sửa bài viết.");
});

projectCancelEdit?.addEventListener("click", () => {
  resetProjectEditor();
  setNote(projectNote, "Đã hủy chế độ sửa dự án.");
});

articlePreviewButton?.addEventListener("click", () => {
  openPreview("article");
});

projectPreviewButton?.addEventListener("click", () => {
  openPreview("project");
});

previewCloseButton?.addEventListener("click", closePreview);

previewModal?.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-preview]")) {
    closePreview();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && previewModal && !previewModal.hidden) {
    closePreview();
  }
});

refreshButton?.addEventListener("click", () => {
  loadDashboard().catch((error) => {
    alert(error.message);
  });
});

document.addEventListener("mousedown", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest("[data-insert-block]")) {
    event.preventDefault();
  }
});

document.addEventListener("click", async (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const blockButton = target.closest("[data-insert-block]");
  if (blockButton) {
    insertDesignBlock(blockButton.dataset.insertBlock, blockButton.dataset.block);
    return;
  }

  const copyButton = target.closest("[data-copy-url]");
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

  const editArticleButton = target.closest("[data-edit-article]");
  if (editArticleButton) {
    await editArticle(editArticleButton.dataset.editArticle);
    return;
  }

  const deleteArticleButton = target.closest("[data-delete-article]");
  if (deleteArticleButton) {
    await deleteArticle(deleteArticleButton.dataset.deleteArticle, deleteArticleButton.dataset.title);
    return;
  }

  const editProjectButton = target.closest("[data-edit-project]");
  if (editProjectButton) {
    await editProject(editProjectButton.dataset.editProject);
    return;
  }

  const deleteProjectButton = target.closest("[data-delete-project]");
  if (deleteProjectButton) {
    await deleteProject(deleteProjectButton.dataset.deleteProject, deleteProjectButton.dataset.title);
    return;
  }

  const backlinkStatusButton = target.closest("[data-backlink-status]");
  if (backlinkStatusButton) {
    updateBacklinkStatus(backlinkStatusButton.dataset.backlinkStatus);
    return;
  }

  const backlinkDeleteButton = target.closest("[data-backlink-delete]");
  if (backlinkDeleteButton) {
    deleteBacklink(backlinkDeleteButton.dataset.backlinkDelete);
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
            <img class="media-thumb" src="${escapeHtml(item.url)}" alt="${escapeHtml(readableMime(item.mime_type))}" loading="lazy" decoding="async">
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

async function loadAutoNewsSources() {
  if (!autoNewsSources) return;
  try {
    const payload = await requestJson("/api/admin/auto-news/sources", { method: "GET" });
    const sources = payload.sources || [];
    if (!sources.length) return;
    autoNewsSources.innerHTML = sources
      .map(
        (source) => `
          <label>
            <input type="checkbox" name="sources" value="${escapeHtml(source.key)}" checked>
            <span>${escapeHtml(source.label)}</span>
            <small>${escapeHtml(source.domain)}</small>
          </label>
        `
      )
      .join("");
    setNote(autoNewsNote, "Đã tải danh sách nguồn tin.");
  } catch (error) {
    setNote(autoNewsNote, `Chưa tải được nguồn tin: ${error.message}`, true);
  }
}

function renderSeoChecklist() {
  if (!seoChecklist) return;
  const checked = readJsonStorage(SEO_CHECKLIST_STORAGE, {});
  seoChecklist.innerHTML = SEO_CHECKLIST_ITEMS
    .map((item, index) => {
      const id = `seo-check-${index}`;
      return `
        <label class="seo-check-item" for="${id}">
          <input id="${id}" type="checkbox" value="${escapeHtml(item)}" ${checked[item] ? "checked" : ""}>
          <span>${escapeHtml(item)}</span>
        </label>
      `;
    })
    .join("");
}

function renderBacklinks() {
  if (!backlinkList) return;
  const items = readBacklinks();
  backlinkList.innerHTML = items.length
    ? items
        .map((item) => {
          const nextStatus = nextBacklinkStatus(item.status);
          return `
            <article class="backlink-row">
              <div>
                <strong>${escapeHtml(item.site)}</strong>
                <small>${escapeHtml(item.type)} · ${escapeHtml(item.status)} · ${escapeHtml(formatDate(item.created_at))}</small>
                ${
                  item.url
                    ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="nofollow noopener noreferrer">${escapeHtml(item.url)}</a>`
                    : "<code>Chưa có URL, cần bổ sung sau khi tạo hồ sơ hoặc đăng bài.</code>"
                }
              </div>
              <div class="row-actions">
                <button class="copy-button" type="button" data-backlink-status="${escapeHtml(item.id)}">${escapeHtml(nextStatus)}</button>
                <button class="copy-button danger-action" type="button" data-backlink-delete="${escapeHtml(item.id)}">Xóa</button>
              </div>
            </article>
          `;
        })
        .join("")
    : '<p class="note">Chưa có backlink nào. Bấm “Thêm mẫu gợi ý” để tạo danh sách việc miễn phí đầu tiên.</p>';
}

function loadSeoPlanner() {
  renderSeoChecklist();
  renderBacklinks();
}

function readBacklinks() {
  return readJsonStorage(BACKLINK_STORAGE, [])
    .filter((item) => item && item.id && item.site)
    .slice(0, 80);
}

function writeBacklinks(items) {
  localStorage.setItem(BACKLINK_STORAGE, JSON.stringify(items.slice(0, 80)));
}

function updateBacklinkStatus(id) {
  const items = readBacklinks().map((item) => (
    item.id === id ? { ...item, status: nextBacklinkStatus(item.status) } : item
  ));
  writeBacklinks(items);
  renderBacklinks();
}

function deleteBacklink(id) {
  const items = readBacklinks().filter((item) => item.id !== id);
  writeBacklinks(items);
  renderBacklinks();
  setNote(backlinkNote, "Đã xóa backlink khỏi danh sách theo dõi.");
}

function nextBacklinkStatus(status) {
  if (status === "Cần làm") return "Đang liên hệ";
  if (status === "Đang liên hệ") return "Đã có link";
  return "Cần làm";
}

function readJsonStorage(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function createLocalId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
  loadSeoPlanner();
  await Promise.all([loadMedia(), loadAutoNewsSources(), loadArticles(), loadProjects()]);
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
    setRichEditorHtml("article", item.content_html);
    updateSeoCounters();
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
    setRichEditorHtml("project", item.content_html);
    updateSeoCounters();
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
  setRichEditorHtml("article", "");
  if (articleSubmitButton) articleSubmitButton.textContent = "Lưu bài viết";
  if (articleCancelEdit) articleCancelEdit.hidden = true;
  updateSeoCounters();
}

function resetProjectEditor() {
  projectForm?.reset();
  fillField(projectForm, "id", "");
  setRichEditorHtml("project", "");
  if (projectSubmitButton) projectSubmitButton.textContent = "Lưu dự án";
  if (projectCancelEdit) projectCancelEdit.hidden = true;
  updateSeoCounters();
}

function fillField(form, name, value) {
  const field = form?.elements?.namedItem(name);
  if (!field) return;
  field.value = value ?? "";
}

function initRichEditors() {
  setupRichEditor("article", "#articleRichEditor", articleForm, "Viết nội dung bài phân tích tại đây...");
  setupRichEditor("project", "#projectRichEditor", projectForm, "Viết nội dung trang dự án tại đây...");
}

function setupRichEditor(key, selector, form, placeholder) {
  const target = document.querySelector(selector);
  const field = form?.elements?.namedItem("content_html");
  if (!target || !field) return;

  const toolbar = document.createElement("div");
  toolbar.className = "rich-toolbar";
  toolbar.innerHTML = `
    <button class="rich-tool" type="button" data-command="formatBlock" data-value="h2">H2</button>
    <button class="rich-tool" type="button" data-command="formatBlock" data-value="h3">H3</button>
    <button class="rich-tool" type="button" data-command="bold">B</button>
    <button class="rich-tool" type="button" data-command="italic">I</button>
    <button class="rich-tool" type="button" data-command="insertUnorderedList">List</button>
    <button class="rich-tool" type="button" data-command="formatBlock" data-value="blockquote">Quote</button>
    <button class="rich-tool" type="button" data-command="createLink">Link</button>
    <button class="rich-tool" type="button" data-command="insertImage">Ảnh</button>
    <button class="rich-tool" type="button" data-command="removeFormat">Clear</button>
  `;
  target.insertAdjacentElement("beforebegin", toolbar);
  target.setAttribute("contenteditable", "true");
  target.setAttribute("role", "textbox");
  target.setAttribute("aria-multiline", "true");
  target.dataset.placeholder = placeholder;
  target.innerHTML = field.value || "";

  richEditors[key] = {
    root: target,
    field,
    toolbar
  };

  ["keyup", "mouseup", "focus", "input"].forEach((eventName) => {
    target.addEventListener(eventName, () => saveEditorSelection(key));
  });
  target.addEventListener("input", () => syncRichEditorToField(key));

  toolbar.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  toolbar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-command]");
    if (!button) return;
    runEditorCommand(key, button.dataset.command, button.dataset.value);
  });

  syncRichEditorToField(key);
}

function syncRichEditorsToFields() {
  syncRichEditorToField("article");
  syncRichEditorToField("project");
}

function syncRichEditorToField(key) {
  const editor = richEditors[key];
  if (!editor) return;

  const html = editor.root.innerHTML.trim();
  editor.field.value = html === "<br>" ? "" : html;
}

function setRichEditorHtml(key, html) {
  const editor = richEditors[key];
  const form = key === "article" ? articleForm : projectForm;
  const field = form?.elements?.namedItem("content_html");
  if (field) field.value = html || "";
  if (!editor) return;

  editor.root.innerHTML = html || "";
  savedSelections[key] = null;
  syncRichEditorToField(key);
}

function runEditorCommand(key, command, value = "") {
  const editor = richEditors[key];
  if (!editor) return;

  editor.root.focus();
  restoreEditorSelection(key);

  if (command === "createLink") {
    const url = prompt("Dán link cần chèn:", "https://");
    if (!url) return;
    document.execCommand("createLink", false, url);
  } else if (command === "insertImage") {
    const url = prompt("Dán URL ảnh từ kho R2:", "/media/uploads/");
    if (!url) return;
    document.execCommand("insertImage", false, url);
  } else if (command === "formatBlock") {
    document.execCommand("formatBlock", false, value === "blockquote" ? "blockquote" : `<${value}>`);
  } else {
    document.execCommand(command, false, value);
  }

  saveEditorSelection(key);
  syncRichEditorToField(key);
}

function insertDesignBlock(key, blockName) {
  const html = DESIGN_BLOCKS[blockName];
  const editor = richEditors[key];
  const note = key === "article" ? articleNote : projectNote;
  if (!html || !editor) {
    setNote(note, "Chưa tìm thấy khu vực soạn thảo để chèn mẫu.", true);
    return;
  }

  insertHtmlIntoEditor(key, html);
  editor.root.classList.add("is-updated");
  window.setTimeout(() => editor.root.classList.remove("is-updated"), 900);
  editor.root.scrollIntoView({ behavior: "smooth", block: "center" });
  saveEditorSelection(key);
  syncRichEditorToField(key);
  setNote(note, "Đã chèn mẫu thiết kế vào nội dung. Bạn có thể sửa chữ và ảnh ngay trong khung soạn thảo.");
}

function insertHtmlIntoEditor(key, html) {
  const editor = richEditors[key];
  if (!editor) return;

  editor.root.focus();
  restoreEditorSelection(key);

  const selection = window.getSelection();
  if (selection && selection.rangeCount && selectionIsInside(editor.root)) {
    const range = selection.getRangeAt(0);
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    const fragment = template.content;
    const lastNode = fragment.lastChild;
    range.deleteContents();
    range.insertNode(fragment);

    if (lastNode) {
      const nextRange = document.createRange();
      nextRange.setStartAfter(lastNode);
      nextRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(nextRange);
    }
    return;
  }

  editor.root.insertAdjacentHTML("beforeend", html);
  placeCaretAtEnd(editor.root);
}

function placeCaretAtEnd(root) {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(root);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function saveEditorSelection(key) {
  const editor = richEditors[key];
  const selection = window.getSelection();
  if (!editor || !selection || !selection.rangeCount) return;
  if (!selectionIsInside(editor.root)) return;
  savedSelections[key] = selection.getRangeAt(0).cloneRange();
}

function restoreEditorSelection(key) {
  const range = savedSelections[key];
  if (!range) return;
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function selectionIsInside(root) {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return false;
  const node = selection.anchorNode;
  return !!node && root.contains(node.nodeType === Node.ELEMENT_NODE ? node : node.parentNode);
}

function isEmptyRichHtml(value) {
  const html = String(value || "").trim();
  if (!html) return true;
  if (/<img\b/i.test(html)) return false;
  const text = html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return !text;
}

function initSeoCounters() {
  document
    .querySelectorAll("input[name='seo_title'], textarea[name='seo_description']")
    .forEach((field) => {
      const max = field.name === "seo_title" ? 65 : 160;
      const warningAt = field.name === "seo_title" ? 60 : 155;
      const counter = document.createElement("small");
      counter.className = "field-counter";
      field.insertAdjacentElement("afterend", counter);

      const update = () => {
        const length = [...String(field.value || "")].length;
        counter.textContent = `${length}/${max} ký tự`;
        counter.classList.toggle("is-warning", length >= warningAt && length <= max);
        counter.classList.toggle("is-danger", length > max);
      };

      field.addEventListener("input", update);
      seoCounterUpdaters.push(update);
      update();
    });
}

function updateSeoCounters() {
  seoCounterUpdaters.forEach((update) => update());
}

function openPreview(kind) {
  syncRichEditorsToFields();

  const isArticle = kind === "article";
  const form = isArticle ? articleForm : projectForm;
  const note = isArticle ? articleNote : projectNote;
  const data = Object.fromEntries(new FormData(form).entries());
  const html = String(data.content_html || "");

  if (isEmptyRichHtml(html)) {
    setNote(note, "Vui lòng nhập nội dung trước khi xem trước.", true);
    return;
  }

  const title = isArticle ? data.title : data.name;
  const subtitle = isArticle ? data.excerpt : data.summary;
  const cover = data.cover_image_url;
  const kicker = isArticle ? readableCategory(data.category) : data.location || "Dự án";

  previewTitle.textContent = title || "Bản xem trước";
  previewBody.innerHTML = `
    <article class="preview-article">
      <p class="preview-kicker">${escapeHtml(kicker)}</p>
      <h1>${escapeHtml(title || "Chưa có tiêu đề")}</h1>
      ${subtitle ? `<p class="preview-excerpt">${escapeHtml(subtitle)}</p>` : ""}
      ${cover ? `<img class="preview-cover" src="${escapeHtml(cover)}" alt="${escapeHtml(title || "Ảnh đại diện")}" loading="eager">` : ""}
      <div class="preview-prose">${sanitizePreviewHtml(html)}</div>
    </article>
  `;
  previewModal.hidden = false;
}

function closePreview() {
  if (!previewModal) return;
  previewModal.hidden = true;
  previewBody.innerHTML = "";
}

function sanitizePreviewHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");
}

function readableCategory(category) {
  const labels = {
    market: "Thị trường",
    guide: "Hướng dẫn",
    finance: "Tài chính",
    lifestyle: "Sống xanh & Công nghệ"
  };
  return labels[category] || "Góc chuyên gia";
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

initRichEditors();
initSeoCounters();
checkSession();
