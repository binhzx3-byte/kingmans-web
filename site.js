const siteMenuButton = document.querySelector(".menu-button");
const siteMainNav = document.querySelector(".main-nav");

if (siteMenuButton && siteMainNav) {
  siteMenuButton.addEventListener("click", () => {
    const isOpen = siteMainNav.classList.toggle("open");
    siteMenuButton.setAttribute("aria-expanded", String(isOpen));
  });

  siteMainNav.addEventListener("click", () => {
    siteMainNav.classList.remove("open");
    siteMenuButton.setAttribute("aria-expanded", "false");
  });
}

const ARTICLE_LINK_LIBRARY = [
  {
    title: "Thị trường bất động sản Bình Dương 2026",
    href: "/phan-tich-thi-truong-bat-dong-san-binh-duong-2026.html",
    tags: ["bình dương", "binh duong", "thuận an", "thuan an", "dĩ an", "di an", "nguồn cung", "nguon cung", "quốc lộ 13", "quoc lo 13", "dòng tiền", "dong tien"]
  },
  {
    title: "Opal Luxury Dĩ An",
    href: "/opal-luxury.html",
    tags: ["opal", "dĩ an", "di an", "sóng thần", "song than", "thủ đức", "thu duc"]
  },
  {
    title: "Gem Sky World Long Thành",
    href: "/gem-sky-world.html",
    tags: ["gem sky world", "long thành", "long thanh", "sân bay", "san bay", "đồng nai", "dong nai"]
  },
  {
    title: "Khải Hoàn Imperial",
    href: "/khai-hoan-imperial.html",
    tags: ["khải hoàn", "khai hoan", "nhà bè", "nha be", "nam sài gòn", "nam sai gon"]
  },
  {
    title: "Tiềm năng tăng giá dọc Quốc lộ 13",
    href: "/quoc-lo-13-tiem-nang-tang-gia-bat-dong-san.html",
    tags: ["quốc lộ 13", "quoc lo 13", "ql13", "thuận an", "thuan an", "bình dương", "binh duong"]
  },
  {
    title: "Đánh giá thị trường căn hộ Thuận An 2026",
    href: "/danh-gia-thi-truong-can-ho-thuan-an-2026.html",
    tags: ["thuận an", "thuan an", "căn hộ", "can ho", "bình dương", "binh duong"]
  },
  {
    title: "Bảng giá căn hộ Dĩ An 2026",
    href: "/bang-gia-can-ho-di-an-2026.html",
    tags: ["dĩ an", "di an", "bảng giá", "bang gia", "căn hộ", "can ho"]
  },
  {
    title: "Dòng tiền cho thuê căn hộ Dĩ An",
    href: "/dong-tien-cho-thue-can-ho-di-an.html",
    tags: ["cho thuê", "cho thue", "dòng tiền", "dong tien", "dĩ an", "di an"]
  },
  {
    title: "Pháp lý Opal Luxury cần kiểm tra gì?",
    href: "/phap-ly-opal-luxury-can-kiem-tra-gi.html",
    tags: ["pháp lý", "phap ly", "opal", "dĩ an", "di an"]
  },
  {
    title: "Checklist pháp lý căn hộ sơ cấp",
    href: "/checklist-phap-ly-can-ho-so-cap.html",
    tags: ["pháp lý", "phap ly", "đặt cọc", "dat coc", "hợp đồng", "hop dong"]
  },
  {
    title: "Bài toán đòn bẩy tài chính khi mua căn hộ",
    href: "/don-bay-tai-chinh-mua-can-ho.html",
    tags: ["tài chính", "tai chinh", "vay", "lãi suất", "lai suat", "đòn bẩy", "don bay"]
  },
  {
    title: "Smart Home ở căn hộ Bình Dương",
    href: "/smart-home-can-ho-binh-duong-thuc-te.html",
    tags: ["smart home", "sống xanh", "song xanh", "công nghệ", "cong nghe", "bình dương", "binh duong"]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  enhanceArticleExperience();
});

function enhanceArticleExperience() {
  const article = document.querySelector(".article-prose");
  if (!article || article.dataset.enhanced === "true") return;

  article.dataset.enhanced = "true";
  document.body.classList.add("article-enhanced-page");

  enhanceArticleLinks(article);
  addReadingProgress();
  addReadingTime(article);
  addArticleTrustNote(article);
  addArticleSchema(article);
  addArticleTableOfContents(article);
  addRelatedArticles(article);
  addTopicClusterLinks(article);
  addFaqSchema(article);
  setupArticleReveal(article);
}

function addReadingProgress() {
  if (document.querySelector(".reading-progress")) return;

  const progress = document.createElement("div");
  progress.className = "reading-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = "<span></span>";
  document.body.prepend(progress);

  const bar = progress.querySelector("span");
  const update = () => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / max));
    bar.style.transform = `scaleX(${ratio})`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function addReadingTime(article) {
  const hero = document.querySelector(".article-hero-content");
  if (!hero || hero.querySelector(".reading-time-chip")) return;

  const text = article.textContent || "";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words < 180) return;

  const minutes = Math.max(1, Math.ceil(words / 230));
  const chip = document.createElement("span");
  chip.className = "reading-time-chip";
  chip.textContent = `Thời gian đọc khoảng ${minutes} phút`;

  const eyebrow = hero.querySelector(".eyebrow");
  if (eyebrow) {
    eyebrow.insertAdjacentElement("afterend", chip);
  } else {
    hero.prepend(chip);
  }
}

function addArticleTrustNote(article) {
  if (article.querySelector(".article-trust-note")) return;

  const lede = article.querySelector(".article-lede");
  if (!lede) return;

  const note = document.createElement("aside");
  note.className = "article-trust-note";
  note.innerHTML = `
    <strong>Cách KINGMANS đọc bài viết này</strong>
    <span>Sàng lọc nguồn tin</span>
    <span>Kiểm tra pháp lý</span>
    <span>Tính toán dòng tiền</span>
  `;
  lede.insertAdjacentElement("afterend", note);
}

function addArticleSchema(article) {
  const hasArticleSchema = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .some((script) => script.textContent.includes('"Article"'));
  if (hasArticleSchema) return;

  const headline = document.querySelector("h1")?.textContent?.trim() || document.title;
  const description = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
  const image = document.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") || window.location.href;
  const published = document.querySelector('meta[property="article:published_time"]')?.getAttribute("content") || new Date().toISOString().slice(0, 10);
  const modified = document.querySelector('meta[property="article:modified_time"]')?.getAttribute("content") || published;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonical}#article`,
    headline,
    description,
    image: image ? [image] : undefined,
    datePublished: published,
    dateModified: modified,
    inLanguage: "vi-VN",
    author: {
      "@type": "Organization",
      name: "KINGMANS Realty",
      url: "https://kingmansrealty.com/"
    },
    publisher: {
      "@type": "Organization",
      name: "KINGMANS Realty",
      logo: {
        "@type": "ImageObject",
        url: "https://kingmansrealty.com/assets/kingmans-logo.png"
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical
    }
  };

  Object.keys(schema).forEach((key) => {
    if (schema[key] === undefined || schema[key] === "") delete schema[key];
  });

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.append(script);
}

function addArticleTableOfContents(article) {
  const headings = Array.from(article.querySelectorAll("h2"))
    .filter((heading) => heading.textContent.trim().length > 0)
    .filter((heading) => !heading.closest(".article-related-card, .article-seo-toc"));

  if (headings.length < 2 || document.querySelector(".article-seo-toc")) return;

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = uniqueId(slugify(heading.textContent) || `section-${index + 1}`);
    }
  });

  const toc = document.createElement("nav");
  toc.className = "article-seo-toc";
  toc.setAttribute("aria-label", "Mục lục bài viết");
  toc.innerHTML = `
    <p class="section-kicker">Mục lục</p>
    <strong>Nội dung chính</strong>
    <ol>
      ${headings.map((heading) => `<li><a href="#${escapeAttribute(heading.id)}">${escapeHtmlText(heading.textContent)}</a></li>`).join("")}
    </ol>
  `;

  const sidebar = document.querySelector(".article-sidebar");
  if (sidebar) {
    sidebar.prepend(toc);
  } else {
    article.prepend(toc);
  }
}

function addRelatedArticles(article) {
  if (document.querySelector(".article-related-card")) return;

  const currentPath = normalizePath(window.location.pathname);
  const haystack = `${document.title} ${article.textContent}`.toLowerCase();
  const related = ARTICLE_LINK_LIBRARY
    .filter((item) => normalizePath(item.href) !== currentPath)
    .map((item) => ({
      ...item,
      score: item.tags.reduce((total, tag) => total + (haystack.includes(tag.toLowerCase()) ? 1 : 0), 0)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const fallback = ARTICLE_LINK_LIBRARY
    .filter((item) => normalizePath(item.href) !== currentPath)
    .slice(0, 4 - related.length);
  const items = [...related, ...fallback].slice(0, 4);
  if (!items.length) return;

  const card = document.createElement("aside");
  card.className = "article-related-card";
  card.innerHTML = `
    <p class="section-kicker">Đọc tiếp</p>
    <strong>Bài liên quan</strong>
    <ul>
      ${items.map((item) => `<li><a href="${escapeAttribute(item.href)}">${escapeHtmlText(item.title)}</a></li>`).join("")}
    </ul>
    <button class="article-copy-link" type="button">Copy link bài viết</button>
  `;

  const sidebar = document.querySelector(".article-sidebar");
  if (sidebar) {
    sidebar.append(card);
  } else {
    article.append(card);
  }

  const copyButton = card.querySelector(".article-copy-link");
  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copyButton.textContent = "Đã copy link";
      setTimeout(() => {
        copyButton.textContent = "Copy link bài viết";
      }, 1400);
    } catch {
      copyButton.textContent = "Không copy được";
    }
  });
}

function addTopicClusterLinks(article) {
  if (document.querySelector(".article-cluster-card")) return;

  const currentPath = normalizePath(window.location.pathname);
  const clusters = [
    {
      label: "Pháp lý",
      items: [
        ["Checklist pháp lý căn hộ sơ cấp", "/checklist-phap-ly-can-ho-so-cap.html"],
        ["Pháp lý Opal Luxury cần kiểm tra gì?", "/phap-ly-opal-luxury-can-kiem-tra-gi.html"],
        ["Checklist 7 điểm trước khi ký hợp đồng", "/checklist-7-diem-hop-dong-mua-can-ho.html"]
      ]
    },
    {
      label: "Dòng tiền",
      items: [
        ["Đòn bẩy tài chính khi mua căn hộ", "/don-bay-tai-chinh-mua-can-ho.html"],
        ["Mua căn hộ 2,5 tỷ với vốn 700 triệu", "/mua-can-ho-2-5-ty-von-700-trieu.html"],
        ["Dòng tiền cho thuê căn hộ Dĩ An", "/dong-tien-cho-thue-can-ho-di-an.html"]
      ]
    },
    {
      label: "Dự án & thị trường",
      items: [
        ["Thị trường Bình Dương 2026", "/phan-tich-thi-truong-bat-dong-san-binh-duong-2026.html"],
        ["Quốc lộ 13 và tiềm năng tăng giá", "/quoc-lo-13-tiem-nang-tang-gia-bat-dong-san.html"],
        ["Opal Luxury Dĩ An", "/opal-luxury.html"]
      ]
    }
  ];

  const html = clusters
    .map((cluster) => {
      const links = cluster.items
        .filter(([, href]) => normalizePath(href) !== currentPath)
        .map(([title, href]) => `<li><a href="${escapeAttribute(href)}">${escapeHtmlText(title)}</a></li>`)
        .join("");
      return links ? `<div><strong>${escapeHtmlText(cluster.label)}</strong><ul>${links}</ul></div>` : "";
    })
    .filter(Boolean)
    .join("");

  if (!html) return;

  const card = document.createElement("aside");
  card.className = "article-cluster-card";
  card.innerHTML = `
    <p class="section-kicker">Cụm chủ đề</p>
    <h2>Đọc tiếp theo mạch pháp lý, dòng tiền và dự án</h2>
    <div class="article-cluster-grid">${html}</div>
  `;

  const sidebar = document.querySelector(".article-sidebar");
  if (sidebar) {
    sidebar.append(card);
  } else {
    article.append(card);
  }
}

function enhanceArticleLinks(article) {
  article.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("http")) return;
    const isOwnDomain = href.includes("kingmansrealty.com");
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", isOwnDomain ? "noopener noreferrer" : "nofollow noopener noreferrer");
  });
}

function addFaqSchema(article) {
  const existingFaq = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .some((script) => script.textContent.includes('"FAQPage"'));
  if (existingFaq) return;

  const questions = [];
  const faqContainers = Array.from(article.querySelectorAll(".article-section, .cms-content"))
    .filter((section) => /câu hỏi|faq/i.test((section.querySelector("h2")?.textContent || "").toLowerCase()));

  faqContainers.forEach((section) => {
    section.querySelectorAll("h3").forEach((questionHeading) => {
      const question = questionHeading.textContent.trim();
      const answer = collectAnswerText(questionHeading);
      if (question && answer) {
        questions.push({ question, answer });
      }
    });
  });

  if (questions.length < 2) return;

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.slice(0, 8).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  });
  document.head.append(script);
}

function collectAnswerText(questionHeading) {
  const parts = [];
  let node = questionHeading.nextElementSibling;
  while (node && !["H2", "H3"].includes(node.tagName)) {
    if (["P", "UL", "OL"].includes(node.tagName)) {
      parts.push(node.textContent.trim());
    }
    node = node.nextElementSibling;
  }
  return parts.join(" ").replace(/\s+/g, " ").slice(0, 700);
}

function setupArticleReveal(article) {
  const targets = Array.from(
    article.querySelectorAll(".article-section, .article-callout, .article-figure, .article-table-wrap, .cms-content > *")
  ).filter((target) => !target.classList.contains("article-lede"));

  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    observer.observe(target);
  });
}

function slugify(value) {
  return removeVietnameseMarks(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function uniqueId(base) {
  let id = base;
  let index = 2;
  while (document.getElementById(id)) {
    id = `${base}-${index}`;
    index += 1;
  }
  return id;
}

function normalizePath(value) {
  return String(value || "")
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\//, "")
    .replace(/\/$/, "")
    .toLowerCase();
}

function removeVietnameseMarks(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function escapeHtmlText(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtmlText(value).replace(/`/g, "&#96;");
}
