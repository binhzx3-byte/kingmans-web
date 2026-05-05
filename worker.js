const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const SESSION_COOKIE = "kingmans_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const ARTICLE_CATEGORIES = new Set(["market", "guide", "finance", "lifestyle"]);
const PROJECT_TYPES = new Set(["can-ho", "hang-sang", "dau-tu", "khac"]);

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

  if (url.pathname === "/admin" || url.pathname === "/admin/") {
    return env.ASSETS.fetch(new Request(`${url.origin}/admin/index.html`, request));
  }

  return env.ASSETS.fetch(request);
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
  const image = absoluteMediaUrl(origin, article.cover_image_url);
  const content = sanitizeTrustedHtml(article.content_html || "");
  const dateValue = escapeHtml((article.published_at || article.updated_at || "").slice(0, 10));
  const category = escapeHtml(article.category || "market");

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
  <meta property="og:type" content="article">
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
    <nav class="main-nav" aria-label="Dieu huong chinh">
      <a href="/#market">Goc chuyen gia</a>
      <a href="/#projects">Du an</a>
      <a href="/#profile">Ho so</a>
      <a href="/#contact">Lien he</a>
    </nav>
    <a class="header-cta" href="tel:0396460442">Goi hotline</a>
    <button class="menu-button" type="button" aria-label="Mo menu" aria-expanded="false">
      <span></span><span></span>
    </button>
  </header>
  <main class="article-main">
    <article class="article-shell">
      <p class="article-shell-kicker">Goc chuyen gia • ${category}</p>
      <h1>${escapeHtml(article.title)}</h1>
      <p class="article-shell-meta">${dateValue}</p>
      ${
        article.cover_image_url
          ? `<img class="article-shell-image" src="${escapeHtml(image)}" alt="${escapeHtml(article.title)}" loading="eager" decoding="async">`
          : ""
      }
      <div class="article-shell-content">${content}</div>
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
    <nav class="main-nav" aria-label="Dieu huong chinh">
      <a href="/#market">Goc chuyen gia</a>
      <a href="/#projects">Du an</a>
      <a href="/#profile">Ho so</a>
      <a href="/#contact">Lien he</a>
    </nav>
    <a class="header-cta" href="tel:0396460442">Goi hotline</a>
    <button class="menu-button" type="button" aria-label="Mo menu" aria-expanded="false">
      <span></span><span></span>
    </button>
  </header>
  <main class="article-main">
    <article class="article-shell">
      <p class="article-shell-kicker">Du an tieu bieu • ${escapeHtml(project.project_type || "du-an")}</p>
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
      <p><a class="button primary" href="${ctaUrl}" target="_blank" rel="noreferrer">Xem thong tin chi tiet</a></p>
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
