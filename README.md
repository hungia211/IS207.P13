# Laravel 11 - Web Bán Hoa

Dự án Laravel 11 cho website bán hoa, gồm API Laravel/Sanctum, các trang HTML/CSS/JS trong `public`, và database MySQL `QuanLyWebBanHoa`.

## Chạy Bằng Docker

Tài liệu cài đặt, backup database, restore khi chuyển máy và troubleshooting nằm tại:

[docs/docker-setup.md](docs/docker-setup.md)

Lệnh nhanh:

```powershell
Copy-Item .env.docker.example .env
docker compose build
docker compose up -d
docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan optimize:clear
```

Mở ứng dụng tại:

```text
http://localhost:8000
```

API test nhanh:

```text
http://localhost:8000/api/product/view
```

## Lưu Ý Database

Không xóa máy ảo, container, hoặc volume cũ trước khi backup database `QuanLyWebBanHoa`. Migration hiện tại không tạo đủ các bảng nghiệp vụ của dự án, vì vậy cần backup/restore file `.sql` theo hướng dẫn trong `docs/docker-setup.md`.
