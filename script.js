const articles = [
  {
    slug: "phap-ly-opal-luxury-can-kiem-tra-gi",
    title: "Pháp lý Opal Luxury cần kiểm tra gì trước khi đặt chỗ?",
    category: "guide",
    label: "Hướng dẫn",
    date: "02.05.2026",
    image: "assets/images/opal-luxury-masterplan.webp",
    excerpt:
      "Checklist 1/500, tiền sử dụng đất, điều kiện mở bán và bảo lãnh ngân hàng cần kiểm chứng trước khi giữ chỗ Opal Luxury.",
    link: "phap-ly-opal-luxury-can-kiem-tra-gi.html"
  },
  {
    slug: "opal-luxury-so-voi-can-ho-tp-thu-duc",
    title: "Opal Luxury so với căn hộ TP.Thủ Đức: nên chọn bên nào?",
    category: "market",
    label: "Thị trường",
    date: "02.05.2026",
    image: "assets/images/opal-luxury-location.webp",
    excerpt:
      "So sánh Opal Luxury Dĩ An và căn hộ TP.Thủ Đức theo vị trí, giá vào, pháp lý, dòng tiền thuê và khả năng nắm giữ.",
    link: "opal-luxury-so-voi-can-ho-tp-thu-duc.html"
  },
  {
    slug: "dong-tien-cho-thue-can-ho-di-an",
    title: "Dòng tiền cho thuê căn hộ Dĩ An: nhìn gì trước khi mua?",
    category: "finance",
    label: "Tài chính",
    date: "02.05.2026",
    image: "assets/images/article-finance-2-5-ty.webp",
    excerpt:
      "Cách kiểm tra lợi suất thuê căn hộ Dĩ An, tệp khách thuê quanh Sóng Thần và bảng dòng tiền cần lập trước khi đầu tư.",
    link: "dong-tien-cho-thue-can-ho-di-an.html"
  },
  {
    slug: "bang-gia-can-ho-di-an-2026",
    title: "Bảng giá căn hộ Dĩ An 2026: đọc thế nào để không mua sai?",
    category: "market",
    label: "Thị trường",
    date: "02.05.2026",
    image: "assets/images/article-market-binh-duong.webp",
    excerpt:
      "Cách bóc tách giá/m², tổng giá trị căn, chiết khấu, lãi vay và tổng chi phí sở hữu khi xem bảng giá căn hộ Dĩ An.",
    link: "bang-gia-can-ho-di-an-2026.html"
  },
  {
    slug: "co-nen-mua-can-ho-gan-song-than",
    title: "Có nên mua căn hộ gần Sóng Thần, Dĩ An?",
    category: "market",
    label: "Thị trường",
    date: "02.05.2026",
    image: "assets/images/opal-luxury-location.webp",
    excerpt:
      "Phân tích nhu cầu thuê, rủi ro vị trí, môi trường sống và cách đánh giá căn hộ gần Sóng Thần như Opal Luxury.",
    link: "co-nen-mua-can-ho-gan-song-than.html"
  },
  {
    slug: "danh-gia-thi-truong-can-ho-thuan-an-2026",
    title: "Thị trường căn hộ Thuận An 2026: đâu là điểm rơi lợi nhuận cho nhà đầu tư?",
    category: "market",
    label: "Thị trường",
    date: "02.05.2026",
    image: "assets/images/article-thuan-an-2026.webp",
    excerpt:
      "Góc nhìn toàn diện về hạ tầng, mặt bằng giá, dòng tiền cho thuê và vùng an toàn tài chính khi đầu tư căn hộ Thuận An.",
    link: "danh-gia-thi-truong-can-ho-thuan-an-2026.html"
  },
  {
    slug: "can-ho-thuan-an-2025-dong-tien-cua-ngo",
    title: "Căn hộ Thuận An 2025: vì sao dòng tiền dịch chuyển về khu vực cửa ngõ?",
    category: "market",
    label: "Thị trường",
    date: "02.05.2026",
    image: "assets/images/article-thuan-an-2025.webp",
    excerpt:
      "Phân tích lực kéo từ hạ tầng, khoảng chênh giá với TP.HCM và nhu cầu ở thật đang nâng vị thế Thuận An.",
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
      "Bảy điểm pháp lý, tài chính và vận hành cần rà soát để bảo vệ dòng tiền trước khi ký hợp đồng mua căn hộ.",
    link: "checklist-7-diem-hop-dong-mua-can-ho.html"
  },
  {
    slug: "mua-can-ho-2-5-ty-von-700-trieu",
    title: "Mua căn hộ 2,5 tỷ với vốn tự có 700 triệu: bài toán dòng tiền cần biết",
    category: "finance",
    label: "Tài chính",
    date: "02.05.2026",
    image: "assets/images/article-finance-2-5-ty.webp",
    excerpt:
      "Mô phỏng khoản vay, ngưỡng thu nhập an toàn và kịch bản lãi suất thả nổi trước khi xuống tiền.",
    link: "mua-can-ho-2-5-ty-von-700-trieu.html"
  },
  {
    slug: "smart-home-can-ho-binh-duong-thuc-te",
    title: "Smart Home ở căn hộ Bình Dương: giá trị thật hay chỉ là điểm nhấn marketing?",
    category: "lifestyle",
    label: "Sống xanh & Công nghệ",
    date: "02.05.2026",
    image: "assets/images/article-smart-home-binh-duong.webp",
    excerpt:
      "Phân loại các cấp độ smart home và những câu hỏi người mua cần đặt ra trước khi tin vào phần trình diễn nhà mẫu.",
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
      "Theo dõi nguồn cung, tỷ lệ hấp thụ, tiến độ hạ tầng và lợi suất cho thuê để nhận diện giá trị thực.",
    link: "thi-truong-can-ho-binh-duong.html"
  },
  {
    slug: "checklist-phap-ly-can-ho-so-cap",
    title: "Checklist pháp lý cần kiểm tra trước khi đặt cọc căn hộ sơ cấp",
    category: "guide",
    label: "Hướng dẫn",
    date: "28.04.2026",
    image: "assets/images/article-legal-checklist.webp",
    excerpt:
      "Các hồ sơ nền tảng cần đối chiếu: quy hoạch 1/500, giấy phép xây dựng, điều kiện mở bán và bảo lãnh ngân hàng.",
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
      "Ba nguyên tắc giúp kiểm soát khoản vay, dòng tiền trả nợ và rủi ro lãi suất sau giai đoạn ưu đãi.",
    link: "don-bay-tai-chinh-mua-can-ho.html"
  },
  {
    slug: "smart-home-song-xanh",
    title: "Smart Home và sống xanh: tiêu chuẩn mới trong các dự án căn hộ hiện đại",
    category: "lifestyle",
    label: "Phong cách sống & Công nghệ",
    date: "18.04.2026",
    image: "assets/images/article-smart-home.webp",
    excerpt:
      "Đánh giá những tiện ích công nghệ và tiêu chuẩn sống xanh có khả năng tạo giá trị gia tăng dài hạn cho tài sản.",
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
      "Khu căn hộ cao cấp thuộc hệ sinh thái Đất Xanh, quy mô khoảng 8,68 ha, định vị như một tổ hợp sống resort tại cửa ngõ TP.HCM.",
    stats: ["8,68 ha", "11 block căn hộ", "45+ tiện ích", "Kiểm định pháp lý"],
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
      "Căn hộ cao cấp trên trục Quốc lộ 13, nổi bật với chuẩn bàn giao hiện đại và lợi thế khai thác thuê tại Thuận An.",
    stats: ["Mặt tiền Quốc lộ 13", "Căn hộ 1-3PN", "Tệp thuê chuyên gia", "Pháp lý cần đối chiếu"],
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
      "Tổ hợp căn hộ phù hợp khách hàng cần kết nối nhanh về TP.HCM, đồng thời ưu tiên môi trường sống hoàn chỉnh tại Thuận An.",
    stats: ["Trục Quốc lộ 13", "Căn hộ 1-3PN", "Nhu cầu ở thật", "Khai thác thuê"],
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
      "Căn hộ cao cấp chuẩn B+ tại trung tâm Lái Thiêu, nổi bật với địa thế ba mặt hướng thủy và hệ tiện ích tầng cao.",
    stats: ["2 tháp 40 tầng", "946 căn hộ + shophouse", "Dự kiến Q2/2026", "Liên hệ bảng giá"],
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
      "Căn hộ cao cấp mặt tiền Quốc lộ 13, phù hợp người mua lần đầu và nhà đầu tư cần lịch thanh toán dễ kiểm soát.",
    stats: ["659 căn hộ", "Từ 36,8 triệu/m²", "Dự kiến Q3/2027", "MB Bank bảo trợ"],
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
      "Dự án căn hộ quy mô lớn trên trục thương mại Thuận An, phù hợp khách hàng tìm sản phẩm đô thị cửa ngõ có hệ tiện ích đồng bộ.",
    stats: ["Trục Quốc lộ 13", "Tiện ích quy mô lớn", "Lịch thanh toán linh hoạt", "Kết nối TP.HCM"],
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
            <span class="card-link">Xem góc nhìn chi tiết</span>
          </div>
        </a>
      `
    )
    .join("")
    : emptyState("Chưa tìm thấy bài phù hợp", "Hãy thử đổi từ khóa, khu vực hoặc nhóm chủ đề bạn muốn nghiên cứu.");

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
            <span class="card-link">Xem phân tích dự án</span>
          </div>
        </a>
      `
    )
    .join("")
    : emptyState("Chưa tìm thấy dự án phù hợp", "Hãy thử mở rộng khu vực, loại hình hoặc gửi nhu cầu để KINGMANS lọc danh mục riêng cho bạn.");

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
  formNote.textContent = "KINGMANS đang tiếp nhận thông tin. Tôi sẽ phản hồi lại trong thời gian sớm nhất.";
});

renderArticles();
renderProjects();
