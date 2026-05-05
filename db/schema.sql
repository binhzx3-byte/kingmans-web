-- D1 schema for KINGMANS CMS

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content_markdown TEXT NOT NULL DEFAULT '',
  content_html TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('market', 'guide', 'finance', 'lifestyle')),
  cover_image_url TEXT NOT NULL DEFAULT '',
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  author TEXT NOT NULL DEFAULT 'admin',
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_articles_status_published
ON articles(status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_articles_category
ON articles(category, published_at DESC);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  content_markdown TEXT NOT NULL DEFAULT '',
  content_html TEXT NOT NULL,
  cover_image_url TEXT NOT NULL DEFAULT '',
  project_type TEXT NOT NULL CHECK (project_type IN ('can-ho', 'hang-sang', 'dau-tu', 'khac')) DEFAULT 'khac',
  stats_json TEXT NOT NULL DEFAULT '[]',
  cta_url TEXT NOT NULL DEFAULT '',
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  author TEXT NOT NULL DEFAULT 'admin',
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_status_published
ON projects(status, published_at DESC);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  author TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_created_at
ON media(created_at DESC);
