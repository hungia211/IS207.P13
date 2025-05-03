//----------------------------------------------Nút tài khoản----------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const accountMenu = document.querySelector("#account-menu"); 

    // Đảm bảo menu bị ẩn khi trang load
    if (!accountMenu.classList.contains("hidden")) {
        accountMenu.classList.add("hidden");
    }

    const accountLink = document.querySelector("#info-link"); 

    // Toggle menu khi bấm vào nút "Tài khoản"
    accountLink.addEventListener("click", function (e) {
        e.preventDefault(); // Ngăn điều hướng mặc định
        accountMenu.classList.toggle("hidden");
    });

    // Đóng menu khi click ra ngoài
    document.addEventListener("click", function (e) {
        if (!accountMenu.contains(e.target) && !accountLink.contains(e.target)) {
            accountMenu.classList.add("hidden");
        }
    });
});

//----------------------------------------------Giao diện phân loại----------------------------------------------

// Hàm định dạng giá
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' VND';
}

// Hàm tạo các dòng sản phẩm
function generateProductRows(products) {
    const container = document.getElementById("product-container");
    let productCount = products.length;
    let rows = Math.floor(productCount / 2);

    // Nếu sản phẩm lẻ, cộng thêm 1 hàng
    if (productCount % 2 !== 0) {
        rows += 1;
    }

    // Tạo các dòng sản phẩm
    let productIndex = 0;
    for (let i = 0; i < rows; i++) {
        // Tạo div product-wrapper
        const productWrapper = document.createElement("div");
        productWrapper.classList.add("product-wrapper");

        // Tạo 2 div cho 2 sản phẩm
        for (let j = 0; j < 2; j++) {
            // Kiểm tra nếu đây là sản phẩm cuối cùng (trong trường hợp số lượng sản phẩm là lẻ)
            if (productIndex >= productCount) {
                // Nếu là sản phẩm lẻ và chưa có sản phẩm ở bên phải
                const productSide = document.createElement("div");
                productSide.classList.add("product-right");
                // Thêm div trống vào product-right
                const emptyDiv = document.createElement("div");
                emptyDiv.classList.add("product-image");
                emptyDiv.style.backgroundColor = "#fff";  
                productSide.appendChild(emptyDiv);
                productWrapper.appendChild(productSide);
                break;
            }

            // Tạo div cho sản phẩm
            const productSide = document.createElement("div");
            productSide.classList.add(j === 0 ? "product-left" : "product-right");

            // Tạo div image và text cho mỗi sản phẩm
            const productImageDiv = document.createElement("div");
            productImageDiv.classList.add("product-image");
            const productTextDiv = document.createElement("div");
            productTextDiv.classList.add("product-text");

            // Lấy thông tin sản phẩm từ mảng
            const product = products[productIndex];
            const productImg = document.createElement("img");
            productImg.src = product.image;

            // Tạo phần tử text-name và text-price
            const productNameDiv = document.createElement("div");
            productNameDiv.classList.add("text-name");
            const productNameText = document.createElement("p");
            productNameText.innerHTML = product.name;
            productNameDiv.appendChild(productNameText);

            const productPriceDiv = document.createElement("div");
            productPriceDiv.classList.add("text-price");
            const productPriceText = document.createElement("p");
            productPriceText.innerHTML = formatPrice(product.price);  // Định dạng giá
            productPriceDiv.appendChild(productPriceText);

            // Thêm thông tin vào sản phẩm
            productImageDiv.appendChild(productImg);
            productTextDiv.appendChild(productNameDiv);
            productTextDiv.appendChild(productPriceDiv);
            productSide.appendChild(productImageDiv);
            productSide.appendChild(productTextDiv);

            // Thêm vào product-wrapper
            productWrapper.appendChild(productSide);

            // Tăng chỉ số sản phẩm
            productIndex++;
        }

        // Thêm product-wrapper vào container
        container.appendChild(productWrapper);
    }

    // Kiểm tra nếu có ít nhất 1 product-wrapper, thêm lớp để bỏ gạch chân cho phần tử cuối cùng
    if (container.children.length >= 2) {
        const productWrappers = container.querySelectorAll(".product-wrapper");
        productWrappers[productWrappers.length - 1].classList.add("remove-border-bottom");
    }
}

// Hàm lấy sản phẩm từ API Laravel
function fetchProducts() {
    fetch('http://your-laravel-app.test/api/products')
        .then(response => response.json())
        .then(data => {
            generateProductRows(data);  // Gọi hàm tạo các dòng sản phẩm
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Nếu chưa kết nối với backend, sử dụng dữ liệu giả lập
const isBackendConnected = false;  // Thay đổi giá trị này khi kết nối với backend

if (isBackendConnected) {
    fetchProducts();  // Gọi API khi backend đã kết nối
} else {
    // Dữ liệu giả lập
    const products = [
        { "name": "Bình Hoa Baby Trắng Nghệ Thuật", "price": 150000, "image": "https://png.pngtree.com/png-clipart/20210309/original/pngtree-beautiful-still-life-dried-flower-vase-plant-png-image_5889793.jpg" },
        { "name": "Bình Hoa Hướng Dương Khô Nghệ Thuật", "price": 160000, "image": "https://png.pngtree.com/png-clipart/20210309/original/pngtree-dried-flower-bouquet-and-vase-png-image_5886055.jpg" },
        { "name": "Bình Hoa Rum Trắng Khô", "price": 170000, "image": "https://png.pngtree.com/png-clipart/20210309/original/pngtree-white-ceramic-vase-with-dried-flowers-ornaments-png-image_5886078.jpg" },
        { "name": "Bình Hoa Mùa Thu Vàng", "price": 180000, "image": "https://media.decorationbrands.com/media/catalog/product/a/l/all-198137-198137_Z1.jpg" },
        { "name": "Bình Hoa Cỏ Lau Khô", "price": 190000, "image": "https://www.candlelight.co.uk/cdn/shop/products/candlelight-home-artificial-plants-flowers-dried-flowers-in-round-glass-vase-mo-1pk-30795713609814_2000x.jpg" },
        { "name": "Bình Hoa Cỏ Lau Đen Tối Giản", "price": 200000, "image": "https://www.atmosphera.com/en/phototheque/atmosphera.com/53500/large/02W051600B.jpg" },
        { "name": "Bình Hoa Tinh Tế", "price": 150000, "image": "https://www.koch.com.au/image/large/670801WH.jpg" },
        { "name": "Bình Hoa Cỏ Nhẹ Nhàng", "price": 180000, "image": "https://kaystore.com/wp-content/uploads/2023/06/I119907.jpg" },
        { "name": "Bình Hoa Nghệ Thuật Khô Đa Sắc", "price": 170000, "image": "https://m.media-amazon.com/images/I/81kaZ0m-kML.jpg" },
        { "name": "Bình Hoa Trắng Nhẹ Nhàng", "price": 200000, "image": "https://static.vecteezy.com/system/resources/previews/047/118/341/non_2x/vase-with-flowers-on-transparent-background-ai-generative-free-png.png" },
        { "name": "Bình Hoa Tự Nhiên Thu Hút", "price": 210000, "image": "https://png.pngtree.com/png-clipart/20240927/original/pngtree-natural-dried-flowers-and-vase-on-transparent-background-png-image_16100481.png" },
        { "name": "Bình Hoa Nghệ Thuật Mùa Thu", "price": 190000, "image": "https://png.pngtree.com/png-vector/20240802/ourmid/pngtree-beautiful-still-life-vase-with-dried-flowers-plants-png-image_13334503.png" },
        { "name": "Bình Hoa Cẩm Tú Cầu Khô Tinh Tế", "price": 220000, "image": "https://png.pngtree.com/png-vector/20240801/ourmid/pngtree-bouquet-of-dried-flowers-in-a-glass-vase-png-image_13056351.png" },
        { "name": "Bình Hoa Lá Vàng Mùa Thu", "price": 230000, "image": "https://png.pngtree.com/png-vector/20240601/ourmid/pngtree-autumn-bouquet-of-dry-leaves-and-branches-of-field-plants-in-png-image_12588510.png" },
        { "name": "Bình Hoa Tự Nhiên Lá Cỏ", "price": 230000, "image": "https://png.pngtree.com/png-vector/20240601/ourmid/pngtree-autumn-bouquet-of-dry-leaves-and-branches-of-field-plants-in-png-image_12588511.png" },
        { "name": "Bình Hoa Hiện Đại Trụ Đứng", "price": 240000, "image": "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-stylish-modern-dried-flower-arrangement-in-cylindrical-vase-as-home-decoration-png-image_10219993.png" },
        { "name": "Bình Hoa Khô Sang Trọng", "price": 240000, "image": "https://png.pngtree.com/png-clipart/20231020/original/pngtree-stylish-modern-dried-flower-arrangement-in-cylindrical-vase-as-home-decoration-png-image_13382852.png" },
        { "name": "Bình Hoa Khô Đơn Giản", "price": 240000, "image": "https://png.pngtree.com/png-clipart/20231020/original/pngtree-stylish-modern-dried-flower-arrangement-in-cylindrical-vase-as-home-decoration-png-image_13382853.png" },
        { "name": "Bình Hoa Rattan Mộc Mạc", "price": 200000, "image": "https://png.pngtree.com/png-vector/20241217/ourmid/pngtree-handwoven-round-rattan-vase-with-dried-floral-decor-png-image_14790011.png" },
        { "name": "Bình Hoa Mây Tre Nghệ Thuật", "price": 210000, "image": "https://png.pngtree.com/png-vector/20241217/ourmid/pngtree-natural-rattan-vase-with-classic-design-and-dried-flowers-png-image_14790010.png" },
        { "name": "Bình Hoa Lúa Mì Thanh Nhã", "price": 200000, "image": "https://png.pngtree.com/png-vector/20240705/ourmid/pngtree-vase-of-wheat-on-black-background-png-image_12945289.png" },
        { "name": "Bình Hoa Lily Khô Cổ Điển", "price": 210000, "image": "https://png.pngtree.com/png-vector/20240515/ourmid/pngtree-charming-lily-ensemble-in-a-vase-png-image_12471683.png" },
        { "name": "Bình Hoa Nghệ Thuật Độc Đáo", "price": 220000, "image": "https://png.pngtree.com/png-vector/20240628/ourmid/pngtree-charming-vase-with-delicate-dried-flowers-png-image_12898703.png" },
        { "name": "Bình Hoa Thủ Công Sang Trọng", "price": 230000, "image": "https://png.pngtree.com/png-vector/20240628/ourmid/pngtree-artisanal-vase-arrangement-with-dried-flora-png-image_12898701.png" }
      ];
    generateProductRows(products);  // Gọi hàm tạo các dòng sản phẩm với dữ liệu giả lập
}
