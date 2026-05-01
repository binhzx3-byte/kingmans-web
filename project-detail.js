const projectDetails = {
  "the-emerald-boulevard": {
    name: "The Emerald Boulevard",
    location: "Thuận An, Bình Dương",
    image: "assets/images/the-emerald-boulevard.webp",
    description:
      "Căn hộ cao cấp mặt tiền đại lộ, ứng dụng công nghệ Smart Home Samsung hiện đại.",
    overview:
      "The Emerald Boulevard phù hợp với khách hàng tìm sản phẩm căn hộ tại khu vực cửa ngõ, ưu tiên khả năng kết nối, tiêu chuẩn vận hành hiện đại và phương án tài chính rõ ràng. Trước khi quyết định, KINGMANS tập trung kiểm tra tiến độ, pháp lý, lịch thanh toán và mức giá so sánh trong cùng khu vực.",
    stats: ["30% vốn tự có", "Hỗ trợ 0% lãi suất", "Bàn giao 2026", "Sổ hồng lâu dài"],
    points: [
      {
        title: "Vị trí cửa ngõ",
        text: "Kết nối nhanh với các trục giao thông chính giữa Bình Dương và TP.HCM."
      },
      {
        title: "Công nghệ sống",
        text: "Smart Home là điểm cộng cần đánh giá cùng chất lượng bàn giao và chi phí vận hành."
      },
      {
        title: "Dòng tiền",
        text: "Phù hợp nhóm khách hàng muốn chia nhỏ tiến độ thanh toán và kiểm soát áp lực vay."
      },
      {
        title: "Khả năng thanh khoản",
        text: "Cần so sánh với mặt bằng giá căn hộ lân cận và nhu cầu thuê thực tế."
      }
    ]
  },
  "the-emerald-garden-view": {
    name: "The Emerald Garden View",
    location: "Thuận An, Bình Dương",
    image: "assets/images/the-emerald-garden-view.webp",
    description:
      "Tổ hợp căn hộ hướng đến nhóm khách hàng cần kết nối nhanh về TP.HCM và tiện ích sống hoàn chỉnh.",
    overview:
      "The Emerald Garden View được đặt trong nhóm dự án nên xem xét khi khách hàng ưu tiên vị trí thuận tiện, quy mô tiện ích và khả năng khai thác cho thuê. Phân tích cần đi cùng pháp lý, giá bán theo từng loại căn và chi phí giữ tài sản trong trung hạn.",
    stats: ["Mặt tiền Quốc lộ 13", "Căn hộ 1-3 phòng ngủ", "Khai thác thuê tốt", "Pháp lý minh bạch"],
    points: [
      {
        title: "Kết nối vùng",
        text: "Lợi thế chính nằm ở khả năng di chuyển giữa Thuận An, TP.HCM và các khu công nghiệp."
      },
      {
        title: "Nhu cầu ở thật",
        text: "Tệp khách hàng chuyên gia và gia đình trẻ tạo nền thanh khoản đáng chú ý."
      },
      {
        title: "Cơ cấu căn hộ",
        text: "Cần chọn diện tích phù hợp với ngân sách, mục tiêu ở hay khai thác thuê."
      },
      {
        title: "Chi phí sở hữu",
        text: "Nên bóc tách phí quản lý, nội thất, lãi vay và thời gian trống phòng."
      }
    ]
  },
  "astral-city": {
    name: "Astral City",
    location: "Thuận An, Bình Dương",
    image: "assets/images/astral-city.webp",
    description:
      "Dự án căn hộ quy mô lớn tại trục thương mại sầm uất, phù hợp khách hàng tìm sản phẩm đô thị cửa ngõ.",
    overview:
      "Astral City là lựa chọn đáng theo dõi cho khách hàng quan tâm sản phẩm căn hộ trong khu đô thị quy mô lớn. Khi tư vấn, KINGMANS sẽ ưu tiên kiểm tra tiến độ thực tế, phương án tài chính, tiện ích vận hành và biên độ giá so với các dự án đã bàn giao gần đó.",
    stats: ["Trục Quốc lộ 13", "Tiện ích nội khu lớn", "Thanh toán linh hoạt", "Kết nối TP.HCM"],
    points: [
      {
        title: "Quy mô dự án",
        text: "Quy mô lớn giúp tạo hệ tiện ích phong phú nhưng cần theo dõi tiến độ từng giai đoạn."
      },
      {
        title: "Tiềm năng khai thác",
        text: "Vị trí thương mại phù hợp nhu cầu thuê nếu sản phẩm có mức giá và diện tích hợp lý."
      },
      {
        title: "Kế hoạch vốn",
        text: "Khách hàng nên chuẩn bị kịch bản lãi suất và dòng tiền trả nợ trong ít nhất 24 tháng."
      },
      {
        title: "So sánh khu vực",
        text: "Giá trị thực cần được đối chiếu với dự án đã bàn giao, tỷ lệ lấp đầy và mức thuê."
      }
    ]
  }
};

const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector(".main-nav");
const params = new URLSearchParams(window.location.search);
const slug = params.get("project") || "the-emerald-boulevard";
const project = projectDetails[slug] || projectDetails["the-emerald-boulevard"];
const projectUrl = seoAbsoluteUrl(`/project-detail.html?project=${slug}`);
const projectImageUrl = seoAbsoluteUrl(project.image);

document.title = `${project.name} | KINGMANS`;
setSeoMeta('meta[name="description"]', project.description);
setSeoLink("#canonicalLink", projectUrl);
setSeoMeta("#ogTitle", `${project.name} | KINGMANS`);
setSeoMeta("#ogDescription", project.description);
setSeoMeta("#ogUrl", projectUrl);
setSeoMeta("#ogImage", projectImageUrl);
setSeoMeta("#ogImageAlt", project.name);
setSeoMeta("#twitterTitle", `${project.name} | KINGMANS`);
setSeoMeta("#twitterDescription", project.description);
setSeoMeta("#twitterImage", projectImageUrl);
document.querySelector("#detailHero").style.setProperty("--detail-image", `url("${project.image}")`);
document.querySelector("#projectLocation").textContent = project.location;
document.querySelector("#projectName").textContent = project.name;
document.querySelector("#projectDescription").textContent = project.description;
document.querySelector("#projectOverview").textContent = project.overview;
document.querySelector("#projectStats").innerHTML = project.stats.map((item) => `<span>${item}</span>`).join("");
document.querySelector("#projectPoints").innerHTML = project.points
  .map(
    (point) => `
      <li>
        <strong>${point.title}</strong>
        <span>${point.text}</span>
      </li>
    `
  )
  .join("");

setJsonLd("projectStructuredData", {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ApartmentComplex",
      "@id": `${projectUrl}#project`,
      "name": project.name,
      "description": project.description,
      "image": projectImageUrl,
      "url": projectUrl,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Thuận An",
        "addressRegion": "Bình Dương",
        "addressCountry": "VN"
      },
      "amenityFeature": project.stats.map((item) => ({
        "@type": "LocationFeatureSpecification",
        "name": item,
        "value": true
      }))
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${projectUrl}#breadcrumbs`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Trang chủ",
          "item": seoAbsoluteUrl("/")
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Dự án",
          "item": seoAbsoluteUrl("/#projects")
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": project.name,
          "item": projectUrl
        }
      ]
    }
  ]
});

menuButton.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mainNav.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
});
