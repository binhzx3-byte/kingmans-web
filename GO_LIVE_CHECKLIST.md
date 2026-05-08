# KINGMANS Realty Go-Live Checklist

Domain chính: `https://kingmansrealty.com`

## Cloudflare Pages

1. Tạo project Cloudflare Pages từ repository.
2. Build command: để trống nếu deploy static trực tiếp.
3. Output directory: `.`
4. Custom domain: thêm `kingmansrealty.com`.
5. Thêm thêm `www.kingmansrealty.com` nếu muốn giữ bản www, sau đó redirect về non-www.
6. Bật HTTPS mặc định của Cloudflare.
7. Nếu dùng `www`, tạo Redirect Rule trong Cloudflare:
   - When incoming requests match: hostname equals `www.kingmansrealty.com`
   - Then URL redirect: `https://kingmansrealty.com/${uri.path}`
   - Status code: `301`

## DNS

Nếu domain quản lý trong Cloudflare:

- `kingmansrealty.com` trỏ vào Cloudflare Pages project.
- `www.kingmansrealty.com` trỏ vào Cloudflare Pages project hoặc CNAME theo hướng dẫn trong dashboard.

## SEO Sau Khi Deploy

1. Mở `https://kingmansrealty.com/robots.txt` và kiểm tra sitemap.
2. Mở `https://kingmansrealty.com/sitemap.xml`.
3. Tạo Google Search Console property cho `kingmansrealty.com`.
4. Submit sitemap: `https://kingmansrealty.com/sitemap.xml`.
5. Dùng URL Inspection request index cho:
   - `https://kingmansrealty.com/`
   - `https://kingmansrealty.com/opal-luxury.html`
   - Các bài phân tích chính.

## Đo Lường & Lead Form

1. Tạo Google Analytics 4 property và lấy Measurement ID dạng `G-XXXXXXXXXX`.
2. Nếu chạy quảng cáo Facebook, tạo Meta Pixel và lấy Pixel ID dạng số.
3. Điền ID vào `tracking-config.js`.
4. Website hiển thị `contact@kingmansrealty.com`; form hiện vẫn gửi lead về Gmail qua FormSubmit để tránh gián đoạn nhận khách.
5. Lần submit đầu tiên, FormSubmit sẽ gửi email xác nhận. Mở email và bấm xác nhận để kích hoạt nhận lead.
6. Test form ở:
   - `https://kingmansrealty.com/#contact`
   - `https://kingmansrealty.com/opal-luxury.html#contact-opal`

## Theo Dõi 30 Ngày Đầu

- Kiểm tra Coverage/Indexing trong Search Console mỗi tuần.
- Ghi lại các query có impression nhưng CTR thấp để sửa title/meta.
- Đăng đều 2 bài phân tích mỗi tuần và liên kết nội bộ về landing page dự án.
