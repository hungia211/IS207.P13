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
        { name: "Hoa Hồng", price: 50000, image: "https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1623978394/vendor/8284/catalog/product/t/e/teleflora_s_dream_of_roses_60cb8f2456600._60cb8f273dee9..jpg" },
        { name: "Hoa Lan", price: 70000, image: "https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1705631438/vendor/7361/catalog/product/t/e/teleflora_s_happy_in_love_bouquet_5e3c60caa0f3e_5e3c60cce34c5.jpg" },
        { name: "Hoa Lan", price: 70000, image: "https://dynamic.zacdn.com/Zqz8YUlMQe5n65ME6ZN3oXhlmbw=/filters:quality(70):format(webp)/https://static-hk.zacdn.com/p/one-grocery-style-6396-7750976-1.jpg" },
        { name: "Hoa Lan", price: 70000, image: "https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1725569668/vendor/6397/catalog/product/2/0/20141107015442_file_545c2662756f8_28_1_41_1_138.jpg" },
        { name: "Hoa Lan", price: 70000, image: "https://asset.bloomnation.com/c_pad,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,q_auto/v1725569668/vendor/6397/catalog/product/2/0/20141107015442_file_545c2662756f8_28_1_41_1_138.jpg" }
    ];
    generateProductRows(products);  // Gọi hàm tạo các dòng sản phẩm với dữ liệu giả lập
}
