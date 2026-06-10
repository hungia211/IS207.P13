# Hướng Dẫn Docker Và Khôi Phục Dự Án Laravel

Tài liệu này dùng để chạy lại dự án Laravel 11 trên Docker, không cần giữ máy ảo Ubuntu cũ. Dự án dùng PHP 8.3/Apache, MySQL 5.7 và database chính là `QuanLyWebBanHoa`.

> Việc quan trọng nhất trước khi xóa máy ảo, container hoặc dữ liệu cũ là backup database. Migration hiện tại chỉ có các bảng Laravel cơ bản, chưa đủ để tạo lại các bảng nghiệp vụ như `Products`, `Categories`, `Detail_Users`, `Roles`, `Orders`, `Order_Details`.

## 1. Yêu Cầu

- Docker Desktop đã cài và đang chạy.
- Source code dự án nằm trong một thư mục bình thường trên Windows/macOS/Linux.
- Port mặc định:
  - Web: `http://localhost:8000`
  - MySQL: `localhost:3306`
- Database trong container:
  - Host nội bộ Docker: `db`
  - Database: `QuanLyWebBanHoa`
  - User local: `root`
  - Password local: `root`

Nếu máy đang có MySQL khác dùng port `3306`, xem mục Troubleshooting để đổi port.

## 2. Chạy Dự Án Trên Docker

Từ thư mục gốc dự án, tạo file `.env` cho Docker:

```powershell
Copy-Item .env.docker.example .env
```

Nếu đã có `.env`, hãy sửa các dòng database về đúng Docker:

```dotenv
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=QuanLyWebBanHoa
DB_USERNAME=root
DB_PASSWORD=root
```

Build và chạy container:

```powershell
docker compose build
docker compose up -d
```

Cài dependency PHP nếu thư mục `vendor` chưa có hoặc khi chuyển sang máy mới:

```powershell
docker compose exec app composer install
```

Tạo app key nếu `.env` mới copy từ `.env.docker.example`:

```powershell
docker compose exec app php artisan key:generate
```

Clear cache cấu hình Laravel:

```powershell
docker compose exec app php artisan optimize:clear
```

Mở dự án:

```text
http://localhost:8000
```

Thử API sản phẩm:

```text
http://localhost:8000/api/product/view
```

## 3. Backup Database Trước Khi Xóa Máy Ảo Hoặc Chuyển Máy

Nếu container `laravel_db` còn tồn tại trên máy hiện tại, chạy:

```powershell
New-Item -ItemType Directory -Force backups | Out-Null
docker start laravel_db
docker exec laravel_db sh -c 'mysqldump -uroot -proot --databases QuanLyWebBanHoa --routines --triggers --single-transaction' > backups\QuanLyWebBanHoa.sql
```

Nếu đang dùng compose mới:

```powershell
New-Item -ItemType Directory -Force backups | Out-Null
docker compose up -d db
docker compose exec -T db sh -c 'mysqldump -uroot -proot --databases QuanLyWebBanHoa --routines --triggers --single-transaction' > backups\QuanLyWebBanHoa.sql
```

Kiểm tra file backup:

```powershell
Get-Item backups\QuanLyWebBanHoa.sql
Select-String -Path backups\QuanLyWebBanHoa.sql -Pattern "CREATE TABLE"
```

Không nên commit file `.sql` vì file này có thể chứa dữ liệu khách hàng, đơn hàng, tài khoản và token.

## 4. Khôi Phục Database Trên Máy Mới

Copy source code và file backup `QuanLyWebBanHoa.sql` sang máy mới. Sau đó chạy:

```powershell
Copy-Item .env.docker.example .env
docker compose build
docker compose up -d
docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan optimize:clear
```

Restore database:

```powershell
Get-Content backups\QuanLyWebBanHoa.sql | docker compose exec -T db mysql -uroot -proot
```

Kiểm tra danh sách bảng:

```powershell
docker compose exec db mysql -uroot -proot -e "SHOW TABLES FROM QuanLyWebBanHoa;"
```

Cần thấy các bảng như `Products`, `Categories`, `Detail_Users`, `Roles`, `Orders`, `Order_Details`, `users`, `sessions`, `personal_access_tokens`.

## 5. Lệnh Kiểm Tra Và Vận Hành Hằng Ngày

Kiểm tra Docker Compose hợp lệ:

```powershell
docker compose config
```

Xem container:

```powershell
docker compose ps
```

Xem log Laravel/Apache:

```powershell
docker compose logs -f app
```

Xem log MySQL:

```powershell
docker compose logs -f db
```

Chạy lệnh Artisan:

```powershell
docker compose exec app php artisan route:list
docker compose exec app php artisan migrate:status
docker compose exec app php artisan --version
```

Dừng dự án nhưng giữ database:

```powershell
docker compose down
```

Xóa cả container và volume database local:

```powershell
docker compose down -v
```

Chỉ dùng `down -v` khi đã backup database.

## 6. Các URL Và IP Cũ Cần Tránh

Trong source hiện còn một số IP/domain cũ từng dùng khi chạy qua máy ảo hoặc máy khác:

- `172.20.10.3`
- `26.73.94.5`
- `192.168.0.105`
- `10.0.50.8`
- `your-laravel-app.com`
- `your-laravel-app.test`

Khi chạy Docker local:

- Database trong `.env` phải dùng `DB_HOST=db`, không dùng IP máy ảo.
- Trình duyệt gọi API qua `http://localhost:8000`.
- Một số file HTML/JS trong `public/CustomerPage` và `public/AdminPage` có hard-code `serverIp`; nếu login/API không chạy, đổi các giá trị này về `localhost` hoặc refactor về một biến cấu hình chung.

## 7. Troubleshooting

### Lỗi kết nối database

Kiểm tra `.env`:

```dotenv
DB_HOST=db
DB_DATABASE=QuanLyWebBanHoa
DB_USERNAME=root
DB_PASSWORD=root
```

Sau khi sửa `.env`, chạy:

```powershell
docker compose exec app php artisan optimize:clear
```

### Port 8000 bị chiếm

Sửa `docker-compose.yml`:

```yaml
ports:
  - "8080:80"
```

Sau đó truy cập `http://localhost:8080` và sửa `APP_URL=http://localhost:8080`.

### Port 3306 bị chiếm

Nếu máy có MySQL local, sửa port bên ngoài trong `docker-compose.yml`:

```yaml
ports:
  - "3307:3306"
```

Không đổi `DB_PORT` trong `.env` của Laravel, vì app nội bộ Docker vẫn kết nối tới service `db:3306`.

### Thiếu vendor hoặc lỗi class not found

```powershell
docker compose exec app composer install
docker compose exec app php artisan optimize:clear
```

### Lỗi storage/cache permission

```powershell
docker compose exec app chmod -R 775 storage bootstrap/cache
docker compose exec app php artisan optimize:clear
```

### Database trong volume cũ không khớp mật khẩu mới

MySQL chỉ đọc `MYSQL_ROOT_PASSWORD` khi khởi tạo volume lần đầu. Nếu volume `laravel-11x_dbdata` đã có sẵn từ trước, mật khẩu root là mật khẩu lúc tạo volume cũ. Hãy thử mật khẩu cũ, hoặc backup/restore sang volume mới.

### Báo lỗi container name already in use

Máy hiện tại có thể còn container cũ tên `laravel_app` hoặc `laravel_db`. Nếu `docker compose up -d` báo trùng tên container, backup database trước, sau đó xóa container cũ:

```powershell
docker stop laravel_app laravel_db
docker rm laravel_app laravel_db
docker compose up -d
```

Lệnh trên chỉ xóa container, không xóa volume `laravel-11x_dbdata`. Không chạy `docker volume rm laravel-11x_dbdata` nếu chưa backup database.

## 8. Ghi Chú Về Volume Cũ

Compose này đặt tên volume cố định:

```yaml
volumes:
  dbdata:
    name: laravel-11x_dbdata
```

Nếu trên máy hiện tại đã có volume `laravel-11x_dbdata`, Docker sẽ dùng lại database cũ. Khi chuyển máy, volume không tự đi theo source code, nên cần file backup `backups/QuanLyWebBanHoa.sql` để restore.
