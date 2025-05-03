-- Tạo cơ sở dữ liệu
create DATABASE QuanLyWebBanHoa
CHARACTER SET utf8
COLLATE utf8_vietnamese_ci;

-- Sử dụng cơ sở dữ liệu
USE QuanLyWebBanHoa;

-- Sử dụng múi giờ của Việt Nam
SELECT @@global.time_zone, @@session.time_zone;
SET GLOBAL time_zone = '+7:00';
SET SESSION time_zone = '+7:00';

-- Tạo bảng Thông tin người dùng
CREATE TABLE Detail_Users (
    detail_user_id INT AUTO_INCREMENT PRIMARY KEY,  -- (khóa chính) mã thông tin người dùng
    user_id BIGINT UNSIGNED,                        -- (khóa ngoại) mã người dùng
    name NVARCHAR(100) NOT NULL,                    -- tên người dùng
    gender ENUM('Nam', 'Nữ') NOT NULL,              -- giới tính người dùng
    birthday DATE NOT NULL,                         -- ngày sinh người dùng
    phone VARCHAR(15) NOT NULL,                     -- số điện thoại người dùng
    address TEXT,                                   -- địa chỉ người dùng
    IsDeleted BOOLEAN NOT NULL DEFAULT 0
);

-- Tạo bảng Danh mục Sản phẩm
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,     -- (khóa chính) mã danh mục sản phẩm
    category_name NVARCHAR(100) NOT NULL,           -- tên danh mục sản phẩm
    IsDeleted BOOLEAN NOT NULL DEFAULT 0
);

-- Tạo bảng Sản Phẩm
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,      -- (khóa chính) mã sản phẩm
    category_id INT NOT NULL,                       -- (khóa ngoại) mã danh mục sản phẩm
    product_name NVARCHAR(200) NOT NULL,            -- tên sản phẩm
    price NUMERIC NOT NULL,                         -- giá sản phẩm
    stock_quantity BIGINT NOT NULL,                 --
    description TEXT,
    image TEXT,
    IsDeleted BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Thêm ràng buộc yêu cầu giá bán và số lượng tồn khó phải không âm
ALTER TABLE Products ADD CONSTRAINT chk_price_nonnegative CHECK (price >= 0);
ALTER TABLE Products ADD CONSTRAINT chk_stock_nonnegative CHECK (stock_quantity >= 0);

-- Tạo bảng Giỏ hàng
CREATE TABLE Carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    detail_user_id INT NOT NULL,
    IsDeleted BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Sản phẩm trong Giỏ hàng
CREATE TABLE Cart_Products (
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cart_id, product_id)
);

-- Tạo bảng Đơn hàng
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    detail_user_id INT NOT NULL,
    status ENUM('Pending', 'Processing', 'Completed', 'Cancelled') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsDeleted BOOLEAN NOT NULL DEFAULT 0
);

-- Tạo bảng Chi tiết Đơn hàng
CREATE TABLE Order_Details (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

-- Tạo bảng Khuyến mãi
CREATE TABLE Promotions (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    discount_percentage FLOAT NOT NULL,
    description TEXT,
    IsDeleted BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng Hóa đơn
CREATE TABLE Invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    promotion_id INT,
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC NOT NULL,
    IsDeleted BOOLEAN NOT NULL DEFAULT 0
);

-- Tạo bảng Thanh Toán
CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_date DATETIME NOT NULL,
    method NVARCHAR(100) NOT NULL,
    total_amount NUMERIC NOT NULL,
    status ENUM('Paid', 'Pending', 'Failed') NOT NULL,
    IsDeleted BOOLEAN NOT NULL DEFAULT 0
);

-- Tạo bảng Chính sách của web bán hoa
CREATE TABLE Policies (
    policy_id INT AUTO_INCREMENT PRIMARY KEY,
    title NVARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    IsDeleted BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo khóa ngoại
ALTER TABLE Detail_Users
ADD CONSTRAINT fk_detail_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE Products
ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES Categories(category_id);

ALTER TABLE Carts
ADD CONSTRAINT fk_carts_user FOREIGN KEY (detail_user_id) REFERENCES Detail_Users(detail_user_id);

ALTER TABLE Cart_Products
ADD CONSTRAINT fk_cart_products_cart FOREIGN KEY (cart_id) REFERENCES Carts(cart_id),
ADD CONSTRAINT fk_cart_products_product FOREIGN KEY (product_id) REFERENCES Products(product_id);

ALTER TABLE Orders
ADD CONSTRAINT fk_orders_user FOREIGN KEY (detail_user_id) REFERENCES Detail_Users(detail_user_id);

ALTER TABLE Order_Details
ADD CONSTRAINT fk_order_details_order FOREIGN KEY (order_id) REFERENCES Orders(order_id),
ADD CONSTRAINT fk_order_details_product FOREIGN KEY (product_id) REFERENCES Products(product_id);

ALTER TABLE Invoices
ADD CONSTRAINT fk_invoices_order FOREIGN KEY (order_id) REFERENCES Orders(order_id),
ADD CONSTRAINT fk_invoices_promotion FOREIGN KEY (promotion_id) REFERENCES Promotions(promotion_id);

ALTER TABLE Payments
ADD CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES Orders(order_id);

-- Dữ liệu mẫu
INSERT INTO Detail_Users (user_id, name, gender, birthday, phone, address, IsDeleted) VALUES
(1, 'Bùi Hữu Nghĩa', 'Nam', '2004-08-31', '0377823749', 'Diên Xuân, Diên Khánh, Khánh Hòa', 0),
(2, 'Hoàng Xuân Thủy', 'Nữ', '2004-10-06', '0395844243', 'Bình Phước', 0),
(3, 'Nguyễn Thanh Tuấn', 'Nam', '2004-07-14', '0934973774', 'Quảng Ngãi', 0);

INSERT INTO Categories (category_name, IsDeleted) VALUES
('Hoa tươi', 0),        -- 1:
('Hoa khô', 0),         -- 2:
('Cây xanh', 0),        -- 3:
('Nến thơm', 0),        -- 4:
('Phụ kiện', 0);        -- 5:

INSERT INTO Products (category_id, product_name, price, stock_quantity, description, image, IsDeleted) VALUES
(1, 'Hoa Hồng Đỏ', 150000, 50, 'Bó hoa hồng đỏ lãng mạn', 'image1.jpg', 0),
(1, 'Hoa Cẩm Tú Cầu', 200000, 30, 'Hoa cẩm tú cầu xanh mát', 'image2.jpg', 0),
(2, 'Hoa Khô Lavender', 100000, 100, 'Hoa khô Lavender thơm dịu', 'image3.jpg', 0),
(3, 'Hộp Quà Tặng', 300000, 20, 'Hộp quà tặng sang trọng', 'image4.jpg', 0);

-- Insert thêm các sản phẩm đi kèm
INSERT INTO Products (category_id, product_name, price, stock_quantity, description, image, IsDeleted) VALUES
(5, 'Bình Sứ Trắng Nghệ Thuật', 120000, 40, 'Bình sứ trắng với thiết kế nghệ thuật, sang trọng', 'https://i.pinimg.com/736x/d6/bc/6d/d6bc6dd07ef3e18d14490d85e9f7018c.jpg', 0),
(5, 'Giỏ Hoa Tre Đan Thủ Công', 80000, 60, 'Giỏ hoa bằng tre đan thủ công, đẹp mắt', 'https://i.pinimg.com/736x/42/05/e9/4205e9f8882ebe5cf9e07c37a76b9710.jpg', 0),
(5, 'Bình Cắm Hoa Thủy Tinh Trong Suốt', 150000, 30, 'Bình thủy tinh trong suốt, phù hợp trang trí', 'https://i.pinimg.com/736x/82/4b/5e/824b5eeaf58a6912ab40cf5aba63e702.jpg', 0),
(5, 'Kẹp Hoa Gỗ Trang Trí', 50000, 100, 'Kẹp hoa nhỏ bằng gỗ để cài trên giỏ hoặc bó hoa', 'https://i.pinimg.com/736x/ed/d4/2b/edd42b56830034f54b86bb118f8e71d1.jpg', 0),
(5, 'Dây Ruy Băng Lụa Màu Vàng', 30000, 150, 'Dây ruy băng lụa mềm mại, màu vàng tươi sáng', 'https://i.pinimg.com/736x/78/b9/2a/78b92a309cff2c158f199c33ef1b455b.jpg', 0),
(5, 'Giỏ Hoa Vintage Trang Trí', 180000, 20, 'Giỏ hoa phong cách cổ điển, tinh tế', 'https://i.pinimg.com/736x/5c/88/aa/5c88aa3dbc67f5843a0602a02170e213.jpg', 0),
(5, 'Bình Sứ Hoa Văn Sen Vàng', 200000, 25, 'Bình sứ với hoa văn sen vàng độc đáo, sang trọng', 'https://i.pinimg.com/736x/1c/26/c2/1c26c2cb203b6bb1481e5bee10a24ea4.jpg', 0),
(5, 'Hộp Hoa Handmade Hình Trái Tim', 250000, 15, 'Hộp hoa hồng giấy handmade hình trái tim, thiết kế tinh tế', 'https://i.pinimg.com/736x/b6/f8/cb/b6f8cb3cc609afa081db94b9b787ded2.jpg', 0),
(5, 'Giá Đỡ Hoa Hồng Leo', 70000, 50, 'Giá đỡ hoa hồng leo bằng kim loại, tiện lợi', 'https://i.pinimg.com/736x/50/26/0b/50260b54a1e959dacce02de069578826.jpg', 0),
(5, 'Dây Đèn LED Trang Trí', 120000, 35, 'Dây đèn LED trang trí giỏ hoa lộng lẫy', 'https://i.pinimg.com/736x/a5/c2/ea/a5c2ea8f5a93ac12b45fefa1fb463a18.jpg', 0);

INSERT INTO Products (category_id, product_name, price, stock_quantity, description, image, IsDeleted) VALUES
(1, 'Hoa Hồng', 250000, 50, 'Hoa hồng, biểu tượng của tình yêu và sự lãng mạn, nổi bật với vẻ đẹp kiêu sa, cánh mềm mại và hương thơm quyến rũ. Với nhiều màu sắc như đỏ, trắng, vàng, mỗi màu mang ý nghĩa riêng, hoa hồng chinh phục lòng người qua mọi thời đại, là loài hoa được yêu thích trên khắp thế giới.', 'https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2fe557aa7e71a27760_640a0d9e587af69abd0e9f4c_rue-de-la-rosiere-en4%2520copy%25202-p-800.webp', 0);

INSERT INTO Products (category_id, product_name, price, stock_quantity, description, image, IsDeleted) VALUES
(1, 'Hoa Hướng Dương', 300000, 40, 'Hoa hướng dương, với những cánh hoa vàng rực rỡ tỏa sáng như mặt trời, là biểu tượng của sự lạc quan, hy vọng và sức sống mạnh mẽ. Loài hoa này không chỉ thu hút ánh nhìn bởi vẻ đẹp nổi bật mà còn mang ý nghĩa về lòng trung thành và niềm tin mãnh liệt.', 'https://i.pinimg.com/736x/17/8c/a9/178ca992dcd5e44adff4156e706989b1.jpg', 0);


-- 20 loại hoa tươi
INSERT INTO Products (category_id, product_name, price, stock_quantity, description, image, IsDeleted) VALUES
(1, 'Hoa Cẩm Tú Cầu Trắng', 200000, 50, 'Hoa Cẩm Tú Cầu trắng thanh khiết, phù hợp cho trang trí hoặc làm quà tặng', 'https://static.vecteezy.com/system/resources/previews/041/956/891/non_2x/ai-generated-bouquet-of-flowers-in-a-ceramic-vase-bouquet-of-white-hydrangea-flowers-isolated-flowers-in-vase-blooming-flowers-free-png.png', 0),
(1, 'Hoa Mai Trắng', 250000, 40, 'Hoa Mai trắng tinh tế, biểu tượng của sự thanh cao và nhã nhặn', 'https://static.vecteezy.com/system/resources/previews/052/388/541/non_2x/elegant-transparent-flowers-arranged-in-a-simple-vase-against-a-clean-transparent-background-vase-with-beautiful-transparent-flowers-file-of-isolated-object-with-shadow-on-transparent-background-free-png.png', 0),
(1, 'Hoa Lan', 300000, 60, 'Hoa Lan sang trọng, biểu tượng của sự quý phái và tinh tế', 'https://png.pngtree.com/png-vector/20240315/ourmid/pngtree-vase-with-a-beautiful-flowers-on-transparent-generated-ai-png-image_11941254.png', 0),
(1, 'Hoa Hồng Trắng', 150000, 80, 'Hoa Hồng trắng mang ý nghĩa của sự thuần khiết và tình yêu chân thành', 'https://static.vecteezy.com/system/resources/thumbnails/046/829/920/small_2x/wooden-vase-with-white-rose-flowers-isolated-on-transparent-background-png.png', 0),
(1, 'Hoa Thập Cẩm', 350000, 30, 'Bó hoa thập cẩm đa sắc, biểu tượng của sự hòa hợp và tươi mới', 'https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1623979967/vendor/8284/catalog/product/t/e/teleflora_s_fresh_flourish_bouquet_60cb954a8e0e2._60cb954cbb71e..jpg', 0),
(1, 'Hoa Hồng Tím', 200000, 50, 'Hoa Hồng tím biểu tượng của sự lãng mạn và sang trọng', 'https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1623978394/vendor/8284/catalog/product/t/e/teleflora_s_dream_of_roses_60cb8f2456600._60cb8f273dee9..jpg', 0),
(1, 'Hoa Hồng Tím Lớn', 400000, 20, 'Bó hoa Hồng tím lớn, mang đến cảm giác trang trọng và quyến rũ', 'https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1674525750/vendor/6397/catalog/product/t/e/teleflora_s_morning_melody_18_1_195.jpg', 0),
(1, 'Hoa Hồng và Hoa Ly, Hoa cẩm tú cầu ', 500000, 15, 'Hoa Hồng và Hoa Ly trong bình xanh, thích hợp để trang trí và tặng quà', 'https://fleuristeladiva.ca/boutique/image/cache/catalog/Funerals/Fleuriste-la-diva-fun%C3%A9raille-Laval-bouquet-arrangement-fun%C3%A9raire-beautiful-in-blue-980x980.jpg', 0),
(1, 'Hoa Hồng và Hoa Ly Trắng', 300000, 25, 'Hoa Hồng và Ly trắng, mang vẻ đẹp thanh lịch và tinh khôi', 'https://flowersinwonderland.com.au/wp-https://www.fasanflorist.com/images/itemVariation/v4_IsleofWhitePremium-200923120329.jpg', 0),
(1, 'Hoa Hồng và hoa Ly Đỏ', 320000, 30, 'Hoa Hồng và Ly đỏ, biểu tượng của sự nồng nàn và ấm áp', 'https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1705631438/vendor/7361/catalog/product/t/e/teleflora_s_happy_in_love_bouquet_5e3c60caa0f3e_5e3c60cce34c5.jpg', 0),
(1, 'Hoa Ly Trắng', 280000, 35, 'Hoa Ly trắng thanh lịch, biểu tượng của sự tinh khiết và trang trọng', 'https://cdn.efwh.net/public/bf/3c/0ecdeaa47bf5e2ac60a50b7e96446f1b0298.jpg', 0),
(1, 'Hoa Loa Kèn Trắng', 250000, 40, 'Bó hoa trắng đơn giản, phù hợp cho nhiều dịp khác nhau', 'https://cdn11.bigcommerce.com/s-pg5h85hqc1/images/stencil/590x590/products/549/2157/FL-0145-Vase-1__64886.1687127207.jpg?c=1', 0),
(1, 'Hoa Loa Kèn kết Hợp Với Hoa Bi Trắng', 260000, 38, 'Hoa trắng nhẹ nhàng, thích hợp làm quà tặng', 'https://cdn11.bigcommerce.com/s-pg5h85hqc1/images/stencil/590x590/products/677/3083/FL-0166-WH-Vase-1__54821.1730567284.jpg?c=1', 0),
(1, 'Hoa Hồng Đỏ', 220000, 45, 'Hoa Hồng đỏ ngọt ngào, biểu tượng của tình yêu và sự lãng mạn', 'https://www.floravietnam.com/images/thumbnails/465/465/product/1/red-and-pink-roses-in-glass-vase-floravietnam.jpg', 0),
(1, 'Hoa Tulip', 350000, 18, 'Hoa Tulip thanh nhã, phù hợp để trang trí hoặc làm quà tặng', 'https://png.pngtree.com/png-vector/20240506/ourmid/pngtree-whispering-winds-yellow-and-white-tulips-adorned-with-greenery-png-image_12286754.png', 0),
(1, 'Hoa valentine loại 1   ', 300000, 50, 'Bình hoa Valentine rực rỡ với sắc đỏ, mang lại cảm giác ngọt ngào và lãng mạn.', 'https://cdn.globalrose.com/assets/img/prod/fresh-red-bouquets-flowers-for-valentines-day-globalrose.png', 0),
(1, 'Hoa valentine loại 2 ', 320000, 45, 'Bình hoa Valentine với sự kết hợp tinh tế của các loại hoa, lý tưởng để tặng trong ngày đặc biệt.', 'https://cdn.globalrose.com/assets/img/prod/beautiful-bouquets-valentines-day-fresh-flowers-globalrose.png', 0),
(1, 'Hoa valentine loại 3 ', 350000, 40, 'Bình hoa Valentine đỏ thắm, biểu tượng cho tình yêu cháy bỏng và chân thành.', 'https://cdn.globalrose.com/assets/img/prod/bouquets-for-valentines-day-red-roses-delivery-globalrose.png', 0),
(1, 'Hoa Hồng', 250000, 50, 'Hoa hồng, biểu tượng của tình yêu và sự lãng mạn, nổi bật với vẻ đẹp kiêu sa, cánh mềm mại và hương thơm quyến rũ. Với nhiều màu sắc như đỏ, trắng, vàng, mỗi màu mang ý nghĩa riêng, hoa hồng chinh phục lòng người qua mọi thời đại, là loài hoa được yêu thích trên khắp thế giới.', 'https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2fe557aa5d3ba27763_63a5f9fb760c9d06faccac1f_rue-de-la-rosiere-en.jpeg', 0),
(1, 'Hoa Hướng Dương', 300000, 40, 'Hoa hướng dương, với những cánh hoa vàng rực rỡ tỏa sáng như mặt trời, là biểu tượng của sự lạc quan, hy vọng và sức sống mạnh mẽ. Loài hoa này không chỉ thu hút ánh nhìn bởi vẻ đẹp nổi bật mà còn mang ý nghĩa về lòng trung thành và niềm tin mãnh liệt.', 'https://i.pinimg.com/736x/17/8c/a9/178ca992dcd5e44adff4156e706989b1.jpg', 0);
-- 24 loại hoa khô
INSERT INTO Products (category_id, product_name, price, stock_quantity, description, image, IsDeleted) VALUES
(2, 'Bình Hoa Baby Trắng Nghệ Thuật', 150000, 50, 'Bình hoa Baby trắng khô mang lại sự thanh lịch và tự nhiên.', 'https://png.pngtree.com/png-clipart/20210309/original/pngtree-beautiful-still-life-dried-flower-vase-plant-png-image_5889793.jpg', 0),
(2, 'Bình Hoa Hướng Dương Khô Nghệ Thuật', 160000, 40, 'Bình hoa hướng dương khô được thiết kế đẹp mắt, lý tưởng cho không gian sống.', 'https://png.pngtree.com/png-clipart/20210309/original/pngtree-dried-flower-bouquet-and-vase-png-image_5886055.jpg', 0),
(2, 'Bình Hoa Rum Trắng Khô', 170000, 45, 'Hoa Rum khô trong bình gốm trắng, tạo điểm nhấn tinh tế cho không gian.', 'https://png.pngtree.com/png-clipart/20210309/original/pngtree-white-ceramic-vase-with-dried-flowers-ornaments-png-image_5886078.jpg', 0),
(2, 'Bình Hoa Mùa Thu Vàng', 180000, 30, 'Bình hoa khô vàng nhẹ nhàng, mang đến sự ấm áp và gần gũi.', 'https://media.decorationbrands.com/media/catalog/product/a/l/all-198137-198137_Z1.jpg', 0),
(2, 'Bình Hoa Cỏ Lau Khô', 190000, 25, 'Bình hoa cỏ lau khô trong suốt, phù hợp cho phong cách trang trí hiện đại.', 'https://www.candlelight.co.uk/cdn/shop/products/candlelight-home-artificial-plants-flowers-dried-flowers-in-round-glass-vase-mo-1pk-30795713609814_2000x.jpg', 0),
(2, 'Bình Hoa Cỏ Lau Đen Tối Giản', 200000, 20, 'Hoa cỏ lau đen khô mang phong cách tối giản và cổ điển.', 'https://www.atmosphera.com/en/phototheque/atmosphera.com/53500/large/02W051600B.jpg', 0),
(2, 'Bình Hoa Tinh Tế', 150000, 50, 'Bình hoa Baby đỏ phối màu khéo léo, mang đến không gian sinh động.', 'https://www.koch.com.au/image/large/670801WH.jpg', 0),
(2, 'Bình Hoa Cỏ Nhẹ Nhàng', 180000, 35, 'Hoa cỏ khô được phối hợp hài hòa, tạo không gian tinh tế.', 'https://kaystore.com/wp-content/uploads/2023/06/I119907.jpg', 0),
(2, 'Bình Hoa Nghệ Thuật Khô Đa Sắc', 170000, 40, 'Hoa khô với nhiều màu sắc phong phú, phù hợp cho mọi không gian.', 'https://m.media-amazon.com/images/I/81kaZ0m-kML.jpg', 0),
(2, 'Bình Hoa Trắng Nhẹ Nhàng', 200000, 25, 'Bình hoa trắng nhỏ gọn, phù hợp để làm quà hoặc trang trí.', 'https://static.vecteezy.com/system/resources/previews/047/118/341/non_2x/vase-with-flowers-on-transparent-background-ai-generative-free-png.png', 0),
(2, 'Bình Hoa Tự Nhiên Thu Hút', 210000, 20, 'Hoa khô sắp xếp hài hòa, tạo không gian mộc mạc nhưng đầy thu hút.', 'https://png.pngtree.com/png-clipart/20240927/original/pngtree-natural-dried-flowers-and-vase-on-transparent-background-png-image_16100481.png', 0),
(2, 'Bình Hoa Nghệ Thuật Mùa Thu', 190000, 30, 'Bình hoa khô mùa thu, điểm nhấn cho căn phòng ấm cúng.', 'https://png.pngtree.com/png-vector/20240802/ourmid/pngtree-beautiful-still-life-vase-with-dried-flowers-plants-png-image_13334503.png', 0),
(2, 'Bình Hoa Cẩm Tú Cầu Khô Tinh Tế', 220000, 15, 'Hoa Cẩm Tú Cầu khô trang nhã, phù hợp cho không gian sống hiện đại.', 'https://png.pngtree.com/png-vector/20240801/ourmid/pngtree-bouquet-of-dried-flowers-in-a-glass-vase-png-image_13056351.png', 0),
(2, 'Bình Hoa Lá Vàng Mùa Thu', 230000, 10, 'Bình hoa lá vàng mùa thu khô, tạo cảm giác nhẹ nhàng và thư thái.', 'https://png.pngtree.com/png-vector/20240601/ourmid/pngtree-autumn-bouquet-of-dry-leaves-and-branches-of-field-plants-in-png-image_12588510.png', 0),
(2, 'Bình Hoa Tự Nhiên Lá Cỏ', 230000, 10, 'Hoa khô lá cỏ mang lại không gian tự nhiên và ấm áp.', 'https://png.pngtree.com/png-vector/20240601/ourmid/pngtree-autumn-bouquet-of-dry-leaves-and-branches-of-field-plants-in-png-image_12588511.png', 0),
(2, 'Bình Hoa Hiện Đại Trụ Đứng', 240000, 12, 'Hoa khô trong bình trụ đứng, thiết kế hiện đại và tinh tế.', 'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-stylish-modern-dried-flower-arrangement-in-cylindrical-vase-as-home-decoration-png-image_10219993.png', 0),
(2, 'Bình Hoa Khô Sang Trọng', 240000, 12, 'Bình hoa khô tối giản nhưng sang trọng, phù hợp với mọi không gian.', 'https://png.pngtree.com/png-clipart/20231020/original/pngtree-stylish-modern-dried-flower-arrangement-in-cylindrical-vase-as-home-decoration-png-image_13382852.png', 0),
(2, 'Bình Hoa Khô Đơn Giản', 240000, 12, 'Hoa khô phong cách tối giản, mang lại không gian nhẹ nhàng.', 'https://png.pngtree.com/png-clipart/20231020/original/pngtree-stylish-modern-dried-flower-arrangement-in-cylindrical-vase-as-home-decoration-png-image_13382853.png', 0),
(2, 'Bình Hoa Rattan Mộc Mạc', 200000, 15, 'Hoa khô kết hợp bình Rattan, mang đến cảm giác gần gũi thiên nhiên.', 'https://png.pngtree.com/png-vector/20241217/ourmid/pngtree-handwoven-round-rattan-vase-with-dried-floral-decor-png-image_14790011.png', 0),
(2, 'Bình Hoa Mây Tre Nghệ Thuật', 210000, 18, 'Hoa khô kết hợp bình mây tre, tạo không gian hài hòa.', 'https://png.pngtree.com/png-vector/20241217/ourmid/pngtree-natural-rattan-vase-with-classic-design-and-dried-flowers-png-image_14790010.png', 0),
(2, 'Bình Hoa Lúa Mì Thanh Nhã', 200000, 20, 'Hoa khô kết hợp lúa mì, mang lại cảm giác yên bình.', 'https://png.pngtree.com/png-vector/20240705/ourmid/pngtree-vase-of-wheat-on-black-background-png-image_12945289.png', 0),
(2, 'Bình Hoa Lily Khô Cổ Điển', 210000, 18, 'Hoa Lily khô cổ điển, thích hợp cho không gian sống thanh lịch.', 'https://png.pngtree.com/png-vector/20240515/ourmid/pngtree-charming-lily-ensemble-in-a-vase-png-image_12471683.png', 0),
(2, 'Bình Hoa Nghệ Thuật Độc Đáo', 220000, 15, 'Bình hoa khô thiết kế tinh tế, phù hợp để trang trí nội thất.', 'https://png.pngtree.com/png-vector/20240628/ourmid/pngtree-charming-vase-with-delicate-dried-flowers-png-image_12898703.png', 0),
(2, 'Bình Hoa Thủ Công Sang Trọng', 230000, 12, 'Bình hoa khô thủ công, tạo không gian ấm cúng và tự nhiên.', 'https://png.pngtree.com/png-vector/20240628/ourmid/pngtree-artisanal-vase-arrangement-with-dried-flora-png-image_12898701.png', 0);
-- 12 loại cây xanh
INSERT INTO Products (category_id, product_name, price, stock_quantity, description, image, IsDeleted) VALUES
(3, 'Cây Lưỡi Hổ Mini', 120000, 30, 'Cây Lưỡi Hổ mini giúp thanh lọc không khí và trang trí góc làm việc.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLVyQTfstJVbmin3MOnumCA7GWL1KyCr_4-w&s', 0),
(3, 'Cây Kim Tiền Phong Thủy', 250000, 20, 'Cây Kim Tiền mang lại may mắn, tài lộc, phù hợp trang trí phòng khách.', 'https://trongcay.vn/upload/news/2023/10/19/image-1697687280cay-kim-tien.jpg', 0),
(3, 'Cây Xương Rồng Chậu Trắng', 90000, 50, 'Cây xương rồng nhỏ gọn, dễ chăm sóc, tạo điểm nhấn tự nhiên cho bàn làm việc.', 'https://vuoncayviet.com/data/items/1059/cay-xuong-rong-thanh-son-vcv.jpg', 0),
(3, 'Cây Monstera Mini', 180000, 25, 'Cây Monstera mini tạo vẻ đẹp xanh mát và hiện đại cho không gian sống.', 'https://hn.ss.bfcplatform.vn/caygia-jassi/wp-content/uploads/2023/10/20115436/NC50-10.jpg', 0),
(3, 'Cây Ngũ Gia Bì Chậu Sứ', 200000, 15, 'Cây Ngũ Gia Bì giúp thanh lọc không khí, phù hợp trang trí văn phòng.', 'https://lamam.vn/wp-content/uploads/2024/01/cay-ngu-gia-xanh-mini-de-ban-chau-su.jpg', 0),
(3, 'Cây Trầu Bà Lá Xẻ', 220000, 20, 'Cây Trầu Bà lá xẻ mang phong cách hiện đại, thích hợp trang trí không gian sống.', 'https://greenvibes.vn/wp-content/uploads/2023/07/cay-trau-ba-la-xe.jpg', 0),
(3, 'Cây Lan Ý Thanh Lọc Không Khí', 190000, 30, 'Cây Lan Ý giúp lọc sạch không khí, mang lại sự trong lành cho ngôi nhà.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm7Qmw00crBJcFtx1wYW1zSOGgL5PXLGuE2A&s', 0),
(3, 'Cây Sen Đá Ngọc', 80000, 50, 'Cây sen đá ngọc nhỏ nhắn, dễ chăm sóc, tạo không gian xanh tươi.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQDyta-56GZThArdrF6jz05kUpX-0eyeHVBQ&s', 0),
(3, 'Cây Cọ Nhật Mini', 250000, 15, 'Cây Cọ Nhật mini mang lại không khí nhiệt đới và xanh mát.', 'https://product.hstatic.net/200000630767/product/conhatmini-1_2c53e2e97a7f42fb9c096222a5689616.png', 0),
(3, 'Cây Phát Tài', 300000, 10, 'Cây Phát Tài mang ý nghĩa phong thủy tốt, phù hợp trang trí văn phòng.', 'https://monrovia.vn/wp-content/uploads/2023/02/ca%CC%81ch-cha%CC%86m-so%CC%81c-ca%CC%82y-pha%CC%81t-ta%CC%80i-de%CC%82%CC%89-trong-nha%CC%80.jpeg', 0),
(3, 'Cây Cau Cảnh', 270000, 20, 'Cây Cau Cảnh nhỏ gọn, thanh lọc không khí, mang lại không gian sống tươi mới.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLjBOSHB8Pcxnh1PIN6LDGBWiYWNvXcgEj-g&s', 0),
(3, 'Cây Đuôi Công Tím', 240000, 18, 'Cây Đuôi Công tím với lá màu sắc độc đáo, tạo điểm nhấn cho không gian.', 'https://mowgarden.com/wp-content/uploads/2022/09/cay-duoi-cong-tim-Calathea-roseopicta-Dottie.jpg', 0);
-- 10 nến thơm
INSERT INTO Products (category_id, product_name, price, stock_quantity, description, image, IsDeleted) VALUES
(4, 'Nến Thơm Lavender Relax', 150000, 40, 'Nến thơm mùi Lavender giúp thư giãn tinh thần và tạo không gian ấm áp.', 'https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f3194363fa747f2647b_6408c2888ca916190bf375ca_nestnewyork_wellness_himalayansaltrosewater_candle_3wick_1_720x.webp', 0),
(4, 'Nến Thơm Vanilla Sweet', 180000, 35, 'Nến thơm hương vani ngọt ngào, mang lại cảm giác thư giãn và dễ chịu.', 'https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f32e6dcecbc89f1519a_6408c011b8c50c3437263eb4_nestnewyork_rattan_grapefruit_candle_classic_1_540x.webp', 0),
(4, 'Nến Thơm Rose Romantic', 200000, 25, 'Nến thơm hương hoa hồng tạo không khí lãng mạn và ấm cúng.', 'https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f31620f2b53066da61c_640a14a8a46e68073be0f597_nestnewyork_wellness_himalayansaltrosewater_reeddiffuser_1_540x%2520copy.webp', 0),
(4, 'Nến Thơm Sandalwood Classic', 220000, 20, 'Nến thơm mùi gỗ đàn hương mang lại sự ấm áp và sang trọng.', 'https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2dedb324b76a587a45_6408c2f98739bfa8d0f7a0cd_nestnewyork_wilderness_charcoalwoods_candle_3wick_1_720x%2520copy-p-800.webp', 0),
(4, 'Nến Thơm Lemongrass Refresh', 130000, 50, 'Nến thơm mùi chanh sả giúp thanh lọc không khí và xua đuổi côn trùng.', 'https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2d3919512281f29d8b_6408c027635ca62bba32f82e_NEST01LZM002_LimeZest_Classic_wBox_2000x2000_371dceb6-99e5-4784-aded-fd42decc0c26_720x.webp', 0),
(4, 'Nến Thơm Ocean Breeze', 170000, 30, 'Nến thơm hương biển mang lại cảm giác tươi mới và thoải mái.', 'https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2d9bdb21b8a5542dbb_6408c2cd7a302656024c5b49_nestnewyork_bamboo_candle_classic_1_720x.webp', 0),
(4, 'Nến Thơm Eucalyptus Calm', 160000, 40, 'Nến thơm hương bạch đàn giúp thư giãn và cải thiện chất lượng không khí.', 'https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2d8e29761f0ec24531_6408c18d95246d743cd0108a_nestnewyork_wellness_driftwoodchamomile_candle_3wick_1_540x.webp', 0),
(4, 'Nến Thơm Citrus Energy', 140000, 45, 'Nến thơm hương cam quýt tạo không khí sảng khoái và tràn đầy năng lượng.', 'https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f3253b60dff794e8c8e_640a14c4f6e4026c4b5ea553_nestnewyork_rattan_cedarleaflavender_reeddiffuser_1_720x%2520copy-p-800.webp', 0),
(4, 'Nến Thơm Jasmine Bliss', 190000, 25, 'Nến thơm hương hoa nhài thanh lịch, mang đến cảm giác thư thái và nhẹ nhàng.', 'https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f2d3919519714f29d8c_63c1b6fa1622617a936cf208_Nest_NY_LZM_LZM_CC_3WC_RD_BOX_0703_2000x2000_0b628770-f5e1-45b2-8ad5-3257928a110f_720x.webp', 0),
(4, 'Nến Thơm Cinnamon Cozy', 200000, 20, 'Nến thơm mùi quế tạo cảm giác ấm áp, hoàn hảo cho mùa đông.', 'https://cdn.prod.website-files.com/6400d82951450087c6d1eba8/64342f3125c646e557084234_63c1baff935f5d3e53a9257d_nestnewyork_wellness_wildminteucalyptus_reeddiffuser_3_720x.webp', 0);


INSERT INTO Carts (detail_user_id, IsDeleted) VALUES
(1, 0),
(2, 0),
(3, 0);

INSERT INTO Cart_Products (cart_id, product_id, quantity) VALUES
(1, 1, 2),
(1, 3, 1),
(2, 2, 3),
(3, 4, 1);

# Này cũ rồi update lại ngày tự tạo
# INSERT INTO Orders (detail_user_id, status, created_at, IsDeleted) VALUES
# (1, 'Pending', '2024-12-01 10:00:00', 0),
# (2, 'Completed', '2024-12-02 15:00:00', 0),
# (3, 'Processing', '2024-12-02 15:00:00', 0);

INSERT INTO Orders (detail_user_id, status, IsDeleted) VALUES
(2, 'Pending', 0),
(2, 'Completed', 0);

INSERT INTO Orders (detail_user_id, status, IsDeleted) VALUES
(3, 'Pending', 0),
(3, 'Completed', 0);


INSERT INTO Order_Details (order_id, product_id, quantity) VALUES
(1, 1, 2),
(1, 3, 1),
(2, 2, 3),
(3, 4, 1);

INSERT INTO Order_Details (order_id, product_id, quantity) VALUES
(4, 1, 2),
(4, 3, 1),
(4, 2, 3),
(4, 4, 1);

INSERT INTO Promotions (name, start_date, end_date, discount_percentage, description, IsDeleted) VALUES
('NEWM01', '2024-12-01', '2024-12-10', 0.1, 'Khuyến mãi cuối tháng', 0),
('MERY02', '2024-12-15', '2024-12-25', 0.2, 'Khuyến mãi Giáng Sinh', 0);

INSERT INTO Invoices (order_id, promotion_id, issued_at, total_amount, IsDeleted) VALUES
(1, 1, '2024-12-01 12:00:00', 300000, 0),
(2, 2, '2024-12-02 16:00:00', 500000, 0),
(3, 2, '2024-12-05 6:00:00', 1000000, 0);

INSERT INTO Payments (order_id, payment_date, method, total_amount, status, IsDeleted) VALUES
(1, '2024-12-01 13:00:00', 'Credit Card', 300000, 'Paid', 0),
(2, '2024-12-02 17:00:00', 'PayPal', 500000, 'Paid', 0),
(3, '2024-12-05 7:00:00', 'PayPal', 1000000, 'Paid', 0);

INSERT INTO Policies (title, content, IsDeleted) VALUES
('Chính sách hoàn trả', 'Khách hàng có thể hoàn trả sản phẩm trong vòng 1 ngày kể từ ngày nhận hàng.', 0),
('Chính sách vận chuyển', 'Miễn phí vận chuyển cho đơn hàng trên 500,000 VND.', 0);
