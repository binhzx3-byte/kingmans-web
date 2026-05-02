(function () {
  const config = window.KINGMANS_TRACKING || {};
  const hasGa4 = /^G-[A-Z0-9]+$/i.test(config.ga4Id || "");
  const hasMetaPixel = /^\d{8,}$/.test(config.metaPixelId || "");

  function loadScript(src, async = true) {
    const script = document.createElement("script");
    script.src = src;
    script.async = async;
    document.head.append(script);
  }

  if (hasGa4) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", config.ga4Id);
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${config.ga4Id}`);
  }

  if (hasMetaPixel) {
    window.fbq =
      window.fbq ||
      function () {
        window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
      };
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = "2.0";
    window.fbq.queue = [];
    window.fbq("init", config.metaPixelId);
    window.fbq("track", "PageView");
    loadScript("https://connect.facebook.net/en_US/fbevents.js");
  }

  function track(eventName, params = {}) {
    if (hasGa4 && window.gtag) {
      window.gtag("event", eventName, { transport_type: "beacon", ...params });
    }

    if (hasMetaPixel && window.fbq) {
      window.fbq("trackCustom", eventName, params);
    }

    if (config.debug) {
      console.info("[KINGMANS tracking]", eventName, params);
    }
  }

  window.kingmansTrack = track;

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link) {
      return;
    }

    const href = link.getAttribute("href") || "";
    const label = link.textContent.trim().replace(/\s+/g, " ").slice(0, 80);

    if (href.startsWith("tel:")) {
      track("click_phone", { link_text: label, page_path: window.location.pathname });
      return;
    }

    if (href.startsWith("mailto:")) {
      track("click_email", { link_text: label, page_path: window.location.pathname });
      return;
    }

    if (href.includes("zalo.me")) {
      track("click_zalo", { link_text: label, page_path: window.location.pathname });
      return;
    }

    if (/^https?:\/\//i.test(href) && !href.includes(window.location.hostname)) {
      track("click_external_link", { link_text: label, link_url: href, page_path: window.location.pathname });
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    track("generate_lead", {
      form_id: form.id || "lead-form",
      form_name: form.getAttribute("data-form-name") || form.id || "lead-form",
      page_path: window.location.pathname
    });
  });
})();
