use QuanLyWebBanHoa;

CREATE TABLE Roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(100) NOT NULL,
    IsDeleted BOOLEAN NOT NULL DEFAULT 0
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE UserRoles (
    user_id BIGINT UNSIGNED,
    role_id INT,
    IsDeleted BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE Functions (
    function_id INT PRIMARY KEY AUTO_INCREMENT,
    function_name VARCHAR(100) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE Permissions (
    permission_id INT PRIMARY KEY AUTO_INCREMENT,
    function_id INT NOT NULL,                                           -- Thay function_name bằng khóa ngoại
    can_view BOOLEAN NOT NULL DEFAULT 0 CHECK (can_view IN (0, 1)),
    can_add BOOLEAN NOT NULL DEFAULT 0 CHECK (can_add IN (0, 1)),
    can_edit BOOLEAN NOT NULL DEFAULT 0 CHECK (can_edit IN (0, 1)),
    can_delete BOOLEAN NOT NULL DEFAULT 0 CHECK (can_delete IN (0, 1)),
    can_import BOOLEAN NOT NULL DEFAULT 0 CHECK (can_import IN (0, 1)),
    can_export BOOLEAN NOT NULL DEFAULT 0 CHECK (can_export IN (0, 1)),
    is_active BOOLEAN NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),   -- Trạng thái hoạt động
    FOREIGN KEY (function_id) REFERENCES Functions(function_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE RolePermissions (
    role_id INT,
    permission_id INT,
    IsDeleted BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES Roles(role_id),
    FOREIGN KEY (permission_id) REFERENCES Permissions(permission_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO Roles (role_name, IsDeleted)
VALUES
('Admin', 0),       -- 1: Quyền admin sử dụng toàn quyền của hệ thống
('Manager', 0),     -- 2: Quyền của quản lý dưới quyền admin 1 chút
('Employee', 0),    -- 3: Quyền của nhân viên chỉ xem thông tin và sửa một số sản phẩm cơ bản
('Customer', 0);    -- 4: Quyền của khách hàng xem thông tin cá nhân, và đặt hàng được

INSERT INTO UserRoles (user_id, role_id, IsDeleted)
VALUES
(1, 1, 0),
(2, 2, 0),
(3, 4, 0);

INSERT INTO Functions (function_name)
VALUES
-- Phần 1: Màn hình và API liên quan tới khách hàng, tài khoản, mua hàng
('Auth Management'),       -- 1: Đăng ký/Đăng nhập
('Password Management'),   -- 2: Quên mật khẩu/Đổi mật khẩu
('Profile Management'),    -- 3: Quản lý tài khoản
('Product View'),          -- 4: Xem thông tin sản phẩm
('Cart Management'),       -- 5: Giỏ hàng
('Order Management'),      -- 6: Đặt hàng và thanh toán

-- Phần 2: Màn hình và API liên quan tới Admin
('Category Management'),   -- 7: Quản lý danh mục
('Product Management'),    -- 8: Quản lý sản phẩm
('User Management'),       -- 9: Quản lý người dùng
('Admin Order Management'),-- 10: Quản lý đơn hàng (Admin, nhân viên)
('Invoice Management'),    -- 11: Quản lý hóa đơn
('Statistics Management'), -- 12: Quản lý thống kê
('Promotion Management'),  -- 13: Quản lý khuyến mãi
('Policy Management');     -- 14: Quản lý chính sách

INSERT INTO Permissions (function_id, can_view, can_add, can_edit, can_delete, can_import, can_export, is_active)
VALUES
-- Phần 1: Màn hình và API liên quan tới khách hàng, tài khoản, mua hàng
(1, 1, 1, 1, 0, 0, 0, 1), -- Đăng ký/Đăng nhập: Khách hàng có thể đăng ký, đăng nhập
(2, 1, 1, 1, 0, 0, 0, 1), -- Quên mật khẩu/Đổi mật khẩu: Khách hàng có thể thực hiện yêu cầu liên quan đến mật khẩu
(3, 1, 0, 1, 0, 1, 0, 1), -- Quản lý tài khoản: Khách hàng có thể xem và cập nhật thông tin tài khoản
(4, 1, 0, 0, 0, 0, 0, 1), -- Xem thông tin: Sản phẩm
(5, 1, 1, 1, 1, 0, 0, 1), -- Giỏ hàng: Khách hàng có thể xem, thêm, sửa, xóa giỏ hàng
(6, 1, 1, 0, 1, 0, 0, 1), -- Đặt hàng và thanh toán: Khách hàng có thể đặt hàng, xem chi tiết, hủy đơn hàng

-- Phần 2: Màn hình và API liên quan tới Admin
(7, 1, 1, 1, 1, 0, 0, 1), -- Quản lý danh mục: Admin có quyền đầy đủ
(8, 1, 1, 1, 1, 1, 0, 1), -- Quản lý sản phẩm: Admin có quyền đầy đủ
(9, 1, 1, 1, 1, 1, 0, 1), -- Quản lý người dùng: Admin có quyền đầy đủ
(10, 1, 0, 1, 1, 0, 0, 1), -- Quản lý đơn hàng: Admin và Nhân viên có thể xem, cập nhật, xóa đơn hàng
(11, 1, 0, 1, 1, 0, 0, 1), -- Quản lý hóa đơn: Admin và Nhân viên có thể xem, cập nhật, xóa hóa đơn
(12, 1, 0, 0, 0, 0, 1, 1), -- Quản lý thống kê: Chỉ Admin có quyền xem và xuất báo cáo
(13, 1, 1, 1, 1, 0, 0, 1), -- Quản lý khuyến mãi: Admin có quyền đầy đủ
(14, 1, 1, 1, 1, 1, 0, 1); -- Quản lý chính sách: Admin có quyền đầy đủ

/*
permission_id   | function_id   | view  | addnew    | edit  | deleted   | import    | export    | isDeleted
1               | Detail_User   | 1     | 1         | 1     | 1         | 1         | 1         | 0             Quyền này cho màn hình quản lý thông tin người dùng cho phép admin xem, thêm, xóa, sửa thông tin người dùng
2               | Products      | 1     | 1         | 1     | 1         | 1         | 1         | 0             Quyền này cho màn hình quản lý sản phẩm cho phép admin hoặc nhân viên có quyền xem thêm xóa sửa các sản phẩm
*/

INSERT INTO RolePermissions (role_id, permission_id, IsDeleted)
VALUES
(1, 1, 0),
(1, 2, 0),
(1, 3, 0),
(1, 4, 0),
(1, 5, 0),
(1, 6, 0),
(1, 7, 0),
(1, 8, 0),
(1, 9, 0),
(1, 10, 0),
(1, 11, 0),
(1, 12, 0),
(1, 13, 0),
(1, 14, 0);

INSERT INTO RolePermissions (role_id, permission_id, IsDeleted)
VALUES
(2, 6, 0),
(2, 7, 0),
(2, 8, 0),
(2, 9, 0),
(2, 10, 0),
(2, 11, 0),
(2, 12, 0),
(2, 13, 0),
(2, 14, 0);

INSERT INTO RolePermissions (role_id, permission_id, IsDeleted)
VALUES
(3, 8, 0),
(3, 10, 0),
(3, 11, 0);

INSERT INTO RolePermissions (role_id, permission_id, IsDeleted)
VALUES
(4, 1, 0),
(4, 2, 0),
(4, 3, 0),
(4, 4, 0),
(4, 5, 0),
(4, 6, 0);

SELECT p.can_view, p.can_add, p.can_edit, p.can_delete, p.can_import, p.can_export
FROM Permissions p
    JOIN Functions f ON p.function_id = f.function_id
    JOIN RolePermissions rp ON p.permission_id = rp.permission_id
    JOIN Roles r ON rp.role_id = r.role_id
    JOIN UserRoles ur on r.role_id = ur.role_id
WHERE f.function_name = 'Profile Management' AND ur.user_id = 3 AND p.is_active = 1;

