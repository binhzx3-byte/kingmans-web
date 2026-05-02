const articles = [
  {
    slug: "can-ho-thuan-an-2025-dong-tien-cua-ngo",
    title: "Căn hộ Thuận An 2025 - Tại sao dòng tiền đang dồn về khu vực cửa ngõ?",
    category: "market",
    label: "Thị trường",
    date: "02.05.2026",
    image: "assets/images/article-thuan-an-2025.webp",
    excerpt:
      "Thuận An đang hưởng lợi từ hạ tầng, chênh lệch giá với TP.HCM và nhu cầu ở thật tại khu vực cửa ngõ.",
    link: "can-ho-thuan-an-2025-dong-tien-cua-ngo.html"
  },
  {
    slug: "checklist-7-diem-hop-dong-mua-can-ho",
    title: "Checklist 7 điểm cần kiểm tra trước khi ký hợp đồng mua căn hộ",
    category: "guide",
    label: "Hướng dẫn",
    date: "02.05.2026",
    image: "assets/images/article-checklist-hop-dong.webp",
    excerpt:
      "Bảy điểm pháp lý và vận hành cần rà soát trước khi ký hợp đồng để hạn chế rủi ro tài chính.",
    link: "checklist-7-diem-hop-dong-mua-can-ho.html"
  },
  {
    slug: "mua-can-ho-2-5-ty-von-700-trieu",
    title: "Mua căn hộ 2,5 tỷ với vốn tự có 700 triệu - Bài toán dòng tiền thực tế",
    category: "finance",
    label: "Tài chính",
    date: "02.05.2026",
    image: "assets/images/article-finance-2-5-ty.webp",
    excerpt:
      "Mô phỏng khoản vay, thu nhập an toàn và kịch bản lãi suất thả nổi khi mua căn hộ 2,5 tỷ.",
    link: "mua-can-ho-2-5-ty-von-700-trieu.html"
  },
  {
    slug: "smart-home-can-ho-binh-duong-thuc-te",
    title: "Smart Home ở căn hộ Bình Dương - Thực tế hay chỉ là chiêu marketing?",
    category: "lifestyle",
    label: "Sống xanh & Công nghệ",
    date: "02.05.2026",
    image: "assets/images/article-smart-home-binh-duong.webp",
    excerpt:
      "Phân loại 3 mức smart home và những câu hỏi cần đặt ra trước khi tin vào phần trình diễn nhà mẫu.",
    link: "smart-home-can-ho-binh-duong-thuc-te.html"
  },
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
    slug: "opal-luxury",
    name: "Opal Luxury",
    location: "Dĩ An, Bình Dương",
    image: "assets/images/opal-luxury-hero.webp",
    description:
      "Khu căn hộ cao cấp thuộc hệ sinh thái Đất Xanh, quy mô khoảng 8,68 ha với định hướng tiện ích resort tại cửa ngõ TP.HCM.",
    stats: ["8,68 ha", "11 block căn hộ", "45+ tiện ích", "Tư vấn pháp lý"],
    areas: ["binh-duong", "di-an"],
    types: ["can-ho", "hang-sang", "dau-tu"],
    link: "opal-luxury.html"
  },
  {
    slug: "the-emerald-boulevard",
    name: "The Emerald Boulevard",
    location: "Thuận An, Bình Dương",
    image: "assets/images/the-emerald-boulevard.webp",
    description:
      "Căn hộ cao cấp mặt tiền đại lộ, ứng dụng công nghệ Smart Home Samsung hiện đại.",
    stats: ["Mặt tiền Quốc lộ 13", "Căn hộ 1-3 phòng ngủ", "Khai thác thuê tốt", "Pháp lý minh bạch"],
    areas: ["binh-duong", "thuan-an"],
    types: ["can-ho", "hang-sang", "dau-tu"],
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
    areas: ["binh-duong", "thuan-an"],
    types: ["can-ho", "dau-tu"],
    link: "https://theemerald.io.vn"
  },
  {
    slug: "at-sky-garden",
    name: "A&T Sky Garden",
    location: "Lái Thiêu, Thuận An",
    image: "assets/images/at-sky-garden.webp",
    description:
      "Căn hộ cao cấp chuẩn B+ tại 54C Cách Mạng Tháng Tám, nổi bật với địa thế 3 mặt hướng thủy.",
    stats: ["2 tháp 40 tầng", "946 căn hộ + 17 shophouse", "Bàn giao Q2/2026", "Liên hệ bảng giá"],
    areas: ["binh-duong", "thuan-an"],
    types: ["can-ho", "hang-sang"],
    link: "project-detail.html?project=at-sky-garden"
  },
  {
    slug: "symlife",
    name: "Symlife - Symphony of Life",
    location: "Vĩnh Phú, Thuận An",
    image: "assets/images/symlife.webp",
    description:
      "Căn hộ cao cấp mặt tiền Quốc lộ 13, hướng đến người mua lần đầu với phương án thanh toán linh hoạt.",
    stats: ["659 căn hộ", "Từ 36,8 triệu/m²", "Bàn giao Q3/2027", "MB Bank bảo trợ"],
    areas: ["binh-duong", "thuan-an"],
    types: ["can-ho", "dau-tu"],
    link: "project-detail.html?project=symlife"
  },
  {
    slug: "astral-city",
    name: "Astral City",
    location: "Thuận An, Bình Dương",
    image: "assets/images/astral-city.webp",
    description:
      "Dự án căn hộ quy mô lớn tại trục thương mại sầm uất, phù hợp khách hàng tìm sản phẩm đô thị cửa ngõ.",
    stats: ["Trục Quốc lộ 13", "Tiện ích nội khu lớn", "Thanh toán linh hoạt", "Kết nối TP.HCM"],
    areas: ["binh-duong", "thuan-an"],
    types: ["can-ho", "dau-tu"],
    link: "project-detail.html?project=astral-city"
  }
];

const articleGrid = document.querySelector("#articleGrid");
const projectGrid = document.querySelector("#projectGrid");
const filterButtons = document.querySelectorAll(".filter");
const articleSearch = document.querySelector("#articleSearch");
const articleSort = document.querySelector("#articleSort");
const articleResultCount = document.querySelector("#articleResultCount");
const articleLoadMore = document.querySelector("#articleLoadMore");
const projectSearch = document.querySelector("#projectSearch");
const projectArea = document.querySelector("#projectArea");
const projectType = document.querySelector("#projectType");
const projectResultCount = document.querySelector("#projectResultCount");
const projectLoadMore = document.querySelector("#projectLoadMore");
const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector(".main-nav");
const leadForm = document.querySelector("#leadForm");
const formNote = document.querySelector("#formNote");

const state = {
  articleCategory: "all",
  articleQuery: "",
  articleSort: "newest",
  articleVisible: 6,
  projectQuery: "",
  projectArea: "all",
  projectType: "all",
  projectVisible: 6
};

const INITIAL_VISIBLE = 6;
const LOAD_MORE_STEP = 6;

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function parseDate(value) {
  const [day, month, year] = value.split(".").map(Number);
  return new Date(year, month - 1, day).getTime();
}

function articleMatchesQuery(article) {
  const query = normalizeText(state.articleQuery.trim());

  if (!query) {
    return true;
  }

  const haystack = normalizeText(`${article.title} ${article.label} ${article.excerpt}`);
  return haystack.includes(query);
}

function getFilteredArticles() {
  const filtered = articles
    .filter((article) => state.articleCategory === "all" || article.category === state.articleCategory)
    .filter(articleMatchesQuery)
    .sort((a, b) => {
      const direction = state.articleSort === "oldest" ? 1 : -1;
      return (parseDate(a.date) - parseDate(b.date)) * direction;
    });

  return filtered;
}

function projectMatches(project) {
  const query = normalizeText(state.projectQuery.trim());
  const matchesQuery =
    !query ||
    normalizeText(`${project.name} ${project.location} ${project.description} ${project.stats.join(" ")}`).includes(
      query
    );
  const matchesArea = state.projectArea === "all" || project.areas.includes(state.projectArea);
  const matchesType = state.projectType === "all" || project.types.includes(state.projectType);

  return matchesQuery && matchesArea && matchesType;
}

function emptyState(label, message) {
  return `
    <div class="empty-state">
      <strong>${label}</strong>
      <span>${message}</span>
    </div>
  `;
}

function renderArticles() {
  const filteredArticles = getFilteredArticles();
  const visibleArticles = filteredArticles.slice(0, state.articleVisible);

  articleGrid.innerHTML = visibleArticles.length
    ? visibleArticles
    .map(
      (article) => `
        <a class="article-card" href="${article.link}" aria-label="Đọc ${article.title}">
          <span class="card-image-link">
            <img class="card-image" src="${article.image}" alt="${article.title}" loading="lazy">
          </span>
          <div class="article-body">
            <div class="article-meta">
              <span class="tag">${article.label}</span>
              <span>${article.date}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.excerpt}</p>
            <span class="card-link">Đọc phân tích</span>
          </div>
        </a>
      `
    )
    .join("")
    : emptyState("Chưa có bài phù hợp", "Thử đổi từ khóa hoặc chọn lại danh mục phân tích.");

  articleResultCount.textContent = `${filteredArticles.length} bài phân tích`;
  articleLoadMore.hidden = filteredArticles.length <= state.articleVisible;
}

function renderProjects() {
  const filteredProjects = projects.filter(projectMatches);
  const visibleProjects = filteredProjects.slice(0, state.projectVisible);

  projectGrid.innerHTML = visibleProjects.length
    ? visibleProjects
    .map(
      (project) => `
        <a class="project-card" href="${project.link}" aria-label="Xem ${project.name}">
          <span class="project-image-link">
            <img class="project-image" src="${project.image}" alt="${project.name}" loading="lazy">
          </span>
          <div class="project-body">
            <div class="project-meta">
              <span class="tag">${project.location}</span>
              <span>${project.types.includes("hang-sang") ? "Hạng sang" : "Căn hộ"}</span>
            </div>
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <div class="project-stats">
              ${project.stats.map((item) => `<span>${item}</span>`).join("")}
            </div>
            <span class="card-link">Tìm hiểu chi tiết</span>
          </div>
        </a>
      `
    )
    .join("")
    : emptyState("Chưa có dự án phù hợp", "Danh mục đã sẵn sàng cho TP.HCM. Bạn chỉ cần thêm dự án mới vào dữ liệu.");

  projectResultCount.textContent = `${filteredProjects.length} dự án`;
  projectLoadMore.hidden = filteredProjects.length <= state.projectVisible;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.articleCategory = button.dataset.filter;
    state.articleVisible = INITIAL_VISIBLE;
    renderArticles();
  });
});

articleSearch.addEventListener("input", (event) => {
  state.articleQuery = event.target.value;
  state.articleVisible = INITIAL_VISIBLE;
  renderArticles();
});

articleSort.addEventListener("change", (event) => {
  state.articleSort = event.target.value;
  renderArticles();
});

articleLoadMore.addEventListener("click", () => {
  state.articleVisible += LOAD_MORE_STEP;
  renderArticles();
});

projectSearch.addEventListener("input", (event) => {
  state.projectQuery = event.target.value;
  state.projectVisible = INITIAL_VISIBLE;
  renderProjects();
});

projectArea.addEventListener("change", (event) => {
  state.projectArea = event.target.value;
  state.projectVisible = INITIAL_VISIBLE;
  renderProjects();
});

projectType.addEventListener("change", (event) => {
  state.projectType = event.target.value;
  state.projectVisible = INITIAL_VISIBLE;
  renderProjects();
});

projectLoadMore.addEventListener("click", () => {
  state.projectVisible += LOAD_MORE_STEP;
  renderProjects();
});

menuButton?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
});

leadForm?.addEventListener("submit", () => {
  formNote.textContent = "Đang gửi thông tin, vui lòng chờ trong giây lát...";
});

renderArticles();
renderProjects();
