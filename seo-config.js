const SEO_CONFIG = {
  siteUrl: "https://kingmansrealty.com",
  brandName: "KINGMANS",
  slogan: "Cố vấn bất động sản cá nhân",
  phone: "0396460442",
  phoneDisplay: "0396 460 442",
  email: "binhopusrealty@gmail.com",
  facebook: "https://www.facebook.com/profile.php?id=61586688100723&locale=vi_VN",
  logo: "assets/kingmans-logo.webp",
  defaultImage: "assets/kingmans-logo.webp",
  locale: "vi_VN"
};

function seoAbsoluteUrl(path = "") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = SEO_CONFIG.siteUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

function setSeoMeta(selector, content) {
  const element = document.querySelector(selector);

  if (element && content) {
    element.setAttribute("content", content);
  }
}

function setSeoLink(selector, href) {
  const element = document.querySelector(selector);

  if (element && href) {
    element.setAttribute("href", href);
  }
}

function setJsonLd(id, data) {
  let script = document.querySelector(`#${id}`);

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.append(script);
  }

  script.textContent = JSON.stringify(data);
}
