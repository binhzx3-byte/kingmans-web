# Website KINGMANS

Đây là bản web tĩnh cho thương hiệu cá nhân bất động sản KINGMANS.

## Cách mở

Mở file `index.html` trực tiếp trong trình duyệt. Hai dự án Emerald hiện dẫn thẳng tới landing page chính thức:

- The Emerald Boulevard: `https://emeraldboulevard.io.vn`
- The Emerald Garden View: `https://theemerald.io.vn`

## Nền móng domain thật

- Domain chính: `https://kingmansrealty.com`.
- Sitemap: `https://kingmansrealty.com/sitemap.xml`.
- Robots: `https://kingmansrealty.com/robots.txt`.
- Checklist deploy Cloudflare Pages: `GO_LIVE_CHECKLIST.md`.
- Cấu hình cache/header cho Cloudflare: `_headers`.
- Redirect `www` về non-www nên làm trong Cloudflare Rules sau khi gắn domain.
- Cấu hình đo lường: điền GA4/Meta Pixel trong `tracking-config.js`.
- Website hiển thị `contact@kingmansrealty.com`; form liên hệ vẫn gửi về Gmail qua FormSubmit để tránh gián đoạn lead.

## Chỗ nên thay trước khi dùng thật

- Hotline hiện tại: `0396 460 442`.
- Email hiện tại: `contact@kingmansrealty.com`.
- Facebook hiện tại: `https://www.facebook.com/profile.php?id=61586688100723&locale=vi_VN`.
- Logo thương hiệu: `assets/kingmans-logo.webp`.
- Ảnh The Emerald Boulevard: `assets/images/the-emerald-boulevard.webp`.
- Ảnh The Emerald Garden View: `assets/images/the-emerald-garden-view.webp`.
- Toàn bộ ảnh đang dùng trên web đã được chuyển sang `.webp` và lưu local trong `assets/`.
- Mạng xã hội: thay các link LinkedIn, Facebook, Zalo trong `index.html` và `project-detail.html`.
- Bài viết góc chuyên gia: mảng `articles` trong `script.js`.
- Trang bài viết tĩnh: `thi-truong-can-ho-binh-duong.html`, `checklist-phap-ly-can-ho-so-cap.html`, `don-bay-tai-chinh-mua-can-ho.html`, `smart-home-song-xanh.html`.
- Bản bài viết động cũ: `article-detail.html` đang để `noindex` và chỉ nên dùng làm dự phòng nội bộ.
- Nội dung chi tiết bài viết động: object `articleDetails` trong `article-detail.js`.
- Ảnh bài viết: thay trường `image` trong `script.js` và `article-detail.js`.
- Dự án tiêu biểu: mảng `projects` trong `script.js`.
- Nội dung landing page dự án: object `projectDetails` trong `project-detail.js`.
- Ảnh dự án: thay các đường dẫn ảnh trong `script.js` và `project-detail.js` bằng phối cảnh chính thức.
- Màu thương hiệu: các biến màu trong `:root` của `styles.css`.
- File SEO đã có: `sitemap.xml`, `robots.txt`, meta Open Graph/Twitter và schema JSON-LD.

## Cloudflare CMS (Workers + D1 + R2)

Project da duoc bo sung:

- Worker API: `worker.js`
- D1 schema: `db/schema.sql`
- Admin page: `/admin` (`admin/index.html`, `admin/admin.js`, `admin/admin.css`)
- Public dynamic URLs:
  - Bai viet: `/bai-viet/<slug>`
  - Du an: `/du-an/<slug>`
- Media serve tu R2 qua Worker: `/media/<key>`

### 1) Tao D1 database va lay database_id

```powershell
npx wrangler d1 create kingmans-cms
```

Copy `database_id` tra ve va thay vao file `wrangler.jsonc` (truong `d1_databases[0].database_id`).

### 2) Tao bucket R2

```powershell
npx wrangler r2 bucket create kingmans-media
```

Neu ban muon bucket ten khac, doi lai `r2_buckets[0].bucket_name` trong `wrangler.jsonc`.

### 3) Chay migration schema D1

```powershell
npx wrangler d1 execute kingmans-cms --remote --file db/schema.sql
```

### 4) Set admin secrets

```powershell
npx wrangler secret put ADMIN_USERNAME
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_TOKEN_SECRET
```

Goi y `ADMIN_TOKEN_SECRET`: dung chuoi dai 32+ ky tu.

### 5) Deploy

```powershell
npx wrangler deploy
```

### 6) Dang nhap admin

- URL: `https://kingmansrealty.com/admin`
- Dang bai/du an qua form admin
- Upload anh len R2 trong block "Upload anh (R2)"
- URL anh upload se co dang `/media/uploads/...`

### API nhanh

- Public:
  - `GET /api/articles`
  - `GET /api/articles/<slug>`
  - `GET /api/projects`
  - `GET /api/projects/<slug>`
- Admin (can login cookie):
  - `POST /api/admin/login`
  - `POST /api/admin/logout`
  - `GET /api/admin/session`
  - `GET/POST/PUT/DELETE /api/admin/articles`
  - `GET/POST/PUT/DELETE /api/admin/projects`
  - `POST /api/admin/media`
