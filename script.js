const articles = [
  {
    slug: "tin-hieu-gia-can-ho-binh-duong",
    title: "Ba tín hiệu cần theo dõi khi mặt bằng giá căn hộ tại Bình Dương thay đổi",
    category: "market",
    label: "Thị trường",
    date: "01.05.2026",
    image: "assets/images/article-market-binh-duong.webp",
    excerpt:
      "Phân tích nguồn cung, tỷ lệ hấp thụ, tiến độ hạ tầng và lợi suất cho thuê để nhận diện giá trị thực.",
    link: "thi-truong-can-ho-binh-duong.html"
  },
  {
    slug: "checklist-phap-ly-can-ho-so-cap",
    title: "Checklist pháp lý cơ bản cần kiểm tra trước khi đặt cọc căn hộ sơ cấp.",
    category: "guide",
    label: "Hướng dẫn",
    date: "28.04.2026",
    image: "assets/images/article-legal-checklist.webp",
    excerpt:
      "Rà soát quy hoạch 1/500, giấy phép xây dựng, văn bản đủ điều kiện bán và bảo lãnh ngân hàng.",
    link: "checklist-phap-ly-can-ho-so-cap.html"
  },
  {
    slug: "don-bay-tai-chinh-mua-can-ho",
    title: "Bài toán đòn bẩy tài chính: Vốn tự có bao nhiêu là an toàn khi mua căn hộ?",
    category: "finance",
    label: "Tài chính",
    date: "24.04.2026",
    image: "assets/images/article-finance-leverage.webp",
    excerpt:
      "Ba nguyên tắc giúp kiểm soát khoản vay, dòng tiền trả nợ và kịch bản lãi suất thả nổi.",
    link: "don-bay-tai-chinh-mua-can-ho.html"
  },
  {
    slug: "smart-home-song-xanh",
    title: "Xu hướng Smart Home và tiêu chuẩn sống xanh trong các dự án căn hộ mới.",
    category: "lifestyle",
    label: "Phong cách sống & Công nghệ",
    date: "18.04.2026",
    image: "assets/images/article-smart-home.webp",
    excerpt:
      "Đánh giá thực tế các tiện ích công nghệ mang lại giá trị gia tăng lâu dài cho tài sản của bạn.",
    link: "smart-home-song-xanh.html"
  }
];

const projects = [
  {
    slug: "the-emerald-boulevard",
    name: "The Emerald Boulevard",
    location: "Thuận An, Bình Dương",
    image: "assets/images/the-emerald-boulevard.webp",
    description:
      "Căn hộ cao cấp mặt tiền đại lộ, ứng dụng công nghệ Smart Home Samsung hiện đại.",
    stats: ["Mặt tiền Quốc lộ 13", "Căn hộ 1-3 phòng ngủ", "Khai thác thuê tốt", "Pháp lý minh bạch"],
    link: "https://emeraldboulevard.io.vn"
  },
  {
    slug: "the-emerald-garden-view",
    name: "The Emerald Garden View",
    location: "Thuận An, Bình Dương",
    image: "assets/images/the-emerald-garden-view.webp",
    description:
      "Tổ hợp căn hộ hướng đến nhóm khách hàng cần kết nối nhanh về TP.HCM và tiện ích sống hoàn chỉnh.",
    stats: ["Mặt tiền Quốc lộ 13", "Căn hộ 1-3 phòng ngủ", "Khai thác thuê tốt", "Pháp lý minh bạch"],
    link: "https://theemerald.io.vn"
  },
  {
    slug: "astral-city",
    name: "Astral City",
    location: "Thuận An, Bình Dương",
    image: "assets/images/astral-city.webp",
    description:
      "Dự án căn hộ quy mô lớn tại trục thương mại sầm uất, phù hợp khách hàng tìm sản phẩm đô thị cửa ngõ.",
    stats: ["Trục Quốc lộ 13", "Tiện ích nội khu lớn", "Thanh toán linh hoạt", "Kết nối TP.HCM"],
    link: "project-detail.html?project=astral-city"
  }
];

const articleGrid = document.querySelector("#articleGrid");
const projectGrid = document.querySelector("#projectGrid");
const filterButtons = document.querySelectorAll(".filter");
const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector(".main-nav");
const leadForm = document.querySelector("#leadForm");
const formNote = document.querySelector("#formNote");

function renderArticles(category = "all") {
  const visibleArticles =
    category === "all" ? articles : articles.filter((article) => article.category === category);

  articleGrid.innerHTML = visibleArticles
    .map(
      (article) => `
        <article class="article-card">
          <a class="card-image-link" href="${article.link}" aria-label="Đọc ${article.title}">
            <img class="card-image" src="${article.image}" alt="${article.title}" loading="lazy">
          </a>
          <div class="article-body">
            <div class="article-meta">
              <span class="tag">${article.label}</span>
              <span>${article.date}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.excerpt}</p>
            <a class="card-link" href="${article.link}">Đọc phân tích</a>
          </div>
        </article>
      `
    )
    .join("");
}

function renderProjects() {
  projectGrid.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card">
          <a class="project-image-link" href="${project.link}" aria-label="Xem ${project.name}">
            <img class="project-image" src="${project.image}" alt="${project.name}" loading="lazy">
          </a>
          <div class="project-body">
            <div class="project-meta">
              <span class="tag">${project.location}</span>
            </div>
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <div class="project-stats">
              ${project.stats.map((item) => `<span>${item}</span>`).join("")}
            </div>
            <a class="card-link" href="${project.link}">Tìm hiểu chi tiết</a>
          </div>
        </article>
      `
    )
    .join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderArticles(button.dataset.filter);
  });
});

menuButton.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mainNav.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
});

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formNote.textContent = "Cảm ơn bạn, tôi sẽ liên hệ lại trong vòng 30 phút để hỗ trợ.";
  leadForm.reset();
});

renderArticles();
renderProjects();
