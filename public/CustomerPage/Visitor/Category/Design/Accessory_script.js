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
        { "name": "Bình Sứ Trắng Nghệ Thuật", "price": 120000, "image": "https://www.napahomeandgarden.com/cdn/shop/files/N4SX05WH.jpg?v=1722291479" },
        { "name": "Giỏ Hoa Tre Đan Thủ Công", "price": 80000, "image": "https://png.pngtree.com/png-vector/20240814/ourmid/pngtree-woven-basket-with-handle-png-image_13478772.png" },
        { "name": "Bình Cắm Hoa Thủy Tinh Trong Suốt", "price": 150000, "image": "https://cdn.shopify.com/s/files/1/0708/1813/6385/files/Ro-Collection_Product-Image_Flower-Vase_no-24_Indigo-Blue_Pri.png?v=1731860509" },
        { "name": "Kẹp Hoa Gỗ Trang Trí", "price": 50000, "image": "https://m.media-amazon.com/images/I/61BMJZvmd0L._AC_UF1000,1000_QL80_.jpg" },
        { "name": "Dây Ruy Băng Lụa Màu Vàng", "price": 30000, "image": "https://images.ctfassets.net/f1fikihmjtrp/4mTj86LpCj2QFUpaXVh0En/3aa5f77e0f6c0cc3544a4f91bdb1776f/76002-9135-3-4ww.jpg?q=80&w=500&h=500&fit=pad" },
        { "name": "Giỏ Hoa Vintage Trang Trí", "price": 180000, "image": "https://png.pngtree.com/png-vector/20241030/ourmid/pngtree-basket-isolate-on-transparent-background-png-image_14181607.png" },
        { "name": "Bình Sứ Hoa Văn Sen Vàng", "price": 200000, "image": "https://m.media-amazon.com/images/I/51-0p3p-TyL.jpg" },
        { "name": "Hộp Hoa Handmade Hình Trái Tim", "price": 250000, "image": "https://www.fleur-box.com/wp-content/uploads/5-Paper-Covered-Heart-Boxes-S-600x600.png" },
        { "name": "Giá Đỡ Hoa Hồng Leo", "price": 70000, "image": "https://m.media-amazon.com/images/I/412myHcnWzS.jpg" },
        { "name": "Dây Đèn LED Trang Trí", "price": 120000, "image": "https://static.platform.michaels.com/2c-prd/16942488356576.jpg?fit=inside|540:540" }
      ]
      ;
    generateProductRows(products);  // Gọi hàm tạo các dòng sản phẩm với dữ liệu giả lập
}
