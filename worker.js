const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const SESSION_COOKIE = "kingmans_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const ARTICLE_CATEGORIES = new Set(["market", "guide", "finance", "lifestyle"]);
const PROJECT_TYPES = new Set(["can-ho", "hang-sang", "dau-tu", "khac"]);
const AUTO_NEWS_SOURCES = [
  {
    key: "vnexpress-bat-dong-san",
    label: "VnExpress - Bất động sản",
    url: "https://vnexpress.net/rss/bat-dong-san.rss",
    domain: "vnexpress.net"
  },
  {
    key: "tuoitre-bat-dong-san",
    label: "Tuổi Trẻ - Bất động sản",
    url: "https://tuoitre.vn/rss/bat-dong-san.rss",
    domain: "tuoitre.vn"
  },
  {
    key: "vietnamnet-bat-dong-san",
    label: "VietnamNet - Bất động sản",
    url: "https://vietnamnet.vn/rss/bat-dong-san.rss",
    domain: "vietnamnet.vn"
  }
];
const AUTO_NEWS_TOPICS = {
  "market-pulse": {
    label: "Nhịp thị trường",
    category: "market",
    cover: "/assets/images/article-market-binh-duong.webp",
    keywords: ["bất động sản", "nhà đất", "căn hộ", "thị trường", "nguồn cung", "giao dịch", "giá nhà"]
  },
  "apartment": {
    label: "Căn hộ đô thị vệ tinh",
    category: "market",
    cover: "/assets/images/article-thuan-an-2026.webp",
    keywords: ["căn hộ", "chung cư", "Bình Dương", "Dĩ An", "Thuận An", "TP.HCM", "Thủ Đức"]
  },
  "infrastructure": {
    label: "Hạ tầng & đô thị",
    category: "market",
    cover: "/assets/images/article-quoc-lo-13-hero.webp",
    keywords: ["hạ tầng", "cao tốc", "vành đai", "quốc lộ", "sân bay", "metro", "cầu", "đường"]
  },
  "legal-finance": {
    label: "Pháp lý & tài chính",
    category: "guide",
    cover: "/assets/images/article-legal-checklist.webp",
    keywords: ["pháp lý", "sổ hồng", "tín dụng", "lãi suất", "vay", "ngân hàng", "mở bán", "quy hoạch"]
  }
};

const textEncoder = new TextEncoder();
const keyCache = new Map();

export default {
  async fetch(request, env) {
    try {
      return await routeRequest(request, env);
    } catch (error) {
      console.error("Unhandled worker error", error);
      return json(
        {
          ok: false,
          error: "Worker error",
          message: "Co loi he thong. Vui long thu lai."
        },
        500
      );
    }
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(
      runAutoNewsJob(env, {
        author: "auto-market",
        topic: "market-pulse",
        status: "draft",
        limit: 8
      })
    );
  }
};

async function routeRequest(request, env) {
  const url = new URL(request.url);

  if (url.pathname === "/api/health") {
    return json({
      ok: true,
      service: "kingmans-cms",
      time: new Date().toISOString()
    });
  }

  if (url.pathname.startsWith("/media/")) {
    const key = decodeURIComponent(url.pathname.replace(/^\/media\//, ""));
    return serveMedia(key, env);
  }

  if (url.pathname === "/sitemap.xml") {
    return renderSitemap(env, url.origin);
  }

  if (url.pathname.startsWith("/api/")) {
    return handleApi(request, env, url);
  }

  if (url.pathname.startsWith("/bai-viet/")) {
    const slug = sanitizeSlug(url.pathname.replace(/^\/bai-viet\//, ""));
    if (!slug) {
      return notFoundHtml();
    }
    return renderArticlePage(slug, env, url.origin);
  }

  if (url.pathname.startsWith("/du-an/")) {
    const slug = sanitizeSlug(url.pathname.replace(/^\/du-an\//, ""));
    if (!slug) {
      return notFoundHtml();
    }
    return renderProjectPage(slug, env, url.origin);
  }

  if (url.pathname === "/admin") {
    return Response.redirect(`${url.origin}/admin/`, 308);
  }

  if (url.pathname === "/admin/") {
    return env.ASSETS.fetch(new Request(`${url.origin}/admin/index.html`, request));
  }

  if (request.method === "GET" || request.method === "HEAD") {
    const cleanRedirect = getCleanHtmlRedirectUrl(url);
    if (cleanRedirect) {
      return Response.redirect(cleanRedirect, 301);
    }

    const cleanHtmlResponse = await tryServeCleanHtml(request, env, url);
    if (cleanHtmlResponse) {
      return cleanHtmlResponse;
    }
  }

  return env.ASSETS.fetch(request);
}

function getCleanHtmlRedirectUrl(url) {
  if (!url.pathname.endsWith(".html")) {
    return "";
  }

  const cleanUrl = new URL(url.toString());
  cleanUrl.pathname = cleanUrl.pathname === "/index.html" ? "/" : cleanUrl.pathname.slice(0, -5);
  return cleanUrl.toString();
}

async function tryServeCleanHtml(request, env, url) {
  if (url.pathname === "/" || url.pathname.endsWith("/") || /\.[a-z0-9]{2,8}$/i.test(url.pathname)) {
    return null;
  }

  const htmlUrl = new URL(url.toString());
  htmlUrl.pathname = `${url.pathname}.html`;
  const response = await env.ASSETS.fetch(new Request(htmlUrl.toString(), request));
  return response.status === 404 ? null : response;
}

async function handleApi(request, env, url) {
  const pathname = url.pathname;
  const method = request.method.toUpperCase();

  if (pathname === "/api/articles" && method === "GET") {
    return listPublishedArticles(url, env);
  }

  if (pathname.startsWith("/api/articles/") && method === "GET") {
    const slug = sanitizeSlug(pathname.replace(/^\/api\/articles\//, ""));
    return getPublishedArticle(slug, env);
  }

  if (pathname === "/api/projects" && method === "GET") {
    return listPublishedProjects(url, env);
  }

  if (pathname.startsWith("/api/projects/") && method === "GET") {
    const slug = sanitizeSlug(pathname.replace(/^\/api\/projects\//, ""));
    return getPublishedProject(slug, env);
  }

  if (pathname === "/api/admin/login" && method === "POST") {
    return adminLogin(request, env);
  }

  if (pathname === "/api/admin/logout" && method === "POST") {
    return adminLogout();
  }

  if (pathname === "/api/admin/session" && method === "GET") {
    const session = await readSessionFromRequest(request, env);
    return json({ ok: true, authenticated: !!session, user: session?.sub ?? null });
  }

  if (pathname.startsWith("/api/admin/")) {
    const session = await readSessionFromRequest(request, env);
    if (!session) {
      return json({ ok: false, error: "Unauthorized" }, 401);
    }

    if (pathname === "/api/admin/articles" && method === "GET") {
      return listAdminArticles(url, env);
    }
    if (pathname === "/api/admin/articles" && method === "POST") {
      return createArticle(request, env, session.sub);
    }
    if (pathname.startsWith("/api/admin/articles/") && method === "GET") {
      const id = pathname.replace(/^\/api\/admin\/articles\//, "");
      return getAdminArticleById(id, env);
    }
    if (pathname.startsWith("/api/admin/articles/") && method === "PUT") {
      const id = pathname.replace(/^\/api\/admin\/articles\//, "");
      return updateArticle(id, request, env);
    }
    if (pathname.startsWith("/api/admin/articles/") && method === "DELETE") {
      const id = pathname.replace(/^\/api\/admin\/articles\//, "");
      return deleteById("articles", id, env);
    }

    if (pathname === "/api/admin/projects" && method === "GET") {
      return listAdminProjects(url, env);
    }
    if (pathname === "/api/admin/projects" && method === "POST") {
      return createProject(request, env, session.sub);
    }
    if (pathname.startsWith("/api/admin/projects/") && method === "GET") {
      const id = pathname.replace(/^\/api\/admin\/projects\//, "");
      return getAdminProjectById(id, env);
    }
    if (pathname.startsWith("/api/admin/projects/") && method === "PUT") {
      const id = pathname.replace(/^\/api\/admin\/projects\//, "");
      return updateProject(id, request, env);
    }
    if (pathname.startsWith("/api/admin/projects/") && method === "DELETE") {
      const id = pathname.replace(/^\/api\/admin\/projects\//, "");
      return deleteById("projects", id, env);
    }

    if (pathname === "/api/admin/media" && method === "POST") {
      return uploadMedia(request, env, session.sub, url.origin);
    }
    if (pathname === "/api/admin/media" && method === "GET") {
      return listMedia(url, env);
    }
    if (pathname === "/api/admin/auto-news/sources" && method === "GET") {
      return listAutoNewsSources();
    }
    if (pathname === "/api/admin/auto-news/generate" && method === "POST") {
      return generateAutoNewsArticle(request, env, session.sub);
    }
  }

  return json({ ok: false, error: "Not found" }, 404);
}

async function adminLogin(request, env) {
  const body = await request.json().catch(() => ({}));
  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");
  const validUser = env.ADMIN_USERNAME && safeEqual(username, env.ADMIN_USERNAME);
  const validPass = env.ADMIN_PASSWORD && safeEqual(password, env.ADMIN_PASSWORD);

  if (!validUser || !validPass) {
    return json({ ok: false, error: "Sai tai khoan hoac mat khau." }, 401);
  }

  const token = await createSessionToken(username, env);
  return json(
    { ok: true, user: username },
    200,
    {
      "set-cookie": `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}`
    }
  );
}

async function adminLogout() {
  return json(
    { ok: true },
    200,
    {
      "set-cookie": `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
    }
  );
}

async function listPublishedArticles(url, env) {
  const limit = clampInt(url.searchParams.get("limit"), 1, 100, 20);
  const offset = clampInt(url.searchParams.get("offset"), 0, 10000, 0);
  const category = normalizeCategory(url.searchParams.get("category"));
  const query = cleanQuery(url.searchParams.get("q"));
  const where = ["status = 'published'"];
  const binds = [];

  if (category) {
    where.push("category = ?");
    binds.push(category);
  }

  if (query) {
    where.push("(title LIKE ? OR excerpt LIKE ?)");
    const like = `%${query}%`;
    binds.push(like, like);
  }

  const stmt = env.DB.prepare(
    `SELECT id, slug, title, excerpt, category, cover_image_url, seo_title, seo_description, published_at, updated_at
     FROM articles
     WHERE ${where.join(" AND ")}
     ORDER BY datetime(COALESCE(published_at, updated_at, created_at)) DESC
     LIMIT ? OFFSET ?`
  );
  const result = await stmt.bind(...binds, limit, offset).all();
  return json({ ok: true, items: result.results ?? [] });
}

async function getPublishedArticle(slug, env) {
  if (!slug) {
    return json({ ok: false, error: "Invalid slug" }, 400);
  }
  const row = await env.DB.prepare(
    `SELECT id, slug, title, excerpt, content_html, content_markdown, category, cover_image_url, seo_title, seo_description, published_at, updated_at
     FROM articles
     WHERE slug = ? AND status = 'published'
     LIMIT 1`
  )
    .bind(slug)
    .first();

  if (!row) {
    return json({ ok: false, error: "Article not found" }, 404);
  }
  return json({ ok: true, item: row });
}

async function listPublishedProjects(url, env) {
  const limit = clampInt(url.searchParams.get("limit"), 1, 100, 20);
  const offset = clampInt(url.searchParams.get("offset"), 0, 10000, 0);
  const projectType = normalizeProjectType(url.searchParams.get("type"));
  const query = cleanQuery(url.searchParams.get("q"));
  const where = ["status = 'published'"];
  const binds = [];

  if (projectType) {
    where.push("project_type = ?");
    binds.push(projectType);
  }

  if (query) {
    where.push("(name LIKE ? OR summary LIKE ? OR location LIKE ?)");
    const like = `%${query}%`;
    binds.push(like, like, like);
  }

  const stmt = env.DB.prepare(
    `SELECT id, slug, name, location, summary, cover_image_url, project_type, status, cta_url, published_at, updated_at
     FROM projects
     WHERE ${where.join(" AND ")}
     ORDER BY datetime(COALESCE(published_at, updated_at, created_at)) DESC
     LIMIT ? OFFSET ?`
  );
  const result = await stmt.bind(...binds, limit, offset).all();
  return json({ ok: true, items: result.results ?? [] });
}

async function getPublishedProject(slug, env) {
  if (!slug) {
    return json({ ok: false, error: "Invalid slug" }, 400);
  }

  const row = await env.DB.prepare(
    `SELECT id, slug, name, location, summary, content_html, content_markdown, cover_image_url, project_type, stats_json, cta_url, seo_title, seo_description, published_at, updated_at
     FROM projects
     WHERE slug = ? AND status = 'published'
     LIMIT 1`
  )
    .bind(slug)
    .first();

  if (!row) {
    return json({ ok: false, error: "Project not found" }, 404);
  }
  row.stats = safeParseJsonArray(row.stats_json);
  return json({ ok: true, item: row });
}

async function listAdminArticles(url, env) {
  const limit = clampInt(url.searchParams.get("limit"), 1, 200, 50);
  const offset = clampInt(url.searchParams.get("offset"), 0, 10000, 0);
  const status = normalizeStatus(url.searchParams.get("status"));
  const where = [];
  const binds = [];

  if (status) {
    where.push("status = ?");
    binds.push(status);
  }

  const sqlWhere = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const result = await env.DB.prepare(
    `SELECT id, slug, title, excerpt, category, status, cover_image_url, published_at, updated_at, created_at
     FROM articles
     ${sqlWhere}
     ORDER BY datetime(updated_at) DESC
     LIMIT ? OFFSET ?`
  )
    .bind(...binds, limit, offset)
    .all();
  return json({ ok: true, items: result.results ?? [] });
}

async function getAdminArticleById(id, env) {
  if (!id) {
    return json({ ok: false, error: "Thiếu id bài viết." }, 400);
  }

  const row = await env.DB.prepare(
    `SELECT id, slug, title, excerpt, content_markdown, content_html, category, status,
            cover_image_url, seo_title, seo_description, published_at, updated_at, created_at
     FROM articles
     WHERE id = ?
     LIMIT 1`
  )
    .bind(id)
    .first();

  if (!row) {
    return json({ ok: false, error: "Không tìm thấy bài viết." }, 404);
  }

  return json({ ok: true, item: row });
}

async function createArticle(request, env, author) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return json({ ok: false, error: "Payload khong hop le." }, 400);
  }

  const now = new Date().toISOString();
  const record = normalizeArticlePayload(body);
  if (!record.ok) {
    return json({ ok: false, error: record.error }, 400);
  }

  const id = crypto.randomUUID();
  const publishedAt = record.data.status === "published" ? now : null;
  await env.DB.prepare(
    `INSERT INTO articles (
      id, slug, title, excerpt, content_markdown, content_html, category,
      cover_image_url, seo_title, seo_description, status, author, published_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      record.data.slug,
      record.data.title,
      record.data.excerpt,
      record.data.content_markdown,
      record.data.content_html,
      record.data.category,
      record.data.cover_image_url,
      record.data.seo_title,
      record.data.seo_description,
      record.data.status,
      author,
      publishedAt,
      now,
      now
    )
    .run();

  return json({ ok: true, id, slug: record.data.slug, publishedAt });
}

async function updateArticle(id, request, env) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return json({ ok: false, error: "Payload khong hop le." }, 400);
  }
  if (!id) {
    return json({ ok: false, error: "Thieu id." }, 400);
  }

  const existing = await env.DB.prepare("SELECT id, status, published_at FROM articles WHERE id = ? LIMIT 1")
    .bind(id)
    .first();
  if (!existing) {
    return json({ ok: false, error: "Khong tim thay bai viet." }, 404);
  }

  const now = new Date().toISOString();
  const record = normalizeArticlePayload(body);
  if (!record.ok) {
    return json({ ok: false, error: record.error }, 400);
  }

  const publishedAt =
    record.data.status === "published"
      ? existing.published_at || now
      : null;

  await env.DB.prepare(
    `UPDATE articles SET
      slug = ?, title = ?, excerpt = ?, content_markdown = ?, content_html = ?, category = ?,
      cover_image_url = ?, seo_title = ?, seo_description = ?, status = ?, published_at = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(
      record.data.slug,
      record.data.title,
      record.data.excerpt,
      record.data.content_markdown,
      record.data.content_html,
      record.data.category,
      record.data.cover_image_url,
      record.data.seo_title,
      record.data.seo_description,
      record.data.status,
      publishedAt,
      now,
      id
    )
    .run();

  return json({ ok: true, id, slug: record.data.slug, publishedAt });
}

async function listAdminProjects(url, env) {
  const limit = clampInt(url.searchParams.get("limit"), 1, 200, 50);
  const offset = clampInt(url.searchParams.get("offset"), 0, 10000, 0);
  const status = normalizeStatus(url.searchParams.get("status"));
  const where = [];
  const binds = [];

  if (status) {
    where.push("status = ?");
    binds.push(status);
  }

  const sqlWhere = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const result = await env.DB.prepare(
    `SELECT id, slug, name, location, summary, project_type, status, cta_url, cover_image_url, published_at, updated_at, created_at
     FROM projects
     ${sqlWhere}
     ORDER BY datetime(updated_at) DESC
     LIMIT ? OFFSET ?`
  )
    .bind(...binds, limit, offset)
    .all();
  return json({ ok: true, items: result.results ?? [] });
}

async function getAdminProjectById(id, env) {
  if (!id) {
    return json({ ok: false, error: "Thiếu id dự án." }, 400);
  }

  const row = await env.DB.prepare(
    `SELECT id, slug, name, location, summary, content_markdown, content_html, cover_image_url,
            project_type, stats_json, cta_url, seo_title, seo_description, status,
            published_at, updated_at, created_at
     FROM projects
     WHERE id = ?
     LIMIT 1`
  )
    .bind(id)
    .first();

  if (!row) {
    return json({ ok: false, error: "Không tìm thấy dự án." }, 404);
  }

  row.stats = safeParseJsonArray(row.stats_json);
  return json({ ok: true, item: row });
}

async function createProject(request, env, author) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return json({ ok: false, error: "Payload khong hop le." }, 400);
  }

  const now = new Date().toISOString();
  const record = normalizeProjectPayload(body);
  if (!record.ok) {
    return json({ ok: false, error: record.error }, 400);
  }

  const id = crypto.randomUUID();
  const publishedAt = record.data.status === "published" ? now : null;
  await env.DB.prepare(
    `INSERT INTO projects (
      id, slug, name, location, summary, content_markdown, content_html, cover_image_url,
      project_type, stats_json, cta_url, seo_title, seo_description, status, author, published_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      record.data.slug,
      record.data.name,
      record.data.location,
      record.data.summary,
      record.data.content_markdown,
      record.data.content_html,
      record.data.cover_image_url,
      record.data.project_type,
      JSON.stringify(record.data.stats),
      record.data.cta_url,
      record.data.seo_title,
      record.data.seo_description,
      record.data.status,
      author,
      publishedAt,
      now,
      now
    )
    .run();

  return json({ ok: true, id, slug: record.data.slug, publishedAt });
}

async function updateProject(id, request, env) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return json({ ok: false, error: "Payload khong hop le." }, 400);
  }
  if (!id) {
    return json({ ok: false, error: "Thieu id." }, 400);
  }

  const existing = await env.DB.prepare("SELECT id, status, published_at FROM projects WHERE id = ? LIMIT 1")
    .bind(id)
    .first();
  if (!existing) {
    return json({ ok: false, error: "Khong tim thay du an." }, 404);
  }

  const now = new Date().toISOString();
  const record = normalizeProjectPayload(body);
  if (!record.ok) {
    return json({ ok: false, error: record.error }, 400);
  }
  const publishedAt =
    record.data.status === "published"
      ? existing.published_at || now
      : null;

  await env.DB.prepare(
    `UPDATE projects SET
      slug = ?, name = ?, location = ?, summary = ?, content_markdown = ?, content_html = ?,
      cover_image_url = ?, project_type = ?, stats_json = ?, cta_url = ?, seo_title = ?, seo_description = ?,
      status = ?, published_at = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(
      record.data.slug,
      record.data.name,
      record.data.location,
      record.data.summary,
      record.data.content_markdown,
      record.data.content_html,
      record.data.cover_image_url,
      record.data.project_type,
      JSON.stringify(record.data.stats),
      record.data.cta_url,
      record.data.seo_title,
      record.data.seo_description,
      record.data.status,
      publishedAt,
      now,
      id
    )
    .run();

  return json({ ok: true, id, slug: record.data.slug, publishedAt });
}

async function deleteById(table, id, env) {
  if (!id) {
    return json({ ok: false, error: "Thieu id." }, 400);
  }

  if (!["articles", "projects"].includes(table)) {
    return json({ ok: false, error: "Table khong hop le." }, 400);
  }

  await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
  return json({ ok: true, id });
}

async function uploadMedia(request, env, author, origin) {
  const form = await request.formData().catch(() => null);
  if (!form) {
    return json({ ok: false, error: "Form data khong hop le." }, 400);
  }

  const file = form.get("file");
  if (!file || typeof file.arrayBuffer !== "function") {
    return json({ ok: false, error: "Chua co file de upload." }, 400);
  }

  const ext = getFileExtension(file.name || "file");
  const key = `uploads/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}${ext}`;
  const contentType = file.type || "application/octet-stream";
  const size = Number(file.size || 0);

  await env.MEDIA.put(key, await file.arrayBuffer(), {
    httpMetadata: {
      contentType
    },
    customMetadata: {
      author
    }
  });

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const url = `${origin}/media/${encodeURIComponent(key)}`;

  await env.DB.prepare(
    `INSERT INTO media (id, object_key, url, mime_type, size_bytes, author, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, key, url, contentType, size, author, now)
    .run();

  return json({
    ok: true,
    item: {
      id,
      key,
      url,
      contentType,
      size
    }
  });
}

async function listMedia(url, env) {
  const limit = clampInt(url.searchParams.get("limit"), 1, 200, 60);
  const offset = clampInt(url.searchParams.get("offset"), 0, 10000, 0);
  const result = await env.DB.prepare(
    `SELECT id, object_key, url, mime_type, size_bytes, author, created_at
     FROM media
     ORDER BY datetime(created_at) DESC
     LIMIT ? OFFSET ?`
  )
    .bind(limit, offset)
    .all();
  return json({ ok: true, items: result.results ?? [] });
}

function listAutoNewsSources() {
  const topics = Object.entries(AUTO_NEWS_TOPICS).map(([key, value]) => ({
    key,
    label: value.label,
    category: value.category
  }));

  const sources = AUTO_NEWS_SOURCES.map(({ key, label, domain }) => ({
    key,
    label,
    domain
  }));

  return json({ ok: true, topics, sources });
}

async function generateAutoNewsArticle(request, env, author) {
  const body = await request.json().catch(() => ({}));
  const topic = normalizeAutoNewsTopic(body.topic);
  const sourceKeys = normalizeAutoNewsSourceKeys(body.sources);
  const status = normalizeStatus(body.status) || "draft";
  const keywords = String(body.keywords || "").trim();
  const limit = clampInt(body.limit, 3, 12, 8);

  if (!topic) {
    return json({ ok: false, error: "Chủ đề tạo bài không hợp lệ." }, 400);
  }

  const result = await createAutoNewsArticle(env, {
    author,
    topic,
    sourceKeys,
    status,
    keywords,
    limit
  });

  if (!result.ok) {
    return json(result, 502);
  }
  return json(result);
}

async function runAutoNewsJob(env, options = {}) {
  try {
    await createAutoNewsArticle(env, {
      author: options.author || "auto-market",
      topic: options.topic || "market-pulse",
      sourceKeys: options.sourceKeys || AUTO_NEWS_SOURCES.map((source) => source.key),
      status: options.status || "draft",
      limit: options.limit || 8
    });
  } catch (error) {
    console.error("Auto news job failed", error);
  }
}

async function createAutoNewsArticle(env, options) {
  const topicKey = normalizeAutoNewsTopic(options.topic) || "market-pulse";
  const topic = AUTO_NEWS_TOPICS[topicKey];
  const sourceKeys = normalizeAutoNewsSourceKeys(options.sourceKeys);
  const selectedSources = sourceKeys.length
    ? AUTO_NEWS_SOURCES.filter((source) => sourceKeys.includes(source.key))
    : AUTO_NEWS_SOURCES;
  const limit = clampInt(options.limit, 3, 12, 8);
  const extraKeywords = String(options.keywords || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const fetched = await Promise.allSettled(
    selectedSources.map(async (source) => {
      const response = await fetch(source.url);
      if (!response.ok) {
        throw new Error(`${source.label}: ${response.status}`);
      }
      const xml = await response.text();
      return parseRssItems(xml, source);
    })
  );

  const allItems = fetched
    .filter((entry) => entry.status === "fulfilled")
    .flatMap((entry) => entry.value)
    .filter((item) => item.title && item.link);

  const keywords = [...topic.keywords, ...extraKeywords];
  const matchedItems = allItems.filter((item) => matchesKeywords(item, keywords));
  const items = uniqueNewsItems(matchedItems.length ? matchedItems : allItems).slice(0, limit);

  if (!items.length) {
    return {
      ok: false,
      error: "Chưa lấy được nguồn tin phù hợp. Hãy thử lại sau hoặc chọn nguồn khác."
    };
  }

  const now = new Date();
  const isoNow = now.toISOString();
  const dateText = formatVietnameseDate(isoNow.slice(0, 10));
  const sourceSummary = items
    .map((item) => `${item.sourceLabel}: ${item.title}`)
    .join("\n");
  const baseSlug = `${topicSlugPrefix(topicKey)}-${isoNow.slice(0, 10)}`;
  const slug = await createUniqueArticleSlug(baseSlug, env);
  const title = `${topic.label} bất động sản ngày ${dateText}: các tín hiệu cần kiểm chứng`;
  const excerpt = `Bản tổng hợp nguồn tin công khai trong ngày, kèm góc nhìn kiểm chứng về giá, pháp lý, hạ tầng và dòng tiền trước khi ra quyết định.`;
  const contentHtml = buildAutoNewsHtml({ topicKey, topic, items, dateText, sourceSummary });
  const seoTitle = `${topic.label} bất động sản ${dateText} | KINGMANS`;
  const seoDescription = `Cập nhật ${topic.label.toLowerCase()} bất động sản ngày ${dateText}: nguồn tin đáng chú ý, tác động với người mua và các điểm cần kiểm chứng trước khi xuống tiền.`;
  const id = crypto.randomUUID();
  const status = normalizeStatus(options.status) || "draft";
  const publishedAt = status === "published" ? isoNow : null;

  await env.DB.prepare(
    `INSERT INTO articles (
      id, slug, title, excerpt, content_markdown, content_html, category,
      cover_image_url, seo_title, seo_description, status, author, published_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      slug,
      title,
      excerpt,
      sourceSummary,
      contentHtml,
      topic.category,
      topic.cover,
      seoTitle,
      seoDescription,
      status,
      options.author || "auto-market",
      publishedAt,
      isoNow,
      isoNow
    )
    .run();

  return {
    ok: true,
    id,
    slug,
    status,
    publishedAt,
    itemCount: items.length,
    failedSources: fetched
      .filter((entry) => entry.status === "rejected")
      .map((entry) => entry.reason?.message || "Nguồn không phản hồi")
  };
}

function buildAutoNewsHtml({ topicKey, topic, items, dateText, sourceSummary }) {
  const sourceRows = items
    .map(
      (item, index) => `
        <li>
          <strong>${index + 1}. ${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.sourceLabel)}${item.pubDate ? ` · ${escapeHtml(formatSourceDate(item.pubDate))}` : ""}</span>
          ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ""}
          <p><a href="${escapeHtml(item.link)}" target="_blank" rel="nofollow noopener noreferrer">Xem nguồn gốc</a></p>
        </li>`
    )
    .join("");

  const angle = autoNewsAngle(topicKey);
  const checklist = angle.checklist
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const implications = angle.implications
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.group)}</td>
          <td>${escapeHtml(row.reading)}</td>
          <td>${escapeHtml(row.action)}</td>
        </tr>`
    )
    .join("");

  return `
    <p class="article-lede">Bản tin này tổng hợp các nguồn công khai trong ngày ${escapeHtml(dateText)} và được trình bày theo góc nhìn kiểm chứng của KINGMANS Realty. Nội dung có mục tiêu hỗ trợ người mua đọc thị trường tỉnh táo hơn, không thay thế cho việc đối chiếu hồ sơ pháp lý, bảng giá và tiến độ thực tế tại thời điểm giao dịch.</p>

    <h2>Nguồn tin đáng chú ý</h2>
    <p>Các tiêu đề dưới đây được chọn vì có liên quan đến ${escapeHtml(topic.label.toLowerCase())}, biến động cung cầu, chính sách hoặc yếu tố hạ tầng có thể ảnh hưởng đến quyết định mua bất động sản.</p>
    <ul class="article-source-list">
      ${sourceRows}
    </ul>

    <h2>Góc nhìn KINGMANS: đọc tin theo dữ liệu, không theo cảm xúc</h2>
    <p>${escapeHtml(angle.viewpoint)}</p>
    <div class="article-callout">
      <strong>Những điểm cần kiểm chứng thêm</strong>
      <ul>${checklist}</ul>
    </div>

    <h2>Tác động với từng nhóm khách hàng</h2>
    <div class="article-table-wrap">
      <table class="article-table">
        <thead>
          <tr>
            <th>Nhóm khách hàng</th>
            <th>Cách đọc thông tin</th>
            <th>Hành động nên làm</th>
          </tr>
        </thead>
        <tbody>${implications}</tbody>
      </table>
    </div>

    <h2>Kết luận thận trọng</h2>
    <p>${escapeHtml(angle.conclusion)}</p>
    <p>Với các thông tin liên quan đến giá bán, tiến độ dự án, pháp lý hoặc chính sách tín dụng, KINGMANS Realty khuyến nghị khách hàng đối chiếu trực tiếp với hồ sơ gốc và phương án tài chính cá nhân trước khi đặt cọc.</p>

    <div class="article-callout cta-callout">
      <strong>Cần lọc dự án theo ngân sách và khẩu vị rủi ro?</strong>
      <p>Gửi khu vực quan tâm, ngân sách dự kiến và mục tiêu mua. KINGMANS Realty sẽ hỗ trợ sàng lọc danh sách dự án phù hợp, chỉ ra các điểm cần kiểm tra trước khi xuống tiền.</p>
      <p><a class="button primary" href="/#contact">Nhận danh sách dự án phù hợp</a></p>
    </div>

    <h2>Nguồn tham khảo</h2>
    <pre>${escapeHtml(sourceSummary)}</pre>
  `.trim();
}

function autoNewsAngle(topicKey) {
  const angles = {
    apartment: {
      viewpoint: "Thông tin về căn hộ cần được đọc cùng lúc ở ba lớp: nguồn cung thực tế, khả năng hấp thụ và chi phí sở hữu sau ưu đãi. Một khu vực có nhiều dự án mới chưa chắc là cơ hội nếu lực thuê hoặc nhu cầu ở thật chưa đủ rõ.",
      checklist: [
        "Mặt bằng giá sơ cấp và thứ cấp trong bán kính 3-5 km.",
        "Tiến độ thi công, thời điểm bàn giao và chi phí vận hành sau nhận nhà.",
        "Lực thuê thực tế, nhóm khách thuê chính và tỷ lệ trống của dự án lân cận."
      ],
      implications: [
        { group: "Mua ở", reading: "Ưu tiên tiện ích, kết nối đi làm và chi phí hàng tháng.", action: "So sánh tổng chi phí sở hữu thay vì chỉ nhìn giá niêm yết." },
        { group: "Đầu tư", reading: "Quan sát lực thuê và thanh khoản thứ cấp.", action: "Lập bảng dòng tiền 3-5 năm trước khi chọn căn." },
        { group: "Ký gửi", reading: "Tin thị trường có thể ảnh hưởng kỳ vọng giá bán.", action: "Định giá lại theo giao dịch thật, không theo giá rao cao nhất." }
      ],
      conclusion: "Cơ hội căn hộ vẫn nằm ở sản phẩm có nhu cầu ở thật, pháp lý rõ và tổng giá phù hợp với dòng tiền của người mua mục tiêu."
    },
    infrastructure: {
      viewpoint: "Hạ tầng là yếu tố có thể nâng kỳ vọng giá, nhưng chỉ tạo giá trị bền vững khi công trình đi vào triển khai thực tế và kéo theo dân cư, thương mại, dịch vụ.",
      checklist: [
        "Phân biệt hạ tầng đã phê duyệt, đang thi công và đã vận hành.",
        "Khoảng cách thực tế từ dự án đến điểm kết nối, không chỉ nhìn bản đồ quảng cáo.",
        "Tác động đến thời gian di chuyển, lực thuê và khả năng hình thành tiện ích mới."
      ],
      implications: [
        { group: "Mua ở", reading: "Hạ tầng tốt giúp giảm thời gian di chuyển.", action: "Đi thực tế vào giờ cao điểm để kiểm chứng." },
        { group: "Đầu tư", reading: "Giá thường phản ánh kỳ vọng trước khi hạ tầng hoàn thành.", action: "Không mua chỉ vì tin quy hoạch, cần so sánh biên an toàn giá." },
        { group: "Cho thuê", reading: "Hạ tầng tốt có thể mở rộng tập khách thuê.", action: "Kiểm tra khu công nghiệp, văn phòng, trường học và tiện ích quanh dự án." }
      ],
      conclusion: "Tin hạ tầng chỉ đáng chuyển thành quyết định đầu tư khi có tiến độ rõ, tác động kết nối thật và giá vào vẫn còn biên an toàn."
    },
    "legal-finance": {
      viewpoint: "Pháp lý và tài chính là lớp phòng thủ đầu tiên của người mua. Bất kỳ ưu đãi lãi suất hay lịch thanh toán đẹp nào cũng cần được kiểm tra cùng hợp đồng, bảo lãnh ngân hàng và nghĩa vụ tài chính thực tế.",
      checklist: [
        "Quy hoạch 1/500, giấy phép xây dựng và điều kiện mở bán.",
        "Bảo lãnh ngân hàng cho từng hợp đồng mua bán.",
        "Lãi suất sau ưu đãi, phí trả nợ trước hạn và khoản dự phòng khẩn cấp."
      ],
      implications: [
        { group: "Mua ở", reading: "Khoản vay phải phù hợp thu nhập sau khi hết ưu đãi.", action: "Giữ tỷ lệ trả nợ trong vùng an toàn 35-40% thu nhập." },
        { group: "Đầu tư", reading: "Pháp lý chậm có thể làm giảm thanh khoản.", action: "Chỉ xuống tiền khi hiểu rõ điều kiện chuyển nhượng và bàn giao." },
        { group: "Ký gửi", reading: "Người mua ngày càng hỏi sâu về hồ sơ pháp lý.", action: "Chuẩn bị bộ tài liệu pháp lý trước khi chào bán." }
      ],
      conclusion: "Một giao dịch tốt không chỉ cần giá tốt, mà cần khả năng đi đến bàn giao và vận hành tài sản với rủi ro được kiểm soát."
    },
    "market-pulse": {
      viewpoint: "Tin thị trường nên được xem như tín hiệu ban đầu, không phải kết luận cuối cùng. Điều cần quan sát là xu hướng lặp lại qua nhiều nguồn: giá, thanh khoản, pháp lý, tín dụng và hạ tầng.",
      checklist: [
        "Tin nào phản ánh giao dịch thật, tin nào chỉ là kỳ vọng.",
        "Khu vực nào có nhu cầu ở thật, lực thuê và hạ tầng đang vận hành.",
        "Mức giá hiện tại còn phù hợp với thu nhập, dòng tiền và biên an toàn hay không."
      ],
      implications: [
        { group: "Mua ở", reading: "Thị trường biến động không quan trọng bằng sự phù hợp với nhu cầu sống.", action: "Chọn sản phẩm vừa ngân sách, pháp lý rõ và tiện đi lại." },
        { group: "Đầu tư", reading: "Không chạy theo tin nóng nếu chưa có số liệu hấp thụ.", action: "So sánh giá vào, lực thuê và khả năng thoát hàng." },
        { group: "Giữ tài sản", reading: "Tập trung khu vực có hạ tầng, dân cư và tiện ích tăng đều.", action: "Ưu tiên tài sản có vị trí khó thay thế và chi phí nắm giữ hợp lý." }
      ],
      conclusion: "Trong giai đoạn thị trường phân hóa, lợi thế thuộc về người mua có quy trình kiểm chứng rõ ràng và không để cảm xúc dẫn dắt quyết định."
    }
  };
  return angles[topicKey] || angles["market-pulse"];
}

function parseRssItems(xml, source) {
  const items = String(xml || "").match(/<item\b[\s\S]*?<\/item>/gi) || [];
  return items.slice(0, 20).map((item) => {
    const title = cleanNewsText(readXmlTag(item, "title"), 180);
    const link = cleanNewsUrl(readXmlTag(item, "link"));
    const summary = cleanNewsText(readXmlTag(item, "description"), 240);
    const pubDate = cleanNewsText(readXmlTag(item, "pubDate"), 80);
    return {
      title,
      link,
      summary,
      pubDate,
      sourceKey: source.key,
      sourceLabel: source.label,
      sourceDomain: source.domain
    };
  });
}

function readXmlTag(xml, tagName) {
  const match = String(xml || "").match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  if (!match) return "";
  return decodeXmlEntities(stripCdata(match[1]));
}

function stripCdata(value) {
  return String(value || "")
    .replace(/^<!\[CDATA\[/i, "")
    .replace(/\]\]>$/i, "");
}

function decodeXmlEntities(value) {
  return String(value || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number.parseInt(num, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function cleanNewsText(value, maxLength) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanNewsUrl(value) {
  const raw = String(value || "").trim();
  if (!raw.startsWith("http://") && !raw.startsWith("https://")) return "";
  return raw;
}

function matchesKeywords(item, keywords) {
  const haystack = `${item.title} ${item.summary}`.toLowerCase();
  return keywords.some((keyword) => haystack.includes(String(keyword).toLowerCase()));
}

function uniqueNewsItems(items) {
  const seen = new Set();
  const unique = [];
  for (const item of items) {
    const key = item.link || item.title;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  return unique;
}

function normalizeAutoNewsTopic(value) {
  const raw = String(value || "").trim();
  return AUTO_NEWS_TOPICS[raw] ? raw : null;
}

function normalizeAutoNewsSourceKeys(value) {
  const allowed = new Set(AUTO_NEWS_SOURCES.map((source) => source.key));
  const input = Array.isArray(value) ? value : String(value || "").split(",");
  return input
    .map((item) => String(item || "").trim())
    .filter((item) => allowed.has(item));
}

function topicSlugPrefix(topicKey) {
  const map = {
    "market-pulse": "nhip-thi-truong-bat-dong-san",
    apartment: "tin-can-ho-do-thi-ve-tinh",
    infrastructure: "tin-ha-tang-do-thi-bat-dong-san",
    "legal-finance": "tin-phap-ly-tai-chinh-bat-dong-san"
  };
  return map[topicKey] || map["market-pulse"];
}

async function createUniqueArticleSlug(baseSlug, env) {
  const cleanBase = sanitizeSlug(baseSlug) || `bai-viet-${new Date().toISOString().slice(0, 10)}`;
  for (let index = 0; index < 20; index += 1) {
    const slug = index === 0 ? cleanBase : `${cleanBase}-${index + 1}`;
    const existing = await env.DB.prepare("SELECT id FROM articles WHERE slug = ? LIMIT 1")
      .bind(slug)
      .first();
    if (!existing) return slug;
  }
  return `${cleanBase}-${crypto.randomUUID().slice(0, 8)}`;
}

function formatSourceDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

async function serveMedia(key, env) {
  if (!key || key.includes("..")) {
    return new Response("Invalid media key", { status: 400 });
  }

  const object = await env.MEDIA.get(key);
  if (!object) {
    return new Response("Media not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=604800, immutable");
  headers.set("x-content-type-options", "nosniff");

  return new Response(object.body, { headers });
}

async function renderSitemap(env, origin) {
  const [articlesResult, projectsResult, staticXml] = await Promise.all([
    env.DB.prepare(
      `SELECT slug, updated_at, published_at
       FROM articles
       WHERE status = 'published'
       ORDER BY datetime(COALESCE(updated_at, published_at)) DESC
       LIMIT 500`
    ).all(),
    env.DB.prepare(
      `SELECT slug, updated_at, published_at
       FROM projects
       WHERE status = 'published'
       ORDER BY datetime(COALESCE(updated_at, published_at)) DESC
       LIMIT 300`
    ).all(),
    env.ASSETS.fetch(new Request(`${origin}/sitemap-static.xml`))
      .then((response) => (response.ok ? response.text() : ""))
      .catch(() => "")
  ]);

  const dynamicEntries = [
    ...(articlesResult.results || []).map((item) => sitemapUrl(`${origin}/bai-viet/${item.slug}`, item.updated_at || item.published_at, "weekly", "0.72")),
    ...(projectsResult.results || []).map((item) => sitemapUrl(`${origin}/du-an/${item.slug}`, item.updated_at || item.published_at, "weekly", "0.78"))
  ].join("\n");

  const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrl(`${origin}/`, new Date().toISOString(), "daily", "1.0")}\n</urlset>`;
  const baseXml = staticXml || fallbackXml;
  const xml = baseXml.includes("</urlset>")
    ? baseXml.replace("</urlset>", `${dynamicEntries ? `\n${dynamicEntries}` : ""}\n</urlset>`)
    : fallbackXml.replace("</urlset>", `${dynamicEntries ? `\n${dynamicEntries}` : ""}\n</urlset>`);

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=300"
    }
  });
}

function sitemapUrl(loc, lastmod, changefreq, priority) {
  const date = String(lastmod || new Date().toISOString()).slice(0, 10);
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(date)}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${escapeXml(priority)}</priority>
  </url>`;
}

async function renderArticlePage(slug, env, origin) {
  const article = await env.DB.prepare(
    `SELECT slug, title, excerpt, content_html, category, cover_image_url, seo_title, seo_description, published_at, updated_at
     FROM articles
     WHERE slug = ? AND status = 'published'
     LIMIT 1`
  )
    .bind(slug)
    .first();

  if (!article) {
    return notFoundHtml();
  }

  const title = escapeHtml(article.seo_title || `${article.title} | KINGMANS Realty`);
  const description = escapeHtml(article.seo_description || article.excerpt || "");
  const canonical = `${origin}/bai-viet/${article.slug}`;
  const image = article.cover_image_url
    ? absoluteMediaUrl(origin, article.cover_image_url)
    : `${origin}/assets/images/article-market-binh-duong.webp`;
  const content = sanitizeTrustedHtml(article.content_html || "");
  const publishedDate = (article.published_at || article.updated_at || "").slice(0, 10);
  const displayDate = formatVietnameseDate(publishedDate);
  const category = categoryLabel(article.category);
  const jsonLd = escapeJsonForHtml(
    JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": `${canonical}#article`,
          headline: article.title,
          description: article.seo_description || article.excerpt || "",
          image: [image],
          datePublished: publishedDate || undefined,
          dateModified: (article.updated_at || article.published_at || "").slice(0, 10) || undefined,
          inLanguage: "vi-VN",
          author: {
            "@type": "Organization",
            name: "KINGMANS Realty",
            url: `${origin}/`
          },
          publisher: {
            "@type": "Organization",
            name: "KINGMANS Realty",
            logo: {
              "@type": "ImageObject",
              url: `${origin}/assets/kingmans-logo.png`
            }
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonical
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumbs`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${origin}/` },
            { "@type": "ListItem", position: 2, name: "Góc chuyên gia", item: `${origin}/#market` },
            { "@type": "ListItem", position: 3, name: article.title, item: canonical }
          ]
        }
      ]
    })
  );

  return new Response(
    `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="author" content="KINGMANS Realty">
  <meta name="theme-color" content="#0d1b2a">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta property="og:locale" content="vi_VN">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(image)}">
  <meta property="og:image:alt" content="${escapeHtml(article.title)}">
  ${publishedDate ? `<meta property="article:published_time" content="${escapeHtml(publishedDate)}">` : ""}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${escapeHtml(image)}">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${jsonLd}</script>
  <script src="/tracking-config.js" defer></script>
  <script src="/tracking.js" defer></script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/" aria-label="KINGMANS">
      <span class="brand-wordmark">KINGMANS</span>
    </a>
    <nav class="main-nav" aria-label="Điều hướng chính">
      <a href="/#market">Góc chuyên gia</a>
      <a href="/#projects">Dự án</a>
      <a href="/#profile">Đội ngũ</a>
      <a href="/#contact">Liên hệ</a>
    </nav>
    <a class="header-cta" href="tel:0396460442">Gọi hotline</a>
    <button class="menu-button" type="button" aria-label="Mở menu" aria-expanded="false">
      <span></span><span></span>
    </button>
  </header>
  <main>
    <section class="article-hero" style="--article-image: url('${escapeHtml(image)}')">
      <div class="article-hero-content">
        <a class="back-link" href="/#market">Quay lại góc chuyên gia</a>
        <p class="eyebrow">${escapeHtml(category)}${displayDate ? ` | ${escapeHtml(displayDate)}` : ""}</p>
        <h1>${escapeHtml(article.title)}</h1>
        ${article.excerpt ? `<p>${escapeHtml(article.excerpt)}</p>` : ""}
      </div>
    </section>

    <section class="article-layout cms-article-layout">
      <article class="article-prose cms-article-prose">
        ${article.excerpt ? `<p class="article-lede">${escapeHtml(article.excerpt)}</p>` : ""}
        <section class="article-section cms-content">
          ${content}
        </section>
      </article>

      <aside class="article-sidebar" aria-label="Tư vấn nhanh">
        <p class="section-kicker">Tư vấn nhanh</p>
        <h2>Cần kiểm chứng thông tin trước khi xuống tiền?</h2>
        <p>Gửi khu vực, ngân sách và mục tiêu mua. KINGMANS Realty sẽ hỗ trợ bóc tách pháp lý, bảng giá, dòng tiền và rủi ro thực tế trước khi bạn ra quyết định.</p>
        <a class="button primary" href="/#contact">Gửi nhu cầu</a>
        <a class="button secondary" href="tel:0396460442">Gọi 0396 460 442</a>
      </aside>
    </section>
  </main>
  <footer class="site-footer">
    <div><strong>KINGMANS</strong><span>Đội ngũ cố vấn bất động sản độc lập tại TP.HCM, Bình Dương và khu vực vệ tinh.</span></div>
    <div class="footer-links">
      <a href="tel:0396460442">0396 460 442</a>
      <a href="mailto:contact@kingmansrealty.com">contact@kingmansrealty.com</a>
      <a href="https://www.facebook.com/profile.php?id=61586688100723&amp;locale=vi_VN" target="_blank" rel="noreferrer">Facebook</a>
      <a href="https://zalo.me/0396460442" target="_blank" rel="noreferrer">Zalo</a>
    </div>
  </footer>
  <script src="/site.js"></script>
</body>
</html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300"
      }
    }
  );
}

async function renderProjectPage(slug, env, origin) {
  const project = await env.DB.prepare(
    `SELECT slug, name, location, summary, content_html, cover_image_url, project_type, stats_json, cta_url, seo_title, seo_description, published_at, updated_at
     FROM projects
     WHERE slug = ? AND status = 'published'
     LIMIT 1`
  )
    .bind(slug)
    .first();

  if (!project) {
    return notFoundHtml();
  }

  const title = escapeHtml(project.seo_title || `${project.name} | KINGMANS Realty`);
  const description = escapeHtml(project.seo_description || project.summary || "");
  const canonical = `${origin}/du-an/${project.slug}`;
  const image = absoluteMediaUrl(origin, project.cover_image_url);
  const content = sanitizeTrustedHtml(project.content_html || "");
  const stats = safeParseJsonArray(project.stats_json).map(escapeHtml);
  const location = escapeHtml(project.location || "");
  const ctaUrl = escapeHtml(project.cta_url || "/#contact");

  return new Response(
    `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${escapeHtml(image)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${escapeHtml(image)}">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/" aria-label="KINGMANS">
      <span class="brand-wordmark">KINGMANS</span>
    </a>
    <nav class="main-nav" aria-label="Điều hướng chính">
      <a href="/#market">Góc chuyên gia</a>
      <a href="/#projects">Dự án</a>
      <a href="/#profile">Đội ngũ</a>
      <a href="/#contact">Liên hệ</a>
    </nav>
    <a class="header-cta" href="tel:0396460442">Gọi hotline</a>
    <button class="menu-button" type="button" aria-label="Mở menu" aria-expanded="false">
      <span></span><span></span>
    </button>
  </header>
  <main class="article-main">
    <article class="article-shell">
      <p class="article-shell-kicker">Dự án tiêu biểu • ${escapeHtml(project.project_type || "du-an")}</p>
      <h1>${escapeHtml(project.name)}</h1>
      <p class="article-shell-meta">${location}</p>
      ${
        project.cover_image_url
          ? `<img class="article-shell-image" src="${escapeHtml(image)}" alt="${escapeHtml(project.name)}" loading="eager" decoding="async">`
          : ""
      }
      ${
        stats.length
          ? `<div class="project-stats">${stats.map((value) => `<span>${value}</span>`).join("")}</div>`
          : ""
      }
      <div class="article-shell-content">${content}</div>
      <p><a class="button primary" href="${ctaUrl}" target="_blank" rel="noreferrer">Xem thông tin chi tiết</a></p>
    </article>
  </main>
  <script src="/site.js"></script>
</body>
</html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300"
      }
    }
  );
}

function notFoundHtml() {
  return new Response("Not found", { status: 404 });
}

function normalizeArticlePayload(input) {
  const slug = sanitizeSlug(input.slug);
  const title = cleanText(input.title, 160);
  const excerpt = cleanText(input.excerpt, 320);
  const contentHtml = String(input.content_html ?? "").trim();
  const category = normalizeCategory(input.category);
  const status = normalizeStatus(input.status) || "draft";
  const coverImage = cleanUrl(input.cover_image_url);
  const seoTitle = cleanText(input.seo_title, 160);
  const seoDescription = cleanText(input.seo_description, 320);
  const contentMarkdown = String(input.content_markdown ?? "").trim();

  if (!slug) return { ok: false, error: "Slug khong hop le." };
  if (!title) return { ok: false, error: "Title bat buoc." };
  if (!contentHtml) return { ok: false, error: "Noi dung HTML bat buoc." };
  if (!category) return { ok: false, error: "Category khong hop le." };
  if (!["draft", "published"].includes(status)) return { ok: false, error: "Status khong hop le." };

  return {
    ok: true,
    data: {
      slug,
      title,
      excerpt,
      content_html: contentHtml,
      content_markdown: contentMarkdown,
      category,
      status,
      cover_image_url: coverImage,
      seo_title: seoTitle,
      seo_description: seoDescription
    }
  };
}

function normalizeProjectPayload(input) {
  const slug = sanitizeSlug(input.slug);
  const name = cleanText(input.name, 180);
  const location = cleanText(input.location, 180);
  const summary = cleanText(input.summary, 360);
  const contentHtml = String(input.content_html ?? "").trim();
  const contentMarkdown = String(input.content_markdown ?? "").trim();
  const projectType = normalizeProjectType(input.project_type) || "khac";
  const status = normalizeStatus(input.status) || "draft";
  const coverImage = cleanUrl(input.cover_image_url);
  const ctaUrl = cleanUrl(input.cta_url);
  const seoTitle = cleanText(input.seo_title, 160);
  const seoDescription = cleanText(input.seo_description, 320);
  const stats = normalizeStats(input.stats);

  if (!slug) return { ok: false, error: "Slug khong hop le." };
  if (!name) return { ok: false, error: "Ten du an bat buoc." };
  if (!contentHtml) return { ok: false, error: "Noi dung HTML bat buoc." };
  if (!["draft", "published"].includes(status)) return { ok: false, error: "Status khong hop le." };

  return {
    ok: true,
    data: {
      slug,
      name,
      location,
      summary,
      content_html: contentHtml,
      content_markdown: contentMarkdown,
      project_type: projectType,
      status,
      cover_image_url: coverImage,
      cta_url: ctaUrl,
      seo_title: seoTitle,
      seo_description: seoDescription,
      stats
    }
  };
}

function normalizeStats(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanText(item, 80))
      .filter(Boolean)
      .slice(0, 8);
  }
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => cleanText(item, 80))
      .filter(Boolean)
      .slice(0, 8);
  }
  return [];
}

function normalizeCategory(value) {
  const raw = String(value ?? "").trim().toLowerCase();
  return ARTICLE_CATEGORIES.has(raw) ? raw : null;
}

function normalizeProjectType(value) {
  const raw = String(value ?? "").trim().toLowerCase();
  return PROJECT_TYPES.has(raw) ? raw : null;
}

function normalizeStatus(value) {
  const raw = String(value ?? "").trim().toLowerCase();
  return ["draft", "published"].includes(raw) ? raw : null;
}

function cleanQuery(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  return raw.slice(0, 80);
}

function cleanText(value, maxLength) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return text.slice(0, maxLength);
}

function cleanUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (raw.startsWith("/")) return raw;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return "";
}

function sanitizeSlug(value) {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_/]/g, "-")
    .replace(/\/+/g, "/")
    .replace(/-+/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "");

  if (!raw || raw.length > 120) return "";
  if (raw.includes("..")) return "";
  return raw;
}

function clampInt(value, min, max, fallback) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function json(payload, status = 200, extraHeaders = {}) {
  const headers = new Headers(JSON_HEADERS);
  for (const [key, value] of Object.entries(extraHeaders)) {
    headers.set(key, value);
  }
  return new Response(JSON.stringify(payload), { status, headers });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sanitizeTrustedHtml(value) {
  return String(value ?? "").trim();
}

function safeParseJsonArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => String(item ?? "")).filter(Boolean);
  } catch {
    return [];
  }
}

function categoryLabel(value) {
  const labels = {
    market: "Thị trường",
    guide: "Hướng dẫn",
    finance: "Tài chính",
    lifestyle: "Sống xanh & Công nghệ"
  };
  return labels[value] || "Góc chuyên gia";
}

function formatVietnameseDate(value) {
  const date = value ? new Date(`${value}T00:00:00+07:00`) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function escapeJsonForHtml(value) {
  return String(value ?? "").replace(/</g, "\\u003c");
}

function absoluteMediaUrl(origin, path) {
  const raw = String(path ?? "").trim();
  if (!raw) {
    return `${origin}/assets/kingmans-logo.png`;
  }
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  if (raw.startsWith("/")) {
    return `${origin}${raw}`;
  }
  return `${origin}/${raw}`;
}

async function readSessionFromRequest(request, env) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = readCookie(cookieHeader, SESSION_COOKIE);
  if (!token) return null;
  return verifySessionToken(token, env);
}

function readCookie(cookieHeader, name) {
  const parts = cookieHeader.split(";").map((part) => part.trim());
  for (const part of parts) {
    const [key, ...rest] = part.split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}

async function createSessionToken(username, env) {
  const secret = ensureSecret(env);
  const payload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };
  const payloadPart = toBase64Url(JSON.stringify(payload));
  const signature = await signValue(payloadPart, secret);
  return `${payloadPart}.${signature}`;
}

async function verifySessionToken(token, env) {
  const secret = ensureSecret(env);
  const [payloadPart, signature] = String(token ?? "").split(".");
  if (!payloadPart || !signature) {
    return null;
  }
  const expected = await signValue(payloadPart, secret);
  if (!safeEqual(signature, expected)) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(fromBase64Url(payloadPart));
  } catch {
    return null;
  }
  if (!payload || typeof payload !== "object") {
    return null;
  }
  if (!payload.sub || !payload.exp) {
    return null;
  }
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }
  return payload;
}

async function signValue(value, secret) {
  const key = await getSigningKey(secret);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, textEncoder.encode(value));
  return toBase64Url(signatureBuffer);
}

function ensureSecret(env) {
  const secret = String(env.ADMIN_TOKEN_SECRET || "").trim();
  if (!secret) {
    throw new Error("Missing ADMIN_TOKEN_SECRET");
  }
  return secret;
}

async function getSigningKey(secret) {
  const cacheKey = `hmac:${secret}`;
  if (!keyCache.has(cacheKey)) {
    keyCache.set(
      cacheKey,
      crypto.subtle.importKey(
        "raw",
        textEncoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
      )
    );
  }
  return keyCache.get(cacheKey);
}

function safeEqual(a, b) {
  const left = String(a ?? "");
  const right = String(b ?? "");
  if (left.length !== right.length) return false;
  let result = 0;
  for (let i = 0; i < left.length; i += 1) {
    result |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return result === 0;
}

function toBase64Url(input) {
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : textEncoder.encode(String(input));
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(input) {
  const normalized = String(input).replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  return atob(padded);
}

function getFileExtension(fileName) {
  const clean = String(fileName ?? "").toLowerCase();
  const match = clean.match(/\.[a-z0-9]+$/);
  return match ? match[0] : "";
}
